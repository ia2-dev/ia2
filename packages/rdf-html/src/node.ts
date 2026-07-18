import { JSDOM } from "jsdom";
import type { HtmlToRdfHtmlOptions } from "./model.js";
import { htmlDocumentToRdfHtml } from "./convert.js";

/**
 * Parse an HTML string in Node.js and describe its resulting DOM as RDF/HTML.
 * Browser callers that already have a Document should use
 * htmlDocumentToRdfHtml() from the package root instead.
 */
export function htmlToRdfHtml(html: string, options: HtmlToRdfHtmlOptions): string {
  const dom = new JSDOM(html, { url: options.baseIRI });
  try {
    return htmlDocumentToRdfHtml(dom.window.document, options);
  } finally {
    dom.window.close();
  }
}

export type { HtmlToRdfHtmlOptions } from "./model.js";
