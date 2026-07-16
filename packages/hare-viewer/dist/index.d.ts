export { HARE, getHareDomCarrier, readHareEnvelope, verifyHareRepresentation, type HareByteRepresentation, type HareDomRepresentation, type HareEnvelope, type HareRepresentation, type VerifiedHareRepresentation, } from "./model.js";
export { HareViewerElement, type HareViewerMode } from "./viewer.js";
export { hareRepresentationUrl, resolveHareNavigation, type HareNavigationTarget, } from "./navigation.js";
export { materializeHareDomRepresentation, materializeHareHostSubresources, type HareHostMaterializationResult, type HareMaterializationIssue, type HareMaterializationOptions, type HareMaterializationResult, } from "./materialize.js";
export { renderSafeMarkdown, type SafeMarkdownOptions, type SafeMarkdownReference, } from "./markdown.js";
import { HareViewerElement, type HareViewerMode } from "./viewer.js";
declare global {
    interface Window {
        __IA2_HARE_VIEWER_NO_AUTO__?: boolean;
    }
    interface HTMLElementTagNameMap {
        "ia2-hare-viewer": HareViewerElement;
    }
}
export interface MountHareViewerOptions {
    document?: Document;
    mode?: HareViewerMode;
}
/** Mount one HARE viewer, returning the existing instance when present. */
export declare function mountHareViewer(options?: MountHareViewerOptions): HareViewerElement;
