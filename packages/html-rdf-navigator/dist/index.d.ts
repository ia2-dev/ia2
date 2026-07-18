export { extractDataset } from "./extract.js";
export { detectDiscoveryCandidates, DISCOVERY_PREDICATES, mergeDiscoveryContributions } from "./discovery.js";
export type { DiscoveryCandidate, DiscoveryContribution } from "./discovery.js";
export { Ia2RdfNavigator } from "./navigator.js";
export type { DrawerPosition } from "./navigator.js";
export { serializeJsonLd, serializeTurtle, termToTurtle } from "./serialize.js";
export { fromPortableExtractionResult, toPortableExtractionResult } from "./sources.js";
export type { NavigatorSource, NavigatorSourceAccess, PortableExtractionResult, PortableNavigatorSource } from "./sources.js";
export { extractDocumentVocabulary } from "./vocabulary.js";
export type { DocumentVocabulary, VocabularyDefinition, VocabularyKind } from "./vocabulary.js";
export type * from "./model.js";
import { Ia2RdfNavigator } from "./navigator.js";
declare global {
    interface Window {
        __IA2_RDF_NAVIGATOR_NO_AUTO__?: boolean;
    }
    interface HTMLElementTagNameMap {
        "ia2-rdf-navigator": Ia2RdfNavigator;
    }
}
/** Add one RDF Navigator to a document, returning the existing instance when present. */
export declare function mountRdfNavigator(target?: Document): Ia2RdfNavigator;
