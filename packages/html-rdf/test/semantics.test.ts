import { describe, expect, it } from "vitest";
import type { Quad } from "../src/model.js";
import {
  annotationTargetIris,
  labelFor,
  labelMap,
  projectQuadsToDefaultGraph,
  termLabelMap,
} from "../src/semantics.js";

const source = document.createElement("span");
const named = (value: string) => ({ termType: "NamedNode" as const, value });
const blank = (value: string) => ({ termType: "BlankNode" as const, value });
const literal = (value: string, language = "") => ({
  termType: "Literal" as const,
  value,
  datatype: named(language
    ? "http://www.w3.org/1999/02/22-rdf-syntax-ns#langString"
    : "http://www.w3.org/2001/XMLSchema#string"),
  language,
});
const quad = (
  subject: Quad["subject"],
  predicate: string,
  object: Quad["object"],
  graph: Quad["graph"] = null,
): Quad => ({ subject, predicate: named(predicate), object, graph, source });

describe("shared HTML/RDF semantics", () => {
  it("resolves labels by predicate and language priority", () => {
    const quads = [
      quad(named("https://example.test/item"), "http://www.w3.org/2000/01/rdf-schema#label", literal("Article", "fr")),
      quad(named("https://example.test/item"), "http://www.w3.org/2000/01/rdf-schema#label", literal("Item", "en")),
      quad(named("https://example.test/item"), "https://schema.org/name", literal("Fallback")),
      quad(blank("section"), "https://schema.org/name", literal("Section")),
      quad(named("https://example.test/unlabeled"), "https://schema.org/url", named("https://example.test/")),
    ];
    expect(labelFor(quads, "https://example.test/item", { languages: ["en"] })).toBe("Item");
    expect(Array.from(termLabelMap(quads, { languages: ["en"] }))).toEqual([
      ["NamedNode:https://example.test/item", "Item"],
      ["BlankNode:section", "Section"],
    ]);
    expect(Array.from(labelMap(quads, { languages: ["en"] }))).toEqual([
      ["https://example.test/item", "Item"],
    ]);
  });

  it("resolves direct and SpecificResource annotation targets", () => {
    const oa = "http://www.w3.org/ns/oa#";
    const quads = [
      quad(named("https://example.test/a1"), `${oa}hasBody`, named("https://example.test/shape")),
      quad(named("https://example.test/a1"), `${oa}hasTarget`, named("https://example.test/direct")),
      quad(named("https://example.test/a1"), `${oa}hasTarget`, blank("target")),
      quad(blank("target"), `${oa}hasSource`, named("https://example.test/source")),
    ];
    expect(annotationTargetIris(quads, "https://example.test/shape")).toEqual([
      "https://example.test/direct",
      "https://example.test/source",
    ]);
  });

  it("makes a selected named-graph union explicit", () => {
    const quads = [
      quad(named("https://example.test/a"), "https://example.test/p", literal("one"), named("https://example.test/g1")),
      quad(named("https://example.test/a"), "https://example.test/p", literal("two"), named("https://example.test/g2")),
    ];
    expect(projectQuadsToDefaultGraph(quads, { graphs: ["https://example.test/g2"] })).toEqual([
      expect.objectContaining({ graph: null, object: expect.objectContaining({ value: "two" }) }),
    ]);
  });
});
