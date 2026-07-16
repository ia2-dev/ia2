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
}
