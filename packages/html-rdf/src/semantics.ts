import type {
  GraphTerm,
  NamedNode,
  ObjectTerm,
  Quad,
  SubjectTerm,
} from "./model.js";

export const HTML_RDF_DATASET_CHANGE_EVENT = "ia2-rdf-dataset-change";

export const DEFAULT_LABEL_PREDICATES = [
  "http://www.w3.org/2000/01/rdf-schema#label",
  "http://www.w3.org/2004/02/skos/core#prefLabel",
  "http://purl.org/dc/terms/title",
  "https://schema.org/name",
] as const;

const OA_HAS_BODY = "http://www.w3.org/ns/oa#hasBody";
const OA_HAS_SOURCE = "http://www.w3.org/ns/oa#hasSource";
const OA_HAS_TARGET = "http://www.w3.org/ns/oa#hasTarget";

function sameResource(left: SubjectTerm | ObjectTerm, right: SubjectTerm): boolean {
  return (
    (left.termType === "NamedNode" || left.termType === "BlankNode")
    && left.termType === right.termType
    && left.value === right.value
  );
}

function resourceTerm(value: string | SubjectTerm): SubjectTerm {
  return typeof value === "string"
    ? { termType: "NamedNode", value }
    : value;
}

export interface LabelOptions {
  languages?: readonly string[];
  predicates?: readonly string[];
}

/**
 * Resolve one deterministic human label. Predicate order takes precedence,
 * followed by requested language order and then source order.
 */
export function labelFor(
  quads: readonly Quad[],
  resource: string | SubjectTerm,
  options: LabelOptions = {},
): string | undefined {
  const subject = resourceTerm(resource);
  const predicates = options.predicates ?? DEFAULT_LABEL_PREDICATES;
  const languages = options.languages?.map((language) => language.toLowerCase()) ?? [];
  for (const predicate of predicates) {
    const candidates = quads.filter((quad) => (
      sameResource(quad.subject, subject)
      && quad.predicate.value === predicate
      && quad.object.termType === "Literal"
    ));
    for (const language of languages) {
      const match = candidates.find(({ object }) => (
        object.termType === "Literal" && object.language.toLowerCase() === language
      ));
      if (match?.object.termType === "Literal") return match.object.value;
    }
    const languageNeutral = candidates.find(({ object }) => (
      object.termType === "Literal" && !object.language
    ));
    if (languageNeutral?.object.termType === "Literal") return languageNeutral.object.value;
    const first = candidates[0]?.object;
    if (first?.termType === "Literal") return first.value;
  }
  return undefined;
}

/** Build a deterministic label map for every named resource in a quad set. */
export function labelMap(
  quads: readonly Quad[],
  options: LabelOptions = {},
): Map<string, string> {
  const labels = termLabelMap(quads, options);
  return new Map(Array.from(labels).flatMap(([key, label]) => (
    key.startsWith("NamedNode:") ? [[key.slice("NamedNode:".length), label]] : []
  )));
}

/** Build labels keyed as `NamedNode:iri` or `BlankNode:label`. */
export function termLabelMap(
  quads: readonly Quad[],
  options: LabelOptions = {},
): Map<string, string> {
  const predicates = options.predicates ?? DEFAULT_LABEL_PREDICATES;
  const predicateRanks = new Map(predicates.map((predicate, index) => [predicate, index]));
  const languages = options.languages?.map((language) => language.toLowerCase()) ?? [];
  const languageRanks = new Map(languages.map((language, index) => [language, index]));
  const fallbackLanguageRank = languages.length;
  const otherLanguageRank = fallbackLanguageRank + 1;
  const resources = new Set<string>();
  const candidates = new Map<string, {
    languageRank: number;
    predicateRank: number;
    sourceRank: number;
    value: string;
  }>();

  quads.forEach((quad, sourceRank) => {
    const key = `${quad.subject.termType}:${quad.subject.value}`;
    resources.add(key);
    if (quad.object.termType !== "Literal") return;
    const predicateRank = predicateRanks.get(quad.predicate.value);
    if (predicateRank === undefined) return;
    const language = quad.object.language.toLowerCase();
    const languageRank = languageRanks.get(language)
      ?? (language ? otherLanguageRank : fallbackLanguageRank);
    const candidate = { languageRank, predicateRank, sourceRank, value: quad.object.value };
    const current = candidates.get(key);
    if (
      !current
      || predicateRank < current.predicateRank
      || (
        predicateRank === current.predicateRank
        && (
          languageRank < current.languageRank
          || (languageRank === current.languageRank && sourceRank < current.sourceRank)
        )
      )
    ) {
      candidates.set(key, candidate);
    }
  });

  const labels = new Map<string, string>();
  for (const key of resources) {
    const candidate = candidates.get(key);
    if (candidate) labels.set(key, candidate.value);
  }
  return labels;
}

/**
 * Resolve Web Annotation targets for a body. A direct named target is returned
 * as-is. A SpecificResource-like target is resolved through oa:hasSource.
 */
export function annotationTargetIris(
  quads: readonly Quad[],
  body: string | SubjectTerm,
): string[] {
  const bodyTerm = resourceTerm(body);
  const annotations = quads.flatMap((quad) => (
    quad.predicate.value === OA_HAS_BODY
    && sameResource(quad.object, bodyTerm)
      ? [quad.subject]
      : []
  ));
  return Array.from(new Set(annotations.flatMap((annotation) => (
    annotationTargetIrisForAnnotation(quads, annotation)
  ))));
}

export function annotationTargetIrisForAnnotation(
  quads: readonly Quad[],
  annotation: string | SubjectTerm,
): string[] {
  const annotationTerm = resourceTerm(annotation);
  const targets = quads.flatMap((quad) => (
    sameResource(quad.subject, annotationTerm)
    && quad.predicate.value === OA_HAS_TARGET
    && (quad.object.termType === "NamedNode" || quad.object.termType === "BlankNode")
      ? [quad.object]
      : []
  ));
  return Array.from(new Set(targets.flatMap((target) => {
    const sources = quads.flatMap((quad) => (
      sameResource(quad.subject, target)
      && quad.predicate.value === OA_HAS_SOURCE
      && quad.object.termType === "NamedNode"
        ? [quad.object.value]
        : []
    ));
    if (sources.length > 0) return sources;
    return target.termType === "NamedNode" ? [target.value] : [];
  })));
}

export interface GraphProjectionOptions {
  /** Undefined selects all graphs. Null selects the default graph. */
  graphs?: readonly (string | null)[];
}

function selectedGraph(graph: GraphTerm | null, selected: readonly (string | null)[]): boolean {
  if (!graph) return selected.includes(null);
  return selected.includes(graph.value);
}

/**
 * Project selected dataset graphs into one explicit RDF graph for graph-based
 * algorithms such as SHACL validation. Duplicate quads are left to the target
 * RDF/JS DatasetCore implementation to coalesce.
 */
export function projectQuadsToDefaultGraph(
  quads: readonly Quad[],
  options: GraphProjectionOptions = {},
): Quad[] {
  const selected = options.graphs;
  return quads
    .filter((quad) => !selected || selectedGraph(quad.graph, selected))
    .map((quad) => ({ ...quad, graph: null }));
}

export function namedResource(value: string): NamedNode {
  return { termType: "NamedNode", value };
}
