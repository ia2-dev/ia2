import {
  DEFAULT_LABEL_PREDICATES,
  HTML_RDF_DATASET_CHANGE_EVENT,
  extractDataset,
  labelMap,
  projectQuadsToDefaultGraph,
  toRdfJsDataset,
  type ExtractionRoot,
  type ExtractionResult,
  type ObjectTerm,
  type Quad,
} from "@ia2-dev/html-rdf";
import rdfDataModel from "@rdfjs/data-model";
import rdfDataset from "@rdfjs/dataset";
import { diffQuads, type SemanticChange } from "./diff.js";
import type {
  PolicyFinding,
  PolicyValidationResult,
} from "./validation.js";

const SH_NAME = "http://www.w3.org/ns/shacl#name";

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function localName(iri: string): string {
  try {
    const url = new URL(iri);
    const fragment = decodeURIComponent(url.hash.slice(1));
    if (fragment) return fragment.replaceAll(/[-_]+/g, " ");
    const segment = decodeURIComponent(url.pathname.split("/").filter(Boolean).at(-1) ?? "");
    return (segment || url.hostname).replaceAll(/[-_]+/g, " ");
  } catch {
    return iri;
  }
}

function withoutFragment(iri: string): string {
  const url = new URL(iri);
  url.hash = "";
  return url.href;
}

function isDocument(root: ExtractionRoot): root is Document {
  return root.nodeType === 9;
}

function documentForRoot(root: ExtractionRoot): Document {
  return isDocument(root) ? root : root.ownerDocument;
}

function objectValue(term: ObjectTerm): string {
  if (term.termType === "Literal") return term.value;
  if (term.termType === "Triple") return "quoted statement";
  return term.value;
}

function selectedElement(
  document: Document,
  selector: string,
): { element: Element | null; valid: boolean } {
  try {
    return { element: document.querySelector(selector), valid: true };
  } catch {
    return { element: null, valid: false };
  }
}

export class Ia2RdfPolicyReviewer extends HTMLElement {
  static observedAttributes = [
    "change-events",
    "diff-graphs",
    "heading",
    "profile-root",
    "source-frame",
    "source-root",
  ];

  #changes: SemanticChange[] = [];
  #configuredProfileRoot: ExtractionRoot | null = null;
  #configuredSourceRoot: ExtractionRoot | null = null;
  #connectionVersion = 0;
  #current?: ExtractionResult;
  #baselineQuads: Quad[] | undefined;
  #frame: HTMLIFrameElement | undefined;
  #labels = new Map<string, string>();
  #mutationObserver: MutationObserver | undefined;
  #profile?: ExtractionResult;
  #refreshTimer?: number;
  #refreshVersion = 0;
  #result?: PolicyValidationResult;
  #sourceChangeEvents: string[] = [];
  #sourceRoot?: ExtractionRoot;
  #status = "Waiting for the reviewed document.";

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback(): void {
    this.#render();
    void this.#connect();
  }

  disconnectedCallback(): void {
    this.#disconnectSource();
    this.#frame?.removeEventListener("load", this.#handleFrameLoad);
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue || !this.isConnected) return;
    if (name === "heading") {
      this.#render();
      return;
    }
    queueMicrotask(() => void this.#connect());
  }

  get sourceRoot(): ExtractionRoot | null {
    return this.#configuredSourceRoot;
  }

  set sourceRoot(root: ExtractionRoot | null) {
    this.#configuredSourceRoot = root;
    if (this.isConnected) void this.#connect();
  }

  get profileRoot(): ExtractionRoot | null {
    return this.#configuredProfileRoot;
  }

  set profileRoot(root: ExtractionRoot | null) {
    this.#configuredProfileRoot = root;
    if (this.isConnected) void this.#connect();
  }

  get validationResult(): PolicyValidationResult | undefined {
    return this.#result;
  }

  get semanticChanges(): readonly SemanticChange[] {
    return this.#changes;
  }

  async refresh(): Promise<PolicyValidationResult | undefined> {
    if (!this.#sourceRoot || !this.#profile) return undefined;
    const version = ++this.#refreshVersion;
    const current = extractDataset(this.#sourceRoot);
    if (current.diagnostics.some(({ severity }) => severity === "error")) {
      this.#status = "The reviewed document contains RDF extraction errors.";
      this.#render();
      return undefined;
    }

    const graphFilter = this.#graphFilter(current.sourceDocumentIri);
    const hadBaseline = Boolean(this.#baselineQuads);
    let diffIssue = "";
    let changes: SemanticChange[] = [];
    if (this.#baselineQuads) {
      try {
        changes = diffQuads(this.#baselineQuads, current.quads, graphFilter);
      } catch (error) {
        diffIssue = error instanceof Error ? error.message : String(error);
      }
    }
    const data = toRdfJsDataset(
      projectQuadsToDefaultGraph(current.quads),
      rdfDataModel,
      rdfDataset,
    );
    const shapes = toRdfJsDataset(
      projectQuadsToDefaultGraph(this.#profile.quads),
      rdfDataModel,
      rdfDataset,
    );
    const { validatePolicy } = await import("./validation.js");
    const result = await validatePolicy(data, shapes, {
      languages: [this.ownerDocument.documentElement.lang || "en"],
    });
    if (version !== this.#refreshVersion || !this.isConnected) return result;

    this.#current = current;
    this.#baselineQuads ??= [...current.quads];
    this.#result = result;
    this.#labels = labelMap([...current.quads, ...this.#profile.quads], {
      predicates: [...DEFAULT_LABEL_PREDICATES, SH_NAME],
      languages: [this.ownerDocument.documentElement.lang || "en"],
    });
    this.#changes = changes;
    this.#status = diffIssue || (changes.length > 0
      ? `${changes.length} semantic ${changes.length === 1 ? "change" : "changes"} since review began.`
      : hadBaseline
        ? "The document matches the review baseline."
        : "Policy profile loaded.");
    this.#render();
    this.dispatchEvent(new CustomEvent("ia2-rdf-policy-review", {
      bubbles: true,
      composed: true,
      detail: {
        changes,
        result,
        sourceDocumentIri: current.sourceDocumentIri,
      },
    }));
    return result;
  }

  async #connect(): Promise<void> {
    this.#disconnectSource();
    this.#frame?.removeEventListener("load", this.#handleFrameLoad);
    this.#frame = undefined;
    const profileSelector = this.getAttribute("profile-root")?.trim();
    const profileSelection = profileSelector
      ? selectedElement(this.ownerDocument, profileSelector)
      : { element: this.ownerDocument, valid: true };
    if (!profileSelection.valid) {
      this.#status = `Policy profile root is not valid CSS: ${profileSelector}`;
      this.#render();
      return;
    }
    const profileRoot = this.#configuredProfileRoot ?? profileSelection.element;
    if (!profileRoot) {
      this.#status = `Policy profile root not found: ${profileSelector}`;
      this.#render();
      return;
    }
    this.#profile = extractDataset(profileRoot);
    if (this.#profile.diagnostics.some(({ severity }) => severity === "error")) {
      this.#status = "The policy profile contains RDF extraction errors.";
      this.#render();
      return;
    }

    if (this.#configuredSourceRoot) {
      await this.#connectSource(this.#configuredSourceRoot);
      return;
    }

    const frameSelector = this.getAttribute("source-frame")?.trim();
    if (frameSelector) {
      const frameSelection = selectedElement(this.ownerDocument, frameSelector);
      const frame = frameSelection.element;
      if (!frameSelection.valid) {
        this.#status = `Reviewed document frame is not valid CSS: ${frameSelector}`;
        this.#render();
        return;
      }
      if (!(frame instanceof HTMLIFrameElement)) {
        this.#status = `Reviewed document frame not found: ${frameSelector}`;
        this.#render();
        return;
      }
      this.#frame = frame;
      frame.addEventListener("load", this.#handleFrameLoad);
      const framedDocument = frame.contentDocument;
      if (framedDocument && framedDocument.URL !== "about:blank") {
        // The module defining this element can execute after the iframe's load
        // event has already fired. Connect to any real same-origin document
        // immediately; a later load event will reconnect after navigation.
        await this.#connectSource(framedDocument);
      }
      return;
    }

    const rootSelector = this.getAttribute("source-root")?.trim();
    const rootSelection = rootSelector
      ? selectedElement(this.ownerDocument, rootSelector)
      : { element: this.ownerDocument, valid: true };
    if (!rootSelection.valid) {
      this.#status = `Reviewed document root is not valid CSS: ${rootSelector}`;
      this.#render();
      return;
    }
    const root = rootSelection.element;
    if (!root) {
      this.#status = `Reviewed document root not found: ${rootSelector}`;
      this.#render();
      return;
    }
    await this.#connectSource(root);
  }

  #handleFrameLoad = (): void => {
    const source = this.#frame?.contentDocument;
    if (source) void this.#connectSource(source);
    else {
      this.#status = "The reviewed document frame is not same-origin and cannot be inspected.";
      this.#render();
    }
  };

  async #connectSource(root: ExtractionRoot): Promise<void> {
    const connectionVersion = ++this.#connectionVersion;
    this.#disconnectSource();
    this.#sourceRoot = root;
    this.#baselineQuads = undefined;
    this.#changes = [];
    await this.refresh();
    if (
      connectionVersion !== this.#connectionVersion
      || (this.#frame && this.#frame.contentDocument !== root)
    ) return;
    const document = documentForRoot(root);
    const Observer = document.defaultView?.MutationObserver ?? MutationObserver;
    this.#mutationObserver = new Observer(() => this.#scheduleRefresh());
    this.#sourceChangeEvents = (
      this.getAttribute("change-events")
      ?? HTML_RDF_DATASET_CHANGE_EVENT
    ).split(/\s+/).filter(Boolean);
    for (const eventName of this.#sourceChangeEvents) {
      document.addEventListener(eventName, this.#handleSourceChange);
    }
    try {
      this.#mutationObserver.observe(
        isDocument(root) ? root.documentElement : root,
        { attributes: true, characterData: true, childList: true, subtree: true },
      );
    } catch {
      // Some embedded-document hosts reject cross-realm MutationObserver
      // targets. Components can still publish their ordinary change event,
      // which is the preferred low-latency integration for framed sources.
      this.#mutationObserver = undefined;
    }
  }

  #disconnectSource(): void {
    this.#mutationObserver?.disconnect();
    this.#mutationObserver = undefined;
    const root = this.#sourceRoot;
    const document = root && documentForRoot(root);
    for (const eventName of this.#sourceChangeEvents) {
      document?.removeEventListener(eventName, this.#handleSourceChange);
    }
    this.#sourceChangeEvents = [];
    if (this.#refreshTimer !== undefined) window.clearTimeout(this.#refreshTimer);
  }

  #handleSourceChange = (): void => this.#scheduleRefresh();

  #scheduleRefresh(): void {
    if (this.#refreshTimer !== undefined) window.clearTimeout(this.#refreshTimer);
    this.#refreshTimer = window.setTimeout(() => void this.refresh(), 80);
  }

  #graphFilter(sourceDocumentIri: string): ReadonlySet<string> | undefined {
    const values = this.getAttribute("diff-graphs")?.trim().split(/\s+/).filter(Boolean);
    if (!values?.length) return undefined;
    return new Set(values.flatMap((value) => {
      try {
        return [new URL(value, sourceDocumentIri).href];
      } catch {
        return [];
      }
    }));
  }

  #label(iri: string | undefined): string {
    if (!iri) return "Policy finding";
    return this.#labels.get(iri) ?? localName(iri);
  }

  #termLabel(term: ObjectTerm): string {
    if (term.termType === "Literal") return term.value;
    if (term.termType === "Triple") return "quoted statement";
    return this.#label(term.value);
  }

  #targetButton(target: string | undefined, label = "Show in document"): string {
    if (!target) return "";
    return `<button class="target" type="button" data-target="${escapeHtml(target)}">${escapeHtml(label)}</button>`;
  }

  #findingMarkup(finding: PolicyFinding): string {
    const targets = finding.targets.length > 0
      ? finding.targets
      : finding.focusNode ? [finding.focusNode] : [];
    return `
      <article class="finding" data-severity="${finding.severity}">
        <div class="finding-heading">
          <span class="severity"${finding.severityIri ? ` title="${escapeHtml(finding.severityIri)}"` : ""}>${escapeHtml(finding.severity)}</span>
          <h3>${escapeHtml(finding.name)}</h3>
        </div>
        <p>${escapeHtml(finding.message)}</p>
        ${targets.map((target, index) => this.#targetButton(
          target,
          targets.length === 1 ? "Show in document" : `Show target ${index + 1}`,
        )).join("")}
      </article>
    `;
  }

  #changeMarkup(change: SemanticChange): string {
    const { quad } = change;
    const object = this.#termLabel(quad.object);
    const computedSubject = this.#label(quad.subject.value);
    const subject = (
      quad.object.termType === "Literal"
      && computedSubject === quad.object.value
      && [...DEFAULT_LABEL_PREDICATES, SH_NAME].includes(quad.predicate.value)
    )
      ? localName(quad.subject.value)
      : computedSubject;
    const predicate = this.#label(quad.predicate.value);
    const previousObject = change.kind === "changed"
      ? this.#termLabel(change.previousQuad.object)
      : "";
    const target = quad.subject.termType === "NamedNode" ? quad.subject.value : undefined;
    return `
      <li class="change" data-kind="${change.kind}">
        <span class="change-kind">${change.kind}</span>
        <span class="statement">
          <strong>${escapeHtml(subject)}</strong>
          <span>${escapeHtml(predicate)}</span>
          ${change.kind === "changed"
            ? `<span class="replacement"><del>${escapeHtml(previousObject)}</del><span aria-hidden="true">→</span><b>${escapeHtml(object)}</b></span>`
            : `<b>${escapeHtml(object)}</b>`}
        </span>
        ${this.#targetButton(target, "Locate")}
      </li>
    `;
  }

  #render(): void {
    if (!this.shadowRoot) return;
    const findings = this.#result?.findings ?? [];
    const violations = findings.filter(({ severity }) => severity === "violation").length;
    const warnings = findings.filter(({ severity }) => severity === "warning").length;
    const summary = this.#result
      ? findings.length === 0
        ? "No policy findings"
        : `${findings.length} ${findings.length === 1 ? "finding" : "findings"}`
      : "Loading policy";
    this.shadowRoot.innerHTML = `
      <style>${styles}</style>
      <section class="reviewer" aria-label="Executable policy review">
        <header class="header">
          <div>
            <p class="eyebrow">External review profile</p>
            <h2>${escapeHtml(this.getAttribute("heading") || "Live policy review")}</h2>
            <p class="intro">SHACL Core and SHACL-SPARQL run against the document's current RDF dataset. The policy remains in this review artifact.</p>
          </div>
          <div class="summary" aria-live="polite">
            <strong>${escapeHtml(summary)}</strong>
            <span>${violations} blocking · ${warnings} advisory</span>
          </div>
        </header>
        <div class="status" role="status">${escapeHtml(this.#status)}</div>
        <section class="section" aria-labelledby="policy-findings-title">
          <div class="section-heading">
            <h3 id="policy-findings-title">Policy findings</h3>
            <button class="rerun" type="button">Rerun</button>
          </div>
          <div class="findings">
            ${findings.length
              ? findings.map((finding) => this.#findingMarkup(finding)).join("")
              : `<p class="empty">${this.#result ? "The current RDF dataset conforms to the supplied profile." : "Waiting for the document and profile."}</p>`}
          </div>
        </section>
        <section class="section changes-section" aria-labelledby="semantic-changes-title">
          <div class="section-heading">
            <div>
              <h3 id="semantic-changes-title">Semantic consequence diff</h3>
              <p class="baseline-note">Compared with the document when review began</p>
            </div>
            <span class="count">${this.#changes.length} ${this.#changes.length === 1 ? "change" : "changes"}</span>
          </div>
          ${this.#changes.length
            ? `<ol class="changes">${this.#changes.map((change) => this.#changeMarkup(change)).join("")}</ol>`
            : `<p class="empty">Change a value or drafting choice in the document to see added and removed RDF statements.</p>`}
        </section>
        <details>
          <summary>Why this is generic</summary>
          <p>The component discovers a source dataset and a separate shapes dataset. Names, conditions, severities, SPARQL tests, and clause targets come from RDF. No legal field or clause is encoded in the component.</p>
        </details>
      </section>
    `;
    this.shadowRoot.querySelector(".rerun")?.addEventListener("click", () => void this.refresh());
    for (const button of this.shadowRoot.querySelectorAll<HTMLButtonElement>("[data-target]")) {
      button.addEventListener("click", () => this.#focusTarget(button.dataset.target!));
    }
  }

  #focusTarget(target: string): void {
    const root = this.#sourceRoot;
    if (!root || !this.#current) return;
    const sourceDocument = documentForRoot(root);
    let targetUrl: URL;
    try {
      targetUrl = new URL(target, this.#current.sourceDocumentIri);
      if (withoutFragment(targetUrl.href) !== withoutFragment(this.#current.sourceDocumentIri)) {
        window.open(targetUrl.href, "_blank", "noopener");
        return;
      }
    } catch {
      return;
    }
    const id = decodeURIComponent(targetUrl.hash.slice(1));
    const element = isDocument(root)
      ? root.getElementById(id)
      : Array.from(root.querySelectorAll<HTMLElement>("[id]")).find((candidate) => candidate.id === id);
    if (!element) return;
    let style = sourceDocument.querySelector<HTMLStyleElement>("style[data-ia2-policy-target]");
    if (!style) {
      style = sourceDocument.createElement("style");
      style.dataset.ia2PolicyTarget = "";
      style.textContent = `
        [data-ia2-policy-highlight] {
          background: oklch(91% 0.09 100) !important;
          box-shadow: 0 0 0 4px oklch(74% 0.15 100 / 48%) !important;
          scroll-margin-top: 5.5rem !important;
        }
      `;
      sourceDocument.head.append(style);
    }
    sourceDocument.querySelector("[data-ia2-policy-highlight]")
      ?.removeAttribute("data-ia2-policy-highlight");
    element.setAttribute("data-ia2-policy-highlight", "");
    element.scrollIntoView({ behavior: "smooth", block: "center" });
    if (!element.hasAttribute("tabindex")) element.setAttribute("tabindex", "-1");
    element.focus({ preventScroll: true });
    window.setTimeout(() => element.removeAttribute("data-ia2-policy-highlight"), 3200);
  }
}

const styles = `
  :host {
    --policy-ink: oklch(22% 0.025 294);
    --policy-muted: oklch(48% 0.025 294);
    --policy-rule: oklch(84% 0.025 294);
    --policy-violet: oklch(48% 0.16 294);
    --policy-violet-soft: oklch(96% 0.025 294);
    --policy-warning: oklch(57% 0.13 62);
    --policy-danger: oklch(48% 0.17 28);
    color: var(--policy-ink);
    display: block;
    font-family: "Avenir Next", Avenir, "Segoe UI Variable", "Segoe UI", sans-serif;
  }
  * { box-sizing: border-box; }
  button, summary { font: inherit; }
  button:focus-visible, summary:focus-visible {
    outline: 3px solid oklch(58% 0.17 294);
    outline-offset: 2px;
  }
  .reviewer {
    background: oklch(99% 0.006 294);
    border: 1px solid var(--policy-rule);
    min-width: 0;
  }
  .header {
    align-items: start;
    background: var(--policy-violet-soft);
    border-bottom: 1px solid var(--policy-rule);
    display: grid;
    gap: 1.2rem;
    grid-template-columns: minmax(0, 1fr) auto;
    padding: 1.2rem;
  }
  .eyebrow {
    color: var(--policy-violet);
    font-size: .68rem;
    font-weight: 800;
    letter-spacing: .08em;
    margin: 0 0 .35rem;
    text-transform: uppercase;
  }
  h2 { font-size: 1.25rem; letter-spacing: -.02em; margin: 0; }
  .intro {
    color: var(--policy-muted);
    font-size: .78rem;
    line-height: 1.5;
    margin: .5rem 0 0;
    max-width: 60ch;
  }
  .summary { min-width: 8.5rem; text-align: right; }
  .summary strong { display: block; font-size: .88rem; }
  .summary span { color: var(--policy-muted); display: block; font-size: .7rem; margin-top: .25rem; }
  .status {
    border-bottom: 1px solid var(--policy-rule);
    color: var(--policy-muted);
    font-size: .7rem;
    padding: .65rem 1.2rem;
  }
  .section { padding: 1rem 1.2rem 1.2rem; }
  .section + .section { border-top: 1px solid var(--policy-rule); }
  .section-heading {
    align-items: center;
    display: flex;
    gap: 1rem;
    justify-content: space-between;
    margin-bottom: .8rem;
  }
  .section-heading h3 {
    font-size: .72rem;
    letter-spacing: .07em;
    margin: 0;
    text-transform: uppercase;
  }
  .rerun, .target {
    background: transparent;
    border: 0;
    color: var(--policy-violet);
    cursor: pointer;
    font-size: .72rem;
    font-weight: 750;
    padding: .25rem 0;
    text-decoration: underline;
    text-underline-offset: .2em;
  }
  .finding { border-top: 1px solid var(--policy-rule); padding: .9rem 0; }
  .finding:last-child { padding-bottom: 0; }
  .finding-heading { align-items: baseline; display: flex; gap: .55rem; }
  .finding-heading h3 { font-size: .84rem; margin: 0; }
  .severity {
    color: var(--policy-muted);
    font-size: .61rem;
    font-weight: 800;
    letter-spacing: .06em;
    text-transform: uppercase;
  }
  [data-severity="warning"] .severity { color: var(--policy-warning); }
  [data-severity="violation"] .severity { color: var(--policy-danger); }
  .finding p { font-size: .78rem; line-height: 1.48; margin: .4rem 0 .25rem; }
  .empty { color: var(--policy-muted); font-size: .78rem; line-height: 1.5; margin: 0; }
  .count { color: var(--policy-muted); font-size: .68rem; }
  .changes { list-style: none; margin: 0; padding: 0; }
  .change {
    align-items: start;
    border-top: 1px solid var(--policy-rule);
    display: grid;
    gap: .55rem;
    grid-template-columns: 3.4rem minmax(0, 1fr) auto;
    padding: .7rem 0;
  }
  .change-kind {
    color: var(--policy-muted);
    font-size: .62rem;
    font-weight: 800;
    letter-spacing: .05em;
    padding-top: .12rem;
    text-transform: uppercase;
  }
  [data-kind="added"] .change-kind { color: oklch(45% 0.12 145); }
  [data-kind="removed"] .change-kind { color: var(--policy-danger); }
  [data-kind="changed"] .change-kind { color: var(--policy-violet); }
  .statement { display: grid; font-size: .72rem; gap: .18rem; line-height: 1.35; min-width: 0; }
  .statement strong, .statement b { overflow-wrap: anywhere; }
  .statement span { color: var(--policy-muted); }
  .statement b { font-weight: 650; }
  .replacement { align-items: baseline; display: flex; flex-wrap: wrap; gap: .45rem; }
  .replacement del { color: var(--policy-muted); overflow-wrap: anywhere; }
  .replacement b { color: var(--policy-ink); }
  .baseline-note { color: var(--policy-muted); font-size: .66rem; line-height: 1.35; margin: .25rem 0 0; }
  details { border-top: 1px solid var(--policy-rule); padding: .85rem 1.2rem 1rem; }
  summary { color: var(--policy-violet); cursor: pointer; font-size: .72rem; font-weight: 750; }
  details p { color: var(--policy-muted); font-size: .72rem; line-height: 1.5; margin: .6rem 0 0; }
  @media (max-width: 560px) {
    .header { grid-template-columns: 1fr; }
    .summary { text-align: left; }
    .change { grid-template-columns: 3.2rem minmax(0, 1fr); }
    .change .target { grid-column: 2; justify-self: start; }
  }
  @media (prefers-reduced-motion: reduce) {
    * { scroll-behavior: auto !important; }
  }
`;
