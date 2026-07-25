export { extractDataset } from "./extract.js";
export type { ExtractionRoot } from "./extract.js";
export { PREFIXES, compactTerm, containsTripleTerms, serializeJsonLd, serializeTurtle, termToTurtle, } from "./serialize.js";
export { RDF_DIR_LANG_STRING, RDF_LANG_STRING, XSD_STRING, blankNode, namedNode, } from "./model.js";
export type * from "./model.js";
export { DEFAULT_LABEL_PREDICATES, HTML_RDF_DATASET_CHANGE_EVENT, annotationTargetIris, annotationTargetIrisForAnnotation, labelFor, labelMap, termLabelMap, namedResource, projectQuadsToDefaultGraph, } from "./semantics.js";
export type { GraphProjectionOptions, LabelOptions } from "./semantics.js";
export { toRdfJsDataset, toRdfJsLiteral, toRdfJsQuad, toRdfJsTerm, } from "./rdfjs.js";
export type { RdfJsDataFactory, RdfJsDatasetFactory } from "./rdfjs.js";
