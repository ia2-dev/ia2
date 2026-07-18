import type { RdfHtmlWorkspaceOptions } from "./model.js";
/** Render browser-opened RDF as an active HTML page. A single document is returned directly. */
export declare function renderRdfHtmlPage(source: string, options: RdfHtmlWorkspaceOptions): string;
export declare function renderRdfHtmlWorkspace(source: string, options: RdfHtmlWorkspaceOptions): string;
