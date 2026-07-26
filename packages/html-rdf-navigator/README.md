# IA² HTML/RDF Navigator

`@ia2-dev/html-rdf-navigator` is a zero-framework Web Component and TypeScript library
for inspecting the RDF dataset expressed by an IA² HTML document. It extracts
the current DOM, leads with a source-oriented Navigator, provides Turtle/TriG
and JSON-LD views, and correlates statements with their HTML carriers.
The UI-independent extraction and serialization substrate lives in
`@ia2-dev/html-rdf`.

The component is presented as a movable side drawer, but the product is a
document navigator rather than a serialization viewer.

## Include it

The browser bundle mounts one `<ia2-rdf-navigator>` after the document is
ready:

```html
<script type="module" src="./html-rdf-navigator.js"></script>
```

After publication, the same artifact can be loaded from a package CDN:

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@ia2-dev/html-rdf-navigator/dist/html-rdf-navigator.js"></script>
```

For programmatic control, disable automatic mounting before import:

```html
<script>window.__IA2_RDF_NAVIGATOR_NO_AUTO__ = true;</script>
<script type="module">
  import { mountRdfNavigator } from "./dist/html-rdf-navigator.js";

  const navigator = mountRdfNavigator();
  navigator.open();

  // Open on the left and reveal the statements carried by one page element.
  navigator.revealSource(document.querySelector("#decision"), "left");
</script>
```

## Features

- IA² Core 0.1 extraction from a `Document`, `DocumentFragment`, or `Element`
- Navigator-first inspection with source correlation and vocabulary links
- a Sources view for choosing among the top document and directly accessible
  embedded documents without merging their datasets
- a conditional Vocabulary view for document-defined classes and properties,
  including RDFS subclass and subproperty trees
- a conditional Shapes view for browsing SHACL node and property shapes,
  targets, paths, groups, and constraints without executing validation
- live, case-insensitive filtering across terms, IRIs, graphs, and carriers
- semantic typeahead from in-document labels, OWL/RDF kinds, domains, and ranges
- namespace filters discovered from every named-node URL
- independently closable linked-preview windows sized for definitions or
  resources, with movable eight-direction resize controls
- source-order display and semantic-DOM indentation
- bidirectional page/Navigator scroll following and hover correspondence
- contextual, syntax-highlighted shallow and full carrier HTML views
- in-document navigation for local RDF terms
- conditional discovery of related knowledge through established RDF
  relationships and qualified DCAT roles
- deliberate, credential-free HTML/RDF loading into separate named graphs
- an editable, read-only SPARQL workbench over the selected extracted dataset
- declarative suggested-query discovery from SHACL SPARQL executable resources
- Turtle/TriG and JSON-LD serialization
- live-DOM refresh through a debounced `MutationObserver`
- independent diagnostics that do not abort valid statements
- nine persistent side, top, bottom, and floating drawer positions, with
  resizing from every edge not attached to the browser
- keyboard access, visible focus, reduced motion, and responsive themes
- Shadow DOM isolation from host-page and ReSpec styles

## API

```ts
import {
  Ia2RdfNavigator,
  detectDiscoveryCandidates,
  extractDocumentVocabulary,
  extractShaclCatalog,
  extractSuggestedSparqlQueries,
  mergeDiscoveryContributions,
  mountRdfNavigator,
  toPortableExtractionResult,
} from "@ia2-dev/html-rdf-navigator";
import {
  extractDataset,
  serializeJsonLd,
  serializeTurtle,
} from "@ia2-dev/html-rdf";
```

`extractDataset(root?)` returns quads, declared graphs, diagnostics, and the
retrieval, semantic source, and RDF base IRIs. A single valid HTML
`link[rel~="canonical"]` supplies the semantic source IRI and, in the absence of
an explicit `base[href]`, the RDF base IRI. Quads retain their source `Element`,
which powers document navigation. The mounted Navigator reflects the runtime
DOM, including semantic changes made by the host application.

Navigator retains compatibility re-exports for its former extraction and
serialization entry points. New consumers should import the substrate directly
from `@ia2-dev/html-rdf` so data processing does not depend on a UI package.

`extractDocumentVocabulary(result)` identifies named classes and properties
defined in the source dataset. The mounted component presents them in a
Vocabulary tab only when definitions exist. Local terms correlate with their
HTML definition carriers in both directions; external hierarchy parents remain
linked context rather than being counted as local definitions.

`extractShaclCatalog(result)` identifies explicit `sh:NodeShape` and
`sh:PropertyShape` resources as well as shapes implied by SHACL targets,
`sh:path`, `sh:property`, and direct shape-valued constraints. The mounted
component presents the catalog in a Shapes tab only when shapes exist. It
preserves property groups and ordering, shows targets, paths, nested property
references, constraints, and named graph identity, and can locate a visible
document field when a Web Annotation links that field to the shape. Browsing is
descriptive: it does not produce a validation report or execute SHACL rules.

`detectDiscoveryCandidates(result)` normalizes recognized direct relationships
and qualified DCAT relationships without performing network activity. The
mounted component reveals a Discovery tab only when candidates exist. A person
may load an HTML/RDF target explicitly; the retrieved document is parsed
without script execution and its default graph is presented as a named graph
identified by the target document's canonical IRI. Contributions remain
removable and never alter the source extraction.

The component discovers embedded documents whose DOM is directly accessible
under the browser same-origin policy. When several documents are available, a
Sources tab presents one dataset at a time. If the top document has no RDF and
exactly one child document does, that child is selected automatically. The
launcher count covers all listed documents, but Turtle, JSON-LD, diagnostics,
discovery, and source correlation always apply only to the selected document.
Datasets are not silently unioned.

## SPARQL workbench

The SPARQL tab runs queries locally against the RDF/JS dataset extracted from
the selected document. SELECT, ASK, CONSTRUCT, and DESCRIBE are supported.
SPARQL Update is refused because the semantic DOM remains the source of truth.
SELECT and graph results are paginated locally with selectable 10, 25, 50, or
100-row pages. The complete result display remains limited to 500 rows or
statements. The query engine is a lazy browser chunk, so it is not loaded until
a person runs a query.

A returned named node or blank node is presented with an available
`rdfs:label`, `skos:prefLabel`, `schema:name`, `dcterms:title`, or `sh:name`
from the selected dataset. Its RDF identifier remains visible and linked below
the readable label. Ordinary `xsd:string` values omit the redundant datatype
suffix; language and non-string datatype information remains visible.

A document can publish suggested queries as RDF. Navigator recognizes resources
typed as `sh:SPARQLExecutable` and the applicable executable subtype, then
reads the query from `sh:select`, `sh:ask`, or `sh:construct`. Labels,
descriptions, and ordering come from established RDFS, DCTERMS, and SHACL
terms. The resource may live in any named graph.

```html
<div hidden>
  <a
    href="http://www.w3.org/ns/shacl#SPARQLExecutable"
    rdf-subject="#named-resources-query"
    rdf-predicate="http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
    rdf-graph="#query-graph"
  ></a>
  <a
    href="http://www.w3.org/ns/shacl#SPARQLSelectExecutable"
    rdf-subject="#named-resources-query"
    rdf-predicate="http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
    rdf-graph="#query-graph"
  ></a>
  <span
    rdf-subject="#named-resources-query"
    rdf-predicate="http://www.w3.org/2000/01/rdf-schema#label"
    rdf-graph="#query-graph"
  >Named resources</span>
  <data
    rdf-subject="#named-resources-query"
    rdf-predicate="http://www.w3.org/ns/shacl#select"
    rdf-graph="#query-graph"
    value="SELECT ?resource ?name
WHERE {
  GRAPH ?graph {
    ?resource &lt;https://schema.org/name&gt; ?name
  }
}"
  ></data>
</div>
```

`extractSuggestedSparqlQueries(result)` exposes the same discovery step without
the Web Component. This catalog convention is experimental UI behavior, not
part of IA² HTML/RDF extraction and not presented as a new standard.
The native `data[value]` carrier is intentional: HTML/RDF fallback text
normalization collapses ASCII whitespace, while a query literal needs its
authored line breaks preserved.

Extension adapters can carry an extraction across an isolated frame boundary
with `toPortableExtractionResult(result)` and supply it through
`navigator.setSources(sources)`. Portable results replace live `Element`
references with stable carrier IDs and markup. The component reconstructs
detached, inert carrier elements for source display; locating or synchronizing
with the inaccessible frame DOM remains unavailable.

## Development

```sh
npm install
npm test
npm run check
npm run build
npm pack --dry-run
```

The published package contains the browser-ready ESM bundle and lazy query
chunk, TypeScript declarations, README, and license. It does not execute SHACL
rules, remote contexts, or retrieved scripts. SPARQL executes only after
explicit activation and only over a local RDF/JS dataset. Discovery retrieval
and resource previews perform network activity only after explicit activation.
Discovery fetches omit credentials and referrer information; cross-origin
targets must permit browser access through CORS. Hovering a link never opens or
fetches a preview. Direct preview
documents may execute scripts,
submit forms, and open user-initiated links in their own origin; browser
same-origin policy still isolates them from the host document. When a site
permits cross-origin reading, a credential-free HTML fallback can render pages
that reject framing inside a stricter opaque-origin sandbox and keeps in-preview
navigation working. Every preview uses a no-referrer policy. `publishConfig`
marks the scoped package as public; releases are published from GitHub Actions
through npm trusted publishing.

## Preview extractor limitations

This package tracks the IA² Core 0.1 draft, but it is not yet a conformance
oracle.

- Browser `URL` resolution can normalize IRIs beyond the draft's exact RFC
  3987 string-preservation rules.
- BCP 47 validation uses a conservative syntax check plus `Intl.Locale`;
  grandfathered and uncommon valid tags may be diagnosed.
- JSON-LD 1.1 has no native RDF 1.2 triple-term syntax. The JSON-LD view uses
  typed JSON literals and displays a notice; Turtle/TriG retains triple terms.
- Extraction reads only the supplied light-tree root. The component treats
  accessible embedded documents as separate sources; opaque or cross-origin
  frames require a privileged adapter. Template contents and shadow roots
  require separately supplied fragments.
- Canonicalization, signatures, remote contexts, SHACL validation, and rule
  execution are outside the Navigator's scope.
