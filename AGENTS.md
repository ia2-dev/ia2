# IA² contributor guide

## Project

IA² means Information Architecture for Intelligent Agents. The project explores
open information architecture for hybrid environments where people,
applications, and agents share data, evidence, constraints, decisions, and
interactions without surrendering them to one platform.

HTML/RDF is the first proving ground, not the project boundary. The current
vertical slice lets an ordinary HTML document or live DOM carry a complete RDF
1.2 dataset, correlate statements with their HTML carriers, and expose the
result through a document navigator.

HARE, the IA² HTML Agent Resource Envelope, is the second vertical slice. It
uses a single HTML document as a self-contained, browser-openable envelope for
resources exchanged between people, applications, and agents. Its canonical
manifest is a named HTML/RDF graph; optional JavaScript may progressively
enhance the document into a verified file browser without becoming the source
of truth.

The project is exploratory. Distinguish proposals, implemented behavior, and
future directions. Do not describe an experiment as an established standard.

## Design principles

- Keep human presentation and machine-readable meaning directly correlated.
- Preserve identity, relationships, provenance, quotation, confidence,
  validation, authority, and execution as distinct concerns.
- Support inert downloaded HTML and runtime-mutated DOM as different, valid
  observations.
- Keep extraction local and deterministic. It must not require script
  execution, remote contexts, pending triples, or implicit chaining.
- Retain the full RDF 1.2 model, including named graphs, blank nodes, triple
  terms, reification, language direction, datatypes, SHACL, and SHACL-AF.
- Keep descriptive affordances separate from permission and execution.
- Prefer independently useful semantic islands over all-or-nothing adoption.
- Treat HTML as one host binding. Do not assume its attribute syntax is right
  for every future medium.
- Keep HARE declarative first. A conforming envelope must remain meaningful and
  machine-readable without executing its own scripts.
- Model a HARE bundle as a resource graph with optional, unique logical paths,
  not as a virtual filesystem that replaces resource identity or relationships.
- Treat semantic DOM, exact bytes, previews, and runtime behavior as separate
  concerns. Verify byte-representation length and digest before preview or
  download.

## Semantic modeling

- Follow the normative extraction behavior in `specs/html-rdf/index.html`.
- An asserted statement carrier must be locally complete and queryable with a
  normal DOM query.
- Do not add a general serialized `rdf-object` attribute or another miniature
  RDF term language.
- Use `<template>` and the specified key mechanism for non-materialized RDF
  structures and triple terms. Do not accidentally assert a quoted statement.
- Resolve relative semantic IRIs against the document's semantic source and
  canonical rules. Public pages must declare their canonical URL.
- Use named graphs intentionally, especially to distinguish runtime state,
  validation contracts, provenance, or other scoped datasets.
- Prefer established vocabularies when their terms actually fit. Check domain,
  range, intended meaning, and current authoritative documentation before use.
- When no existing term fits, use an explicit application vocabulary instead
  of stretching a familiar ontology term.
- Ontology examples are illustrative, not IA² dependencies. Keep the project
  open to existing and future RDF vocabularies on equal terms.
- Add or update extraction tests whenever semantic markup changes materially.

## HARE modeling

- Follow the envelope and manifest requirements in
  `specs/resource-envelope/index.html`. HARE 0.1 is exploratory and must not be
  presented as an established standard.
- Keep the canonical manifest in the named HTML/RDF graph identified by
  `hare:manifestGraph`. JSON or JSON-LD may be an embedded resource or derived
  view, but must not compete with the HTML/RDF manifest.
- Give every representation one explicit kind, a media type using `dc:format`,
  and a `hare:carrier`. A `hare:DOMRepresentation` carries semantic HTML in a
  `<template>`. A `hare:ByteRepresentation` carries inert base64 bytes and also
  declares exact `hare:byteLength` and a SHA-256 `cred:digestSRI` value.
- Use `dcterms:identifier` for an optional absolute logical path. Paths must be
  unique when present, but resources and representations retain RDF identity.
- Give each envelope a non-retrievable `hare:virtualBase` HTTPS URL under
  `.invalid`. It is the host document's virtual URL. DOM representations must
  have logical paths, and resolving those paths against the base assigns their
  virtual document URLs. Use this address space for links, never as RDF identity.
- Keep carriers inert. Runtime code must derive inventory from the manifest,
  verify byte representations before use, and sandbox DOM representations and
  HTML byte previews without scripts.
- Materialize passive template subresources only through the envelope's virtual
  URL space. Host documents may opt into the same verified lookup with inert
  `data-hare-src` bindings that a viewer maps to runtime `src` values. Require a
  matching verified byte representation and a compatible media type, rewrite
  only derived views or explicit runtime bindings, never fall back to the
  network, and keep scripts, workers, plugins, and nested browsing contexts
  inert.
- Treat host and derived Content Security Policies as cumulative. When an
  envelope is intended to support a browser-local viewer, permit only the local
  frame and passive-resource schemes that viewer requires; never weaken the
  host policy or add network fallback to make a preview work.
- Preserve graph identity and unknown manifest statements. Logical paths are
  routing conveniences for linked resources, not global identifiers.
- Recommend one HTML `link rel="canonical"` when a stable retrievable location
  is available. Treat it as identity and retrieval metadata, not proof of
  availability, integrity, authority, or permission.
- Keep the HARE version and artifact profile explicit with
  `dcterms:conformsTo`. A consumer-provided viewer or browser extension does
  not change the profile declared by the envelope.
- When changing HARE markup, update extraction, validation, integrity, viewer,
  and browser-extension tests as applicable.

## Repository layout

- `specs/html-rdf/index.html`: single-file ReSpec source and self-describing
  IA² HTML/RDF specification. Keep it as one authored HTML file for now.
- `specs/discovery-enrichment/index.html`: supplemental ReSpec profile for
  advertising, qualifying, retrieving, and presenting additional RDF sources.
- `specs/resource-envelope/index.html`: single-file ReSpec source for the IA²
  HTML Agent Resource Envelope (HARE) 0.1 proposal and vocabulary.
- `specs/resource-envelope/examples/`: scenario-led HARE examples: an Atlas
  decision handoff, Northstar vendor review, Riverside inspection evidence
  pack, and Orion release handoff. Together they cover declarative,
  self-viewing, bare file-browser, and authored-plus-files modes.
- `site/index.html` and `site/home.css`: public project homepage.
- `site/spec-selector.css` and `site/spec-selector.js`: progressively enhanced
  specification selector shared by public navigation and calls to action.
- `site/guide/index.html`: HTML/RDF authoring guide.
- `packages/html-rdf-navigator/`: dependency-free web component, extractor,
  serializers, TypeScript sources, and tests for
  `@ia2-dev/html-rdf-navigator`.
- `packages/hare-viewer/`: dependency-free optional file-browser UI, parser,
  integrity verification, TypeScript sources, generated distribution, and
  tests for `@ia2-dev/hare-viewer`.
- `plugins/ia2/`: portable Agent Skills for IA² HTML/RDF and HARE, packaged
  with Codex and Claude Code plugin manifests. Keep the skill folders as the
  cross-client source of truth and host-specific metadata as thin adapters.
- `packages/browser-extension/`: Chrome, Firefox, and Safari adapter. It
  automatically enhances HARE documents while keeping the toolbar action
  dedicated to the general HTML/RDF Navigator.
- `demos/live-workspace/`: demo directory plus separately published issue,
  inbox, release-brief, and vendor-review application pages.
- `scripts/build-site.mjs`: assembles public assets into `.site/`.
- `wrangler.jsonc`: Cloudflare Worker and static asset configuration.
- `PRODUCT.md` and `DESIGN.md`: product position, voice, and visual system.

Do not edit `.site/` directly. It is generated by the build.

## Demo boundaries

Keep unrelated application RDF spaces on separate pages. A page should publish
a coherent local graph and connect to another application through stable,
canonical resource IRIs. Do not place every kitchen-sink domain into one DOM
merely for navigation convenience.

Interactive demos must update their semantic DOM when visible application state
changes. The RDF Navigator should observe those changes without the application
maintaining a detached duplicate graph.

HARE examples must remain directly inspectable as source. Keep small normative
examples embedded in the ReSpec document instead of making conformance depend
on links to separate demos. Prefer `<template>` carriers for semantic HTML so
agents can inspect the DOM without decoding escaped bytes. Self-viewing examples
may include JavaScript, but their manifest, resource list, trust statement, and
carriers must remain useful when scripting is unavailable.

## Interface and copy

- Follow `PRODUCT.md` and `DESIGN.md` for voice, hierarchy, color, typography,
  accessibility, and component behavior.
- Keep the voice rigorous, legible, quietly optimistic, and free of AI hype.
- Frame IA² around connected hybrid work, not nostalgia for the Semantic Web.
- Prefer precise examples over abstract enterprise claims.
- Avoid em dashes in public copy.
- Preserve WCAG 2.2 AA behavior, keyboard access, visible focus, readable line
  lengths, responsive layouts, and reduced-motion support.
- Keep the project name visually dominant over supporting propositions.
- Use the RDF Navigator to prove source-to-meaning correlation, not as
  decorative developer tooling.

## Development

Install dependencies and run the complete verification sequence:

```sh
npm install
npm test
npm run check
npm run build
```

Useful focused commands:

```sh
npm run build:navigator
npm run build:extension
npm run build:hare-viewer
npm run build:site
npm run dev
npm run serve
```

Before committing:

1. Run `git diff --check`.
2. Run tests, TypeScript checks, and the production build.
3. Visually verify affected public or interactive pages at desktop and mobile
   widths when presentation or behavior changed.
4. Check the browser console for warnings and errors.
5. Verify canonical URLs and extracted RDF when adding or moving pages.
6. For HARE changes, verify template-DOM rendering, declared byte lengths and
   SHA-256 digests for byte representations, preview and download behavior,
   recursive subresource materialization, no-script inspection, and authored
   and bare viewer modes.

## Git and publication

- Preserve unrelated user changes and work safely in a dirty worktree.
- Keep commits intentional and independently understandable.
- Prefer commit subjects of 50 characters or fewer; never exceed 80.
- Do not rewrite public history, force-push, or use destructive reset commands
  unless explicitly authorized.
- Do not push, deploy, publish npm packages, or change external configuration
  unless the task includes that authority.
- `main` is deployed to `ia2.dev` through the connected Cloudflare project.
  After an authorized publication, verify the public route rather than assuming
  a successful Git push means deployment is complete.

## Completion standard

A change is complete when its implementation, semantics, tests, responsive
presentation, documentation, and generated public build agree. Report the
result, verification performed, and relevant commit or public URL concisely.
