import type * as RDF from "@rdfjs/types";
export type PolicySeverity = "info" | "warning" | "violation";
export interface PolicyFinding {
    focusNode?: string;
    message: string;
    name: string;
    path?: string;
    severity: PolicySeverity;
    severityIri?: string;
    sourceShape?: string;
    /** First navigation target, retained as a convenience for simple consumers. */
    target?: string;
    targets: string[];
    value?: string;
}
export interface PolicyValidationResult {
    conforms: boolean;
    findings: PolicyFinding[];
}
export interface PolicyValidationOptions {
    languages?: readonly string[];
}
/**
 * Validate one RDF/JS data graph against one independently supplied RDF/JS
 * SHACL graph. HTML/RDF extraction and named-graph projection belong to
 * adapters, not this headless policy engine.
 */
export declare function validatePolicy(data: RDF.DatasetCore, shapes: RDF.DatasetCore, options?: PolicyValidationOptions): Promise<PolicyValidationResult>;
