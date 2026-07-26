// src/model.ts
var namedNode = (value) => ({ termType: "NamedNode", value });
var blankNode = (value) => ({ termType: "BlankNode", value });
var XSD_STRING = "http://www.w3.org/2001/XMLSchema#string";
var RDF_LANG_STRING = "http://www.w3.org/1999/02/22-rdf-syntax-ns#langString";
var RDF_DIR_LANG_STRING = "http://www.w3.org/1999/02/22-rdf-syntax-ns#dirLangString";

// src/extract.ts
var CORE_ATTRIBUTES = /* @__PURE__ */ new Set([
  "rdf-version",
  "rdf-subject",
  "rdf-subject-key",
  "rdf-predicate",
  "rdf-object-key",
  "rdf-datatype",
  "rdf-graph",
  "rdf-graph-key"
]);
var IRI_CARRIERS = {
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
  object: ["data"]
};
var InvalidStatement = class extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
};
function ownerDocument(root) {
  if (root.nodeType === Node.DOCUMENT_NODE) return root;
  const document2 = root.ownerDocument;
  if (!document2) throw new Error("The extraction root has no owner document.");
  return document2;
}
function hasLinkRelation(element, relation) {
  return (element.getAttribute("rel") ?? "").split(/[\t\n\f\r ]+/).some((token) => token.toLowerCase() === relation);
}
function establishDocumentIris(doc, diagnostics) {
  const retrievalDocumentIri = doc.URL || doc.baseURI;
  const htmlBaseIri = doc.baseURI || retrievalDocumentIri;
  const canonicalLinks = Array.from(doc.head?.querySelectorAll("link[rel][href]") ?? []).filter((link) => hasLinkRelation(link, "canonical"));
  let sourceDocumentIri = retrievalDocumentIri;
  if (canonicalLinks.length > 1) {
    diagnostics.push({
      severity: "warning",
      code: "multiple-canonical-links",
      message: "More than one canonical link was declared; the retrieval IRI remains the source document IRI.",
      source: canonicalLinks[0]
    });
  } else if (canonicalLinks.length === 1) {
    const canonicalLink = canonicalLinks[0];
    try {
      const canonicalIri = new URL(canonicalLink.getAttribute("href") ?? "", htmlBaseIri).href;
      if (canonicalIri.includes("#")) {
        diagnostics.push({
          severity: "warning",
          code: "canonical-iri-has-fragment",
          message: "The canonical document IRI cannot contain a fragment; the retrieval IRI remains the source document IRI.",
          source: canonicalLink
        });
      } else {
        sourceDocumentIri = canonicalIri;
      }
    } catch {
      diagnostics.push({
        severity: "warning",
        code: "invalid-canonical-iri",
        message: "The canonical link does not resolve to an absolute IRI; the retrieval IRI remains the source document IRI.",
        source: canonicalLink
      });
    }
  }
  const hasExplicitBase = Boolean(doc.head?.querySelector("base[href]"));
  return {
    retrievalDocumentIri,
    sourceDocumentIri,
    baseIri: hasExplicitBase ? htmlBaseIri : sourceDocumentIri
  };
}
function resolveIri(reference, ctx, subjectFragment = false) {
  try {
    const base = subjectFragment && reference.startsWith("#") ? ctx.sourceDocumentIri : ctx.baseIri;
    const iri2 = new URL(reference, base).href;
    if (!/^[A-Za-z][A-Za-z0-9+.-]*:/.test(iri2)) {
      throw new Error("The result is not absolute.");
    }
    return iri2;
  } catch {
    throw new InvalidStatement("invalid-iri", `Cannot resolve IRI reference \u201C${reference}\u201D.`);
  }
}
function keyNode(key, ctx) {
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
function elementNode(element, ctx) {
  let node = ctx.elementNodes.get(element);
  if (!node) {
    node = blankNode(`b${ctx.nextBlank++}`);
    ctx.elementNodes.set(element, node);
  }
  return node;
}
function encodeFragment(value) {
  return Array.from(value, (character) => {
    if (character === "%") return "%25";
    return encodeURIComponent(character).replace(/%[0-9a-f]{2}/gi, (octet) => octet.toUpperCase());
  }).join("");
}
function subjectFor(element, ctx) {
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
function directTemplates(element) {
  return Array.from(element.children).filter(
    (child) => child.localName === "template"
  );
}
function iriCarriers(element) {
  const attributes = IRI_CARRIERS[element.localName] ?? [];
  return attributes.flatMap((attribute) => {
    const value = element.getAttribute(attribute);
    return value === null ? [] : [{ attribute, value }];
  });
}
function textWithoutTemplates(element) {
  const chunks = [];
  const visit = (node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      chunks.push(node.nodeValue ?? "");
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    const child = node;
    if (child.localName === "template") return;
    child.childNodes.forEach(visit);
  };
  element.childNodes.forEach(visit);
  return chunks.join("").replace(/[\t\n\f\r ]+/g, " ").replace(/^ | $/g, "");
}
function isLanguageTag(value) {
  if (!/^[A-Za-z]{2,8}(?:-[A-Za-z0-9]{1,8})*$/.test(value)) return false;
  try {
    new Intl.Locale(value);
    return true;
  } catch {
    return false;
  }
}
function literalFor(element, lexical, ctx) {
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
    throw new InvalidStatement("invalid-direction", `Unsupported RDF base direction \u201C${directionSource}\u201D.`);
  }
  const rdfDirection = direction === "ltr" || direction === "rtl" ? direction : void 0;
  if (rdfDirection && !language) {
    throw new InvalidStatement("direction-without-language", "RDF base direction requires a non-empty language tag.");
  }
  if (language && !isLanguageTag(language)) {
    throw new InvalidStatement("invalid-language", `\u201C${language}\u201D is not a supported BCP 47 language tag.`);
  }
  if (language && rdfDirection) {
    return {
      termType: "Literal",
      value: lexical,
      datatype: namedNode(RDF_DIR_LANG_STRING),
      language,
      direction: rdfDirection
    };
  }
  if (language) {
    return { termType: "Literal", value: lexical, datatype: namedNode(RDF_LANG_STRING), language };
  }
  return { termType: "Literal", value: lexical, datatype: namedNode(XSD_STRING), language: "" };
}
function parseTermTemplate(template, ctx) {
  if (Array.from(template.attributes).some((attribute) => CORE_ATTRIBUTES.has(attribute.name))) {
    throw new InvalidStatement("annotated-term-template", "An object-position template cannot carry Core rdf-* attributes.");
  }
  const elementChildren = Array.from(template.content.children);
  const nonWhitespaceText = Array.from(template.content.childNodes).some(
    (node) => node.nodeType === Node.TEXT_NODE && /\S/.test(node.nodeValue ?? "")
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
function objectFor(element, ctx) {
  const templates = directTemplates(element);
  const hasKey = element.hasAttribute("rdf-object-key");
  const iris = iriCarriers(element);
  const literalCarrier = element.localName === "meta" && element.hasAttribute("content") || element.localName === "data" && element.hasAttribute("value") || element.localName === "time" && element.hasAttribute("datetime");
  const carrierCount = (templates.length ? 1 : 0) + (hasKey ? 1 : 0) + iris.length + (literalCarrier ? 1 : 0);
  if (templates.length > 1 || carrierCount > 1) {
    throw new InvalidStatement("competing-objects", "A statement must have exactly one unambiguous object carrier.");
  }
  if (templates.length === 1) {
    if (element.hasAttribute("rdf-datatype") || element.hasAttribute("lang") || element.hasAttribute("dir")) {
      throw new InvalidStatement("metadata-on-nonliteral", "Literal metadata cannot be applied to a triple-term object.");
    }
    return parseTermTemplate(templates[0], ctx);
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
    return namedNode(resolveIri(iris[0].value, ctx));
  }
  let lexical;
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
function parseStatement(element, ctx) {
  const predicateValue = element.getAttribute("rdf-predicate");
  if (predicateValue === null) throw new InvalidStatement("missing-predicate", "The statement has no rdf-predicate.");
  return {
    subject: subjectFor(element, ctx),
    predicate: namedNode(resolveIri(predicateValue, ctx)),
    object: objectFor(element, ctx)
  };
}
function graphFor(element, ctx) {
  const iri2 = element.getAttribute("rdf-graph");
  const key = element.getAttribute("rdf-graph-key");
  if (iri2 !== null && key !== null) {
    throw new InvalidStatement("competing-graphs", "An RDF statement cannot carry both rdf-graph and rdf-graph-key.");
  }
  if (iri2 !== null) return namedNode(resolveIri(iri2, ctx));
  if (key !== null) return keyNode(key, ctx);
  return null;
}
function report(ctx, error, source) {
  const invalid = error instanceof InvalidStatement ? error : new InvalidStatement("extractor-error", String(error));
  ctx.diagnostics.push({ severity: "error", code: invalid.code, message: invalid.message, source });
}
function graphKey(graph) {
  return `${graph.termType}:${graph.value}`;
}
function extractDataset(root = document) {
  const doc = ownerDocument(root);
  const diagnostics = [];
  const { retrievalDocumentIri, sourceDocumentIri, baseIri } = establishDocumentIris(doc, diagnostics);
  const ctx = {
    document: doc,
    sourceDocumentIri,
    baseIri,
    diagnostics,
    keys: /* @__PURE__ */ new Map(),
    elementNodes: /* @__PURE__ */ new WeakMap(),
    nextBlank: 0
  };
  const html = doc.documentElement;
  const version = html?.getAttribute("rdf-version");
  if (version === null) {
    ctx.diagnostics.push({ severity: "warning", code: "missing-version", message: "No rdf-version was declared; IA2 Core 0.1 defaults to RDF 1.2." });
  } else if (version !== "1.2") {
    ctx.diagnostics.push({ severity: "error", code: "unsupported-version", message: `Unsupported rdf-version \u201C${version}\u201D.` });
    return { version: "1.2", quads: [], graphs: [], diagnostics: ctx.diagnostics, retrievalDocumentIri, sourceDocumentIri, baseIri };
  }
  const quads = [];
  const graphs = /* @__PURE__ */ new Map();
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
    if (element.localName === "template" && parent?.hasAttribute("rdf-predicate") && directTemplates(parent).includes(element)) return;
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
    baseIri
  };
}

// src/serialize.ts
var PREFIXES = {
  rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
  rdfs: "http://www.w3.org/2000/01/rdf-schema#",
  owl: "http://www.w3.org/2002/07/owl#",
  xsd: "http://www.w3.org/2001/XMLSchema#",
  schema: "https://schema.org/",
  dcterms: "http://purl.org/dc/terms/",
  dcat: "http://www.w3.org/ns/dcat#",
  skos: "http://www.w3.org/2004/02/skos/core#",
  prov: "http://www.w3.org/ns/prov#",
  odrl: "http://www.w3.org/ns/odrl/2/",
  sh: "http://www.w3.org/ns/shacl#",
  c4o: "http://purl.org/spar/c4o/",
  cito: "http://purl.org/spar/cito/",
  deo: "http://purl.org/spar/deo/",
  doco: "http://purl.org/spar/doco/",
  pattern: "http://www.essepuntato.it/2008/12/pattern#",
  decision: "https://ontology.inferal.com/modules/decision/",
  ord: "https://ontology.inferal.com/modules/ordering/",
  htmlrdf: "https://ia2.dev/spec/html-rdf#",
  rdfhtml: "https://ia2.dev/spec/rdf-html#",
  de: "https://ia2.dev/spec/discovery-enrichment#"
};
function escaped(value) {
  return value.replace(/\\/g, "\\\\").replace(/\"/g, '\\"').replace(/\r/g, "\\r").replace(/\n/g, "\\n").replace(/\t/g, "\\t");
}
function prefixed(iri2) {
  for (const [prefix, namespace] of Object.entries(PREFIXES)) {
    if (!iri2.startsWith(namespace)) continue;
    const local = iri2.slice(namespace.length);
    if (/^[A-Za-z_][A-Za-z0-9._-]*$/.test(local)) return `${prefix}:${local}`;
  }
  return null;
}
function iri(iriValue) {
  return prefixed(iriValue) ?? `<${iriValue.replace(/>/g, "\\>")}>`;
}
function literal(term) {
  const lexical = `"${escaped(term.value)}"`;
  if (term.language && term.direction) return `${lexical}@${term.language}--${term.direction}`;
  if (term.language) return `${lexical}@${term.language}`;
  if (term.datatype.value !== XSD_STRING && term.datatype.value !== RDF_LANG_STRING && term.datatype.value !== RDF_DIR_LANG_STRING) {
    return `${lexical}^^${iri(term.datatype.value)}`;
  }
  return lexical;
}
function termToTurtle(term) {
  switch (term.termType) {
    case "NamedNode":
      return iri(term.value);
    case "BlankNode":
      return `_:${term.value}`;
    case "Literal":
      return literal(term);
    case "Triple":
      return `<<( ${termToTurtle(term.subject)} ${termToTurtle(term.predicate)} ${termToTurtle(term.object)} )>>`;
  }
}
function graphId(graph) {
  return graph ? `${graph.termType}:${graph.value}` : "default";
}
function serializeTurtle(result) {
  const body = [];
  const defaults = result.quads.filter((quad) => quad.graph === null);
  body.push(...defaults.map((quad) => `${termToTurtle(quad.subject)} ${termToTurtle(quad.predicate)} ${termToTurtle(quad.object)} .`));
  const namedGraphs = /* @__PURE__ */ new Map();
  for (const graph of result.graphs) namedGraphs.set(graphId(graph), { graph, quads: [] });
  for (const quad of result.quads) {
    if (!quad.graph) continue;
    const entry = namedGraphs.get(graphId(quad.graph)) ?? { graph: quad.graph, quads: [] };
    entry.quads.push(quad);
    namedGraphs.set(graphId(quad.graph), entry);
  }
  for (const { graph, quads } of namedGraphs.values()) {
    if (body.length && body.at(-1) !== "") body.push("");
    body.push(`${termToTurtle(graph)} {`);
    body.push(...quads.map((quad) => `  ${termToTurtle(quad.subject)} ${termToTurtle(quad.predicate)} ${termToTurtle(quad.object)} .`));
    body.push("}");
  }
  const usedPrefixes = Object.entries(PREFIXES).filter(([prefix]) => body.some((line) => line.includes(`${prefix}:`)));
  const output = usedPrefixes.map(([prefix, namespace]) => `@prefix ${prefix}: <${namespace}> .`);
  if (output.length && body.length) output.push("");
  output.push(...body);
  return `${output.join("\n").trim()}
`;
}
function jsonTerm(term) {
  if (term.termType === "NamedNode") return { "@id": term.value };
  if (term.termType === "BlankNode") return { "@id": `_:${term.value}` };
  if (term.termType === "Literal") {
    const value = { "@value": term.value };
    if (term.language) value["@language"] = term.language;
    if (term.direction) value["@direction"] = term.direction;
    if (!term.language && term.datatype.value !== XSD_STRING) value["@type"] = term.datatype.value;
    return value;
  }
  return {
    "@type": "@json",
    "@value": {
      type: "RDF12TripleTerm",
      subject: jsonTerm(term.subject),
      predicate: term.predicate.value,
      object: jsonTerm(term.object)
    }
  };
}
function subjectId(subject) {
  return subject.termType === "NamedNode" ? subject.value : `_:${subject.value}`;
}
function graphJson(quads) {
  const nodes = /* @__PURE__ */ new Map();
  for (const quad of quads) {
    const id = subjectId(quad.subject);
    const node = nodes.get(id) ?? { "@id": id };
    const values = node[quad.predicate.value] ?? [];
    values.push(jsonTerm(quad.object));
    node[quad.predicate.value] = values;
    nodes.set(id, node);
  }
  return Array.from(nodes.values());
}
function serializeJsonLd(result) {
  const output = graphJson(result.quads.filter((quad) => quad.graph === null));
  const graphs = /* @__PURE__ */ new Map();
  for (const graph of result.graphs) graphs.set(graphId(graph), { graph, quads: [] });
  for (const quad of result.quads) {
    if (!quad.graph) continue;
    const entry = graphs.get(graphId(quad.graph)) ?? { graph: quad.graph, quads: [] };
    entry.quads.push(quad);
    graphs.set(graphId(quad.graph), entry);
  }
  for (const { graph, quads } of graphs.values()) {
    output.push({
      "@id": graph.termType === "NamedNode" ? graph.value : `_:${graph.value}`,
      "@graph": graphJson(quads)
    });
  }
  return `${JSON.stringify(output, null, 2)}
`;
}
function containsTripleTerms(result) {
  return result.quads.some((quad) => quad.object.termType === "Triple");
}
function compactTerm(term) {
  const turtle = termToTurtle(term);
  return turtle.length > 76 ? `${turtle.slice(0, 73)}\u2026` : turtle;
}

// src/semantics.ts
var HTML_RDF_DATASET_CHANGE_EVENT = "ia2-rdf-dataset-change";
var DEFAULT_LABEL_PREDICATES = [
  "http://www.w3.org/2000/01/rdf-schema#label",
  "http://www.w3.org/2004/02/skos/core#prefLabel",
  "http://purl.org/dc/terms/title",
  "https://schema.org/name"
];
var OA_HAS_BODY = "http://www.w3.org/ns/oa#hasBody";
var OA_HAS_SOURCE = "http://www.w3.org/ns/oa#hasSource";
var OA_HAS_TARGET = "http://www.w3.org/ns/oa#hasTarget";
function sameResource(left, right) {
  return (left.termType === "NamedNode" || left.termType === "BlankNode") && left.termType === right.termType && left.value === right.value;
}
function resourceTerm(value) {
  return typeof value === "string" ? { termType: "NamedNode", value } : value;
}
function labelFor(quads, resource, options = {}) {
  const subject = resourceTerm(resource);
  const predicates = options.predicates ?? DEFAULT_LABEL_PREDICATES;
  const languages = options.languages?.map((language) => language.toLowerCase()) ?? [];
  for (const predicate of predicates) {
    const candidates = quads.filter((quad) => sameResource(quad.subject, subject) && quad.predicate.value === predicate && quad.object.termType === "Literal");
    for (const language of languages) {
      const match = candidates.find(({ object }) => object.termType === "Literal" && object.language.toLowerCase() === language);
      if (match?.object.termType === "Literal") return match.object.value;
    }
    const languageNeutral = candidates.find(({ object }) => object.termType === "Literal" && !object.language);
    if (languageNeutral?.object.termType === "Literal") return languageNeutral.object.value;
    const first = candidates[0]?.object;
    if (first?.termType === "Literal") return first.value;
  }
  return void 0;
}
function labelMap(quads, options = {}) {
  const labels = termLabelMap(quads, options);
  return new Map(Array.from(labels).flatMap(([key, label]) => key.startsWith("NamedNode:") ? [[key.slice("NamedNode:".length), label]] : []));
}
function termLabelMap(quads, options = {}) {
  const predicates = options.predicates ?? DEFAULT_LABEL_PREDICATES;
  const predicateRanks = new Map(predicates.map((predicate, index) => [predicate, index]));
  const languages = options.languages?.map((language) => language.toLowerCase()) ?? [];
  const languageRanks = new Map(languages.map((language, index) => [language, index]));
  const fallbackLanguageRank = languages.length;
  const otherLanguageRank = fallbackLanguageRank + 1;
  const resources = /* @__PURE__ */ new Set();
  const candidates = /* @__PURE__ */ new Map();
  quads.forEach((quad, sourceRank) => {
    const key = `${quad.subject.termType}:${quad.subject.value}`;
    resources.add(key);
    if (quad.object.termType !== "Literal") return;
    const predicateRank = predicateRanks.get(quad.predicate.value);
    if (predicateRank === void 0) return;
    const language = quad.object.language.toLowerCase();
    const languageRank = languageRanks.get(language) ?? (language ? otherLanguageRank : fallbackLanguageRank);
    const candidate = { languageRank, predicateRank, sourceRank, value: quad.object.value };
    const current = candidates.get(key);
    if (!current || predicateRank < current.predicateRank || predicateRank === current.predicateRank && (languageRank < current.languageRank || languageRank === current.languageRank && sourceRank < current.sourceRank)) {
      candidates.set(key, candidate);
    }
  });
  const labels = /* @__PURE__ */ new Map();
  for (const key of resources) {
    const candidate = candidates.get(key);
    if (candidate) labels.set(key, candidate.value);
  }
  return labels;
}
function annotationTargetIris(quads, body) {
  const bodyTerm = resourceTerm(body);
  const annotations = quads.flatMap((quad) => quad.predicate.value === OA_HAS_BODY && sameResource(quad.object, bodyTerm) ? [quad.subject] : []);
  return Array.from(new Set(annotations.flatMap((annotation) => annotationTargetIrisForAnnotation(quads, annotation))));
}
function annotationTargetIrisForAnnotation(quads, annotation) {
  const annotationTerm = resourceTerm(annotation);
  const targets = quads.flatMap((quad) => sameResource(quad.subject, annotationTerm) && quad.predicate.value === OA_HAS_TARGET && (quad.object.termType === "NamedNode" || quad.object.termType === "BlankNode") ? [quad.object] : []);
  return Array.from(new Set(targets.flatMap((target) => {
    const sources = quads.flatMap((quad) => sameResource(quad.subject, target) && quad.predicate.value === OA_HAS_SOURCE && quad.object.termType === "NamedNode" ? [quad.object.value] : []);
    if (sources.length > 0) return sources;
    return target.termType === "NamedNode" ? [target.value] : [];
  })));
}
function selectedGraph(graph, selected) {
  if (!graph) return selected.includes(null);
  return selected.includes(graph.value);
}
function projectQuadsToDefaultGraph(quads, options = {}) {
  const selected = options.graphs;
  return quads.filter((quad) => !selected || selectedGraph(quad.graph, selected)).map((quad) => ({ ...quad, graph: null }));
}
function namedResource(value) {
  return { termType: "NamedNode", value };
}

// src/rdfjs.ts
function toRdfJsTerm(term, factory) {
  if (term.termType === "NamedNode") return factory.namedNode(term.value);
  if (term.termType === "BlankNode") return factory.blankNode(term.value);
  if (term.termType === "Literal") return toRdfJsLiteral(term, factory);
  return toRdfJsTriple(term, factory);
}
function toRdfJsLiteral(term, factory) {
  if (term.language || term.direction) {
    return factory.literal(term.value, {
      language: term.language,
      ...term.direction ? { direction: term.direction } : {}
    });
  }
  return factory.literal(term.value, factory.namedNode(term.datatype.value));
}
function toRdfJsTriple(term, factory) {
  return factory.quad(
    toRdfJsTerm(term.subject, factory),
    factory.namedNode(term.predicate.value),
    toRdfJsTerm(term.object, factory)
  );
}
function toRdfJsGraph(term, factory) {
  return term ? toRdfJsTerm(term, factory) : factory.defaultGraph();
}
function toRdfJsQuad(quad, factory) {
  return factory.quad(
    toRdfJsTerm(quad.subject, factory),
    factory.namedNode(quad.predicate.value),
    toRdfJsTerm(quad.object, factory),
    toRdfJsGraph(quad.graph, factory)
  );
}
function toRdfJsDataset(quads, factory, datasetFactory) {
  return datasetFactory.dataset(quads.map((quad) => toRdfJsQuad(quad, factory)));
}
export {
  DEFAULT_LABEL_PREDICATES,
  HTML_RDF_DATASET_CHANGE_EVENT,
  PREFIXES,
  RDF_DIR_LANG_STRING,
  RDF_LANG_STRING,
  XSD_STRING,
  annotationTargetIris,
  annotationTargetIrisForAnnotation,
  blankNode,
  compactTerm,
  containsTripleTerms,
  extractDataset,
  labelFor,
  labelMap,
  namedNode,
  namedResource,
  projectQuadsToDefaultGraph,
  serializeJsonLd,
  serializeTurtle,
  termLabelMap,
  termToTurtle,
  toRdfJsDataset,
  toRdfJsLiteral,
  toRdfJsQuad,
  toRdfJsTerm
};
