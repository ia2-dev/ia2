import { labelFor } from "@ia2-dev/html-rdf";
import type {
  ExtractionResult,
  GraphTerm,
  ObjectTerm,
  Quad,
  SubjectTerm,
} from "./model.js";

const RDF_TYPE = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type";
const SH = "http://www.w3.org/ns/shacl#";
const SH_NODE_SHAPE = `${SH}NodeShape`;
const SH_PROPERTY_SHAPE = `${SH}PropertyShape`;
const SH_PROPERTY_GROUP = `${SH}PropertyGroup`;
const SH_NAME = `${SH}name`;
const SH_DESCRIPTION = `${SH}description`;
const SH_ORDER = `${SH}order`;
const SH_GROUP = `${SH}group`;
const SH_PATH = `${SH}path`;
const SH_PROPERTY = `${SH}property`;
const SHAPE_REFERENCE_PREDICATES = new Set([
  `${SH}node`,
  `${SH}not`,
  `${SH}qualifiedValueShape`,
]);

const SHAPE_LABEL_PREDICATES = [
  SH_NAME,
  "http://purl.org/dc/terms/title",
  "http://www.w3.org/2000/01/rdf-schema#label",
  "http://www.w3.org/2004/02/skos/core#prefLabel",
  "https://schema.org/name",
] as const;

const DESCRIPTION_PREDICATES = [
  SH_DESCRIPTION,
  "http://purl.org/dc/terms/description",
  "http://www.w3.org/2000/01/rdf-schema#comment",
  "https://schema.org/description",
] as const;

const SHAPE_METADATA_PREDICATES = new Set([
  SH_NAME,
  SH_DESCRIPTION,
  SH_ORDER,
  SH_GROUP,
  SH_PATH,
  SH_PROPERTY,
]);

export type ShaclShapeKind = "node" | "property";

export interface ShaclShape {
  constraints: Quad[];
  description?: string;
  graphs: GraphTerm[];
  group?: SubjectTerm;
  kinds: ShaclShapeKind[];
  label?: string;
  order?: number;
  paths: Quad[];
  properties: Quad[];
  quads: Quad[];
  sources: Element[];
  targets: Quad[];
  term: SubjectTerm;
}

export interface ShaclPropertyGroup {
  label?: string;
  order?: number;
  quads: Quad[];
  term: SubjectTerm;
}

export interface ShaclCatalog {
  count: number;
  groups: ShaclPropertyGroup[];
  shapes: ShaclShape[];
}

function resourceKey(term: SubjectTerm | ObjectTerm | GraphTerm): string | null {
  return term.termType === "NamedNode" || term.termType === "BlankNode"
    ? `${term.termType}:${term.value}`
    : null;
}

function resourceObject(term: ObjectTerm): SubjectTerm | null {
  return term.termType === "NamedNode" || term.termType === "BlankNode" ? term : null;
}

function pushUniqueTerm<T extends SubjectTerm | GraphTerm>(terms: T[], term: T): void {
  const key = resourceKey(term);
  if (!terms.some((candidate) => resourceKey(candidate) === key)) terms.push(term);
}

function pushUniqueElement(elements: Element[], element: Element): void {
  if (!elements.includes(element)) elements.push(element);
}

function literalValue(quads: readonly Quad[], predicates: readonly string[]): string | undefined {
  for (const predicate of predicates) {
    const value = quads.find((quad) => quad.predicate.value === predicate)?.object;
    if (value?.termType === "Literal") return value.value;
  }
  return undefined;
}

function numericValue(quads: readonly Quad[], predicate: string): number | undefined {
  const value = quads.find((quad) => quad.predicate.value === predicate)?.object;
  if (value?.termType !== "Literal") return undefined;
  const parsed = Number(value.value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function targetPredicate(predicate: string): boolean {
  return predicate === `${SH}target` || predicate.startsWith(`${SH}target`);
}

function fallbackLabel(term: SubjectTerm): string {
  if (term.termType === "BlankNode") return `Blank node ${term.value}`;
  try {
    const url = new URL(term.value);
    const fragment = decodeURIComponent(url.hash.slice(1));
    if (fragment) return fragment;
    const segments = url.pathname.split("/").filter(Boolean);
    return decodeURIComponent(segments.at(-1) ?? term.value);
  } catch {
    return term.value;
  }
}

function compareCatalogEntries(
  left: { label?: string; order?: number; term: SubjectTerm },
  right: { label?: string; order?: number; term: SubjectTerm },
): number {
  const leftOrder = left.order ?? Number.POSITIVE_INFINITY;
  const rightOrder = right.order ?? Number.POSITIVE_INFINITY;
  if (leftOrder !== rightOrder) return leftOrder - rightOrder;
  return (left.label ?? fallbackLabel(left.term))
    .localeCompare(right.label ?? fallbackLabel(right.term));
}

/**
 * Build a UI-oriented catalog of SHACL shapes without executing validation or
 * rules. Explicitly typed shapes are included alongside the SHACL-defined
 * implicit cases established by targets, paths, properties, and direct
 * shape-valued constraints.
 */
export function extractShaclCatalog(result: ExtractionResult): ShaclCatalog {
  const shapeTerms = new Map<string, SubjectTerm>();
  const explicitKinds = new Map<string, Set<ShaclShapeKind>>();
  const propertyReferences = new Set<string>();
  const groupTerms = new Map<string, SubjectTerm>();

  const addShape = (term: SubjectTerm, kind?: ShaclShapeKind): void => {
    const key = resourceKey(term)!;
    shapeTerms.set(key, term);
    if (!kind) return;
    let kinds = explicitKinds.get(key);
    if (!kinds) {
      kinds = new Set();
      explicitKinds.set(key, kinds);
    }
    kinds.add(kind);
  };

  for (const quad of result.quads) {
    const subjectKey = resourceKey(quad.subject)!;
    if (quad.predicate.value === RDF_TYPE && quad.object.termType === "NamedNode") {
      if (quad.object.value === SH_NODE_SHAPE) addShape(quad.subject, "node");
      if (quad.object.value === SH_PROPERTY_SHAPE) addShape(quad.subject, "property");
      if (quad.object.value === SH_PROPERTY_GROUP) groupTerms.set(subjectKey, quad.subject);
    }
    if (targetPredicate(quad.predicate.value)) addShape(quad.subject);
    if (quad.predicate.value === SH_PATH) addShape(quad.subject, "property");
    if (quad.predicate.value === SH_PROPERTY) {
      addShape(quad.subject, "node");
      const propertyShape = resourceObject(quad.object);
      if (propertyShape) {
        addShape(propertyShape, "property");
        propertyReferences.add(resourceKey(propertyShape)!);
      }
    }
    if (SHAPE_REFERENCE_PREDICATES.has(quad.predicate.value)) {
      addShape(quad.subject);
      const referencedShape = resourceObject(quad.object);
      if (referencedShape) addShape(referencedShape);
    }
    if (quad.predicate.value === SH_GROUP) {
      const group = resourceObject(quad.object);
      if (group) groupTerms.set(resourceKey(group)!, group);
    }
  }

  const shapes = Array.from(shapeTerms, ([key, term]): ShaclShape => {
    const quads = result.quads.filter((quad) => resourceKey(quad.subject) === key);
    const kinds = Array.from(explicitKinds.get(key) ?? []);
    if (!kinds.length) {
      kinds.push(
        propertyReferences.has(key) || quads.some((quad) => quad.predicate.value === SH_PATH)
          ? "property"
          : "node",
      );
    }
    const group = quads
      .find((quad) => quad.predicate.value === SH_GROUP)
      ?.object;
    const graphs: GraphTerm[] = [];
    const sources: Element[] = [];
    for (const quad of quads) {
      if (quad.graph) pushUniqueTerm(graphs, quad.graph);
      pushUniqueElement(sources, quad.source);
    }
    const targets = quads.filter((quad) => targetPredicate(quad.predicate.value));
    const paths = quads.filter((quad) => quad.predicate.value === SH_PATH);
    const properties = quads.filter((quad) => quad.predicate.value === SH_PROPERTY);
    const constraints = quads.filter((quad) => (
      quad.predicate.value.startsWith(SH)
      && !SHAPE_METADATA_PREDICATES.has(quad.predicate.value)
      && !targetPredicate(quad.predicate.value)
    ));
    const label = labelFor(result.quads, term, { predicates: SHAPE_LABEL_PREDICATES });
    const description = literalValue(quads, DESCRIPTION_PREDICATES);
    const order = numericValue(quads, SH_ORDER);
    return {
      constraints,
      graphs,
      kinds,
      paths,
      properties,
      quads,
      sources,
      targets,
      term,
      ...(description ? { description } : {}),
      ...(group && (group.termType === "NamedNode" || group.termType === "BlankNode") ? { group } : {}),
      ...(label ? { label } : {}),
      ...(order !== undefined ? { order } : {}),
    };
  }).sort(compareCatalogEntries);

  const groups = Array.from(groupTerms, ([key, term]): ShaclPropertyGroup => {
    const quads = result.quads.filter((quad) => resourceKey(quad.subject) === key);
    const label = labelFor(result.quads, term, { predicates: SHAPE_LABEL_PREDICATES });
    const order = numericValue(quads, SH_ORDER);
    return {
      quads,
      term,
      ...(label ? { label } : {}),
      ...(order !== undefined ? { order } : {}),
    };
  }).sort(compareCatalogEntries);

  return { count: shapes.length, groups, shapes };
}
