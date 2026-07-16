export declare const HARE = "https://ia2.dev/spec/resource-envelope#";
interface HareRepresentationBase {
    id: string;
    resourceId: string;
    title: string;
    path: string | null;
    mediaType: string;
    carrier: string;
}
export interface HareDomRepresentation extends HareRepresentationBase {
    kind: "dom";
}
export interface HareByteRepresentation extends HareRepresentationBase {
    kind: "bytes";
    byteLength: number;
    integrity: string;
}
export type HareRepresentation = HareDomRepresentation | HareByteRepresentation;
export interface HareEnvelope {
    id: string;
    conformsTo: string[];
    manifestGraph: string;
    virtualBase: string;
    profile: "declarative" | "self-viewing";
    representations: HareRepresentation[];
}
export interface VerifiedHareRepresentation {
    representation: HareByteRepresentation;
    bytes: Uint8Array;
}
export declare function readHareEnvelope(target?: Document): HareEnvelope;
export declare function verifyHareRepresentation(representation: HareByteRepresentation, target?: Document): Promise<VerifiedHareRepresentation>;
export declare function getHareDomCarrier(representation: HareDomRepresentation, target?: Document): HTMLTemplateElement;
export {};
