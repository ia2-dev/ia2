import type { RenderedRdfHtmlDocument, RdfHtmlDataset, RdfHtmlDocumentDescriptor } from "./model.js";
export declare function embedHtmlRdf(html: string, preservedHtml: string): string;
export declare function renderRdfHtmlDocument(dataset: RdfHtmlDataset, descriptor: RdfHtmlDocumentDescriptor): RenderedRdfHtmlDocument;
