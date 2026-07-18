import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { JSDOM } from "jsdom";
import { describe, expect, it } from "vitest";
import { HTML_ATTRIBUTES, HTML_ELEMENTS, HTML_SNAPSHOT_DATE, htmlDocumentToRdfHtml, parseRdfHtml, renderRdfHtmlDocument, renderRdfHtmlPage, renderRdfHtmlWorkspace, RdfHtmlError } from "../src/index.js";

const prefix = `
@prefix rdfhtml: <https://ia2.dev/spec/rdf-html#> .
@prefix ord: <https://ontology.inferal.com/modules/ordering/> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix dcterms: <http://purl.org/dc/terms/> .
@prefix schema: <https://schema.org/> .
@prefix doc: <https://example.test/rdf-html/> .
`;

const documentSource = `${prefix}
doc:page
  a rdfhtml:Document ;
  rdfhtml:base <https://example.test/rendered/> ;
  dcterms:conformsTo <https://ia2.dev/spec/rdf-html/vocabulary/rdf-html-2026-07-18.ttl> ;
  dcterms:title "Welcome document" ;
  schema:about doc:subject ;
  rdfhtml:hasChild [
    a rdfhtml:DocumentType ;
    rdfhtml:documentTypeName "html" ;
    ord:immediatelyPrecedes doc:html
  ] .

doc:html a rdfhtml:Html ;
  rdfhtml:hasChild doc:head .

doc:head a rdfhtml:Head ;
  ord:immediatelyPrecedes doc:body ;
  rdfhtml:hasChild doc:title .

doc:title a rdfhtml:Title ;
  rdfhtml:hasChild [ a rdfhtml:Text ; rdfhtml:data "Welcome" ] .

doc:body a rdfhtml:Body ;
  rdfhtml:hasChild doc:heading .

doc:heading
  a rdfhtml:H1 ;
  ord:immediatelyPrecedes doc:paragraph ;
  rdfhtml:id "welcome" ;
  rdfhtml:hasChild [ a rdfhtml:Text ; rdfhtml:data "Welcome" ] .

doc:paragraph
  a rdfhtml:P ;
  rdfhtml:hasChild [ a rdfhtml:Text ; rdfhtml:data "Hello World!" ] .
`;

describe("RDF/HTML rendering", () => {
  it("renders every published Turtle and TriG example", () => {
    for (const file of [
      "accessibility-check.ttl",
      "alice-rabbit-hole.ttl",
      "conference-agenda.ttl",
      "field-observations.ttl",
      "independent-contributions.trig",
      "multi-audience.trig",
      "nasa-apollo-11.ttl",
      "welcome.ttl",
      "whatwg-dom-introduction.ttl",
    ]) {
      const source = readFileSync(resolve(process.cwd(), "../../specs/rdf-html/examples", file), "utf8");
      const parsed = parseRdfHtml(source, {
        baseIRI: `https://ia2.dev/spec/rdf-html/examples/${file}`,
        contentType: file.endsWith(".trig") ? "application/trig" : "text/turtle",
      });
      expect(parsed.documents.length, file).toBeGreaterThan(0);
      for (const document of parsed.documents) expect(renderRdfHtmlDocument(parsed.dataset, document).html, file).toContain("<html");
    }
  });

  it("uses flat broad precedence for independently contributed children", () => {
    const source = readFileSync(resolve(process.cwd(), "../../specs/rdf-html/examples/independent-contributions.trig"), "utf8");
    const parsed = parseRdfHtml(source, { baseIRI: "https://ia2.dev/spec/rdf-html/examples/independent-contributions.trig", contentType: "application/trig" });
    const rendered = renderRdfHtmlDocument(parsed.dataset, parsed.documents[0]!);
    expect(rendered.html).toContain('<h1>Service status</h1><p class="status">All systems are operational.</p><nav aria-label="Status actions">');
    expect(rendered.publicationHtml).toContain('rdf-graph="https://ia2.dev/spec/rdf-html/examples/independent-contributions#operations"');
    expect(source).toContain("ord:precedes doc:actions");
    expect(source).toMatch(/doc:body\s+a rdfhtml:Body ;\s+rdfhtml:hasChild doc:heading/);
  });

  it("generates every current element class from the dated snapshot", () => {
    expect(HTML_ELEMENTS).toHaveLength(113);
    expect(HTML_ELEMENTS.some((element) => element.tagName === "selectedcontent")).toBe(true);
    expect(HTML_ELEMENTS.some((element) => element.tagName === "keygen")).toBe(false);
  });

  it("generates current known attribute definitions while retaining a generic fallback", () => {
    expect(HTML_ATTRIBUTES).toHaveLength(144);
    expect(HTML_ATTRIBUTES.find((attribute) => attribute.localName === "href")?.definitionIri).toBe("https://ia2.dev/spec/rdf-html#href");
    expect(HTML_ATTRIBUTES.find((attribute) => attribute.localName === "accesskey")?.termName).toBe("accessKey");
    expect(HTML_ATTRIBUTES.some((attribute) => attribute.localName === "aria-describedby")).toBe(false);
  });

  it("defines child ordering foundations without authoring-only scaffolding", () => {
    const vocabulary = readFileSync(resolve(process.cwd(), `vocabulary/rdf-html-${HTML_SNAPSHOT_DATE}.ttl`), "utf8");
    expect(vocabulary).toContain("rdfhtml:Document a owl:Class ; rdfs:subClassOf rdfhtml:Node, ord:TotalOrdering");
    expect(vocabulary).toContain("rdfhtml:Element a owl:Class ; rdfs:subClassOf rdfhtml:Node, ord:Comparable, ord:TotalOrdering");
    expect(vocabulary).toContain("owl:inverseOf rdfhtml:childOf");
    expect(vocabulary).toContain("owl:propertyChainAxiom ( rdfhtml:hasChild ord:immediatelyPrecedes )");
    expect(vocabulary).toContain("owl:propertyChainAxiom ( rdfhtml:hasChild ord:precedes )");
    expect(vocabulary).toContain("rdfs:subPropertyOf ord:inOrdering");
    expect(vocabulary).toMatch(/rdfhtml:children a owl:ObjectProperty ;\s+rdfs:domain rdfhtml:Node ;\s+rdfs:range rdf:List/);
    expect(vocabulary).toMatch(/rdfhtml:accessKey\s+a rdfhtml:AttributeDefinition, owl:DatatypeProperty ;\s+rdfs:domain rdfhtml:Element ;\s+rdfs:range xsd:string/);
    expect(vocabulary).not.toContain("rdfhtml:inChildOrdering");
  });

  it("converts a parsed HTML document to RDF/HTML and round-trips its DOM", () => {
    const dom = new JSDOM('<!doctype html><html lang="en"><head><title>Field note</title></head><body><!--checked--><h1 data-kind="note">Field <em>note</em></h1><p>Temperature: <strong>18 °C</strong>.</p></body></html>');
    const turtle = htmlDocumentToRdfHtml(dom.window.document, {
      attribution: "IA² test fixture",
      baseIRI: "https://example.test/field-note/",
      description: "Round-trip fixture",
      documentIRI: "https://example.test/source#document",
      licenseIRI: "https://creativecommons.org/publicdomain/zero/1.0/",
      sourceIRI: "https://example.test/source.html",
    });
    const parsed = parseRdfHtml(turtle, { baseIRI: "https://example.test/generated.ttl" });
    const rendered = renderRdfHtmlDocument(parsed.dataset, parsed.documents[0]!);
    expect(rendered.html).toContain('<html lang="en">');
    expect(rendered.publicationHtml).toContain('<html rdf-version="1.2" lang="en">');
    expect(rendered.html).toContain('<!--checked--><h1 data-kind="note">Field <em>note</em></h1>');
    expect(rendered.html).toContain('<p>Temperature: <strong>18 °C</strong>.</p>');
    expect(turtle).toContain('rdfhtml:lang "en"');
    expect(turtle).toContain("rdfhtml:children (");
    expect(turtle).not.toContain("ord:immediatelyPrecedes");
    expect(turtle).not.toContain("@prefix ord:");
    expect(turtle).not.toContain("rdfhtml:attributeDefinition rdfhtml:lang");
    expect(turtle).toMatch(/a rdfhtml:Attribute ;\s+rdfhtml:attributeName "data-kind"/);
    expect(rendered.preservedQuads.map((quad) => quad.predicate.value)).toEqual(expect.arrayContaining([
      "http://purl.org/dc/terms/creator",
      "http://purl.org/dc/terms/description",
      "http://purl.org/dc/terms/license",
      "http://purl.org/dc/terms/source",
    ]));
    dom.window.close();
  });

  it("normalizes consistent compact and expanded attributes and rejects conflicts", () => {
    const matching = documentSource.replace('rdfhtml:id "welcome" ;', `rdfhtml:id "welcome" ;
  rdfhtml:attribute [
    a rdfhtml:Attribute ;
    rdfhtml:attributeDefinition rdfhtml:id ;
    rdfhtml:attributeName "id" ;
    rdfhtml:attributeValue "welcome"
  ] ;`);
    const parsedMatching = parseRdfHtml(matching, { baseIRI: "https://example.test/matching.ttl" });
    expect(renderRdfHtmlDocument(parsedMatching.dataset, parsedMatching.documents[0]!).html).toContain('id="welcome"');

    const conflicting = matching.replace('rdfhtml:attributeName "id"', 'rdfhtml:attributeName "class"');
    const parsedConflicting = parseRdfHtml(conflicting, { baseIRI: "https://example.test/conflicting.ttl" });
    expect(() => renderRdfHtmlDocument(parsedConflicting.dataset, parsedConflicting.documents[0]!)).toThrow(/definition maps to "id"/);

    const conflictingValue = matching.replace('rdfhtml:attributeValue "welcome"', 'rdfhtml:attributeValue "other"');
    const parsedConflictingValue = parseRdfHtml(conflictingValue, { baseIRI: "https://example.test/conflicting-value.ttl" });
    expect(() => renderRdfHtmlDocument(parsedConflictingValue.dataset, parsedConflictingValue.documents[0]!)).toThrow(/conflicting "id" attribute values/);
  });

  it("requires compact attribute values to be unqualified xsd:string literals", () => {
    for (const replacement of ['rdfhtml:id "welcome"@en', 'rdfhtml:id "1"^^<http://www.w3.org/2001/XMLSchema#integer>', "rdfhtml:id doc:identifier"]) {
      const source = documentSource.replace('rdfhtml:id "welcome"', replacement);
      const parsed = parseRdfHtml(source, { baseIRI: "https://example.test/invalid-compact-attribute.ttl" });
      expect(() => renderRdfHtmlDocument(parsed.dataset, parsed.documents[0]!)).toThrow(/must be an xsd:string literal/);
    }
  });

  it("rejects namespace bindings the string serializer cannot preserve", () => {
    const source = documentSource.replace('rdfhtml:id "welcome" ;', `rdfhtml:id "welcome" ;
  rdfhtml:attribute [
    a rdfhtml:Attribute ;
    rdfhtml:attributeName "ext:state" ;
    rdfhtml:attributeValue "ready" ;
    rdfhtml:attributeNamespace <https://example.test/extension-attributes#>
  ] ;`);
    const parsed = parseRdfHtml(source, { baseIRI: "https://example.test/namespaced-attribute.ttl" });
    expect(() => renderRdfHtmlDocument(parsed.dataset, parsed.documents[0]!)).toThrow(/cannot faithfully recreate the namespace binding/);
  });

  it("renders compact and flat orderings and embeds unconsumed RDF as HTML/RDF", () => {
    const parsed = parseRdfHtml(documentSource, { baseIRI: "https://example.test/source.ttl", contentType: "text/turtle" });
    expect(parsed.documents).toHaveLength(1);
    const rendered = renderRdfHtmlDocument(parsed.dataset, parsed.documents[0]!);
    expect(rendered.html).toContain('<html>');
    expect(rendered.html).toContain('<h1 id="welcome">Welcome</h1><p>Hello World!</p>');
    expect(rendered.html).not.toContain("data-rdfhtml-preserved");
    expect(rendered.publicationHtml).toContain('rdf-predicate="https://schema.org/about"');
    expect(rendered.publicationHtml).toContain('rdf-predicate="http://purl.org/dc/terms/title"');
    expect(rendered.preservedQuads).toHaveLength(2);
    expect(rendered.consumedQuads.length).toBeGreaterThan(20);
  });

  it("renders complete child sequences expressed as RDF Collections", () => {
    const source = `${prefix}
doc:list-page
  a rdfhtml:Document ;
  rdfhtml:base <https://example.test/list-rendered/> ;
  dcterms:conformsTo <https://ia2.dev/spec/rdf-html/vocabulary/rdf-html-2026-07-18.ttl> ;
  rdfhtml:children (
    [ a rdfhtml:DocumentType ; rdfhtml:documentTypeName "html" ]
    [ a rdfhtml:Html ; rdfhtml:children (
      [ a rdfhtml:Head ; rdfhtml:children (
        [ a rdfhtml:Title ; rdfhtml:children (
          [ a rdfhtml:Text ; rdfhtml:data "Collection document" ]
        ) ]
      ) ]
      [ a rdfhtml:Body ; rdfhtml:children (
        [ a rdfhtml:H1 ; rdfhtml:children (
          [ a rdfhtml:Text ; rdfhtml:data "First" ]
        ) ]
        [ a rdfhtml:P ; rdfhtml:children (
          [ a rdfhtml:Text ; rdfhtml:data "Second" ]
        ) ]
      ) ]
    ) ]
  ) .`;
    const parsed = parseRdfHtml(source, { baseIRI: "https://example.test/list.ttl" });
    const rendered = renderRdfHtmlDocument(parsed.dataset, parsed.documents[0]!);
    expect(rendered.html).toContain("<!doctype html><html><head><title>Collection document</title></head><body><h1>First</h1><p>Second</p></body></html>");
    expect(rendered.publicationHtml).toBe(rendered.html);
    expect(rendered.preservedQuads).toHaveLength(0);
  });

  it("accepts consistent collection and flat child assertions", () => {
    const source = `${documentSource}\ndoc:body rdfhtml:children ( doc:heading doc:paragraph ) .`;
    const parsed = parseRdfHtml(source, { baseIRI: "https://example.test/list-and-flat.ttl" });
    expect(renderRdfHtmlDocument(parsed.dataset, parsed.documents[0]!).html).toContain('<h1 id="welcome">Welcome</h1><p>Hello World!</p>');
  });

  it("rejects malformed, duplicate, incomplete, and contradictory child lists", () => {
    const cases = [
      `${documentSource}\ndoc:body rdfhtml:children _:broken .\n_:broken rdf:first doc:heading .`,
      `${documentSource}\ndoc:body rdfhtml:children ( doc:heading doc:heading ) .`,
      `${documentSource}\ndoc:body rdfhtml:children ( doc:heading ) .`,
      `${documentSource}\ndoc:body rdfhtml:children ( doc:heading doc:paragraph ) .\ndoc:paragraph ord:precedes doc:heading .`,
      `${documentSource}\ndoc:body rdfhtml:children ( "not a node" ) .`,
    ];
    for (const [index, source] of cases.entries()) {
      const parsed = parseRdfHtml(source, { baseIRI: `https://example.test/invalid-list-${index}.ttl` });
      expect(() => renderRdfHtmlDocument(parsed.dataset, parsed.documents[0]!)).toThrow(RdfHtmlError);
    }
  });

  it("accepts explicitly repeated child membership without changing order", () => {
    const source = documentSource.replace(
      "rdfhtml:hasChild doc:heading .",
      "rdfhtml:hasChild doc:heading, doc:paragraph .",
    );
    const parsed = parseRdfHtml(source, { baseIRI: "https://example.test/explicit.ttl" });
    const rendered = renderRdfHtmlDocument(parsed.dataset, parsed.documents[0]!);
    expect(rendered.html).toContain("<h1 id=\"welcome\">Welcome</h1><p>Hello World!</p>");
  });

  it("normalizes childOf and immediatelyFollows into the canonical child chain", () => {
    const source = documentSource
      .replace("doc:body a rdfhtml:Body ;\n  rdfhtml:hasChild doc:heading .", "doc:body a rdfhtml:Body .\n\ndoc:heading rdfhtml:childOf doc:body .")
      .replace("  ord:immediatelyPrecedes doc:paragraph ;\n", "")
      .concat("\ndoc:paragraph ord:immediatelyFollows doc:heading .\n");
    const parsed = parseRdfHtml(source, { baseIRI: "https://example.test/inverse.ttl" });
    const rendered = renderRdfHtmlDocument(parsed.dataset, parsed.documents[0]!);
    expect(rendered.html).toContain('<h1 id="welcome">Welcome</h1><p>Hello World!</p>');
  });

  it("accepts consistent assertions in both membership and adjacency directions", () => {
    const source = `${documentSource}\ndoc:heading rdfhtml:childOf doc:body .\ndoc:paragraph ord:immediatelyFollows doc:heading .`;
    const parsed = parseRdfHtml(source, { baseIRI: "https://example.test/duplicates.ttl" });
    const rendered = renderRdfHtmlDocument(parsed.dataset, parsed.documents[0]!);
    expect(rendered.html).toContain('<h1 id="welcome">Welcome</h1><p>Hello World!</p>');
  });

  it("renders a uniquely determined broad precedence ordering without asserting adjacency", () => {
    const source = documentSource.replace("ord:immediatelyPrecedes doc:paragraph", "ord:precedes doc:paragraph");
    const parsed = parseRdfHtml(source, { baseIRI: "https://example.test/precedes.ttl" });
    const rendered = renderRdfHtmlDocument(parsed.dataset, parsed.documents[0]!);
    expect(rendered.html).toContain('<h1 id="welcome">Welcome</h1><p>Hello World!</p>');
  });

  it("normalizes follows into precedes", () => {
    const source = documentSource
      .replace("  ord:immediatelyPrecedes doc:paragraph ;\n", "")
      .concat("\ndoc:paragraph ord:follows doc:heading .\n");
    const parsed = parseRdfHtml(source, { baseIRI: "https://example.test/follows.ttl" });
    const rendered = renderRdfHtmlDocument(parsed.dataset, parsed.documents[0]!);
    expect(rendered.html).toContain('<h1 id="welcome">Welcome</h1><p>Hello World!</p>');
  });

  it("combines immediate adjacency blocks with broad precedence constraints", () => {
    const source = `${documentSource}\ndoc:paragraph ord:precedes doc:note .\ndoc:note a rdfhtml:Div ; rdfhtml:hasChild [ a rdfhtml:Text ; rdfhtml:data "Later, not necessarily adjacent" ] .`;
    const parsed = parseRdfHtml(source, { baseIRI: "https://example.test/mixed-order.ttl" });
    const rendered = renderRdfHtmlDocument(parsed.dataset, parsed.documents[0]!);
    expect(rendered.html).toContain('<h1 id="welcome">Welcome</h1><p>Hello World!</p><div>Later, not necessarily adjacent</div>');
  });

  it("accepts consistent broad assertions in both directions", () => {
    const source = documentSource
      .replace("ord:immediatelyPrecedes doc:paragraph", "ord:precedes doc:paragraph")
      .concat("\ndoc:paragraph ord:follows doc:heading .\n");
    const parsed = parseRdfHtml(source, { baseIRI: "https://example.test/broad-duplicates.ttl" });
    const rendered = renderRdfHtmlDocument(parsed.dataset, parsed.documents[0]!);
    expect(rendered.html).toContain('<h1 id="welcome">Welcome</h1><p>Hello World!</p>');
  });

  it("rejects contradictory immediate directions after normalization", () => {
    const source = `${documentSource}\ndoc:heading ord:immediatelyFollows doc:paragraph .`;
    const parsed = parseRdfHtml(source, { baseIRI: "https://example.test/contradictory-directions.ttl" });
    expect(() => renderRdfHtmlDocument(parsed.dataset, parsed.documents[0]!)).toThrow(/exactly one first child|cycle/);
  });

  it("preserves populated named graphs from TriG", () => {
    const trig = `${documentSource}\ndoc:claims { doc:item schema:name "Named graph item" . }`;
    const parsed = parseRdfHtml(trig, { baseIRI: "https://example.test/source.trig", contentType: "application/trig" });
    const rendered = renderRdfHtmlDocument(parsed.dataset, parsed.documents[0]!);
    expect(rendered.publicationHtml).toContain('rdf-graph="https://example.test/rdf-html/claims"');
    expect(rendered.publicationHtml).toContain('value="Named graph item"');
  });

  it("merges identical structural facts asserted in multiple named graphs", () => {
    const trig = `${documentSource}
doc:source-a {
  doc:page a rdfhtml:Document ;
    rdfhtml:base <https://example.test/rendered/> ;
    dcterms:conformsTo <https://ia2.dev/spec/rdf-html/vocabulary/rdf-html-2026-07-18.ttl> .
}
doc:source-b {
  doc:page a rdfhtml:Document ;
    rdfhtml:base <https://example.test/rendered/> .
}`;
    const parsed = parseRdfHtml(trig, { baseIRI: "https://example.test/duplicate-structure.trig", contentType: "application/trig" });
    expect(parsed.documents).toHaveLength(1);
    expect(renderRdfHtmlDocument(parsed.dataset, parsed.documents[0]!).html).toContain("<h1 id=\"welcome\">Welcome</h1>");
  });

  it("offers a selector and sandboxed previews for multiple documents", () => {
    const second = documentSource
      .replaceAll("doc:page", "doc:second-page")
      .replaceAll("doc:html", "doc:second-html")
      .replaceAll("doc:head", "doc:second-head")
      .replaceAll("doc:body", "doc:second-body")
      .replaceAll("doc:title", "doc:second-title")
      .replaceAll("doc:heading", "doc:second-heading")
      .replaceAll("doc:paragraph", "doc:second-paragraph")
      .replace('dcterms:title "Welcome document"', 'dcterms:title "Second document"');
    const workspace = renderRdfHtmlWorkspace(`${documentSource}\n${second}`, {
      contentType: "text/turtle",
      sourceUrl: "https://example.test/multiple.ttl",
    });
    expect(workspace.match(/class="document-nav"/g)).toHaveLength(1);
    expect(workspace).toContain("Welcome document");
    expect(workspace).toContain("Second document");
    expect(workspace.match(/<iframe /g)).toHaveLength(2);
    expect(workspace).toContain("sandbox referrerpolicy");
    expect(workspace).toContain("&lt;base data-rdfhtml-runtime-context href=&quot;https://example.test/rendered/&quot;&gt;");
    expect(workspace).toContain("Scripts, forms, nested frames, and network loads are blocked.");
  });

  it("renders one active document directly while retaining the inert workspace API", () => {
    const page = renderRdfHtmlPage(documentSource, {
      contentType: "text/turtle",
      sourceUrl: "https://example.test/source.ttl",
    });
    expect(page).toContain('<base data-rdfhtml-runtime-context href="https://example.test/rendered/">');
    expect(page).toContain('<h1 id="welcome">Welcome</h1><p>Hello World!</p>');
    expect(page).not.toContain("<iframe");
    expect(page).not.toContain("sandbox");
    expect(page).not.toContain("Inert preview");
  });

  it("renders one active frame and a selector for a multi-document source", () => {
    const second = documentSource
      .replaceAll("doc:page", "doc:second-page")
      .replaceAll("doc:html", "doc:second-html")
      .replaceAll("doc:head", "doc:second-head")
      .replaceAll("doc:body", "doc:second-body")
      .replaceAll("doc:title", "doc:second-title")
      .replaceAll("doc:heading", "doc:second-heading")
      .replaceAll("doc:paragraph", "doc:second-paragraph")
      .replace('dcterms:title "Welcome document"', 'dcterms:title "Second document"');
    const page = renderRdfHtmlPage(`${documentSource}\n${second}`, {
      contentType: "text/turtle",
      sourceUrl: "https://example.test/multiple.ttl",
    });
    expect(page).toContain('<select id="document" name="document">');
    expect(page).toContain("Second document</option>");
    expect(page.match(/<iframe /g)).toHaveLength(1);
    expect(page).toContain("frame.srcdoc = option.dataset.document");
    expect(page).not.toContain("sandbox");
    expect(page).not.toContain("Inert preview");
  });

  it("rejects a branched sibling ordering", () => {
    const invalid = `${documentSource}\ndoc:heading ord:immediatelyPrecedes doc:extra .\ndoc:body rdfhtml:hasChild doc:extra .\ndoc:extra a rdfhtml:Div .`;
    const parsed = parseRdfHtml(invalid, { baseIRI: "https://example.test/invalid.ttl" });
    expect(() => renderRdfHtmlDocument(parsed.dataset, parsed.documents[0]!)).toThrow(RdfHtmlError);
  });

  it("rejects disconnected children without inventing adjacency", () => {
    const invalid = `${documentSource}\ndoc:body rdfhtml:hasChild doc:extra .\ndoc:extra a rdfhtml:Div .`;
    const parsed = parseRdfHtml(invalid, { baseIRI: "https://example.test/disconnected.ttl" });
    expect(() => renderRdfHtmlDocument(parsed.dataset, parsed.documents[0]!)).toThrow(/unique child order/);
  });

  it("rejects broad constraints that leave the concrete DOM order ambiguous", () => {
    const ambiguous = documentSource
      .replace("ord:immediatelyPrecedes doc:paragraph", "ord:precedes doc:paragraph")
      .concat("\ndoc:heading ord:precedes doc:note .\ndoc:note a rdfhtml:Div .\n");
    const parsed = parseRdfHtml(ambiguous, { baseIRI: "https://example.test/ambiguous.ttl" });
    expect(() => renderRdfHtmlDocument(parsed.dataset, parsed.documents[0]!)).toThrow(/unique child order/);
  });

  it("rejects broad precedence that contradicts an immediate chain", () => {
    const invalid = `${documentSource}\ndoc:paragraph ord:precedes doc:heading .`;
    const parsed = parseRdfHtml(invalid, { baseIRI: "https://example.test/broad-contradiction.ttl" });
    expect(() => renderRdfHtmlDocument(parsed.dataset, parsed.documents[0]!)).toThrow(/contradicts immediate adjacency/);
  });

  it("rejects broad-precedence cycles", () => {
    const invalid = documentSource
      .replace("ord:immediatelyPrecedes doc:paragraph", "ord:precedes doc:paragraph")
      .concat("\ndoc:paragraph ord:precedes doc:heading .\n");
    const parsed = parseRdfHtml(invalid, { baseIRI: "https://example.test/broad-cycle.ttl" });
    expect(() => renderRdfHtmlDocument(parsed.dataset, parsed.documents[0]!)).toThrow(/strict-ordering cycle/);
  });

  it("rejects immediate-precedence cycles", () => {
    const invalid = `${documentSource}\ndoc:paragraph ord:immediatelyPrecedes doc:heading .`;
    const parsed = parseRdfHtml(invalid, { baseIRI: "https://example.test/cycle.ttl" });
    expect(() => renderRdfHtmlDocument(parsed.dataset, parsed.documents[0]!)).toThrow(/first child|cycle/);
  });

  it("requires an explicit base IRI on every document", () => {
    const parsed = parseRdfHtml(documentSource.replace("rdfhtml:base <https://example.test/rendered/> ;", ""), { baseIRI: "https://example.test/no-base.ttl" });
    expect(() => renderRdfHtmlDocument(parsed.dataset, parsed.documents[0]!)).toThrow(/must declare exactly one named rdfhtml:base/);
  });

  it("requires an explicit supported vocabulary snapshot", () => {
    const parsed = parseRdfHtml(documentSource.replace(/\s*dcterms:conformsTo <[^>]+> ;/, ""), { baseIRI: "https://example.test/no-vocabulary.ttl" });
    expect(() => renderRdfHtmlDocument(parsed.dataset, parsed.documents[0]!)).toThrow(/must declare dcterms:conformsTo/);
  });

  it("preserves raw-text node data without HTML character-reference changes", () => {
    const source = documentSource
      .replace("doc:body a rdfhtml:Body ;\n  rdfhtml:hasChild doc:heading .", 'doc:body a rdfhtml:Body ; rdfhtml:hasChild doc:script .\ndoc:script a rdfhtml:Script ; rdfhtml:hasChild [ a rdfhtml:Text ; rdfhtml:data "if (1 < 2 && 3 > 2) ok();" ] .')
      .replace(/doc:heading[\s\S]*$/, "");
    const parsed = parseRdfHtml(source, { baseIRI: "https://example.test/raw.ttl" });
    const rendered = renderRdfHtmlDocument(parsed.dataset, parsed.documents[0]!);
    expect(rendered.html).toContain("<script>if (1 < 2 && 3 > 2) ok();</script>");
  });
});
