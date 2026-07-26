import { beforeEach, describe, expect, it } from "vitest";
import { extractDataset } from "../src/extract.js";
import { serializeJsonLd, serializeTurtle } from "../src/serialize.js";

function page(body: string, head = ""): void {
  document.documentElement.setAttribute("rdf-version", "1.2");
  document.documentElement.removeAttribute("lang");
  document.head.innerHTML = `<base href="https://example.com/base/">${head}`;
  document.body.innerHTML = body;
  Object.defineProperty(document, "URL", { configurable: true, value: "https://example.com/page" });
}

function pageWithoutBase(body: string, head = ""): void {
  document.documentElement.setAttribute("rdf-version", "1.2");
  document.documentElement.removeAttribute("lang");
  document.head.innerHTML = head;
  document.body.innerHTML = body;
  Object.defineProperty(document, "URL", { configurable: true, value: "http://127.0.0.1:8765/specs/html-rdf/" });
}

beforeEach(() => page(""));

describe("extractDataset", () => {
  it("extracts an id-derived subject and normalized literal", () => {
    page('<h1 id="alice" rdf-predicate="https://schema.org/name"> Alice <em>Example</em> </h1>');
    const result = extractDataset(document);
    expect(result.diagnostics).toHaveLength(0);
    expect(result.quads).toHaveLength(1);
    expect(result.quads[0]?.subject).toEqual({ termType: "NamedNode", value: "https://example.com/page#alice" });
    expect(result.quads[0]?.object).toMatchObject({ termType: "Literal", value: "Alice Example" });
  });

  it("uses one canonical link for document identity and the implicit RDF base", () => {
    pageWithoutBase(`
      <h1 id="overview" rdf-predicate="https://schema.org/name">Overview</h1>
      <a href="/people/alice" rdf-subject="" rdf-predicate="https://schema.org/about">Alice</a>
    `, '<link rel="alternate CANONICAL" href="https://ia2.dev/spec/html-rdf">');
    const result = extractDataset(document);

    expect(result.diagnostics).toHaveLength(0);
    expect(result.retrievalDocumentIri).toBe("http://127.0.0.1:8765/specs/html-rdf/");
    expect(result.sourceDocumentIri).toBe("https://ia2.dev/spec/html-rdf");
    expect(result.baseIri).toBe("https://ia2.dev/spec/html-rdf");
    expect(result.quads[0]?.subject).toEqual({ termType: "NamedNode", value: "https://ia2.dev/spec/html-rdf#overview" });
    expect(result.quads[1]?.subject).toEqual({ termType: "NamedNode", value: "https://ia2.dev/spec/html-rdf" });
    expect(result.quads[1]?.object).toEqual({ termType: "NamedNode", value: "https://ia2.dev/people/alice" });
  });

  it("keeps an explicit HTML base while using canonical fragment identity", () => {
    page(
      '<h1 id="overview" rdf-predicate="https://schema.org/name">Overview</h1><span rdf-subject="item" rdf-predicate="https://schema.org/name">Item</span>',
      '<link rel="canonical" href="https://ia2.dev/spec/html-rdf">',
    );
    const result = extractDataset(document);

    expect(result.sourceDocumentIri).toBe("https://ia2.dev/spec/html-rdf");
    expect(result.baseIri).toBe("https://example.com/base/");
    expect(result.quads[0]?.subject).toEqual({ termType: "NamedNode", value: "https://ia2.dev/spec/html-rdf#overview" });
    expect(result.quads[1]?.subject).toEqual({ termType: "NamedNode", value: "https://example.com/base/item" });
  });

  it("diagnoses competing canonical links and falls back to the retrieval IRI", () => {
    pageWithoutBase(
      '<h1 id="overview" rdf-predicate="https://schema.org/name">Overview</h1>',
      '<link rel="canonical" href="https://example.com/one"><link rel="canonical" href="https://example.com/two">',
    );
    const result = extractDataset(document);

    expect(result.diagnostics.map(({ code }) => code)).toEqual(["multiple-canonical-links"]);
    expect(result.sourceDocumentIri).toBe("http://127.0.0.1:8765/specs/html-rdf/");
    expect(result.baseIri).toBe("http://127.0.0.1:8765/specs/html-rdf/");
    expect(result.quads[0]?.subject).toEqual({ termType: "NamedNode", value: "http://127.0.0.1:8765/specs/html-rdf/#overview" });
  });

  it("correlates blank nodes across subject and object positions", () => {
    page(`
      <span rdf-subject="/alice" rdf-predicate="https://schema.org/address" rdf-object-key="address"></span>
      <data value="Paris" rdf-subject-key="address" rdf-predicate="https://schema.org/addressLocality"></data>
    `);
    const result = extractDataset(document);
    expect(result.quads[0]?.object).toEqual(result.quads[1]?.subject);
  });

  it("uses native IRI and exact typed-literal carriers", () => {
    page(`
      <a href="/bob" rdf-subject="/alice" rdf-predicate="https://schema.org/knows">Bob</a>
      <data value="01" rdf-subject="/widget" rdf-predicate="https://example.com/count" rdf-datatype="http://www.w3.org/2001/XMLSchema#integer">1</data>
    `);
    const result = extractDataset(document);
    expect(result.quads[0]?.object).toEqual({ termType: "NamedNode", value: "https://example.com/bob" });
    expect(result.quads[1]?.object).toMatchObject({ termType: "Literal", value: "01" });
  });

  it("uses the document language as the default for untyped literals", () => {
    page(`
      <h1 id="intro" rdf-predicate="http://purl.org/dc/terms/title">Introduction</h1>
      <p id="resume" lang="fr" rdf-predicate="http://purl.org/dc/terms/title">Résumé</p>
      <p id="code" lang="" rdf-predicate="http://purl.org/dc/terms/title">IA2</p>
      <p id="directed" dir="RTL" rdf-predicate="http://purl.org/dc/terms/title">مقدمة</p>
      <data id="count" value="01" rdf-predicate="https://example.com/count"
        rdf-datatype="http://www.w3.org/2001/XMLSchema#integer">1</data>
    `);
    document.documentElement.setAttribute("lang", "en");

    const result = extractDataset(document);

    expect(result.diagnostics).toHaveLength(0);
    expect(result.quads.map(({ object }) => object)).toEqual([
      expect.objectContaining({ termType: "Literal", value: "Introduction", language: "en" }),
      expect.objectContaining({ termType: "Literal", value: "Résumé", language: "fr" }),
      expect.objectContaining({
        termType: "Literal",
        value: "IA2",
        datatype: { termType: "NamedNode", value: "http://www.w3.org/2001/XMLSchema#string" },
        language: "",
      }),
      expect.objectContaining({ termType: "Literal", value: "مقدمة", language: "en", direction: "rtl" }),
      expect.objectContaining({
        termType: "Literal",
        value: "01",
        datatype: { termType: "NamedNode", value: "http://www.w3.org/2001/XMLSchema#integer" },
        language: "",
      }),
    ]);
  });

  it("does not use non-root ancestor language as an RDF default", () => {
    page(`
      <section lang="fr">
        <p id="local" rdf-predicate="http://purl.org/dc/terms/title">Sans langue RDF</p>
      </section>
    `);

    const result = extractDataset(document);

    expect(result.diagnostics).toHaveLength(0);
    expect(result.quads[0]?.object).toEqual({
      termType: "Literal",
      value: "Sans langue RDF",
      datatype: { termType: "NamedNode", value: "http://www.w3.org/2001/XMLSchema#string" },
      language: "",
    });
  });

  it("diagnoses a malformed document language only when it supplies a literal default", () => {
    page(`
      <p id="defaulted" rdf-predicate="http://purl.org/dc/terms/title">Invalid default</p>
      <p id="suppressed" lang="" rdf-predicate="http://purl.org/dc/terms/title">Suppressed default</p>
      <data id="typed" value="1" rdf-predicate="https://example.com/count"
        rdf-datatype="http://www.w3.org/2001/XMLSchema#integer">1</data>
    `);
    document.documentElement.setAttribute("lang", "not_a_language");

    const result = extractDataset(document);

    expect(result.diagnostics.map(({ code }) => code)).toEqual(["invalid-language"]);
    expect(result.quads.map(({ object }) => object)).toEqual([
      expect.objectContaining({ termType: "Literal", value: "Suppressed default", language: "" }),
      expect.objectContaining({ termType: "Literal", value: "1", language: "" }),
    ]);
  });

  it("keeps a triple term inert while constructing the outer statement", () => {
    page(`
      <aside rdf-subject-key="claim" rdf-predicate="http://www.w3.org/1999/02/22-rdf-syntax-ns#reifies">
        Human context
        <template><a href="/bob" rdf-subject="/alice" rdf-predicate="https://schema.org/knows">Bob</a></template>
      </aside>
    `);
    const result = extractDataset(document);
    expect(result.quads).toHaveLength(1);
    expect(result.quads[0]?.object.termType).toBe("Triple");
    expect(serializeTurtle(result)).toContain("<<( <https://example.com/alice> schema:knows <https://example.com/bob> )>>");
  });

  it("preserves named and empty graph structure", () => {
    page(`
      <span rdf-subject="/alice" rdf-predicate="https://schema.org/name" rdf-graph="/people">Alice</span>
      <template rdf-graph="/reserved"></template>
    `);
    const result = extractDataset(document);
    expect(result.graphs).toHaveLength(2);
    expect(serializeTurtle(result)).toContain("<https://example.com/reserved> {\n}");
    expect(JSON.parse(serializeJsonLd(result))).toEqual(expect.arrayContaining([expect.objectContaining({ "@id": "https://example.com/reserved", "@graph": [] })]));
  });

  it("reports invalid competing carriers and continues", () => {
    page(`
      <a href="/bob" rdf-object-key="bob" rdf-subject="/alice" rdf-predicate="https://schema.org/knows">Bob</a>
      <span rdf-subject="/alice" rdf-predicate="https://schema.org/name">Alice</span>
    `);
    const result = extractDataset(document);
    expect(result.quads).toHaveLength(1);
    expect(result.diagnostics[0]?.code).toBe("competing-objects");
  });
});
