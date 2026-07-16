import { describe, expect, it } from "vitest";
import { detectDiscoveryCandidates } from "../src/discovery.js";
import { extractDataset } from "../src/extract.js";
// @ts-expect-error Vitest supplies Vite's raw-fixture import during tests.
import discoveryHtml from "../../../specs/discovery-enrichment/index.html?raw";

const SPEC = "https://ia2.dev/spec/discovery-enrichment";
const DCTERMS = "http://purl.org/dc/terms/";
const RDF_TYPE = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type";
const RDFS = "http://www.w3.org/2000/01/rdf-schema#";
const OWL = "http://www.w3.org/2002/07/owl#";
const SKOS = "http://www.w3.org/2004/02/skos/core#";
const DE = `${SPEC}#`;

describe("Discovery and Enrichment specification", () => {
  it("is a self-describing HTML/RDF publication", () => {
    const page = new DOMParser().parseFromString(discoveryHtml, "text/html");
    Object.defineProperty(page, "URL", {
      configurable: true,
      value: "http://127.0.0.1:8791/spec/discovery-enrichment",
    });

    const result = extractDataset(page);
    const hasNamed = (subject: string, predicate: string, object: string): boolean => (
      result.quads.some((quad) => (
        quad.subject.termType === "NamedNode"
        && quad.subject.value === subject
        && quad.predicate.value === predicate
        && quad.object.termType === "NamedNode"
        && quad.object.value === object
      ))
    );

    expect(result.diagnostics).toEqual([]);
    expect(result.sourceDocumentIri).toBe(SPEC);
    expect(hasNamed(SPEC, RDF_TYPE, "https://schema.org/TechArticle")).toBe(true);
    expect(hasNamed(SPEC, RDF_TYPE, `${OWL}Ontology`)).toBe(true);
    expect(hasNamed(SPEC, `${DCTERMS}relation`, "https://ia2.dev/spec/html-rdf")).toBe(true);
    expect(hasNamed(SPEC, `${DCTERMS}references`, "https://www.w3.org/TR/vocab-dcat-3/")).toBe(true);
    expect(hasNamed(`${DE}EnrichmentCandidate`, RDF_TYPE, `${OWL}Class`)).toBe(true);
    expect(hasNamed(`${DE}EnrichmentCandidate`, `${RDFS}subClassOf`, `${DE}EnrichmentArtifact`)).toBe(true);
    expect(hasNamed(`${DE}EnrichmentView`, `${RDFS}subClassOf`, "http://www.w3.org/ns/prov#Collection")).toBe(true);
    expect(hasNamed(`${DE}contextResource`, RDF_TYPE, `${OWL}ObjectProperty`)).toBe(true);
    expect(hasNamed(`${DE}contextResource`, `${RDFS}domain`, `${DE}EnrichmentCandidate`)).toBe(true);
    expect(hasNamed(`${DE}SupportingEvidence`, RDF_TYPE, `${DE}EnrichmentRole`)).toBe(true);
    expect(hasNamed(`${DE}SupportingEvidence`, `${SKOS}broader`, `${DE}Evidence`)).toBe(true);
    expect(hasNamed(`${DE}Available`, RDF_TYPE, `${DE}EnrichmentStatus`)).toBe(true);
    const candidates = detectDiscoveryCandidates(result);
    expect(candidates).toHaveLength(1);
    expect(candidates[0]?.target.value).toBe("https://ia2.dev/spec/html-rdf");
    expect(candidates[0]?.roles.map((role) => role.value)).toContain(`${DE}Definition`);
    expect(page.querySelector("#relationship-to-core")?.textContent).toContain("begins after that dataset exists");
    expect(page.querySelectorAll("#competency-questions li")).toHaveLength(17);
    expect(page.querySelector("#no-implicit-retrieval")?.textContent).toContain("MUST NOT");
    expect(page.querySelector("#boundaries")?.textContent).toContain("remain distinguishable");
  });
});
