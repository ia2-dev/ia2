# IA² Navigator browser extension

This private workspace package adapts the existing IA² HTML/RDF Navigator for
Chrome, Firefox, and Safari. HARE resource envelopes are enhanced
automatically. An authored envelope receives the same Document and Files
header as `@ia2-dev/hare-viewer`; a bare envelope opens directly into its
verified file browser. Selecting the extension toolbar action still opens the
Navigator on every supported document, including HARE. Document and Files
navigation remains exclusively in the HARE header.

## HARE file view

The automatic enhancer recognizes the HARE `Envelope` declaration in the
document's HTML/RDF and, when needed, mounts its own
`ia2-extension-hare-viewer` in automatic mode. It does not require or execute a
viewer runtime supplied by the envelope. If the page already has an
`ia2-hare-viewer`, the extension leaves that viewer in place instead of adding
a duplicate.

The extension decodes and verifies each representation before preview or
download. HTML previews use a sandbox without scripts. On an authored
envelope, selecting **Document** or pressing Escape closes the file workspace
while preserving the header. A bare envelope remains a full file browser
because it has no authored document view to restore.

## Permission model

The extension declares automatic content scripts for `<all_urls>` so it can
recognize HARE without a toolbar click. This produces the browser's broad page
access warning. Detection is local and deterministic: on a non-HARE document
the automatic script adds no UI, and the extension does not transmit page data
or route retrieval through a privileged background process. Access to local
`file:` documents remains subject to the browser's separate extension setting.
The Firefox target explicitly declares that it collects and transmits no data.

`activeTab` and `scripting` remain scoped to the toolbar action. They let a
person open the Navigator on any supported document without making that drawer
appear automatically on every page.

After a document is inspected, the action icon becomes gray when the Navigator
finds no HTML/RDF statements. When statements are present, the icon returns to
the IA² colors and its native browser badge shows the statement count, capped
at `999+`. The tooltip retains the exact count. HARE documents are inspected
automatically; ordinary documents are inspected after the toolbar action. The
state follows live semantic DOM changes while the Navigator is mounted.

For HARE, the tooltip identifies the HARE context and reports both the resource
file count and RDF statement count while still describing the action as opening
the Navigator. The badge continues to show the RDF statement count so its
meaning remains stable across document types.

The automatic HARE enhancer and toolbar action run in the page's main
JavaScript world because they mount custom elements. They use no extension APIs
there and carry no extension secrets, but page scripts can observe or interfere
with their runtime.

Browser-internal pages, extension stores, built-in document viewers, and other
protected surfaces do not permit injection. The toolbar action shows an
exclamation badge when the browser rejects a page.

## Build and test

From the repository root:

```sh
npm install
npm --prefix packages/browser-extension test
npm --prefix packages/browser-extension run package
```

`build` creates unpacked targets in `dist/chrome`, `dist/firefox`, and
`dist/safari`. `package` creates Chrome and Firefox ZIP archives in `artifacts`.
Firefox signing through addons.mozilla.org and Chrome Web Store publication are
separate release operations.

After the repository production build, `npm --prefix packages/browser-extension
run store:assets` uses the loopback-only AE2E target to capture the current 1280
by 800 Chrome Web Store screenshots and render the 440 by 280 promotional tile
in `store/assets`. The screenshots use the production bundles; only their local
fixture access differs from the uploaded manifest.

`npm run test:ae2e` at the repository root reuses one Navigator contract across
embedded Chromium, Firefox, and WebKit and the three corresponding extension
engines. Its separate `dist-e2e` build grants only the local fixture origin.
Chrome exercises the production scripting entry point; Firefox and Safari use
a main-world fixture content script for unattended startup. This does not alter
the production manifests or permission model.

## Local installation

- Chrome: enable Developer mode at `chrome://extensions`, choose **Load
  unpacked**, and select `dist/chrome`.
- Firefox: open `about:debugging#/runtime/this-firefox`, choose **Load Temporary
  Add-on**, and select `dist/firefox/manifest.json`.
- Safari: run `npm --prefix packages/browser-extension run package:safari`.
  The Safari packager creates an Xcode app project under `artifacts/safari` for
  local signing, testing, and eventual App Store distribution.

The Safari project is generated rather than authored. Make cross-browser
changes in this package's shared sources and regenerate the project.

## Scope

The adapter intentionally preserves the Navigator's current extraction and
network boundaries. It reads the top-level document light tree, observes live
semantic DOM changes, and leaves cross-origin discovery subject to CORS. Page
reloads automatically restore HARE enhancement; ordinary Navigator drawers
remain toolbar-initiated. Shadow roots, embedded documents, templates, PDF
viewers, and browser UI remain outside the observed document.
