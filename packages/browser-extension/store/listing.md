# IA² Navigator Chrome Web Store listing

## Product details

### Name

IA² Navigator

### Summary

Inspect HTML/RDF datasets and browse verified files in HARE resource envelopes.

### Category

Developer Tools

### Language

English

### Detailed description

Inspect the structured meaning carried directly by an HTML document.

IA² Navigator reads HTML/RDF in the current page and presents its statements,
named graphs, vocabularies, and exact source carriers. Select the toolbar action
on any supported page to open the Navigator and follow meaning back to the
visible document.

HARE resource envelopes open into a verified file workspace. The extension
derives the inventory from the envelope manifest, verifies byte length and
SHA-256 integrity before preview or download, and keeps HTML previews
sandboxed.

To recognize HARE envelopes automatically, the extension reads the top-level
HTML and URL of every eligible page locally. On an ordinary page it adds no
automatic interface. It does not transmit inspected page content, URLs,
browsing history, or usage analytics to IA² or Inferal.

Features:

* Inspect RDF statements and named graphs extracted from HTML.
* Search terms and filter by vocabulary namespace.
* Reveal the HTML element that carries a selected statement.
* Follow advertised RDF sources only when you choose to retrieve them.
* Browse and verify resources embedded in HARE envelopes.
* Observe semantic DOM changes while the Navigator is open.

IA² Navigator is open source and implements the exploratory IA² HTML/RDF and
HARE proposals. These proposals are not established standards.

## URLs

* Homepage: https://ia2.dev/
* Support: https://github.com/ia2-dev/ia2/issues
* Privacy policy: https://ia2.dev/privacy/
* Source: https://github.com/ia2-dev/ia2/tree/main/packages/browser-extension

## Privacy practices

### Single purpose

Inspect HTML/RDF carried by the current document and browse verified resources
declared by HARE envelopes.

### activeTab justification

When a person selects the extension toolbar action, `activeTab` grants
temporary access to the current page so the bundled Navigator can inspect its
HTML/RDF. The extension does not use this permission for background browsing or
unrelated pages.

### scripting justification

`scripting` injects the extension's packaged Navigator and status bridge into
the active tab after the person selects the toolbar action. No remote code is
downloaded or executed.

### Broad content-script access justification

The extension runs small packaged content scripts on eligible web pages to
recognize HARE envelope declarations locally and provide the automatic verified
file view that is central to the product. On a non-HARE page the automatic
script adds no interface. A separate isolated script reports only the displayed
RDF statement and HARE file counts to the extension service worker. Page
content, URLs, and browsing history are not sent to IA², Inferal, or another
developer-operated service.

### Remote code

No. All executable code is included in the extension package.

### Data handling disclosure

The extension handles website content and web browsing activity locally to
provide its visible inspection and file-browsing features. This includes the
current page URL, top-level DOM, extracted HTML/RDF statements, HARE manifest,
and embedded resources. It does not transmit this information to IA² or
Inferal.

When the person explicitly retrieves an advertised RDF source or opens a
remote definition preview, the browser requests that published resource
directly from its host. The response remains in the page context and is not
sent to IA² or Inferal.

The extension stores only its drawer position, size, and docking preference in
the current website's session storage. It does not persist extracted content.

### Limited Use certifications

* Data is used only to provide the extension's single purpose.
* Data is not sold or transferred to third parties.
* Data is not used or transferred for purposes unrelated to the extension.
* Data is not used or transferred to determine creditworthiness or for lending.

## Distribution

* Visibility: Public
* Regions: All regions supported by the Chrome Web Store
* Pricing: Free
* Publish timing: Defer publication after review when the dashboard offers the
  option, so the approved listing can receive a final check before launch.
