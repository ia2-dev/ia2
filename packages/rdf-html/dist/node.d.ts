import type { HtmlToRdfHtmlOptions } from "./model.js";
/**
 * Parse an HTML string in Node.js and describe its resulting DOM as RDF/HTML.
 * Browser callers that already have a Document should use
 * htmlDocumentToRdfHtml() from the package root instead.
 */
export declare function htmlToRdfHtml(html: string, options: HtmlToRdfHtmlOptions): string;
export type { HtmlToRdfHtmlOptions } from "./model.js";
