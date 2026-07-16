# IA² Navigator browser extension

This private workspace package adapts the existing IA² HTML/RDF Navigator for
Chrome, Firefox, and Safari. Selecting the extension toolbar action injects one
extension-owned Navigator into the current top-level HTML document and toggles
its drawer.

## Permission model

The extension requests only `activeTab` and `scripting`. It receives temporary
access to a page when a person explicitly selects its toolbar action. It does
not request persistent host permissions, run on every page, add detached RDF,
or route discovery retrieval through a privileged background process.
The Firefox target explicitly declares that it collects and transmits no data.

The action script runs in the page's main JavaScript world because the
Navigator is a custom element. It uses no extension APIs there and carries no
extension secrets, but page scripts can observe or interfere with its runtime.

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
reloads remove the injected component; selecting the toolbar action adds it
again. Shadow roots, embedded documents, templates, PDF viewers, and browser UI
remain outside the observed document.
