import type {
  GraphTerm,
  Literal,
  ObjectTerm,
  Quad,
  SubjectTerm,
  TripleTerm,
} from "./model.js";

export interface RdfJsDataFactory {
  blankNode(value?: string): any;
  defaultGraph(): any;
  literal(value: string, languageOrDatatype?: any): any;
  namedNode(value: string): any;
  quad(subject: any, predicate: any, object: any, graph?: any): any;
}

export interface RdfJsDatasetFactory {
  dataset(quads?: Iterable<any>): any;
}

export function toRdfJsTerm(
  term: SubjectTerm | ObjectTerm,
  factory: RdfJsDataFactory,
): any {
  if (term.termType === "NamedNode") return factory.namedNode(term.value);
  if (term.termType === "BlankNode") return factory.blankNode(term.value);
  if (term.termType === "Literal") return toRdfJsLiteral(term, factory);
  return toRdfJsTriple(term, factory);
}

export function toRdfJsLiteral(term: Literal, factory: RdfJsDataFactory): any {
  if (term.language || term.direction) {
    return factory.literal(term.value, {
      language: term.language,
      ...(term.direction ? { direction: term.direction } : {}),
    });
  }
  return factory.literal(term.value, factory.namedNode(term.datatype.value));
}

function toRdfJsTriple(term: TripleTerm, factory: RdfJsDataFactory): any {
  return factory.quad(
    toRdfJsTerm(term.subject, factory),
    factory.namedNode(term.predicate.value),
    toRdfJsTerm(term.object, factory),
  );
}

function toRdfJsGraph(term: GraphTerm | null, factory: RdfJsDataFactory): any {
  return term ? toRdfJsTerm(term, factory) : factory.defaultGraph();
}

export function toRdfJsQuad(quad: Quad, factory: RdfJsDataFactory): any {
  return factory.quad(
    toRdfJsTerm(quad.subject, factory),
    factory.namedNode(quad.predicate.value),
    toRdfJsTerm(quad.object, factory),
    toRdfJsGraph(quad.graph, factory),
  );
}

export function toRdfJsDataset(
  quads: readonly Quad[],
  factory: RdfJsDataFactory,
  datasetFactory: RdfJsDatasetFactory,
): any {
  return datasetFactory.dataset(quads.map((quad) => toRdfJsQuad(quad, factory)));
}
