export interface NamedNode {
    termType: "NamedNode";
    value: string;
}
export interface BlankNode {
    termType: "BlankNode";
    value: string;
}
export interface Literal {
    termType: "Literal";
    value: string;
    datatype: NamedNode;
    language: string;
    direction?: "ltr" | "rtl";
}
export interface TripleTerm {
    termType: "Triple";
    subject: SubjectTerm;
    predicate: NamedNode;
    object: ObjectTerm;
}
export type SubjectTerm = NamedNode | BlankNode;
export type ObjectTerm = NamedNode | BlankNode | Literal | TripleTerm;
export type GraphTerm = NamedNode | BlankNode;
export interface Quad {
    subject: SubjectTerm;
    predicate: NamedNode;
    object: ObjectTerm;
    graph: GraphTerm | null;
    source: Element;
}
export interface Diagnostic {
    severity: "warning" | "error";
    code: string;
    message: string;
    source?: Element;
}
export interface ExtractionResult {
    version: "1.2";
    quads: Quad[];
    /** Includes declared empty graphs as well as graphs used by quads. */
    graphs: GraphTerm[];
    diagnostics: Diagnostic[];
    /** The IRI from which the HTML representation was obtained. */
    retrievalDocumentIri: string;
    /** The canonical document IRI when declared, otherwise the retrieval IRI. */
    sourceDocumentIri: string;
    /** The IRI used to resolve ordinary relative RDF IRI references. */
    baseIri: string;
}
export declare const namedNode: (value: string) => NamedNode;
export declare const blankNode: (value: string) => BlankNode;
export declare const XSD_STRING = "http://www.w3.org/2001/XMLSchema#string";
export declare const RDF_LANG_STRING = "http://www.w3.org/1999/02/22-rdf-syntax-ns#langString";
export declare const RDF_DIR_LANG_STRING = "http://www.w3.org/1999/02/22-rdf-syntax-ns#dirLangString";
