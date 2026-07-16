export { extractDataset } from "./extract.js";
export { Ia2RdfNavigator } from "./navigator.js";
export { serializeJsonLd, serializeTurtle, termToTurtle } from "./serialize.js";
export type * from "./model.js";

import { Ia2RdfNavigator } from "./navigator.js";

declare global {
  interface Window {
    __IA2_RDF_NAVIGATOR_NO_AUTO__?: boolean;
  }

  interface HTMLElementTagNameMap {
    "ia2-rdf-navigator": Ia2RdfNavigator;
  }
}

if (!customElements.get("ia2-rdf-navigator")) {
  customElements.define("ia2-rdf-navigator", Ia2RdfNavigator);
}

/** Add one RDF Navigator to a document, returning the existing instance when present. */
export function mountRdfNavigator(target: Document = document): Ia2RdfNavigator {
  const existing = target.querySelector<Ia2RdfNavigator>("ia2-rdf-navigator");
  if (existing) return existing;
  const navigator = target.createElement("ia2-rdf-navigator");
  target.body.append(navigator);
  return navigator;
}

function autoMount(): void {
  if (window.__IA2_RDF_NAVIGATOR_NO_AUTO__) return;
  mountRdfNavigator();
}

if (typeof window !== "undefined" && typeof document !== "undefined") {
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", autoMount, { once: true });
  else autoMount();
}
