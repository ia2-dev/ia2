import { type ExtractionResult, type GraphTerm, type NamedNode, type SubjectTerm } from "./model.js";
export declare const DISCOVERY_PREDICATES: Set<string>;
export interface DiscoveryCandidate {
    context: SubjectTerm;
    graph: GraphTerm | null;
    id: string;
    predicates: NamedNode[];
    qualifiedRelationships: SubjectTerm[];
    roles: NamedNode[];
    sources: Element[];
    target: NamedNode;
}
export interface DiscoveryContribution {
    candidateId: string;
    result: ExtractionResult;
    retrievalIri: string;
}
/**
 * Normalize direct discovery predicates and DCAT qualified relationships into
 * explicit consumer-side candidates. Local links into the source document are
 * excluded because they do not identify additional knowledge.
 */
export declare function detectDiscoveryCandidates(result: ExtractionResult): DiscoveryCandidate[];
/**
 * Present retrieved contributions with the source dataset while keeping each
 * contribution's default graph in a named graph identified by its canonical
 * source document. Existing named graphs retain their identifiers.
 */
export declare function mergeDiscoveryContributions(source: ExtractionResult, contributions: Iterable<DiscoveryContribution>): ExtractionResult;
