---
name: ia2-hare
description: Create, modify, inspect, validate, or explain IA² HTML Agent Resource Envelope (HARE) 0.1 documents. Use for .hare.html bundles, canonical HTML/RDF manifests, DOMRepresentation and ByteRepresentation carriers, logical paths and .invalid virtual URLs, byte length/SHA-256 SRI commitments, declarative or self-viewing profiles, verified subresource materialization, sandboxed previews, @ia2-dev/hare-viewer integration, or HARE security review. Do not use for generic ZIP, multipart, MHTML, JSON manifest, or unrelated RDF packaging tasks.
---

# IA² HARE

Treat HARE 0.1 as an exploratory IA² proposal, not an established standard. Make the declarative HTML/RDF graph authoritative; optional runtime code is progressive enhancement only.

Apply the `ia2-html-rdf` skill alongside this one whenever changing or diagnosing the manifest's HTML/RDF carriers.

## Load the right reference

- Read [references/manifest-model.md](references/manifest-model.md) for every authoring, parsing, or validation task.
- Read [references/authoring-patterns.md](references/authoring-patterns.md) before creating a new envelope or representation.
- Read [references/security-and-verification.md](references/security-and-verification.md) before implementing a consumer, viewer, preview, download, subresource materializer, archival flow, or security review.

## Choose the artifact profile

Use the Declarative Profile by default. Choose the Self-Viewing Profile only when the single HTML file must carry its own viewer runtime. In either profile, keep the title, description, resource list, trust statement, manifest, and carriers meaningful without script execution.

Do not infer a profile from the presence of a consumer-provided viewer or browser extension. Declare exactly one profile with `dcterms:conformsTo`, and inspect the actual HTML rather than trusting that declaration as a security boundary.

## Create or modify an envelope

1. Start with UTF-8 HTML, the HTML doctype, `rdf-version="1.2"`, and preferably a `.hare.html` filename.
2. Give the envelope a visible title, description, resource inventory, and trust statement.
3. Assert exactly one `hare:Envelope`, HARE 0.1 conformance, exactly one artifact profile, exactly one `hare:manifestGraph`, and exactly one `hare:virtualBase`.
4. Put the canonical manifest in the named HTML/RDF graph selected by `hare:manifestGraph`. Repeat `rdf-graph` on every manifest statement; HTML/RDF graph state does not inherit.
5. Give every conceptual resource and representation an RDF IRI. Relate resources to the envelope with `dcterms:hasPart` and representations to resources with `hare:representation`.
6. Give every representation exactly one kind, one IANA media type through `dc:format`, and one `hare:carrier`.
7. Use a `hare:DOMRepresentation` only for semantic HTML carried in a uniquely identified `template`; require media type `text/html` and a unique absolute logical path.
8. Use a `hare:ByteRepresentation` for exact bytes carried as strict padded base64 in a uniquely identified inert script data block. Declare exact decoded `hare:byteLength` and `cred:digestSRI`.
9. Assign optional logical paths to byte representations when browser-like routing is useful. Keep paths unique and separate from RDF identity.
10. Use established RDF vocabularies for relationships and provenance when their semantics fit. Preserve unknown manifest statements.

## Compute byte commitments

Run the bundled helper against the exact final source bytes before embedding them:

```sh
node <skill-directory>/scripts/byte-commitment.mjs --base64 path/to/resource
```

Copy `byteLength`, `digestSRI`, and `base64` from its JSON output into the manifest and carrier. Re-run the helper after any byte change, including a canonical-link edit or newline change. The digest is SHA-256 over decoded representation bytes, never over base64 text.

## Validate an envelope

Validate all of these layers; passing one does not imply the others:

1. HTML and HTML/RDF extraction diagnostics.
2. Exactly one envelope, supported HARE version, exactly one profile, manifest graph, and conforming virtual base.
3. Manifest cardinalities, one representation kind, resource/representation IRIs, and preserved unknown statements.
4. Logical-path syntax and case-sensitive uniqueness; derived virtual-URL uniqueness.
5. Carrier lookup by decoded fragment, unique carrier IDs, and kind-to-element correspondence.
6. Strict padded base64, decoded length, SHA-256 SRI, and absence of undeclared byte-carrier blocks.
7. Profile restrictions and meaningful no-script presentation.
8. Viewer routing, sandboxing, CSP behavior, passive-resource verification, failure reporting, and no network fallback when runtime behavior is in scope.

## Work in this repository

Use the existing implementation instead of creating a competing parser or viewer:

- `readHareEnvelope` and `verifyHareRepresentation` in `packages/hare-viewer/src/model.ts`;
- materialization logic in `packages/hare-viewer/src/materialize.ts`;
- viewer and navigation behavior in `packages/hare-viewer/src/viewer.ts` and `navigation.ts`;
- scenario examples in `specs/resource-envelope/examples/`; and
- focused verification with `npm --prefix packages/hare-viewer test`, `npm --prefix packages/hare-viewer run check`, and relevant HTML/RDF extraction tests.

When changing example markup or runtime behavior, also verify template-DOM rendering, byte commitments, preview and download behavior, recursive passive subresources, no-script inspection, authored and bare modes, browser console output, and mobile/desktop presentation as applicable.

## Preserve the trust boundary

Default to declarative extraction. Do not execute scripts found in bundled representations. Do not fetch semantic IRIs, virtual `.invalid` URLs, unmatched resources, or external subresources merely to process or render an envelope. Keep byte integrity, semantic integrity, source integrity, authority, permission, and safe execution as separate claims.
