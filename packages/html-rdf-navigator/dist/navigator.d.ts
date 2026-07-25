import { type WindowPosition } from "@ia2-dev/ui-primitives";
import { type PortableNavigatorSource } from "./sources.js";
export type DrawerPosition = WindowPosition;
export declare class Ia2RdfNavigator extends HTMLElement {
    #private;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    /** Supply structured-clone-safe document sources collected by an extension. */
    setSources(sources: readonly PortableNavigatorSource[]): void;
    /** Re-extract the current owner document and redraw every view. */
    refresh(): void;
    open(focusTarget?: "panel" | "tab"): void;
    close(): void;
    toggle(focusTarget?: "panel" | "tab"): void;
    /** Open the Navigator at the statement carriers produced by one document element. */
    revealSource(source: Element, position?: DrawerPosition): boolean;
}
