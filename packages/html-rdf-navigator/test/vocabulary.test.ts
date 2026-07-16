import { beforeEach, describe, expect, it } from "vitest";
import { extractDataset, extractDocumentVocabulary } from "../src/index.js";

const RDF_TYPE = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type";
const RDFS_LABEL = "http://www.w3.org/2000/01/rdf-schema#label";
const RDFS_SUBCLASS_OF = "http://www.w3.org/2000/01/rdf-schema#subClassOf";
const RDFS_SUBPROPERTY_OF = "http://www.w3.org/2000/01/rdf-schema#subPropertyOf";
const OWL_CLASS = "http://www.w3.org/2002/07/owl#Class";
const OWL_OBJECT_PROPERTY = "http://www.w3.org/2002/07/owl#ObjectProperty";

beforeEach(() => {
  document.documentElement.setAttribute("rdf-version", "1.2");
  document.head.querySelectorAll('link[rel~="canonical"]').forEach((element) => element.remove());
  const canonical = document.createElement("link");
  canonical.rel = "canonical";
  canonical.href = "https://example.com/vocabulary";
  document.head.append(canonical);
});

describe("extractDocumentVocabulary", () => {
  it("finds explicit and hierarchy-implied class and property definitions", () => {
    document.body.innerHTML = [
      `<a href="${OWL_CLASS}" rdf-subject="#Entity" rdf-predicate="${RDF_TYPE}">Class</a>`,
      `<span rdf-subject="#Entity" rdf-predicate="${RDFS_LABEL}">Entity</span>`,
      `<a href="#Entity" rdf-subject="#Agent" rdf-predicate="${RDFS_SUBCLASS_OF}">Entity</a>`,
      `<span rdf-subject="#Agent" rdf-predicate="${RDFS_LABEL}">Agent</span>`,
      `<a href="${OWL_OBJECT_PROPERTY}" rdf-subject="#relatedTo" rdf-predicate="${RDF_TYPE}">Property</a>`,
      `<a href="#relatedTo" rdf-subject="#knows" rdf-predicate="${RDFS_SUBPROPERTY_OF}">relatedTo</a>`,
    ].join("");

    const vocabulary = extractDocumentVocabulary(extractDataset(document));
    expect(vocabulary.count).toBe(4);
    expect(vocabulary.classes.map((definition) => definition.term.value)).toEqual([
      "https://example.com/vocabulary#Agent",
      "https://example.com/vocabulary#Entity",
    ]);
    expect(vocabulary.properties.map((definition) => definition.term.value)).toEqual([
      "https://example.com/vocabulary#knows",
      "https://example.com/vocabulary#relatedTo",
    ]);
    expect(vocabulary.classes[0]?.label).toBe("Agent");
    expect(vocabulary.classes[0]?.classParents.map((term) => term.value)).toEqual([
      "https://example.com/vocabulary#Entity",
    ]);
    expect(vocabulary.properties[0]?.propertyParents.map((term) => term.value)).toEqual([
      "https://example.com/vocabulary#relatedTo",
    ]);
  });
});
