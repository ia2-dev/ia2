---
name: ia2-html-rdf
description: Author, modify, inspect, or review HTML that carries RDF 1.2 using the IA² HTML/RDF Core 0.1 proposal. Use for rdf-* attributes, locally complete semantic HTML statements, named graphs, blank nodes, RDF triple terms, SHACL in HTML, canonical/source IRI handling, extraction diagnostics, or integration with @ia2-dev/html-rdf-navigator. Do not use for generic RDFa, JSON-LD, Microdata, or Turtle work that does not involve the IA² binding.
---

# IA² HTML/RDF

Treat IA² HTML/RDF Core 0.1 as an exploratory proposal, not an established Web standard. Preserve the distinction between proposed semantics, repository implementation behavior, and future directions.

## Start from the observation mode

Identify whether the task concerns downloaded inert HTML, a live runtime DOM, or an explicitly supplied `DocumentFragment`. Do not assume these observations produce identical datasets. Record the retrieval IRI, effective source document IRI, RDF base IRI, root kind, and diagnostics when reporting extraction results.

Read [references/core-model.md](references/core-model.md) before implementing an extractor, reviewing conformance, or handling IRI/base, literal, graph, blank-node, or triple-term edge cases. Read [references/authoring-patterns.md](references/authoring-patterns.md) when authoring or rewriting markup.

## Author or modify markup

1. Put `rdf-version="1.2"` on the document's `html` element.
2. Add one usable fragmentless canonical link when the document has a stable public identity. Keep retrieval identity and semantic source identity distinct.
3. Model each asserted RDF statement on one element bearing `rdf-predicate`. Make that element locally sufficient to construct subject, predicate, object, and graph.
4. Use a native HTML carrier for the object:
   - an allowlisted single-IRI attribute for an IRI object;
   - `meta[content]`, `data[value]`, or `time[datetime]` for an exact literal;
   - normalized descendant text for a visible literal;
   - `rdf-object-key` for a reusable blank node; or
   - one direct child `template` for an RDF 1.2 triple term.
5. Put `rdf-graph` or `rdf-graph-key` on every statement that belongs to a named graph. Never infer graph membership from a container.
6. Prefer visible semantic carriers when the presentation and RDF lexical value agree. Use hidden carriers only for relationships or exact values that do not fit visible markup.
7. Use full IRI references. Do not invent prefix expansion, a general `rdf-object` attribute, inherited RDF state, or implicit subject chaining.
8. Update extraction tests whenever semantic markup changes materially.

## Review or diagnose markup

Query asserted candidates as `[rdf-predicate]` within the supplied light-tree root. Do not traverse template contents, shadow roots, or embedded child documents unless the caller supplies one explicitly as a separate root.

For every candidate, verify:

- exactly one subject construction path and one object-carrier form;
- a valid predicate IRI reference;
- at most one graph-name form;
- no datatype metadata on IRI, blank-node, or triple-term objects;
- directly present, compatible datatype/language/direction metadata;
- non-empty whitespace-free local keys;
- no descendant statement element inside a text-literal carrier; and
- a structurally valid, inert term fragment when a direct child template carries a triple term.

Diagnose an invalid statement locally, emit no triple for it, and continue with independent statements. Never repair malformed values from surrounding markup.

## Extract and verify in this repository

Prefer the implementation and tests already present in the IA² repository:

- `extractDataset` in `packages/html-rdf-navigator/src/extract.ts` for document or fragment extraction;
- `packages/html-rdf-navigator/test/extract.test.ts` for Core behavior;
- `packages/html-rdf-navigator/test/resource-envelope.test.ts` for HARE-facing extraction; and
- `npm --prefix packages/html-rdf-navigator test` plus `npm --prefix packages/html-rdf-navigator run check` after changes.

The Navigator is a useful implementation and inspection surface, but it is not a conformance oracle. Call out its documented URL-normalization and BCP 47 limitations when they matter.

## Keep trust layers separate

Acquiring a DOM, extracting RDF, validating it, and executing rules or actions are separate operations. Extraction must not execute scripts, custom elements, SHACL, SPARQL, rules, functions, remote contexts, or fetched vocabularies. An extracted assertion is untrusted input until a consumer establishes otherwise.
