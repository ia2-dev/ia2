export const EXTENSION_TAG = "ia2-extension-navigator";
export const EXTENSION_HARE_TAG = "ia2-extension-hare-viewer";
export const PAGE_HARE_TAG = "ia2-hare-viewer";

const HARE = "https://ia2.dev/spec/resource-envelope#";
const RDF_TYPE = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type";

function resolveAttribute(element, name, base) {
  try {
    return new URL(element.getAttribute(name) || "", base).href;
  } catch {
    return "";
  }
}

export function declaresHareEnvelope() {
  const canonical = document.querySelector('link[rel="canonical"][href]')?.href || document.URL.replace(/#.*$/, "");
  const semanticBase = document.querySelector("base[href]")?.href || canonical;
  return Array.from(document.querySelectorAll("[rdf-predicate][href]")).some((element) => (
    resolveAttribute(element, "rdf-subject", semanticBase) === canonical
    && resolveAttribute(element, "rdf-predicate", semanticBase) === RDF_TYPE
    && resolveAttribute(element, "href", semanticBase) === `${HARE}Envelope`
  ));
}

export async function ensureNavigator() {
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
  return navigator;
}

export async function ensureHareViewer() {
  if (!declaresHareEnvelope()) return null;
  const pageViewer = document.querySelector(`${PAGE_HARE_TAG}, ${EXTENSION_HARE_TAG}`);
  if (pageViewer) return pageViewer;

  const { HareViewerElement } = await import("../../hare-viewer/src/viewer.ts");
  if (!customElements.get(EXTENSION_HARE_TAG)) {
    customElements.define(EXTENSION_HARE_TAG, class Ia2ExtensionHareViewer extends HareViewerElement {});
  }
  const viewer = document.createElement(EXTENSION_HARE_TAG);
  viewer.setAttribute("data-ia2-extension", "");
  viewer.setAttribute("mode", "auto");
  document.body.prepend(viewer);
  return viewer;
}
