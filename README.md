# IA² — Information Architecture for Intelligent Agents

IA² (“IA-squared”) is an exploratory project about making digital information
legible, navigable, and accountable to both people and intelligent agents.

The Web already contains the world's broadest information architecture, but
its machine-facing layer is fragmented. Agents often have to infer meaning
from presentation, depend on application-specific APIs, or consume semantic
payloads detached from the content a person actually sees. That makes
information harder to verify, correlate, and move between tools.

IA² explores a different path: documents and applications can publish explicit
semantic information at the point where it is presented and used. An agent can
download an inert document, inspect a live application state, follow linked
definitions, evaluate constraints, and retain provenance without requiring the
application to be absorbed into one AI platform.

HTML is the first proving ground, not the boundary of the project. IA² asks
what it would take for any information surface to explain what it contains,
how its parts relate, where its claims came from, what constraints apply, and
which affordances it offers. A page, application state, conversation, dataset,
decision record, policy, schema, or software artifact should be able to remain
useful outside the product that created it.

The aim is not to turn documents into execution protocols. Meaning,
validation, affordances, authority, and execution are separate layers.
Publishing a description of an action does not grant permission to perform it.

## North star

The agentic Web should not require every application to become a mini-app
inside a dominant AI platform. Agents should be able to come to independently
published information, understand it on its own terms, inspect its evidence,
and act through explicit boundaries. People should be able to inspect the same
information and see why an agent reached a conclusion or proposed a change.

IA² explores a shared legibility layer for that world:

- a document can identify the claims it makes and the evidence it cites;
- a live interface can expose its current semantic state without surrendering
  control of its runtime;
- a conversation can preserve contributions, reply structure, targets,
  attribution, model and tool use, and execution provenance;
- a decision can retain its goals, options, evaluations, commitments,
  authority, implementation, and observed consequences as distinct records;
- a dataset can relate intended processing to actual lineage, classifications,
  confidence, applicable policy, and unresolved evidence gaps;
- a specification, ontology, configuration, or code artifact can connect a
  proposal to approval, implementation, publication, and observed change
  without pretending those stages are the same event.

The result would not be one universal agent API. It would be a web of
addressable, composable information that many agents and applications can
navigate without first translating everything into a platform-owned schema.

## Architectural horizon

IA² treats intelligent-agent information architecture as a set of separable
layers. HTML/RDF is the first host binding through which these layers can be
explored together.

| Layer | Question | Territory |
| --- | --- | --- |
| **Surfaces and bindings** | Where does the information live, and how is it correlated with what a person sees or manipulates? | HTML and live DOM today; later, native bindings or profiles for documents, fragments, conversations, events, datasets, APIs, and governed artifacts. |
| **Semantic models** | What does the information mean? | Full RDF 1.2, linked vocabularies, domain ontologies, reusable profiles, and mappings between models. |
| **Integrity and evidence** | Why should a consumer accept, reject, qualify, or revisit it? | SHACL, provenance, scoped claims, confidence, validation reports, versioning, signatures, and selective disclosure. |
| **Agency** | What could be done, under which conditions, and by whose authority? | Inspectable affordances, goals, plans, preconditions, effects, requests, capability descriptions, authorization, and execution receipts kept as distinct concerns. |
| **Navigation and exchange** | How does information move without losing identity or context? | Linked discovery, semantic fragments, snapshots, subscriptions, queries, diffs, synchronization, packaging, and cross-application navigation. |

Each host should have a binding that feels native to it. IA² does not assume
that HTML attributes are the right syntax for every medium. It does assume that
assertion boundaries, identity, provenance, quotation, validation, authority,
and execution should remain explicit wherever the information travels.

## Relationship to ontologies

IA² is not a new universal ontology and does not require one privileged
vocabulary. It is concerned with making composable models operationally
present in documents and applications: locatable, inspectable, constrainable,
linkable, and attributable at the point of use.

## Design stance

- **One information surface:** human presentation and machine-readable meaning
  should remain directly correlated.
- **Local inspection:** the meaning expressed by an artifact should be
  extractable without scripts, remote contexts, or hidden parser state.
- **Open-world depth:** the architecture should retain the full RDF model
  rather than collapse semantics into a fixed application schema.
- **Explicit boundaries:** assertion, quotation, provenance, validation, and
  execution should not blur into one another.
- **Live and inert acquisition:** a downloaded HTML document and an
  application-mutated DOM are different but equally legitimate observations.
- **Decentralized interoperability:** documents and applications should remain
  useful across agents, browsers, organizations, and AI platforms.
- **Incremental adoption:** useful semantic islands should be possible without
  converting an entire site or application at once.

## Current work

This repository starts with the smallest end-to-end demonstration of the
larger architecture: information expressed in an ordinary HTML surface,
extracted as a complete RDF 1.2 dataset, correlated back to its DOM carriers,
and inspected while the document is inert or changing at runtime.

### Specifications

- [`specs/html-rdf/index.html`](specs/html-rdf/index.html) — an exploratory
  HTML attribute binding for complete RDF 1.2 datasets. The file is both the
  authored ReSpec source and an IA² document; there is no generated Markdown or
  template layer.

### Packages

- [`@ia2/html-rdf-navigator`](packages/html-rdf-navigator/) — a dependency-free browser
  component and TypeScript library for extracting, navigating, and serializing
  the RDF expressed by an IA² HTML document.

### Demos

- [`demos/live-workspace/`](demos/live-workspace/) — an issue tracker and inbox
  whose semantic DOM changes with the application state, demonstrating live
  extraction and navigation.

## Exploration program

The current HTML/RDF work establishes the first vertical slice. Plausible next
experiments include:

1. **Shapes in the surface:** publish SHACL Core and SHACL-AF alongside the
   information they constrain, then make validation results navigable back to
   both shapes and DOM carriers.
2. **Semantic fragments and snapshots:** give agents stable, quotable units
   smaller than a whole application and portable snapshots of live state.
3. **Evidence-aware interaction:** represent provenance, confidence, scoped
   claims, disagreement, and decision traces as first-class navigable material.
4. **Affordances without ambient authority:** describe available operations,
   inputs, expected effects, and receipts while keeping authentication,
   authorization, consent, and execution outside descriptive extraction.
5. **Governed change:** connect proposals, decisions, implementations, diffs,
   releases, and downstream compatibility assessments across specifications,
   schemas, mappings, policies, and code.
6. **Decentralized discovery:** let an agent move from a surface to definitions,
   profiles, evidence, related artifacts, services, and change feeds without a
   platform-specific integration for every hop.
7. **Additional host bindings:** determine which guarantees from the HTML/RDF
   model generalize to other document, conversation, data, event, and software
   artifact formats, and which require native host-specific designs.

These are directions for investigation, not commitments already made by the
current specification. The project should grow by proving small interoperable
vertical slices, not by declaring an all-encompassing framework in advance.

## Development

Install the workspace and verify the package:

```sh
npm install
npm test
npm run check
npm run build
```

Serve the repository to preview the ReSpec document and demo:

```sh
npm run serve
```

Then open:

- <http://localhost:8000/specs/html-rdf/>
- <http://localhost:8000/demos/live-workspace/>

The npm scope must be controlled before publishing `@ia2/html-rdf-navigator`.

## Deployment

The project is deployed as an assets-only Cloudflare Worker. `wrangler.jsonc`
is the deployment source of truth, and `npm run build` assembles only the
public specification, demo, and navigator bundle into the generated `.site/`
directory.

Preview the Worker locally:

```sh
npm run dev
```

Deploy it manually:

```sh
npm run deploy
```

Cloudflare Builds uses `npm run deploy` for production deployments from the
`main` branch. The Worker serves the IA² project homepage at `ia2.dev`; the
HTML/RDF specification is published at its canonical path, `/spec/html-rdf`.

## Status

IA² is early, experimental work. The specifications are exploratory editor's
drafts, and the package is a reference implementation rather than a
conformance oracle.
