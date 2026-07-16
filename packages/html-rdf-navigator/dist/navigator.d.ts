export type DrawerPosition = "right" | "right-top" | "right-bottom" | "floating" | "left" | "left-bottom" | "left-top";
export declare class Ia2RdfNavigator extends HTMLElement {
    #private;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    /** Re-extract the current owner document and redraw every view. */
    refresh(): void;
    open(focusTarget?: "panel" | "tab"): void;
    close(): void;
    toggle(focusTarget?: "panel" | "tab"): void;
    /** Open the Navigator at the statement carriers produced by one document element. */
    revealSource(source: Element, position?: DrawerPosition): boolean;
}
