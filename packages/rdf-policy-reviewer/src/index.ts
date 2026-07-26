export { Ia2RdfPolicyReviewer } from "./rdf-policy-reviewer.js";
export { diffQuads, quadKey } from "./diff.js";
export type { SemanticChange } from "./diff.js";
export type {
  PolicyFinding,
  PolicySeverity,
  PolicyValidationOptions,
  PolicyValidationResult,
} from "./validation.js";
import type * as RDF from "@rdfjs/types";
import type {
  PolicyValidationOptions,
  PolicyValidationResult,
} from "./validation.js";

/**
 * Compatibility root export. New headless consumers should import
 * `@ia2-dev/rdf-policy-reviewer/validation` directly.
 */
export async function validatePolicy(
  data: RDF.DatasetCore,
  shapes: RDF.DatasetCore,
  options: PolicyValidationOptions = {},
): Promise<PolicyValidationResult> {
  const module = await import("./validation.js");
  return module.validatePolicy(data, shapes, options);
}

import { Ia2RdfPolicyReviewer } from "./rdf-policy-reviewer.js";

declare global {
  interface HTMLElementTagNameMap {
    "ia2-rdf-policy-reviewer": Ia2RdfPolicyReviewer;
  }
}

if (!customElements.get("ia2-rdf-policy-reviewer")) {
  customElements.define("ia2-rdf-policy-reviewer", Ia2RdfPolicyReviewer);
}
