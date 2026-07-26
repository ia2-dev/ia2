// ../html-rdf/dist/index.js
var XSD_STRING = "http://www.w3.org/2001/XMLSchema#string";
var RDF_LANG_STRING = "http://www.w3.org/1999/02/22-rdf-syntax-ns#langString";
var RDF_DIR_LANG_STRING = "http://www.w3.org/1999/02/22-rdf-syntax-ns#dirLangString";
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
export {
  PREFIXES,
  compactTerm,
  containsTripleTerms,
  serializeJsonLd,
  serializeTurtle,
  termToTurtle
};
