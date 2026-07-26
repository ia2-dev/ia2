export { Ia2RdfPolicyReviewer } from "./rdf-policy-reviewer.js";
export { diffQuads, quadKey } from "./diff.js";
export type { SemanticChange } from "./diff.js";
export type { PolicyFinding, PolicySeverity, PolicyValidationOptions, PolicyValidationResult, } from "./validation.js";
import type * as RDF from "@rdfjs/types";
import type { PolicyValidationOptions, PolicyValidationResult } from "./validation.js";
/**
 * Compatibility root export. New headless consumers should import
 * `@ia2-dev/rdf-policy-reviewer/validation` directly.
 */
export declare function validatePolicy(data: RDF.DatasetCore, shapes: RDF.DatasetCore, options?: PolicyValidationOptions): Promise<PolicyValidationResult>;
import { Ia2RdfPolicyReviewer } from "./rdf-policy-reviewer.js";
declare global {
    interface HTMLElementTagNameMap {
        "ia2-rdf-policy-reviewer": Ia2RdfPolicyReviewer;
    }
}
