import type { ExtractionResult, NamedNode } from "./model.js";
export type VocabularyKind = "class" | "property";
export interface VocabularyDefinition {
    classParents: NamedNode[];
    kinds: VocabularyKind[];
    label?: string;
    propertyParents: NamedNode[];
    sources: Element[];
    term: NamedNode;
    types: NamedNode[];
}
export interface DocumentVocabulary {
    classes: VocabularyDefinition[];
    count: number;
    definitions: VocabularyDefinition[];
    properties: VocabularyDefinition[];
}
/**
 * Find named classes and properties defined by a dataset. Explicit RDF/OWL
 * typing is preferred, while rdfs:subClassOf and rdfs:subPropertyOf also
 * establish their subjects through the predicates' RDFS domains.
 */
export declare function extractDocumentVocabulary(result: ExtractionResult): DocumentVocabulary;
