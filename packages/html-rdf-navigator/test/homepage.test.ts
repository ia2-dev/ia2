import { describe, expect, it } from "vitest";
import { extractDataset } from "../src/extract.js";
// @ts-expect-error Vitest supplies Vite's raw-fixture import during tests.
import homepageHtml from "../../../site/index.html?raw";

const DCTERMS = "http://purl.org/dc/terms/";
const RDF_TYPE = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type";
const SCHEMA = "https://schema.org/";

describe("IA² homepage semantics", () => {
  it("separates the website, project, source, and published artifacts", () => {
    const page = new DOMParser().parseFromString(homepageHtml, "text/html");
    Object.defineProperty(page, "URL", { configurable: true, value: "http://127.0.0.1:8791/" });

    const result = extractDataset(page);
    const has = (
      subject: string,
      predicate: string,
      objectType: "Literal" | "NamedNode",
      object: string,
    ): boolean => result.quads.some((quad) => (
      quad.subject.termType === "NamedNode"
      && quad.subject.value === subject
      && quad.predicate.value === predicate
      && quad.object.termType === objectType
      && quad.object.value === object
    ));

    expect(result.diagnostics).toEqual([]);
    expect(has("https://ia2.dev/", RDF_TYPE, "NamedNode", `${SCHEMA}WebSite`)).toBe(true);
    expect(has("https://ia2.dev/", `${SCHEMA}mainEntity`, "NamedNode", "https://ia2.dev/#project")).toBe(true);
    expect(has("https://ia2.dev/", `${DCTERMS}source`, "NamedNode", "https://github.com/ia2-dev/ia2")).toBe(true);
    expect(has("https://ia2.dev/#project", `${DCTERMS}alternative`, "Literal", "IA²")).toBe(true);
    expect(has(
      "https://ia2.dev/#project",
      `${DCTERMS}title`,
      "Literal",
      "Information Architecture for Intelligent Agents",
    )).toBe(true);

    const artifacts = [
      "https://ia2.dev/spec/html-rdf",
      "https://ia2.dev/guide/html-rdf",
      "https://ia2.dev/demos/live-workspace",
      "https://github.com/ia2-dev/ia2/tree/main/packages/html-rdf-navigator",
    ];
    for (const artifact of artifacts) {
      expect(has("https://ia2.dev/#project", `${DCTERMS}hasPart`, "NamedNode", artifact)).toBe(true);
      expect(result.quads.some((quad) => (
        quad.subject.termType === "NamedNode"
        && quad.subject.value === artifact
        && quad.predicate.value === `${DCTERMS}title`
        && quad.object.termType === "Literal"
      ))).toBe(true);
      expect(result.quads.some((quad) => (
        quad.subject.termType === "NamedNode"
        && quad.subject.value === artifact
        && quad.predicate.value === `${DCTERMS}description`
        && quad.object.termType === "Literal"
      ))).toBe(true);
    }

    expect(result.quads.some((quad) => quad.predicate.value === `${SCHEMA}name`)).toBe(false);
  });
});
