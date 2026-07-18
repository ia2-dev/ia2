import type * as RDF from "@rdfjs/types";
import { XSD } from "./vocabulary.js";

function escapeAttribute(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;");
}

function blankKeys(quads: readonly RDF.Quad[]): Map<string, string> {
  const keys = new Map<string, string>();
  let next = 1;
  const visit = (term: RDF.Term): void => {
    if (term.termType === "BlankNode" && !keys.has(term.value)) keys.set(term.value, `rdfhtml-b${next++}`);
    if (term.termType === "Quad") {
      visit(term.subject);
      visit(term.object);
    }
  };
  for (const quad of quads) {
    visit(quad.subject);
    visit(quad.object);
    visit(quad.graph);
  }
  return keys;
}

function subjectAttributes(subject: RDF.Quad_Subject, keys: Map<string, string>): string[] {
  if (subject.termType === "NamedNode") return [`rdf-subject="${escapeAttribute(subject.value)}"`];
  if (subject.termType === "BlankNode") return [`rdf-subject-key="${escapeAttribute(keys.get(subject.value) ?? subject.value)}"`];
  throw new Error(`HTML/RDF cannot carry ${subject.termType} in subject position.`);
}

function graphAttributes(graph: RDF.Quad_Graph, keys: Map<string, string>): string[] {
  if (graph.termType === "DefaultGraph") return [];
  if (graph.termType === "NamedNode") return [`rdf-graph="${escapeAttribute(graph.value)}"`];
  if (graph.termType === "BlankNode") return [`rdf-graph-key="${escapeAttribute(keys.get(graph.value) ?? graph.value)}"`];
  throw new Error(`HTML/RDF cannot carry ${graph.termType} as a graph name.`);
}

function literalAttributes(literal: RDF.Literal): string[] {
  const attributes = [`value="${escapeAttribute(literal.value)}"`];
  const direction = literal.direction;
  if (literal.language) {
    attributes.push(`lang="${escapeAttribute(literal.language)}"`);
    if (direction === "ltr" || direction === "rtl") attributes.push(`dir="${direction}"`);
  } else if (literal.datatype.value !== `${XSD}string`) {
    attributes.push(`rdf-datatype="${escapeAttribute(literal.datatype.value)}"`);
  }
  return attributes;
}

function statementCarrier(
  subject: RDF.Quad_Subject,
  predicate: RDF.Quad_Predicate,
  object: RDF.Quad_Object,
  graph: RDF.Quad_Graph,
  keys: Map<string, string>,
  hidden: boolean,
): string {
  const attributes = [
    ...(hidden ? ["hidden"] : []),
    ...subjectAttributes(subject, keys),
    `rdf-predicate="${escapeAttribute(predicate.value)}"`,
    ...graphAttributes(graph, keys),
  ];

  if (object.termType === "NamedNode") {
    attributes.push(`href="${escapeAttribute(object.value)}"`);
    return `<a ${attributes.join(" ")}></a>`;
  }
  if (object.termType === "BlankNode") {
    attributes.push(`rdf-object-key="${escapeAttribute(keys.get(object.value) ?? object.value)}"`);
    return `<meta ${attributes.join(" ")}>`;
  }
  if (object.termType === "Literal") {
    attributes.push(...literalAttributes(object));
    return `<data ${attributes.join(" ")}></data>`;
  }
  if (object.termType === "Quad") {
    const nested = statementCarrier(object.subject, object.predicate, object.object, object.graph, keys, false);
    return `<span ${attributes.join(" ")}><template>${nested}</template></span>`;
  }
  throw new Error(`HTML/RDF cannot carry ${object.termType} in object position.`);
}

export function quadsToHtmlRdf(quads: readonly RDF.Quad[]): string {
  if (quads.length === 0) return "";
  const keys = blankKeys(quads);
  return quads.map((quad) => statementCarrier(quad.subject, quad.predicate, quad.object, quad.graph, keys, true)).join("\n");
}
