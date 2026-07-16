import { describe, expect, it } from "vitest";
import { detectDiscoveryCandidates } from "../src/discovery.js";
import { extractDataset } from "../src/extract.js";

describe("detectDiscoveryCandidates", () => {
  it("normalizes direct and qualified discovery into one candidate", () => {
    document.head.innerHTML = '<link rel="canonical" href="https://example.com/report">';
    document.documentElement.setAttribute("rdf-version", "1.2");
    document.body.innerHTML = `
      <a href="/evidence" rdf-subject="#claim" rdf-predicate="http://www.w3.org/2000/01/rdf-schema#seeAlso">Evidence</a>
      <meta rdf-subject="#claim" rdf-predicate="http://www.w3.org/ns/dcat#qualifiedRelation" rdf-object-key="evidence-relation">
      <link href="/evidence" rdf-subject-key="evidence-relation" rdf-predicate="http://purl.org/dc/terms/relation">
      <link href="https://ia2.dev/spec/discovery-enrichment#SupportingEvidence" rdf-subject-key="evidence-relation" rdf-predicate="http://www.w3.org/ns/dcat#hadRole">
      <a id="local" href="#local" rdf-predicate="http://www.w3.org/2000/01/rdf-schema#seeAlso">Local details</a>
    `;

    const candidates = detectDiscoveryCandidates(extractDataset(document));

    expect(candidates).toHaveLength(1);
    expect(candidates[0]?.context.value).toBe("https://example.com/report#claim");
    expect(candidates[0]?.target.value).toBe("https://example.com/evidence");
    expect(candidates[0]?.predicates.map((term) => term.value)).toEqual([
      "http://www.w3.org/2000/01/rdf-schema#seeAlso",
    ]);
    expect(candidates[0]?.roles.map((term) => term.value)).toEqual([
      "https://ia2.dev/spec/discovery-enrichment#SupportingEvidence",
    ]);
    expect(candidates[0]?.qualifiedRelationships).toHaveLength(1);
  });
});
