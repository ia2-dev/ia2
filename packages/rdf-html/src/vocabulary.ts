import { RDFHTML } from "./generated/elements.js";

export {
  ATTRIBUTE_BY_DEFINITION_IRI,
  ATTRIBUTE_BY_LOCAL_NAME,
  ELEMENT_BY_CLASS_IRI,
  HTML_ATTRIBUTE_CROSS_CHECK_EXCEPTIONS,
  HTML_ATTRIBUTE_INDEX_EXCLUSION,
  HTML_ATTRIBUTES,
  HTML_CLASSIFICATION_CROSS_CHECK_EXCEPTIONS,
  HTML_CONTENT_CATEGORIES,
  HTML_ELEMENTS,
  HTML_SNAPSHOT_DATE,
  HTML_VOCABULARY_IRI,
  HTML_SNAPSHOT_SOURCE,
  HTML_SNAPSHOT_SOURCES,
  HTML_SPECIAL_CATEGORY_PARTICIPANTS,
  HTML_SYNTAX_KINDS,
  RDFHTML,
  VOID_ELEMENTS,
} from "./generated/elements.js";

export const RDF = "http://www.w3.org/1999/02/22-rdf-syntax-ns#";
export const DCTERMS = "http://purl.org/dc/terms/";
export const ORD = "https://ontology.inferal.com/modules/ordering/";
export const XSD = "http://www.w3.org/2001/XMLSchema#";

export const TERMS = {
  attribute: `${RDFHTML}attribute`,
  attributeDefinition: `${RDFHTML}attributeDefinition`,
  attributeName: `${RDFHTML}attributeName`,
  attributeNamespace: `${RDFHTML}attributeNamespace`,
  attributeValue: `${RDFHTML}attributeValue`,
  base: `${RDFHTML}base`,
  childOf: `${RDFHTML}childOf`,
  children: `${RDFHTML}children`,
  comment: `${RDFHTML}Comment`,
  comparable: `${ORD}Comparable`,
  data: `${RDFHTML}data`,
  conformsTo: `${DCTERMS}conformsTo`,
  document: `${RDFHTML}Document`,
  documentType: `${RDFHTML}DocumentType`,
  documentTypeName: `${RDFHTML}documentTypeName`,
  hasChild: `${RDFHTML}hasChild`,
  immediatelyFollows: `${ORD}immediatelyFollows`,
  immediatelyPrecedes: `${ORD}immediatelyPrecedes`,
  follows: `${ORD}follows`,
  inOrdering: `${ORD}inOrdering`,
  localName: `${RDFHTML}localName`,
  namespace: `${RDFHTML}namespace`,
  precedes: `${ORD}precedes`,
  rdfFirst: `${RDF}first`,
  rdfList: `${RDF}List`,
  rdfNil: `${RDF}nil`,
  rdfRest: `${RDF}rest`,
  rdfType: `${RDF}type`,
  text: `${RDFHTML}Text`,
  title: `${DCTERMS}title`,
  totalOrdering: `${ORD}TotalOrdering`,
} as const;
