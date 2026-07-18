import type * as RDF from "@rdfjs/types";
export type RdfHtmlDataset = RDF.DatasetCore<RDF.Quad>;
export type RdfHtmlNode = RDF.NamedNode | RDF.BlankNode;
export interface RdfHtmlIssue {
    code: string;
    message: string;
    node?: string;
}
export interface RdfHtmlDocumentDescriptor {
    baseIRI: string;
    label: string;
    node: RdfHtmlNode;
    nodeId: string;
}
export interface ParsedRdfHtml {
    contentType: "text/turtle" | "application/trig";
    dataset: RdfHtmlDataset;
    documents: RdfHtmlDocumentDescriptor[];
}
export interface HtmlToRdfHtmlOptions {
    attribution?: string;
    baseIRI: string;
    description?: string;
    documentIRI: string;
    licenseIRI?: string;
    sourceIRI?: string;
    title?: string;
}
export interface RenderedRdfHtmlDocument {
    baseIRI: string;
    consumedQuads: readonly RDF.Quad[];
    descriptor: RdfHtmlDocumentDescriptor;
    /** Faithful serialization of the described HTML tree. */
    html: string;
    /** HTML/RDF publication form that preserves unused RDF statements. */
    publicationHtml: string;
    preservedHtml: string;
    preservedQuads: readonly RDF.Quad[];
    warnings: readonly RdfHtmlIssue[];
}
export interface RdfHtmlWorkspaceOptions {
    contentType?: string;
    sourceUrl: string;
    title?: string;
}
export declare class RdfHtmlError extends Error {
    readonly issues: readonly RdfHtmlIssue[];
    constructor(message: string, issues?: readonly RdfHtmlIssue[]);
}
