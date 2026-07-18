import type * as RDF from "@rdfjs/types";
import Parser from "n3/src/N3Parser.js";
import DataFactory from "n3/src/N3DataFactory.js";
import type { ParsedRdfHtml, RdfHtmlDataset, RdfHtmlDocumentDescriptor, RdfHtmlNode } from "./model.js";
import { RdfHtmlError } from "./model.js";
import { TERMS } from "./vocabulary.js";

function sameTerm(left: RDF.Term, right: RDF.Term): boolean {
  return left.equals(right);
}

function objects(dataset: RdfHtmlDataset, subject: RDF.Term, predicate: string): RDF.Term[] {
  const predicateNode = DataFactory.namedNode(predicate);
  const values: RDF.Term[] = [];
  for (const quad of dataset) {
    if (sameTerm(quad.subject, subject) && sameTerm(quad.predicate, predicateNode)
      && !values.some((value) => sameTerm(value, quad.object))) values.push(quad.object);
  }
  return values;
}

function nodeId(node: RDF.Term): string {
  return node.termType === "NamedNode" ? node.value : `_:${node.value}`;
}

function isNode(term: RDF.Term): term is RdfHtmlNode {
  return term.termType === "NamedNode" || term.termType === "BlankNode";
}

class ArrayDataset implements RDF.DatasetCore<RDF.Quad> {
  #quads: RDF.Quad[];

  constructor(quads: readonly RDF.Quad[]) {
    this.#quads = [...quads];
  }

  get size(): number { return this.#quads.length; }
  [Symbol.iterator](): Iterator<RDF.Quad> { return this.#quads[Symbol.iterator](); }
  add(quad: RDF.Quad): this {
    if (!this.has(quad)) this.#quads.push(quad);
    return this;
  }
  delete(quad: RDF.Quad): this {
    this.#quads = this.#quads.filter((candidate) => !candidate.equals(quad));
    return this;
  }
  has(quad: RDF.Quad): boolean { return this.#quads.some((candidate) => candidate.equals(quad)); }
  match(subject?: RDF.Term | null, predicate?: RDF.Term | null, object?: RDF.Term | null, graph?: RDF.Term | null): RDF.DatasetCore<RDF.Quad> {
    return new ArrayDataset(this.#quads.filter((quad) => (
      (!subject || quad.subject.equals(subject))
      && (!predicate || quad.predicate.equals(predicate))
      && (!object || quad.object.equals(object))
      && (!graph || quad.graph.equals(graph))
    )));
  }
}

export function findHtmlDocuments(dataset: RdfHtmlDataset): RdfHtmlDocumentDescriptor[] {
  const type = DataFactory.namedNode(TERMS.rdfType);
  const documentClass = DataFactory.namedNode(TERMS.document);
  const documents: RdfHtmlDocumentDescriptor[] = [];
  const seen = new Set<string>();

  for (const quad of dataset) {
    if (!sameTerm(quad.predicate, type) || !sameTerm(quad.object, documentClass) || !isNode(quad.subject)) continue;
    const id = nodeId(quad.subject);
    if (seen.has(id)) continue;
    seen.add(id);
    const bases = objects(dataset, quad.subject, TERMS.base).filter((term) => term.termType === "NamedNode");
    const titles = objects(dataset, quad.subject, TERMS.title).filter((term) => term.termType === "Literal");
    const baseIRI = bases.length === 1 ? bases[0]!.value : "";
    documents.push({
      baseIRI,
      label: titles[0]?.value || (quad.subject.termType === "NamedNode" ? quad.subject.value : id),
      node: quad.subject,
      nodeId: id,
    });
  }

  return documents.sort((left, right) => left.label.localeCompare(right.label));
}

function normalizedContentType(value: string | undefined): "text/turtle" | "application/trig" {
  const type = value?.split(";", 1)[0]?.trim().toLowerCase();
  if (type === "application/trig" || type === "application/x-trig") return "application/trig";
  return "text/turtle";
}

export function parseRdfHtml(source: string, options: { baseIRI: string; contentType?: string }): ParsedRdfHtml {
  const contentType = normalizedContentType(options.contentType);
  let quads: RDF.Quad[];
  try {
    const parser = new Parser({ baseIRI: options.baseIRI, format: contentType });
    quads = parser.parse(source) as unknown as RDF.Quad[];
  } catch (error) {
    throw new RdfHtmlError(`Could not parse ${contentType === "application/trig" ? "TriG" : "Turtle"}: ${error instanceof Error ? error.message : String(error)}`);
  }
  const dataset: RdfHtmlDataset = new ArrayDataset(quads);
  return { contentType, dataset, documents: findHtmlDocuments(dataset) };
}
