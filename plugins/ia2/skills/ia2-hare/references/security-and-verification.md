# HARE security and verification

## Separate the claims

- Byte integrity proves that decoded representation bytes match one manifest commitment.
- Semantic integrity would cover a canonicalized manifest graph.
- Source integrity would cover defined envelope source bytes.
- Authority, permission, provenance, and safe execution are independent.

HARE 0.1 defines byte-representation integrity only. Do not describe a matching digest as a signature, authorization, endorsement, or safety verdict.

## Declarative processing

Default to parsing and extraction without execution. Opening an untrusted self-viewing HTML envelope can execute its host script. Do not execute scripts or event handlers in bundled representations, fetch remote contexts, dereference semantic IRIs, or treat SHACL/rules as consent to run them.

Before allocating decoded buffers, apply resource limits. Reject malformed or unpadded base64, mismatched decoded length, unsupported SRI algorithms, mismatched SHA-256, missing or wrong carriers, duplicate carrier IDs, and undeclared byte-carrier blocks.

## Preview and download

Verify a byte representation before preview or download. Treat its declared media type as part of the security decision; do not override it in a way that enables execution.

Render DOM and HTML-byte representations in sandboxed browsing contexts without script permission. Strip representation scripts from derived documents, apply a deny-by-default CSP, prevent authored URLs from being followed directly, and route preserved references in consumer-owned code. A viewer may grant same-origin access only when needed for its own routing inspection; never add script permission to representation content.

Render Markdown into a safe derived DOM and keep raw HTML inert. Treat SVG, PDF, fonts, media, image decoders, and other complex formats as untrusted input.

## CSP

Host and derived Content Security Policies are cumulative. An inner policy cannot restore a frame or resource blocked by the host policy. Report a host-policy block; never weaken, replace, or bypass the host policy or add network fallback to make a preview work.

A scriptless envelope intended for consumer viewers may permit only the local mechanisms those viewers need, such as `about:srcdoc`, verified `blob:` resources, and existing passive `data:` resources, while continuing to deny network and executable destinations. A self-viewing host may add only the narrowest script policy required for its own declared runtime.

## Virtual routing

Never navigate a frame to a `.invalid` URL and never fetch one. Route a URL matching a declared representation internally; route `/` to the host; apply fragments to the selected document; require deliberate user action for external navigation.

Preserve authored references as routing data and make anchors inert before display, including before the routing handler becomes active.

## Verified passive-resource materialization

For each passive reference:

1. resolve against the containing representation's virtual URL, or `virtualBase` for a host binding;
2. require a match to a declared byte representation, ignoring the fragment for lookup;
3. verify base64, decoded length, and digest;
4. require a media type compatible with the fetch destination;
5. create a viewer-local URL and restore any fragment; and
6. rewrite only the derived view, derived stylesheet, or explicit inert host binding.

Support may include images, audio, video, tracks, SVG image/use references, stylesheets, `srcset`, inline CSS, `url()`, and recursive CSS imports. Cache by representation, detect cycles, and revoke temporary URLs with the derived view.

Never materialize scripts, workers, plugins, nested browsing contexts, executable destinations, or a DOM representation in a passive fetch slot. Leave unmatched, external, incompatible, cyclic, or unverifiable references inert and report them. Never fall back to the network.

## Archival handling

Preserve original envelope source bytes, decoded byte representations after verification, DOM carrier semantics without treating reserialization as preservation, retrieval identity separately from canonical identity, graph identity, and unknown manifest statements.
