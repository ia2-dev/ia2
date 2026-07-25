import { type ExtractionRoot } from "@ia2-dev/html-rdf";
import { type SemanticChange } from "./diff.js";
import type { PolicyValidationResult } from "./validation.js";
export declare class Ia2RdfPolicyReviewer extends HTMLElement {
    #private;
    static observedAttributes: string[];
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void;
    get sourceRoot(): ExtractionRoot | null;
    set sourceRoot(root: ExtractionRoot | null);
    get profileRoot(): ExtractionRoot | null;
    set profileRoot(root: ExtractionRoot | null);
    get validationResult(): PolicyValidationResult | undefined;
    get semanticChanges(): readonly SemanticChange[];
    refresh(): Promise<PolicyValidationResult | undefined>;
}
