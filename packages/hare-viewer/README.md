# `@ia2-dev/hare-viewer`

`@ia2-dev/hare-viewer` is an optional, dependency-free browser UI for HARE
(HTML Agent Resource Envelope) documents whose manifests use HTML/RDF.

The package reads the canonical HTML/RDF manifest already carried by the
document. It does not introduce JSON metadata, replace the manifest, or make
runtime state authoritative.

The reader recognizes the HARE 0.1 conformance and artifact-profile IRIs,
Dublin Core membership, identifiers, and media types, the W3C Credentials SRI
digest, and HARE's representation, carrier, and byte-length properties.

## Automatic enhancement

```html
<script type="module" src="./hare-viewer.js"></script>
```

Importing the package mounts one `<ia2-hare-viewer>` automatically:

- A document with no visible authored body content gets a full-height file
  browser.
- A document with authored content gets a sticky `Document / Files` header.
  The Files tab opens the browser over the document.

Semantic HTML representations are read directly from inert `<template>`
carriers and previewed in sandboxed frames. Exact-byte representations are
base64-decoded and checked against their declared byte length and SHA-256
digest before they can be previewed or downloaded.

The envelope's `hare:virtualBase` is the virtual URL of the host document.
Each template-backed representation receives its own virtual URL by resolving
its logical path against that base. Relative links navigate between bundled
representations, `/` returns to the host document, fragments scroll within the
selected document, and external links require an explicit user navigation.
Template scripts are removed from the derived preview document, network loads
are denied by CSP, and the frame sandbox does not grant script execution.

The viewer also materializes passive resources in template-backed documents.
Images, audio, video, tracks, SVG image/use references, `srcset`, stylesheets,
inline CSS, `url()`, and recursive `@import` resolve through the envelope's
virtual URL space. Each byte representation is verified once and exposed to the
derived document through a temporary Blob URL. Missing, external, incompatible,
cyclic, DOM-backed, and executable destinations remain inert and are reported
in the viewer. The original template and manifest are never rewritten.

Markdown byte representations use the package's dependency-free safe renderer.
It covers headings, emphasis, links, images, block quotes, ordered and unordered
lists, task items, tables, thematic breaks, and fenced or indented code. Raw HTML
is displayed as text rather than interpreted. Links route through the HARE
virtual address space, and images appear only after the referenced bundled byte
representation passes its media-type, length, and digest checks. This renderer
does not claim CommonMark conformance.

An authored host document can opt into the same verified lookup without putting
a non-retrievable virtual URL in a browser-fetching attribute:

```html
<img
  data-hare-src="https://example.hare.invalid/assets/mark.svg"
  alt="Bundled mark"
>
```

The viewer resolves `data-hare-src` against `hare:virtualBase`, verifies the
matching byte representation, and then supplies a temporary Blob URL as the
element's `src`. The inert attribute remains as inspectable source. This avoids
the failed network request that a literal `src` under `.invalid` would trigger
before the viewer runs.

## Manual API

```ts
import {
  mountHareViewer,
  materializeHareDomRepresentation,
  materializeHareHostSubresources,
  readHareEnvelope,
  renderSafeMarkdown,
  verifyHareRepresentation,
} from "@ia2-dev/hare-viewer";

window.__IA2_HARE_VIEWER_NO_AUTO__ = true;

const viewer = mountHareViewer({ mode: "tabs" });
const envelope = readHareEnvelope();
const representation = envelope.representations[0];
if (representation?.kind === "bytes") {
  const verified = await verifyHareRepresentation(representation);
}
```

`renderSafeMarkdown()` is also exported for consumer-owned views. Its optional
link and image resolvers let the embedding consumer decide which destinations
are navigable or materializable; unresolved images remain inert.

Supported modes are `auto`, `full`, and `tabs`. The custom element also accepts
a `mode` attribute.

## Single-file use

A conforming self-viewing HARE artifact embeds its runtime. Treat this package
as build-time source and inline its bundled output into the HTML file. A CDN or
external module URL is useful for development, but makes the resulting
artifact network-dependent and therefore not self-contained.

## Security boundary

The viewer renders text as text, creates byte previews only after verification,
and places HTML representations in a sandboxed iframe without script
permission. It grants same-origin access only so consumer-owned routing code can
inspect link activations; it strips representation scripts and applies a
deny-by-default CSP before loading the derived preview document.
