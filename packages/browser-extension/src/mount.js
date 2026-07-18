export const EXTENSION_TAG = "ia2-extension-navigator";
export const PAGE_TAG = "ia2-rdf-navigator";
export const EXTENSION_HARE_TAG = "ia2-extension-hare-viewer";
export const PAGE_HARE_TAG = "ia2-hare-viewer";
const SOURCE_BRIDGE = Symbol.for("ia2.navigator.extension.source-bridge");
const SOURCE_STATE = Symbol.for("ia2.navigator.extension.source-state");
const sourceState = globalThis[SOURCE_STATE] ??= { sources: [] };

function receiveSources(event) {
  if (event.source !== globalThis || event.data?.type !== "ia2:navigator-sources" || !Array.isArray(event.data.sources)) return;
  sourceState.sources = event.data.sources;
  const navigator = document.querySelector(PAGE_TAG) ?? document.querySelector(EXTENSION_TAG);
  navigator?.setSources?.(sourceState.sources);
}

if (!globalThis[SOURCE_BRIDGE]) {
  globalThis.addEventListener("message", receiveSources);
  globalThis[SOURCE_BRIDGE] = true;
}

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
  // A page-provided Navigator is the canonical instance when one is present.
  // Reusing it keeps the extension toolbar and the page launcher synchronized.
  let navigator = document.querySelector(PAGE_TAG) ?? document.querySelector(EXTENSION_TAG);
  if (!navigator) {
    if (!customElements.get(EXTENSION_TAG)) {
      customElements.define(EXTENSION_TAG, class Ia2ExtensionNavigator extends Ia2RdfNavigator {});
    }
    navigator = document.createElement(EXTENSION_TAG);
    navigator.setAttribute("data-ia2-extension", "");
    document.body.append(navigator);
  }
  navigator.setSources?.(sourceState.sources);
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

function rdfSourceKind() {
  const type = (document.contentType || "").split(";", 1)[0].toLowerCase();
  const path = location.pathname.toLowerCase();
  if (type === "application/trig" || type === "application/x-trig" || path.endsWith(".trig")) return "application/trig";
  if (type === "text/turtle" || type === "application/x-turtle" || path.endsWith(".ttl")) return "text/turtle";
  return "";
}

function rdfSourceText() {
  if (document.contentType === "text/html") {
    const children = Array.from(document.body?.children ?? []);
    if (children.length !== 1 || children[0].localName !== "pre") return "";
    return children[0].textContent || "";
  }
  return document.body?.textContent || document.documentElement?.textContent || "";
}

export async function renderRdfHtmlSourcePage() {
  const contentType = rdfSourceKind();
  if (!contentType) return false;
  const source = rdfSourceText();
  if (!source.trim()) return false;
  const { renderRdfHtmlPage } = await import("../../rdf-html/src/index.ts");
  const html = renderRdfHtmlPage(source, {
    contentType,
    sourceUrl: location.href,
  });
  document.open();
  document.write(html);
  document.close();
  return true;
}
