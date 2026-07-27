import {
  HTML_RDF_DATASET_CHANGE_EVENT,
  annotationTargetIrisForAnnotation,
  extractDataset,
  labelFor,
} from "@ia2-dev/html-rdf";
import type { ExtractionRoot, Literal, NamedNode, ObjectTerm, Quad } from "@ia2-dev/html-rdf";
import {
  IA2_WINDOW_ACTIVATE_EVENT,
  WINDOW_PLACEMENT_CSS,
  WINDOW_POSITIONS,
  activateWindow,
  bindScrollSyncControls,
  bindWindowPositionControls,
  isScrollSyncMode,
  isWindowPosition,
  parseWindowPositions,
  positionControlsMarkup,
  scrollSyncControlsMarkup,
  startFloatingWindowDrag,
  startWindowResize,
  updateScrollSyncControls,
  updateWindowPositionControls,
  windowResizeHandlesMarkup,
  type CoordinatedWindow,
  type ScrollSyncMode,
  type WindowActivationDetail,
  type WindowResizeDirection,
  type WindowPosition,
} from "@ia2-dev/ui-primitives";
import {
  parseCompletionDocument,
  serializeCompletionDocument,
  type CompletionDocument,
  type CompletionFormat,
  type CompletionRecord,
} from "./completion.js";
import {
  validateShaclAuthoringState,
  type ShaclAuthoringBinding,
} from "./shacl-validation.js";

const RDF_TYPE = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type";
const RDF_FIRST = "http://www.w3.org/1999/02/22-rdf-syntax-ns#first";
const RDF_REST = "http://www.w3.org/1999/02/22-rdf-syntax-ns#rest";
const RDF_NIL = "http://www.w3.org/1999/02/22-rdf-syntax-ns#nil";
const RDFS_LABEL = "http://www.w3.org/2000/01/rdf-schema#label";
const SKOS_PREF_LABEL = "http://www.w3.org/2004/02/skos/core#prefLabel";
const SH = "http://www.w3.org/ns/shacl#";
const SCHEMA = "https://schema.org/";
const OA = "http://www.w3.org/ns/oa#";
const AS = "http://www.w3.org/ns/activitystreams#";
const XSD = "http://www.w3.org/2001/XMLSchema#";

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

function serializeDoctype(doctype: DocumentType | null): string {
  if (!doctype) return "";
  let value = `<!DOCTYPE ${doctype.name}`;
  if (doctype.publicId) value += ` PUBLIC "${doctype.publicId}"`;
  if (doctype.systemId) value += `${doctype.publicId ? "" : " SYSTEM"} "${doctype.systemId}"`;
  return `${value}>\n`;
}

type AuthorValue = NamedNode | Literal;

interface AuthorOption {
  alternatives: RenderingAlternative[];
  key: string;
  label: string;
  term: AuthorValue;
}

interface Binding {
  key: string;
  shape: string;
  scopes: string[];
  subject: string;
  path: string;
  label: string;
  groupKey: string;
  groupLabel: string;
  groupOrder: number;
  order: number;
  placeholders: HTMLElement[];
  options: AuthorOption[];
  datatype?: string;
  defaultValue?: string;
  pattern?: string;
  minLength?: number;
  maxLength?: number;
  required: boolean;
  valueKind: "Literal" | "NamedNode";
  value: string;
  touched: boolean;
  error: string;
}

interface RenderingAlternative {
  resource: string;
  target: HTMLElement;
  template: HTMLTemplateElement;
}

interface BacklinkState {
  ariaLabel: string | null;
  binding: Binding;
  pointerdown: (event: PointerEvent) => void;
  keydown: (event: KeyboardEvent) => void;
  placeholder: HTMLElement;
  role: string | null;
  tabIndex: string | null;
  title: string | null;
  click: (event: MouseEvent) => void;
}

interface RenderingTargetState {
  childNodes: Node[];
  hidden: boolean;
}

function termValue(term: ObjectTerm | undefined): string | undefined {
  if (!term || term.termType === "Triple") return undefined;
  return term.value;
}

function authorValue(term: ObjectTerm | undefined): AuthorValue | undefined {
  return term?.termType === "NamedNode" || term?.termType === "Literal" ? term : undefined;
}

function valueKey(term: AuthorValue): string {
  return term.termType === "NamedNode"
    ? term.value
    : `literal:${term.datatype.value}:${term.language}:${term.direction ?? ""}:${term.value}`;
}

function completionValueKey(object: {
  datatype?: string;
  termType: "Literal" | "NamedNode";
  value: string;
}): string {
  return object.termType === "NamedNode"
    ? valueKey({ termType: "NamedNode", value: object.value })
    : valueKey({
        termType: "Literal",
        value: object.value,
        datatype: { termType: "NamedNode", value: object.datatype ?? `${XSD}string` },
        language: "",
      });
}

function values(quads: readonly Quad[], subject: string, predicate: string): ObjectTerm[] {
  return quads.flatMap((quad) => (
    quad.subject.value === subject && quad.predicate.value === predicate ? [quad.object] : []
  ));
}

function firstValue(quads: readonly Quad[], subject: string, predicate: string): string | undefined {
  return termValue(values(quads, subject, predicate)[0]);
}

function namedValues(quads: readonly Quad[], subject: string, predicate: string): string[] {
  return values(quads, subject, predicate)
    .flatMap((term) => term.termType === "NamedNode" ? [term.value] : []);
}

function numberValue(quads: readonly Quad[], subject: string, predicate: string): number | undefined {
  const value = firstValue(quads, subject, predicate);
  if (value === undefined) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function resolveIri(reference: string, base: string): string {
  return new URL(reference, base).href;
}

function localName(iri: string): string {
  const name = iri.match(/[/#]([^/#]+)$/)?.[1] ?? iri;
  return decodeURIComponent(name)
    .replace(/[-_]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (character) => character.toUpperCase());
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function isDocumentRoot(root: ExtractionRoot): root is Document {
  return root.nodeType === 9;
}

function documentForRoot(root: ExtractionRoot): Document {
  return isDocumentRoot(root) ? root : root.ownerDocument;
}

function isHtmlElementNode(node: Element | null): node is HTMLElement {
  return node?.nodeType === 1;
}

function elementForIri(
  root: ExtractionRoot,
  iri: string,
  sourceDocumentIri: string,
): HTMLElement | undefined {
  const url = new URL(iri);
  if (!url.hash || url.href.slice(0, -url.hash.length) !== sourceDocumentIri) return undefined;
  const id = decodeURIComponent(url.hash.slice(1));
  if (isDocumentRoot(root)) return root.getElementById(id) ?? undefined;
  return Array.from(root.querySelectorAll<HTMLElement>("[id]"))
    .find((element) => element.id === id);
}

function replacementNodes(source: HTMLTemplateElement): Node[] {
  return Array.from(source.content.childNodes, (node) => node.cloneNode(true));
}

function groupInfo(
  quads: readonly Quad[],
  shape: string,
): { key: string; label: string; order: number } {
  const group = firstValue(quads, shape, `${SH}group`);
  if (!group) {
    return {
      key: "",
      label: "Values",
      order: Number.MAX_SAFE_INTEGER,
    };
  }
  return {
    key: group,
    label: firstValue(quads, group, `${SH}name`)
      ?? firstValue(quads, group, RDFS_LABEL)
      ?? localName(group),
    order: numberValue(quads, group, `${SH}order`) ?? Number.MAX_SAFE_INTEGER,
  };
}

function listValues(quads: readonly Quad[], head: ObjectTerm | undefined): ObjectTerm[] {
  if (!head || head.termType === "Triple") return [];
  const result: ObjectTerm[] = [];
  const visited = new Set<string>();
  let node: ObjectTerm | undefined = head;
  while (node && node.termType !== "Triple" && node.value !== RDF_NIL && !visited.has(node.value)) {
    visited.add(node.value);
    const first = values(quads, node.value, RDF_FIRST)[0];
    if (!first) break;
    result.push(first);
    node = values(quads, node.value, RDF_REST)[0];
  }
  return result;
}

function isSafeReplacementTemplate(template: HTMLTemplateElement): boolean {
  const forbidden = [
    "script", "style", "iframe", "frame", "object", "embed", "applet", "base",
    "meta", "link", "img", "picture", "audio", "video", "source", "track",
    "form", "button", "input", "select", "textarea",
  ].join(", ");
  if (template.content.querySelector(forbidden)) return false;
  for (const element of template.content.querySelectorAll<Element>("*")) {
    if (element.localName.includes("-")) return false;
    for (const attribute of Array.from(element.attributes)) {
      if (/^on/i.test(attribute.name) || attribute.name === "srcdoc" || attribute.name === "style") {
        return false;
      }
      if (["src", "srcset", "poster", "data", "xlink:href"].includes(attribute.name)) return false;
      if (
        ["href", "cite"].includes(attribute.name)
        && /^\s*(?:javascript|data):/i.test(attribute.value)
      ) return false;
    }
  }
  return true;
}

function compareByDocumentPosition(left: Binding, right: Binding): number {
  if (left.groupKey !== right.groupKey) {
    if (left.groupOrder !== right.groupOrder) return left.groupOrder - right.groupOrder;
    const labelOrder = left.groupLabel.localeCompare(right.groupLabel);
    if (labelOrder !== 0) return labelOrder;
    return left.groupKey.localeCompare(right.groupKey);
  }
  if (left.order !== right.order) return left.order - right.order;
  const leftElement = left.placeholders[0];
  const rightElement = right.placeholders[0];
  if (!leftElement || !rightElement || leftElement === rightElement) return 0;
  const position = leftElement.compareDocumentPosition(rightElement);
  return position & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
}

function inputType(binding: Binding): string {
  if (binding.valueKind === "NamedNode") return "url";
  if (binding.datatype === `${XSD}date`) return "date";
  if (binding.datatype === `${XSD}integer`) return "number";
  if (binding.datatype === `${XSD}anyURI`) return "url";
  return "text";
}

function constraintSummary(binding: Binding): string {
  const parts: string[] = [];
  if (binding.required) parts.push("Required");
  if (binding.valueKind === "NamedNode") parts.push("IRI");
  if (binding.datatype === `${XSD}date`) parts.push("Date");
  if (binding.datatype === `${XSD}integer`) parts.push("Whole number");
  if (binding.pattern) parts.push(`Pattern: ${binding.pattern}`);
  if (binding.minLength !== undefined) parts.push(`At least ${binding.minLength} characters`);
  if (binding.maxLength !== undefined) parts.push(`At most ${binding.maxLength} characters`);
  if (binding.defaultValue !== undefined) parts.push(`Suggested: ${binding.defaultValue}`);
  return parts.join(" · ");
}

/**
 * A generic SHACL-driven editor for HTML/RDF documents.
 *
 * The component discovers authorable PropertyShape resources from Web
 * Annotations in the extracted RDF dataset. SHACL supplies the data and
 * validation contract, while Web Annotation correlates shapes, visible
 * targets, contextual fields, and alternative document fragments.
 */
export class Ia2RdfValueEditor extends HTMLElement {
  #bindings: Binding[] = [];
  #bindingControls = new Map<string, HTMLInputElement | HTMLSelectElement>();
  #bindingRows = new Map<string, HTMLElement>();
  #backlinkStates: BacklinkState[] = [];
  #backlinkStyles: HTMLStyleElement | null = null;
  #renderingTargetStates = new Map<HTMLElement, RenderingTargetState>();
  #originalText = new WeakMap<HTMLElement, string>();
  #runtimeData: HTMLElement | null = null;
  #launcher: HTMLButtonElement | null = null;
  #drawer: HTMLElement | null = null;
  #quickEditor: HTMLElement | null = null;
  #quickBody: HTMLElement | null = null;
  #quickBinding: Binding | null = null;
  #quickPlaceholder: HTMLElement | null = null;
  #quickRowParent: Node | null = null;
  #quickRowNextSibling: ChildNode | null = null;
  #quickPositionCleanup: (() => void) | null = null;
  #progress: HTMLElement | null = null;
  #controls: HTMLElement | null = null;
  #helpTrigger: HTMLButtonElement | null = null;
  #helpWindow: HTMLElement | null = null;
  #dataStatus: HTMLElement | null = null;
  #loadInput: HTMLInputElement | null = null;
  #sourceRoot: ExtractionRoot | null = null;
  #resolvedSourceRoot: ExtractionRoot | null = null;
  #sourceQuads: Quad[] = [];
  #sourceDocumentIri = "";
  #labelPredicates: string[] = [RDFS_LABEL, SKOS_PREF_LABEL, `${SCHEMA}name`];
  #position: RdfValueEditorPosition = "right";
  #allowedPositions: RdfValueEditorPosition[] = WINDOW_POSITIONS.map(({ position }) => position);
  #returnFocus: HTMLElement | null = null;
  #syncCleanup: (() => void) | null = null;
  #syncControlCleanup: (() => void) | null = null;
  #syncMode: RdfValueEditorSyncMode = "off";
  #directNavigationVersion = 0;
  #initialized = false;
  #modelIssues: string[] = [];
  #validationVersion = 0;
  #validatedVersion = 0;
  #validationPromise: Promise<RdfValueEditorValidationResult> = Promise.resolve({
    conforms: true,
    issues: [],
    resultCount: 0,
  });

  get sourceRoot(): ExtractionRoot | null {
    return this.#sourceRoot;
  }

  set sourceRoot(root: ExtractionRoot | null) {
    this.#sourceRoot = root;
    if (this.isConnected) this.refresh();
  }

  get modelIssues(): readonly string[] {
    return [...this.#modelIssues];
  }

  connectedCallback(): void {
    if (this.#initialized) return;
    this.#initialized = true;
    this.ownerDocument.addEventListener(IA2_WINDOW_ACTIVATE_EVENT, this.#onWindowActivate);
    queueMicrotask(() => this.#initialize());
  }

  disconnectedCallback(): void {
    this.ownerDocument.removeEventListener(IA2_WINDOW_ACTIVATE_EVENT, this.#onWindowActivate);
    this.#teardown();
    this.#initialized = false;
  }

  refresh(): void {
    if (!this.isConnected) return;
    this.#teardown();
    this.#initialize();
  }

  #panelLabel(): string {
    return this.getAttribute("label")?.trim() || "Complete document";
  }

  #teardown(): void {
    this.#directNavigationVersion += 1;
    this.#validationVersion += 1;
    this.#hideQuickEditor(false);
    this.#runtimeData?.remove();
    this.#runtimeData = null;
    this.#syncCleanup?.();
    this.#syncCleanup = null;
    this.#syncControlCleanup?.();
    this.#syncControlCleanup = null;
    this.#teardownBacklinks();
    for (const [target, state] of this.#renderingTargetStates) {
      target.hidden = state.hidden;
      target.replaceChildren(...state.childNodes);
      delete target.dataset.valueAlternative;
    }
    this.#renderingTargetStates.clear();
    for (const binding of this.#bindings) {
      for (const placeholder of binding.placeholders) {
        placeholder.textContent = this.#originalText.get(placeholder) ?? placeholder.textContent;
        delete placeholder.dataset.valuePlaceholder;
        delete placeholder.dataset.valueState;
      }
    }
    this.#bindings = [];
    this.#bindingControls.clear();
    this.#bindingRows.clear();
    this.#modelIssues = [];
    this.#sourceQuads = [];
    this.shadowRoot?.replaceChildren();
  }

  open(): void {
    this.#hideQuickEditor(false);
    this.#returnFocus = this.#launcher;
    this.#show();
    this.#drawer?.querySelector<HTMLElement>("input, select, button")?.focus();
  }

  #show(configureSync = true): void {
    if (this.#drawer) activateWindow(this.#coordinatedWindow(this.#drawer));
    this.#drawer?.setAttribute("data-open", "");
    this.#drawer?.removeAttribute("inert");
    this.#launcher?.setAttribute("aria-expanded", "true");
    if (configureSync) this.#configureSync();
  }

  close(): void {
    if (this.#quickEditor?.hasAttribute("data-open")) this.#hideQuickEditor(true);
    else this.#hide(true);
  }

  #hide(restoreFocus: boolean): void {
    this.#drawer?.removeAttribute("data-open");
    this.#drawer?.setAttribute("inert", "");
    this.#launcher?.setAttribute("aria-expanded", "false");
    this.#syncCleanup?.();
    this.#syncCleanup = null;
    if (restoreFocus) (this.#returnFocus ?? this.#launcher)?.focus();
    this.#returnFocus = null;
  }

  #onWindowActivate = (event: Event): void => {
    const detail = (event as CustomEvent<WindowActivationDetail>).detail;
    if (detail?.source === this || !this.#drawer?.hasAttribute("data-open")) return;
    detail.windows.push(this.#coordinatedWindow(this.#drawer));
  };

  #coordinatedWindow(drawer: HTMLElement): CoordinatedWindow {
    return {
      allowedPositions: this.#allowedPositions,
      close: () => this.#hide(false),
      position: this.#position,
      preferredPositions: ["right", "floating", "right-bottom", "right-top"],
      preferredWidth: 416,
      priority: 20,
      setPosition: (position) => {
        this.setPosition(position);
      },
      source: this,
      surface: drawer,
    };
  }

  setPosition(position: RdfValueEditorPosition): boolean {
    if (!this.#allowedPositions.includes(position)) return false;
    this.#position = position;
    this.setAttribute("position", position);
    if (this.#drawer) {
      this.#drawer.style.removeProperty("height");
      this.#drawer.style.removeProperty("left");
      this.#drawer.style.removeProperty("top");
      this.#drawer.style.removeProperty("width");
      delete this.#drawer.dataset.dragged;
      this.#drawer.dataset.position = position;
    }
    if (this.#launcher) this.#launcher.dataset.position = position;
    if (this.#drawer) updateWindowPositionControls(this.#drawer, position);
    return true;
  }

  setSyncMode(mode: RdfValueEditorSyncMode): boolean {
    if (!isScrollSyncMode(mode)) return false;
    this.#directNavigationVersion += 1;
    this.#syncMode = mode;
    this.setAttribute("sync", mode);
    if (this.shadowRoot) updateScrollSyncControls(this.shadowRoot, mode);
    this.#configureSync();
    return true;
  }

  validate(): Promise<RdfValueEditorValidationResult> {
    this.#validationPromise = this.#validateAndProject();
    return this.#validationPromise;
  }

  exportCompletion(format: CompletionFormat): string {
    if (this.#validatedVersion !== this.#validationVersion) {
      throw new Error("SHACL validation is still running. Await validate() before exporting.");
    }
    return serializeCompletionDocument(this.#completionDocument(), format);
  }

  exportCompletedDocument(): string {
    if (this.#validatedVersion !== this.#validationVersion) {
      throw new Error("SHACL validation is still running. Await validate() before exporting.");
    }
    const completed = this.#cloneSourceDocument();
    completed.querySelectorAll("ia2-rdf-value-editor").forEach((editor) => editor.remove());
    completed.querySelectorAll("[data-ia2-rdf-value-editor-backlinks]")
      .forEach((style) => style.remove());
    for (const binding of this.#bindings) {
      for (const placeholder of binding.placeholders) {
        if (!placeholder.id) continue;
        const completedPlaceholder = completed.getElementById(placeholder.id);
        if (!isHtmlElementNode(completedPlaceholder)) continue;
        delete completedPlaceholder.dataset.valuePlaceholder;
        delete completedPlaceholder.dataset.valueState;
        completedPlaceholder.dataset.ia2CompletedValue = "";
      }
    }
    for (const target of this.#renderingTargetStates.keys()) {
      if (!target.id) continue;
      const completedTarget = completed.getElementById(target.id);
      if (isHtmlElementNode(completedTarget)) {
        delete completedTarget.dataset.valueAlternative;
      }
    }
    for (const state of this.#backlinkStates) {
      if (!state.placeholder.id) continue;
      const placeholder = completed.getElementById(state.placeholder.id);
      if (!isHtmlElementNode(placeholder)) continue;
      delete placeholder.dataset.rdfValueEditorBacklink;
      delete placeholder.dataset.rdfValueEditorActiveBacklink;
      this.#restoreAttribute(placeholder, "role", state.role);
      this.#restoreAttribute(placeholder, "tabindex", state.tabIndex);
      this.#restoreAttribute(placeholder, "aria-label", state.ariaLabel);
      this.#restoreAttribute(placeholder, "title", state.title);
    }
    const presentation = completed.createElement("style");
    presentation.dataset.ia2CompletedValuePresentation = "";
    presentation.textContent = `
      [data-ia2-completed-value] {
        background: transparent !important;
        border-bottom-color: transparent !important;
        box-shadow: none !important;
        color: inherit !important;
        cursor: inherit !important;
        text-decoration: none !important;
      }
    `;
    completed.head.append(presentation);
    return `${serializeDoctype(completed.doctype)}${completed.documentElement.outerHTML}\n`;
  }

  #sourceDocument(): Document {
    return this.#resolvedSourceRoot
      ? documentForRoot(this.#resolvedSourceRoot)
      : this.ownerDocument;
  }

  #cloneSourceDocument(): Document {
    const root = this.#resolvedSourceRoot ?? this.ownerDocument;
    const sourceDocument = documentForRoot(root);
    if (isDocumentRoot(root) || root.nodeType === 1) {
      return sourceDocument.cloneNode(true) as Document;
    }

    const completed = sourceDocument.implementation.createHTMLDocument(sourceDocument.title);
    const rdfVersion = sourceDocument.documentElement.getAttribute("rdf-version");
    if (rdfVersion) completed.documentElement.setAttribute("rdf-version", rdfVersion);
    for (const node of sourceDocument.head.querySelectorAll("style, link[rel~=\"stylesheet\"]")) {
      completed.head.append(node.cloneNode(true));
    }
    const canonical = completed.createElement("link");
    canonical.rel = "canonical";
    canonical.href = this.#sourceDocumentIri;
    completed.head.append(canonical);
    for (const child of Array.from(root.childNodes)) {
      completed.body.append(completed.importNode(child, true));
    }
    return completed;
  }

  saveArtifact(artifact: "completed"): string;
  saveArtifact(artifact: "values", format?: CompletionFormat): string;
  saveArtifact(
    artifact: CompletionArtifact,
    format: CompletionFormat = "html",
  ): string {
    const source = artifact === "completed"
      ? this.exportCompletedDocument()
      : this.exportCompletion(format);
    const view = this.ownerDocument.defaultView;
    if (!view?.URL.createObjectURL) {
      throw new Error("This browser cannot create downloadable files.");
    }
    const stem = (() => {
      try {
        const pathname = new URL(this.#sourceDocumentIri).pathname;
        const filename = pathname.split("/").filter(Boolean).at(-1)?.replace(/\.[^.]+$/, "");
        if (filename) return filename;
      } catch {
        // Fall through to the document title.
      }
      return (this.#sourceDocument().title || "document")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") || "document";
    })();
    const extension = format === "html" ? "html" : "ttl";
    const filename = artifact === "completed"
      ? `${stem}.completed.html`
      : `${stem}.values.${extension}`;
    const contentType = artifact === "completed" || format === "html"
      ? "text/html"
      : "text/turtle";
    const blob = new view.Blob([source], { type: `${contentType};charset=utf-8` });
    const url = view.URL.createObjectURL(blob);
    const anchor = this.ownerDocument.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.hidden = true;
    this.ownerDocument.body.append(anchor);
    anchor.click();
    anchor.remove();
    view.setTimeout(() => view.URL.revokeObjectURL(url), 0);
    this.#setDataStatus(
      artifact === "completed"
        ? "Saved completed HTML/RDF document."
        : `Saved ${format === "html" ? "HTML/RDF" : "Turtle"} values document.`,
      "success",
    );
    return source;
  }

  async loadCompletionFile(file: File): Promise<CompletionLoadResult> {
    const source = await file.text();
    return this.loadCompletion(source, {
      baseIri: new URL(file.name, this.#sourceDocumentIri).href,
      ...(file.type ? { contentType: file.type } : {}),
      filename: file.name,
    });
  }

  loadCompletion(
    source: string,
    options: CompletionLoadOptions = {},
  ): Promise<CompletionLoadResult> {
    return this.#loadCompletion(source, options);
  }

  async #loadCompletion(
    source: string,
    options: CompletionLoadOptions,
  ): Promise<CompletionLoadResult> {
    const contentType = options.contentType || this.#contentTypeForFilename(options.filename);
    let parsed;
    try {
      parsed = await parseCompletionDocument(source, {
        baseIri: options.baseIri ?? this.#sourceDocumentIri,
        document: this.#sourceDocument(),
        ...(contentType ? { contentType } : {}),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      const result = { applied: 0, issues: [message], sourceDocumentIris: [] };
      this.#setDataStatus(`Could not load values: ${message}`, "error");
      return result;
    }

    const identityIssues = [...parsed.issues];
    if (parsed.sourceDocumentIris.length !== 1) {
      identityIssues.push("A completion document must identify exactly one source with prov:wasDerivedFrom.");
    } else if (parsed.sourceDocumentIris[0] !== this.#sourceDocumentIri) {
      identityIssues.push("These values were saved for a different source document.");
    }
    if (identityIssues.length > 0) {
      this.#setDataStatus(
        `Could not load values: ${identityIssues[0]}`,
        "error",
      );
      return {
        applied: 0,
        issues: identityIssues,
        sourceDocumentIris: parsed.sourceDocumentIris,
      };
    }

    const duplicateIssues = this.#bindings.flatMap((binding) => {
      const count = parsed.statements.filter(({ subject, predicate }) => (
        subject === binding.subject && predicate === binding.path
      )).length;
      return count > 1
        ? [`${binding.label} has ${count} values; this control requires at most one.`]
        : [];
    });
    if (duplicateIssues.length > 0) {
      this.#setDataStatus(`Could not load values: ${duplicateIssues[0]}`, "error");
      return {
        applied: 0,
        issues: duplicateIssues,
        sourceDocumentIris: parsed.sourceDocumentIris,
      };
    }

    this.#resetCompletion();
    const issues: string[] = [];

    const loaded = new Set<string>();
    const assigned = new Set<string>();
    const applyBinding = (binding: Binding): boolean => {
      if (loaded.has(binding.key) || !this.#isBindingActive(binding)) return false;
      const matches = parsed.statements.filter(({ subject, predicate }) => (
        subject === binding.subject && predicate === binding.path
      ));
      if (matches.length === 0) return false;
      const statement = matches[0]!;
      const control = this.#bindingControls.get(binding.key);
      if (!control) return false;

      if (binding.options.length > 0) {
        if (!(control instanceof HTMLSelectElement)) return false;
        const key = completionValueKey(statement.object);
        if (!binding.options.some((option) => option.key === key)) {
          issues.push(`${binding.label} has a value outside its sh:in list.`);
          loaded.add(binding.key);
          return false;
        }
        control.value = key;
      } else {
        if (!(control instanceof HTMLInputElement)) return false;
        if (statement.object.termType !== binding.valueKind) {
          issues.push(`${binding.label} requires an RDF ${binding.valueKind === "NamedNode" ? "IRI" : "literal"}.`);
          loaded.add(binding.key);
          return false;
        }
        if (
          statement.object.termType === "Literal"
          && binding.datatype
          && statement.object.datatype
          && statement.object.datatype !== binding.datatype
        ) {
          issues.push(`${binding.label} has datatype ${statement.object.datatype}; expected ${binding.datatype}.`);
          loaded.add(binding.key);
          return false;
        }
        control.value = statement.object.value;
      }

      binding.touched = true;
      binding.value = control.value;
      loaded.add(binding.key);
      assigned.add(binding.key);
      return true;
    };

    let changed = true;
    while (changed) {
      changed = false;
      for (const binding of this.#bindings) {
        if (binding.options.length > 0 && applyBinding(binding)) changed = true;
      }
    }
    for (const binding of this.#bindings) {
      if (binding.options.length === 0) applyBinding(binding);
    }
    await this.validate();
    for (const binding of this.#bindings) {
      if (assigned.has(binding.key) && binding.error) {
        issues.push(`${binding.label}: ${binding.error}`);
      }
    }
    const applied = this.#bindings.filter((binding) => (
      assigned.has(binding.key) && !binding.error
    )).length;

    this.#setDataStatus(
      issues.length > 0
        ? `Loaded ${applied} values with ${issues.length} ${issues.length === 1 ? "issue" : "issues"}.`
        : `Loaded ${applied} values.`,
      issues.length > 0 ? "warning" : "success",
    );
    return {
      applied,
      issues,
      sourceDocumentIris: parsed.sourceDocumentIris,
    };
  }

  #openHelp(): void {
    if (!this.#helpWindow) return;
    this.#helpWindow.dataset.open = "true";
    this.#helpWindow.removeAttribute("inert");
    this.#helpTrigger?.setAttribute("aria-expanded", "true");
    this.#helpWindow.querySelector<HTMLElement>(".help-close")?.focus();
  }

  #closeHelp(): void {
    if (!this.#helpWindow) return;
    this.#helpWindow.dataset.open = "false";
    this.#helpWindow.setAttribute("inert", "");
    this.#helpTrigger?.setAttribute("aria-expanded", "false");
    this.#helpTrigger?.focus();
  }

  #initialize(): void {
    this.#allowedPositions = parseWindowPositions(this.getAttribute("allowed-positions"));
    const requestedPosition = this.getAttribute("position");
    this.#position = isWindowPosition(requestedPosition)
      && this.#allowedPositions.includes(requestedPosition)
      ? requestedPosition
      : this.#allowedPositions[0]!;
    this.setAttribute("position", this.#position);
    const requestedSyncMode = this.getAttribute("sync");
    this.#syncMode = isScrollSyncMode(requestedSyncMode) ? requestedSyncMode : "off";
    this.setAttribute("sync", this.#syncMode);

    const declaredLabelPredicates = this.getAttribute("label-predicates")
      ?.split(/\s+/)
      .filter((value) => {
        try {
          return Boolean(new URL(value));
        } catch {
          return false;
        }
      });
    this.#labelPredicates = declaredLabelPredicates?.length
      ? Array.from(new Set(declaredLabelPredicates))
      : [RDFS_LABEL, SKOS_PREF_LABEL, `${SCHEMA}name`];

    const sourceSelector = this.getAttribute("source-root")?.trim();
    let selectedRoot: Element | null = null;
    let validSourceSelector = true;
    if (sourceSelector) {
      try {
        selectedRoot = this.ownerDocument.querySelector(sourceSelector);
      } catch {
        validSourceSelector = false;
        this.#modelIssues.push(`The source-root selector “${sourceSelector}” is not valid CSS.`);
      }
    }
    if (sourceSelector && validSourceSelector && !selectedRoot && !this.#sourceRoot) {
      this.#modelIssues.push(`The source-root selector “${sourceSelector}” did not match an element.`);
    }
    this.#resolvedSourceRoot = this.#sourceRoot ?? selectedRoot ?? this.ownerDocument;
    const result = extractDataset(this.#resolvedSourceRoot);
    this.#sourceQuads = [...result.quads];
    this.#sourceDocumentIri = result.sourceDocumentIri;
    const extractionErrors = result.diagnostics.filter(({ severity }) => severity === "error");
    this.#modelIssues.push(...extractionErrors.map(({ message }) => (
      `HTML/RDF extraction error: ${message}`
    )));

    this.#bindings = (extractionErrors.length > 0
      ? []
      : this.#authorableBindings(result.quads, result.sourceDocumentIri))
      .sort(compareByDocumentPosition);

    for (const binding of this.#bindings) {
      for (const placeholder of binding.placeholders) {
        this.#originalText.set(placeholder, placeholder.textContent ?? "");
        placeholder.dataset.valuePlaceholder = binding.key;
        placeholder.dataset.valueState = binding.options.length === 0 && binding.defaultValue !== undefined
          ? "default"
          : "empty";
      }
      if (binding.options.length > 0) {
        for (const option of binding.options) {
          for (const alternative of option.alternatives) {
            const existing = this.#renderingTargetStates.get(alternative.target);
            if (!existing) {
              this.#renderingTargetStates.set(alternative.target, {
                childNodes: Array.from(alternative.target.childNodes),
                hidden: alternative.target.hidden,
              });
            }
          }
        }
      }
    }

    const sourceDocument = this.#sourceDocument();
    this.#runtimeData = sourceDocument.createElement("div");
    this.#runtimeData.dataset.ia2RdfValueEditorRuntime = "";
    this.#runtimeData.hidden = true;
    this.#runtimeData.setAttribute("aria-hidden", "true");
    if (isDocumentRoot(this.#resolvedSourceRoot)) {
      this.#resolvedSourceRoot.body.append(this.#runtimeData);
    } else {
      this.#resolvedSourceRoot.append(this.#runtimeData);
    }

    this.#render();
    if (this.#modelIssues.length > 0) {
      this.#setDataStatus(
        `${this.#modelIssues.length} authoring model ${this.#modelIssues.length === 1 ? "issue" : "issues"}; unsafe or ambiguous alternatives were ignored.`,
        "warning",
      );
    }
    this.dispatchEvent(new CustomEvent("ia2-rdf-value-editor-model", {
      bubbles: true,
      composed: true,
      detail: {
        bindings: this.#bindings.length,
        issues: [...this.#modelIssues],
        sourceDocumentIri: this.#sourceDocumentIri,
      },
    }));
    if (this.hasAttribute("backlinks")) this.#setupBacklinks();
    this.#updateActiveBindings();
    this.#updateProgress();
    this.#validationPromise = this.#validateAndProject();
  }

  #setupBacklinks(): void {
    const sourceDocument = this.#sourceDocument();
    if (this.getAttribute("backlink-styling") !== "host") {
      this.#backlinkStyles = sourceDocument.createElement("style");
      this.#backlinkStyles.dataset.ia2RdfValueEditorBacklinks = "";
      this.#backlinkStyles.textContent = `
        [data-rdf-value-editor-backlink] {
          border-radius: .15em;
          cursor: pointer;
        }
        [data-rdf-value-editor-backlink]:hover {
          outline: 2px solid var(--ia2-rdf-value-editor-backlink-hover, oklch(55% 0.17 294 / 48%));
          outline-offset: 2px;
        }
        [data-rdf-value-editor-backlink]:focus-visible {
          outline: 3px solid var(--ia2-rdf-value-editor-backlink-focus, oklch(81% 0.15 135));
          outline-offset: 2px;
        }
        [data-rdf-value-editor-active-backlink] {
          background: var(--ia2-rdf-value-editor-backlink-active-background, oklch(90% 0.065 294));
          border-radius: .15em;
          box-decoration-break: clone;
          box-shadow: 0 0 0 2px var(--ia2-rdf-value-editor-backlink-active, oklch(55% 0.17 294));
          -webkit-box-decoration-break: clone;
        }
      `;
      const styleRoot = this.#resolvedSourceRoot?.nodeType === 11
        ? this.#resolvedSourceRoot
        : sourceDocument.head;
      styleRoot.append(this.#backlinkStyles);
    }

    for (const binding of this.#bindings) {
      for (const placeholder of binding.placeholders) {
        const activate = (): void => {
          if (
            this.getAttribute("backlink-mode") === "full"
            || placeholder.ownerDocument !== this.ownerDocument
          ) {
            this.#revealBinding(binding, placeholder);
          } else {
            this.#showQuickEditor(binding, placeholder);
          }
        };
        const pointerdown = (event: PointerEvent): void => {
          if (event.button !== 0) return;
          event.preventDefault();
          activate();
        };
        const click = (event: MouseEvent): void => {
          event.preventDefault();
          if (event.detail !== 0) return;
          activate();
        };
        const keydown = (event: KeyboardEvent): void => {
          if (event.key !== "Enter" && event.key !== " ") return;
          event.preventDefault();
          activate();
        };
        this.#backlinkStates.push({
          placeholder,
          binding,
          pointerdown,
          click,
          keydown,
          role: placeholder.getAttribute("role"),
          tabIndex: placeholder.getAttribute("tabindex"),
          ariaLabel: placeholder.getAttribute("aria-label"),
          title: placeholder.getAttribute("title"),
        });
        placeholder.dataset.rdfValueEditorBacklink = "";
        placeholder.setAttribute("role", "button");
        placeholder.tabIndex = 0;
        placeholder.setAttribute("aria-label", `Edit ${binding.label}`);
        placeholder.setAttribute("title", `Edit ${binding.label} in ${this.#panelLabel()}`);
        placeholder.addEventListener("pointerdown", pointerdown);
        placeholder.addEventListener("click", click);
        placeholder.addEventListener("keydown", keydown);
      }
    }
  }

  #teardownBacklinks(): void {
    this.#backlinkStyles?.remove();
    this.#backlinkStyles = null;
    for (const state of this.#backlinkStates) {
      const { placeholder } = state;
      placeholder.removeEventListener("pointerdown", state.pointerdown);
      placeholder.removeEventListener("click", state.click);
      placeholder.removeEventListener("keydown", state.keydown);
      delete placeholder.dataset.rdfValueEditorBacklink;
      delete placeholder.dataset.rdfValueEditorActiveBacklink;
      this.#restoreAttribute(placeholder, "role", state.role);
      this.#restoreAttribute(placeholder, "tabindex", state.tabIndex);
      this.#restoreAttribute(placeholder, "aria-label", state.ariaLabel);
      this.#restoreAttribute(placeholder, "title", state.title);
    }
    this.#backlinkStates = [];
  }

  #restoreAttribute(element: HTMLElement, name: string, value: string | null): void {
    if (value === null) element.removeAttribute(name);
    else element.setAttribute(name, value);
  }

  #activeBindings(): Set<Binding> {
    const active = new Set(this.#bindings.filter((binding) => binding.scopes.length === 0));
    let changed = true;
    while (changed) {
      changed = false;
      const selected = new Set(Array.from(active).flatMap((binding) => (
        this.#selectedOption(binding)?.term.termType === "NamedNode"
          ? [this.#selectedOption(binding)!.term.value]
          : []
      )));
      for (const binding of this.#bindings) {
        if (active.has(binding) || !binding.scopes.some((iri) => selected.has(iri))) continue;
        active.add(binding);
        changed = true;
      }
    }
    return active;
  }

  #isBindingActive(binding: Binding, active = this.#activeBindings()): boolean {
    return active.has(binding);
  }

  #selectedOption(binding: Binding): AuthorOption | undefined {
    return binding.options.find(({ key }) => key === binding.value);
  }

  #controllingBinding(binding: Binding): Binding | undefined {
    if (binding.scopes.length === 0) return undefined;
    return this.#bindings.find((candidate) => (
      candidate.options.some(({ term }) => (
        term.termType === "NamedNode" && binding.scopes.includes(term.value)
      ))
    ));
  }

  #quickNavigationDestination(
    offset: -1 | 1,
  ): { binding: Binding; placeholder: HTMLElement } | undefined {
    const currentBinding = this.#quickBinding;
    const currentPlaceholder = this.#quickPlaceholder;
    if (!currentBinding || !currentPlaceholder) return undefined;
    const active = this.#activeBindings();
    const candidates = this.#bindings.flatMap((binding) => {
      if (
        binding === currentBinding
        || !active.has(binding)
        || !this.#bindingRows.has(binding.key)
      ) return [];
      return binding.placeholders.flatMap((placeholder) => {
        if (
          !placeholder.isConnected
          || placeholder.hidden
          || placeholder.closest("[hidden]")
        ) return [];
        const position = currentPlaceholder.compareDocumentPosition(placeholder);
        const isInDirection = offset === 1
          ? Boolean(position & Node.DOCUMENT_POSITION_FOLLOWING)
          : Boolean(position & Node.DOCUMENT_POSITION_PRECEDING);
        return isInDirection ? [{ binding, placeholder }] : [];
      });
    });
    candidates.sort((left, right) => {
      const position = left.placeholder.compareDocumentPosition(right.placeholder);
      const documentOrder = position & Node.DOCUMENT_POSITION_FOLLOWING
        ? -1
        : position & Node.DOCUMENT_POSITION_PRECEDING ? 1 : 0;
      return offset === 1 ? documentOrder : -documentOrder;
    });
    return candidates[0];
  }

  #restoreQuickRow(): void {
    const binding = this.#quickBinding;
    const parent = this.#quickRowParent;
    if (!binding || !parent) return;
    const row = this.#bindingRows.get(binding.key);
    if (!row) return;
    const next = this.#quickRowNextSibling;
    if (next?.parentNode === parent) parent.insertBefore(row, next);
    else parent.appendChild(row);
    this.#quickRowParent = null;
    this.#quickRowNextSibling = null;
  }

  #hideQuickEditor(restoreFocus: boolean): void {
    const returnFocus = this.#quickPlaceholder ?? this.#returnFocus;
    if (this.#quickPlaceholder) {
      delete this.#quickPlaceholder.dataset.rdfValueEditorActiveBacklink;
    }
    this.#quickPositionCleanup?.();
    this.#quickPositionCleanup = null;
    this.#restoreQuickRow();
    this.#quickEditor?.removeAttribute("data-open");
    this.#quickEditor?.setAttribute("inert", "");
    this.#quickEditor?.removeAttribute("aria-label");
    this.#launcher?.setAttribute("aria-expanded", "false");
    this.#quickBinding = null;
    this.#quickPlaceholder = null;
    if (restoreFocus) returnFocus?.focus();
    this.#returnFocus = null;
  }

  #positionQuickEditor(): void {
    const panel = this.#quickEditor;
    const placeholder = this.#quickPlaceholder;
    const view = this.ownerDocument.defaultView;
    if (!panel || !placeholder || !view || !panel.hasAttribute("data-open")) return;
    const anchor = placeholder.getBoundingClientRect();
    const fragments = Array.from(placeholder.getClientRects()).filter(
      (rect) => rect.width > 0 && rect.height > 0,
    );
    const anchorTop = fragments.length > 0
      ? Math.min(...fragments.map((rect) => rect.top))
      : anchor.top;
    const anchorBottom = fragments.length > 0
      ? Math.max(...fragments.map((rect) => rect.bottom))
      : anchor.bottom;
    let readingRect = anchor;
    for (
      let ancestor = placeholder.parentElement;
      ancestor;
      ancestor = ancestor.parentElement
    ) {
      const display = view.getComputedStyle(ancestor).display;
      const candidate = ancestor.getBoundingClientRect();
      if (
        display !== "contents"
        && !display.startsWith("inline")
        && candidate.width > 0
      ) {
        readingRect = candidate;
        break;
      }
    }
    const panelRect = panel.getBoundingClientRect();
    const gap = 8;
    const inset = 12;
    const width = panelRect.width || Math.min(340, view.innerWidth - inset * 2);
    const height = panelRect.height || 190;
    const left = Math.min(
      Math.max(readingRect.left + (readingRect.width - width) / 2, inset),
      Math.max(inset, view.innerWidth - width - inset),
    );
    const below = anchorBottom + gap;
    const top = below + height <= view.innerHeight - inset
      ? below
      : Math.max(inset, anchorTop - height - gap);
    panel.style.left = `${Math.round(left)}px`;
    panel.style.top = `${Math.round(top)}px`;
  }

  #updateQuickNavigation(): void {
    const panel = this.#quickEditor;
    const binding = this.#quickBinding;
    if (!panel || !binding) return;
    const previous = this.#quickNavigationDestination(-1);
    const next = this.#quickNavigationDestination(1);
    const previousButton = panel.querySelector<HTMLButtonElement>(".quick-prev");
    const nextButton = panel.querySelector<HTMLButtonElement>(".quick-next");
    if (previousButton) {
      previousButton.disabled = !previous;
      previousButton.title = previous ? `Previous: ${previous.binding.label}` : "No previous field";
      previousButton.setAttribute(
        "aria-label",
        previous ? `Previous field: ${previous.binding.label}` : "No previous field",
      );
    }
    if (nextButton) {
      nextButton.disabled = !next;
      nextButton.title = next ? `Next: ${next.binding.label}` : "No next field";
      nextButton.setAttribute(
        "aria-label",
        next ? `Next field: ${next.binding.label}` : "No next field",
      );
    }
  }

  #showQuickEditor(binding: Binding, returnFocus: HTMLElement): void {
    const revealedBinding = this.#isBindingActive(binding)
      ? binding
      : this.#controllingBinding(binding) ?? binding;
    const row = this.#bindingRows.get(revealedBinding.key);
    const control = this.#bindingControls.get(revealedBinding.key);
    const panel = this.#quickEditor;
    const body = this.#quickBody;
    if (!row || !control || !panel || !body) return;

    if (this.#drawer?.hasAttribute("data-open")) this.#hide(false);
    this.#quickPositionCleanup?.();
    this.#quickPositionCleanup = null;
    this.#restoreQuickRow();
    if (this.#quickPlaceholder) {
      delete this.#quickPlaceholder.dataset.rdfValueEditorActiveBacklink;
    }

    this.#returnFocus = returnFocus;
    this.#quickBinding = revealedBinding;
    this.#quickPlaceholder = returnFocus;
    returnFocus.dataset.rdfValueEditorActiveBacklink = "";
    this.#quickRowParent = row.parentNode;
    this.#quickRowNextSibling = row.nextSibling;
    const group = revealedBinding.groupKey
      ? this.ownerDocument.createElement("p")
      : undefined;
    if (group) {
      group.className = "quick-group";
      group.textContent = revealedBinding.groupLabel;
      body.replaceChildren(group, row);
    } else {
      body.replaceChildren(row);
    }
    panel.setAttribute(
      "aria-label",
      revealedBinding.groupKey
        ? `Edit ${revealedBinding.label} in ${revealedBinding.groupLabel}`
        : `Edit ${revealedBinding.label}`,
    );
    panel.setAttribute("data-open", "");
    panel.removeAttribute("inert");
    this.#launcher?.setAttribute("aria-expanded", "true");
    this.#updateQuickNavigation();

    const view = this.ownerDocument.defaultView;
    if (view) {
      let frame = 0;
      const position = (): void => {
        if (view.requestAnimationFrame) {
          view.cancelAnimationFrame(frame);
          frame = view.requestAnimationFrame(() => this.#positionQuickEditor());
        } else {
          this.#positionQuickEditor();
        }
      };
      view.addEventListener("resize", position, { passive: true });
      view.addEventListener("scroll", position, { capture: true, passive: true });
      this.#quickPositionCleanup = () => {
        view.cancelAnimationFrame?.(frame);
        view.removeEventListener("resize", position);
        view.removeEventListener("scroll", position, true);
      };
      position();
      if (view.requestAnimationFrame) {
        view.requestAnimationFrame(() => control.focus({ preventScroll: true }));
      } else {
        view.setTimeout(() => control.focus({ preventScroll: true }), 0);
      }
    } else {
      this.#positionQuickEditor();
      control.focus({ preventScroll: true });
    }
  }

  #navigateQuickEditor(offset: -1 | 1): void {
    const destination = this.#quickNavigationDestination(offset);
    if (!destination) return;
    const { binding, placeholder } = destination;
    const view = this.ownerDocument.defaultView;
    placeholder.scrollIntoView?.({
      behavior: view?.matchMedia?.("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "center",
    });
    this.#showQuickEditor(binding, placeholder);
  }

  async #finishQuickEditor(): Promise<void> {
    const binding = this.#quickBinding;
    const control = binding ? this.#bindingControls.get(binding.key) : undefined;
    if (!binding || !control) return;
    this.#acceptValue(binding, control);
    await this.#validationPromise;
    if (binding.error) {
      control.focus({ preventScroll: true });
      return;
    }
    this.#hideQuickEditor(true);
  }

  #expandQuickEditor(): void {
    const binding = this.#quickBinding;
    const placeholder = this.#quickPlaceholder;
    if (!binding || !placeholder) return;
    this.#hideQuickEditor(false);
    this.#revealBinding(binding, placeholder);
  }

  #revealBinding(binding: Binding, returnFocus: HTMLElement): void {
    this.#hideQuickEditor(false);
    const revealedBinding = this.#isBindingActive(binding)
      ? binding
      : this.#controllingBinding(binding) ?? binding;
    const control = this.#bindingControls.get(revealedBinding.key);
    if (!control) return;
    this.#returnFocus = returnFocus;
    const wasOpen = this.#drawer?.hasAttribute("data-open") ?? false;
    const navigationVersion = ++this.#directNavigationVersion;
    this.#syncCleanup?.();
    this.#syncCleanup = null;
    this.#show(false);
    const focusControl = (): void => {
      if (!this.isConnected || !control.isConnected) return;
      this.#scrollControlIntoEditor(control, "auto");
      control.focus({ preventScroll: true });
      const view = this.ownerDocument.defaultView;
      const resumeSync = (): void => {
        if (
          navigationVersion !== this.#directNavigationVersion
          || !this.isConnected
          || !this.#drawer?.hasAttribute("data-open")
        ) return;
        this.#configureSync(false);
      };
      if (view?.requestAnimationFrame) {
        view.requestAnimationFrame(() => view.requestAnimationFrame(resumeSync));
      } else {
        view?.setTimeout(resumeSync, 0);
      }
    };
    if (this.ownerDocument.defaultView?.requestAnimationFrame) {
      this.ownerDocument.defaultView.requestAnimationFrame(focusControl);
    } else {
      setTimeout(focusControl, 0);
    }
    if (!wasOpen && this.#drawer) {
      const drawer = this.#drawer;
      let settled = false;
      const focusAfterOpen = (): void => {
        if (settled) return;
        settled = true;
        drawer.removeEventListener("transitionend", focusAfterOpen);
        if (this.isConnected && control.isConnected && drawer.hasAttribute("data-open")) {
          control.focus({ preventScroll: true });
        }
      };
      drawer.addEventListener("transitionend", focusAfterOpen, { once: true });
      this.ownerDocument.defaultView?.setTimeout(focusAfterOpen, 240);
    }
  }

  #renderingAlternatives(
    quads: readonly Quad[],
    sourceDocumentIri: string,
  ): Map<string, RenderingAlternative[]> {
    const alternatives = new Map<string, RenderingAlternative[]>();
    if (!this.#resolvedSourceRoot) return alternatives;
    const annotations = new Set(quads.flatMap((quad) => (
      quad.predicate.value === RDF_TYPE
      && quad.object.termType === "NamedNode"
      && quad.object.value === `${OA}Annotation`
        ? [quad.subject.value]
        : []
    )));

    for (const annotation of annotations) {
      const bodies = values(quads, annotation, `${OA}hasBody`)
        .filter((term) => term.termType !== "Triple");
      if (
        bodies.length !== 1
        || !namedValues(quads, bodies[0]!.value, RDF_TYPE).includes(`${OA}Choice`)
      ) {
        continue;
      }
      const targetTerms = values(quads, annotation, `${OA}hasTarget`);
      const targetIris = targetTerms.flatMap((term) => (
        term.termType === "NamedNode" ? [term.value] : []
      ));
      const target = targetIris.length === 1
        ? elementForIri(this.#resolvedSourceRoot, targetIris[0]!, sourceDocumentIri)
        : undefined;
      const itemHeads = values(quads, bodies[0]!.value, `${AS}items`);
      if (targetTerms.length !== 1 || !target || itemHeads.length !== 1) {
        this.#modelIssues.push(`${localName(annotation)} is not one unambiguous rendering annotation.`);
        continue;
      }

      for (const item of listValues(quads, itemHeads[0])) {
        if (item.termType === "Triple") {
          this.#modelIssues.push(`${localName(annotation)} contains an unsupported triple-term choice item.`);
          continue;
        }
        const types = namedValues(quads, item.value, RDF_TYPE);
        const sources = namedValues(quads, item.value, `${OA}hasSource`);
        const scopes = namedValues(quads, item.value, `${OA}hasScope`);
        const source = sources.length === 1
          ? elementForIri(this.#resolvedSourceRoot, sources[0]!, sourceDocumentIri)
          : undefined;
        if (
          !types.includes(`${OA}SpecificResource`)
          || sources.length !== 1
          || scopes.length !== 1
          || source?.localName !== "template"
          || !isSafeReplacementTemplate(source as HTMLTemplateElement)
        ) {
          this.#modelIssues.push(`${localName(item.value)} is not one safe, scoped template alternative.`);
          continue;
        }
        const alternative: RenderingAlternative = {
          resource: item.value,
          target,
          template: source as HTMLTemplateElement,
        };
        const optionAlternatives = alternatives.get(scopes[0]!) ?? [];
        optionAlternatives.push(alternative);
        alternatives.set(scopes[0]!, optionAlternatives);
      }
    }
    return alternatives;
  }

  #authorableBindings(
    quads: readonly Quad[],
    sourceDocumentIri: string,
  ): Binding[] {
    if (!this.#resolvedSourceRoot) return [];
    const propertyShapes = new Set(quads.flatMap((quad) => (
      quad.predicate.value === RDF_TYPE
      && quad.object.termType === "NamedNode"
      && quad.object.value === `${SH}PropertyShape`
        ? [quad.subject.value]
        : []
    )));
    const annotations = new Set(quads.flatMap((quad) => (
      quad.predicate.value === RDF_TYPE
      && quad.object.termType === "NamedNode"
      && quad.object.value === `${OA}Annotation`
        ? [quad.subject.value]
        : []
    )));
    const alternatives = this.#renderingAlternatives(quads, sourceDocumentIri);
    const bindings = new Map<string, Binding>();

    for (const annotation of annotations) {
      const bodyTerms = values(quads, annotation, `${OA}hasBody`)
        .filter((term) => term.termType !== "Triple");
      if (bodyTerms.length !== 1) continue;
      const body = bodyTerms[0]!;
      const bodyTypes = namedValues(quads, body.value, RDF_TYPE);
      if (bodyTypes.includes(`${OA}Choice`)) continue;

      let shape = body.value;
      let scopes: string[] = [];
      if (bodyTypes.includes(`${OA}SpecificResource`)) {
        const sources = values(quads, body.value, `${OA}hasSource`)
          .filter((term) => term.termType !== "Triple");
        scopes = namedValues(quads, body.value, `${OA}hasScope`);
        if (sources.length !== 1 || scopes.length === 0) {
          this.#modelIssues.push(`${localName(annotation)} has an ambiguous contextual body.`);
          continue;
        }
        shape = sources[0]!.value;
      }
      if (!propertyShapes.has(shape)) continue;

      const targetNodes = namedValues(quads, shape, `${SH}targetNode`);
      const paths = namedValues(quads, shape, `${SH}path`);
      if (paths.length !== 1) {
        this.#modelIssues.push(`${localName(shape)} must declare one simple IRI sh:path.`);
        continue;
      }
      const maxCount = numberValue(quads, shape, `${SH}maxCount`);
      if (maxCount !== undefined && maxCount !== 1) {
        this.#modelIssues.push(`${localName(shape)} must have sh:maxCount 1 when rendered as one control.`);
        continue;
      }

      const optionHeads = values(quads, shape, `${SH}in`);
      if (optionHeads.length > 1) {
        this.#modelIssues.push(`${localName(shape)} has more than one sh:in list.`);
        continue;
      }
      const optionTerms = optionHeads.length === 1
        ? listValues(quads, optionHeads[0])
        : [];
      const options = optionTerms.flatMap((term) => {
        const value = authorValue(term);
        if (!value) {
          this.#modelIssues.push(`${localName(shape)} contains an unsupported blank-node or triple-term option.`);
          return [];
        }
        return [{
          term: value,
          key: valueKey(value),
          label: value.termType === "NamedNode"
            ? labelFor(quads, value.value, { predicates: this.#labelPredicates })
              ?? localName(value.value)
            : value.value,
          alternatives: value.termType === "NamedNode" ? alternatives.get(value.value) ?? [] : [],
        }];
      });
      if (optionTerms.length !== options.length) continue;

      const nodeKind = firstValue(quads, shape, `${SH}nodeKind`);
      const datatype = firstValue(quads, shape, `${SH}datatype`);
      const valueKind = nodeKind === `${SH}IRI` ? "NamedNode" : "Literal";
      if (valueKind === "NamedNode" && datatype) {
        this.#modelIssues.push(`${localName(shape)} cannot combine sh:nodeKind sh:IRI with sh:datatype.`);
        continue;
      }
      const defaultTerm = authorValue(values(quads, shape, `${SH}defaultValue`)[0]);
      const defaultValue = options.length > 0
        ? options.find(({ term }) => defaultTerm && valueKey(term) === valueKey(defaultTerm))?.key
        : defaultTerm?.termType === valueKind ? defaultTerm.value : undefined;
      if (defaultTerm && defaultValue === undefined) {
        this.#modelIssues.push(`${localName(shape)} has a default value outside its supported value space.`);
      }

      const declaredLabel = firstValue(quads, annotation, `${SH}name`)
        ?? labelFor(quads, annotation, { predicates: this.#labelPredicates })
        ?? firstValue(quads, shape, `${SH}name`)
        ?? labelFor(quads, shape, { predicates: this.#labelPredicates })
        ?? localName(shape);
      const required = (numberValue(quads, shape, `${SH}minCount`) ?? 0) > 0;
      const group = groupInfo(quads, shape);
      const order = numberValue(quads, shape, `${SH}order`) ?? Number.MAX_SAFE_INTEGER;

      const targets = annotationTargetIrisForAnnotation(quads, annotation);
      if (targets.length === 0) {
        this.#modelIssues.push(`${localName(annotation)} must target at least one HTML element IRI.`);
        continue;
      }
      const focusNodes = namedValues(quads, annotation, `${SCHEMA}about`);
      const subject = focusNodes.length === 1 ? focusNodes[0] : targetNodes[0];
      if (!subject || focusNodes.length > 1 || targetNodes.length > 1) {
        this.#modelIssues.push(`${localName(annotation)} must resolve to one focus node.`);
        continue;
      }

      for (const targetIri of targets) {
        const placeholder = elementForIri(this.#resolvedSourceRoot, targetIri, sourceDocumentIri);
        if (!placeholder) {
          this.#modelIssues.push(`${localName(targetIri)} is outside the configured source root or is not an HTML element.`);
          continue;
        }
        const key = `${shape}\n${subject}`;
        const existing = bindings.get(key);
        if (existing) {
          if (
            existing.scopes.length !== scopes.length
            || existing.scopes.some((scope) => !scopes.includes(scope))
          ) {
            this.#modelIssues.push(`${localName(annotation)} gives one field incompatible scopes.`);
          } else if (!existing.placeholders.includes(placeholder)) {
            existing.placeholders.push(placeholder);
          }
          continue;
        }
        bindings.set(key, {
          key,
          shape,
          scopes,
          subject,
          path: paths[0]!,
          label: declaredLabel,
          groupKey: group.key,
          groupLabel: group.label,
          groupOrder: group.order,
          order,
          placeholders: [placeholder],
          options,
          valueKind,
          ...(datatype ? { datatype } : {}),
          ...(defaultValue !== undefined ? { defaultValue } : {}),
          ...(firstValue(quads, shape, `${SH}pattern`) ? { pattern: firstValue(quads, shape, `${SH}pattern`)! } : {}),
          ...(numberValue(quads, shape, `${SH}minLength`) !== undefined ? { minLength: numberValue(quads, shape, `${SH}minLength`)! } : {}),
          ...(numberValue(quads, shape, `${SH}maxLength`) !== undefined ? { maxLength: numberValue(quads, shape, `${SH}maxLength`)! } : {}),
          required,
          value: "",
          touched: false,
          error: "",
        });
      }
    }

    return Array.from(bindings.values());
  }

  #render(): void {
    const root = this.shadowRoot ?? this.attachShadow({ mode: "open" });
    const panelLabel = escapeHtml(this.#panelLabel());
    root.innerHTML = `
      <style>
        :host {
          --editor-accent: oklch(49% 0.18 294);
          --editor-accent-soft: oklch(93% 0.035 294);
          --editor-ink: oklch(23% 0.035 286);
          --editor-muted: oklch(47% 0.025 286);
          --editor-paper: oklch(98.5% 0.008 286);
          --editor-layer: oklch(94.5% 0.02 286);
          --editor-rule: oklch(84% 0.025 286);
          font-family: "Avenir Next", Avenir, "Segoe UI Variable", "Segoe UI", sans-serif;
        }
        * { box-sizing: border-box; }
        button, input, select { font: inherit; }
        :where(button, input, select):focus-visible {
          outline: 3px solid oklch(81% 0.15 135);
          outline-offset: 2px;
        }
        .launcher {
          align-items: center;
          background: var(--editor-accent);
          border: 1px solid oklch(38% 0.16 294);
          border-radius: 8px;
          bottom: 4.6rem;
          box-shadow: 0 8px 28px oklch(20% 0.03 286 / 22%);
          color: var(--editor-paper);
          cursor: pointer;
          display: flex;
          font-size: .78rem;
          font-weight: 750;
          gap: .65rem;
          min-height: 44px;
          padding: .7rem .9rem;
          position: fixed;
          right: 1rem;
          z-index: 30;
        }
        .launcher[data-position^="left"] { left: 1rem; right: auto; }
        .launcher[aria-expanded="true"] {
          pointer-events: none;
          visibility: hidden;
        }
        .count {
          background: var(--editor-paper);
          border-radius: 999px;
          color: var(--editor-accent);
          min-width: 1.6rem;
          padding: .16rem .4rem;
          text-align: center;
        }
        .drawer {
          --ia2-window-rule: var(--editor-rule);
          --ia2-window-width: 26rem;
          background: var(--editor-paper);
          color: var(--editor-ink);
          container-name: value-editor;
          container-type: inline-size;
          display: grid;
          grid-template-rows: auto auto minmax(0, 1fr);
          z-index: 40;
        }
        .drawer[data-position="floating"] .drawer-head { cursor: grab; touch-action: none; user-select: none; }
        .drawer[data-position="floating"].is-dragging .drawer-head { cursor: grabbing; }
        :host([positioning="fixed"]) .drawer[data-position="floating"] .drawer-head {
          cursor: default;
          touch-action: auto;
          user-select: auto;
        }
        .quick-editor {
          background: var(--editor-paper);
          border: 1px solid var(--editor-rule);
          border-radius: 12px;
          box-shadow:
            0 18px 50px oklch(28% 0.03 60 / 12%),
            0 2px 8px oklch(28% 0.03 60 / 7%);
          color: var(--editor-ink);
          display: grid;
          max-height: calc(100vh - 24px);
          opacity: 0;
          overflow: hidden;
          pointer-events: none;
          position: fixed;
          transform: translateY(-4px) scale(.99);
          transition:
            opacity 140ms ease,
            transform 180ms cubic-bezier(.22, 1, .36, 1),
            visibility 180ms;
          visibility: hidden;
          width: min(340px, calc(100vw - 24px));
          z-index: var(--ia2-window-dialog-layer, 2147483040);
        }
        .quick-editor[data-open] {
          opacity: 1;
          pointer-events: auto;
          transform: none;
          visibility: visible;
        }
        .quick-body {
          min-width: 0;
          overflow: auto;
          padding: .15rem 1rem .55rem;
        }
        .quick-group {
          color: var(--editor-muted);
          font-size: .62rem;
          font-weight: 780;
          letter-spacing: .045em;
          margin: .75rem 0 -.45rem;
          text-transform: uppercase;
        }
        .quick-body .field {
          border: 0;
          padding: .85rem 0 .65rem;
        }
        .quick-actions {
          align-items: center;
          border-top: 1px solid var(--editor-rule);
          display: flex;
          gap: .35rem;
          justify-content: flex-end;
          padding: .55rem;
        }
        .quick-action {
          background: transparent;
          border: 1px solid var(--editor-rule);
          border-radius: 7px;
          color: var(--editor-ink);
          cursor: pointer;
          font-size: .7rem;
          font-weight: 720;
          min-height: 36px;
          padding: .4rem .65rem;
        }
        .quick-action:hover { background: var(--editor-accent-soft); }
        .quick-action:disabled {
          background: transparent;
          color: color-mix(in oklch, var(--editor-muted), transparent 45%);
          cursor: default;
        }
        .quick-expand {
          align-items: center;
          border-color: transparent;
          color: var(--editor-accent);
          display: inline-flex;
          gap: .35rem;
          margin-right: auto;
        }
        .quick-expand-icon {
          fill: none;
          height: 14px;
          stroke: currentColor;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-width: 1.65;
          width: 14px;
        }
        .quick-done {
          background: var(--editor-accent);
          border-color: var(--editor-accent);
          color: var(--editor-paper);
        }
        .quick-done:hover {
          background: color-mix(in oklch, var(--editor-accent), var(--editor-ink) 12%);
        }
        .drawer-head {
          border-bottom: 1px solid var(--editor-rule);
          min-width: 0;
          padding: 1rem 1.1rem .9rem;
        }
        .head-row { align-items: start; display: grid; gap: .75rem; grid-template-columns: minmax(0, 1fr) auto; min-width: 0; }
        h2 { font-size: 1.08rem; letter-spacing: -.02em; margin: 0; }
        .progress { color: var(--editor-muted); font-size: .75rem; line-height: 1.45; margin: .3rem 0 0; }
        .how-link {
          background: transparent;
          border: 0;
          color: var(--editor-accent);
          cursor: pointer;
          font-size: .7rem;
          font-weight: 720;
          margin: .15rem 0 0;
          padding: .2rem 0;
          text-decoration: underline;
          text-decoration-color: color-mix(in oklch, var(--editor-accent), transparent 60%);
          text-underline-offset: .2em;
        }
        .how-link:hover { text-decoration-color: currentColor; }
        .head-actions { align-items: center; display: flex; flex-wrap: wrap; gap: .4rem; justify-content: flex-end; min-width: 0; }
        .ia2-position-control { flex: 0 0 auto; position: relative; z-index: 14; }
        .ia2-position-trigger {
          align-items: center;
          background: var(--editor-accent);
          border: 0;
          border-radius: 7px;
          color: var(--editor-paper);
          cursor: pointer;
          display: none;
          height: 36px;
          justify-content: center;
          padding: 0;
          width: 36px;
        }
        .ia2-position-trigger:hover {
          background: color-mix(in oklch, var(--editor-accent), var(--editor-ink) 12%);
        }
        .ia2-position-label { display: none; }
        .editor-position-switch {
          align-items: center;
          border: 1px solid transparent;
          border-radius: 7px;
          display: inline-flex;
          flex: 0 0 auto;
          overflow: hidden;
        }
        .editor-position-switch:hover,
        .editor-position-switch:focus-within {
          background: var(--editor-layer);
          border-color: var(--editor-rule);
        }
        .editor-position-option {
          align-items: center;
          background: transparent;
          border: 0;
          border-right: 1px solid transparent;
          color: var(--editor-muted);
          cursor: pointer;
          display: inline-flex;
          flex: 0 0 28px;
          height: 32px;
          justify-content: center;
          opacity: .28;
          padding: 0;
          pointer-events: none;
          width: 28px;
        }
        .editor-position-switch:hover .editor-position-option,
        .editor-position-switch:focus-within .editor-position-option {
          border-right-color: var(--editor-rule);
          opacity: 1;
          pointer-events: auto;
        }
        .editor-position-option:last-child { border-right: 0; }
        .editor-position-option:hover { background: var(--editor-accent-soft); color: var(--editor-accent); }
        .editor-position-option[aria-checked="true"] {
          background: var(--editor-accent);
          color: var(--editor-paper);
          opacity: 1;
          pointer-events: auto;
        }
        :host([positioning="fixed"]) .ia2-position-control { display: none; }
        .text-button, .close {
          background: transparent;
          border: 1px solid var(--editor-rule);
          border-radius: 8px;
          color: var(--editor-ink);
          cursor: pointer;
          font-size: .72rem;
          font-weight: 700;
          min-height: 36px;
          padding: .45rem .65rem;
        }
        .close { font-size: 1rem; padding-inline: .65rem; }
        .editor-tools {
          background: var(--editor-paper);
          border-bottom: 1px solid var(--editor-rule);
          display: grid;
          gap: .35rem;
          min-height: 48px;
          min-width: 0;
          padding: .35rem 1.1rem;
        }
        .editor-tools-row {
          align-items: center;
          display: flex;
          flex-wrap: wrap;
          gap: .5rem;
          justify-content: space-between;
        }
        .data-actions {
          align-items: stretch;
          display: inline-flex;
          flex: 0 0 auto;
          gap: 0;
          max-width: 100%;
          min-width: 0;
        }
        .data-button,
        .save-choice {
          background: var(--editor-paper);
          border: 1px solid var(--editor-rule);
          border-radius: 0;
          color: var(--editor-ink);
          cursor: pointer;
          font-size: .7rem;
          font-weight: 700;
          min-height: 36px;
          padding: .4rem .65rem;
          width: auto;
        }
        .data-button:first-child { border-radius: 8px 0 0 8px; }
        .data-button:last-child { border-radius: 0 8px 8px 0; }
        .data-actions > * + * { border-left: 0; }
        .data-button:hover,
        .save-choice:hover { background: var(--editor-accent-soft); }
        .save-choice { min-width: 12.5rem; }
        .data-status {
          color: var(--editor-muted);
          font-size: .68rem;
          line-height: 1.4;
          margin: 0;
        }
        .data-status[data-state="success"] { color: oklch(40% 0.11 150); }
        .data-status[data-state="warning"] { color: oklch(43% 0.11 78); }
        .data-status[data-state="error"] { color: oklch(48% .18 28); }
        .sync-control { align-items: center; display: inline-flex; gap: 6px; }
        .sync-label {
          color: var(--editor-muted);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .04em;
          text-transform: uppercase;
        }
        .sync-switch {
          align-items: stretch;
          background: var(--editor-layer);
          border: 1px solid var(--editor-rule);
          border-radius: 8px;
          display: inline-flex;
          height: 36px;
          overflow: hidden;
        }
        .sync-switch:focus-within { border-color: var(--editor-accent); }
        .sync-option {
          align-items: center;
          background: transparent;
          border: 0;
          border-right: 1px solid var(--editor-rule);
          color: var(--editor-muted);
          cursor: pointer;
          display: inline-flex;
          justify-content: center;
          padding: 0;
          width: 42px;
        }
        .sync-option:last-child { border-right: 0; }
        .sync-option:hover { background: var(--editor-accent-soft); color: var(--editor-accent); }
        .sync-option[aria-checked="true"] { background: var(--editor-accent); color: var(--editor-paper); }
        .sync-option:focus-visible {
          outline: 2px solid var(--editor-accent);
          outline-offset: -3px;
          position: relative;
          z-index: 1;
        }
        .sync-icon {
          display: block;
          fill: none;
          height: 16px;
          stroke: currentColor;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-width: 1.5;
          width: 32px;
        }
        .controls { min-width: 0; overflow: auto; padding: 0 1.1rem 2rem; }
        .group { border: 0; margin: 0; padding: 0; }
        .group + .group { margin-top: 1.15rem; }
        .group-title {
          background: var(--editor-paper);
          border-bottom: 1px solid var(--editor-rule);
          color: var(--editor-muted);
          font-size: .67rem;
          font-weight: 780;
          letter-spacing: .045em;
          margin: 0;
          padding: 1rem 0 .55rem;
          position: sticky;
          text-transform: uppercase;
          top: 0;
          z-index: 1;
        }
        .field { border-bottom: 1px solid var(--editor-rule); padding: .85rem 0 .9rem; }
        .field.is-corresponding {
          background: color-mix(in oklch, var(--editor-accent-soft), transparent 28%);
        }
        label { display: block; font-size: .82rem; font-weight: 700; margin-bottom: .4rem; }
        input, select {
          background: var(--editor-layer);
          border: 1px solid var(--editor-rule);
          border-radius: 8px;
          color: var(--editor-ink);
          min-height: 40px;
          padding: .5rem .65rem;
          width: 100%;
        }
        input[aria-invalid="true"], select[aria-invalid="true"] {
          border-color: oklch(53% 0.16 25);
        }
        .constraint, .error { font-size: .68rem; line-height: 1.45; margin: .35rem 0 0; }
        .constraint { color: var(--editor-muted); }
        .error { color: oklch(42% 0.14 25); font-weight: 650; }
        .error:empty { display: none; }
        .empty { color: var(--editor-muted); font-size: .82rem; line-height: 1.55; padding: 1.2rem 0; }
        .architecture-window {
          background: var(--editor-paper);
          border: 1px solid var(--editor-rule);
          border-radius: 14px;
          box-shadow: 0 18px 64px oklch(20% 0.03 286 / 24%);
          color: var(--editor-ink);
          display: grid;
          grid-template-rows: auto minmax(0, 1fr) auto;
          height: min(760px, calc(100vh - 48px));
          max-width: calc(100vw - 48px);
          opacity: 0;
          overflow: hidden;
          pointer-events: none;
          position: fixed;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -48%) scale(.985);
          transition: opacity 180ms ease, transform 220ms cubic-bezier(.22, 1, .36, 1), visibility 220ms;
          visibility: hidden;
          width: min(760px, calc(100vw - 48px));
          z-index: var(--ia2-window-dialog-layer, 2147483040);
        }
        .architecture-window[data-open="true"] {
          opacity: 1;
          pointer-events: auto;
          transform: translate(-50%, -50%) scale(1);
          visibility: visible;
        }
        .architecture-toolbar {
          align-items: center;
          border-bottom: 1px solid var(--editor-rule);
          cursor: default;
          display: flex;
          gap: .55rem;
          min-height: 48px;
          padding: 0 .55rem 0 .8rem;
        }
        .architecture-toolbar h2 {
          flex: 1 1 auto;
          font-size: .9rem;
          letter-spacing: -.01em;
          min-width: 8rem;
        }
        .position-icon {
          display: block;
          fill: none;
          height: 16px;
          stroke: currentColor;
          stroke-linejoin: round;
          stroke-width: 1.25;
          width: 20px;
        }
        .position-region { fill: currentColor; stroke: none; }
        .help-close {
          align-items: center;
          background: transparent;
          border: 0;
          border-radius: 7px;
          color: var(--editor-muted);
          cursor: pointer;
          display: flex;
          flex: 0 0 36px;
          font-size: 1.05rem;
          height: 36px;
          justify-content: center;
          padding: 0;
        }
        .help-close:hover { background: var(--editor-layer); color: var(--editor-ink); }
        .architecture-body { overflow: auto; padding: 1.4rem clamp(1.1rem, 4vw, 2rem) 2.2rem; }
        .architecture-kicker {
          color: var(--editor-accent);
          font-size: .67rem;
          font-weight: 780;
          letter-spacing: .055em;
          margin: 0 0 .55rem;
          text-transform: uppercase;
        }
        .architecture-title {
          font-size: clamp(1.55rem, 4vw, 2.25rem);
          letter-spacing: -.045em;
          line-height: 1.04;
          margin: 0;
          max-width: 18ch;
        }
        .architecture-lede {
          color: var(--editor-muted);
          font-size: .92rem;
          line-height: 1.6;
          margin: .8rem 0 1.5rem;
          max-width: 66ch;
        }
        .architecture-flow {
          align-items: stretch;
          display: grid;
          grid-template-columns: minmax(9rem, 1fr) auto minmax(9rem, 1fr) auto minmax(9rem, 1fr);
          margin: 1.2rem 0 1.6rem;
        }
        .flow-node {
          background: var(--editor-layer);
          border: 1px solid var(--editor-rule);
          border-radius: 10px;
          min-width: 0;
          padding: .85rem;
        }
        .flow-node.engine {
          background: var(--editor-accent-soft);
          border-color: color-mix(in oklch, var(--editor-accent), var(--editor-rule) 68%);
        }
        .flow-label {
          color: var(--editor-muted);
          display: block;
          font-size: .62rem;
          font-weight: 780;
          letter-spacing: .05em;
          margin-bottom: .45rem;
          text-transform: uppercase;
        }
        .flow-node strong { display: block; font-size: .82rem; line-height: 1.25; margin-bottom: .45rem; }
        .flow-node ul { color: var(--editor-muted); font-size: .7rem; line-height: 1.45; list-style: none; margin: 0; padding: 0; }
        .flow-node li + li { margin-top: .2rem; }
        .flow-node code, .flow-connector code, .architecture-claims code {
          font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
          font-size: .92em;
        }
        .flow-connector {
          align-items: center;
          color: var(--editor-accent);
          display: flex;
          flex-direction: column;
          font-size: 1.1rem;
          justify-content: center;
          padding: 0 .45rem;
          text-align: center;
        }
        .flow-connector code {
          color: var(--editor-muted);
          font-size: .56rem;
          line-height: 1.25;
          max-width: 8rem;
          overflow-wrap: anywhere;
        }
        .architecture-claims { border-top: 1px solid var(--editor-rule); margin: 0; }
        .architecture-claims > div {
          border-bottom: 1px solid var(--editor-rule);
          display: grid;
          gap: .8rem;
          grid-template-columns: minmax(8rem, 10rem) minmax(0, 1fr);
          padding: .85rem 0;
        }
        .architecture-claims dt { font-size: .75rem; font-weight: 760; }
        .architecture-claims dd { color: var(--editor-muted); font-size: .78rem; line-height: 1.55; margin: 0; }
        .connector-example {
          background: oklch(25% 0.04 286);
          border-radius: 8px;
          color: var(--editor-paper);
          font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
          font-size: .68rem;
          line-height: 1.65;
          margin: 1rem 0 0;
          overflow: auto;
          padding: .8rem .9rem;
          white-space: pre-wrap;
        }
        .architecture-footer {
          align-items: center;
          border-top: 1px solid var(--editor-rule);
          color: var(--editor-muted);
          display: flex;
          font-size: .68rem;
          gap: 1rem;
          justify-content: space-between;
          padding: .65rem .8rem;
        }
        .inspect-rdf {
          background: transparent;
          border: 1px solid var(--editor-rule);
          border-radius: 7px;
          color: var(--editor-ink);
          cursor: pointer;
          font-size: .7rem;
          font-weight: 720;
          min-height: 34px;
          padding: .4rem .65rem;
        }
        .inspect-rdf:hover { background: var(--editor-layer); }
        @container value-editor (max-width: 45rem) {
          .head-actions {
            display: grid;
            grid-template-columns: 36px 36px;
          }
          .ia2-position-control {
            grid-column: 1;
            grid-row: 1;
          }
          .apply-defaults {
            grid-column: 1 / -1;
            grid-row: 2;
            justify-content: center;
            line-height: 1.2;
            min-width: 0;
            overflow-wrap: anywhere;
            padding-inline: .35rem;
            white-space: normal;
            width: 100%;
          }
          .close {
            grid-column: 2;
            grid-row: 1;
            width: 36px;
          }
          .ia2-position-trigger { display: inline-flex; }
          .editor-position-switch {
            align-items: stretch;
            background: var(--editor-paper);
            border-color: var(--editor-rule);
            box-shadow: 0 12px 36px oklch(20% 0.03 286 / 20%);
            display: none;
            flex-direction: column;
            min-width: 190px;
            overflow: hidden;
            padding: 4px;
            position: absolute;
            right: 0;
            top: calc(100% + 6px);
          }
          .ia2-position-control[data-expanded="true"] .editor-position-switch {
            display: flex;
          }
          .editor-position-option {
            border: 0;
            border-radius: 5px;
            flex: 0 0 36px;
            gap: 10px;
            justify-content: flex-start;
            opacity: 1;
            padding: 0 10px;
            pointer-events: auto;
            width: 100%;
          }
          .editor-position-switch:hover .editor-position-option,
          .editor-position-switch:focus-within .editor-position-option { border: 0; }
          .editor-position-option[aria-checked="true"] {
            background: var(--editor-accent-soft);
            color: var(--editor-accent);
          }
          .ia2-position-label {
            display: inline;
            font-size: 12px;
            font-weight: 650;
            white-space: nowrap;
          }
          .editor-tools-row {
            align-items: stretch;
            display: grid;
            grid-template-columns: minmax(0, 1fr);
          }
          .data-actions {
            display: grid;
            flex: none;
            grid-template-columns: auto minmax(0, 1fr) auto;
            width: 100%;
          }
          .data-button,
          .save-choice { min-width: 0; }
          .save-choice {
            max-width: 100%;
            width: 100%;
          }
          .sync-control { justify-self: start; }
        }
        @media (max-width: 720px) {
          .drawer[data-position="floating"] .drawer-head { cursor: default; touch-action: auto; user-select: auto; }
          .head-actions { align-items: start; justify-content: flex-end; }
          .launcher { bottom: 4.35rem; right: .75rem; }
          .launcher[data-position^="left"] { left: .75rem; right: auto; }
          .architecture-window {
            border-radius: 12px;
            bottom: 10px;
            height: calc(100vh - 20px);
            left: 10px;
            max-width: none;
            right: auto;
            top: 10px;
            transform: translateY(12px) scale(.99);
            width: calc(100vw - 20px);
          }
          .architecture-window[data-open="true"] { transform: none; }
          .architecture-flow { grid-template-columns: 1fr; }
          .flow-connector { min-height: 2.5rem; transform: rotate(90deg); }
          .flow-connector code { display: none; }
          .architecture-claims > div { grid-template-columns: 1fr; gap: .25rem; }
          .architecture-footer span { display: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .architecture-window, .quick-editor { transition: none; }
        }
        ${WINDOW_PLACEMENT_CSS}
      </style>
      <button class="launcher ia2-window-launcher" type="button" data-position="${this.#position}" aria-expanded="false" aria-controls="ia2-rdf-value-editor-drawer">
        ${panelLabel} <span class="count">${this.#bindings.length}</span>
      </button>
      <section class="quick-editor" role="dialog" aria-modal="false" inert>
        <div class="quick-body"></div>
        <footer class="quick-actions">
          <button class="quick-action quick-expand" type="button">
            <svg class="quick-expand-icon" viewBox="0 0 20 20" aria-hidden="true">
              <path d="M7 3H3v4M13 3h4v4M17 13v4h-4M7 17H3v-4"></path>
            </svg>
            <span>Expand</span>
          </button>
          <button class="quick-action quick-prev" type="button">Prev</button>
          <button class="quick-action quick-next" type="button" aria-keyshortcuts="Enter">Next</button>
          <button class="quick-action quick-done" type="button">Done</button>
        </footer>
      </section>
      <aside class="drawer ia2-window-surface" id="ia2-rdf-value-editor-drawer" data-position="${this.#position}" aria-label="${panelLabel}" inert>
        <header class="drawer-head">
          <div class="head-row">
            <div>
              <h2>${panelLabel}</h2>
              <p class="progress" aria-live="polite"></p>
              <button class="how-link" type="button" aria-expanded="false" aria-controls="ia2-rdf-value-editor-help">How this works</button>
            </div>
            <div class="head-actions">
              ${this.getAttribute("positioning") === "fixed" || this.#allowedPositions.length < 2 ? "" : positionControlsMarkup({
                allowed: this.#allowedPositions,
                ariaLabel: "Completion window position",
                current: this.#position,
                groupClass: "editor-position-switch",
                optionClass: "editor-position-option",
              })}
              <button class="text-button apply-defaults" type="button">Apply defaults</button>
              <button class="close" type="button" aria-label="Close completion panel">×</button>
            </div>
          </div>
        </header>
        <div class="editor-tools">
          <div class="editor-tools-row">
            <div class="data-actions" aria-label="Completion documents">
              <button class="data-button load-values" type="button">Load</button>
              <select class="save-choice" aria-label="Artifact to save">
                <option value="completed-html">Completed document · HTML/RDF</option>
                <option value="values-html">Values document · HTML/RDF</option>
                <option value="values-turtle">Values document · Turtle</option>
              </select>
              <button class="data-button save-artifact" type="button">Save</button>
              <input class="load-input" type="file" accept=".html,.htm,.ttl,text/html,text/turtle" hidden>
            </div>
            ${scrollSyncControlsMarkup({
              current: this.#syncMode,
              controlClass: "sync-control",
              labels: {
                page: "Follow page viewport in editor",
                panel: "Follow editor in page",
              },
              optionClass: "sync-option",
              switchClass: "sync-switch",
            })}
          </div>
          <p class="data-status" aria-live="polite" hidden></p>
        </div>
        <form class="controls" novalidate></form>
        ${this.getAttribute("positioning") === "fixed" ? "" : windowResizeHandlesMarkup()}
      </aside>
      <section
        class="architecture-window"
        id="ia2-rdf-value-editor-help"
        role="dialog"
        aria-modal="false"
        aria-labelledby="ia2-rdf-value-editor-help-title"
        data-open="false"
        inert
      >
        <header class="architecture-toolbar">
          <h2 id="ia2-rdf-value-editor-help-title">How this works</h2>
          <button class="help-close" type="button" aria-label="Close architecture window" title="Close">×</button>
        </header>
        <div class="architecture-body">
          <p class="architecture-kicker">A document-defined form</p>
          <h3 class="architecture-title">The source carries its own authoring model.</h3>
          <p class="architecture-lede">The component contains no field list, document selectors, or domain-specific branches. It extracts ordinary RDF statements, builds controls from SHACL property shapes, and follows Web Annotations that correlate those shapes with document content.</p>

          <div class="architecture-flow" role="img" aria-label="Web Annotations connect SHACL property shapes to document targets and one generic authoring component, which updates the visible document, a runtime RDF graph, and portable saved state.">
            <div class="flow-node">
              <span class="flow-label">Document declares</span>
              <strong>Meaning and constraints</strong>
              <ul>
                <li><code>sh:PropertyShape</code></li>
                <li><code>sh:path</code> locates the authored value</li>
                <li>SHACL Core supplies the validation contract</li>
              </ul>
            </div>
            <div class="flow-connector"><span>→</span><code>oa:Annotation</code></div>
            <div class="flow-node engine">
              <span class="flow-label">Generic component</span>
              <strong>IA² RDF Value Editor</strong>
              <ul>
                <li>extract RDF dataset</li>
                <li>create controls</li>
                <li>run an RDF/JS SHACL engine</li>
              </ul>
            </div>
            <div class="flow-connector"><span>→</span><code>accepted value</code></div>
            <div class="flow-node">
              <span class="flow-label">Correlated results</span>
              <strong>One value, connected views</strong>
              <ul>
                <li>visible HTML placeholders</li>
                <li>named runtime RDF graph</li>
                <li>completed source HTML</li>
                <li>portable HTML/RDF or Turtle state</li>
              </ul>
            </div>
          </div>

          <dl class="architecture-claims">
            <div>
              <dt>The source chooses its domain model</dt>
              <dd>RDF Value Editor does not require a legal, publishing, business, or application ontology. A source can use any RDF vocabulary for the resources and properties that its SHACL shapes target.</dd>
            </div>
            <div>
              <dt>SHACL states the rules</dt>
              <dd>Presentation hints such as datatype, counts, defaults, and enumerations determine the control. The complete active property shape is then evaluated by an RDF/JS engine implementing the SHACL Core constraint components, including logical, range, pair, qualified-value, language, class, and nested-shape constraints.</dd>
            </div>
            <div>
              <dt>Annotations correlate every view</dt>
              <dd>An <code>oa:Annotation</code>, normally motivated by <code>oa:describing</code>, uses the property shape as its body and each visible value location as a target. <code>schema:about</code> supplies a focus node when a reusable shape does not declare one. Repeated targets stay synchronized without field-specific selectors.</dd>
            </div>
            <div>
              <dt>Choices project alternative content</dt>
              <dd>An <code>oa:Choice</code> body lists scoped <code>oa:SpecificResource</code> alternatives. Each alternative identifies an inert HTML template as its source and the selected option as its scope. <code>oa:editing</code> states the annotation's motivation. The same scoped-resource pattern makes a field conditional.</dd>
            </div>
            <div>
              <dt>Valid input becomes RDF</dt>
              <dd>The shape's target and path become the subject and predicate. Accepted input is emitted into the host-selected named graph; invalid input stays out of that graph.</dd>
            </div>
            <div>
              <dt>Save offers the completed document and portable state separately</dt>
              <dd>Choose a clean completed HTML/RDF copy with valid values and selected alternatives applied, or a smaller HTML/RDF or Turtle values document linked to the source with PROV. Every Save action downloads one selected artifact. Load reads either kind, resolves the same RDF identities, and sends every accepted value through the normal validation and projection path.</dd>
            </div>
          </dl>

          <pre class="connector-example" aria-label="Generic annotation example">&lt;a href="http://www.w3.org/ns/oa#Annotation"
   rdf-subject="#field-presentation"
   rdf-predicate="http://www.w3.org/1999/02/22-rdf-syntax-ns#type"&gt;&lt;/a&gt;
&lt;a href="http://www.w3.org/ns/oa#describing"
   rdf-subject="#field-presentation"
   rdf-predicate="http://www.w3.org/ns/oa#motivatedBy"&gt;&lt;/a&gt;
&lt;a href="#some-property-shape"
   rdf-subject="#field-presentation"
   rdf-predicate="http://www.w3.org/ns/oa#hasBody"&gt;&lt;/a&gt;
&lt;a href="#visible-value"
   rdf-subject="#field-presentation"
   rdf-predicate="http://www.w3.org/ns/oa#hasTarget"&gt;&lt;/a&gt;</pre>
        </div>
        <footer class="architecture-footer">
          <span>${this.#bindings.length} controls discovered from this document's RDF dataset</span>
        </footer>
      </section>
    `;

    this.#launcher = root.querySelector<HTMLButtonElement>(".launcher");
    this.#drawer = root.querySelector<HTMLElement>(".drawer");
    this.#quickEditor = root.querySelector<HTMLElement>(".quick-editor");
    this.#quickBody = root.querySelector<HTMLElement>(".quick-body");
    this.#progress = root.querySelector<HTMLElement>(".progress");
    this.#controls = root.querySelector<HTMLElement>(".controls");
    this.#helpTrigger = root.querySelector<HTMLButtonElement>(".how-link");
    this.#helpWindow = root.querySelector<HTMLElement>(".architecture-window");
    this.#dataStatus = root.querySelector<HTMLElement>(".data-status");
    this.#loadInput = root.querySelector<HTMLInputElement>(".load-input");
    this.#launcher?.addEventListener("click", () => this.open());
    root.querySelector(".quick-expand")?.addEventListener("click", () => this.#expandQuickEditor());
    root.querySelector(".quick-prev")?.addEventListener("click", () => this.#navigateQuickEditor(-1));
    root.querySelector(".quick-next")?.addEventListener("click", () => this.#navigateQuickEditor(1));
    root.querySelector(".quick-done")?.addEventListener("click", () => void this.#finishQuickEditor());
    this.#quickEditor?.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        this.#hideQuickEditor(true);
        return;
      }
      if (
        event.key !== "Enter"
        || event.isComposing
        || event.altKey
        || event.ctrlKey
        || event.metaKey
        || event.shiftKey
        || !(event.target instanceof HTMLElement)
        || !event.target.matches("input, select")
      ) return;
      const next = this.#quickEditor?.querySelector<HTMLButtonElement>(".quick-next");
      if (!next || next.disabled) return;
      event.preventDefault();
      this.#navigateQuickEditor(1);
    });
    root.querySelector(".close")?.addEventListener("click", () => this.close());
    root.querySelector(".apply-defaults")?.addEventListener("click", () => this.#applyDefaults());
    root.querySelector(".load-values")?.addEventListener("click", () => this.#loadInput?.click());
    root.querySelector(".save-artifact")?.addEventListener("click", async () => {
      const choice = root.querySelector<HTMLSelectElement>(".save-choice")?.value;
      try {
        await this.validate();
        if (choice === "values-turtle") this.saveArtifact("values", "turtle");
        else if (choice === "values-html") this.saveArtifact("values", "html");
        else this.saveArtifact("completed");
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        this.#setDataStatus(`Could not save document: ${message}`, "error");
      }
    });
    this.#loadInput?.addEventListener("change", async () => {
      const file = this.#loadInput?.files?.[0];
      if (!file) return;
      await this.loadCompletionFile(file);
      if (this.#loadInput) this.#loadInput.value = "";
    });
    this.#drawer?.querySelector(".drawer-head")
      ?.addEventListener("pointerdown", (event) => {
        if (!this.#drawer) return;
        startFloatingWindowDrag(event as PointerEvent, this.#drawer, {
          disabled: this.#position !== "floating" || this.getAttribute("positioning") === "fixed",
        });
      });
    this.#drawer?.querySelectorAll<HTMLElement>(".ia2-window-resize-handle")
      .forEach((handle) => {
        handle.addEventListener("pointerdown", (event) => {
          if (!this.#drawer) return;
          startWindowResize(
            event as PointerEvent,
            this.#drawer,
            this.#position,
            handle.dataset.resize as WindowResizeDirection,
            {
              disabled: this.getAttribute("positioning") === "fixed",
            },
          );
        });
      });
    const editorPositionSwitch = this.#drawer?.querySelector<HTMLElement>(".editor-position-switch");
    if (editorPositionSwitch) {
      bindWindowPositionControls(editorPositionSwitch, (position) => this.setPosition(position));
    }
    const syncSwitch = root.querySelector<HTMLElement>(".sync-switch");
    if (syncSwitch) {
      this.#syncControlCleanup = bindScrollSyncControls(syncSwitch, (mode) => (
        this.setSyncMode(mode)
      ));
    }
    this.#helpTrigger?.addEventListener("click", () => this.#openHelp());
    root.querySelector(".help-close")?.addEventListener("click", () => this.#closeHelp());
    this.#helpWindow?.addEventListener("keydown", (event) => {
      if (event.key === "Escape") this.#closeHelp();
    });
    this.#drawer?.addEventListener("keydown", (event) => {
      if (event.key === "Escape") this.close();
    });

    this.#renderControls();
    this.#configureSync();
  }

  #renderControls(): void {
    if (!this.#controls) return;
    this.#bindingControls.clear();
    this.#bindingRows.clear();
    if (this.#bindings.length === 0) {
      this.#controls.innerHTML = '<p class="empty">This source does not connect any authorable SHACL property shapes to visible placeholders.</p>';
      return;
    }

    let currentGroupKey: string | undefined;
    let group: HTMLElement | undefined;
    this.#bindings.forEach((binding, index) => {
      if (binding.groupKey !== currentGroupKey) {
        currentGroupKey = binding.groupKey;
        group = this.ownerDocument.createElement("section");
        group.className = "group";
        const heading = this.ownerDocument.createElement("h3");
        heading.className = "group-title";
        heading.textContent = binding.groupLabel;
        group.append(heading);
        this.#controls!.append(group);
      }

      const row = this.ownerDocument.createElement("div");
      row.className = "field";
      this.#bindingRows.set(binding.key, row);
      const id = `ia2-value-${index}`;
      const errorId = `${id}-error`;
      const constraintId = `${id}-constraint`;
      const label = this.ownerDocument.createElement("label");
      label.htmlFor = id;
      label.textContent = binding.label;
      row.append(label);

      if (binding.options.length === 0) {
        const input = this.ownerDocument.createElement("input");
        input.id = id;
        input.name = id;
        input.type = inputType(binding);
        if (binding.datatype === `${XSD}integer`) input.step = "1";
        input.required = binding.required;
        input.value = binding.defaultValue ?? "";
        const constraintText = constraintSummary(binding);
        input.setAttribute(
          "aria-describedby",
          [constraintText ? constraintId : "", errorId].filter(Boolean).join(" "),
        );
        input.addEventListener("input", () => this.#acceptValue(binding, input));
        input.addEventListener("blur", () => this.#acceptValue(binding, input));
        this.#bindingControls.set(binding.key, input);
        row.append(input);
        if (constraintText) {
          const constraint = this.ownerDocument.createElement("p");
          constraint.className = "constraint";
          constraint.id = constraintId;
          constraint.textContent = constraintText;
          row.append(constraint);
        }
      } else {
        const select = this.ownerDocument.createElement("select");
        select.id = id;
        select.name = id;
        select.required = binding.required;
        select.setAttribute("aria-describedby", `${constraintId} ${errorId}`);
        const emptyOption = this.ownerDocument.createElement("option");
        emptyOption.textContent = "Choose an option";
        emptyOption.value = "";
        select.append(emptyOption);
        for (const option of binding.options) {
          const optionElement = this.ownerDocument.createElement("option");
          optionElement.textContent = option.label;
          optionElement.value = option.key;
          select.append(optionElement);
        }
        select.value = binding.defaultValue ?? "";
        select.addEventListener("change", () => this.#acceptValue(binding, select));
        select.addEventListener("blur", () => this.#acceptValue(binding, select));
        this.#bindingControls.set(binding.key, select);
        row.append(select);
        const affectedTargets = new Set(binding.options.flatMap((option) => (
          option.alternatives.map(({ target }) => target)
        )));
        const constraint = this.ownerDocument.createElement("p");
        constraint.className = "constraint";
        constraint.id = constraintId;
        constraint.textContent = [
          binding.required ? "Required" : "Optional",
          `${binding.options.length} declared alternatives`,
          affectedTargets.size > 0
            ? `Updates ${affectedTargets.size} document ${affectedTargets.size === 1 ? "region" : "regions"}`
            : "",
        ].filter(Boolean).join(" · ");
        row.append(constraint);
      }

      const error = this.ownerDocument.createElement("p");
      error.className = "error";
      error.id = errorId;
      error.setAttribute("aria-live", "polite");
      row.append(error);
      group?.append(row);
    });
  }

  #scrollControlIntoEditor(
    control: HTMLInputElement | HTMLSelectElement,
    behavior: ScrollBehavior,
  ): void {
    const controls = this.#controls;
    if (!controls) return;
    if (!controls.scrollTo) {
      control.scrollIntoView?.({ behavior, block: "center" });
      return;
    }
    const controlRect = control.getBoundingClientRect();
    const controlsRect = controls.getBoundingClientRect();
    controls.scrollTo({
      behavior,
      top: controls.scrollTop
        + controlRect.top
        - controlsRect.top
        - (controlsRect.height - controlRect.height) / 2,
    });
  }

  #configureSync(runInitialSync = true): void {
    this.#syncCleanup?.();
    this.#syncCleanup = null;
    for (const row of this.#bindingRows.values()) row.classList.remove("is-corresponding");
    if (
      this.#syncMode === "off"
      || !this.#controls
      || !this.#drawer?.hasAttribute("data-open")
    ) return;
    const view = this.ownerDocument.defaultView;
    if (!view) return;
    const controls = this.#controls;
    const cleanups: Array<() => void> = [];
    let timer: number | null = null;
    let activeAnimation: Animation | null = null;
    let lastBinding: Binding | null = null;
    const listen = (
      target: EventTarget,
      type: string,
      listener: EventListener,
      options?: AddEventListenerOptions,
    ): void => {
      target.addEventListener(type, listener, options);
      cleanups.push(() => target.removeEventListener(type, listener, options));
    };
    const schedule = (callback: () => void): void => {
      if (timer !== null) view.clearTimeout(timer);
      timer = view.setTimeout(() => {
        timer = null;
        callback();
      }, 32);
    };
    const selectBinding = (binding: Binding): void => {
      for (const row of this.#bindingRows.values()) row.classList.remove("is-corresponding");
      this.#bindingRows.get(binding.key)?.classList.add("is-corresponding");
    };
    const emphasizePlaceholder = (placeholder: HTMLElement): void => {
      activeAnimation?.cancel();
      if (view.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
      activeAnimation = placeholder.animate?.(
        [
          { outline: "2px solid transparent", outlineOffset: "7px" },
          { outline: "2px solid oklch(62% 0.18 294)", outlineOffset: "4px" },
        ],
        {
          direction: "alternate",
          duration: 520,
          easing: "cubic-bezier(.22,1,.36,1)",
          iterations: Infinity,
        },
      ) ?? null;
    };
    const clearEmphasis = (): void => {
      activeAnimation?.cancel();
      activeAnimation = null;
    };

    for (const binding of this.#bindings) {
      const row = this.#bindingRows.get(binding.key);
      const control = this.#bindingControls.get(binding.key);
      if (!row || !control || row.hidden || control.disabled) continue;
      for (const placeholder of binding.placeholders) {
        listen(placeholder, "pointerenter", () => {
          selectBinding(binding);
          this.#scrollControlIntoEditor(control, "auto");
        });
        listen(placeholder, "pointerleave", () => {
          row.classList.remove("is-corresponding");
        });
      }
      listen(row, "pointerenter", () => {
        const placeholder = binding.placeholders[0];
        if (!placeholder) return;
        emphasizePlaceholder(placeholder);
        if (this.#syncMode === "panel") {
          placeholder.scrollIntoView({
            behavior: view.matchMedia?.("(prefers-reduced-motion: reduce)").matches
              ? "auto"
              : "smooth",
            block: "center",
          });
        }
      });
      listen(row, "pointerleave", clearEmphasis);
    }

    if (this.#syncMode === "page") {
      const followPage = (): void => {
        if (!this.#drawer?.hasAttribute("data-open")) return;
        const readingLine = Math.min(view.innerHeight * 0.35, 140);
        let closest: Binding | null = null;
        let closestDistance = Number.POSITIVE_INFINITY;
        for (const binding of this.#bindings) {
          if (!this.#isBindingActive(binding)) continue;
          for (const placeholder of binding.placeholders) {
            const rect = placeholder.getBoundingClientRect();
            if (rect.bottom <= 0 || rect.top >= view.innerHeight) continue;
            const distance = Math.abs(rect.top - readingLine);
            if (distance < closestDistance) {
              closest = binding;
              closestDistance = distance;
            }
          }
        }
        if (!closest || closest === lastBinding) return;
        lastBinding = closest;
        selectBinding(closest);
        const control = this.#bindingControls.get(closest.key);
        if (control) this.#scrollControlIntoEditor(control, "auto");
      };
      listen(view, "scroll", () => schedule(followPage), { passive: true });
      listen(view, "resize", () => schedule(followPage), { passive: true });
      if (runInitialSync) schedule(followPage);
    } else {
      const followEditor = (): void => {
        if (!this.#drawer?.hasAttribute("data-open")) return;
        const controlsRect = controls.getBoundingClientRect();
        const readingLine = controlsRect.top + Math.min(controlsRect.height * 0.35, 140);
        let closest: Binding | null = null;
        let closestDistance = Number.POSITIVE_INFINITY;
        for (const binding of this.#bindings) {
          const control = this.#bindingControls.get(binding.key);
          if (!control || control.disabled) continue;
          const rect = control.getBoundingClientRect();
          if (rect.bottom <= controlsRect.top || rect.top >= controlsRect.bottom) continue;
          const distance = Math.abs(rect.top - readingLine);
          if (distance < closestDistance) {
            closest = binding;
            closestDistance = distance;
          }
        }
        if (!closest || closest === lastBinding) return;
        const placeholder = closest.placeholders[0];
        if (!placeholder) return;
        lastBinding = closest;
        selectBinding(closest);
        placeholder.scrollIntoView({ behavior: "auto", block: "center" });
        emphasizePlaceholder(placeholder);
      };
      listen(controls, "scroll", () => schedule(followEditor), { passive: true });
      if (runInitialSync) schedule(followEditor);
    }

    this.#syncCleanup = () => {
      for (const cleanup of cleanups) cleanup();
      if (timer !== null) view.clearTimeout(timer);
      clearEmphasis();
      for (const row of this.#bindingRows.values()) row.classList.remove("is-corresponding");
    };
  }

  #acceptValue(
    binding: Binding,
    control: HTMLInputElement | HTMLSelectElement,
  ): void {
    binding.touched = true;
    binding.value = control.value;
    this.#validationPromise = this.#validateAndProject();
  }

  #updateError(control: HTMLInputElement | HTMLSelectElement, message: string): void {
    const row = control.closest(".field");
    const error = row?.querySelector<HTMLElement>(".error");
    if (error) error.textContent = message;
  }

  #representationError(binding: Binding): string {
    const normalized = binding.value.trim();
    if (!normalized) return "";
    if (binding.options.length > 0 && !this.#selectedOption(binding)) {
      return "Choose a value permitted by this SHACL shape.";
    }
    if (binding.valueKind === "NamedNode") {
      try {
        const iri = new URL(normalized);
        if (!iri.protocol) throw new Error("Missing scheme.");
      } catch {
        return "Enter an absolute IRI.";
      }
    }
    return "";
  }

  async #validateAndProject(): Promise<RdfValueEditorValidationResult> {
    const version = ++this.#validationVersion;
    const active = this.#activeBindings();
    const validationBindings: ShaclAuthoringBinding[] = this.#bindings.map((binding) => {
      const representationError = this.#representationError(binding);
      const object = representationError ? undefined : this.#bindingTerm(binding);
      return {
        key: binding.key,
        shape: binding.shape,
        subject: binding.subject,
        path: binding.path,
        active: active.has(binding),
        ...(object ? { object } : {}),
        ...(representationError ? { representationError } : {}),
      };
    });

    try {
      const validation = await validateShaclAuthoringState(
        this.#sourceQuads,
        validationBindings,
      );
      const issues: RdfValueEditorValidationIssue[] = this.#bindings.flatMap((binding) => {
        const messages = validation.messages.get(binding.key);
        return messages
          ? [{
              bindingKey: binding.key,
              focusNode: binding.subject,
              label: binding.label,
              messages,
              path: binding.path,
              shape: binding.shape,
            }]
          : [];
      });
      const result = {
        conforms: validation.conforms,
        issues,
        resultCount: validation.resultCount,
      };
      if (version !== this.#validationVersion || !this.isConnected) return result;
      this.#validatedVersion = version;

      for (const binding of this.#bindings) {
        binding.error = validation.messages.get(binding.key)?.join(" ") ?? "";
        const control = this.#bindingControls.get(binding.key);
        if (!control) continue;
        const visibleError = binding.touched ? binding.error : "";
        control.setCustomValidity(visibleError);
        control.setAttribute("aria-invalid", visibleError ? "true" : "false");
        this.#updateError(control, visibleError);
      }
      if (this.#dataStatus?.dataset.code === "shacl-validation") {
        this.#dataStatus.hidden = true;
        this.#dataStatus.textContent = "";
        delete this.#dataStatus.dataset.code;
      }
      this.#projectAll();
      this.dispatchEvent(new CustomEvent("ia2-rdf-value-editor-validation", {
        bubbles: true,
        composed: true,
        detail: result,
      }));
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      const result = {
        conforms: false,
        issues: this.#bindings
          .filter((binding) => active.has(binding))
          .map((binding) => ({
            bindingKey: binding.key,
            focusNode: binding.subject,
            label: binding.label,
            messages: ["SHACL validation could not run."],
            path: binding.path,
            shape: binding.shape,
          })),
        resultCount: 1,
      };
      if (version !== this.#validationVersion || !this.isConnected) return result;
      this.#validatedVersion = version;
      for (const binding of this.#bindings) {
        binding.error = active.has(binding) ? "SHACL validation could not run." : "";
        const control = this.#bindingControls.get(binding.key);
        if (!control) continue;
        const visibleError = binding.touched ? binding.error : "";
        control.setCustomValidity(visibleError);
        control.setAttribute("aria-invalid", visibleError ? "true" : "false");
        this.#updateError(control, visibleError);
      }
      this.#setDataStatus(
        `SHACL validation could not run: ${message}`,
        "error",
        "shacl-validation",
      );
      this.#projectAll();
      this.dispatchEvent(new CustomEvent("ia2-rdf-value-editor-validation", {
        bubbles: true,
        composed: true,
        detail: result,
      }));
      return result;
    }
  }

  #projectAll(): void {
    for (const binding of this.#bindings) {
      const option = this.#selectedOption(binding);
      const displayValue = option?.label ?? binding.value;
      const valid = Boolean(binding.value.trim()) && !binding.error;

      for (const placeholder of binding.placeholders) {
        placeholder.textContent = displayValue || this.#originalText.get(placeholder) || "";
        placeholder.dataset.valueState = !binding.value.trim()
          ? binding.options.length === 0 && binding.defaultValue !== undefined ? "default" : "empty"
          : valid ? "filled" : "invalid";
      }
    }

    this.#projectRenderingAlternatives();
    this.#updateActiveBindings();
    this.#renderRuntimeData();
    this.#updateProgress();
  }

  #projectRenderingAlternatives(): void {
    for (const [target, state] of this.#renderingTargetStates) {
      target.hidden = state.hidden;
      target.replaceChildren(...state.childNodes);
      delete target.dataset.valueAlternative;
    }
    const active = this.#activeBindings();
    const operations = new Map<string, RenderingAlternative>();
    const conflicts = new Set<string>();
    for (const binding of active) {
      if (binding.options.length === 0 || !binding.value || binding.error) continue;
      const option = this.#selectedOption(binding);
      if (!option) continue;
      for (const alternative of option.alternatives) {
        const key = alternative.target.id || alternative.resource;
        if (operations.has(key)) conflicts.add(key);
        else operations.set(key, alternative);
      }
    }
    for (const [key, alternative] of operations) {
      if (conflicts.has(key)) continue;
      alternative.target.replaceChildren(...replacementNodes(alternative.template));
      alternative.target.hidden = !alternative.template.content.hasChildNodes();
      alternative.target.dataset.valueAlternative = alternative.resource;
    }
    if (conflicts.size > 0) {
      this.#setDataStatus(
        `${conflicts.size} conflicting active document ${conflicts.size === 1 ? "alternative was" : "alternatives were"} ignored.`,
        "warning",
        "alternative-conflict",
      );
    } else if (this.#dataStatus?.dataset.code === "alternative-conflict") {
      this.#dataStatus.hidden = true;
      this.#dataStatus.textContent = "";
      delete this.#dataStatus.dataset.code;
    }
  }

  #updateActiveBindings(): void {
    const activeBindings = this.#activeBindings();
    for (const binding of this.#bindings) {
      const active = this.#isBindingActive(binding, activeBindings);
      const row = this.#bindingRows.get(binding.key);
      const control = this.#bindingControls.get(binding.key);
      if (row) {
        row.hidden = !active;
        row.classList.toggle("is-inactive", !active);
      }
      if (control) control.disabled = !active;
    }
    for (const group of this.#controls?.querySelectorAll<HTMLElement>(".group") ?? []) {
      group.hidden = Array.from(group.querySelectorAll<HTMLElement>(".field"))
        .every((row) => row.hidden);
    }
    for (const state of this.#backlinkStates) {
      const active = this.#isBindingActive(state.binding, activeBindings);
      const controllingBinding = active ? undefined : this.#controllingBinding(state.binding);
      const ariaLabel = controllingBinding
        ? `Resolve ${controllingBinding.label} before editing ${state.binding.label}`
        : `Edit ${state.binding.label}`;
      const title = `${ariaLabel} in ${this.#panelLabel()}`;
      state.placeholder.setAttribute("aria-label", ariaLabel);
      state.placeholder.setAttribute("title", title);
    }
    if (this.#quickEditor?.hasAttribute("data-open")) {
      this.#updateQuickNavigation();
      this.#positionQuickEditor();
    }
    if (this.#syncMode !== "off" && this.#drawer?.hasAttribute("data-open")) {
      this.#configureSync();
    }
  }

  #bindingTerm(binding: Binding): AuthorValue | undefined {
    const option = this.#selectedOption(binding);
    if (option) return option.term;
    if (!binding.value.trim() || binding.options.length > 0) return undefined;
    return binding.valueKind === "NamedNode"
      ? { termType: "NamedNode", value: binding.value.trim() }
      : {
          termType: "Literal",
          value: binding.value,
          datatype: {
            termType: "NamedNode",
            value: binding.datatype ?? `${XSD}string`,
          },
          language: "",
        };
  }

  #completionDocument(): CompletionDocument {
    const sourceDocument = this.#sourceDocument();
    const view = sourceDocument.defaultView;
    const uuid = view?.crypto?.randomUUID?.();
    const stateIri = uuid
      ? `urn:uuid:${uuid}`
      : `urn:ia2:completion-state:${Date.now().toString(36)}`;
    const records: CompletionRecord[] = [];
    for (const binding of this.#bindings) {
      if (!this.#isBindingActive(binding) || !binding.value.trim() || binding.error) continue;
      const object = this.#bindingTerm(binding);
      if (!object) continue;
      records.push({
        label: binding.label,
        subject: binding.subject,
        predicate: binding.path,
        object: {
          termType: object.termType,
          value: object.value,
          ...(object.termType === "Literal"
            ? {
                datatype: object.datatype.value,
                ...(object.language ? { language: object.language } : {}),
                ...(object.direction ? { direction: object.direction } : {}),
              }
            : {}),
        },
      });
    }
    return {
      createdAt: new Date().toISOString(),
      records,
      sourceDocumentIri: this.#sourceDocumentIri,
      stateIri,
      title: `${sourceDocument.title || "Document"} completion values`,
    };
  }

  #contentTypeForFilename(filename?: string): string | undefined {
    if (!filename) return undefined;
    if (/\.html?$/i.test(filename)) return "text/html";
    if (/\.ttl$/i.test(filename)) return "text/turtle";
    if (/\.trig$/i.test(filename)) return "application/trig";
    return undefined;
  }

  #setDataStatus(
    message: string,
    state: "error" | "success" | "warning",
    code?: string,
  ): void {
    if (!this.#dataStatus) return;
    this.#dataStatus.textContent = message;
    this.#dataStatus.dataset.state = state;
    if (code) this.#dataStatus.dataset.code = code;
    else delete this.#dataStatus.dataset.code;
    this.#dataStatus.hidden = false;
  }

  #resetCompletion(): void {
    this.#validationVersion += 1;
    for (const binding of this.#bindings) {
      binding.value = "";
      binding.touched = false;
      binding.error = "";
      const control = this.#bindingControls.get(binding.key);
      if (control) {
        control.value = binding.defaultValue ?? "";
        control.setCustomValidity("");
        control.setAttribute("aria-invalid", "false");
        this.#updateError(control, "");
      }
      for (const placeholder of binding.placeholders) {
        placeholder.textContent = this.#originalText.get(placeholder) ?? "";
        placeholder.dataset.valueState = binding.options.length === 0 && binding.defaultValue !== undefined
          ? "default"
          : "empty";
      }
    }
    this.#projectRenderingAlternatives();
    this.#updateActiveBindings();
    this.#renderRuntimeData();
    this.#updateProgress();
  }

  #applyDefaults(): void {
    let changed = false;
    for (const binding of this.#bindings) {
      const control = this.#bindingControls.get(binding.key);
      if (
        !control
        || !this.#isBindingActive(binding)
        || binding.defaultValue === undefined
        || binding.touched
      ) continue;
      control.value = binding.defaultValue;
      binding.touched = true;
      binding.value = control.value;
      changed = true;
    }
    if (changed) this.#validationPromise = this.#validateAndProject();
  }

  #renderRuntimeData(): void {
    if (!this.#runtimeData) return;
    this.#runtimeData.replaceChildren();
    const graph = this.getAttribute("runtime-graph") || "#runtime-graph";
    const activeSet = this.#activeBindings();
    const activeBindings = this.#bindings.filter((binding) => activeSet.has(binding));

    for (const binding of activeBindings) {
      if (!binding.value.trim() || binding.error) continue;
      const object = this.#bindingTerm(binding);
      if (!object) continue;
      if (object.termType === "NamedNode") {
        const carrier = this.#sourceDocument().createElement("a");
        carrier.href = object.value;
        carrier.setAttribute("rdf-subject", binding.subject);
        carrier.setAttribute("rdf-predicate", binding.path);
        carrier.setAttribute("rdf-graph", graph);
        this.#runtimeData.append(carrier);
        continue;
      }
      const carrier = this.#sourceDocument().createElement("data");
      carrier.value = object.value;
      carrier.setAttribute("rdf-subject", binding.subject);
      carrier.setAttribute("rdf-predicate", binding.path);
      carrier.setAttribute("rdf-datatype", object.datatype.value);
      carrier.setAttribute("rdf-graph", graph);
      this.#runtimeData.append(carrier);

    }

    const sourceDocument = this.#sourceDocument();
    const detail = {
      complete: activeBindings.filter((binding) => binding.value.trim() && !binding.error).length,
      total: activeBindings.length,
    };
    const EventConstructor = sourceDocument.defaultView?.CustomEvent ?? CustomEvent;
    sourceDocument.dispatchEvent(new EventConstructor(HTML_RDF_DATASET_CHANGE_EVENT, { detail }));
    sourceDocument.dispatchEvent(new EventConstructor("ia2-rdf-value-editor-change", { detail }));
  }

  #updateProgress(): void {
    const activeBindings = this.#bindings.filter((binding) => this.#isBindingActive(binding));
    const complete = activeBindings.filter((binding) => binding.value.trim() && !binding.error).length;
    const required = activeBindings.filter((binding) => binding.required).length;
    const requiredComplete = activeBindings.filter(
      (binding) => binding.required && binding.value.trim() && !binding.error,
    ).length;
    if (this.#progress) {
      this.#progress.textContent = required > 0
        ? `${requiredComplete} of ${required} required values complete`
        : `${complete} values complete`;
    }
    const count = this.#launcher?.querySelector<HTMLElement>(".count");
    if (count) count.textContent = String(Math.max(required - requiredComplete, 0));
  }
}
