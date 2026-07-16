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

// src/highlight.ts
var TURTLE_TOKENS = /(<https?:\/\/[^>]+>)|("(?:\\.|[^"\\])*"(?:@[A-Za-z0-9-]+(?:--(?:ltr|rtl))?|\^\^(?:<[^>]+>|[A-Za-z][\w-]*:[\w.-]+))?)|(^|\s)(@[a-z]+|[A-Za-z][\w-]*:[\w.-]+)|(_:[A-Za-z][\w-]*)|(#[^\n]*)/gim;
var JSON_TOKENS = /("(?:\\.|[^"\\])*")\s*(?=:)|("(?:\\.|[^"\\])*")|\b(true|false|null)\b|\b(-?\d+(?:\.\d+)?)\b/g;
function spanToken(parent, value, className, document2) {
  const span = document2.createElement("span");
  span.className = `tok ${className}`;
  span.textContent = value;
  parent.appendChild(span);
}
function appendToken(parent, value, className, document2) {
  if (className === "iri") {
    const iri2 = value.slice(1, -1);
    const anchor = document2.createElement("a");
    anchor.className = "tok iri";
    anchor.textContent = value;
    anchor.href = iri2;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    parent.appendChild(anchor);
    return;
  }
  spanToken(parent, value, className, document2);
}
function turtleClass(match) {
  if (match[1]) return "iri";
  if (match[2]) return "string";
  if (match[4]) return "keyword";
  if (match[5]) return "blank";
  if (match[6]) return "comment";
  return "name";
}
function jsonClass(match) {
  if (match[1]) return "key";
  if (match[2]) {
    try {
      const value = JSON.parse(match[2]);
      if (/^https?:\/\//.test(value)) return "json-iri";
    } catch {
    }
    return "string";
  }
  if (match[3]) return "keyword";
  return "number";
}
function appendHtmlTag(parent, source, document2) {
  if (source.startsWith("<!--")) {
    spanToken(parent, source, "comment", document2);
    return;
  }
  if (/^<!doctype/i.test(source)) {
    spanToken(parent, source, "keyword", document2);
    return;
  }
  const tag = /^(<\/?)([^\s/>]+)([\s\S]*?)(\/?>)$/.exec(source);
  if (!tag) {
    parent.appendChild(document2.createTextNode(source));
    return;
  }
  spanToken(parent, tag[1], "punctuation", document2);
  spanToken(parent, tag[2], "name", document2);
  const attributes = tag[3] ?? "";
  const pattern = /(\s+)([^\s=]+)(?:(\s*=\s*)("[^"]*"|'[^']*'|[^\s]+))?/g;
  let cursor = 0;
  let match;
  while (match = pattern.exec(attributes)) {
    parent.appendChild(document2.createTextNode(attributes.slice(cursor, match.index) + match[1]));
    spanToken(parent, match[2], "key", document2);
    if (match[3]) parent.appendChild(document2.createTextNode(match[3]));
    if (match[4]) spanToken(parent, match[4], "string", document2);
    cursor = pattern.lastIndex;
  }
  parent.appendChild(document2.createTextNode(attributes.slice(cursor)));
  spanToken(parent, tag[4], "punctuation", document2);
}
function highlightHtml(source, parent, document2) {
  let cursor = 0;
  while (cursor < source.length) {
    const start = source.indexOf("<", cursor);
    if (start < 0) {
      parent.appendChild(document2.createTextNode(source.slice(cursor)));
      return;
    }
    parent.appendChild(document2.createTextNode(source.slice(cursor, start)));
    if (source.startsWith("<!--", start)) {
      const commentEnd = source.indexOf("-->", start + 4);
      const end2 = commentEnd < 0 ? source.length : commentEnd + 3;
      appendHtmlTag(parent, source.slice(start, end2), document2);
      cursor = end2;
      continue;
    }
    let quote = "";
    let end = start + 1;
    for (; end < source.length; end += 1) {
      const character = source[end];
      if (quote) {
        if (character === quote) quote = "";
      } else if (character === '"' || character === "'") {
        quote = character;
      } else if (character === ">") {
        end += 1;
        break;
      }
    }
    appendHtmlTag(parent, source.slice(start, end), document2);
    cursor = end;
  }
}
function highlightedCode(source, syntax, document2) {
  const pre = document2.createElement("pre");
  const code = document2.createElement("code");
  pre.append(code);
  if (syntax === "html") {
    highlightHtml(source, code, document2);
    return pre;
  }
  const pattern = syntax === "turtle" ? new RegExp(TURTLE_TOKENS) : new RegExp(JSON_TOKENS);
  let cursor = 0;
  let match;
  while (match = pattern.exec(source)) {
    code.append(document2.createTextNode(source.slice(cursor, match.index)));
    const className = syntax === "turtle" ? turtleClass(match) : jsonClass(match);
    if (className === "json-iri") {
      const anchor = document2.createElement("a");
      anchor.className = "tok iri";
      anchor.textContent = match[0];
      anchor.href = JSON.parse(match[0]);
      anchor.target = "_blank";
      anchor.rel = "noopener noreferrer";
      code.append(anchor);
    } else {
      appendToken(code, match[0], className, document2);
    }
    cursor = pattern.lastIndex;
  }
  code.append(document2.createTextNode(source.slice(cursor)));
  return pre;
}

// src/serialize.ts
var PREFIXES = {
  rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
  rdfs: "http://www.w3.org/2000/01/rdf-schema#",
  owl: "http://www.w3.org/2002/07/owl#",
  xsd: "http://www.w3.org/2001/XMLSchema#",
  schema: "https://schema.org/",
  dcterms: "http://purl.org/dc/terms/",
  skos: "http://www.w3.org/2004/02/skos/core#",
  prov: "http://www.w3.org/ns/prov#",
  sh: "http://www.w3.org/ns/shacl#",
  c4o: "http://purl.org/spar/c4o/",
  cito: "http://purl.org/spar/cito/",
  deo: "http://purl.org/spar/deo/",
  doco: "http://purl.org/spar/doco/",
  pattern: "http://www.essepuntato.it/2008/12/pattern#",
  decision: "https://ontology.inferal.com/modules/decision/"
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

// src/navigator.ts
var CSS = String.raw`
  :host {
    --ink: oklch(27% 0.018 286);
    --muted: oklch(52% 0.018 286);
    --paper: oklch(98.4% 0.007 286);
    --layer: oklch(95.5% 0.012 286);
    --line: oklch(86% 0.018 286);
    --accent: oklch(55% 0.17 294);
    --accent-soft: oklch(93% 0.035 294);
    --warning: oklch(64% 0.15 67);
    color: var(--ink);
    font: 400 14px/1.5 -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
    position: fixed;
    z-index: 2147483000;
  }
  *, *::before, *::after { box-sizing: border-box; }
  [hidden] { display: none !important; }
  button { font: inherit; }
  .launcher {
    align-items: center;
    background: var(--ink);
    border: 1px solid color-mix(in oklch, var(--ink), var(--paper) 18%);
    border-radius: 999px;
    bottom: 20px;
    box-shadow: 0 8px 28px oklch(20% 0.03 286 / 22%);
    color: var(--paper);
    cursor: pointer;
    display: flex;
    gap: 9px;
    min-height: 44px;
    padding: 9px 13px 9px 11px;
    position: fixed;
    right: 20px;
    transition: transform 180ms cubic-bezier(.22,1,.36,1), background 180ms ease;
  }
  .launcher:hover { background: color-mix(in oklch, var(--ink), var(--accent) 22%); transform: translateY(-2px); }
  .launcher[data-position^="left"] { left: 20px; right: auto; }
  .launcher:focus-visible, button:focus-visible, a:focus-visible { outline: 3px solid color-mix(in oklch, var(--accent), transparent 35%); outline-offset: 3px; }
  .mark { display: grid; height: 22px; place-items: center; width: 22px; }
  .mark svg { height: 100%; width: 100%; }
  .count { background: var(--accent); border-radius: 999px; color: var(--paper); font-size: 11px; font-variant-numeric: tabular-nums; font-weight: 700; min-width: 20px; padding: 1px 6px; text-align: center; }
  .panel {
    background: var(--paper);
    border-left: 1px solid var(--line);
    bottom: 0;
    box-shadow: -12px 0 48px oklch(20% 0.03 286 / 18%);
    display: grid;
    grid-template-rows: auto minmax(0, 1fr) auto;
    max-width: 100vw;
    position: fixed;
    right: 0;
    top: 0;
    transform: translateX(102%);
    transition: opacity 180ms ease, transform 240ms cubic-bezier(.22,1,.36,1), visibility 240ms;
    visibility: hidden;
    width: min(760px, 72vw);
  }
  .panel:focus { outline: none; }
  .panel[data-position^="left"] { border-left: 0; border-right: 1px solid var(--line); box-shadow: 12px 0 48px oklch(20% 0.03 286 / 18%); left: 0; right: auto; transform: translateX(-102%); }
  .panel[data-position$="-top"] { bottom: auto; border-bottom: 1px solid var(--line); height: 50vh; top: 0; }
  .panel[data-position$="-bottom"] { border-top: 1px solid var(--line); bottom: 0; height: 50vh; top: auto; }
  .panel[data-position="floating"] { border: 1px solid var(--line); border-radius: 14px; bottom: auto; box-shadow: 0 18px 64px oklch(20% 0.03 286 / 24%); height: min(860px, calc(100vh - 48px)); left: 24px; opacity: 0; overflow: hidden; right: auto; top: 24px; transform: translateY(14px) scale(.985); width: min(760px, calc(100vw - 48px)); }
  .panel[data-open="true"] { transform: translateX(0); visibility: visible; }
  .panel[data-position="floating"][data-open="true"] { opacity: 1; transform: translateY(0) scale(1); }
  .toolbar { align-items: center; border-bottom: 1px solid var(--line); display: flex; gap: 8px; min-width: 0; padding: 0 8px 0 12px; }
  .drag-grip { color: var(--muted); display: none; flex: 0 0 30px; height: 36px; place-items: center; touch-action: none; user-select: none; }
  .panel[data-position="floating"] .drag-grip { cursor: grab; display: grid; }
  .panel[data-position="floating"] .tabs { cursor: grab; }
  .panel[data-position="floating"].is-dragging .drag-grip, .panel[data-position="floating"].is-dragging .tabs { cursor: grabbing; }
  .drag-grip svg { fill: currentColor; height: 18px; opacity: .68; width: 10px; }
  .header-actions { align-items: center; display: flex; flex: 0 0 auto; gap: 4px; }
  .position-switch { align-items: center; background: transparent; border: 1px solid transparent; border-radius: 7px; display: inline-flex; flex: 0 0 198px; overflow: hidden; transition: background 140ms ease, border-color 140ms ease; width: 198px; }
  .position-switch:hover, .position-switch:focus-within { background: var(--layer); border-color: var(--line); }
  .position-switch:focus-within { border-color: var(--accent); }
  .position-option { align-items: center; background: transparent; border: 0; border-right: 1px solid transparent; color: var(--muted); cursor: pointer; display: inline-flex; flex: 0 0 28px; height: 32px; justify-content: center; opacity: .26; padding: 0; pointer-events: none; transition: background 140ms ease, border-color 140ms ease, color 140ms ease, opacity 110ms ease; visibility: visible; width: 28px; }
  .position-switch:hover .position-option, .position-switch:focus-within .position-option { border-right-color: var(--line); opacity: 1; pointer-events: auto; }
  .position-option:last-child { border-right: 0; }
  .position-option:hover { background: var(--accent-soft); color: var(--accent); }
  .position-option[aria-checked="true"] { background: var(--accent); color: var(--paper); opacity: 1; pointer-events: auto; visibility: visible; }
  .position-option:focus-visible { outline: 2px solid var(--accent); outline-offset: -3px; position: relative; z-index: 1; }
  .position-icon { display: block; fill: none; height: 16px; stroke: currentColor; stroke-linejoin: round; stroke-width: 1.25; width: 20px; }
  .position-region { fill: currentColor; stroke: none; }
  .resize-handles { display: none; }
  .panel[data-position="floating"] .resize-handles { display: contents; }
  .resize-handle { position: absolute; touch-action: none; z-index: 12; }
  .resize-handle[data-resize="n"], .resize-handle[data-resize="s"] { cursor: ns-resize; height: 8px; left: 14px; right: 14px; }
  .resize-handle[data-resize="n"] { top: 0; }
  .resize-handle[data-resize="s"] { bottom: 0; }
  .resize-handle[data-resize="e"], .resize-handle[data-resize="w"] { bottom: 14px; cursor: ew-resize; top: 14px; width: 8px; }
  .resize-handle[data-resize="e"] { right: 0; }
  .resize-handle[data-resize="w"] { left: 0; }
  .resize-handle[data-resize="ne"], .resize-handle[data-resize="nw"], .resize-handle[data-resize="se"], .resize-handle[data-resize="sw"] { height: 18px; width: 18px; }
  .resize-handle[data-resize="ne"] { cursor: nesw-resize; right: 0; top: 0; }
  .resize-handle[data-resize="nw"] { cursor: nwse-resize; left: 0; top: 0; }
  .resize-handle[data-resize="se"] { bottom: 0; cursor: nwse-resize; right: 0; }
  .resize-handle[data-resize="sw"] { bottom: 0; cursor: nesw-resize; left: 0; }
  .resize-handle[data-resize="se"]::after { border-bottom: 2px solid color-mix(in oklch, var(--muted), transparent 24%); border-right: 2px solid color-mix(in oklch, var(--muted), transparent 24%); bottom: 4px; content: ""; height: 6px; position: absolute; right: 4px; width: 6px; }
  .icon-button { align-items: center; background: transparent; border: 0; border-radius: 7px; color: var(--muted); cursor: pointer; display: flex; height: 36px; justify-content: center; padding: 0; width: 36px; }
  .icon-button:hover { background: var(--layer); color: var(--ink); }
  .tabs { align-items: end; align-self: stretch; display: flex; flex: 1 1 auto; gap: 3px; min-width: 0; overflow-x: auto; overflow-y: hidden; padding: 0; }
  .tab { background: transparent; border: 0; border-bottom: 2px solid transparent; color: var(--muted); cursor: pointer; font-size: 13px; font-weight: 650; margin-bottom: -1px; padding: 12px 10px 10px; white-space: nowrap; }
  .tab:focus-visible { border-radius: 5px 5px 2px 2px; outline: 2px solid color-mix(in oklch, var(--accent), transparent 25%); outline-offset: -4px; }
  .tab[aria-selected="true"] { border-bottom-color: var(--accent); color: var(--ink); }
  .viewport { min-height: 0; overflow: auto; overscroll-behavior: contain; padding: 18px 22px 28px; }
  .notice { background: var(--accent-soft); border: 1px solid color-mix(in oklch, var(--accent), var(--paper) 68%); border-radius: 8px; color: color-mix(in oklch, var(--ink), var(--accent) 25%); font-size: 12px; margin: 0 0 14px; padding: 9px 11px; }
  pre { background: var(--layer); border: 1px solid var(--line); border-radius: 10px; color: var(--ink); font: 12.5px/1.65 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; margin: 0; min-height: 100%; overflow: auto; padding: 16px 17px; tab-size: 2; white-space: pre; }
  .tok.iri, .tok.name { color: oklch(49% 0.17 290); }
  .tok.iri { text-decoration-color: color-mix(in oklch, currentColor, transparent 55%); text-underline-offset: 3px; }
  .tok.string { color: oklch(45% 0.12 145); }
  .tok.key, .tok.keyword { color: oklch(50% 0.15 32); }
  .tok.blank, .tok.number { color: oklch(50% 0.13 235); }
  .tok.comment { color: var(--muted); font-style: italic; }
  .navigator-tools { background: var(--paper); border-bottom: 1px solid var(--line); margin: -18px -22px 4px; padding: 18px 22px 12px; position: sticky; top: -18px; z-index: 5; }
  .navigator-filter { align-items: start; display: grid; gap: 10px; grid-template-columns: minmax(0, 1fr) auto; margin: 0 0 12px; }
  .navigator-search-group { min-width: 0; position: relative; }
  .navigator-search { background: var(--layer); border: 1px solid var(--line); border-radius: 8px; color: var(--ink); font: inherit; height: 36px; min-width: 0; padding: 6px 10px; width: 100%; }
  .navigator-search::placeholder { color: var(--muted); }
  .navigator-search:hover { border-color: color-mix(in oklch, var(--accent), var(--line) 55%); }
  .navigator-search:focus { border-color: var(--accent); outline: 3px solid color-mix(in oklch, var(--accent), transparent 78%); outline-offset: 1px; }
  .typeahead { background: var(--paper); border: 1px solid var(--line); border-radius: 9px; box-shadow: 0 12px 36px oklch(20% 0.03 286 / 20%); left: 0; list-style: none; margin: 5px 0 0; max-height: min(320px, 42vh); overflow: auto; padding: 4px; position: absolute; right: 0; top: 36px; z-index: 9; }
  .typeahead-option { border-radius: 6px; cursor: pointer; display: grid; gap: 2px; min-width: 0; padding: 7px 8px; }
  .typeahead-option[aria-selected="true"] { background: var(--accent-soft); }
  .typeahead-option:hover { background: color-mix(in oklch, var(--accent-soft), var(--paper) 24%); }
  .typeahead-primary { align-items: baseline; display: flex; gap: 7px; min-width: 0; }
  .typeahead-term { color: var(--accent); flex: 0 1 auto; font: 600 11.5px/1.4 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .typeahead-label { color: var(--ink); flex: 1 1 auto; font-size: 12px; font-weight: 650; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .typeahead-meta { color: var(--muted); font-size: 10.5px; line-height: 1.35; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .sync-control { align-items: center; display: inline-flex; gap: 6px; }
  .sync-label { color: var(--muted); font-size: 11px; font-weight: 700; letter-spacing: .04em; text-transform: uppercase; }
  .sync-switch { align-items: stretch; background: var(--layer); border: 1px solid var(--line); border-radius: 8px; display: inline-flex; height: 36px; overflow: hidden; }
  .sync-switch:focus-within { border-color: var(--accent); }
  .sync-option { align-items: center; background: transparent; border: 0; border-right: 1px solid var(--line); color: var(--muted); cursor: pointer; display: inline-flex; justify-content: center; padding: 0; width: 42px; }
  .sync-option:last-child { border-right: 0; }
  .sync-option:hover { background: var(--accent-soft); color: var(--accent); }
  .sync-option[aria-checked="true"] { background: var(--accent); color: var(--paper); }
  .sync-option:focus-visible { outline: 2px solid var(--accent); outline-offset: -3px; position: relative; z-index: 1; }
  .sync-icon { display: block; fill: none; height: 16px; stroke: currentColor; stroke-linecap: round; stroke-linejoin: round; stroke-width: 1.5; width: 32px; }
  .filter-count { color: var(--muted); display: block; font-size: 10px; font-variant-numeric: tabular-nums; line-height: 15px; margin: 2px 2px 0; min-height: 15px; white-space: nowrap; }
  .filter-count:empty { visibility: hidden; }
  .navigator { list-style: none; margin: 0; padding: 0; }
  .vocabularies { margin: 0; padding: 0 2px; position: relative; }
  .vocabularies::before, .vocabularies::after { bottom: 7px; content: ""; opacity: 0; pointer-events: none; position: absolute; top: 23px; transition: opacity 140ms ease; width: 28px; z-index: 2; }
  .vocabularies::before { background: linear-gradient(90deg, var(--paper) 15%, transparent); left: 2px; }
  .vocabularies::after { background: linear-gradient(270deg, var(--paper) 15%, transparent); right: 2px; }
  .vocabularies:not(:hover):not(:focus-within)[data-overflow-left="true"]::before, .vocabularies:not(:hover):not(:focus-within)[data-overflow-right="true"]::after { opacity: 1; }
  .vocabularies-label { color: var(--muted); font-size: 11px; font-weight: 700; letter-spacing: .08em; margin: 0 0 8px; text-transform: uppercase; }
  .vocabulary-links { display: flex; gap: 6px; overflow-x: auto; overflow-y: hidden; overscroll-behavior-inline: contain; padding: 0 0 7px; scrollbar-color: transparent transparent; scrollbar-gutter: stable; scrollbar-width: thin; }
  .vocabulary-links::-webkit-scrollbar { height: 6px; }
  .vocabulary-links::-webkit-scrollbar-track { background: transparent; }
  .vocabulary-links::-webkit-scrollbar-thumb { background: transparent; border-radius: 999px; }
  .vocabularies:hover .vocabulary-links, .vocabularies:focus-within .vocabulary-links { scrollbar-color: color-mix(in oklch, var(--muted), transparent 42%) transparent; }
  .vocabularies:hover .vocabulary-links::-webkit-scrollbar-thumb, .vocabularies:focus-within .vocabulary-links::-webkit-scrollbar-thumb { background: color-mix(in oklch, var(--muted), transparent 42%); }
  .vocabulary-control { align-items: stretch; background: var(--paper); border: 1px solid var(--line); border-radius: 999px; display: inline-flex; flex: 0 0 auto; overflow: hidden; }
  .vocabulary-control:focus-within { border-color: var(--accent); }
  .vocabulary-toggle { align-items: center; background: transparent; border: 0; color: color-mix(in oklch, var(--muted), var(--paper) 20%); cursor: pointer; display: inline-flex; font-size: 12px; font-weight: 650; gap: 6px; opacity: .68; padding: 5px 7px 5px 9px; }
  .vocabulary-toggle[aria-pressed="true"] { background: color-mix(in oklch, var(--accent), var(--paper) 18%); color: var(--paper); opacity: 1; }
  .vocabulary-toggle:hover { background: var(--accent-soft); color: var(--accent); opacity: 1; }
  .vocabulary-toggle[aria-pressed="true"]:hover { background: color-mix(in oklch, var(--accent), var(--ink) 10%); color: var(--paper); }
  .vocabulary-name { max-width: min(300px, 55vw); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .vocabulary-count { align-items: center; background: color-mix(in oklch, currentColor, transparent 84%); border-radius: 999px; display: inline-flex; font-size: 10px; font-variant-numeric: tabular-nums; font-weight: 750; justify-content: center; min-width: 18px; padding: 1px 5px; }
  .vocabulary-link { align-items: center; border-left: 1px solid var(--line); color: var(--muted); display: inline-flex; padding: 5px 7px; text-decoration: none; }
  .vocabulary-link:hover { background: var(--accent-soft); color: var(--accent); }
  .external-mark { color: var(--muted); font-size: 10px; }
  .quad { border-bottom: 1px solid var(--line); display: grid; gap: 7px; grid-template-columns: minmax(0, 1fr) auto; padding-block: 13px; padding-inline: calc(2px + var(--rdf-indent, 0px)) 2px; position: relative; }
  .quad.is-corresponding { background: color-mix(in oklch, var(--accent-soft), transparent 30%); border-radius: 7px; }
  .quad:first-child { padding-top: 0; }
  .quad code { display: block; font: 12px/1.55 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; overflow-wrap: anywhere; }
  .quad .graph code { display: inline; }
  .quad .predicate { color: var(--accent); }
  .term-link { color: inherit; text-decoration-color: color-mix(in oklch, currentColor, transparent 55%); text-underline-offset: 3px; }
  .term-link:hover { text-decoration-color: currentColor; }
  .term-link.local-term { text-decoration-style: dotted; }
  .resource-preview { background: var(--paper); border: 1px solid var(--line); border-radius: 10px; box-shadow: 0 18px 64px oklch(20% 0.03 286 / 28%); display: grid; grid-template-rows: 32px minmax(0, 1fr); height: min(420px, calc(100vh - 24px)); overflow: hidden; position: fixed; width: min(520px, calc(100vw - 24px)); z-index: 20; }
  .resource-preview-bar { align-items: center; background: var(--layer); border-bottom: 1px solid var(--line); cursor: grab; display: flex; gap: 4px; min-width: 0; padding: 0 5px 0 10px; user-select: none; }
  .resource-preview.is-dragging .resource-preview-bar { cursor: grabbing; }
  .resource-preview-url { color: var(--muted); flex: 1 1 auto; font: 11px/1.3 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .resource-preview-action { align-items: center; background: transparent; border: 0; border-radius: 5px; color: var(--muted); cursor: pointer; display: inline-flex; flex: 0 0 24px; font: inherit; font-size: 14px; height: 24px; justify-content: center; line-height: 1; padding: 0; text-decoration: none; }
  .resource-preview-action:hover { background: var(--accent-soft); color: var(--accent); }
  .resource-preview-frame { background: var(--paper); border: 0; display: block; height: 100%; width: 100%; }
  .resource-preview-resize { bottom: 0; cursor: nwse-resize; height: 18px; position: absolute; right: 0; touch-action: none; width: 18px; z-index: 2; }
  .resource-preview-resize::after { border-bottom: 2px solid color-mix(in oklch, var(--muted), transparent 20%); border-right: 2px solid color-mix(in oklch, var(--muted), transparent 20%); bottom: 4px; content: ""; height: 6px; position: absolute; right: 4px; width: 6px; }
  .term-locate-button { margin-left: 6px; opacity: 0; vertical-align: -3px; }
  .quad:hover .term-locate-button, .quad:focus-within .term-locate-button { opacity: 1; }
  .structure-marker { color: color-mix(in oklch, var(--muted), transparent 22%); font: 600 11px/1 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; inset-inline-start: calc(4px + var(--rdf-indent) - 13px); position: absolute; top: 18px; }
  .quad-terms { min-width: 0; }
  .quad-actions { align-items: center; align-self: start; display: flex; flex-wrap: wrap; gap: 5px; justify-content: flex-end; max-width: 230px; min-height: 32px; }
  .preview-actions { align-items: center; display: flex; gap: 3px; opacity: 0; pointer-events: none; transition: opacity 140ms cubic-bezier(.22,1,.36,1); }
  .quad:hover .preview-actions, .quad:focus-within .preview-actions, .quad.source-open .preview-actions { opacity: 1; pointer-events: auto; }
  .row-action-button { align-items: center; background: color-mix(in oklch, var(--accent-soft), var(--paper) 35%); border: 1px solid color-mix(in oklch, var(--accent), var(--paper) 68%); border-radius: 5px; color: color-mix(in oklch, var(--accent), var(--ink) 18%); cursor: pointer; display: inline-flex; height: 22px; justify-content: center; min-width: 26px; padding: 0 5px; }
  .row-action-button:hover { background: var(--accent-soft); border-color: color-mix(in oklch, var(--accent), var(--paper) 38%); color: var(--accent); }
  .source-toggle[aria-expanded="true"] { background: var(--accent); border-color: var(--accent); color: var(--paper); }
  .source-glyph { font: 650 10px/1 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; letter-spacing: -.05em; }
  .locate-glyph { font-size: 14px; line-height: 1; }
  .source-code { grid-column: 1 / -1; min-width: 0; padding-top: 3px; }
  .source-code-label { color: var(--muted); font-size: 11px; font-weight: 700; letter-spacing: .04em; margin: 0 0 6px; text-transform: uppercase; }
  .source-code pre { max-height: 320px; min-height: 0; padding: 12px 14px; white-space: pre-wrap; }
  .tok.punctuation { color: var(--muted); }
  .graph { color: var(--muted); font-size: 11px; margin-top: 2px; }
  .empty { color: var(--muted); margin: 28px auto; max-width: 42ch; text-align: center; }
  .diagnostics { list-style: none; margin: 0; padding: 0; }
  .diagnostic { border-bottom: 1px solid var(--line); padding: 12px 0; }
  .diagnostic strong { color: var(--warning); display: block; font-size: 12px; margin-bottom: 3px; }
  .diagnostic p { margin: 0; }
  .footer { align-items: center; background: var(--layer); border-top: 1px solid var(--line); color: var(--muted); display: flex; font-size: 12px; justify-content: space-between; padding: 10px 18px; }
  .copy { background: transparent; border: 0; color: var(--accent); cursor: pointer; font-size: 12px; font-weight: 700; padding: 4px 5px; }
  .sr-only { height: 1px; margin: -1px; overflow: hidden; padding: 0; position: absolute; width: 1px; clip: rect(0,0,0,0); }
  @media (max-width: 760px) {
    .panel { border-left: 0; width: 100vw; }
    .launcher { bottom: 14px; right: 14px; }
    .launcher[data-position^="left"] { left: 14px; right: auto; }
    .panel[data-position^="left"] { border-right: 0; }
    .panel[data-position="floating"] { border: 1px solid var(--line); border-radius: 12px; bottom: auto; height: calc(100vh - 20px); left: 10px; right: auto; top: 10px; width: calc(100vw - 20px); }
    .toolbar { flex-wrap: wrap; padding: 8px 10px 0; }
    .drag-grip { order: 1; }
    .header-actions { margin-left: auto; order: 2; }
    .tabs { flex-basis: 100%; order: 3; }
    .viewport { padding-inline: 16px; }
    .navigator-tools { margin-inline: -16px; padding-inline: 16px; }
    .navigator-search-group { grid-column: 1 / -1; }
    .sync-control { grid-column: 2; justify-self: end; }
    .quad { grid-template-columns: minmax(0, 1fr); }
    .quad-actions { justify-content: flex-start; max-width: none; }
  }
  @media (hover: none) {
    .preview-actions { opacity: 1; pointer-events: auto; }
    .term-locate-button { opacity: 1; }
    .position-switch { background: var(--layer); border-color: var(--line); }
    .position-option { border-right-color: var(--line); opacity: 1; pointer-events: auto; visibility: visible; }
  }
  @media (prefers-color-scheme: dark) {
    :host { --ink: oklch(92% 0.012 286); --muted: oklch(70% 0.018 286); --paper: oklch(20% 0.016 286); --layer: oklch(24% 0.019 286); --line: oklch(34% 0.022 286); --accent: oklch(73% 0.15 294); --accent-soft: oklch(29% 0.05 294); }
    .launcher { background: var(--accent); color: oklch(18% 0.02 286); }
    .tok.iri, .tok.name { color: oklch(77% 0.13 290); }
    .tok.string { color: oklch(75% 0.11 145); }
    .tok.key, .tok.keyword { color: oklch(75% 0.12 42); }
    .tok.blank, .tok.number { color: oklch(77% 0.1 235); }
  }
  @media (prefers-reduced-motion: reduce) { .launcher, .panel { transition: none; } }
`;
var SESSION_STATE_KEY = "ia2:rdf-navigator:state:v1";
var RESOURCE_PREVIEW_MAX_HTML_LENGTH = 2e6;
var RESOURCE_PREVIEW_CACHE_LIMIT = 4;
var RESOURCE_PREVIEW_FETCH_ATTEMPTS = 2;
var RESOURCE_PREVIEW_FETCH_TIMEOUT_MS = 3e3;
var RESOURCE_PREVIEW_FETCHED_SANDBOX = "allow-forms allow-popups allow-popups-to-escape-sandbox allow-scripts";
var RESOURCE_PREVIEW_DIRECT_SANDBOX = `${RESOURCE_PREVIEW_FETCHED_SANDBOX} allow-same-origin`;
var RESOURCE_PREVIEW_DOCUMENT_CACHE = /* @__PURE__ */ new Map();
var HTTPS_PREVIEW_HOSTS = /* @__PURE__ */ new Set([
  "ontology.inferal.com",
  "purl.archive.org",
  "purl.org",
  "schema.org",
  "www.schema.org",
  "www.w3.org"
]);
var RDF_SCHEMA_SECTIONS = {
  Alt: "ch_alt",
  Bag: "ch_bag",
  first: "ch_first",
  HTML: "ch_html",
  JSON: "ch_json",
  langString: "ch_langstring",
  List: "ch_list",
  nil: "ch_nil",
  object: "ch_object",
  predicate: "ch_predicate",
  Property: "ch_property",
  reifies: "ch_reifies",
  rest: "ch_rest",
  Seq: "ch_seq",
  Statement: "ch_statement",
  subject: "ch_subject",
  type: "ch_type",
  value: "ch_value",
  XMLLiteral: "ch_xmlliteral"
};
var RDFS_SCHEMA_SECTIONS = {
  Class: "ch_class",
  comment: "ch_comment",
  Container: "ch_container",
  ContainerMembershipProperty: "ch_containermembershipproperty",
  Datatype: "ch_datatype",
  domain: "ch_domain",
  isDefinedBy: "ch_isdefinedby",
  label: "ch_label",
  Literal: "ch_literal",
  member: "ch_member",
  Proposition: "ch_proposition",
  range: "ch_range",
  Resource: "ch_resource",
  seeAlso: "ch_seealso",
  subClassOf: "ch_subclassof",
  subPropertyOf: "ch_subpropertyof"
};
var DRAWER_POSITIONS = [
  { position: "right", label: "Right, full height", icon: '<svg class="position-icon" viewBox="0 0 20 16" aria-hidden="true" focusable="false"><rect x=".75" y=".75" width="18.5" height="14.5" rx="2"/><path class="position-region" d="M13 2h5v12h-5z"/></svg>' },
  { position: "right-top", label: "Right, top half", icon: '<svg class="position-icon" viewBox="0 0 20 16" aria-hidden="true" focusable="false"><rect x=".75" y=".75" width="18.5" height="14.5" rx="2"/><path class="position-region" d="M13 2h5v5.5h-5z"/></svg>' },
  { position: "right-bottom", label: "Right, bottom half", icon: '<svg class="position-icon" viewBox="0 0 20 16" aria-hidden="true" focusable="false"><rect x=".75" y=".75" width="18.5" height="14.5" rx="2"/><path class="position-region" d="M13 8.5h5V14h-5z"/></svg>' },
  { position: "floating", label: "Floating, centered", icon: '<svg class="position-icon" viewBox="0 0 20 16" aria-hidden="true" focusable="false"><rect x=".75" y=".75" width="18.5" height="14.5" rx="2"/><rect class="position-region" x="5" y="4.5" width="10" height="7" rx="1"/></svg>' },
  { position: "left", label: "Left, full height", icon: '<svg class="position-icon" viewBox="0 0 20 16" aria-hidden="true" focusable="false"><rect x=".75" y=".75" width="18.5" height="14.5" rx="2"/><path class="position-region" d="M2 2h5v12H2z"/></svg>' },
  { position: "left-bottom", label: "Left, bottom half", icon: '<svg class="position-icon" viewBox="0 0 20 16" aria-hidden="true" focusable="false"><rect x=".75" y=".75" width="18.5" height="14.5" rx="2"/><path class="position-region" d="M2 8.5h5V14H2z"/></svg>' },
  { position: "left-top", label: "Left, top half", icon: '<svg class="position-icon" viewBox="0 0 20 16" aria-hidden="true" focusable="false"><rect x=".75" y=".75" width="18.5" height="14.5" rx="2"/><path class="position-region" d="M2 2h5v5.5H2z"/></svg>' }
];
function isDrawerPosition(value) {
  return typeof value === "string" && DRAWER_POSITIONS.some(({ position }) => position === value);
}
function isFloatingRect(value) {
  if (!value || typeof value !== "object") return false;
  const rect = value;
  return typeof rect.height === "number" && Number.isFinite(rect.height) && rect.height > 0 && typeof rect.width === "number" && Number.isFinite(rect.width) && rect.width > 0 && typeof rect.x === "number" && Number.isFinite(rect.x) && typeof rect.y === "number" && Number.isFinite(rect.y);
}
var RDF_TYPE_IRI = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type";
var RDFS_LABEL_IRI = "http://www.w3.org/2000/01/rdf-schema#label";
var RDFS_DOMAIN_IRI = "http://www.w3.org/2000/01/rdf-schema#domain";
var RDFS_RANGE_IRI = "http://www.w3.org/2000/01/rdf-schema#range";
var SKOS_PREF_LABEL_IRI = "http://www.w3.org/2004/02/skos/core#prefLabel";
var DCTERMS_TITLE_IRI = "http://purl.org/dc/terms/title";
var SCHEMA_NAME_IRI = "https://schema.org/name";
var TYPEAHEAD_LIMIT = 8;
var TYPE_LABELS = {
  "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property": "RDF property",
  "http://www.w3.org/2000/01/rdf-schema#Class": "RDFS class",
  "http://www.w3.org/2002/07/owl#AnnotationProperty": "Annotation property",
  "http://www.w3.org/2002/07/owl#Class": "OWL class",
  "http://www.w3.org/2002/07/owl#DatatypeProperty": "Datatype property",
  "http://www.w3.org/2002/07/owl#ObjectProperty": "Object property",
  "http://www.w3.org/2002/07/owl#Ontology": "OWL ontology"
};
var NON_RENDERED_ELEMENTS = /* @__PURE__ */ new Set([
  "area",
  "base",
  "head",
  "link",
  "meta",
  "noscript",
  "script",
  "source",
  "style",
  "template",
  "title",
  "track"
]);
function elementLabel(element) {
  const id = element.id ? `#${element.id}` : "";
  return `<${element.localName}${id}>`;
}
function isWebIri(value) {
  return /^https?:\/\//i.test(value);
}
function resourcePreviewUrl(value) {
  const url = new URL(value);
  const rdfTerm = url.hostname === "www.w3.org" && url.pathname === "/1999/02/22-rdf-syntax-ns" ? decodeURIComponent(url.hash.slice(1)) : "";
  if (rdfTerm) {
    return new URL(`https://www.w3.org/TR/rdf12-schema/#${RDF_SCHEMA_SECTIONS[rdfTerm] ?? "rdf-namespace"}`);
  }
  const rdfsTerm = url.hostname === "www.w3.org" && url.pathname === "/2000/01/rdf-schema" ? decodeURIComponent(url.hash.slice(1)) : "";
  if (rdfsTerm) {
    return new URL(`https://www.w3.org/TR/rdf12-schema/#${RDFS_SCHEMA_SECTIONS[rdfsTerm] ?? "rdfs-namespace"}`);
  }
  const dcTerm = url.hostname === "purl.org" ? url.pathname.match(/^\/dc\/terms\/([^/]+)$/) : null;
  if (dcTerm) {
    return new URL(`https://www.dublincore.org/specifications/dublin-core/dcmi-terms/#${encodeURIComponent(dcTerm[1])}`);
  }
  if (url.hostname === "purl.org" && url.pathname === "/dc/terms/") {
    return new URL("https://www.dublincore.org/specifications/dublin-core/dcmi-terms/");
  }
  if (url.protocol === "http:" && HTTPS_PREVIEW_HOSTS.has(url.hostname)) url.protocol = "https:";
  return url;
}
function resourcePreviewFetchFirst(url) {
  return url.hostname === "www.dublincore.org" && url.pathname === "/specifications/dublin-core/dcmi-terms/" || url.hostname === "www.w3.org" && url.pathname.startsWith("/TR/");
}
function resourcePreviewDocumentKey(url) {
  const key = new URL(url.href);
  key.hash = "";
  return key.href;
}
function cacheResourcePreviewDocument(key, document2) {
  RESOURCE_PREVIEW_DOCUMENT_CACHE.delete(key);
  RESOURCE_PREVIEW_DOCUMENT_CACHE.set(key, document2);
  while (RESOURCE_PREVIEW_DOCUMENT_CACHE.size > RESOURCE_PREVIEW_CACHE_LIMIT) {
    const oldest = RESOURCE_PREVIEW_DOCUMENT_CACHE.keys().next().value;
    if (!oldest) break;
    RESOURCE_PREVIEW_DOCUMENT_CACHE.delete(oldest);
  }
}
function resourcePreviewStatusDocument(message) {
  return `<!doctype html><meta charset="utf-8"><meta name="color-scheme" content="light dark"><style>
    :root { color: oklch(34% 0.015 286); font: 13px/1.45 ui-sans-serif, system-ui, sans-serif; }
    body { align-items: center; display: flex; justify-content: center; margin: 0; min-height: 100vh; }
    p { color: oklch(54% 0.018 286); margin: 24px; text-align: center; }
  </style><p role="status">${message}</p>`;
}
function fetchResourcePreviewDocument(view, url, requestController) {
  return new Promise((resolve, reject) => {
    const attemptController = new view.AbortController();
    let settled = false;
    let timeout = 0;
    const finish = (callback) => {
      if (settled) return;
      settled = true;
      view.clearTimeout(timeout);
      requestController.signal.removeEventListener("abort", abort);
      callback();
    };
    const abort = () => {
      attemptController.abort();
      finish(() => reject(new Error("Resource preview request was cancelled.")));
    };
    requestController.signal.addEventListener("abort", abort, { once: true });
    timeout = view.setTimeout(() => {
      attemptController.abort();
      finish(() => reject(new Error("Resource preview request timed out.")));
    }, RESOURCE_PREVIEW_FETCH_TIMEOUT_MS);
    void view.fetch(url, {
      credentials: "omit",
      redirect: "follow",
      referrerPolicy: "no-referrer",
      signal: attemptController.signal
    }).then(async (response) => {
      const html = await response.text();
      finish(() => resolve({ html, response }));
    }).catch((error) => finish(() => reject(error)));
  });
}
function htmlWithDocumentBase(html, baseUrl, fragment = "") {
  const escapedBase = baseUrl.replaceAll("&", "&amp;").replaceAll('"', "&quot;");
  const base = `<base href="${escapedBase}">`;
  const serializedBaseUrl = JSON.stringify(baseUrl).replaceAll("<", "\\u003c");
  const serializedFragment = JSON.stringify(fragment).replaceAll("<", "\\u003c");
  const bridge = `<script data-ia2-preview-bridge>(() => {
    const baseUrl = new URL(${serializedBaseUrl});
    const fragment = ${serializedFragment};
    const revealFragment = () => fragment && document.getElementById(fragment)?.scrollIntoView({ block: "start" });
    if (document.readyState === "loading") addEventListener("DOMContentLoaded", revealFragment, { once: true });
    else revealFragment();
    document.addEventListener("click", (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const target = event.target instanceof Element ? event.target.closest("a[href]") : null;
      if (!target || (target.target && target.target.toLowerCase() !== "_self")) return;
      const next = new URL(target.href, document.baseURI);
      if (!/^https?:$/.test(next.protocol)) return;
      const sameDocumentFragment = next.origin === baseUrl.origin && next.pathname === baseUrl.pathname && next.search === baseUrl.search && next.hash;
      if (sameDocumentFragment) return;
      event.preventDefault();
      parent.postMessage({ type: "ia2-rdf-preview-navigate", href: next.href }, "*");
    }, true);
  })();<\/script>`;
  const injection = `${base}${bridge}`;
  const head = /<head(?:\s[^>]*)?>/i.exec(html);
  if (!head) return `${injection}${html}`;
  const insertion = head.index + head[0].length;
  return `${html.slice(0, insertion)}${injection}${html.slice(insertion)}`;
}
function isLocatableSource(element) {
  const view = element.ownerDocument.defaultView;
  if (!view || !(element instanceof view.HTMLElement) || !element.isConnected) return false;
  if (NON_RENDERED_ELEMENTS.has(element.localName) || element.closest("head, template, [hidden]")) return false;
  if (element.localName === "input" && element.getAttribute("type")?.toLowerCase() === "hidden") return false;
  const style = view.getComputedStyle(element);
  return style.display !== "none" && style.visibility !== "hidden" && style.visibility !== "collapse";
}
function hasSerializableChildren(element) {
  if (element.localName === "template" && "content" in element) {
    return element.content.childNodes.length > 0;
  }
  return element.childNodes.length > 0;
}
function rdfCarrierDepth(element, carriers) {
  let depth = 0;
  let ancestor = element.parentElement;
  while (ancestor) {
    if (carriers.has(ancestor)) depth += 1;
    ancestor = ancestor.parentElement;
  }
  return depth;
}
function isInPageViewport(element) {
  const view = element.ownerDocument.defaultView;
  if (!view || !isLocatableSource(element)) return false;
  const rect = element.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.right > 0 && rect.top < view.innerHeight && rect.left < view.innerWidth;
}
function termSearchText(term) {
  if (term.termType === "Triple") {
    return [compactTerm(term), termSearchText(term.subject), termSearchText(term.predicate), termSearchText(term.object)].join(" ");
  }
  const metadata = term.termType === "Literal" ? `${term.datatype.value} ${term.language} ${term.direction ?? ""}` : "";
  return `${compactTerm(term)} ${term.value} ${metadata}`;
}
function quadSearchText(quad) {
  return [
    termSearchText(quad.subject),
    termSearchText(quad.predicate),
    termSearchText(quad.object),
    quad.graph ? termSearchText(quad.graph) : "",
    elementLabel(quad.source)
  ].join(" ").toLocaleLowerCase();
}
function localDocumentUrl(document2, value, sourceDocumentIri = document2.URL) {
  try {
    const termUrl = new URL(value);
    const documentUrl = new URL(sourceDocumentIri);
    const termDocument = new URL(termUrl);
    const currentDocument = new URL(documentUrl);
    termDocument.hash = "";
    currentDocument.hash = "";
    return termDocument.href === currentDocument.href ? termUrl : null;
  } catch {
    return null;
  }
}
function navigateLocalDocument(document2, url, event) {
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  const view = document2.defaultView;
  if (!view) return;
  const currentUrl = new URL(document2.URL);
  currentUrl.hash = url.hash;
  view.history.pushState(null, "", currentUrl.href);
  const target = url.hash ? locatableElementForUrl(document2, url) : document2.documentElement;
  target?.scrollIntoView({
    behavior: view.matchMedia?.("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    block: "start"
  });
}
function locatableElementForUrl(document2, localUrl) {
  let target = document2.documentElement;
  if (localUrl.hash) {
    const encodedId = localUrl.hash.slice(1);
    try {
      target = document2.getElementById(decodeURIComponent(encodedId));
    } catch {
      target = document2.getElementById(encodedId);
    }
  }
  return target && isLocatableSource(target) ? target : null;
}
function locatableElementForTerm(document2, term, sourceDocumentIri = document2.URL) {
  if (term.termType !== "NamedNode" || !isWebIri(term.value)) return null;
  const localUrl = localDocumentUrl(document2, term.value, sourceDocumentIri);
  return localUrl ? locatableElementForUrl(document2, localUrl) : null;
}
function locateButton(document2, target, className, onLocate) {
  const button = document2.createElement("button");
  button.className = `row-action-button locate-button ${className}`;
  button.type = "button";
  button.setAttribute("aria-label", `Locate ${elementLabel(target)}`);
  button.title = button.getAttribute("aria-label");
  const glyph = document2.createElement("span");
  glyph.className = "locate-glyph";
  glyph.setAttribute("aria-hidden", "true");
  glyph.textContent = "\u2316";
  button.append(glyph);
  button.addEventListener("click", () => onLocate(target));
  return button;
}
function termCode(document2, term, prefix = "", className = "", onLocate, sourceDocumentIri = document2.URL) {
  const code = document2.createElement("code");
  if (className) code.className = className;
  if (prefix) code.append(document2.createTextNode(prefix));
  const label = compactTerm(term);
  if (term.termType !== "NamedNode" || !isWebIri(term.value)) {
    code.append(document2.createTextNode(label));
    return code;
  }
  const anchor = document2.createElement("a");
  anchor.className = "term-link";
  anchor.href = term.value;
  const localUrl = localDocumentUrl(document2, term.value, sourceDocumentIri);
  if (localUrl) {
    anchor.classList.add("local-term");
    anchor.title = localUrl.hash ? `Scroll to ${localUrl.hash} in this document` : "Scroll to the start of this document";
    anchor.addEventListener("click", (event) => navigateLocalDocument(document2, localUrl, event));
  } else {
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    anchor.title = `Open ${term.value} in a new tab`;
  }
  anchor.textContent = label;
  code.append(anchor);
  const target = locatableElementForTerm(document2, term, sourceDocumentIri);
  if (target && onLocate) code.append(locateButton(document2, target, "term-locate-button", onLocate));
  return code;
}
function namespaceFor(iri2) {
  for (const [label, namespace2] of Object.entries(PREFIXES)) {
    if (iri2.startsWith(namespace2)) return { label, namespace: namespace2 };
  }
  if (!isWebIri(iri2)) return null;
  const hash = iri2.lastIndexOf("#");
  const slash = iri2.lastIndexOf("/");
  const boundary = Math.max(hash, slash);
  if (boundary < 8) return null;
  const namespace = iri2.slice(0, boundary + 1);
  try {
    const url = new URL(namespace);
    const path = url.pathname.replace(/\/$/, "");
    const suffix = namespace.endsWith("#") ? "#" : "";
    return { label: `${url.host}${path}${suffix}`, namespace };
  } catch {
    return null;
  }
}
function termIris(term) {
  if (term.termType === "NamedNode") return [term.value];
  if (term.termType === "BlankNode") return [];
  if (term.termType === "Literal") return compactTerm(term).includes("^^") ? [term.datatype.value] : [];
  return [...termIris(term.subject), ...termIris(term.predicate), ...termIris(term.object)];
}
function compactIri(iri2) {
  return compactTerm({ termType: "NamedNode", value: iri2 });
}
function localNameForIri(iri2) {
  const trimmed = iri2.replace(/[\/#]+$/, "");
  const boundary = Math.max(trimmed.lastIndexOf("#"), trimmed.lastIndexOf("/"));
  const local = boundary >= 0 ? trimmed.slice(boundary + 1) : trimmed;
  try {
    return decodeURIComponent(local);
  } catch {
    return local;
  }
}
function semanticSuggestionsIn(result) {
  const builders = /* @__PURE__ */ new Map();
  const ensure = (iri2) => {
    const existing = builders.get(iri2);
    if (existing) return existing;
    const created = {
      domains: /* @__PURE__ */ new Set(),
      iri: iri2,
      labels: /* @__PURE__ */ new Map(),
      ranges: /* @__PURE__ */ new Set(),
      statementCount: 0,
      types: /* @__PURE__ */ new Set()
    };
    builders.set(iri2, created);
    return created;
  };
  for (const quad of result.quads) {
    const iris = /* @__PURE__ */ new Set([
      ...termIris(quad.subject),
      ...termIris(quad.predicate),
      ...termIris(quad.object),
      ...quad.graph ? termIris(quad.graph) : []
    ]);
    for (const iri2 of iris) ensure(iri2).statementCount += 1;
    if (quad.subject.termType !== "NamedNode") continue;
    const subject = ensure(quad.subject.value);
    if (quad.object.termType === "Literal" && [RDFS_LABEL_IRI, SKOS_PREF_LABEL_IRI, DCTERMS_TITLE_IRI, SCHEMA_NAME_IRI].includes(quad.predicate.value)) {
      subject.labels.set(quad.predicate.value, quad.object.value);
    }
    if (quad.predicate.value === RDF_TYPE_IRI && quad.object.termType === "NamedNode") subject.types.add(quad.object.value);
    if (quad.predicate.value === RDFS_DOMAIN_IRI) subject.domains.add(compactTerm(quad.object));
    if (quad.predicate.value === RDFS_RANGE_IRI) subject.ranges.add(compactTerm(quad.object));
  }
  const labelPriority = [RDFS_LABEL_IRI, SKOS_PREF_LABEL_IRI, DCTERMS_TITLE_IRI, SCHEMA_NAME_IRI];
  return Array.from(builders.values()).map((builder) => {
    const display = compactIri(builder.iri);
    const localName = localNameForIri(builder.iri);
    const label = labelPriority.map((predicate) => builder.labels.get(predicate)).find(Boolean) ?? "";
    const kinds = Array.from(builder.types, (type) => TYPE_LABELS[type] ?? `type ${compactIri(type)}`).sort();
    const domains = Array.from(builder.domains).sort();
    const ranges = Array.from(builder.ranges).sort();
    const searchText = [
      display,
      builder.iri,
      localName,
      label,
      ...kinds,
      ...domains.flatMap((domain) => ["domain", domain, `domain ${domain}`]),
      ...ranges.flatMap((range) => ["range", range, `range ${range}`])
    ].join(" ").toLocaleLowerCase();
    return {
      display,
      domains,
      iri: builder.iri,
      kinds,
      label,
      localName,
      ranges,
      searchText,
      statementCount: builder.statementCount
    };
  });
}
function matchingSemanticSuggestions(suggestions, value, limit = TYPEAHEAD_LIMIT) {
  const query = value.trim().toLocaleLowerCase();
  if (!query) return [];
  const tokens = query.split(/\s+/).filter(Boolean);
  return suggestions.map((suggestion) => {
    if (!tokens.every((token) => suggestion.searchText.includes(token))) return null;
    const primary = [suggestion.display, suggestion.localName, suggestion.label].join(" ").toLocaleLowerCase();
    let score = 60;
    if ([suggestion.display, suggestion.localName, suggestion.label].some((field) => field.toLocaleLowerCase() === query)) score = 0;
    else if ([suggestion.display, suggestion.localName, suggestion.label].some((field) => field.toLocaleLowerCase().startsWith(query))) score = 10;
    else if (primary.includes(query)) score = 20;
    else if (tokens.every((token) => primary.includes(token))) score = 35;
    return { score: score - Math.min(suggestion.statementCount, 20) / 100, suggestion };
  }).filter((entry) => entry !== null).sort((a, b) => a.score - b.score || a.suggestion.display.localeCompare(b.suggestion.display)).slice(0, limit).map(({ suggestion }) => suggestion);
}
function semanticSuggestionDetails(suggestion) {
  const details = [
    ...suggestion.kinds,
    ...suggestion.domains.map((domain) => `domain ${domain}`),
    ...suggestion.ranges.map((range) => `range ${range}`)
  ];
  const count = `${suggestion.statementCount} statement${suggestion.statementCount === 1 ? "" : "s"}`;
  return [...details, count];
}
function namespacesInQuad(quad) {
  const iris = [
    ...termIris(quad.subject),
    ...termIris(quad.predicate),
    ...termIris(quad.object),
    ...quad.graph ? termIris(quad.graph) : []
  ];
  const found = /* @__PURE__ */ new Map();
  for (const iri2 of iris) {
    const vocabulary = namespaceFor(iri2);
    if (vocabulary) found.set(vocabulary.namespace, vocabulary);
  }
  return Array.from(found.values());
}
function vocabulariesIn(result) {
  const found = /* @__PURE__ */ new Map();
  for (const quad of result.quads) {
    for (const vocabulary of namespacesInQuad(quad)) {
      const existing = found.get(vocabulary.namespace);
      if (existing) existing.count += 1;
      else found.set(vocabulary.namespace, { ...vocabulary, count: 1 });
    }
  }
  return Array.from(found.values()).sort((a, b) => a.label.localeCompare(b.label));
}
var NATIVE_RDF_VALUE_ATTRIBUTES = /* @__PURE__ */ new Set(["content", "datetime", "dir", "href", "lang", "src", "value"]);
var RDF_ELEMENT_SELECTOR = "[rdf-predicate], [rdf-graph], [rdf-graph-key], base[href], link[rel]";
function mutationAffectsExtraction(record) {
  if (record.type === "characterData") {
    return record.target.parentElement?.closest("[rdf-predicate]") !== null;
  }
  if (record.type === "attributes") {
    const element = record.target instanceof Element ? record.target : null;
    const name = record.attributeName ?? "";
    if (!element) return false;
    if (name.startsWith("rdf-")) return true;
    if (element.localName === "base" && name === "href") return true;
    if (element.localName === "link" && (name === "href" || name === "rel")) return true;
    if (!element.hasAttribute("rdf-predicate")) return false;
    return name === "id" || NATIVE_RDF_VALUE_ATTRIBUTES.has(name);
  }
  const target = record.target instanceof Element ? record.target : null;
  if (target?.closest("[rdf-predicate]")) return true;
  return [...record.addedNodes, ...record.removedNodes].some((node) => {
    if (!(node instanceof Element)) return false;
    return node.matches(RDF_ELEMENT_SELECTOR) || node.querySelector(RDF_ELEMENT_SELECTOR) !== null;
  });
}
var Ia2RdfNavigator = class extends HTMLElement {
  #result = null;
  #view = "navigator";
  #open = false;
  #status = "";
  #navigatorQuery = "";
  #disabledNamespaces = /* @__PURE__ */ new Set();
  #syncMode = "off";
  #position = "right";
  #floatingRect = null;
  #floatingInteractionCleanup = null;
  #linkPreview = null;
  #linkPreviewAbortController = null;
  #linkPreviewInteractionCleanup = null;
  #linkPreviewNavigationCleanup = null;
  #locateAnimation = null;
  #syncCleanup = null;
  #vocabularyResizeObserver = null;
  #observer = null;
  #refreshTimer = null;
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }
  connectedCallback() {
    this.#restoreSessionState();
    this.refresh();
    this.addEventListener("keydown", this.#onKeydown);
    this.addEventListener("keyup", this.#onKeyup);
    this.ownerDocument.defaultView?.addEventListener("resize", this.#onWindowResize, { passive: true });
    this.#observeDocument();
  }
  disconnectedCallback() {
    this.removeEventListener("keydown", this.#onKeydown);
    this.removeEventListener("keyup", this.#onKeyup);
    this.ownerDocument.defaultView?.removeEventListener("resize", this.#onWindowResize);
    this.#observer?.disconnect();
    this.#observer = null;
    this.#vocabularyResizeObserver?.disconnect();
    this.#vocabularyResizeObserver = null;
    if (this.#refreshTimer !== null) window.clearTimeout(this.#refreshTimer);
    this.#stopFloatingInteraction();
    this.#clearLinkPreview();
    this.#clearLocateEmphasis();
    this.#clearNavigatorSync();
  }
  #clearNavigatorSync() {
    this.#syncCleanup?.();
    this.#syncCleanup = null;
  }
  #clearLinkPreview() {
    this.#linkPreviewAbortController?.abort();
    this.#linkPreviewAbortController = null;
    this.#stopLinkPreviewInteraction();
    this.#linkPreviewNavigationCleanup?.();
    this.#linkPreviewNavigationCleanup = null;
    this.#linkPreview?.remove();
    this.#linkPreview = null;
  }
  #stopLinkPreviewInteraction() {
    this.#linkPreviewInteractionCleanup?.();
    this.#linkPreviewInteractionCleanup = null;
  }
  #constrainLinkPreview(preview) {
    const view = this.ownerDocument.defaultView;
    if (!view) return;
    const margin = 12;
    const minWidth = Math.min(300, Math.max(1, view.innerWidth - margin * 2));
    const minHeight = Math.min(220, Math.max(1, view.innerHeight - margin * 2));
    const rect = preview.getBoundingClientRect();
    const width = Math.min(Math.max(rect.width || Number.parseFloat(preview.style.width) || minWidth, minWidth), Math.max(1, view.innerWidth - margin * 2));
    const height = Math.min(Math.max(rect.height || Number.parseFloat(preview.style.height) || minHeight, minHeight), Math.max(1, view.innerHeight - margin * 2));
    const left = Math.min(Math.max(Number.parseFloat(preview.style.left) || rect.left, margin), Math.max(margin, view.innerWidth - margin - width));
    const top = Math.min(Math.max(Number.parseFloat(preview.style.top) || rect.top, margin), Math.max(margin, view.innerHeight - margin - height));
    preview.style.height = `${height}px`;
    preview.style.left = `${left}px`;
    preview.style.top = `${top}px`;
    preview.style.width = `${width}px`;
  }
  #startLinkPreviewInteraction(event, preview, resize = false) {
    if (event.button !== 0) return;
    const view = this.ownerDocument.defaultView;
    if (!view) return;
    event.preventDefault();
    this.#stopLinkPreviewInteraction();
    this.#constrainLinkPreview(preview);
    const start = {
      height: Number.parseFloat(preview.style.height),
      left: Number.parseFloat(preview.style.left),
      top: Number.parseFloat(preview.style.top),
      width: Number.parseFloat(preview.style.width),
      x: event.clientX,
      y: event.clientY
    };
    preview.classList.add(resize ? "is-resizing" : "is-dragging");
    const update = (moveEvent) => {
      const deltaX = moveEvent.clientX - start.x;
      const deltaY = moveEvent.clientY - start.y;
      if (resize) {
        preview.style.width = `${Math.max(300, start.width + deltaX)}px`;
        preview.style.height = `${Math.max(220, start.height + deltaY)}px`;
      } else {
        preview.style.left = `${start.left + deltaX}px`;
        preview.style.top = `${start.top + deltaY}px`;
      }
      this.#constrainLinkPreview(preview);
    };
    const stop = () => {
      view.removeEventListener("pointermove", update);
      view.removeEventListener("pointerup", stop);
      view.removeEventListener("pointercancel", stop);
      preview.classList.remove("is-dragging", "is-resizing");
      if (this.#linkPreviewInteractionCleanup === stop) this.#linkPreviewInteractionCleanup = null;
    };
    view.addEventListener("pointermove", update);
    view.addEventListener("pointerup", stop);
    view.addEventListener("pointercancel", stop);
    this.#linkPreviewInteractionCleanup = stop;
  }
  #loadLinkPreviewFrame(frame, href) {
    const view = this.ownerDocument.defaultView;
    if (!view) return;
    const previewUrl = resourcePreviewUrl(href);
    const fetchFirst = resourcePreviewFetchFirst(previewUrl);
    const documentKey = resourcePreviewDocumentKey(previewUrl);
    const fragment = previewUrl.hash ? decodeURIComponent(previewUrl.hash.slice(1)) : "";
    frame.removeAttribute("srcdoc");
    if (fetchFirst) {
      frame.removeAttribute("src");
      frame.setAttribute("sandbox", RESOURCE_PREVIEW_FETCHED_SANDBOX);
      const cached = RESOURCE_PREVIEW_DOCUMENT_CACHE.get(documentKey);
      if (cached) {
        frame.srcdoc = htmlWithDocumentBase(cached.html, cached.baseUrl, fragment);
        return;
      }
      frame.srcdoc = resourcePreviewStatusDocument("Loading definition\u2026");
    } else {
      frame.setAttribute("sandbox", RESOURCE_PREVIEW_DIRECT_SANDBOX);
      frame.src = previewUrl.href;
    }
    if (typeof view.fetch !== "function" || typeof view.AbortController !== "function") {
      if (fetchFirst) frame.srcdoc = resourcePreviewStatusDocument("Preview unavailable. Use the open button above.");
      return;
    }
    this.#linkPreviewAbortController?.abort();
    const controller = new view.AbortController();
    this.#linkPreviewAbortController = controller;
    const attempts = fetchFirst ? RESOURCE_PREVIEW_FETCH_ATTEMPTS : 1;
    const fetchDocument = async () => {
      let error;
      for (let attempt = 0; attempt < attempts; attempt += 1) {
        try {
          return await fetchResourcePreviewDocument(view, previewUrl.href, controller);
        } catch (caught) {
          error = caught;
          if (controller.signal.aborted || attempt + 1 >= attempts) throw caught;
          if (fetchFirst && frame.isConnected) frame.srcdoc = resourcePreviewStatusDocument("Still loading; retrying\u2026");
        }
      }
      throw error;
    };
    void fetchDocument().then(({ html, response }) => {
      const contentType = response.headers.get("content-type")?.toLowerCase() ?? "";
      if (!response.ok || !contentType.includes("text/html") && !contentType.includes("application/xhtml+xml")) {
        if (fetchFirst && frame.isConnected) frame.srcdoc = resourcePreviewStatusDocument("Preview unavailable. Use the open button above.");
        return;
      }
      if (html.length > RESOURCE_PREVIEW_MAX_HTML_LENGTH || controller.signal.aborted || !frame.isConnected) {
        if (fetchFirst && !controller.signal.aborted && frame.isConnected) frame.srcdoc = resourcePreviewStatusDocument("Preview is too large. Use the open button above.");
        return;
      }
      const responseUrl = new URL(response.url || previewUrl.href);
      responseUrl.hash = "";
      cacheResourcePreviewDocument(documentKey, { baseUrl: responseUrl.href, html });
      frame.setAttribute("sandbox", RESOURCE_PREVIEW_FETCHED_SANDBOX);
      frame.srcdoc = htmlWithDocumentBase(html, responseUrl.href, fragment);
    }).catch(() => {
      if (fetchFirst && frame.isConnected && !controller.signal.aborted) {
        frame.srcdoc = resourcePreviewStatusDocument("Preview unavailable. Use the open button above.");
      }
    }).finally(() => {
      if (this.#linkPreviewAbortController === controller) this.#linkPreviewAbortController = null;
    });
  }
  #showLinkPreview(anchor, x, y) {
    const view = this.ownerDocument.defaultView;
    if (!view || !this.shadowRoot || !anchor.isConnected) return;
    const document2 = this.ownerDocument;
    const preview = document2.createElement("section");
    preview.className = "resource-preview";
    preview.setAttribute("role", "dialog");
    preview.setAttribute("aria-label", `Preview of ${anchor.href}`);
    const width = Math.max(1, Math.min(520, view.innerWidth - 24));
    const height = Math.max(1, Math.min(420, view.innerHeight - 24));
    const maxLeft = Math.max(12, view.innerWidth - width - 12);
    const maxTop = Math.max(12, view.innerHeight - height - 12);
    preview.style.left = `${Math.min(Math.max(12, x - 24), maxLeft)}px`;
    preview.style.top = `${Math.min(Math.max(12, y - 40), maxTop)}px`;
    preview.style.width = `${width}px`;
    preview.style.height = `${height}px`;
    const bar = document2.createElement("header");
    bar.className = "resource-preview-bar";
    const url = document2.createElement("span");
    url.className = "resource-preview-url";
    url.title = anchor.href;
    url.textContent = anchor.href;
    const open = document2.createElement("a");
    open.className = "resource-preview-action resource-preview-open";
    open.href = anchor.href;
    open.target = "_blank";
    open.rel = "noopener noreferrer";
    open.setAttribute("aria-label", `Open ${anchor.href} in a new tab`);
    open.title = open.getAttribute("aria-label");
    open.textContent = "\u2197";
    bar.append(url, open);
    const close = document2.createElement("button");
    close.className = "resource-preview-action resource-preview-close";
    close.type = "button";
    close.setAttribute("aria-label", "Close resource preview");
    close.title = close.getAttribute("aria-label");
    close.textContent = "\xD7";
    close.addEventListener("click", () => this.#clearLinkPreview());
    bar.append(close);
    bar.addEventListener("pointerdown", (event) => {
      const target = event.target instanceof Element ? event.target : null;
      if (target?.closest("a, button")) return;
      this.#startLinkPreviewInteraction(event, preview);
    });
    const frame = document2.createElement("iframe");
    frame.className = "resource-preview-frame";
    frame.title = `Preview of ${anchor.href}`;
    frame.setAttribute("sandbox", resourcePreviewFetchFirst(resourcePreviewUrl(anchor.href)) ? RESOURCE_PREVIEW_FETCHED_SANDBOX : RESOURCE_PREVIEW_DIRECT_SANDBOX);
    frame.referrerPolicy = "no-referrer";
    frame.tabIndex = 0;
    preview.append(bar, frame);
    const resize = document2.createElement("span");
    resize.className = "resource-preview-resize";
    resize.setAttribute("aria-hidden", "true");
    resize.addEventListener("pointerdown", (event) => this.#startLinkPreviewInteraction(event, preview, true));
    preview.append(resize);
    this.shadowRoot.append(preview);
    this.#linkPreview = preview;
    const handlePreviewNavigation = (event) => {
      const data = event.data;
      if (event.source !== frame.contentWindow || data?.type !== "ia2-rdf-preview-navigate" || typeof data.href !== "string" || !isWebIri(data.href)) return;
      url.textContent = data.href;
      url.title = data.href;
      open.href = data.href;
      this.#loadLinkPreviewFrame(frame, data.href);
    };
    view.addEventListener("message", handlePreviewNavigation);
    this.#linkPreviewNavigationCleanup = () => view.removeEventListener("message", handlePreviewNavigation);
    this.#loadLinkPreviewFrame(frame, anchor.href);
  }
  #openLinkPreview(anchor, event) {
    const rect = anchor.getBoundingClientRect();
    const x = event.clientX || rect.left + Math.min(rect.width / 2, 24);
    const y = event.clientY || rect.top + Math.min(rect.height / 2, 12);
    this.#clearLinkPreview();
    this.#showLinkPreview(anchor, x, y);
  }
  #resourceAnchorForTarget(target) {
    if (!(target instanceof Element)) return null;
    const anchor = target.closest("a.term-link[href], a.vocabulary-link[href], a.tok.iri[href]");
    if (!anchor || !this.shadowRoot?.contains(anchor)) return null;
    const sourceDocumentIri = this.#result?.sourceDocumentIri ?? this.ownerDocument.URL;
    return localDocumentUrl(this.ownerDocument, anchor.href, sourceDocumentIri) ? null : anchor;
  }
  #configureLinkClicks() {
    if (!this.shadowRoot) return;
    const viewport = this.shadowRoot.querySelector(".viewport");
    if (!viewport) return;
    viewport.addEventListener("click", (event) => {
      const anchor = this.#resourceAnchorForTarget(event.target);
      if (!anchor || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      this.#openLinkPreview(anchor, event);
    });
  }
  #restoreSessionState() {
    try {
      const serialized = this.ownerDocument.defaultView?.sessionStorage.getItem(SESSION_STATE_KEY);
      if (!serialized) return;
      const state = JSON.parse(serialized);
      if (isDrawerPosition(state.position)) this.#position = state.position;
      if (isFloatingRect(state.floatingRect)) this.#floatingRect = this.#constrainFloatingRect(state.floatingRect);
    } catch {
    }
  }
  #persistSessionState() {
    try {
      const state = {
        floatingRect: this.#floatingRect,
        position: this.#position
      };
      this.ownerDocument.defaultView?.sessionStorage.setItem(SESSION_STATE_KEY, JSON.stringify(state));
    } catch {
    }
  }
  #captureFocus() {
    const active = this.shadowRoot?.activeElement;
    if (!(active instanceof HTMLElement)) return null;
    if (active.classList.contains("navigator-search")) {
      const input = active;
      return { kind: "search", start: input.selectionStart, end: input.selectionEnd };
    }
    if (active.classList.contains("vocabulary-toggle") && active.dataset.namespace) return { kind: "namespace", key: active.dataset.namespace };
    if (active.classList.contains("sync-option") && active.dataset.syncMode) return { kind: "sync", key: active.dataset.syncMode };
    if (active.classList.contains("position-option") && active.dataset.position) return { kind: "position", key: active.dataset.position };
    if (active.classList.contains("tab") && active.dataset.view) return { kind: "tab", key: active.dataset.view };
    if (active.classList.contains("launcher")) return { kind: "launcher" };
    if (active.classList.contains("refresh")) return { kind: "refresh" };
    if (active.classList.contains("close")) return { kind: "close" };
    if (active.classList.contains("copy")) return { kind: "copy" };
    if (active.classList.contains("viewport")) return { kind: "viewport" };
    return this.shadowRoot?.querySelector(".panel")?.contains(active) ? { kind: "fallback" } : null;
  }
  #restoreFocus(snapshot) {
    if (!this.shadowRoot) return;
    let target = null;
    if (snapshot.kind === "search") target = this.shadowRoot.querySelector(".navigator-search");
    if (snapshot.kind === "namespace") {
      target = Array.from(this.shadowRoot.querySelectorAll(".vocabulary-toggle")).find((button) => button.dataset.namespace === snapshot.key) ?? null;
    }
    if (snapshot.kind === "sync") target = Array.from(this.shadowRoot.querySelectorAll(".sync-option")).find((button) => button.dataset.syncMode === snapshot.key) ?? null;
    if (snapshot.kind === "position") target = Array.from(this.shadowRoot.querySelectorAll(".position-option")).find((button) => button.dataset.position === snapshot.key) ?? null;
    if (snapshot.kind === "tab") target = Array.from(this.shadowRoot.querySelectorAll(".tab")).find((button) => button.dataset.view === snapshot.key) ?? null;
    if (snapshot.kind === "launcher") target = this.shadowRoot.querySelector(".launcher");
    if (snapshot.kind === "refresh") target = this.shadowRoot.querySelector(".refresh");
    if (snapshot.kind === "close") target = this.shadowRoot.querySelector(".close");
    if (snapshot.kind === "copy") target = this.shadowRoot.querySelector(".copy");
    if (snapshot.kind === "viewport") target = this.shadowRoot.querySelector(".viewport");
    if (!target && snapshot.kind === "fallback") target = this.shadowRoot.querySelector('[role="tab"][aria-selected="true"]');
    target?.focus({ preventScroll: true });
    if (snapshot.kind === "search" && target instanceof HTMLInputElement) {
      target.setSelectionRange(snapshot.start ?? target.value.length, snapshot.end ?? target.value.length);
    }
  }
  #panelFocusables() {
    const panel = this.shadowRoot?.querySelector(".panel");
    if (!panel) return [];
    const scopes = this.#linkPreview ? [panel, this.#linkPreview] : [panel];
    return scopes.flatMap((scope) => Array.from(scope.querySelectorAll("a[href], button, input, select, textarea, [tabindex]"))).filter((element) => element.tabIndex >= 0 && !element.hasAttribute("disabled") && !element.closest("[hidden]") && element.getAttribute("aria-hidden") !== "true");
  }
  #observeDocument() {
    this.#observer?.disconnect();
    this.#observer = new MutationObserver((records) => {
      if (!records.some((record) => record.target !== this && mutationAffectsExtraction(record))) return;
      if (this.#refreshTimer !== null) window.clearTimeout(this.#refreshTimer);
      this.#refreshTimer = window.setTimeout(() => {
        this.#refreshTimer = null;
        this.refresh();
      }, 120);
    });
    this.#observer.observe(this.ownerDocument.documentElement, {
      attributes: true,
      characterData: true,
      childList: true,
      subtree: true
    });
  }
  /** Re-extract the current owner document and redraw every view. */
  refresh() {
    const focus = this.#captureFocus();
    this.#result = extractDataset(this.ownerDocument);
    this.#render();
    if (focus) queueMicrotask(() => this.#restoreFocus(focus));
  }
  open(focusTarget = "tab") {
    this.#open = true;
    this.shadowRoot?.querySelector(".launcher")?.setAttribute("aria-expanded", "true");
    const panel = this.shadowRoot?.querySelector(".panel");
    if (panel) panel.dataset.open = "true";
    queueMicrotask(() => {
      const target = focusTarget === "tab" ? this.shadowRoot?.querySelector('[role="tab"][aria-selected="true"]') : this.shadowRoot?.querySelector(".panel");
      target?.focus({ preventScroll: true });
    });
  }
  close() {
    this.#open = false;
    this.#stopFloatingInteraction();
    this.#clearLinkPreview();
    this.#clearLocateEmphasis();
    this.shadowRoot?.querySelector(".launcher")?.setAttribute("aria-expanded", "false");
    const panel = this.shadowRoot?.querySelector(".panel");
    if (panel) panel.dataset.open = "false";
    queueMicrotask(() => this.shadowRoot?.querySelector(".launcher")?.focus());
  }
  toggle(focusTarget = "tab") {
    if (this.#open) this.close();
    else this.open(focusTarget);
  }
  #floatingLimits() {
    const view = this.ownerDocument.defaultView;
    const width = Math.max(view?.innerWidth ?? 1024, 1);
    const height = Math.max(view?.innerHeight ?? 768, 1);
    const margin = width <= 760 ? 10 : 24;
    return {
      height,
      margin,
      minHeight: Math.min(280, Math.max(height - margin * 2, 1)),
      minWidth: Math.min(360, Math.max(width - margin * 2, 1)),
      width
    };
  }
  #constrainFloatingRect(rect) {
    const { height: viewportHeight, margin, minHeight, minWidth, width: viewportWidth } = this.#floatingLimits();
    const availableWidth = Math.max(viewportWidth - margin * 2, 1);
    const availableHeight = Math.max(viewportHeight - margin * 2, 1);
    const width = Math.min(Math.max(rect.width, minWidth), availableWidth);
    const height = Math.min(Math.max(rect.height, minHeight), availableHeight);
    return {
      height,
      width,
      x: Math.min(Math.max(rect.x, margin), viewportWidth - margin - width),
      y: Math.min(Math.max(rect.y, margin), viewportHeight - margin - height)
    };
  }
  #defaultFloatingRect() {
    const { height, margin, width } = this.#floatingLimits();
    const floatingWidth = Math.min(760, Math.max(width - margin * 2, 1));
    const floatingHeight = Math.min(860, Math.max(height - margin * 2, 1), Math.max(360, Math.round(height * 0.82)));
    return {
      height: floatingHeight,
      width: floatingWidth,
      x: Math.round((width - floatingWidth) / 2),
      y: Math.round((height - floatingHeight) / 2)
    };
  }
  #applyFloatingGeometry(panel) {
    this.#floatingRect = this.#constrainFloatingRect(this.#floatingRect ?? this.#defaultFloatingRect());
    panel.style.height = `${this.#floatingRect.height}px`;
    panel.style.left = `${this.#floatingRect.x}px`;
    panel.style.top = `${this.#floatingRect.y}px`;
    panel.style.width = `${this.#floatingRect.width}px`;
  }
  #clearFloatingGeometry(panel) {
    panel.style.height = "";
    panel.style.left = "";
    panel.style.top = "";
    panel.style.width = "";
  }
  #stopFloatingInteraction() {
    this.#floatingInteractionCleanup?.();
    this.#floatingInteractionCleanup = null;
  }
  #startFloatingInteraction(event, panel, resize) {
    if (this.#position !== "floating" || event.button !== 0) return;
    const view = this.ownerDocument.defaultView;
    if (!view) return;
    event.preventDefault();
    this.#stopFloatingInteraction();
    this.#applyFloatingGeometry(panel);
    const startRect = { ...this.#floatingRect };
    const startX = event.clientX;
    const startY = event.clientY;
    panel.classList.add(resize ? "is-resizing" : "is-dragging");
    const update = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      const limits = this.#floatingLimits();
      const next = { ...startRect };
      if (!resize) {
        next.x = startRect.x + deltaX;
        next.y = startRect.y + deltaY;
      } else {
        if (resize.includes("e")) next.width = Math.min(Math.max(startRect.width + deltaX, limits.minWidth), limits.width - limits.margin - startRect.x);
        if (resize.includes("s")) next.height = Math.min(Math.max(startRect.height + deltaY, limits.minHeight), limits.height - limits.margin - startRect.y);
        if (resize.includes("w")) {
          next.x = Math.min(Math.max(startRect.x + deltaX, limits.margin), startRect.x + startRect.width - limits.minWidth);
          next.width = startRect.x + startRect.width - next.x;
        }
        if (resize.includes("n")) {
          next.y = Math.min(Math.max(startRect.y + deltaY, limits.margin), startRect.y + startRect.height - limits.minHeight);
          next.height = startRect.y + startRect.height - next.y;
        }
      }
      this.#floatingRect = this.#constrainFloatingRect(next);
      this.#applyFloatingGeometry(panel);
    };
    const stop = () => {
      view.removeEventListener("pointermove", update);
      view.removeEventListener("pointerup", stop);
      view.removeEventListener("pointercancel", stop);
      panel.classList.remove("is-dragging", "is-resizing");
      this.#persistSessionState();
      if (this.#floatingInteractionCleanup === stop) this.#floatingInteractionCleanup = null;
    };
    view.addEventListener("pointermove", update);
    view.addEventListener("pointerup", stop);
    view.addEventListener("pointercancel", stop);
    this.#floatingInteractionCleanup = stop;
  }
  #onWindowResize = () => {
    if (this.#linkPreview) this.#constrainLinkPreview(this.#linkPreview);
    if (this.#position !== "floating") return;
    const panel = this.shadowRoot?.querySelector(".panel");
    if (panel) {
      this.#applyFloatingGeometry(panel);
      this.#persistSessionState();
    }
  };
  #onKeydown = (event) => {
    event.stopPropagation();
    if (!this.#open) return;
    if (event.key === "Escape") {
      event.preventDefault();
      if (this.#linkPreview) {
        this.#clearLinkPreview();
        return;
      }
      this.close();
      return;
    }
    if (event.key === "Tab") {
      const focusables = this.#panelFocusables();
      if (!focusables.length) return;
      const active = this.shadowRoot?.activeElement;
      const first = focusables[0];
      const last = focusables.at(-1);
      if (event.shiftKey && (active === first || !focusables.includes(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || !focusables.includes(active))) {
        event.preventDefault();
        first.focus();
      }
    }
  };
  #onKeyup = (event) => {
    event.stopPropagation();
  };
  #setView(view) {
    this.#view = view;
    this.#render();
    queueMicrotask(() => this.shadowRoot?.querySelector(`[data-view="${view}"]`)?.focus());
  }
  async #copyCurrent() {
    if (!this.#result) return;
    const text = this.#view === "json" ? serializeJsonLd(this.#result) : serializeTurtle(this.#result);
    try {
      await navigator.clipboard.writeText(text);
      this.#status = "Copied to clipboard";
    } catch {
      this.#status = "Clipboard access was not available";
    }
    const status = this.shadowRoot?.querySelector(".sr-only");
    if (status) status.textContent = this.#status;
  }
  #locateElement(target) {
    this.#clearLocateEmphasis();
    const element = target;
    const reducedMotion = element.ownerDocument.defaultView?.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    element.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "center" });
    if (!reducedMotion) {
      this.#locateAnimation = element.animate?.(
        [
          { outline: "3px solid transparent", outlineOffset: "8px" },
          { outline: "3px solid oklch(62% 0.18 294)", outlineOffset: "4px", offset: 0.16 },
          { outline: "3px solid transparent", outlineOffset: "8px" }
        ],
        { duration: 1800, easing: "cubic-bezier(.22,1,.36,1)" }
      ) ?? null;
    }
  }
  #clearLocateEmphasis() {
    this.#locateAnimation?.cancel();
    this.#locateAnimation = null;
  }
  #configureNavigatorSync(viewport, rows, applyFilter, setHoveredSource) {
    this.#clearNavigatorSync();
    if (this.#syncMode === "off") return;
    const view = this.ownerDocument.defaultView;
    if (!view) return;
    const cleanups = [];
    let timer = null;
    let activeAnimation = null;
    let lastFollowedSource = null;
    const listen = (target, type, listener, options) => {
      target.addEventListener(type, listener, options);
      cleanups.push(() => target.removeEventListener(type, listener, options));
    };
    const schedule = (callback) => {
      if (timer !== null) view.clearTimeout(timer);
      timer = view.setTimeout(() => {
        timer = null;
        callback();
      }, 32);
    };
    const sourceRows = /* @__PURE__ */ new Map();
    for (const row of rows) {
      const entries = sourceRows.get(row.quad.source) ?? [];
      entries.push(row);
      sourceRows.set(row.quad.source, entries);
    }
    const emphasizeSource = (source) => {
      activeAnimation?.cancel();
      if (view.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
      activeAnimation = source.animate?.(
        [
          { outline: "2px solid transparent", outlineOffset: "7px" },
          { outline: "2px solid oklch(62% 0.18 294)", outlineOffset: "4px" }
        ],
        { direction: "alternate", duration: 520, easing: "cubic-bezier(.22,1,.36,1)", iterations: Infinity }
      ) ?? null;
    };
    const clearEmphasis = () => {
      activeAnimation?.cancel();
      activeAnimation = null;
    };
    sourceRows.forEach((matchingRows, source) => {
      listen(source, "pointerenter", () => {
        setHoveredSource(source);
        matchingRows.forEach(({ item }) => {
          item.classList.add("is-corresponding");
          item.scrollIntoView?.({ block: "nearest" });
        });
      });
      listen(source, "pointerleave", () => {
        matchingRows.forEach(({ item }) => item.classList.remove("is-corresponding"));
        setHoveredSource(null);
      });
    });
    rows.forEach(({ item, quad }) => {
      const source = quad.source;
      listen(item, "pointerenter", () => {
        item.classList.add("is-corresponding");
        emphasizeSource(source);
        if (this.#syncMode === "navigator") {
          source.scrollIntoView({ behavior: view.matchMedia?.("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "center" });
        }
      });
      listen(item, "pointerleave", () => {
        item.classList.remove("is-corresponding");
        clearEmphasis();
      });
    });
    if (this.#syncMode === "page") {
      const update = () => schedule(applyFilter);
      listen(view, "scroll", update, { passive: true });
      listen(view, "resize", update, { passive: true });
    } else {
      const followNavigator = () => {
        const viewportRect = viewport.getBoundingClientRect();
        const readingLine = viewportRect.top + Math.min(viewportRect.height * 0.35, 140);
        let closest = null;
        let closestDistance = Number.POSITIVE_INFINITY;
        for (const row of rows) {
          if (row.item.hidden) continue;
          const rect = row.item.getBoundingClientRect();
          if (rect.bottom <= viewportRect.top || rect.top >= viewportRect.bottom) continue;
          const distance = Math.abs(rect.top - readingLine);
          if (distance < closestDistance) {
            closest = row;
            closestDistance = distance;
          }
        }
        const source = closest?.quad.source;
        if (!source || source === lastFollowedSource || !isLocatableSource(source)) return;
        lastFollowedSource = source;
        source.scrollIntoView({ behavior: "auto", block: "center" });
        emphasizeSource(source);
      };
      listen(viewport, "scroll", () => schedule(followNavigator), { passive: true });
      schedule(followNavigator);
    }
    this.#syncCleanup = () => {
      cleanups.forEach((cleanup) => cleanup());
      if (timer !== null) view.clearTimeout(timer);
      clearEmphasis();
    };
  }
  #toggleSource(item, button, source, includeChildren, sourceId, equivalentOutput = false) {
    const openViewer = item.querySelector(".source-code");
    const wasExpanded = openViewer?.dataset.children === String(includeChildren);
    item.querySelectorAll(".source-toggle").forEach((toggle) => {
      toggle.setAttribute("aria-expanded", "false");
      const showLabel = toggle.dataset.showLabel;
      if (showLabel) {
        toggle.setAttribute("aria-label", showLabel);
        toggle.title = showLabel;
      }
    });
    item.querySelector(".source-code")?.remove();
    item.classList.remove("source-open");
    if (wasExpanded) return;
    item.classList.add("source-open");
    button.setAttribute("aria-expanded", "true");
    const hideLabel = button.dataset.hideLabel;
    if (hideLabel) {
      button.setAttribute("aria-label", hideLabel);
      button.title = hideLabel;
    }
    const viewer = this.ownerDocument.createElement("section");
    viewer.className = "source-code";
    viewer.id = sourceId;
    viewer.dataset.children = String(includeChildren);
    viewer.setAttribute("aria-label", equivalentOutput ? "Element HTML" : includeChildren ? "Element HTML with children" : "Element HTML without children");
    const label = this.ownerDocument.createElement("p");
    label.className = "source-code-label";
    label.textContent = equivalentOutput ? elementLabel(source) : includeChildren ? `${elementLabel(source)} with children` : `${elementLabel(source)} without children`;
    const clone = source.cloneNode(includeChildren);
    viewer.append(label, highlightedCode(clone.outerHTML, "html", this.ownerDocument));
    item.append(viewer);
  }
  #renderNavigator(container, result) {
    if (!result.quads.length) {
      const empty = document.createElement("p");
      empty.className = "empty";
      empty.textContent = "No asserted IA2 statements were found in the document light tree.";
      container.append(empty);
      return;
    }
    const tools = document.createElement("div");
    tools.className = "navigator-tools";
    const filter = document.createElement("div");
    filter.className = "navigator-filter";
    const filterLabel = document.createElement("label");
    filterLabel.className = "sr-only";
    filterLabel.htmlFor = "ia2-navigator-search";
    filterLabel.textContent = "Filter RDF statements";
    const search = document.createElement("input");
    search.className = "navigator-search";
    search.id = "ia2-navigator-search";
    search.type = "search";
    search.placeholder = "Filter statements";
    search.autocomplete = "off";
    search.spellcheck = false;
    search.value = this.#navigatorQuery;
    search.setAttribute("role", "combobox");
    search.setAttribute("aria-autocomplete", "list");
    search.setAttribute("aria-controls", "ia2-navigator-suggestions");
    search.setAttribute("aria-expanded", "false");
    const searchGroup = document.createElement("div");
    searchGroup.className = "navigator-search-group";
    const typeahead = document.createElement("ul");
    typeahead.className = "typeahead";
    typeahead.id = "ia2-navigator-suggestions";
    typeahead.setAttribute("role", "listbox");
    typeahead.setAttribute("aria-label", "Semantic term suggestions");
    typeahead.hidden = true;
    const typeaheadStatus = document.createElement("span");
    typeaheadStatus.className = "sr-only typeahead-status";
    typeaheadStatus.setAttribute("role", "status");
    typeaheadStatus.setAttribute("aria-live", "polite");
    const filterCount = document.createElement("output");
    filterCount.className = "filter-count";
    filterCount.setAttribute("for", search.id);
    filterCount.setAttribute("aria-live", "polite");
    const syncControl = document.createElement("div");
    syncControl.className = "sync-control";
    const syncLabel = document.createElement("span");
    syncLabel.className = "sync-label";
    syncLabel.textContent = "Sync";
    const syncSwitch = document.createElement("div");
    syncSwitch.className = "sync-switch";
    syncSwitch.setAttribute("role", "radiogroup");
    syncSwitch.setAttribute("aria-label", "Scroll synchronization");
    const syncOptions = [];
    for (const [mode, icon, accessibleLabel] of [
      ["off", `<svg class="sync-icon" viewBox="0 0 32 16" aria-hidden="true" focusable="false">
        <path d="M16 2v5" />
        <path d="M11.7 4.4a6 6 0 1 0 8.6 0" />
      </svg>`, "Scroll synchronization off"],
      ["page", `<svg class="sync-icon" viewBox="0 0 34 16" aria-hidden="true" focusable="false">
        <rect x="1" y="2" width="8" height="12" rx="1.5" />
        <path d="M3.5 5h3M3.5 8h3M3.5 11h3M11.5 8h9m-3-3 3 3-3 3" />
        <circle cx="24" cy="4" r=".8" fill="currentColor" stroke="none" />
        <circle cx="24" cy="8" r=".8" fill="currentColor" stroke="none" />
        <circle cx="24" cy="12" r=".8" fill="currentColor" stroke="none" />
        <path d="M27 4h6M27 8h6M27 12h6" />
      </svg>`, "Follow page viewport in Navigator"],
      ["navigator", `<svg class="sync-icon" viewBox="0 0 34 16" aria-hidden="true" focusable="false">
        <circle cx="2" cy="4" r=".8" fill="currentColor" stroke="none" />
        <circle cx="2" cy="8" r=".8" fill="currentColor" stroke="none" />
        <circle cx="2" cy="12" r=".8" fill="currentColor" stroke="none" />
        <path d="M5 4h6M5 8h6M5 12h6M22.5 8h-9m3-3-3 3 3 3" />
        <rect x="25" y="2" width="8" height="12" rx="1.5" />
        <path d="M27.5 5h3M27.5 8h3M27.5 11h3" />
      </svg>`, "Follow Navigator in page"]
    ]) {
      const option = document.createElement("button");
      option.className = "sync-option";
      option.type = "button";
      option.dataset.syncMode = mode;
      option.setAttribute("role", "radio");
      option.setAttribute("aria-checked", String(this.#syncMode === mode));
      option.setAttribute("aria-label", accessibleLabel);
      option.title = accessibleLabel;
      option.tabIndex = this.#syncMode === mode ? 0 : -1;
      option.innerHTML = icon;
      syncOptions.push(option);
      syncSwitch.append(option);
    }
    syncControl.append(syncLabel, syncSwitch);
    searchGroup.append(search, typeahead, filterCount, typeaheadStatus);
    filter.append(filterLabel, searchGroup, syncControl);
    tools.append(filter);
    container.append(tools);
    const vocabularies = vocabulariesIn(result);
    const semanticSuggestions = semanticSuggestionsIn(result);
    const namespaceButtons = /* @__PURE__ */ new Map();
    let applyFilter = () => {
    };
    if (vocabularies.length) {
      const navigation = document.createElement("nav");
      navigation.className = "vocabularies";
      navigation.setAttribute("aria-label", "Namespaces used in this document");
      const label = document.createElement("p");
      label.className = "vocabularies-label";
      label.textContent = "Namespaces";
      const links = document.createElement("div");
      links.className = "vocabulary-links";
      for (const vocabulary of vocabularies) {
        const control = document.createElement("span");
        control.className = "vocabulary-control";
        const toggle = document.createElement("button");
        toggle.className = "vocabulary-toggle";
        toggle.type = "button";
        toggle.dataset.namespace = vocabulary.namespace;
        const vocabularyLabel = document.createElement("span");
        vocabularyLabel.className = "vocabulary-name";
        vocabularyLabel.textContent = vocabulary.label;
        const vocabularyCount = document.createElement("span");
        vocabularyCount.className = "vocabulary-count";
        vocabularyCount.setAttribute("aria-hidden", "true");
        vocabularyCount.textContent = String(vocabulary.count);
        toggle.append(vocabularyLabel, vocabularyCount);
        toggle.addEventListener("click", () => {
          if (this.#disabledNamespaces.has(vocabulary.namespace)) this.#disabledNamespaces.delete(vocabulary.namespace);
          else this.#disabledNamespaces.add(vocabulary.namespace);
          applyFilter();
        });
        namespaceButtons.set(vocabulary.namespace, toggle);
        const anchor = document.createElement("a");
        anchor.className = "vocabulary-link";
        anchor.href = vocabulary.namespace;
        anchor.target = "_blank";
        anchor.rel = "noopener noreferrer";
        anchor.title = `Open ${vocabulary.namespace} in a new tab`;
        anchor.setAttribute("aria-label", `Open ${vocabulary.namespace} in a new tab`);
        const external = document.createElement("span");
        external.className = "external-mark";
        external.setAttribute("aria-hidden", "true");
        external.textContent = "\u2197";
        anchor.append(external);
        control.append(toggle, anchor);
        links.append(control);
      }
      navigation.append(label, links);
      tools.append(navigation);
      const updateOverflow = () => {
        const maxScroll = Math.max(links.scrollWidth - links.clientWidth, 0);
        navigation.dataset.overflowLeft = String(links.scrollLeft > 1);
        navigation.dataset.overflowRight = String(links.scrollLeft < maxScroll - 1);
      };
      links.addEventListener("scroll", updateOverflow, { passive: true });
      links.addEventListener("pointerenter", updateOverflow);
      links.addEventListener("focusin", updateOverflow);
      const ResizeObserverConstructor = this.ownerDocument.defaultView?.ResizeObserver;
      if (ResizeObserverConstructor) {
        this.#vocabularyResizeObserver = new ResizeObserverConstructor(() => updateOverflow());
        this.#vocabularyResizeObserver.observe(links);
      }
      queueMicrotask(updateOverflow);
    }
    const list = document.createElement("ol");
    list.className = "navigator";
    const carriers = new Set(result.quads.map((quad) => quad.source));
    const rows = [];
    result.quads.forEach((quad, index) => {
      const item = document.createElement("li");
      item.className = "quad";
      const depth = rdfCarrierDepth(quad.source, carriers);
      const visualDepth = Math.min(depth, 6);
      item.dataset.depth = String(depth);
      item.style.setProperty("--rdf-indent", `${visualDepth * 16}px`);
      if (depth > 0) {
        const marker = document.createElement("span");
        marker.className = "structure-marker";
        marker.setAttribute("aria-hidden", "true");
        marker.textContent = "\u21B3";
        item.append(marker);
      }
      const terms = document.createElement("div");
      terms.className = "quad-terms";
      const onLocate = (target) => this.#locateElement(target);
      const subject = termCode(document, quad.subject, "", "", onLocate, result.sourceDocumentIri);
      const predicate = termCode(document, quad.predicate, "   ", "predicate", onLocate, result.sourceDocumentIri);
      const object = termCode(document, quad.object, "   ", "", onLocate, result.sourceDocumentIri);
      terms.append(subject, predicate, object);
      if (quad.graph) {
        const graph = document.createElement("div");
        graph.className = "graph";
        graph.append("Graph: ", termCode(document, quad.graph, "", "", onLocate, result.sourceDocumentIri));
        terms.append(graph);
      }
      const termTargets = new Set(
        [quad.subject, quad.predicate, quad.object, quad.graph].filter((term) => term !== null).map((term) => locatableElementForTerm(document, term, result.sourceDocumentIri)).filter((target) => target !== null)
      );
      const sourceId = `ia2-source-${index}`;
      const previewActions = document.createElement("div");
      previewActions.className = "preview-actions";
      previewActions.setAttribute("role", "group");
      previewActions.setAttribute("aria-label", `Actions for ${elementLabel(quad.source)}`);
      if (isLocatableSource(quad.source) && !termTargets.has(quad.source)) {
        previewActions.append(locateButton(document, quad.source, "carrier-locate-button", onLocate));
      }
      const hasChildren = hasSerializableChildren(quad.source);
      const createToggle = (includeChildren, equivalentOutput = false) => {
        const button = document.createElement("button");
        button.className = "row-action-button source-toggle";
        button.type = "button";
        button.dataset.children = String(includeChildren);
        button.setAttribute("aria-expanded", "false");
        button.setAttribute("aria-controls", sourceId);
        const mode = equivalentOutput ? "" : includeChildren ? " with child content" : " without child content";
        const showLabel = `Show HTML for ${elementLabel(quad.source)}${mode}`;
        const hideLabel = `Hide HTML for ${elementLabel(quad.source)}${mode}`;
        button.dataset.showLabel = showLabel;
        button.dataset.hideLabel = hideLabel;
        button.setAttribute("aria-label", showLabel);
        button.title = showLabel;
        const glyph = document.createElement("span");
        glyph.className = "source-glyph";
        glyph.setAttribute("aria-hidden", "true");
        glyph.textContent = includeChildren ? "</>+" : "</>";
        button.append(glyph);
        button.addEventListener("click", () => this.#toggleSource(item, button, quad.source, includeChildren, sourceId, equivalentOutput));
        return button;
      };
      previewActions.append(createToggle(false, !hasChildren));
      if (hasChildren) previewActions.append(createToggle(true));
      item.append(terms);
      const actions = document.createElement("div");
      actions.className = "quad-actions";
      actions.append(previewActions);
      item.append(actions);
      item.addEventListener("pointerleave", () => this.#clearLocateEmphasis());
      list.append(item);
      rows.push({ item, namespaces: new Set(namespacesInQuad(quad).map((entry) => entry.namespace)), quad, searchText: quadSearchText(quad) });
    });
    container.append(list);
    const noMatches = document.createElement("p");
    noMatches.className = "empty filter-empty";
    noMatches.textContent = "No statements match the active filters.";
    noMatches.hidden = true;
    container.append(noMatches);
    let hoveredSource = null;
    applyFilter = () => {
      this.#navigatorQuery = search.value;
      const query = search.value.trim().toLocaleLowerCase();
      let matchCount = 0;
      rows.forEach(({ item, namespaces, quad, searchText }) => {
        const matchesNamespace = Array.from(namespaces).every((namespace) => !this.#disabledNamespaces.has(namespace));
        const matchesViewport = this.#syncMode !== "page" || isInPageViewport(quad.source);
        const matches = quad.source === hoveredSource || matchesNamespace && matchesViewport && (!query || searchText.includes(query));
        item.hidden = !matches;
        if (matches) matchCount += 1;
      });
      namespaceButtons.forEach((button, namespace) => {
        const active = !this.#disabledNamespaces.has(namespace);
        const count = vocabularies.find((vocabulary) => vocabulary.namespace === namespace)?.count ?? 0;
        const statementLabel = `${count} statement${count === 1 ? "" : "s"}`;
        button.setAttribute("aria-pressed", String(active));
        button.setAttribute("aria-label", `${active ? "Hide" : "Show"} ${statementLabel} using ${namespace}`);
        button.title = button.getAttribute("aria-label");
      });
      const hasNamespaceFilter = vocabularies.some((vocabulary) => this.#disabledNamespaces.has(vocabulary.namespace));
      const filtering = Boolean(query) || hasNamespaceFilter || this.#syncMode === "page";
      filterCount.textContent = filtering && matchCount !== rows.length ? `${matchCount} of ${rows.length}` : "";
      noMatches.hidden = !filtering || matchCount > 0;
      list.hidden = filtering && matchCount === 0;
    };
    let visibleSuggestions = [];
    let activeSuggestion = -1;
    const closeTypeahead = () => {
      visibleSuggestions = [];
      activeSuggestion = -1;
      typeahead.hidden = true;
      typeahead.replaceChildren();
      search.setAttribute("aria-expanded", "false");
      search.removeAttribute("aria-activedescendant");
      typeaheadStatus.textContent = "";
    };
    const setActiveSuggestion = (index) => {
      if (!visibleSuggestions.length) return;
      activeSuggestion = (index + visibleSuggestions.length) % visibleSuggestions.length;
      const options = Array.from(typeahead.querySelectorAll('[role="option"]'));
      options.forEach((option, optionIndex) => option.setAttribute("aria-selected", String(optionIndex === activeSuggestion)));
      const active = options[activeSuggestion];
      if (!active) return;
      search.setAttribute("aria-activedescendant", active.id);
      active.scrollIntoView?.({ block: "nearest" });
    };
    const selectSuggestion = (suggestion) => {
      search.value = suggestion.display;
      this.#navigatorQuery = search.value;
      applyFilter();
      closeTypeahead();
    };
    const renderTypeahead = () => {
      visibleSuggestions = matchingSemanticSuggestions(semanticSuggestions, search.value);
      activeSuggestion = -1;
      typeahead.replaceChildren();
      search.removeAttribute("aria-activedescendant");
      if (!visibleSuggestions.length || this.shadowRoot?.activeElement !== search) {
        typeahead.hidden = true;
        search.setAttribute("aria-expanded", "false");
        typeaheadStatus.textContent = "";
        return;
      }
      visibleSuggestions.forEach((suggestion, index) => {
        const option = document.createElement("li");
        option.className = "typeahead-option";
        option.id = `ia2-navigator-suggestion-${index}`;
        option.setAttribute("role", "option");
        option.setAttribute("aria-selected", "false");
        const primary = document.createElement("span");
        primary.className = "typeahead-primary";
        const term = document.createElement("span");
        term.className = "typeahead-term";
        term.textContent = suggestion.display;
        primary.append(term);
        if (suggestion.label && suggestion.label !== suggestion.display) {
          const label = document.createElement("span");
          label.className = "typeahead-label";
          label.textContent = suggestion.label;
          primary.append(label);
        }
        const details = semanticSuggestionDetails(suggestion);
        const metadata = document.createElement("span");
        metadata.className = "typeahead-meta";
        metadata.textContent = details.join(" \xB7 ");
        option.setAttribute("aria-label", [suggestion.display, suggestion.label, ...details].filter(Boolean).join(", "));
        option.append(primary, metadata);
        option.addEventListener("pointerdown", (event) => event.preventDefault());
        option.addEventListener("pointermove", () => setActiveSuggestion(index));
        option.addEventListener("click", () => selectSuggestion(suggestion));
        typeahead.append(option);
      });
      typeahead.hidden = false;
      search.setAttribute("aria-expanded", "true");
      typeaheadStatus.textContent = `${visibleSuggestions.length} semantic suggestion${visibleSuggestions.length === 1 ? "" : "s"} available.`;
    };
    search.addEventListener("input", () => {
      applyFilter();
      renderTypeahead();
    });
    search.addEventListener("focus", renderTypeahead);
    search.addEventListener("blur", () => {
      this.ownerDocument.defaultView?.setTimeout(() => {
        if (this.shadowRoot?.activeElement !== search) closeTypeahead();
      }, 0);
    });
    search.addEventListener("keydown", (event) => {
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        if (typeahead.hidden) renderTypeahead();
        if (!visibleSuggestions.length) return;
        event.preventDefault();
        event.stopPropagation();
        setActiveSuggestion(activeSuggestion + (event.key === "ArrowDown" ? 1 : -1));
        return;
      }
      if (event.key === "Enter" && activeSuggestion >= 0) {
        event.preventDefault();
        event.stopPropagation();
        selectSuggestion(visibleSuggestions[activeSuggestion]);
        return;
      }
      if (event.key === "Escape" && !typeahead.hidden) {
        event.preventDefault();
        event.stopPropagation();
        closeTypeahead();
        return;
      }
      if (event.key === "Tab") closeTypeahead();
    });
    const configureSync = () => {
      this.#configureNavigatorSync(container, rows, applyFilter, (source) => {
        hoveredSource = source;
        applyFilter();
      });
    };
    const setSyncMode = (mode, focus = false) => {
      this.#syncMode = mode;
      hoveredSource = null;
      for (const option of syncOptions) {
        const selected = option.dataset.syncMode === mode;
        option.setAttribute("aria-checked", String(selected));
        option.tabIndex = selected ? 0 : -1;
        if (selected && focus) option.focus();
      }
      applyFilter();
      configureSync();
    };
    for (const option of syncOptions) {
      option.addEventListener("click", () => setSyncMode(option.dataset.syncMode));
    }
    syncSwitch.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      const current = event.target instanceof HTMLButtonElement ? syncOptions.indexOf(event.target) : syncOptions.findIndex((option) => option.getAttribute("aria-checked") === "true");
      let next = current;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = syncOptions.length - 1;
      if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (current + 1) % syncOptions.length;
      if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (current - 1 + syncOptions.length) % syncOptions.length;
      setSyncMode(syncOptions[next].dataset.syncMode, true);
    });
    applyFilter();
    configureSync();
  }
  #renderDiagnostics(container, diagnostics) {
    if (!diagnostics.length) {
      const empty = document.createElement("p");
      empty.className = "empty";
      empty.textContent = "No extraction diagnostics. The document passed the checks implemented by this preview extractor.";
      container.append(empty);
      return;
    }
    const list = document.createElement("ul");
    list.className = "diagnostics";
    for (const diagnostic of diagnostics) {
      const item = document.createElement("li");
      item.className = "diagnostic";
      const heading = document.createElement("strong");
      heading.textContent = `${diagnostic.severity.toUpperCase()} \xB7 ${diagnostic.code}`;
      const message = document.createElement("p");
      message.textContent = diagnostic.source ? `${diagnostic.message} Source: ${elementLabel(diagnostic.source)}` : diagnostic.message;
      item.append(heading, message);
      list.append(item);
    }
    container.append(list);
  }
  #render() {
    this.#stopFloatingInteraction();
    this.#clearLinkPreview();
    this.#clearLocateEmphasis();
    this.#clearNavigatorSync();
    this.#vocabularyResizeObserver?.disconnect();
    this.#vocabularyResizeObserver = null;
    const result = this.#result;
    if (!result || !this.shadowRoot) return;
    if (this.#view === "diagnostics" && !result.diagnostics.length) this.#view = "navigator";
    this.shadowRoot.innerHTML = `
      <style>${CSS}</style>
      <button class="launcher" type="button" data-position="${this.#position}" aria-expanded="${this.#open}" aria-controls="ia2-rdf-panel">
        <span class="mark" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><circle cx="5" cy="12" r="2.6" fill="currentColor"/><circle cx="18.5" cy="5" r="2.6" fill="currentColor"/><circle cx="18.5" cy="19" r="2.6" fill="currentColor"/><path d="M7.2 10.8 16 6.2M7.2 13.2 16 17.8" stroke="currentColor" stroke-width="1.8"/></svg></span>
        <span>RDF</span><span class="count">${result.quads.length}</span>
      </button>
      <aside class="panel" id="ia2-rdf-panel" data-open="${this.#open}" data-position="${this.#position}" aria-label="Document RDF" tabindex="-1">
        <header class="toolbar">
          <span class="drag-grip" aria-hidden="true" title="Drag floating navigator"><svg viewBox="0 0 8 18"><circle cx="2" cy="4" r="1.2"/><circle cx="6" cy="4" r="1.2"/><circle cx="2" cy="9" r="1.2"/><circle cx="6" cy="9" r="1.2"/><circle cx="2" cy="14" r="1.2"/><circle cx="6" cy="14" r="1.2"/></svg></span>
          <div class="tabs" role="tablist" aria-label="RDF views">
            <button class="tab" role="tab" data-view="navigator" aria-selected="${this.#view === "navigator"}">Navigator</button>
            <button class="tab" role="tab" data-view="turtle" aria-selected="${this.#view === "turtle"}">Turtle</button>
            <button class="tab" role="tab" data-view="json" aria-selected="${this.#view === "json"}">JSON-LD</button>
            ${result.diagnostics.length ? `<button class="tab" role="tab" data-view="diagnostics" aria-selected="${this.#view === "diagnostics"}">Diagnostics (${result.diagnostics.length})</button>` : ""}
          </div>
          <div class="header-actions">
            <div class="position-switch" role="radiogroup" aria-label="Drawer position">
              ${DRAWER_POSITIONS.map(({ icon, label, position }) => `<button class="position-option" type="button" role="radio" data-position="${position}" aria-checked="${this.#position === position}" aria-label="${label}" title="${label}" tabindex="${this.#position === position ? "0" : "-1"}">${icon}</button>`).join("")}
            </div>
            <button class="icon-button refresh" type="button" aria-label="Refresh extraction" title="Refresh extraction">\u21BB</button><button class="icon-button close" type="button" aria-label="Close RDF Navigator" title="Close">\xD7</button>
          </div>
        </header>
        <section class="viewport" role="tabpanel" tabindex="0"></section>
        <footer class="footer"><span>RDF 1.2 \xB7 Core 0.1 preview</span>${this.#view === "turtle" || this.#view === "json" ? '<button class="copy" type="button">Copy view</button>' : ""}</footer>
        <div class="resize-handles" aria-hidden="true">
          ${["n", "ne", "e", "se", "s", "sw", "w", "nw"].map((direction) => `<span class="resize-handle" data-resize="${direction}"></span>`).join("")}
        </div>
        <p class="sr-only" aria-live="polite">${this.#status}</p>
      </aside>`;
    const viewport = this.shadowRoot.querySelector(".viewport");
    if (this.#view === "turtle") viewport.append(highlightedCode(serializeTurtle(result), "turtle", document));
    if (this.#view === "json") {
      if (containsTripleTerms(result)) {
        const notice = document.createElement("p");
        notice.className = "notice";
        notice.textContent = "JSON-LD 1.1 has no native RDF 1.2 triple-term syntax. This view preserves triple terms as typed JSON literals; use Turtle for the semantic form.";
        viewport.append(notice);
      }
      viewport.append(highlightedCode(serializeJsonLd(result), "json", document));
    }
    if (this.#view === "navigator") this.#renderNavigator(viewport, result);
    if (this.#view === "diagnostics") this.#renderDiagnostics(viewport, result.diagnostics);
    this.shadowRoot.querySelector(".launcher")?.addEventListener("click", (event) => this.toggle(event instanceof MouseEvent && event.detail !== 0 ? "panel" : "tab"));
    this.shadowRoot.querySelector(".close")?.addEventListener("click", () => this.close());
    this.shadowRoot.querySelector(".refresh")?.addEventListener("click", () => this.refresh());
    const positionSwitch = this.shadowRoot.querySelector(".position-switch");
    const positionOptions = Array.from(this.shadowRoot.querySelectorAll(".position-option"));
    const panel = this.shadowRoot.querySelector(".panel");
    const applyPosition = (position, focus = false) => {
      this.#position = position;
      const launcher = this.shadowRoot?.querySelector(".launcher");
      if (panel) {
        panel.dataset.position = this.#position;
        if (position === "floating") this.#applyFloatingGeometry(panel);
        else this.#clearFloatingGeometry(panel);
      }
      if (launcher) launcher.dataset.position = this.#position;
      for (const option of positionOptions) {
        const selected = option.dataset.position === this.#position;
        option.setAttribute("aria-checked", String(selected));
        option.tabIndex = selected ? 0 : -1;
        if (selected && focus) option.focus();
      }
      this.#persistSessionState();
    };
    if (panel) {
      if (this.#position === "floating") this.#applyFloatingGeometry(panel);
      const toolbar = panel.querySelector(".toolbar");
      const tabs = toolbar?.querySelector(".tabs");
      toolbar?.addEventListener("pointerdown", (event) => {
        const target = event.target instanceof Element ? event.target : null;
        if (target !== toolbar && target !== tabs && !target?.closest(".drag-grip")) return;
        this.#startFloatingInteraction(event, panel);
      });
      panel.querySelectorAll(".resize-handle").forEach((handle) => {
        handle.addEventListener("pointerdown", (event) => {
          this.#startFloatingInteraction(event, panel, handle.dataset.resize);
        });
      });
    }
    for (const option of positionOptions) {
      option.addEventListener("click", () => applyPosition(option.dataset.position));
    }
    positionSwitch?.addEventListener("keydown", (event) => {
      if (!(event instanceof KeyboardEvent) || !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      const current = event.target instanceof HTMLButtonElement ? positionOptions.indexOf(event.target) : positionOptions.findIndex((option) => option.getAttribute("aria-checked") === "true");
      let next = current;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = positionOptions.length - 1;
      if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (current + 1) % positionOptions.length;
      if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (current - 1 + positionOptions.length) % positionOptions.length;
      applyPosition(positionOptions[next].dataset.position, true);
    });
    this.shadowRoot.querySelector(".copy")?.addEventListener("click", () => void this.#copyCurrent());
    this.shadowRoot.querySelectorAll("[data-view]").forEach((button) => {
      button.addEventListener("click", () => this.#setView(button.dataset.view));
    });
    this.#configureLinkClicks();
  }
};

// src/index.ts
if (!customElements.get("ia2-rdf-navigator")) {
  customElements.define("ia2-rdf-navigator", Ia2RdfNavigator);
}
function mountRdfNavigator(target = document) {
  const existing = target.querySelector("ia2-rdf-navigator");
  if (existing) return existing;
  const navigator2 = target.createElement("ia2-rdf-navigator");
  target.body.append(navigator2);
  return navigator2;
}
function autoMount() {
  if (window.__IA2_RDF_NAVIGATOR_NO_AUTO__) return;
  mountRdfNavigator();
}
if (typeof window !== "undefined" && typeof document !== "undefined") {
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", autoMount, { once: true });
  else autoMount();
}
export {
  Ia2RdfNavigator,
  extractDataset,
  mountRdfNavigator,
  serializeJsonLd,
  serializeTurtle,
  termToTurtle
};
//# sourceMappingURL=html-rdf-navigator.js.map
