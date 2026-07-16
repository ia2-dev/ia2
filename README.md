# IA² — Information Architecture for Intelligent Agents

IA² (“IA-squared”) explores how digital information can remain richly
structured, interconnected, inspectable, and openly exchangeable as
intelligent agents become participants in the Web.

The goal is not a Web rewritten for agents or absorbed into their platforms.
It is a Web whose independently published parts can explain themselves: what
they contain, how their parts relate, where their claims came from, and what
constraints apply. People, applications, and agents can meet on that shared
surface without one becoming the privileged owner of its meaning.

The Web already contains the world's broadest information architecture, but
its machine-facing layer is fragmented. Agents often have to infer meaning
from presentation, depend on application-specific APIs, or consume semantic
payloads detached from the content a person actually sees. That makes
information harder to verify, correlate, and move between tools.

Markdown has become a useful common denominator for agents because it is
compact, readable, and easy to produce. It is excellent for prose. As an
information interchange, however, it usually flattens identity, relationships,
provenance, constraints, quotation, and changing application state back into
text. Every receiving agent must infer that structure again, and may infer it
differently.

IA² explores a richer path: documents and applications can publish explicit
semantic information at the point where it is presented and used. One agent
can share a claim, plan, decision, result, or live state; another can retain its
exact entities, relationships, evidence, and constraints. An agent can download
an inert document, inspect a live application state, follow linked definitions,
evaluate constraints, and retain provenance without requiring the application
to be absorbed into one AI platform.

The aim is a richer commons, not a lowest common denominator: addressable
entities, composable vocabularies, traversable links, explicit provenance, and
semantics that can move between tools without a platform-owned schema.

HTML is the first proving ground, not the boundary of the project. IA² asks
what it would take for any information surface to explain what it contains,
how its parts relate, where its claims came from, what constraints apply, and
which affordances it offers. A page, application state, conversation, dataset,
decision record, policy, schema, or software artifact should be able to remain
useful outside the product that created it.

The aim is not to turn documents into execution protocols. Meaning,
validation, affordances, authority, and execution are separate layers.
Publishing a description of an action does not grant permission to perform it.

## Beyond Markdown interchange

A Markdown message can say that an issue depends on a decision, quote a claim,
name supporting evidence, or describe a constraint. Those relationships still
live primarily in sentences. Their identifiers, assertion boundaries, graph
context, provenance, confidence, and validation rules are conventions for the
next reader to recover.

An IA² surface can carry the readable explanation and the information graph
together. Resources remain addressable. Claims can be distinguished from
quotations. Evidence and provenance remain connected to what they qualify.
SHACL constraints can travel with the data they govern. A live application can
share its current state as structured information rather than a screenshot or
a prose summary.

This does not make Markdown obsolete. It gives agents a richer interchange
when readable text alone is too lossy, while keeping the result inspectable by
people and independent of any one model, application, or AI platform.

## North star

The agentic Web should remain a commons of independently published,
addressable, and interlinked information. Its structure should be rich enough
for agents to understand without reducing it to prose, yet open enough that no
dominant AI platform becomes the only place where applications can be found,
interpreted, or used. People should be able to inspect the same information and
see why an agent reached a conclusion or proposed a change.

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

The result would not be one universal agent API. It would be a richer,
interconnected Web where one agent can publish structured information and
another can receive it on open terms: addressable, composable, attributable,
and navigable without first translating everything into a platform-owned
schema.

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
- [`specs/discovery-enrichment/index.html`](specs/discovery-enrichment/index.html):
  a supplemental profile for advertising, qualifying, retrieving, and
  presenting additional RDF sources. It publishes a self-described vocabulary
  for candidates, contributions, views, processing activities, roles, and
  lifecycle states without implicit merging, trust, or execution.

### Guides

- [`site/guide/index.html`](site/guide/index.html) — an example-driven guide
  to authoring IA² HTML/RDF, from a first complete statement through named
  graphs, RDF 1.2 triple terms, and live DOM extraction.

### Packages

- [`@ia2-dev/html-rdf-navigator`](packages/html-rdf-navigator/) — a dependency-free browser
  component and TypeScript library for extracting, navigating, and serializing
  the RDF expressed by an IA² HTML document.
- [`packages/browser-extension`](packages/browser-extension/): a least-permission
  WebExtension adapter that opens the Navigator on demand in Chrome, Firefox,
  and Safari.

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

- <http://localhost:8000/site/guide/>
- <http://localhost:8000/specs/html-rdf/>
- <http://localhost:8000/specs/discovery-enrichment/>
- <http://localhost:8000/demos/live-workspace/>

Releases of `@ia2-dev/html-rdf-navigator` are published from GitHub Actions
through npm trusted publishing.

## Deployment

The project is deployed as an assets-only Cloudflare Worker. `wrangler.jsonc`
is the deployment source of truth, and `npm run build` assembles only the
public specification, demo, and navigator bundle into the generated `.site/`
directory, including the authoring guide.

Preview the Worker locally:

```sh
npm run dev
```

Deploy it manually:

```sh
npm run deploy
```

Cloudflare Builds runs `npm run build`, then `npx wrangler deploy`, for
production deployments from the `main` branch. The Worker serves the IA²
project homepage at `ia2.dev`; the HTML/RDF specification is published at its
canonical path, `/spec/html-rdf`, and the practical guide at
`/guide/html-rdf`. The Discovery and Enrichment supplemental profile is
published at `/spec/discovery-enrichment`.

## Status

IA² is early, experimental work. The specifications are exploratory editor's
drafts, and the package is a reference implementation rather than a
conformance oracle.
