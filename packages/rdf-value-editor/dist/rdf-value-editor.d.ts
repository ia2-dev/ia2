import type { ExtractionRoot } from "@ia2-dev/html-rdf";
import { type ScrollSyncMode, type WindowPosition } from "@ia2-dev/ui-primitives";
import { type CompletionFormat } from "./completion.js";
export type RdfValueEditorPosition = WindowPosition;
export type RdfValueEditorSyncMode = ScrollSyncMode;
export type { CompletionFormat };
export type CompletionArtifact = "completed" | "values";
export interface RdfValueEditorValidationIssue {
    bindingKey: string;
    focusNode: string;
    label: string;
    messages: string[];
    path: string;
    shape: string;
}
export interface RdfValueEditorValidationResult {
    conforms: boolean;
    issues: RdfValueEditorValidationIssue[];
    resultCount: number;
}
export interface CompletionLoadOptions {
    baseIri?: string;
    contentType?: string;
    filename?: string;
}
export interface CompletionLoadResult {
    applied: number;
    issues: string[];
    sourceDocumentIris: string[];
}
/**
 * A generic SHACL-driven editor for HTML/RDF documents.
 *
 * The component discovers authorable PropertyShape resources from Web
 * Annotations in the extracted RDF dataset. SHACL supplies the data and
 * validation contract, while Web Annotation correlates shapes, visible
 * targets, contextual fields, and alternative document fragments.
 */
export declare class Ia2RdfValueEditor extends HTMLElement {
    #private;
    get sourceRoot(): ExtractionRoot | null;
    set sourceRoot(root: ExtractionRoot | null);
    get modelIssues(): readonly string[];
    connectedCallback(): void;
    disconnectedCallback(): void;
    refresh(): void;
    open(): void;
    close(): void;
    setPosition(position: RdfValueEditorPosition): boolean;
    setSyncMode(mode: RdfValueEditorSyncMode): boolean;
    validate(): Promise<RdfValueEditorValidationResult>;
    exportCompletion(format: CompletionFormat): string;
    exportCompletedDocument(): string;
    saveArtifact(artifact: "completed"): string;
    saveArtifact(artifact: "values", format?: CompletionFormat): string;
    loadCompletionFile(file: File): Promise<CompletionLoadResult>;
    loadCompletion(source: string, options?: CompletionLoadOptions): Promise<CompletionLoadResult>;
}
