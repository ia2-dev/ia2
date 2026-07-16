import {
  namedNode,
  type ExtractionResult,
  type GraphTerm,
  type NamedNode,
  type SubjectTerm,
} from "./model.js";

const RDFS_SEE_ALSO = "http://www.w3.org/2000/01/rdf-schema#seeAlso";
const RDFS_IS_DEFINED_BY = "http://www.w3.org/2000/01/rdf-schema#isDefinedBy";
const DCTERMS_REQUIRES = "http://purl.org/dc/terms/requires";
const DCTERMS_SOURCE = "http://purl.org/dc/terms/source";
const PROV_WAS_DERIVED_FROM = "http://www.w3.org/ns/prov#wasDerivedFrom";
const OWL_IMPORTS = "http://www.w3.org/2002/07/owl#imports";
const DCAT_QUALIFIED_RELATION = "http://www.w3.org/ns/dcat#qualifiedRelation";
const DCTERMS_RELATION = "http://purl.org/dc/terms/relation";
const DCAT_HAD_ROLE = "http://www.w3.org/ns/dcat#hadRole";

export const DISCOVERY_PREDICATES = new Set([
  RDFS_SEE_ALSO,
  RDFS_IS_DEFINED_BY,
  DCTERMS_REQUIRES,
  DCTERMS_SOURCE,
  PROV_WAS_DERIVED_FROM,
  OWL_IMPORTS,
]);

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

function termKey(term: SubjectTerm | GraphTerm | null): string {
  if (!term) return "default";
  return `${term.termType}:${term.value}`;
}

function sameTerm(left: SubjectTerm | GraphTerm | null, right: SubjectTerm | GraphTerm | null): boolean {
  return termKey(left) === termKey(right);
}

function documentIri(value: string): string {
  try {
    const url = new URL(value);
    url.hash = "";
    return url.href;
  } catch {
    return value.replace(/#.*$/s, "");
  }
}

function candidateId(key: string): string {
  let hash = 2166136261;
  for (let index = 0; index < key.length; index += 1) {
    hash ^= key.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `discovery-${(hash >>> 0).toString(36)}`;
}

function pushNamed(values: NamedNode[], term: NamedNode): void {
  if (!values.some((value) => value.value === term.value)) values.push(term);
}

function pushSubject(values: SubjectTerm[], term: SubjectTerm): void {
  if (!values.some((value) => termKey(value) === termKey(term))) values.push(term);
}

function pushSource(values: Element[], source: Element): void {
  if (!values.includes(source)) values.push(source);
}

/**
 * Normalize direct discovery predicates and DCAT qualified relationships into
 * explicit consumer-side candidates. Local links into the source document are
 * excluded because they do not identify additional knowledge.
 */
export function detectDiscoveryCandidates(result: ExtractionResult): DiscoveryCandidate[] {
  const candidates = new Map<string, DiscoveryCandidate>();
  const sourceDocument = documentIri(result.sourceDocumentIri);

  const candidateFor = (
    context: SubjectTerm,
    target: NamedNode,
    graph: GraphTerm | null,
  ): DiscoveryCandidate | null => {
    if (documentIri(target.value) === sourceDocument) return null;
    const key = `${termKey(context)}|${termKey(graph)}|${target.value}`;
    let candidate = candidates.get(key);
    if (!candidate) {
      candidate = {
        context,
        graph,
        id: candidateId(key),
        predicates: [],
        qualifiedRelationships: [],
        roles: [],
        sources: [],
        target,
      };
      candidates.set(key, candidate);
    }
    return candidate;
  };

  for (const quad of result.quads) {
    if (!DISCOVERY_PREDICATES.has(quad.predicate.value) || quad.object.termType !== "NamedNode") continue;
    const candidate = candidateFor(quad.subject, quad.object, quad.graph);
    if (!candidate) continue;
    pushNamed(candidate.predicates, quad.predicate);
    pushSource(candidate.sources, quad.source);
  }

  for (const relationQuad of result.quads) {
    if (relationQuad.predicate.value !== DCAT_QUALIFIED_RELATION) continue;
    if (relationQuad.object.termType !== "NamedNode" && relationQuad.object.termType !== "BlankNode") continue;
    const relationship = relationQuad.object;
    const details = result.quads.filter((quad) => sameTerm(quad.subject, relationship) && sameTerm(quad.graph, relationQuad.graph));
    const targets = details.filter((quad) => quad.predicate.value === DCTERMS_RELATION && quad.object.termType === "NamedNode");
    const roles = details.filter((quad) => quad.predicate.value === DCAT_HAD_ROLE && quad.object.termType === "NamedNode");
    for (const targetQuad of targets) {
      if (targetQuad.object.termType !== "NamedNode") continue;
      const candidate = candidateFor(relationQuad.subject, targetQuad.object, relationQuad.graph);
      if (!candidate) continue;
      pushSubject(candidate.qualifiedRelationships, relationship);
      pushSource(candidate.sources, relationQuad.source);
      pushSource(candidate.sources, targetQuad.source);
      for (const roleQuad of roles) {
        if (roleQuad.object.termType !== "NamedNode") continue;
        pushNamed(candidate.roles, roleQuad.object);
        pushSource(candidate.sources, roleQuad.source);
      }
    }
  }

  return Array.from(candidates.values()).sort((left, right) => left.target.value.localeCompare(right.target.value));
}

/**
 * Present retrieved contributions with the source dataset while keeping each
 * contribution's default graph in a named graph identified by its canonical
 * source document. Existing named graphs retain their identifiers.
 */
export function mergeDiscoveryContributions(
  source: ExtractionResult,
  contributions: Iterable<DiscoveryContribution>,
): ExtractionResult {
  const quads = [...source.quads];
  const graphs = new Map(source.graphs.map((graph) => [termKey(graph), graph]));
  const diagnostics = [...source.diagnostics];

  for (const contribution of contributions) {
    const contributionGraph = namedNode(contribution.result.sourceDocumentIri);
    for (const quad of contribution.result.quads) {
      const graph = quad.graph ?? contributionGraph;
      quads.push({ ...quad, graph });
      graphs.set(termKey(graph), graph);
    }
    for (const graph of contribution.result.graphs) graphs.set(termKey(graph), graph);
    diagnostics.push(...contribution.result.diagnostics.map((diagnostic) => ({
      ...diagnostic,
      message: `Contribution ${contribution.result.sourceDocumentIri}: ${diagnostic.message}`,
    })));
  }

  return {
    ...source,
    diagnostics,
    graphs: Array.from(graphs.values()),
    quads,
  };
}
