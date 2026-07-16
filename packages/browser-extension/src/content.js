const EXTENSION_TAG = "ia2-extension-navigator";

// The extension owns mounting, so importing the browser bundle must not also
// create the page-embed form of the Navigator.
globalThis.__IA2_RDF_NAVIGATOR_NO_AUTO__ = true;

async function toggleNavigator() {
  const { Ia2RdfNavigator } = await import("../../html-rdf-navigator/src/index.ts");
  let navigator = document.querySelector(EXTENSION_TAG);
  if (!navigator) {
    if (!customElements.get(EXTENSION_TAG)) {
      customElements.define(EXTENSION_TAG, class Ia2ExtensionNavigator extends Ia2RdfNavigator {});
    }
    navigator = document.createElement(EXTENSION_TAG);
    navigator.setAttribute("data-ia2-extension", "");
    document.body.append(navigator);
  }
  navigator.toggle();
}

function run() {
  void toggleNavigator().catch((error) => {
    console.error("IA² Navigator could not start.", error);
  });
}

if (document.body) run();
else document.addEventListener("DOMContentLoaded", run, { once: true });
