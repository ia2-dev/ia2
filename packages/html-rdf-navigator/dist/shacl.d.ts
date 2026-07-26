import type { ExtractionResult, GraphTerm, Quad, SubjectTerm } from "./model.js";
export type ShaclShapeKind = "node" | "property";
export interface ShaclShape {
    constraints: Quad[];
    description?: string;
    graphs: GraphTerm[];
    group?: SubjectTerm;
    kinds: ShaclShapeKind[];
    label?: string;
    order?: number;
    paths: Quad[];
    properties: Quad[];
    quads: Quad[];
    sources: Element[];
    targets: Quad[];
    term: SubjectTerm;
}
export interface ShaclPropertyGroup {
    label?: string;
    order?: number;
    quads: Quad[];
    term: SubjectTerm;
}
export interface ShaclCatalog {
    count: number;
    groups: ShaclPropertyGroup[];
    shapes: ShaclShape[];
}
/**
 * Build a UI-oriented catalog of SHACL shapes without executing validation or
 * rules. Explicitly typed shapes are included alongside the SHACL-defined
 * implicit cases established by targets, paths, properties, and direct
 * shape-valued constraints.
 */
export declare function extractShaclCatalog(result: ExtractionResult): ShaclCatalog;
