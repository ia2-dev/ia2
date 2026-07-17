import { describe, expect, it } from "vitest";
import { extractDataset } from "../src/extract.js";
import type { ExtractionResult, Quad } from "../src/model.js";
// @ts-expect-error Vitest supplies Vite's raw-fixture import during tests.
import specificationHtml from "../../../specs/resource-envelope/index.html?raw";
// @ts-expect-error Vitest supplies Vite's raw-fixture import during tests.
import decisionHandoffHtml from "../../../specs/resource-envelope/examples/decision-handoff.html?raw";
// @ts-expect-error Vitest supplies Vite's raw-fixture import during tests.
import vendorReviewHtml from "../../../specs/resource-envelope/examples/vendor-review.html?raw";
// @ts-expect-error Vitest supplies Vite's raw-fixture import during tests.
import guideHtml from "../../../site/guide/index.html?raw";

const SPEC = "https://ia2.dev/spec/resource-envelope";
const HARE = `${SPEC}#`;
const DC = "http://purl.org/dc/elements/1.1/";
const DCTERMS = "http://purl.org/dc/terms/";
const CRED = "https://www.w3.org/2018/credentials#";
const RDF_TYPE = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type";
const SHACL = "http://www.w3.org/ns/shacl#";

function parse(html: string, retrievalUrl: string): Document {
  const page = new DOMParser().parseFromString(html, "text/html");
  Object.defineProperty(page, "URL", { configurable: true, value: retrievalUrl });
  return page;
}

function matching(
  result: ExtractionResult,
  subject: string,
  predicate: string,
): Quad[] {
  return result.quads.filter((quad) => (
    quad.subject.termType === "NamedNode"
    && quad.subject.value === subject
    && quad.predicate.value === predicate
  ));
}

function namedValue(result: ExtractionResult, subject: string, predicate: string): string {
  const matches = matching(result, subject, predicate);
  expect(matches).toHaveLength(1);
  const object = matches[0]!.object;
  if (object.termType !== "NamedNode") throw new Error(`Expected a named node for ${predicate}.`);
  return object.value;
}

function namedValues(result: ExtractionResult, subject: string, predicate: string): string[] {
  return matching(result, subject, predicate).map((quad) => {
    if (quad.object.termType !== "NamedNode") throw new Error(`Expected a named node for ${predicate}.`);
    return quad.object.value;
  });
}

function literalValue(result: ExtractionResult, subject: string, predicate: string): string {
  const matches = matching(result, subject, predicate);
  expect(matches).toHaveLength(1);
  const object = matches[0]!.object;
  if (object.termType !== "Literal") throw new Error(`Expected a literal for ${predicate}.`);
  return object.value;
}

function optionalLiteralValue(result: ExtractionResult, subject: string, predicate: string): string | null {
  const matches = matching(result, subject, predicate);
  expect(matches.length).toBeLessThanOrEqual(1);
  if (matches.length === 0) return null;
  const object = matches[0]!.object;
  if (object.termType !== "Literal") throw new Error(`Expected a literal for ${predicate}.`);
  return object.value;
}

function decodePayload(page: Document, payloadIri: string): Uint8Array {
  const payloadId = decodeURIComponent(new URL(payloadIri).hash.slice(1));
  const payload = page.getElementById(payloadId);
  expect(payload?.localName).toBe("script");
  expect(payload?.getAttribute("type")).toBe("application/octet-stream");
  expect(payload?.getAttribute("data-encoding")).toBe("base64");
  const encoded = payload!.textContent!.replace(/[\t\n\f\r ]+/g, "");
  return Uint8Array.from(atob(encoded), (character) => character.charCodeAt(0));
}

async function verifyEnvelope(page: Document, expectedResourceCount: number): Promise<ExtractionResult> {
  const result = extractDataset(page);
  const envelope = result.sourceDocumentIri;
  const manifest = `${envelope}#manifest`;

  expect(result.diagnostics).toEqual([]);
  expect(matching(result, envelope, RDF_TYPE).some((quad) => (
    quad.object.termType === "NamedNode" && quad.object.value === `${HARE}Envelope`
  ))).toBe(true);
  expect(namedValues(result, envelope, `${DCTERMS}conformsTo`)).toContain(`${HARE}HARE-0.1`);
  expect(namedValue(result, envelope, `${HARE}manifestGraph`)).toBe(manifest);
  const virtualBase = namedValue(result, envelope, `${HARE}virtualBase`);
  expect(virtualBase).toMatch(/^https:\/\/[a-z0-9-]+(?:\.[a-z0-9-]+)*\.invalid\/$/);
  expect(result.graphs.some((graph) => graph.termType === "NamedNode" && graph.value === manifest)).toBe(true);

  const resources = matching(result, envelope, `${DCTERMS}hasPart`).map((quad) => {
    if (quad.object.termType !== "NamedNode") throw new Error("Envelope resources must be named nodes.");
    return quad.object.value;
  });
  expect(resources).toHaveLength(expectedResourceCount);

  const virtualUrls = new Set([virtualBase]);
  for (const resource of resources) {
    const representations = namedValues(result, resource, `${HARE}representation`);
    expect(representations.length).toBeGreaterThan(0);
    for (const representation of representations) {
      const types = namedValues(result, representation, RDF_TYPE);
      const isDom = types.includes(`${HARE}DOMRepresentation`);
      const isBytes = types.includes(`${HARE}ByteRepresentation`);
      expect(Number(isDom) + Number(isBytes)).toBe(1);

      const path = optionalLiteralValue(result, representation, `${DCTERMS}identifier`);
      if (path !== null) expect(path.startsWith("/")).toBe(true);
      if (isDom) expect(path).not.toBeNull();
      if (path !== null) {
        const virtualUrl = new URL(path, virtualBase).href;
        expect(virtualUrls.has(virtualUrl)).toBe(false);
        virtualUrls.add(virtualUrl);
      }
      const mediaType = literalValue(result, representation, `${DC}format`);
      expect(mediaType).not.toBe("");
      const carrier = namedValue(result, representation, `${HARE}carrier`);
      const carrierId = decodeURIComponent(new URL(carrier).hash.slice(1));

      if (isDom) {
        expect(mediaType).toBe("text/html");
        expect(page.getElementById(carrierId)?.localName).toBe("template");
        continue;
      }

      const length = Number(literalValue(result, representation, `${HARE}byteLength`));
      const integrity = literalValue(result, representation, `${CRED}digestSRI`);
      const bytes = decodePayload(page, carrier);
      const digestInput = new ArrayBuffer(bytes.byteLength);
      new Uint8Array(digestInput).set(bytes);
      const digestBytes = new Uint8Array(await globalThis.crypto.subtle.digest("SHA-256", digestInput));
      const digest = btoa(Array.from(digestBytes, (byte) => String.fromCharCode(byte)).join(""));

      expect(bytes.byteLength).toBe(length);
      expect(integrity).toBe(`sha256-${digest}`);
    }
  }

  return result;
}

describe("IA² HTML Agent Resource Envelope specification", () => {
  it("is a self-describing HTML/RDF vocabulary and ReSpec source", () => {
    const page = parse(specificationHtml, "http://127.0.0.1:8791/spec/resource-envelope");
    const result = extractDataset(page);

    expect(result.diagnostics).toEqual([]);
    expect(result.sourceDocumentIri).toBe(SPEC);
    expect(page.title).toBe("IA² HTML Agent Resource Envelope 0.1");
    expect(literalValue(result, SPEC, `${DCTERMS}title`)).toBe("IA² HTML Agent Resource Envelope 0.1");
    expect(literalValue(result, SPEC, `${DCTERMS}alternative`)).toBe("HARE 0.1");
    expect(page.querySelector("script[src*='respec']")).not.toBeNull();
    expect(page.querySelectorAll('a[href^="examples/"]')).toHaveLength(0);
    expect(page.querySelectorAll("pre.example.html").length).toBeGreaterThanOrEqual(4);
    expect(page.querySelector("#examples")?.textContent).toContain('id="greeting-content"');
    expect(page.querySelector("#examples")?.textContent).toContain("aGVsbG8=");
    expect(page.querySelector("#canonical-retrieval-locations")?.textContent).toContain('rel="canonical"');
    expect(page.querySelector("#canonical-retrieval-locations")?.textContent).toContain("before computing");
    expect(page.querySelector("#runtime-model")?.textContent).toContain("including a browser extension");
    const authoredStyles = page.querySelectorAll("style:not(.remove)");
    expect(authoredStyles).toHaveLength(1);
    expect(authoredStyles[0]?.getAttribute("data-purpose")).toBe("responsive-tables");
    for (const term of ["Envelope", "Representation", "DOMRepresentation", "ByteRepresentation", "ViewerRuntime"]) {
      expect(matching(result, `${HARE}${term}`, RDF_TYPE).some((quad) => (
        quad.object.termType === "NamedNode"
        && quad.object.value === "http://www.w3.org/2002/07/owl#Class"
      ))).toBe(true);
    }

    const envelopeShape = matching(result, `${HARE}EnvelopeShape`, RDF_TYPE).find((quad) => (
      quad.object.termType === "NamedNode" && quad.object.value === `${SHACL}NodeShape`
    ));
    if (!envelopeShape?.graph) throw new Error("EnvelopeShape must be in the named shapes graph.");
    expect(envelopeShape.graph.termType).toBe("NamedNode");
    expect(envelopeShape.graph.value).toBe(`${SPEC}#shapes`);
    expect(namedValue(result, `${HARE}EnvelopeConformanceShape`, `${SHACL}path`)).toBe(`${DCTERMS}conformsTo`);
    expect(namedValue(result, `${HARE}EnvelopeConformanceShape`, `${SHACL}hasValue`)).toBe(`${HARE}HARE-0.1`);
    expect(namedValue(result, `${HARE}EnvelopeVirtualBaseShape`, `${SHACL}path`)).toBe(`${HARE}virtualBase`);
  });

  it("is introduced by the authoring guide with working examples", () => {
    const page = parse(guideHtml, "http://127.0.0.1:8791/guide/html-rdf");
    const result = extractDataset(page);

    expect(result.diagnostics).toEqual([]);
    expect(page.querySelector('#guide-toc-list a[href="#hare"]')).not.toBeNull();
    expect(page.querySelector('#guide-toc-list a[href="#agent-skills"]')).not.toBeNull();
    expect(page.querySelector("#hare-title")?.textContent).toContain("resources");
    expect(page.querySelector('#hare a[href="/spec/resource-envelope"]')).not.toBeNull();
    expect(page.querySelector('#hare a[href="/spec/resource-envelope/examples/decision-handoff.html"]')).not.toBeNull();
    expect(page.querySelector('#hare a[href="/spec/resource-envelope/examples/vendor-review.html"]')).not.toBeNull();
    expect(page.querySelector('#hare a[href="/spec/resource-envelope/examples/inspection-evidence.html"]')).not.toBeNull();
    expect(page.querySelector('#hare a[href="/spec/resource-envelope/examples/release-handoff.html"]')).not.toBeNull();
    expect(page.querySelector("#hare")?.textContent).toContain("@ia2-dev/hare-viewer");
    expect(page.querySelector("#agent-skills")?.textContent).toContain("ia2-html-rdf");
    expect(page.querySelector("#agent-skills")?.textContent).toContain("ia2-hare");
    expect(page.querySelector("#agent-skills")?.textContent).toContain("claude --plugin-dir ./plugins/ia2");
    expect(matching(result, `${result.sourceDocumentIri}#agent-skills`, `${DCTERMS}references`).some((quad) => (
      quad.object.termType === "NamedNode"
      && quad.object.value === "https://github.com/ia2-dev/ia2/tree/main/plugins/ia2"
    ))).toBe(true);
    expect(matching(result, result.sourceDocumentIri, "http://purl.org/dc/terms/references").some((quad) => (
      quad.object.termType === "NamedNode" && quad.object.value === SPEC
    ))).toBe(true);
  });
});

describe("HARE examples", () => {
  it("provides a complete declarative envelope with DOM and verified byte representations", async () => {
    const page = parse(decisionHandoffHtml, "file:///tmp/decision-handoff.hare.html");
    const result = await verifyEnvelope(page, 2);
    expect(namedValues(result, result.sourceDocumentIri, `${DCTERMS}conformsTo`)).toContain(`${HARE}DeclarativeProfile`);
    expect(page.querySelectorAll('script:not([type="application/octet-stream"])')).toHaveLength(0);
    expect(matching(
      result,
      `${result.sourceDocumentIri}#decision`,
      "http://www.w3.org/ns/prov#wasDerivedFrom",
    )).toHaveLength(1);
  });

  it("provides a self-viewing envelope whose resources verify independently", async () => {
    const page = parse(vendorReviewHtml, "file:///tmp/vendor-review.hare.html");
    const result = await verifyEnvelope(page, 4);
    const envelope = result.sourceDocumentIri;
    expect(namedValues(result, envelope, `${DCTERMS}conformsTo`)).toContain(`${HARE}SelfViewingProfile`);
    expect(namedValue(result, envelope, `${HARE}runtime`)).toBe(`${envelope}#viewer-runtime`);
    expect(page.querySelectorAll('script[type="module"]#viewer-runtime')).toHaveLength(1);
    expect(() => new Function(page.querySelector("#viewer-runtime")?.textContent || "")).not.toThrow();
    expect(page.querySelector("#viewer-runtime")?.textContent).toContain('download.download = filename');
    expect(page.querySelector("#viewer-runtime")?.textContent).toContain('download.textContent = "Download file"');
    expect(page.querySelector("noscript")?.textContent).toContain("complete human-readable manifest");
  });
});
