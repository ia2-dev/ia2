import type { ParsedRdfHtml, RdfHtmlDataset, RdfHtmlDocumentDescriptor } from "./model.js";
export declare function findHtmlDocuments(dataset: RdfHtmlDataset): RdfHtmlDocumentDescriptor[];
export declare function parseRdfHtml(source: string, options: {
    baseIRI: string;
    contentType?: string;
}): ParsedRdfHtml;
