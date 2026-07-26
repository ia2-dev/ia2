import { type ExtractionResult } from "./model.js";
export type ExtractionRoot = Document | DocumentFragment | Element;
/** Extract the IA² HTML/RDF dataset represented by a document, fragment, or semantic island. */
export declare function extractDataset(root?: ExtractionRoot): ExtractionResult;
