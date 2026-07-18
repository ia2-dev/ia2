import type { Diagnostic, ExtractionResult, GraphTerm, NamedNode, ObjectTerm, SubjectTerm } from "./model.js";
export type NavigatorSourceAccess = "direct" | "portable";
export interface NavigatorSource {
    access: NavigatorSourceAccess;
    id: string;
    label: string;
    origin: string;
    result: ExtractionResult;
    url: string;
}
export interface PortableSourceElement {
    id: string;
    markup: string;
}
export interface PortableQuad {
    graph: GraphTerm | null;
    object: ObjectTerm;
    predicate: NamedNode;
    sourceId: string;
    subject: SubjectTerm;
}
export interface PortableDiagnostic extends Omit<Diagnostic, "source"> {
    sourceId?: string;
}
export interface PortableExtractionResult extends Omit<ExtractionResult, "diagnostics" | "quads"> {
    diagnostics: PortableDiagnostic[];
    portableVersion: 1;
    quads: PortableQuad[];
    sources: PortableSourceElement[];
}
export interface PortableNavigatorSource extends Omit<NavigatorSource, "access" | "result"> {
    access: "portable";
    result: PortableExtractionResult;
}
/** Convert an extraction result to structured-clone-safe data for extension frame boundaries. */
export declare function toPortableExtractionResult(result: ExtractionResult): PortableExtractionResult;
/** Rehydrate portable data with inert carrier elements for source-code display. */
export declare function fromPortableExtractionResult(result: PortableExtractionResult, ownerDocument: Document): ExtractionResult;
