import { describe, expect, it } from "vitest";
import { extractDataset } from "../src/extract.js";
import type { ExtractionResult, Quad } from "../src/model.js";
// @ts-expect-error Vitest supplies Vite's raw-fixture import during tests.
import htmlRdfSpecificationHtml from "../../../specs/html-rdf/index.html?raw";
// @ts-expect-error Vitest supplies Vite's raw-fixture import during tests.
import hareSpecificationHtml from "../../../specs/resource-envelope/index.html?raw";
// @ts-expect-error Vitest supplies Vite's raw-fixture import during tests.
import decisionHandoffHtml from "../../../specs/resource-envelope/examples/decision-handoff.html?raw";
// @ts-expect-error Vitest supplies Vite's raw-fixture import during tests.
import inspectionEvidenceHtml from "../../../specs/resource-envelope/examples/inspection-evidence.html?raw";
// @ts-expect-error Vitest supplies Vite's raw-fixture import during tests.
import releaseHandoffHtml from "../../../specs/resource-envelope/examples/release-handoff.html?raw";
// @ts-expect-error Vitest supplies Vite's raw-fixture import during tests.
import vendorReviewHtml from "../../../specs/resource-envelope/examples/vendor-review.html?raw";
// @ts-expect-error Vitest supplies Vite's raw-fixture import during tests.
import demoIndexHtml from "../../../demos/live-workspace/index.html?raw";
// @ts-expect-error Vitest supplies Vite's raw-fixture import during tests.
import inboxDemoHtml from "../../../demos/live-workspace/inbox/index.html?raw";
// @ts-expect-error Vitest supplies Vite's raw-fixture import during tests.
import issuesDemoHtml from "../../../demos/live-workspace/issues/index.html?raw";
// @ts-expect-error Vitest supplies Vite's raw-fixture import during tests.
import knowledgeDemoHtml from "../../../demos/live-workspace/knowledge-model/index.html?raw";
// @ts-expect-error Vitest supplies Vite's raw-fixture import during tests.
import releaseDemoHtml from "../../../demos/live-workspace/release-brief/index.html?raw";
// @ts-expect-error Vitest supplies Vite's raw-fixture import during tests.
import vendorDemoHtml from "../../../demos/live-workspace/vendor-review/index.html?raw";

const DCTERMS = "http://purl.org/dc/terms/";
const HTML_RDF = "https://ia2.dev/spec/html-rdf";
const HARE = "https://ia2.dev/spec/resource-envelope#";

type Format = "html-rdf" | "hare-specification" | "hare-envelope";

const publications: readonly [string, string, string, Format][] = [
  ["HTML/RDF specification", htmlRdfSpecificationHtml, HTML_RDF, "html-rdf"],
  ["HARE specification", hareSpecificationHtml, "https://ia2.dev/spec/resource-envelope", "hare-specification"],
  ["Atlas handoff", decisionHandoffHtml, "https://ia2.dev/spec/resource-envelope/examples/decision-handoff.html", "hare-envelope"],
  ["Riverside evidence", inspectionEvidenceHtml, "https://ia2.dev/spec/resource-envelope/examples/inspection-evidence.html", "hare-envelope"],
  ["Orion handoff", releaseHandoffHtml, "https://ia2.dev/spec/resource-envelope/examples/release-handoff.html", "hare-envelope"],
  ["Northstar handoff", vendorReviewHtml, "https://ia2.dev/spec/resource-envelope/examples/vendor-review.html", "hare-envelope"],
  ["demo index", demoIndexHtml, "https://ia2.dev/demos/live-workspace/", "html-rdf"],
  ["inbox demo", inboxDemoHtml, "https://ia2.dev/demos/live-workspace/inbox/", "html-rdf"],
  ["issues demo", issuesDemoHtml, "https://ia2.dev/demos/live-workspace/issues/", "html-rdf"],
  ["knowledge demo", knowledgeDemoHtml, "https://ia2.dev/demos/live-workspace/knowledge-model/", "html-rdf"],
  ["release demo", releaseDemoHtml, "https://ia2.dev/demos/live-workspace/release-brief/", "html-rdf"],
  ["vendor demo", vendorDemoHtml, "https://ia2.dev/demos/live-workspace/vendor-review/", "html-rdf"],
];

function parse(html: string, retrievalUrl: string): Document {
  const page = new DOMParser().parseFromString(html, "text/html");
  Object.defineProperty(page, "URL", { configurable: true, value: retrievalUrl });
  return page;
}

function matches(result: ExtractionResult, subject: string, predicate: string): Quad[] {
  return result.quads.filter((quad) => (
    quad.subject.termType === "NamedNode"
    && quad.subject.value === subject
    && quad.predicate.value === predicate
  ));
}

function namedValues(result: ExtractionResult, subject: string, predicate: string): string[] {
  return matches(result, subject, predicate).flatMap((quad) => (
    quad.object.termType === "NamedNode" ? [quad.object.value] : []
  ));
}

describe("embedded format notes", () => {
  it.each(publications)("self-describes the format of the %s", (_name, html, url, format) => {
    const page = parse(html, url);
    const result = extractDataset(page);
    const documentIri = result.sourceDocumentIri;

    expect(result.diagnostics).toEqual([]);
    expect(page.querySelectorAll("#format-note")).toHaveLength(1);

    const abstracts = matches(result, documentIri, `${DCTERMS}abstract`);
    expect(abstracts).toHaveLength(1);
    const note = abstracts[0]?.object;
    if (note?.termType !== "Literal") throw new Error("Format note must be a literal abstract.");
    expect(note.value).toContain("IA² HTML/RDF");

    if (format === "html-rdf") {
      expect(note.value).toContain("rdf-predicate");
      expect(namedValues(result, documentIri, `${DCTERMS}conformsTo`)).toContain(HTML_RDF);
      expect(abstracts[0]?.graph).toBeNull();
      return;
    }

    expect(note.value).toContain("HARE 0.1");
    expect(note.value).toContain("manifestGraph");
    expect(note.value).toContain("hare:representation");
    if (format === "hare-envelope") {
      expect(namedValues(result, documentIri, `${DCTERMS}conformsTo`)).toContain(`${HARE}HARE-0.1`);
      expect(abstracts[0]?.graph).toEqual({ termType: "NamedNode", value: `${documentIri}#manifest` });
    } else {
      expect(abstracts[0]?.graph).toBeNull();
    }
  });
});
