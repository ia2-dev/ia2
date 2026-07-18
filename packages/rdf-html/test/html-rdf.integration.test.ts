import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { JSDOM } from "jsdom";
import { Parser } from "n3";
import { describe, expect, it, vi } from "vitest";
import { extractDataset } from "../../html-rdf-navigator/src/extract.js";
import { serializeTurtle } from "../../html-rdf-navigator/src/serialize.js";
import { HTML_SNAPSHOT_DATE } from "../src/generated/elements.js";
import { parseRdfHtml } from "../src/parse.js";
import { renderRdfHtmlDocument } from "../src/render.js";

function normalizedQuadKeys(quads: readonly any[]): string[] {
  const blanks = new Map<string, string>();
  const term = (value: any): unknown => {
    if (value === null || value?.termType === "DefaultGraph") return ["DefaultGraph"];
    if (value.termType === "BlankNode") {
      if (!blanks.has(value.value)) blanks.set(value.value, `b${blanks.size}`);
      return ["BlankNode", blanks.get(value.value)];
    }
    if (value.termType === "Literal") {
      return ["Literal", value.value, value.datatype.value, value.language ?? "", value.direction ?? ""];
    }
    return [value.termType, value.value];
  };
  return quads.map((quad) => JSON.stringify([
    term(quad.subject),
    term(quad.predicate),
    term(quad.object),
    term(quad.graph),
  ]));
}

describe("RDF/HTML to HTML/RDF integration", () => {
  it("publishes the complete generated vocabulary through in-page HTML/RDF", () => {
    const specification = readFileSync(resolve(process.cwd(), "../../specs/rdf-html/index.html"), "utf8");
    const vocabularySource = readFileSync(resolve(process.cwd(), `vocabulary/rdf-html-${HTML_SNAPSHOT_DATE}.ttl`), "utf8");
    const expected = new Parser({ baseIRI: "https://ia2.dev/spec/rdf-html" }).parse(vocabularySource);
    const dom = new JSDOM(specification, { url: "https://ia2.dev/spec/rdf-html" });
    vi.stubGlobal("Node", dom.window.Node);
    const extracted = (() => {
      try {
        return extractDataset(dom.window.document);
      } finally {
        vi.unstubAllGlobals();
      }
    })();
    const embedded = extracted.quads.filter((quad) => quad.source.closest("#embedded-rdfhtml-vocabulary"));

    expect(extracted.diagnostics).toHaveLength(0);
    expect(embedded).toHaveLength(expected.length);
    expect(normalizedQuadKeys(embedded)).toEqual(normalizedQuadKeys(expected));
    const turtle = serializeTurtle(extracted);
    expect(turtle).toContain("@prefix rdfhtml: <https://ia2.dev/spec/rdf-html#> .");
    expect(turtle).toContain("@prefix ord: <https://ontology.inferal.com/modules/ordering/> .");
    expect(turtle).toContain("rdfhtml:accessKey rdf:type rdfhtml:AttributeDefinition");
    expect(turtle).toContain("rdfhtml:hasChild owl:propertyChainAxiom");
    dom.window.close();
  });

  it("renders the public Turtle example and re-extracts its unconsumed domain RDF", () => {
    const source = readFileSync(resolve(process.cwd(), "../../specs/rdf-html/examples/welcome.ttl"), "utf8");
    const parsed = parseRdfHtml(source, {
      baseIRI: "https://ia2.dev/spec/rdf-html/examples/welcome.ttl",
      contentType: "text/turtle",
    });
    const rendered = renderRdfHtmlDocument(parsed.dataset, parsed.documents[0]!);
    const dom = new JSDOM(rendered.publicationHtml, { url: rendered.baseIRI });
    vi.stubGlobal("Node", dom.window.Node);
    const extracted = (() => {
      try {
        return extractDataset(dom.window.document);
      } finally {
        vi.unstubAllGlobals();
      }
    })();

    expect(rendered.html).toContain("<h1>Welcome</h1>");
    expect(extracted.diagnostics).toHaveLength(0);
    expect(extracted.quads).toEqual(expect.arrayContaining([
      expect.objectContaining({
        predicate: { termType: "NamedNode", value: "https://schema.org/about" },
        object: { termType: "NamedNode", value: "https://ia2.dev/spec/rdf-html/examples/welcome#rdf-html" },
      }),
      expect.objectContaining({
        predicate: { termType: "NamedNode", value: "https://schema.org/name" },
        object: expect.objectContaining({ termType: "Literal", value: "RDF/HTML" }),
      }),
    ]));
  });

  it("parses and renders every checked-in RDF/HTML example", () => {
    const examples = resolve(process.cwd(), "../../specs/rdf-html/examples");
    const files = readdirSync(examples)
      .filter((file) => file.endsWith(".ttl") || file.endsWith(".trig"))
      .sort();

    expect(files).toEqual([
      "accessibility-check.ttl",
      "alice-rabbit-hole.ttl",
      "conference-agenda.ttl",
      "field-observations.ttl",
      "independent-contributions.trig",
      "multi-audience.trig",
      "nasa-apollo-11.ttl",
      "welcome.ttl",
      "whatwg-dom-introduction.ttl",
    ]);

    for (const file of files) {
      const source = readFileSync(resolve(examples, file), "utf8");
      const parsed = parseRdfHtml(source, {
        baseIRI: `https://ia2.dev/spec/rdf-html/examples/${file}`,
        contentType: file.endsWith(".trig") ? "application/trig" : "text/turtle",
      });

      expect(parsed.documents.length, file).toBeGreaterThan(0);
      for (const document of parsed.documents) {
        const rendered = renderRdfHtmlDocument(parsed.dataset, document);
        expect(rendered.html, `${file}: ${document.label}`).toContain("<html");
      }
    }
  });

  it("offers both views from the multi-document example", () => {
    const file = "multi-audience.trig";
    const source = readFileSync(resolve(process.cwd(), `../../specs/rdf-html/examples/${file}`), "utf8");
    const parsed = parseRdfHtml(source, {
      baseIRI: `https://ia2.dev/spec/rdf-html/examples/${file}`,
      contentType: "application/trig",
    });

    expect(parsed.documents.map(({ label }) => label)).toEqual([
      "Operations handoff",
      "Public service update",
    ]);
    expect([...parsed.dataset].some((quad) => quad.graph.value.endsWith("#incident-graph"))).toBe(true);
  });
});
