import type { ExtractionResult } from "./model.js";
export interface SparqlResultTerm {
    datatype?: string;
    direction?: string;
    language?: string;
    termType: string;
    value: string;
}
export type SparqlExecutionResult = {
    kind: "ask";
    value: boolean;
} | {
    kind: "bindings";
    rows: Array<Record<string, SparqlResultTerm>>;
    variables: string[];
} | {
    kind: "quads";
    quads: Array<{
        graph: SparqlResultTerm;
        object: SparqlResultTerm;
        predicate: SparqlResultTerm;
        subject: SparqlResultTerm;
    }>;
};
/** Execute one read-only SPARQL query against the currently extracted RDF/JS dataset. */
export declare function executeSparql(queryText: string, result: ExtractionResult): Promise<SparqlExecutionResult>;
