import { extractDataset } from "../../html-rdf-navigator/src/extract.ts";
import { toPortableExtractionResult } from "../../html-rdf-navigator/src/sources.ts";

const COLLECTOR = Symbol.for("ia2.navigator.extension.frame-collector");
const extensionApi = globalThis.browser ?? globalThis.chrome;

function documentOrigin() {
  if (globalThis.origin && globalThis.origin !== "null") return globalThis.origin;
  try {
    const origin = new URL(document.URL).origin;
    return origin === "null" ? "Opaque origin" : origin;
  } catch {
    return "Opaque origin";
  }
}

function report() {
  const result = extractDataset(document);
  try {
    void extensionApi.runtime.sendMessage({
      source: {
        access: "portable",
        label: document.title.trim() || "Embedded document",
        origin: documentOrigin(),
        result: toPortableExtractionResult(result),
        url: document.URL,
      },
      type: "ia2:frame-source",
    });
  } catch {
    // A navigation can invalidate the isolated extension context mid-report.
  }
}

if (globalThis !== globalThis.top && !globalThis[COLLECTOR] && extensionApi?.runtime?.sendMessage) {
  let pending = 0;
  const schedule = () => {
    globalThis.clearTimeout(pending);
    pending = globalThis.setTimeout(report, 40);
  };
  const observer = new MutationObserver(schedule);
  observer.observe(document, {
    attributeFilter: [
      "about", "content", "datatype", "href", "lang", "property", "rdf-canonical", "rdf-datatype",
      "rdf-direction", "rdf-graph", "rdf-key", "rdf-language", "rdf-object", "rdf-predicate", "rdf-subject",
      "rdf-version", "rel", "resource", "src", "typeof", "vocab", "xml:lang",
    ],
    attributes: true,
    characterData: true,
    childList: true,
    subtree: true,
  });
  globalThis[COLLECTOR] = observer;
  extensionApi.runtime.onMessage?.addListener((message) => {
    if (message?.type === "ia2:collect-frame-source") report();
  });
  report();
}
