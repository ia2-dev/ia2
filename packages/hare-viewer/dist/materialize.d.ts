import { type HareByteRepresentation, type HareDomRepresentation, type HareEnvelope, type VerifiedHareRepresentation } from "./model.js";
export interface HareMaterializationIssue {
    attribute: string;
    reference: string;
    reason: string;
}
export interface HareMaterializationResult {
    source: string;
    issues: HareMaterializationIssue[];
    materializedRepresentations: string[];
    objectUrls: string[];
}
export interface HareHostMaterializationResult {
    issues: HareMaterializationIssue[];
    materializedRepresentations: string[];
    objectUrls: string[];
    references: number;
}
export interface HareMaterializationOptions {
    createObjectURL?: (blob: Blob) => string;
    verify?: (representation: HareByteRepresentation, target: Document) => Promise<VerifiedHareRepresentation>;
}
/**
 * Derive a sandboxed HTML browsing document from a DOM representation and
 * materialize verified passive byte subresources into object URLs.
 */
export declare function materializeHareDomRepresentation(envelope: HareEnvelope, representation: HareDomRepresentation, carrier: HTMLTemplateElement, target?: Document, options?: HareMaterializationOptions): Promise<HareMaterializationResult>;
/**
 * Materialize explicitly inert `data-hare-src` references in the authored
 * host document. Keeping the virtual URL outside `src` prevents the browser
 * from attempting a network request before verification has completed.
 */
export declare function materializeHareHostSubresources(envelope: HareEnvelope, target?: Document, options?: HareMaterializationOptions): Promise<HareHostMaterializationResult>;
