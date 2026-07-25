export { Ia2RdfValueEditor } from "./rdf-value-editor.js";
export type {
  CompletionArtifact,
  RdfValueEditorPosition,
  RdfValueEditorSyncMode,
  RdfValueEditorValidationIssue,
  RdfValueEditorValidationResult,
  CompletionFormat,
  CompletionLoadOptions,
  CompletionLoadResult,
} from "./rdf-value-editor.js";

import { Ia2RdfValueEditor } from "./rdf-value-editor.js";

declare global {
  interface HTMLElementTagNameMap {
    "ia2-rdf-value-editor": Ia2RdfValueEditor;
  }
}

if (!customElements.get("ia2-rdf-value-editor")) {
  customElements.define("ia2-rdf-value-editor", Ia2RdfValueEditor);
}
