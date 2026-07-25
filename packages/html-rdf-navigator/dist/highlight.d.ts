type Syntax = "turtle" | "json" | "html" | "sparql";
/** Create highlighted, link-safe code without injecting source strings as HTML. */
export declare function highlightedCode(source: string, syntax: Syntax, document: Document): HTMLElement;
export {};
