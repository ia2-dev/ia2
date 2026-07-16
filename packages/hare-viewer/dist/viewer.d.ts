import { type HareEnvelope } from "./model.js";
export type HareViewerMode = "auto" | "full" | "tabs";
export declare class HareViewerElement extends HTMLElement {
    #private;
    connectedCallback(): void;
    disconnectedCallback(): void;
    get mode(): Exclude<HareViewerMode, "auto">;
    get envelope(): HareEnvelope | null;
    get filesOpen(): boolean;
    openFiles(): void;
    closeFiles(): void;
}
