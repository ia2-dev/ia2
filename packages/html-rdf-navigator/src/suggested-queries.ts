import { DEFAULT_LABEL_PREDICATES, labelFor } from "@ia2-dev/html-rdf";
import type { ExtractionResult, SubjectTerm } from "./model.js";

const RDF_TYPE = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type";
const RDFS_COMMENT = "http://www.w3.org/2000/01/rdf-schema#comment";
const DCTERMS_DESCRIPTION = "http://purl.org/dc/terms/description";
const SH = "http://www.w3.org/ns/shacl#";

const EXECUTABLE_TYPES = new Set([
  `${SH}SPARQLExecutable`,
  `${SH}SPARQLSelectExecutable`,
  `${SH}SPARQLAskExecutable`,
  `${SH}SPARQLConstructExecutable`,
]);

const QUERY_PREDICATES = [
  { iri: `${SH}select`, kind: "select" },
  { iri: `${SH}ask`, kind: "ask" },
  { iri: `${SH}construct`, kind: "construct" },
] as const;

export type SuggestedSparqlQueryKind = "ask" | "construct" | "select";

export interface SuggestedSparqlQuery {
  description: string;
  id: string;
  kind: SuggestedSparqlQueryKind;
  label: string;
  order: number;
  query: string;
}

export interface SuggestedSparqlQueryCatalog {
  diagnostics: string[];
  queries: SuggestedSparqlQuery[];
}

function termKey(term: SubjectTerm): string {
  return `${term.termType}:${term.value}`;
}

function localLabel(term: SubjectTerm): string {
  if (term.termType === "BlankNode") return `Query ${term.value}`;
  const fragment = term.value.match(/[#/]([^#/]+)$/)?.[1];
  if (!fragment) return term.value;
  return decodeURIComponent(fragment)
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function stableQueryId(
  subject: SubjectTerm,
  kind: SuggestedSparqlQueryKind,
  query: string,
): string {
  if (subject.termType === "NamedNode") return termKey(subject);
  let hash = 2166136261;
  for (const character of `${kind}\n${query}`) {
    hash ^= character.codePointAt(0) ?? 0;
    hash = Math.imul(hash, 16777619);
  }
  return `BlankNodeQuery:${(hash >>> 0).toString(16)}`;
}

/**
 * Discover document-authored query examples expressed with SHACL's SPARQL
 * executable classes and query predicates. The executable resources may live
 * in any graph, so a document can keep its query catalog separate from its
 * domain data.
 */
export function extractSuggestedSparqlQueryCatalog(
  result: ExtractionResult,
): SuggestedSparqlQueryCatalog {
  const bySubject = new Map<string, {
    description?: string;
    executable: boolean;
    order?: number;
    queries: Partial<Record<SuggestedSparqlQueryKind, string>>;
    subject: SubjectTerm;
  }>();

  const entryFor = (subject: SubjectTerm) => {
    const key = termKey(subject);
    let entry = bySubject.get(key);
    if (!entry) {
      entry = { executable: false, queries: {}, subject };
      bySubject.set(key, entry);
    }
    return entry;
  };

  for (const quad of result.quads) {
    const entry = entryFor(quad.subject);
    if (
      quad.predicate.value === RDF_TYPE
      && quad.object.termType === "NamedNode"
      && EXECUTABLE_TYPES.has(quad.object.value)
    ) {
      entry.executable = true;
    }
    if (quad.object.termType !== "Literal") continue;
    const queryPredicate = QUERY_PREDICATES.find(({ iri }) => iri === quad.predicate.value);
    if (queryPredicate) entry.queries[queryPredicate.kind] = quad.object.value.trim();
    if ([DCTERMS_DESCRIPTION, RDFS_COMMENT, `${SH}description`].includes(quad.predicate.value)) {
      entry.description ??= quad.object.value.trim();
    }
    if (quad.predicate.value === `${SH}order`) {
      const order = Number(quad.object.value);
      if (Number.isFinite(order)) entry.order = order;
    }
  }

  const diagnostics: string[] = [];
  const queries = Array.from(bySubject.values())
    .flatMap((entry) => {
      if (!entry.executable) return [];
      const queryEntries = QUERY_PREDICATES
        .map(({ kind }) => ({ kind, query: entry.queries[kind] }))
        .filter((candidate): candidate is { kind: SuggestedSparqlQueryKind; query: string } => (
          Boolean(candidate.query)
        ));
      if (queryEntries.length !== 1) {
        diagnostics.push(
          `${localLabel(entry.subject)} must declare exactly one sh:select, sh:ask, or sh:construct query.`,
        );
        return [];
      }
      const queryEntry = queryEntries[0]!;
      return [{
        description: entry.description ?? "",
        id: stableQueryId(entry.subject, queryEntry.kind, queryEntry.query),
        kind: queryEntry.kind,
        label: labelFor(result.quads, entry.subject, {
          predicates: [...DEFAULT_LABEL_PREDICATES, `${SH}name`],
        })?.trim() || localLabel(entry.subject),
        order: entry.order ?? Number.POSITIVE_INFINITY,
        query: queryEntry.query,
      }];
    })
    .sort((left, right) => left.order - right.order || left.label.localeCompare(right.label));
  return { diagnostics, queries };
}

/** Compatibility convenience for consumers that only need valid suggestions. */
export function extractSuggestedSparqlQueries(result: ExtractionResult): SuggestedSparqlQuery[] {
  return extractSuggestedSparqlQueryCatalog(result).queries;
}
