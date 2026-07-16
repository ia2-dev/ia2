import type { HareEnvelope, HareRepresentation } from "./model.js";
export type HareNavigationTarget = {
    kind: "representation";
    representation: HareRepresentation;
    fragment: string | null;
} | {
    kind: "host";
    fragment: string | null;
} | {
    kind: "external";
    url: string;
} | {
    kind: "blocked";
    reason: string;
};
export declare function hareRepresentationUrl(envelope: HareEnvelope, representation: HareRepresentation): string | null;
export declare function resolveHareNavigation(envelope: HareEnvelope, current: HareRepresentation, reference: string): HareNavigationTarget;
