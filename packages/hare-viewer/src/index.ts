export {
  HARE,
  getHareDomCarrier,
  readHareEnvelope,
  verifyHareRepresentation,
  type HareByteRepresentation,
  type HareDomRepresentation,
  type HareEnvelope,
  type HareRepresentation,
  type VerifiedHareRepresentation,
} from "./model.js";
export { HareViewerElement, type HareViewerMode } from "./viewer.js";
export {
  hareRepresentationUrl,
  resolveHareNavigation,
  type HareNavigationTarget,
} from "./navigation.js";
export {
  materializeHareDomRepresentation,
  materializeHareHostSubresources,
  type HareHostMaterializationResult,
  type HareMaterializationIssue,
  type HareMaterializationOptions,
  type HareMaterializationResult,
} from "./materialize.js";
export {
  renderSafeMarkdown,
  type SafeMarkdownOptions,
  type SafeMarkdownReference,
} from "./markdown.js";

import { HareViewerElement, type HareViewerMode } from "./viewer.js";

declare global {
  interface Window {
    __IA2_HARE_VIEWER_NO_AUTO__?: boolean;
  }

  interface HTMLElementTagNameMap {
    "ia2-hare-viewer": HareViewerElement;
  }
}

if (!customElements.get("ia2-hare-viewer")) {
  customElements.define("ia2-hare-viewer", HareViewerElement);
}

export interface MountHareViewerOptions {
  document?: Document;
  mode?: HareViewerMode;
}

/** Mount one HARE viewer, returning the existing instance when present. */
export function mountHareViewer(options: MountHareViewerOptions = {}): HareViewerElement {
  const target = options.document ?? document;
  const existing = target.querySelector<HareViewerElement>("ia2-hare-viewer");
  if (existing) return existing;
  const viewer = target.createElement("ia2-hare-viewer");
  if (options.mode) viewer.setAttribute("mode", options.mode);
  target.body.prepend(viewer);
  return viewer;
}

function autoMount(): void {
  if (window.__IA2_HARE_VIEWER_NO_AUTO__) return;
  mountHareViewer();
}

if (typeof window !== "undefined" && typeof document !== "undefined") {
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", autoMount, { once: true });
  else autoMount();
}
