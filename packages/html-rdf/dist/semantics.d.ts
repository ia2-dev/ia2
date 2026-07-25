import type { NamedNode, Quad, SubjectTerm } from "./model.js";
export declare const HTML_RDF_DATASET_CHANGE_EVENT = "ia2-rdf-dataset-change";
export declare const DEFAULT_LABEL_PREDICATES: readonly ["http://www.w3.org/2000/01/rdf-schema#label", "http://www.w3.org/2004/02/skos/core#prefLabel", "http://purl.org/dc/terms/title", "https://schema.org/name"];
export interface LabelOptions {
    languages?: readonly string[];
    predicates?: readonly string[];
}
/**
 * Resolve one deterministic human label. Predicate order takes precedence,
 * followed by requested language order and then source order.
 */
export declare function labelFor(quads: readonly Quad[], resource: string | SubjectTerm, options?: LabelOptions): string | undefined;
/** Build a deterministic label map for every named resource in a quad set. */
export declare function labelMap(quads: readonly Quad[], options?: LabelOptions): Map<string, string>;
/** Build labels keyed as `NamedNode:iri` or `BlankNode:label`. */
export declare function termLabelMap(quads: readonly Quad[], options?: LabelOptions): Map<string, string>;
/**
 * Resolve Web Annotation targets for a body. A direct named target is returned
 * as-is. A SpecificResource-like target is resolved through oa:hasSource.
 */
export declare function annotationTargetIris(quads: readonly Quad[], body: string | SubjectTerm): string[];
export declare function annotationTargetIrisForAnnotation(quads: readonly Quad[], annotation: string | SubjectTerm): string[];
export interface GraphProjectionOptions {
    /** Undefined selects all graphs. Null selects the default graph. */
    graphs?: readonly (string | null)[];
}
/**
 * Project selected dataset graphs into one explicit RDF graph for graph-based
 * algorithms such as SHACL validation. Duplicate quads are left to the target
 * RDF/JS DatasetCore implementation to coalesce.
 */
export declare function projectQuadsToDefaultGraph(quads: readonly Quad[], options?: GraphProjectionOptions): Quad[];
export declare function namedResource(value: string): NamedNode;
