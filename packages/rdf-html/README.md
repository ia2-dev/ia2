# @ia2-dev/rdf-html

`@ia2-dev/rdf-html` renders RDF 1.2 descriptions of HTML documents into HTML.
It accepts Turtle and TriG, recognizes every current HTML element and indexed
non-event-handler attribute in the dated 2026-07-18 vocabulary snapshot,
validates deterministic DOM child orderings, and carries every unconsumed RDF
quad into an optional publication form using IA² HTML/RDF.

Every renderable document declares the dated vocabulary it uses:

```turtle
doc:page a rdfhtml:Document ;
    rdfhtml:base <https://example.com/page/> ;
    dcterms:conformsTo <https://ia2.dev/spec/rdf-html/vocabulary/rdf-html-2026-07-18.ttl> .
```

The processor recognizes supported snapshot IRIs locally and never retrieves
them while rendering. A dataset may contain partial RDF/HTML descriptions, but
only a selected document whose normalized structure determines one complete
tree is renderable.

The RDF/HTML specification is also its vocabulary publication. Its HTML/RDF
dataset contains the complete generated ontology, including core structural
terms, element classes, attribute definitions and contexts, content
categories, conditional classifications, and snapshot provenance. The RDF
Navigator can inspect or copy that dataset as Turtle with `rdfhtml:` and `ord:`
prefixes. Generation checks keep this in-page publication
statement-for-statement equivalent to the dated Turtle artifact.

For a complete child sequence, use a Turtle RDF Collection:

```turtle
doc:body rdfhtml:children (
    doc:heading
    doc:introduction
) .
```

The processor expands the list into child membership and immediate adjacency
before applying the ordinary ordering validator. Collection members must be
distinct resources, and the list must be finite, acyclic, well formed, and
complete for its parent. The HTML converter emits this collection form.

Use flat membership and `ord:` relations when nodes are contributed
independently or when order is known without adjacency:

```turtle
doc:body rdfhtml:hasChild doc:heading .

doc:heading a rdfhtml:H1 ;
    ord:precedes doc:introduction .

doc:introduction a rdfhtml:P .
```

The generated vocabulary supplies the `ord:TotalOrdering`, `ord:Comparable`,
and `ord:inOrdering` entailments. A renderer applies the same bounded closure
without requiring callers to load an OWL reasoner.

Authors may state the same structure in the inverse direction. The processor
normalizes `child rdfhtml:childOf parent` to `parent rdfhtml:hasChild child`,
and `later ord:immediatelyFollows earlier` to
`earlier ord:immediatelyPrecedes later`, before validating one unified ordering:

```turtle
doc:heading
    a rdfhtml:H1 ;
    rdfhtml:childOf doc:body .

doc:introduction
    a rdfhtml:P ;
    ord:immediatelyFollows doc:heading .
```

Consistent collection, membership, and ordering assertions are harmless.
Additional children, conflicting order, and contradictory directions remain
errors.

Structural processing uses the union of default and named graphs. The same
subject-predicate-object assertion repeated in several graphs is one normalized
fact; conflicting objects remain conflicts. Named-graph placement is preserved
for unconsumed statements, but does not change the DOM structure.

The renderer also normalizes `later ord:follows earlier` to
`earlier ord:precedes later` and combines broad constraints with immediate
adjacency chains. The constraints must determine one concrete sibling order;
an unresolved partial order is rejected rather than resolved with an arbitrary
tie-break. Prefer `ord:precedes` or `ord:follows` when only relative order is
meaningful. They do not claim adjacency, so independently maintained data can
insert another child between the two without invalidating that assertion.

RDF/HTML is an exploratory proposal. It models parsed HTML-namespace light DOM
and template contents, not the original HTML bytes, CSSOM, shadow DOM, SVG, or
MathML. `renderRdfHtmlDocument()` is a serializer: its result may contain
active HTML described by the source graph, so callers must not insert it into a
trusted document. `renderRdfHtmlPage()` produces the same active browser-facing
result, returning a single document directly or a one-frame selector for
several documents. `renderRdfHtmlWorkspace()` is the safe inspection surface; it
places derived documents in sandboxed, inert frames that do not execute scripts
or permit network-loading subresources.

```ts
import { parseRdfHtml, renderRdfHtmlDocument } from "@ia2-dev/rdf-html";

const parsed = parseRdfHtml(turtle, {
  baseIRI: "https://example.com/document.ttl",
  contentType: "text/turtle",
});
const rendered = renderRdfHtmlDocument(parsed.dataset, parsed.documents[0]);
console.log(rendered.html);
console.log(rendered.publicationHtml);
```

`html` is the faithful described tree. It never gains an implicit
`rdf-version`, preservation island, or runtime base element. `publicationHtml`
is the augmented HTML/RDF publication form and carries unconsumed quads. Both
return `baseIRI` separately. Browser page helpers add a
`data-rdfhtml-runtime-context` base node only as a hosting projection.

For a browser publication that keeps multiple documents selectable and retains
unused RDF:

```ts
import { renderRdfHtmlPage } from "@ia2-dev/rdf-html";

const page = renderRdfHtmlPage(turtle, {
  sourceUrl: "https://example.com/document.ttl",
  contentType: "text/turtle",
});
```

The resulting HTML is active. Scripts, forms, stylesheets, media, and other
browser behaviors described by the RDF/HTML source are not disabled.

For an inert browser-facing workspace:

```ts
import { renderRdfHtmlWorkspace } from "@ia2-dev/rdf-html";

const workspace = renderRdfHtmlWorkspace(turtle, {
  sourceUrl: "https://example.com/document.ttl",
  contentType: "text/turtle",
});
```

To describe an existing parsed HTML document as RDF/HTML in a browser:

```ts
import { htmlDocumentToRdfHtml } from "@ia2-dev/rdf-html";

const turtle = htmlDocumentToRdfHtml(document, {
  documentIRI: "https://example.com/page#document",
  baseIRI: "https://example.com/page/",
  title: document.title,
  sourceIRI: "https://example.com/page",
});
```

The converter preserves the parsed DOM tree, including document type, element
attributes, text, comments, and template contents. It emits compact
`rdfhtml:children` collections. This is a DOM
conversion, not an original-source serializer, so parser normalization and the
loss of source formatting are expected. Node.js callers can parse an HTML
string through the Node-only entry point without adding JSDOM themselves:

Known HTML attributes use their generated datatype properties directly while
preserving exact DOM string values:

```turtle
rdfhtml:href "/guide" .
```

The converter emits this compact form. Direct values must be `xsd:string`
literals without language or direction; a present boolean attribute uses the
empty string. An expanded `rdfhtml:Attribute` occurrence remains available when
the occurrence needs identity, provenance, or annotations:

```turtle
rdfhtml:attribute [
    a rdfhtml:Attribute ;
    rdfhtml:attributeDefinition rdfhtml:href ;
    rdfhtml:attributeValue "/guide"
] .
```

Consistent compact and expanded assertions are harmless duplicates. Different
values for the same expanded attribute name are errors.

Definition terms use reflected Web IDL casing when it supplies a reliable
same-letter boundary, for example `rdfhtml:accessKey`, `rdfhtml:acceptCharset`,
and `rdfhtml:maxLength`. Hyphens otherwise become lower camel case. Names
without either signal retain their exact HTML spelling, so generation never
guesses English word boundaries. Definitions record the HTML local name, any
reflected IDL names, applicability contexts, value-syntax text, and source
provenance.

Custom, future, `data-*`, ARIA, event-handler, and extension attributes retain
the generic form with `rdfhtml:attributeName`. The generated definition for the
HTML `data` attribute is `rdfhtml:dataAttribute` to avoid colliding with the
structural `rdfhtml:data` property. Value syntax in generated metadata is
descriptive and does not coerce DOM strings into XML Schema datatypes.

```ts
import { htmlToRdfHtml } from "@ia2-dev/rdf-html/node";

const turtle = htmlToRdfHtml(htmlSource, {
  documentIRI: "https://example.com/page#document",
  baseIRI: "https://example.com/page/",
  sourceIRI: "https://example.com/page",
});
```

## Command line

The published package exposes the `rdf-html` executable. Inputs may be local
files, HTTP(S) URLs, or `-` for stdin. Output goes to stdout unless
`--output` is supplied.

Render RDF/HTML Turtle into HTML:

```sh
npx @ia2-dev/rdf-html render page.ttl --output page.html
npx @ia2-dev/rdf-html render https://example.com/page.ttl > page.html
```

CLI rendering is faithful by default. Pass `--publication` to retain unused
RDF statements in an HTML/RDF island:

```sh
npx @ia2-dev/rdf-html render page.ttl --publication --output published.html
```

When a Turtle or TriG source describes more than one document, select it by
zero-based index, document IRI, or unique title. `--workspace` instead emits
the package's inert multi-document workspace:

```sh
npx @ia2-dev/rdf-html render pages.trig --document 1 --output page.html
npx @ia2-dev/rdf-html render pages.trig --workspace --output workspace.html
```

Describe parsed HTML as RDF/HTML Turtle:

```sh
npx @ia2-dev/rdf-html describe page.html \
  --document-iri https://example.com/page#document \
  --base https://example.com/page/ \
  --output page.ttl

npx @ia2-dev/rdf-html describe https://example.com/ > page.ttl
```

For files and URLs, the input location supplies default base, source, and
document IRIs. Use explicit IRIs when the generated description will be
published somewhere stable. Stdin requires `--base`. Run
`npx @ia2-dev/rdf-html --help` for all metadata and input options. Remote
responses are limited to 10 MiB.

See the [RDF/HTML specification](https://ia2.dev/spec/rdf-html) for the model,
ordering profiles, motivation, and conformance requirements.
The implementation-neutral
[fixture manifest](https://ia2.dev/spec/rdf-html/tests/manifest.json) provides
portable positive and negative Turtle and TriG cases.

## Vocabulary snapshots

The committed JSON snapshot is the mechanical source of the generated
vocabulary, TypeScript tables, and specification element and attribute
reference appendices.
It records:

- every current conforming HTML-namespace element and its definition URL;
- every indexed non-event-handler HTML attribute, grouped by local name;
- each generated attribute-definition term, reflected Web IDL name and stable
  source fragment where available;
- all 179 indexed attribute applicability, description, definition-source, and
  value-syntax contexts;
- all six syntax kinds from the Living Standard syntax section;
- all 15 indexed content categories;
- each unconditional or conditional element-category membership;
- the original condition text and index notation for conditional entries;
- Text, autonomous and form-associated custom elements, and MathML and SVG
  category participants outside the named HTML class inventory; and
- the snapshot date, exact source URLs, and SHA-256 digests of the fetched
  source documents.

The generated dated Turtle module defines syntax-kind and content-category
classes. Unconditional memberships become direct, inspectable
`rdfs:subClassOf` axioms. Conditional memberships become sourced
`rdfhtml:ConditionalCategoryMembership` resources and never become universal
subclass claims.

The separately maintained
[`rdf-html-conditional-rules.ttl`](./vocabulary/rdf-html-conditional-rules.ttl)
module contains reviewed SHACL-AF rules. It currently formalizes attribute
presence for `a`, `audio`, `video`, `img`, and `meta`, plus the direct `li`
child condition for `menu`, `ol`, and `ul`. The child rules operate on the
processor's normalized `hasChild` and `immediatelyPrecedes` view. Conditions
such as an `area` being a descendant of `map`, a link being allowed in the
body, a hierarchically correct `main`, input's effective type state, and the
prose-only `object` and `th` asterisks remain explicit sourced descriptions.
The `area` descendant condition is deliberately still descriptive: raw
RDF/HTML ancestry can pass through either collection list spines or normalized
flat membership, and a rule covering only one encoding would be incomplete.

This differs deliberately from
[HTMLVoc](https://floresbakker.github.io/htmlvoc/). HTMLVoc provides richer,
hand-authored OWL equivalence expressions for categories such as flow content.
RDF/HTML instead prioritizes deterministic refresh, exact provenance, and not
turning contextual membership into an incorrect universal class axiom.

Run `npm run refresh:classification` to fetch the current element and attribute
indexes, content-category index, syntax-kind section, and single-page Web IDL
definitions, write a new dated snapshot, and regenerate Turtle, TypeScript, and
both marked appendix blocks in `specs/rdf-html/index.html`. Pass an explicit date
when needed:

```sh
npm run refresh:classification -- --date=YYYY-MM-DD
```

For a repeatable offline refresh from already captured source documents:

```sh
node scripts/refresh-html-elements.mjs \
  --date=YYYY-MM-DD \
  --indices=path/to/indices.html \
  --syntax=path/to/syntax.html \
  --webidl=path/to/single-page.html
npm run generate
```

The extractor requires the expected headings, table headers, syntax definition
list, reflected Web IDL structure, known category labels, plausible element and
attribute counts, and a complete partition of HTML elements into syntax kinds.
It cross-checks the element table's Categories and Attributes columns against
their dedicated tables. Event-handler attributes are an explicit index
exclusion. Known WHATWG table differences are documented in the extractor and
snapshot; any new discrepancy fails with a diagnostic. Normal tests and builds
perform no network access and verify that generated files and both appendices
exactly match the newest committed snapshot. The generator fails if appendix
markers are missing or duplicated. Refresh, generation, tests, and builds use
ordinary DOM and RDF tooling only. They do not invoke AI or an LLM.
