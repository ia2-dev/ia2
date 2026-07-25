# IA² RDF Value Editor

`@ia2-dev/rdf-value-editor` is an experimental web component that derives an
authoring form from an HTML/RDF document. It is not contract software and it
does not know the shape of the host document.

The component understands:

- SHACL property shapes for focus nodes, paths, labels, groups, order, and the
  control profile
- RDF/JS validation of every SHACL Core constraint attached to an active
  authoring shape
- a closed `sh:in` list of RDF literals or IRIs for enumerated controls
- [Web Annotation](https://www.w3.org/TR/annotation-vocab/) for correlating
  shapes with visible targets, contextual fields, and alternative fragments
- Schema.org, PROV-O, and DC Terms for focus and portable-state metadata

The source remains free to use any domain ontology. RDF Value Editor does not
contain legal field identifiers, document selectors, FIBO or DoCO branches, or
a dependency on an RDF Navigator element. It publishes no RDF Value Editor
ontology.

## Include it

```html
<ia2-rdf-value-editor
  runtime-graph="#runtime-graph"
  label="Complete document"
  position="right"
  backlinks
></ia2-rdf-value-editor>
<script type="module" src="./rdf-value-editor.js"></script>
```

The bundle registers `<ia2-rdf-value-editor>` but does not mount one automatically.
`label` controls host-facing panel copy. `runtime-graph` selects the named graph
that receives accepted values. The authoring model uses established RDF
vocabularies and can be exchanged without component-specific attribute setup.

`source-root` may select one semantic island by CSS selector. For shadow roots
or other non-document roots, assign a `Document`, `DocumentFragment`, or
`Element` to the `sourceRoot` property. Discovery, value targets, alternatives, and
runtime RDF are then confined to that root, allowing independent editors on
one page. Runtime carriers and dataset-change events belong to the resolved
source document, including when it is an external same-origin document. A
completed `Document` or `Element` export clones that source document. A
`DocumentFragment` export produces a standalone HTML/RDF document containing
the fragment and a canonical link to the semantic source.

`label-predicates` accepts an ordered, space-separated list of absolute
predicate IRIs for resource labels. The defaults are `rdfs:label`,
`skos:prefLabel`, and `schema:name`.

Call `refresh()` after the host materially changes its authoring model. Removing
the component restores projected content and visible targets; reconnecting
it performs fresh discovery.

After accepted values change, the source document receives the generic
`ia2-rdf-dataset-change` event. The editor-specific
`ia2-rdf-value-editor-change` event remains available for 0.1 consumers, but
new observers should use the generic dataset protocol.

## Field model

A field is an ordinary `sh:PropertyShape` used as the body of an
`oa:Annotation`. Each visible value location is an annotation target:

```html
<a href="http://www.w3.org/ns/shacl#PropertyShape"
   rdf-subject="#name-shape"
   rdf-predicate="http://www.w3.org/1999/02/22-rdf-syntax-ns#type"></a>
<a href="#organization"
   rdf-subject="#name-shape"
   rdf-predicate="http://www.w3.org/ns/shacl#targetNode"></a>
<a href="https://schema.org/name"
   rdf-subject="#name-shape"
   rdf-predicate="http://www.w3.org/ns/shacl#path"></a>
<span rdf-subject="#name-shape"
      rdf-predicate="http://www.w3.org/ns/shacl#name">Organization name</span>
<a href="http://www.w3.org/ns/oa#Annotation"
   rdf-subject="#name-presentation"
   rdf-predicate="http://www.w3.org/1999/02/22-rdf-syntax-ns#type"></a>
<a href="http://www.w3.org/ns/oa#describing"
   rdf-subject="#name-presentation"
   rdf-predicate="http://www.w3.org/ns/oa#motivatedBy"></a>
<a href="#name-shape"
   rdf-subject="#name-presentation"
   rdf-predicate="http://www.w3.org/ns/oa#hasBody"></a>
<a href="#visible-name"
   rdf-subject="#name-presentation"
   rdf-predicate="http://www.w3.org/ns/oa#hasTarget"></a>
```

Repeated targets remain synchronized because they refer to the same
shape and focus node. Sources may state `oa:motivatedBy oa:describing`, as the
assignment example does, to make the presentation annotation's purpose
explicit.

A reusable `sh:targetClass` shape can produce controls for several resources.
In that case, each presentation annotation identifies its focus with
`schema:about` and may provide a contextual `sh:name`. This keeps entity
identity in RDF instead of DOM `data-*` hints.

Control generation has an intentionally narrower profile than validation.
RDF Value Editor renders one control for a simple IRI `sh:path` and one focus node,
using `sh:minCount`, date and integer `sh:datatype`, `sh:nodeKind sh:IRI`,
`sh:in`, `sh:defaultValue`, labels, groups, and order as presentation hints.
Blank-node and triple-term members of `sh:in`, multi-valued controls, and
complex paths do not yet produce controls.

Once a control exists, RDF Value Editor delegates its complete active property
shape to [`shacl-engine`](https://github.com/rdf-ext/shacl-engine) in one
validation invocation over an RDF/JS dataset. The HTML/RDF dataset's named
graphs are deliberately projected into one SHACL data graph; graph identity
remains available to extraction and serialization but does not implicitly alter
SHACL Core matching. All SHACL Core constraint components are therefore enforced,
including range, logical, pair, nested-shape, qualified-value, language, class,
cardinality, string, datatype, node-kind, closed-shape, `sh:hasValue`, and
`sh:in` constraints. Contextual activation remains a presentation concern:
inactive property shapes are deliberately omitted from validation.
SHACL-SPARQL, SHACL-JS, and SHACL-AF are not enabled by this component.

Defaults remain suggestions until accepted by input or **Apply defaults**.
`sh:group` and `sh:order` organize controls without host DOM assumptions. A
group's own `sh:order` orders groups, while each property's `sh:order` orders
controls inside that group. RDF group identity remains distinct even when two
groups share a display label.

## Enumerated values and alternative fragments

Any authorable property shape with `sh:in` becomes an enumerated control. Its
focus node and path determine the emitted statement; no action class,
`schema:result`, or domain vocabulary is required. Named-node and literal
members are supported. A source may independently describe the focus node as a
`schema:ChooseAction`, workflow decision, configuration, status, or anything
else appropriate to its domain.

Alternative content is another `oa:Annotation`. It targets one document
element and uses an `oa:Choice` body whose ordered `as:items` are
`oa:SpecificResource` resources. Each item has exactly one same-document HTML
template as its `oa:hasSource` and one enumerated option IRI as its
`oa:hasScope`. The assignment example marks these annotations
`oa:motivatedBy oa:editing`.

Replacement preserves the target element while cloning the template's
children. A replacement can contain HTML/RDF carriers, allowing one selection
to change both human-visible wording and the extracted operative graph.
Scripts, styles, network-loading media, forms, nested browsing contexts,
plugins, custom elements, event-handler attributes, `srcdoc`, and active URLs
are rejected.

An annotation may also use an `oa:SpecificResource` body whose source is the
property shape and whose scope is an option IRI. That declares a conditional
field without adding a new predicate. Activation is computed as a dependency
closure: only selected IRI options from active properties can activate
descendants or project alternatives. Values retained by inactive controls are
not emitted or saved.

An empty template omits the target. If active alternatives ambiguously address
the same target, none is applied. The source should model an unambiguous result.
Projection clones the template's child nodes exactly. The editor does not
interpret or normalize wording, punctuation, or whitespace. A target and its
alternative templates must therefore carry every optional separator that the
host document requires.

## Completed document and portable values

The toolbar lets the user save either artifact with one browser download:

1. A completed HTML copy of the shaped source document, with valid values and
   selected or omitted alternative fragments applied. The copy retains the
   runtime RDF statements but removes the editor host, backlinks, and transient
   projection markers.
2. A separate HTML/RDF or Turtle values companion that can be loaded into the
   original shaped document later.

The companion artifact is a `prov:Entity` derived from the canonical source
document with `prov:wasDerivedFrom` and timestamped with `dcterms:created`.
It also declares
`dcterms:conformsTo <https://ia2.dev/spec/html-rdf#completion-values-profile>`,
which distinguishes a values artifact from an unrelated PROV entity.
Every accepted value uses the corresponding property shape's focus node and
`sh:path`; literal and IRI enumerations use the same representation.

The companion does not copy the source template or any separate review layer.
The completed HTML keeps the editor's named runtime graph, but removes the
editor itself and visually neutralizes completed-value carriers for a clean
customer-facing document. Load accepts either artifact. A companion must
identify exactly one `prov:Entity` with exactly one matching
`prov:wasDerivedFrom` source; completed HTML is matched by its canonical source
IRI and reads only its runtime value carriers. Loading rejects duplicate values,
applies enumerated values before conditional fields, and sends all values
through the same validation, projection, and runtime graph path as direct input.

```js
const editor = document.querySelector("ia2-rdf-value-editor");
await editor.validate();
const completedHtml = editor.exportCompletedDocument();
const turtle = editor.exportCompletion("turtle");
const result = await editor.loadCompletion(turtle, { contentType: "text/turtle" });

// Each call downloads exactly one selected artifact.
editor.saveArtifact("completed");
editor.saveArtifact("values", "html");
editor.saveArtifact("values", "turtle");
await editor.loadCompletionFile(file);

const report = await editor.validate();
console.log(report.conforms, report.issues);
```

## Backlinks

The boolean `backlinks` attribute turns each discovered visible value into an
accessible route to its generated control. Click, Enter, or Space opens the
panel, scrolls the control into view, and focuses it. Direct backlink navigation
temporarily takes priority over scroll synchronization, then restores the
selected sync behavior without changing its mode. Without `backlinks`, the
host's visible interactions remain unchanged.

## Shared window and synchronization vocabulary

RDF Value Editor and RDF Navigator use `@ia2-dev/ui-primitives` for the same
position controls and behavior:

- `right`, `right-top`, `right-bottom`
- `bottom`, `floating`, `top`
- `left`, `left-top`, `left-bottom`

Use `allowed-positions` to restrict the chooser. Use
`positioning="fixed"` to disable reader repositioning and resizing. On desktop,
the floating window can be resized from any edge or corner and remains bounded
to the viewport. Narrow-screen windows stay full-screen.

Scroll modes are component-neutral:

- `off` disables synchronization
- `page` follows the page inside the panel
- `panel` follows the panel inside the page

Set the initial mode with `sync="page"` or call
`setSyncMode("off" | "page" | "panel")`.

## Diagnostics

`modelIssues` returns a read-only snapshot of authoring-model issues. After
each discovery pass the component dispatches `ia2-rdf-value-editor-model` with the
source IRI, binding count, and issue list. The visible status remains
a concise summary rather than hiding diagnostics from host applications.

`validate()` resolves to a component-neutral report containing each affected
shape, focus node, path, label, and its SHACL messages. The component also
dispatches the bubbling, composed `ia2-rdf-value-editor-validation` event after every
current validation pass. Stale asynchronous reports are discarded when a
newer input arrives. Programmatic callers must await `validate()` before
exporting; synchronous export refuses to race a pending report. Only conforming
values are projected into the runtime RDF graph or portable completion
document.
