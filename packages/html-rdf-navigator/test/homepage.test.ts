import { describe, expect, it } from "vitest";
import { extractDataset } from "../src/extract.js";
// @ts-expect-error Vitest supplies Vite's raw-fixture import during tests.
import homepageHtml from "../../../site/index.html?raw";

const DCTERMS = "http://purl.org/dc/terms/";
const DECISION = "https://ontology.inferal.com/modules/decision/";
const ODRL = "http://www.w3.org/ns/odrl/2/";
const PROV = "http://www.w3.org/ns/prov#";
const RDF_TYPE = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type";
const SCHEMA = "https://schema.org/";

describe("IA² homepage semantics", () => {
  it("separates the website, project, source, and published artifacts", () => {
    const page = new DOMParser().parseFromString(homepageHtml, "text/html");
    Object.defineProperty(page, "URL", { configurable: true, value: "http://127.0.0.1:8791/" });

    const result = extractDataset(page);
    expect(page.querySelector('a[href="#architecture"]')?.textContent).toBe("Architecture");
    expect(page.querySelector("#architecture")).not.toBeNull();
    expect(page.querySelector("#horizon")).toBeNull();
    const specSwitchers = Array.from(page.querySelectorAll("[data-spec-switcher]"));
    expect(specSwitchers).toHaveLength(3);
    for (const switcher of specSwitchers) {
      expect(switcher.querySelector(".spec-switcher__current")?.getAttribute("href")).toBe("/spec/html-rdf");
      expect(switcher.querySelector('.spec-switcher__option[aria-current="true"]')?.getAttribute("href")).toBe("/spec/html-rdf");
      expect(switcher.querySelector('a[href="/spec/discovery-enrichment"]')).not.toBeNull();
    }
    expect(page.querySelector('script[src^="/home.js?"]')).not.toBeNull();
    const hero = page.querySelector(".hero");
    expect(hero?.querySelector<HTMLAnchorElement>('.hero-actions a[href="/demos/live-workspace/"]')?.textContent?.trim()).toBe("Live demo ↗");
    expect(hero?.textContent).not.toContain("Working now:");
    expect(hero?.textContent).not.toContain("Agent reading");
    expect(hero?.textContent).not.toContain("Authority preserved");
    expect(hero?.textContent).not.toContain("Select a relationship to inspect");
    expect(hero?.querySelector("figcaption, .proof-footer, .hero-note")).toBeNull();
    const proofTargets = Array.from(page.querySelectorAll<HTMLAnchorElement>(".agent-proof a[data-rdf-target]"));
    expect(proofTargets).toHaveLength(7);
    for (const trigger of proofTargets) {
      const selector = trigger.dataset.rdfTarget;
      expect(selector).toBeTruthy();
      const target = page.querySelector(selector!);
      expect(target).toBe(trigger);
      expect(target?.hasAttribute("rdf-predicate")).toBe(true);
    }
    const caseTargets = Array.from(page.querySelectorAll<HTMLAnchorElement>(".decision-path a[data-rdf-target]"));
    expect(caseTargets).toHaveLength(5);
    for (const trigger of caseTargets) {
      const selector = trigger.dataset.rdfTarget;
      expect(selector).toBeTruthy();
      const target = page.querySelector(selector!);
      expect(target).toBe(trigger);
      expect(target?.hasAttribute("rdf-predicate")).toBe(true);
    }
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
    const reviewBase = "https://ia2.dev/demos/live-workspace/vendor-review/#";
    expect(has(`${reviewBase}review-northstar`, `${SCHEMA}about`, "NamedNode", `${reviewBase}northstar-platform`)).toBe(true);
    expect(has(`${reviewBase}decision-northstar`, `${DECISION}selectedOption`, "NamedNode", `${reviewBase}option-conditional`)).toBe(true);
    expect(has(`${reviewBase}review-northstar`, `${DCTERMS}conformsTo`, "NamedNode", `${reviewBase}security-policy`)).toBe(true);
    expect(has(`${reviewBase}claim-notification`, `${PROV}wasDerivedFrom`, "NamedNode", `${reviewBase}dpa`)).toBe(true);
    expect(has(`${reviewBase}approval-record`, `${DECISION}hasRationale`, "NamedNode", `${reviewBase}approval-rationale`)).toBe(true);
    expect(has(`${reviewBase}authority-policy`, `${ODRL}permission`, "NamedNode", `${reviewBase}draft-amendment-permission`)).toBe(true);
    expect(has(`${reviewBase}authority-policy`, `${ODRL}obligation`, "NamedNode", `${reviewBase}approve-vendor-duty`)).toBe(true);

    const architecturalReferences = [
      "https://www.w3.org/TR/activitystreams-vocabulary/",
      "https://www.w3.org/TR/rdf12-concepts/",
      "https://schema.org/docs/schemas.html",
      "https://www.w3.org/TR/dx-prof/",
      "https://www.w3.org/TR/r2rml/",
      "https://www.w3.org/TR/shacl/",
      "https://www.w3.org/TR/prov-o/",
      "https://ontology.inferal.com/modules/confidence/",
      "https://ontology.inferal.com/modules/scoped-statements/",
      "https://ontology.inferal.com/modules/decision/",
      "https://ontology.inferal.com/modules/conversation/",
      "https://ontology.inferal.com/modules/data-usage-processing-lineage/",
      "https://ontology.inferal.com/modules/artifact-evolution/",
      "https://www.w3.org/TR/vocab-dcat-3/",
    ];
    for (const reference of architecturalReferences) {
      expect(has("https://ia2.dev/", `${DCTERMS}references`, "NamedNode", reference)).toBe(true);
    }

    const artifacts = [
      "https://ia2.dev/spec/html-rdf",
      "https://ia2.dev/spec/discovery-enrichment",
      "https://ia2.dev/guide/html-rdf",
      "https://ia2.dev/demos/live-workspace",
      "https://ia2.dev/demos/live-workspace/vendor-review/",
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
