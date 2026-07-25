export declare const COMPLETION_VALUES_PROFILE = "https://ia2.dev/spec/html-rdf#completion-values-profile";
export type CompletionFormat = "html" | "turtle";
export interface CompletionRecord {
    label: string;
    object: CompletionStatement["object"];
    predicate: string;
    subject: string;
}
export interface CompletionDocument {
    createdAt: string;
    records: CompletionRecord[];
    sourceDocumentIri: string;
    stateIri: string;
    title: string;
}
export interface ParsedCompletionDocument {
    issues: string[];
    sourceDocumentIris: string[];
    statements: CompletionStatement[];
}
export interface CompletionStatement {
    object: {
        datatype?: string;
        direction?: "ltr" | "rtl";
        language?: string;
        termType: "Literal" | "NamedNode";
        value: string;
    };
    predicate: string;
    subject: string;
}
export interface ParseCompletionOptions {
    baseIri: string;
    contentType?: string;
    document: Document;
}
export declare function serializeCompletionDocument(document: CompletionDocument, format: CompletionFormat): string;
export declare function parseCompletionDocument(source: string, options: ParseCompletionOptions): Promise<ParsedCompletionDocument>;
