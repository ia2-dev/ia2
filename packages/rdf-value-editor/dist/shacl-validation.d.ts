import type { Literal, NamedNode, Quad } from "@ia2-dev/html-rdf";
export type ShaclAuthorValue = NamedNode | Literal;
export interface ShaclAuthoringBinding {
    key: string;
    shape: string;
    subject: string;
    path: string;
    active: boolean;
    object?: ShaclAuthorValue;
    representationError?: string;
}
export interface ShaclAuthoringResult {
    conforms: boolean;
    messages: Map<string, string[]>;
    resultCount: number;
}
/**
 * Project the HTML/RDF dataset into one explicit SHACL data graph, then
 * validate every active authoring shape in one engine invocation. Activation
 * remains a presentation concern; inactive shapes are not supplied to the
 * validator.
 */
export declare function validateShaclAuthoringState(sourceQuads: readonly Quad[], bindings: readonly ShaclAuthoringBinding[]): Promise<ShaclAuthoringResult>;
