import { labelFor } from "@ia2-dev/html-rdf";
import type { ExtractionResult, NamedNode } from "./model.js";

const RDF_TYPE = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type";
const RDF_PROPERTY = "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property";
const RDFS_CLASS = "http://www.w3.org/2000/01/rdf-schema#Class";
const RDFS_SUBCLASS_OF = "http://www.w3.org/2000/01/rdf-schema#subClassOf";
const RDFS_SUBPROPERTY_OF = "http://www.w3.org/2000/01/rdf-schema#subPropertyOf";

const CLASS_TYPES = new Set([
  RDFS_CLASS,
  "http://www.w3.org/2002/07/owl#Class",
  "http://www.w3.org/2002/07/owl#DeprecatedClass",
]);

const PROPERTY_TYPES = new Set([
  RDF_PROPERTY,
  "http://www.w3.org/2002/07/owl#ObjectProperty",
  "http://www.w3.org/2002/07/owl#DatatypeProperty",
  "http://www.w3.org/2002/07/owl#AnnotationProperty",
  "http://www.w3.org/2002/07/owl#FunctionalProperty",
  "http://www.w3.org/2002/07/owl#InverseFunctionalProperty",
  "http://www.w3.org/2002/07/owl#TransitiveProperty",
  "http://www.w3.org/2002/07/owl#SymmetricProperty",
  "http://www.w3.org/2002/07/owl#AsymmetricProperty",
  "http://www.w3.org/2002/07/owl#ReflexiveProperty",
  "http://www.w3.org/2002/07/owl#IrreflexiveProperty",
  "http://www.w3.org/2002/07/owl#DeprecatedProperty",
  "http://www.w3.org/2002/07/owl#OntologyProperty",
]);

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

type DefinitionBuilder = VocabularyDefinition;

function pushNamed(values: NamedNode[], term: NamedNode): void {
  if (!values.some((value) => value.value === term.value)) values.push(term);
}

function pushSource(values: Element[], source: Element): void {
  if (!values.includes(source)) values.push(source);
}

function pushKind(values: VocabularyKind[], kind: VocabularyKind): void {
  if (!values.includes(kind)) values.push(kind);
}

/**
 * Find named classes and properties defined by a dataset. Explicit RDF/OWL
 * typing is preferred, while rdfs:subClassOf and rdfs:subPropertyOf also
 * establish their subjects through the predicates' RDFS domains.
 */
export function extractDocumentVocabulary(result: ExtractionResult): DocumentVocabulary {
  const builders = new Map<string, DefinitionBuilder>();
  const builderFor = (term: NamedNode): DefinitionBuilder => {
    let builder = builders.get(term.value);
    if (!builder) {
      builder = {
        classParents: [],
        kinds: [],
        propertyParents: [],
        sources: [],
        term,
        types: [],
      };
      builders.set(term.value, builder);
    }
    return builder;
  };

  for (const quad of result.quads) {
    if (quad.subject.termType !== "NamedNode") continue;
    if (quad.predicate.value === RDF_TYPE && quad.object.termType === "NamedNode") {
      const isClass = CLASS_TYPES.has(quad.object.value);
      const isProperty = PROPERTY_TYPES.has(quad.object.value);
      if (!isClass && !isProperty) continue;
      const builder = builderFor(quad.subject);
      if (isClass) pushKind(builder.kinds, "class");
      if (isProperty) pushKind(builder.kinds, "property");
      pushNamed(builder.types, quad.object);
      pushSource(builder.sources, quad.source);
      continue;
    }
    if (quad.predicate.value === RDFS_SUBCLASS_OF) {
      const builder = builderFor(quad.subject);
      pushKind(builder.kinds, "class");
      if (quad.object.termType === "NamedNode") pushNamed(builder.classParents, quad.object);
      pushSource(builder.sources, quad.source);
      continue;
    }
    if (quad.predicate.value === RDFS_SUBPROPERTY_OF) {
      const builder = builderFor(quad.subject);
      pushKind(builder.kinds, "property");
      if (quad.object.termType === "NamedNode") pushNamed(builder.propertyParents, quad.object);
      pushSource(builder.sources, quad.source);
    }
  }

  const definitions = Array.from(builders.values())
    .map((definition) => {
      const label = labelFor(result.quads, definition.term);
      return { ...definition, ...(label ? { label } : {}) };
    })
    .sort((left, right) => (left.label ?? left.term.value).localeCompare(right.label ?? right.term.value));
  const classes = definitions.filter((definition) => definition.kinds.includes("class"));
  const properties = definitions.filter((definition) => definition.kinds.includes("property"));
  return { classes, count: definitions.length, definitions, properties };
}
