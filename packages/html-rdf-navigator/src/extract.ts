import {
  RDF_DIR_LANG_STRING,
  RDF_LANG_STRING,
  XSD_STRING,
  blankNode,
  namedNode,
  type BlankNode,
  type Diagnostic,
  type ExtractionResult,
  type GraphTerm,
  type Literal,
  type ObjectTerm,
  type Quad,
  type SubjectTerm,
  type TripleTerm,
} from "./model.js";

const CORE_ATTRIBUTES = new Set([
  "rdf-version",
  "rdf-subject",
  "rdf-subject-key",
  "rdf-predicate",
  "rdf-object-key",
  "rdf-datatype",
  "rdf-graph",
  "rdf-graph-key",
]);

const IRI_CARRIERS: Readonly<Record<string, readonly string[]>> = {
  a: ["href"],
  area: ["href"],
  link: ["href"],
  audio: ["src"],
  embed: ["src"],
  iframe: ["src"],
  img: ["src"],
  input: ["src", "formaction"],
  script: ["src"],
  source: ["src"],
  track: ["src"],
  video: ["src", "poster"],
  blockquote: ["cite"],
  del: ["cite"],
  ins: ["cite"],
  q: ["cite"],
  form: ["action"],
  button: ["formaction"],
  object: ["data"],
};

interface ExtractionContext {
  document: Document;
  sourceDocumentIri: string;
  baseIri: string;
  diagnostics: Diagnostic[];
  keys: Map<string, BlankNode>;
  elementNodes: WeakMap<Element, BlankNode>;
  nextBlank: number;
}

interface ParseStatementResult {
  subject: SubjectTerm;
  predicate: ReturnType<typeof namedNode>;
  object: ObjectTerm;
}

interface DocumentIris {
  retrievalDocumentIri: string;
  sourceDocumentIri: string;
  baseIri: string;
}

class InvalidStatement extends Error {
  constructor(
    readonly code: string,
    message: string,
  ) {
    super(message);
  }
}

function ownerDocument(root: Document | DocumentFragment): Document {
  if (root.nodeType === Node.DOCUMENT_NODE) return root as Document;
  const document = root.ownerDocument;
  if (!document) throw new Error("The extraction root has no owner document.");
  return document;
}

function hasLinkRelation(element: HTMLLinkElement, relation: string): boolean {
  return (element.getAttribute("rel") ?? "")
    .split(/[\t\n\f\r ]+/)
    .some((token) => token.toLowerCase() === relation);
}

function establishDocumentIris(doc: Document, diagnostics: Diagnostic[]): DocumentIris {
  const retrievalDocumentIri = doc.URL || doc.baseURI;
  const htmlBaseIri = doc.baseURI || retrievalDocumentIri;
  const canonicalLinks = Array.from(doc.head?.querySelectorAll<HTMLLinkElement>("link[rel][href]") ?? [])
    .filter((link) => hasLinkRelation(link, "canonical"));
  let sourceDocumentIri = retrievalDocumentIri;

  if (canonicalLinks.length > 1) {
    diagnostics.push({
      severity: "warning",
      code: "multiple-canonical-links",
      message: "More than one canonical link was declared; the retrieval IRI remains the source document IRI.",
      source: canonicalLinks[0]!,
    });
  } else if (canonicalLinks.length === 1) {
    const canonicalLink = canonicalLinks[0]!;
    try {
      const canonicalIri = new URL(canonicalLink.getAttribute("href") ?? "", htmlBaseIri).href;
      if (canonicalIri.includes("#")) {
        diagnostics.push({
          severity: "warning",
          code: "canonical-iri-has-fragment",
          message: "The canonical document IRI cannot contain a fragment; the retrieval IRI remains the source document IRI.",
          source: canonicalLink,
        });
      } else {
        sourceDocumentIri = canonicalIri;
      }
    } catch {
      diagnostics.push({
        severity: "warning",
        code: "invalid-canonical-iri",
        message: "The canonical link does not resolve to an absolute IRI; the retrieval IRI remains the source document IRI.",
        source: canonicalLink,
      });
    }
  }

  const hasExplicitBase = Boolean(doc.head?.querySelector("base[href]"));
  return {
    retrievalDocumentIri,
    sourceDocumentIri,
    baseIri: hasExplicitBase ? htmlBaseIri : sourceDocumentIri,
  };
}

function resolveIri(reference: string, ctx: ExtractionContext, subjectFragment = false): string {
  try {
    const base = subjectFragment && reference.startsWith("#") ? ctx.sourceDocumentIri : ctx.baseIri;
    const iri = new URL(reference, base).href;
    if (!/^[A-Za-z][A-Za-z0-9+.-]*:/.test(iri)) {
      throw new Error("The result is not absolute.");
    }
    return iri;
  } catch {
    throw new InvalidStatement("invalid-iri", `Cannot resolve IRI reference “${reference}”.`);
  }
}

function keyNode(key: string, ctx: ExtractionContext): BlankNode {
  if (!key || /[\t\n\f\r ]/.test(key)) {
    throw new InvalidStatement("invalid-key", "Local RDF keys must be non-empty and contain no ASCII whitespace.");
  }
  let node = ctx.keys.get(key);
  if (!node) {
    node = blankNode(`b${ctx.nextBlank++}`);
    ctx.keys.set(key, node);
  }
  return node;
}

function elementNode(element: Element, ctx: ExtractionContext): BlankNode {
  let node = ctx.elementNodes.get(element);
  if (!node) {
    node = blankNode(`b${ctx.nextBlank++}`);
    ctx.elementNodes.set(element, node);
  }
  return node;
}

function encodeFragment(value: string): string {
  return Array.from(value, (character) => {
    if (character === "%") return "%25";
    return encodeURIComponent(character).replace(/%[0-9a-f]{2}/gi, (octet) => octet.toUpperCase());
  }).join("");
}

function subjectFor(element: Element, ctx: ExtractionContext): SubjectTerm {
  const hasIri = element.hasAttribute("rdf-subject");
  const hasKey = element.hasAttribute("rdf-subject-key");
  if (hasIri && hasKey) {
    throw new InvalidStatement("competing-subjects", "A statement cannot carry both rdf-subject and rdf-subject-key.");
  }
  if (hasIri) {
    const value = element.getAttribute("rdf-subject") ?? "";
    return namedNode(resolveIri(value, ctx, true));
  }
  if (hasKey) return keyNode(element.getAttribute("rdf-subject-key") ?? "", ctx);

  const id = element.getAttribute("id");
  if (id) {
    const withoutFragment = ctx.sourceDocumentIri.replace(/#.*$/s, "");
    return namedNode(`${withoutFragment}#${encodeFragment(id)}`);
  }
  return elementNode(element, ctx);
}

function directTemplates(element: Element): HTMLTemplateElement[] {
  return Array.from(element.children).filter(
    (child): child is HTMLTemplateElement => child.localName === "template",
  );
}

function iriCarriers(element: Element): Array<{ attribute: string; value: string }> {
  const attributes = IRI_CARRIERS[element.localName] ?? [];
  return attributes.flatMap((attribute) => {
    const value = element.getAttribute(attribute);
    return value === null ? [] : [{ attribute, value }];
  });
}

function textWithoutTemplates(element: Element): string {
  const chunks: string[] = [];
  const visit = (node: Node): void => {
    if (node.nodeType === Node.TEXT_NODE) {
      chunks.push(node.nodeValue ?? "");
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    const child = node as Element;
    if (child.localName === "template") return;
    child.childNodes.forEach(visit);
  };
  element.childNodes.forEach(visit);
  return chunks.join("").replace(/[\t\n\f\r ]+/g, " ").replace(/^ | $/g, "");
}

function isLanguageTag(value: string): boolean {
  if (!/^[A-Za-z]{2,8}(?:-[A-Za-z0-9]{1,8})*$/.test(value)) return false;
  try {
    new Intl.Locale(value);
    return true;
  } catch {
    return false;
  }
}

function literalFor(element: Element, lexical: string, ctx: ExtractionContext): Literal {
  const datatype = element.getAttribute("rdf-datatype");
  const language = element.getAttribute("lang") ?? "";
  const directionSource = element.getAttribute("dir");
  const direction = directionSource?.toLowerCase();

  if (datatype !== null) {
    const datatypeIri = resolveIri(datatype, ctx);
    if (datatypeIri === RDF_LANG_STRING || datatypeIri === RDF_DIR_LANG_STRING) {
      throw new InvalidStatement("invalid-literal-metadata", "rdf-datatype cannot explicitly select an RDF language-string datatype.");
    }
    if (language || direction === "ltr" || direction === "rtl") {
      throw new InvalidStatement("competing-literal-metadata", "A typed literal cannot also carry RDF language or direction.");
    }
    return { termType: "Literal", value: lexical, datatype: namedNode(datatypeIri), language: "" };
  }

  if (directionSource !== null && direction !== "ltr" && direction !== "rtl" && direction !== "auto") {
    throw new InvalidStatement("invalid-direction", `Unsupported RDF base direction “${directionSource}”.`);
  }
  const rdfDirection = direction === "ltr" || direction === "rtl" ? direction : undefined;
  if (rdfDirection && !language) {
    throw new InvalidStatement("direction-without-language", "RDF base direction requires a non-empty language tag.");
  }
  if (language && !isLanguageTag(language)) {
    throw new InvalidStatement("invalid-language", `“${language}” is not a supported BCP 47 language tag.`);
  }
  if (language && rdfDirection) {
    return {
      termType: "Literal",
      value: lexical,
      datatype: namedNode(RDF_DIR_LANG_STRING),
      language,
      direction: rdfDirection,
    };
  }
  if (language) {
    return { termType: "Literal", value: lexical, datatype: namedNode(RDF_LANG_STRING), language };
  }
  return { termType: "Literal", value: lexical, datatype: namedNode(XSD_STRING), language: "" };
}

function parseTermTemplate(template: HTMLTemplateElement, ctx: ExtractionContext): TripleTerm {
  if (Array.from(template.attributes).some((attribute) => CORE_ATTRIBUTES.has(attribute.name))) {
    throw new InvalidStatement("annotated-term-template", "An object-position template cannot carry Core rdf-* attributes.");
  }
  const elementChildren = Array.from(template.content.children);
  const nonWhitespaceText = Array.from(template.content.childNodes).some(
    (node) => node.nodeType === Node.TEXT_NODE && /\S/.test(node.nodeValue ?? ""),
  );
  const statements = template.content.querySelectorAll("[rdf-predicate]");
  if (elementChildren.length !== 1 || nonWhitespaceText || statements.length !== 1) {
    throw new InvalidStatement("invalid-term-fragment", "A triple-term template must contain exactly one statement element and no other non-whitespace content.");
  }
  const inner = statements[0];
  if (!inner || inner !== elementChildren[0]) {
    throw new InvalidStatement("nested-term-statement", "The triple-term statement must be the template's sole top-level element.");
  }
  if (inner.hasAttribute("rdf-graph") || inner.hasAttribute("rdf-graph-key")) {
    throw new InvalidStatement("graphed-triple-term", "A triple term cannot carry graph membership.");
  }
  const parsed = parseStatement(inner, ctx);
  return { termType: "Triple", subject: parsed.subject, predicate: parsed.predicate, object: parsed.object };
}

function objectFor(element: Element, ctx: ExtractionContext): ObjectTerm {
  const templates = directTemplates(element);
  const hasKey = element.hasAttribute("rdf-object-key");
  const iris = iriCarriers(element);
  const literalCarrier =
    (element.localName === "meta" && element.hasAttribute("content")) ||
    (element.localName === "data" && element.hasAttribute("value")) ||
    (element.localName === "time" && element.hasAttribute("datetime"));

  const carrierCount = (templates.length ? 1 : 0) + (hasKey ? 1 : 0) + iris.length + (literalCarrier ? 1 : 0);
  if (templates.length > 1 || carrierCount > 1) {
    throw new InvalidStatement("competing-objects", "A statement must have exactly one unambiguous object carrier.");
  }

  if (templates.length === 1) {
    if (element.hasAttribute("rdf-datatype") || element.hasAttribute("lang") || element.hasAttribute("dir")) {
      throw new InvalidStatement("metadata-on-nonliteral", "Literal metadata cannot be applied to a triple-term object.");
    }
    return parseTermTemplate(templates[0]!, ctx);
  }
  if (hasKey) {
    if (element.hasAttribute("rdf-datatype") || element.hasAttribute("lang") || element.hasAttribute("dir")) {
      throw new InvalidStatement("metadata-on-nonliteral", "Literal metadata cannot be applied to a blank-node object.");
    }
    return keyNode(element.getAttribute("rdf-object-key") ?? "", ctx);
  }
  if (iris.length === 1) {
    if (element.hasAttribute("rdf-datatype") || element.hasAttribute("lang") || element.hasAttribute("dir")) {
      throw new InvalidStatement("metadata-on-nonliteral", "Literal metadata cannot be applied to an IRI object.");
    }
    return namedNode(resolveIri(iris[0]!.value, ctx));
  }

  let lexical: string;
  if (element.localName === "meta" && element.hasAttribute("content")) lexical = element.getAttribute("content") ?? "";
  else if (element.localName === "data" && element.hasAttribute("value")) lexical = element.getAttribute("value") ?? "";
  else if (element.localName === "time" && element.hasAttribute("datetime")) lexical = element.getAttribute("datetime") ?? "";
  else {
    if (element.querySelector("[rdf-predicate]")) {
      throw new InvalidStatement("nested-statement-in-literal", "A text literal carrier cannot contain another asserted statement.");
    }
    lexical = textWithoutTemplates(element);
  }
  return literalFor(element, lexical, ctx);
}

function parseStatement(element: Element, ctx: ExtractionContext): ParseStatementResult {
  const predicateValue = element.getAttribute("rdf-predicate");
  if (predicateValue === null) throw new InvalidStatement("missing-predicate", "The statement has no rdf-predicate.");
  return {
    subject: subjectFor(element, ctx),
    predicate: namedNode(resolveIri(predicateValue, ctx)),
    object: objectFor(element, ctx),
  };
}

function graphFor(element: Element, ctx: ExtractionContext): GraphTerm | null {
  const iri = element.getAttribute("rdf-graph");
  const key = element.getAttribute("rdf-graph-key");
  if (iri !== null && key !== null) {
    throw new InvalidStatement("competing-graphs", "An RDF statement cannot carry both rdf-graph and rdf-graph-key.");
  }
  if (iri !== null) return namedNode(resolveIri(iri, ctx));
  if (key !== null) return keyNode(key, ctx);
  return null;
}

function report(ctx: ExtractionContext, error: unknown, source: Element): void {
  const invalid = error instanceof InvalidStatement ? error : new InvalidStatement("extractor-error", String(error));
  ctx.diagnostics.push({ severity: "error", code: invalid.code, message: invalid.message, source });
}

function graphKey(graph: GraphTerm): string {
  return `${graph.termType}:${graph.value}`;
}

/** Extract the IA2 Core 0.1 RDF dataset represented by a document or fragment. */
export function extractDataset(root: Document | DocumentFragment = document): ExtractionResult {
  const doc = ownerDocument(root);
  const diagnostics: Diagnostic[] = [];
  const { retrievalDocumentIri, sourceDocumentIri, baseIri } = establishDocumentIris(doc, diagnostics);
  const ctx: ExtractionContext = {
    document: doc,
    sourceDocumentIri,
    baseIri,
    diagnostics,
    keys: new Map(),
    elementNodes: new WeakMap(),
    nextBlank: 0,
  };

  const html = doc.documentElement;
  const version = html?.getAttribute("rdf-version");
  if (version === null) {
    ctx.diagnostics.push({ severity: "warning", code: "missing-version", message: "No rdf-version was declared; IA2 Core 0.1 defaults to RDF 1.2." });
  } else if (version !== "1.2") {
    ctx.diagnostics.push({ severity: "error", code: "unsupported-version", message: `Unsupported rdf-version “${version}”.` });
    return { version: "1.2", quads: [], graphs: [], diagnostics: ctx.diagnostics, retrievalDocumentIri, sourceDocumentIri, baseIri };
  }

  const quads: Quad[] = [];
  const graphs = new Map<string, GraphTerm>();

  root.querySelectorAll("[rdf-predicate]").forEach((element) => {
    try {
      const parsed = parseStatement(element, ctx);
      const graph = graphFor(element, ctx);
      quads.push({ ...parsed, graph, source: element });
      if (graph) graphs.set(graphKey(graph), graph);
    } catch (error) {
      report(ctx, error, element);
    }
  });

  root.querySelectorAll("[rdf-graph]:not([rdf-predicate]), [rdf-graph-key]:not([rdf-predicate])").forEach((element) => {
    const parent = element.parentElement;
    if (element.localName === "template" && parent?.hasAttribute("rdf-predicate") && directTemplates(parent).includes(element as HTMLTemplateElement)) return;
    try {
      const coreAttributes = Array.from(element.attributes).filter((attribute) => CORE_ATTRIBUTES.has(attribute.name));
      if (coreAttributes.length !== 1) {
        throw new InvalidStatement("invalid-graph-declaration", "A graph declaration can carry exactly one graph attribute and no other Core rdf-* attribute.");
      }
      const graph = graphFor(element, ctx);
      if (!graph) throw new InvalidStatement("missing-graph", "The graph declaration has no graph name.");
      graphs.set(graphKey(graph), graph);
    } catch (error) {
      report(ctx, error, element);
    }
  });

  doc.querySelectorAll("[rdf-version]:not(html)").forEach((source) => {
    ctx.diagnostics.push({ severity: "warning", code: "misplaced-version", message: "rdf-version only has processing effect on the html element.", source });
  });

  return {
    version: "1.2",
    quads,
    graphs: Array.from(graphs.values()),
    diagnostics: ctx.diagnostics,
    retrievalDocumentIri,
    sourceDocumentIri,
    baseIri,
  };
}
