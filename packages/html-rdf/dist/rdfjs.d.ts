import type { Literal, ObjectTerm, Quad, SubjectTerm } from "./model.js";
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
export declare function toRdfJsTerm(term: SubjectTerm | ObjectTerm, factory: RdfJsDataFactory): any;
export declare function toRdfJsLiteral(term: Literal, factory: RdfJsDataFactory): any;
export declare function toRdfJsQuad(quad: Quad, factory: RdfJsDataFactory): any;
export declare function toRdfJsDataset(quads: readonly Quad[], factory: RdfJsDataFactory, datasetFactory: RdfJsDatasetFactory): any;
