# IA² HTML/RDF Navigator

`@ia2-dev/html-rdf-navigator` is a zero-framework Web Component and TypeScript library
for inspecting the RDF dataset expressed by an IA² HTML document. It extracts
the current DOM, leads with a source-oriented Navigator, provides Turtle/TriG
and JSON-LD views, and correlates statements with their HTML carriers.

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
</script>
```

## Features

- IA² Core 0.1 extraction from a `Document` or `DocumentFragment`
- Navigator-first inspection with source correlation and vocabulary links
- a conditional Vocabulary view for document-defined classes and properties,
  including RDFS subclass and subproperty trees
- live, case-insensitive filtering across terms, IRIs, graphs, and carriers
- semantic typeahead from in-document labels, OWL/RDF kinds, domains, and ranges
- namespace filters discovered from every named-node URL
- click-activated, movable linked-resource preview windows
- source-order display and semantic-DOM indentation
- bidirectional page/Navigator scroll following and hover correspondence
- contextual, syntax-highlighted shallow and full carrier HTML views
- in-document navigation for local RDF terms
- conditional discovery of related knowledge through established RDF
  relationships and qualified DCAT roles
- deliberate, credential-free HTML/RDF loading into separate named graphs
- Turtle/TriG and JSON-LD serialization
- live-DOM refresh through a debounced `MutationObserver`
- independent diagnostics that do not abort valid statements
- six persistent drawer positions across both sides of the viewport
- keyboard access, visible focus, reduced motion, and responsive themes
- Shadow DOM isolation from host-page and ReSpec styles

## API

```ts
import {
  Ia2RdfNavigator,
  detectDiscoveryCandidates,
  extractDocumentVocabulary,
  extractDataset,
  mergeDiscoveryContributions,
  mountRdfNavigator,
  serializeJsonLd,
  serializeTurtle,
} from "@ia2-dev/html-rdf-navigator";
```

`extractDataset(root?)` returns quads, declared graphs, diagnostics, and the
retrieval, semantic source, and RDF base IRIs. A single valid HTML
`link[rel~="canonical"]` supplies the semantic source IRI and, in the absence of
an explicit `base[href]`, the RDF base IRI. Quads retain their source `Element`,
which powers document navigation. The mounted Navigator reflects the runtime
DOM, including semantic changes made by the host application.

`extractDocumentVocabulary(result)` identifies named classes and properties
defined in the source dataset. The mounted component presents them in a
Vocabulary tab only when definitions exist. Local terms correlate with their
HTML definition carriers in both directions; external hierarchy parents remain
linked context rather than being counted as local definitions.

`detectDiscoveryCandidates(result)` normalizes recognized direct relationships
and qualified DCAT relationships without performing network activity. The
mounted component reveals a Discovery tab only when candidates exist. A person
may load an HTML/RDF target explicitly; the retrieved document is parsed
without script execution and its default graph is presented as a named graph
identified by the target document's canonical IRI. Contributions remain
removable and never alter the source extraction.

## Development

```sh
npm install
npm test
npm run check
npm run build
npm pack --dry-run
```

The published package contains the browser-ready ESM bundle, TypeScript
declarations, README, and license. It has no runtime dependencies and does not
execute RDF, SHACL, remote contexts, or retrieved scripts. Discovery retrieval
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
- Extraction reads only the supplied light-tree root. Template contents,
  shadow roots, and embedded documents require separately supplied fragments.
- Canonicalization, signatures, remote contexts, SHACL validation, and rule
  execution are outside the Navigator's scope.
