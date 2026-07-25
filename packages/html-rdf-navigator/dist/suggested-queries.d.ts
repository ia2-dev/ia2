import type { ExtractionResult } from "./model.js";
export type SuggestedSparqlQueryKind = "ask" | "construct" | "select";
export interface SuggestedSparqlQuery {
    description: string;
    id: string;
    kind: SuggestedSparqlQueryKind;
    label: string;
    order: number;
    query: string;
}
export interface SuggestedSparqlQueryCatalog {
    diagnostics: string[];
    queries: SuggestedSparqlQuery[];
}
/**
 * Discover document-authored query examples expressed with SHACL's SPARQL
 * executable classes and query predicates. The executable resources may live
 * in any graph, so a document can keep its query catalog separate from its
 * domain data.
 */
export declare function extractSuggestedSparqlQueryCatalog(result: ExtractionResult): SuggestedSparqlQueryCatalog;
/** Compatibility convenience for consumers that only need valid suggestions. */
export declare function extractSuggestedSparqlQueries(result: ExtractionResult): SuggestedSparqlQuery[];
