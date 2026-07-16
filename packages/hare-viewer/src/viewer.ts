import {
  getHareDomCarrier,
  readHareEnvelope,
  verifyHareRepresentation,
  type HareByteRepresentation,
  type HareDomRepresentation,
  type HareEnvelope,
  type HareRepresentation,
} from "./model.js";
import {
  hareRepresentationUrl,
  resolveHareNavigation,
} from "./navigation.js";
import {
  materializeHareDomRepresentation,
  materializeHareHostSubresources,
  type HareMaterializationIssue,
} from "./materialize.js";
import { renderSafeMarkdown } from "./markdown.js";

export type HareViewerMode = "auto" | "full" | "tabs";

const CSS = String.raw`
  :host {
    --hare-ink: oklch(25% 0.025 286);
    --hare-muted: oklch(49% 0.022 286);
    --hare-paper: oklch(98.5% 0.008 286);
    --hare-layer: oklch(95% 0.018 286);
    --hare-line: oklch(84% 0.025 286);
    --hare-accent: oklch(55% 0.17 294);
    --hare-accent-soft: oklch(93% 0.035 294);
    --hare-success: oklch(42% 0.12 140);
    color: var(--hare-ink);
    display: block;
    font: 400 14px/1.5 -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
    position: relative;
    z-index: 2147482000;
  }
  :host([data-mode="full"]) { min-height: 100vh; }
  :host([data-mode="tabs"][data-open="true"]) {
    inset: 0;
    min-height: 100vh;
    position: fixed;
  }
  *, *::before, *::after { box-sizing: border-box; }
  [hidden] { display: none !important; }
  button, input { color: inherit; font: inherit; }
  button, a { -webkit-tap-highlight-color: transparent; }
  button:focus-visible, a:focus-visible, input:focus-visible {
    outline: 3px solid color-mix(in oklch, var(--hare-accent), transparent 35%);
    outline-offset: 2px;
  }
  .bar {
    align-items: center;
    background: var(--hare-paper);
    border-bottom: 1px solid var(--hare-line);
    display: flex;
    gap: 18px;
    height: 52px;
    padding: 0 max(14px, calc((100vw - 1440px) / 2));
    position: sticky;
    top: 0;
    z-index: 3;
  }
  .identity { align-items: baseline; display: flex; gap: 8px; min-width: 0; }
  .identity strong { color: var(--hare-accent); font-size: 14px; letter-spacing: -.02em; }
  .identity span { color: var(--hare-muted); font-size: 11px; white-space: nowrap; }
  .tabs { align-self: stretch; display: flex; margin-left: auto; }
  .tab {
    background: transparent;
    border: 0;
    border-bottom: 2px solid transparent;
    color: var(--hare-muted);
    cursor: pointer;
    font-size: 13px;
    font-weight: 650;
    min-width: 76px;
    padding: 0 13px;
  }
  .tab:hover { background: var(--hare-layer); color: var(--hare-ink); }
  .tab[aria-selected="true"] { border-bottom-color: var(--hare-accent); color: var(--hare-ink); }
  .count { color: var(--hare-muted); font-size: 11px; margin-left: 2px; }
  .workspace {
    background: var(--hare-paper);
    display: grid;
    grid-template-columns: minmax(230px, 290px) minmax(0, 1fr);
    min-height: calc(100vh - 52px);
  }
  :host([data-mode="tabs"]) .workspace {
    box-shadow: 0 18px 64px oklch(20% 0.03 286 / 24%);
  }
  .browser {
    background: color-mix(in oklch, var(--hare-layer), var(--hare-paper) 45%);
    border-right: 1px solid var(--hare-line);
    min-height: 0;
    overflow: auto;
  }
  .browser-tools {
    background: inherit;
    border-bottom: 1px solid var(--hare-line);
    padding: 14px;
    position: sticky;
    top: 0;
    z-index: 1;
  }
  .browser-tools label { color: var(--hare-muted); display: grid; font-size: 11px; font-weight: 700; gap: 6px; }
  .search {
    background: var(--hare-paper);
    border: 1px solid var(--hare-line);
    border-radius: 8px;
    height: 38px;
    min-width: 0;
    padding: 7px 10px;
    width: 100%;
  }
  .search:focus { border-color: var(--hare-accent); }
  .files { list-style: none; margin: 0; padding: 0; }
  .file-button {
    background: transparent;
    border: 0;
    border-bottom: 1px solid var(--hare-line);
    cursor: pointer;
    display: grid;
    gap: 3px;
    min-height: 68px;
    padding: 12px 14px;
    text-align: left;
    width: 100%;
  }
  .file-button:hover { background: var(--hare-paper); }
  .file-button[aria-current="true"] { background: var(--hare-accent-soft); }
  .file-title { font-size: 13px; font-weight: 680; }
  .file-path { color: var(--hare-muted); font: 11px/1.4 ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace; overflow-wrap: anywhere; }
  .empty { color: var(--hare-muted); font-size: 12px; margin: 0; padding: 18px 14px; }
  .preview { background: var(--hare-paper); min-height: 0; overflow: auto; padding: clamp(20px, 4vw, 48px); }
  .preview:focus { outline: none; }
  .preview-header {
    align-items: start;
    border-bottom: 1px solid var(--hare-line);
    display: flex;
    gap: 20px;
    justify-content: space-between;
    margin-bottom: 22px;
    padding-bottom: 18px;
  }
  .preview-title { font-size: 24px; letter-spacing: -.035em; line-height: 1.15; margin: 0; }
  .preview-actions { align-items: center; display: flex; flex-wrap: wrap; gap: 10px; justify-content: flex-end; }
  .state { color: var(--hare-muted); font-size: 11px; font-weight: 700; white-space: nowrap; }
  .state[data-state="verified"] { align-items: center; color: var(--hare-success); display: inline-flex; gap: 6px; }
  .state[data-state="verified"]::before { background: oklch(81% 0.15 135); border-radius: 50%; content: ""; height: 9px; width: 9px; }
  .download {
    align-items: center;
    background: var(--hare-ink);
    border: 1px solid var(--hare-ink);
    border-radius: 7px;
    color: var(--hare-paper);
    display: inline-flex;
    font-size: 12px;
    font-weight: 700;
    min-height: 38px;
    padding: 7px 11px;
    text-decoration: none;
  }
  .download:hover { background: var(--hare-accent); border-color: var(--hare-accent); }
  .meta { color: var(--hare-muted); display: flex; flex-wrap: wrap; font: 11px/1.5 ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace; gap: 5px 16px; margin-bottom: 22px; }
  .source { background: oklch(30% 0.12 294); color: oklch(97% 0.012 294); font: 12.5px/1.7 ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace; margin: 0; overflow: auto; padding: 18px; tab-size: 2; white-space: pre-wrap; }
  .markdown { max-width: 72ch; }
  .markdown :first-child { margin-top: 0; }
  .markdown h1 { color: var(--hare-accent); font-size: 28px; letter-spacing: -.035em; line-height: 1.15; }
  .markdown h2 { border-bottom: 1px solid var(--hare-line); font-size: 21px; padding-bottom: 6px; }
  .markdown h3 { font-size: 17px; }
  .markdown p, .markdown li { font-size: 16px; line-height: 1.7; }
  .markdown a { color: var(--hare-accent); text-underline-offset: 3px; }
  .markdown blockquote { border-left: 3px solid var(--hare-line); color: var(--hare-muted); margin-inline: 0; padding-left: 18px; }
  .markdown code { background: var(--hare-layer); border-radius: 4px; font: .88em/1.5 ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace; padding: 2px 5px; }
  .markdown pre { background: oklch(30% 0.12 294); color: oklch(97% 0.012 294); overflow: auto; padding: 18px; }
  .markdown pre code { background: transparent; color: inherit; padding: 0; }
  .markdown img { display: block; height: auto; margin-block: 20px; max-width: min(100%, 720px); }
  .markdown table { border-collapse: collapse; display: block; max-width: 100%; overflow: auto; }
  .markdown th, .markdown td { border: 1px solid var(--hare-line); padding: 7px 10px; }
  .markdown th { background: var(--hare-layer); }
  .markdown .task-list-item { list-style: none; }
  .markdown-image-unavailable { border: 1px dashed var(--hare-line); color: var(--hare-muted); display: inline-block; padding: 8px 10px; }
  .frame { background: var(--hare-paper); border: 1px solid var(--hare-line); min-height: 60vh; width: 100%; }
  .image { display: block; height: auto; max-width: min(100%, 720px); }
  .binary { background: var(--hare-layer); border: 1px solid var(--hare-line); border-radius: 9px; color: var(--hare-muted); max-width: 64ch; padding: 16px; }
  .navigation-error { background: oklch(95% 0.035 28); border: 1px solid oklch(78% 0.08 28); border-radius: 8px; color: oklch(42% 0.14 28); margin: 0 0 18px; padding: 11px 13px; }
  .materialization-note { background: var(--hare-accent-soft); border: 1px solid color-mix(in oklch, var(--hare-accent), transparent 65%); border-radius: 8px; color: var(--hare-ink); margin: 0 0 18px; padding: 11px 13px; }
  .materialization-note summary { cursor: pointer; font-weight: 680; }
  .materialization-note ul { margin: 8px 0 0; padding-left: 20px; }
  .materialization-note code { font: 11px/1.5 ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace; overflow-wrap: anywhere; }
  .error { color: oklch(47% 0.17 28); max-width: 64ch; }
  .loading { color: var(--hare-muted); }
  @media (max-width: 720px) {
    .bar { gap: 8px; padding-inline: 10px; }
    .identity span { display: none; }
    .tab { min-width: 66px; padding-inline: 9px; }
    .workspace { grid-template-columns: 1fr; grid-template-rows: minmax(190px, 34vh) minmax(0, 1fr); }
    .browser { border-bottom: 1px solid var(--hare-line); border-right: 0; }
    .preview { padding: 20px; }
    .preview-header { align-items: stretch; flex-direction: column; gap: 14px; }
    .preview-actions { justify-content: space-between; }
  }
`;

function hasAuthoredContent(target: Document, viewer: Element): boolean {
  return Array.from(target.body.children).some((element) => {
    if (element === viewer || element.hasAttribute("hidden")) return false;
    return !["SCRIPT", "STYLE", "LINK", "TEMPLATE", "NOSCRIPT"].includes(element.tagName);
  });
}

function filename(path: string | null, title: string): string {
  return path?.split("/").filter(Boolean).at(-1) || title || "resource";
}

export class HareViewerElement extends HTMLElement {
  #envelope: HareEnvelope | null = null;
  #mode: Exclude<HareViewerMode, "auto"> = "full";
  #selected: HareRepresentation | null = null;
  #blobUrl: string | null = null;
  #objectUrls = new Set<string>();
  #hostObjectUrls = new Set<string>();
  #previousBodyOverflow = "";
  #filesOpen = false;

  connectedCallback(): void {
    if (this.shadowRoot) return;
    try {
      this.#envelope = readHareEnvelope(this.ownerDocument);
      const requested = (this.getAttribute("mode") || "auto") as HareViewerMode;
      this.#mode = requested === "auto"
        ? (hasAuthoredContent(this.ownerDocument, this) ? "tabs" : "full")
        : requested;
      if (this.#mode !== "full" && this.#mode !== "tabs") throw new Error(`Unsupported viewer mode ${requested}.`);
      this.dataset.mode = this.#mode;
      this.#filesOpen = this.#mode === "full";
      this.#render();
      void this.#materializeHostSubresources();
      const initial = this.#envelope.representations[0];
      if (initial) void this.#open(initial);
    } catch (error) {
      this.#renderFailure(error);
    }
  }

  disconnectedCallback(): void {
    this.#releaseObjectUrls();
    for (const url of this.#hostObjectUrls) URL.revokeObjectURL(url);
    this.#hostObjectUrls.clear();
    if (this.#mode === "tabs") this.ownerDocument.body.style.overflow = this.#previousBodyOverflow;
  }

  get mode(): Exclude<HareViewerMode, "auto"> {
    return this.#mode;
  }

  get envelope(): HareEnvelope | null {
    return this.#envelope;
  }

  get filesOpen(): boolean {
    return this.#filesOpen;
  }

  openFiles(): void {
    if (this.#mode === "full" || this.#filesOpen) return;
    this.#filesOpen = true;
    this.#previousBodyOverflow = this.ownerDocument.body.style.overflow;
    this.ownerDocument.body.style.overflow = "hidden";
    this.#syncTabs();
  }

  closeFiles(): void {
    if (this.#mode === "full" || !this.#filesOpen) return;
    this.#filesOpen = false;
    this.ownerDocument.body.style.overflow = this.#previousBodyOverflow;
    this.#syncTabs();
  }

  async #materializeHostSubresources(): Promise<void> {
    if (!this.#envelope) return;
    const result = await materializeHareHostSubresources(this.#envelope, this.ownerDocument);
    if (!this.isConnected) {
      result.objectUrls.forEach((url) => URL.revokeObjectURL(url));
      return;
    }
    result.objectUrls.forEach((url) => this.#hostObjectUrls.add(url));
    this.dataset.hostMaterializationIssues = String(result.issues.length);
  }

  #render(): void {
    const root = this.attachShadow({ mode: "open" });
    const count = this.#envelope?.representations.length ?? 0;
    root.innerHTML = `
      <style>${CSS}</style>
      <header class="bar">
        <div class="identity"><strong>HARE</strong><span>Resource envelope</span></div>
        <div class="tabs" role="tablist" aria-label="Envelope views">
          <button class="tab document-tab" type="button" role="tab">Document</button>
          <button class="tab files-tab" type="button" role="tab">Files <span class="count">${count}</span></button>
        </div>
      </header>
      <section class="workspace" role="tabpanel" aria-label="Envelope files">
        <aside class="browser" aria-label="Virtual files">
          <div class="browser-tools"><label>Find a file<input class="search" type="search" placeholder="Path, title, or media type"></label></div>
          <ul class="files"></ul>
        </aside>
        <main class="preview" tabindex="-1"><p class="loading">Choose a file to inspect it.</p></main>
      </section>
    `;
    root.querySelector<HTMLButtonElement>(".document-tab")?.addEventListener("click", () => this.closeFiles());
    root.querySelector<HTMLButtonElement>(".files-tab")?.addEventListener("click", () => this.openFiles());
    root.addEventListener("keydown", (event) => {
      if ((event as KeyboardEvent).key === "Escape") this.closeFiles();
    });
    root.querySelector<HTMLInputElement>(".search")?.addEventListener("input", (event) => {
      this.#renderFiles((event.currentTarget as HTMLInputElement).value);
    });
    this.#renderFiles();
    this.#syncTabs();
  }

  #syncTabs(): void {
    const root = this.shadowRoot;
    if (!root) return;
    const documentTab = root.querySelector<HTMLButtonElement>(".document-tab");
    const filesTab = root.querySelector<HTMLButtonElement>(".files-tab");
    const workspace = root.querySelector<HTMLElement>(".workspace");
    if (!documentTab || !filesTab || !workspace) return;
    documentTab.hidden = this.#mode === "full";
    this.dataset.open = String(this.#filesOpen);
    documentTab.setAttribute("aria-selected", String(!this.#filesOpen));
    documentTab.tabIndex = this.#filesOpen ? -1 : 0;
    filesTab.setAttribute("aria-selected", String(this.#filesOpen));
    filesTab.tabIndex = this.#filesOpen ? 0 : -1;
    workspace.hidden = !this.#filesOpen;
  }

  #renderFiles(query = ""): void {
    const list = this.shadowRoot?.querySelector<HTMLUListElement>(".files");
    if (!list || !this.#envelope) return;
    list.replaceChildren();
    const normalized = query.trim().toLowerCase();
    const matches = this.#envelope.representations.filter((representation) => (
      `${representation.title} ${representation.path} ${representation.mediaType}`.toLowerCase().includes(normalized)
    ));
    for (const representation of matches) {
      const item = this.ownerDocument.createElement("li");
      const button = this.ownerDocument.createElement("button");
      button.className = "file-button";
      button.type = "button";
      button.dataset.path = representation.path || "";
      button.setAttribute("aria-current", String(this.#selected?.id === representation.id));
      const title = this.ownerDocument.createElement("span");
      title.className = "file-title";
      title.textContent = representation.title;
      const path = this.ownerDocument.createElement("span");
      path.className = "file-path";
      path.textContent = representation.path || "No logical path";
      button.append(title, path);
      button.addEventListener("click", () => void this.#open(representation));
      item.append(button);
      list.append(item);
    }
    if (matches.length === 0) {
      const empty = this.ownerDocument.createElement("p");
      empty.className = "empty";
      empty.textContent = "No files match this filter.";
      list.append(empty);
    }
  }

  async #open(representation: HareRepresentation, fragment: string | null = null): Promise<void> {
    this.#selected = representation;
    this.#renderFiles(this.shadowRoot?.querySelector<HTMLInputElement>(".search")?.value || "");
    const preview = this.shadowRoot?.querySelector<HTMLElement>(".preview");
    if (!preview) return;
    this.#releaseObjectUrls();
    preview.replaceChildren();

    const header = this.ownerDocument.createElement("header");
    header.className = "preview-header";
    const title = this.ownerDocument.createElement("h2");
    title.className = "preview-title";
    title.textContent = representation.title;
    const actions = this.ownerDocument.createElement("div");
    actions.className = "preview-actions";
    const state = this.ownerDocument.createElement("span");
    state.className = "state";
    state.textContent = representation.kind === "bytes" ? "Verifying" : "Semantic";
    actions.append(state);
    header.append(title, actions);
    preview.append(header);

    try {
      if (representation.kind === "dom") {
        const carrier = getHareDomCarrier(representation, this.ownerDocument);
        state.textContent = "Materializing";
        const meta = this.ownerDocument.createElement("div");
        meta.className = "meta";
        const virtualUrl = this.#envelope ? hareRepresentationUrl(this.#envelope, representation) : null;
        for (const value of [virtualUrl, representation.mediaType, "Template carrier"].filter(Boolean) as string[]) {
          const part = this.ownerDocument.createElement("span");
          part.textContent = value;
          meta.append(part);
        }
        preview.append(meta);
        if (!this.#envelope) throw new Error("The envelope model is unavailable.");
        const materialization = await materializeHareDomRepresentation(
          this.#envelope,
          representation,
          carrier,
          this.ownerDocument,
        );
        if (this.#selected?.id !== representation.id) {
          materialization.objectUrls.forEach((url) => URL.revokeObjectURL(url));
          return;
        }
        materialization.objectUrls.forEach((url) => this.#objectUrls.add(url));
        state.textContent = "Semantic DOM";
        const resourceCount = materialization.materializedRepresentations.length;
        if (resourceCount > 0) {
          const part = this.ownerDocument.createElement("span");
          part.textContent = `${resourceCount} verified subresource${resourceCount === 1 ? "" : "s"}`;
          meta.append(part);
        }
        if (materialization.issues.length > 0) {
          preview.append(this.#materializationNote(materialization.issues));
        }
        this.#renderDomRepresentation(materialization.source, representation, preview, fragment);
        preview.focus({ preventScroll: true });
        return;
      }
      const verified = await verifyHareRepresentation(representation, this.ownerDocument);
      if (this.#selected?.id !== representation.id) return;
      state.dataset.state = "verified";
      state.textContent = "Verified";
      const blobBytes = new ArrayBuffer(verified.bytes.byteLength);
      new Uint8Array(blobBytes).set(verified.bytes);
      this.#blobUrl = URL.createObjectURL(new Blob([blobBytes], { type: representation.mediaType }));
      this.#objectUrls.add(this.#blobUrl);
      const download = this.ownerDocument.createElement("a");
      download.className = "download";
      download.href = this.#blobUrl;
      download.download = filename(representation.path, representation.title);
      download.textContent = "Download";
      download.setAttribute("aria-label", `Download ${representation.title} as ${download.download}`);
      actions.append(download);

      const meta = this.ownerDocument.createElement("div");
      meta.className = "meta";
      for (const value of [representation.path, representation.mediaType, `${representation.byteLength} bytes`].filter(Boolean) as string[]) {
        const part = this.ownerDocument.createElement("span");
        part.textContent = value;
        meta.append(part);
      }
      preview.append(meta);
      await this.#renderRepresentation(verified.bytes, representation, preview);
      if (this.#selected?.id !== representation.id) return;
      preview.focus({ preventScroll: true });
    } catch (error) {
      if (this.#selected?.id !== representation.id) return;
      state.textContent = representation.kind === "bytes" ? "Verification failed" : "Preview failed";
      const message = this.ownerDocument.createElement("p");
      message.className = "error";
      message.textContent = error instanceof Error ? error.message : String(error);
      preview.append(message);
    }
  }

  #renderDomRepresentation(
    source: string,
    representation: HareDomRepresentation,
    preview: HTMLElement,
    fragment: string | null,
  ): void {
    const frame = this.ownerDocument.createElement("iframe");
    frame.className = "frame";
    frame.title = `${representation.title} semantic preview`;
    frame.referrerPolicy = "no-referrer";
    frame.setAttribute("sandbox", "allow-same-origin");
    frame.addEventListener("load", () => {
      const frameDocument = frame.contentDocument;
      if (!frameDocument) {
        this.#showNavigationError("The semantic document could not be inspected in its sandbox.");
        return;
      }
      frameDocument.addEventListener("click", (event) => {
        const FrameElement = frameDocument.defaultView?.Element;
        const origin = FrameElement && event.target instanceof FrameElement
          ? event.target as Element
          : null;
        const anchor = origin?.closest<HTMLAnchorElement>("a[href]");
        if (!anchor) return;
        event.preventDefault();
        event.stopPropagation();
        void this.#followLink(
          representation,
          anchor.dataset.hareHref ?? anchor.getAttribute("href") ?? "",
        );
      }, { capture: true });
      if (fragment !== null) {
        const target = frameDocument.getElementById(fragment) || frameDocument.getElementsByName(fragment)[0];
        if (target && "scrollIntoView" in target) target.scrollIntoView({ block: "start" });
        else this.#showNavigationError(`No fragment named #${fragment} exists in ${representation.path || representation.title}.`);
      }
    }, { once: true });
    frame.srcdoc = source;
    preview.append(frame);
  }

  #materializationNote(issues: HareMaterializationIssue[]): HTMLElement {
    const details = this.ownerDocument.createElement("details");
    details.className = "materialization-note";
    const summary = this.ownerDocument.createElement("summary");
    summary.textContent = `${issues.length} subresource reference${issues.length === 1 ? " was" : "s were"} left inert`;
    const list = this.ownerDocument.createElement("ul");
    for (const issue of issues) {
      const item = this.ownerDocument.createElement("li");
      const reference = this.ownerDocument.createElement("code");
      reference.textContent = issue.reference || "(empty reference)";
      item.append(reference, ` — ${issue.reason}`);
      list.append(item);
    }
    details.append(summary, list);
    return details;
  }

  async #followLink(current: HareRepresentation, reference: string): Promise<void> {
    if (!this.#envelope) return;
    const target = resolveHareNavigation(this.#envelope, current, reference);
    if (target.kind === "representation") {
      await this.#open(target.representation, target.fragment);
      return;
    }
    if (target.kind === "host") {
      this.#openHostDocument(target.fragment);
      return;
    }
    if (target.kind === "external") {
      this.ownerDocument.defaultView?.open(target.url, "_blank", "noopener,noreferrer");
      return;
    }
    this.#showNavigationError(target.reason);
  }

  #openHostDocument(fragment: string | null): void {
    const target = fragment === null
      ? this.ownerDocument.body
      : this.ownerDocument.getElementById(fragment);
    if (target && "scrollIntoView" in target) {
      this.closeFiles();
      target.scrollIntoView({ block: "start" });
      return;
    }
    this.#showNavigationError(fragment === null
      ? "The envelope has no authored document view."
      : `No host-document fragment named #${fragment} exists.`);
  }

  #showNavigationError(message: string): void {
    const preview = this.shadowRoot?.querySelector<HTMLElement>(".preview");
    if (!preview) return;
    preview.querySelector(".navigation-error")?.remove();
    const error = this.ownerDocument.createElement("p");
    error.className = "navigation-error";
    error.setAttribute("role", "alert");
    error.textContent = message;
    const meta = preview.querySelector(".meta");
    if (meta) meta.insertAdjacentElement("afterend", error);
    else preview.prepend(error);
  }

  async #renderRepresentation(bytes: Uint8Array, representation: HareByteRepresentation, preview: HTMLElement): Promise<void> {
    const decoder = new TextDecoder();
    if (representation.mediaType.startsWith("text/markdown")) {
      const section = await renderSafeMarkdown(decoder.decode(bytes), {
        document: this.ownerDocument,
        resolveLink: () => "#hare-navigation",
        resolveImage: async ({ destination }) => {
          if (!this.#envelope) return null;
          const target = resolveHareNavigation(this.#envelope, representation, destination);
          if (target.kind !== "representation" || target.representation.kind !== "bytes") return null;
          if (!target.representation.mediaType.startsWith("image/")) return null;
          const verified = await verifyHareRepresentation(target.representation, this.ownerDocument);
          if (this.#selected?.id !== representation.id) return null;
          const imageBytes = new ArrayBuffer(verified.bytes.byteLength);
          new Uint8Array(imageBytes).set(verified.bytes);
          const url = URL.createObjectURL(new Blob([imageBytes], { type: target.representation.mediaType }));
          this.#objectUrls.add(url);
          return `${url}${target.fragment === null ? "" : `#${encodeURIComponent(target.fragment)}`}`;
        },
      });
      section.addEventListener("click", (event) => {
        const origin = event.target instanceof Element ? event.target : null;
        const anchor = origin?.closest<HTMLAnchorElement>("a[data-markdown-destination]");
        if (!anchor) return;
        event.preventDefault();
        event.stopPropagation();
        void this.#followLink(representation, anchor.dataset.markdownDestination ?? "");
      }, { capture: true });
      preview.append(section);
      return;
    }
    if (representation.mediaType === "application/json") {
      const source = this.ownerDocument.createElement("pre");
      source.className = "source";
      source.textContent = JSON.stringify(JSON.parse(decoder.decode(bytes)), null, 2);
      preview.append(source);
      return;
    }
    if (representation.mediaType.startsWith("text/html")) {
      const frame = this.ownerDocument.createElement("iframe");
      frame.className = "frame";
      frame.title = `${representation.title} preview`;
      frame.setAttribute("sandbox", "");
      frame.src = this.#blobUrl || "";
      preview.append(frame);
      return;
    }
    if (representation.mediaType.startsWith("image/")) {
      const image = this.ownerDocument.createElement("img");
      image.className = "image";
      image.alt = representation.title;
      image.src = this.#blobUrl || "";
      preview.append(image);
      return;
    }
    if (representation.mediaType.startsWith("text/")) {
      const source = this.ownerDocument.createElement("pre");
      source.className = "source";
      source.textContent = decoder.decode(bytes);
      preview.append(source);
      return;
    }
    const message = this.ownerDocument.createElement("p");
    message.className = "binary";
    message.textContent = "This verified binary representation is available to download. No inline preview is defined for its media type.";
    preview.append(message);
  }

  #releaseObjectUrls(): void {
    for (const url of this.#objectUrls) URL.revokeObjectURL(url);
    this.#objectUrls.clear();
    this.#blobUrl = null;
  }

  #renderFailure(error: unknown): void {
    const root = this.attachShadow({ mode: "open" });
    const message = error instanceof Error ? error.message : String(error);
    root.innerHTML = `<style>${CSS}</style><div class="bar"><div class="identity"><strong>HARE</strong><span>Viewer unavailable</span></div></div><main class="preview"><h2 class="preview-title">The envelope could not be opened</h2><p class="error"></p></main>`;
    const output = root.querySelector<HTMLElement>(".error");
    if (output) output.textContent = message;
  }
}
