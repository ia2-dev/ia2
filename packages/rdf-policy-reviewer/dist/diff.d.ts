import type { Quad } from "@ia2-dev/html-rdf";
export type SemanticChange = {
    kind: "added" | "removed";
    quad: Quad;
    previousQuad?: never;
} | {
    kind: "changed";
    quad: Quad;
    previousQuad: Quad;
};
export declare function quadKey(quad: Quad): string;
/**
 * Return set-level RDF changes for graphs whose resources have stable names.
 * Blank-node datasets require canonicalization before comparison.
 * A slot with exactly one object before and after is reported as one change;
 * multivalued slots retain separate additions and removals.
 */
export declare function diffQuads(previous: readonly Quad[], current: readonly Quad[], graphFilter?: ReadonlySet<string>): SemanticChange[];
