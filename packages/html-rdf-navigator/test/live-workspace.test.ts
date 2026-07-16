import { describe, expect, it } from "vitest";
import { extractDataset } from "../src/extract.js";
// @ts-expect-error Vitest supplies Vite's raw-fixture import during tests.
import workspaceHtml from "../../../demos/live-workspace/index.html?raw";

const BASE = "https://ia2.dev/demos/live-workspace";
const DECISION = "https://ontology.inferal.com/modules/decision/";
const DCTERMS = "http://purl.org/dc/terms/";
const PROV = "http://www.w3.org/ns/prov#";
const RDF = "http://www.w3.org/1999/02/22-rdf-syntax-ns#";
const SHACL = "http://www.w3.org/ns/shacl#";

describe("live workspace semantics", () => {
  it("connects the release, decision, evidence, claim, and contract", () => {
    const page = new DOMParser().parseFromString(workspaceHtml, "text/html");
    Object.defineProperty(page, "URL", { configurable: true, value: "http://127.0.0.1:8791/demos/live-workspace" });

    const result = extractDataset(page);
    const named = (fragment: string): string => `${BASE}#${fragment}`;
    const hasNamed = (subject: string, predicate: string, object: string, graph?: string): boolean => (
      result.quads.some((quad) => (
        quad.subject.termType === "NamedNode"
        && quad.subject.value === subject
        && quad.predicate.value === predicate
        && quad.object.termType === "NamedNode"
        && quad.object.value === object
        && (graph === undefined || (quad.graph?.termType === "NamedNode" && quad.graph.value === graph))
      ))
    );

    expect(result.diagnostics).toEqual([]);
    expect(result.sourceDocumentIri).toBe(BASE);
    expect(hasNamed(
      named("release-accessibility"),
      `${DCTERMS}hasPart`,
      named("decision-record-focus-return"),
    )).toBe(true);
    expect(hasNamed(
      named("decision-record-focus-return"),
      `${DECISION}recordsDecision`,
      named("decision-focus-return"),
    )).toBe(true);
    expect(hasNamed(
      named("decision-focus-return"),
      `${DECISION}selectedOption`,
      named("option-return-to-invoker"),
      named("runtime-state"),
    )).toBe(true);
    expect(hasNamed(
      named("decision-record-focus-return"),
      `${PROV}wasDerivedFrom`,
      named("message-31"),
    )).toBe(true);
    expect(hasNamed(
      named("decision-shape"),
      `${SHACL}targetClass`,
      `${DECISION}Decision`,
      named("validation-contract"),
    )).toBe(true);
    expect(hasNamed(
      named("decision-record-shape"),
      `${SHACL}targetClass`,
      `${DECISION}DecisionRecord`,
      named("validation-contract"),
    )).toBe(true);
    expect(result.quads.some((quad) => (
      quad.predicate.value === `${RDF}reifies`
      && quad.object.termType === "Triple"
      && quad.object.predicate.value === `${DECISION}selectedOption`
    ))).toBe(true);
    expect(result.graphs).toEqual(expect.arrayContaining([
      { termType: "NamedNode", value: named("runtime-state") },
      { termType: "NamedNode", value: named("validation-contract") },
    ]));
  });
});
