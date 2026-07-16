import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mountRdfNavigator } from "../src/index.js";

const SESSION_STATE_KEY = "ia2:rdf-navigator:state:v1";

beforeEach(() => {
  sessionStorage.removeItem(SESSION_STATE_KEY);
  document.documentElement.setAttribute("rdf-version", "1.2");
  document.head.querySelectorAll('[rdf-predicate], link[rel~="canonical"]')
    .forEach((element) => element.remove());
  document.body.innerHTML = '<span rdf-subject="https://example.com/alice" rdf-predicate="https://schema.org/name">Alice</span>';
});

afterEach(() => {
  document.querySelector("ia2-rdf-navigator")?.remove();
  sessionStorage.removeItem(SESSION_STATE_KEY);
});

describe("Ia2RdfNavigator", () => {
  it("opens with Navigator first and links vocabulary terms in new tabs", () => {
    const drawer = mountRdfNavigator();
    const tabs = Array.from(drawer.shadowRoot?.querySelectorAll<HTMLButtonElement>('[role="tab"]') ?? []);
    expect(tabs.map((tab) => tab.textContent)).toEqual(["Navigator", "Turtle", "JSON-LD"]);
    expect(tabs[0]?.getAttribute("aria-selected")).toBe("true");
    const toolbar = drawer.shadowRoot?.querySelector<HTMLElement>(".toolbar");
    const tools = drawer.shadowRoot?.querySelector<HTMLElement>(".navigator-tools");
    expect(toolbar?.querySelector(".tabs")).not.toBeNull();
    expect(toolbar?.querySelector(".header-actions")).not.toBeNull();
    expect(drawer.shadowRoot?.querySelector(".heading")).toBeNull();
    expect(tools?.contains(drawer.shadowRoot?.querySelector(".navigator-search") ?? null)).toBe(true);
    expect(tools?.contains(drawer.shadowRoot?.querySelector(".sync-control") ?? null)).toBe(true);
    expect(tools?.contains(drawer.shadowRoot?.querySelector(".vocabularies") ?? null)).toBe(true);

    const predicate = drawer.shadowRoot?.querySelector<HTMLAnchorElement>('.navigator .predicate a[href="https://schema.org/name"]');
    expect(predicate?.target).toBe("_blank");
    expect(predicate?.rel).toBe("noopener noreferrer");

    const vocabulary = drawer.shadowRoot?.querySelector<HTMLAnchorElement>('.vocabulary-link[href="https://schema.org/"]');
    expect(vocabulary?.target).toBe("_blank");
  });

  it("shows Diagnostics only while extraction diagnostics exist", async () => {
    document.body.innerHTML = '<a href="https://example.com/bob" rdf-object-key="bob" rdf-subject="https://example.com/alice" rdf-predicate="https://schema.org/knows">Bob</a>';
    const drawer = mountRdfNavigator();
    const diagnostics = drawer.shadowRoot?.querySelector<HTMLButtonElement>('[data-view="diagnostics"]')!;
    expect(diagnostics.textContent).toBe("Diagnostics (1)");

    diagnostics.click();
    expect(drawer.shadowRoot?.querySelector('[data-view="diagnostics"]')?.getAttribute("aria-selected")).toBe("true");
    document.body.querySelector("a")?.removeAttribute("rdf-object-key");
    await new Promise((resolve) => window.setTimeout(resolve, 180));

    expect(drawer.shadowRoot?.querySelector('[data-view="diagnostics"]')).toBeNull();
    expect(drawer.shadowRoot?.querySelector('[data-view="navigator"]')?.getAttribute("aria-selected")).toBe("true");
  });

  it("compacts ODRL authority terms", () => {
    document.body.innerHTML = '<a href="https://example.com/draft-permission" rdf-subject="https://example.com/policy" rdf-predicate="http://www.w3.org/ns/odrl/2/permission">Draft amendment</a>';
    const drawer = mountRdfNavigator();
    const predicate = drawer.shadowRoot?.querySelector<HTMLAnchorElement>('.navigator .predicate a[href="http://www.w3.org/ns/odrl/2/permission"]');
    const vocabulary = drawer.shadowRoot?.querySelector<HTMLAnchorElement>('.vocabulary-link[href="http://www.w3.org/ns/odrl/2/"]');

    expect(predicate?.textContent).toBe("odrl:permission");
    expect(vocabulary?.previousElementSibling?.textContent).toContain("odrl");
  });

  it("shows Discovery only when candidates exist and explicitly loads HTML/RDF contributions", async () => {
    const canonical = document.createElement("link");
    canonical.rel = "canonical";
    canonical.href = "https://example.com/report";
    document.head.append(canonical);
    document.body.innerHTML = '<a href="https://example.com/evidence" rdf-subject="#claim" rdf-predicate="http://www.w3.org/2000/01/rdf-schema#seeAlso">Evidence</a>';
    const originalFetch = window.fetch;
    const fetchMock = vi.fn().mockResolvedValue({
      headers: { get: (name: string) => name.toLowerCase() === "content-type" ? "text/html; charset=utf-8" : null },
      ok: true,
      status: 200,
      text: () => Promise.resolve(`<!doctype html><html rdf-version="1.2"><head><link rel="canonical" href="https://example.com/evidence"></head><body><span id="fact" rdf-predicate="https://schema.org/name">Evidence set</span></body></html>`),
      url: "http://localhost:3000/evidence",
    } as unknown as Response);
    Object.defineProperty(window, "fetch", { configurable: true, value: fetchMock });
    try {
      const drawer = mountRdfNavigator();
      const tabs = Array.from(drawer.shadowRoot?.querySelectorAll<HTMLButtonElement>('[role="tab"]') ?? []);
      expect(tabs.map((tab) => tab.textContent)).toEqual(["Navigator", "Discovery (1)", "Turtle", "JSON-LD"]);

      drawer.shadowRoot?.querySelector<HTMLButtonElement>('[data-view="discovery"]')?.click();
      const target = drawer.shadowRoot?.querySelector<HTMLAnchorElement>('.discovery-target');
      expect(target?.href).toBe("https://example.com/evidence");
      expect(target?.target).toBe("_blank");
      drawer.shadowRoot?.querySelector<HTMLButtonElement>('.discovery-action')?.click();

      await vi.waitFor(() => {
        expect(drawer.shadowRoot?.querySelector('.discovery-status')?.textContent).toBe("1 statement loaded");
      });
      expect(fetchMock).toHaveBeenCalledWith(
        "http://localhost:3000/evidence",
        expect.objectContaining({ credentials: "omit", redirect: "follow", referrerPolicy: "no-referrer" }),
      );
      expect(drawer.shadowRoot?.querySelector('.launcher .count')?.textContent).toBe("2");

      drawer.shadowRoot?.querySelector<HTMLButtonElement>('[data-view="turtle"]')?.click();
      expect(drawer.shadowRoot?.querySelector("pre")?.textContent).toContain("<https://example.com/evidence> {");
      expect(drawer.shadowRoot?.querySelector("pre")?.textContent).toContain('schema:name "Evidence set"');

      drawer.shadowRoot?.querySelector<HTMLButtonElement>('[data-view="discovery"]')?.click();
      drawer.shadowRoot?.querySelector<HTMLButtonElement>('.discovery-action')?.click();
      expect(drawer.shadowRoot?.querySelector('.launcher .count')?.textContent).toBe("1");
    } finally {
      Object.defineProperty(window, "fetch", { configurable: true, value: originalFetch });
    }
  });

  it("shows a document vocabulary tree and correlates local definitions", () => {
    const canonical = document.createElement("link");
    canonical.rel = "canonical";
    canonical.href = "https://example.com/vocabulary";
    document.head.append(canonical);
    document.body.innerHTML = [
      '<section id="Entity"><a href="http://www.w3.org/2002/07/owl#Class" rdf-subject="#Entity" rdf-predicate="http://www.w3.org/1999/02/22-rdf-syntax-ns#type">Class</a><span rdf-subject="#Entity" rdf-predicate="http://www.w3.org/2000/01/rdf-schema#label">Entity</span></section>',
      '<section id="Agent"><a href="http://www.w3.org/2002/07/owl#Class" rdf-subject="#Agent" rdf-predicate="http://www.w3.org/1999/02/22-rdf-syntax-ns#type">Class</a><a href="#Entity" rdf-subject="#Agent" rdf-predicate="http://www.w3.org/2000/01/rdf-schema#subClassOf">Entity</a><span rdf-subject="#Agent" rdf-predicate="http://www.w3.org/2000/01/rdf-schema#label">Agent</span></section>',
      '<section id="knows"><a href="http://www.w3.org/2002/07/owl#ObjectProperty" rdf-subject="#knows" rdf-predicate="http://www.w3.org/1999/02/22-rdf-syntax-ns#type">Object property</a><span rdf-subject="#knows" rdf-predicate="http://www.w3.org/2000/01/rdf-schema#label">knows</span></section>',
    ].join("");
    const agent = document.getElementById("Agent")!;
    const cancel = vi.fn();
    agent.scrollIntoView = vi.fn();
    agent.animate = vi.fn(() => ({ cancel } as unknown as Animation));

    const drawer = mountRdfNavigator();
    const tabs = Array.from(drawer.shadowRoot?.querySelectorAll<HTMLButtonElement>('[role="tab"]') ?? []);
    expect(tabs.map((tab) => tab.textContent)).toEqual(["Navigator", "Vocabulary (3)", "Turtle", "JSON-LD"]);
    drawer.shadowRoot?.querySelector<HTMLButtonElement>('[data-view="vocabulary"]')?.click();

    const sections = Array.from(drawer.shadowRoot?.querySelectorAll<HTMLElement>(".ontology-section") ?? []);
    expect(sections.map((section) => section.querySelector("h3")?.textContent)).toEqual(["Classes", "Properties"]);
    expect(sections.map((section) => section.querySelector(".ontology-count")?.textContent)).toEqual(["2 defined", "1 defined"]);
    const agentRow = drawer.shadowRoot?.querySelector<HTMLElement>('.ontology-term-row[data-term="https://example.com/vocabulary#Agent"]')!;
    expect(agentRow.querySelector(".ontology-label")?.textContent).toBe("Agent");
    expect(agentRow.closest(".ontology-children")).not.toBeNull();
    expect(agentRow.querySelector<HTMLAnchorElement>(".term-link")?.classList.contains("local-term")).toBe(true);

    agentRow.dispatchEvent(new Event("pointerenter"));
    expect(agent.animate).toHaveBeenCalledOnce();
    agentRow.dispatchEvent(new Event("pointerleave"));
    expect(cancel).toHaveBeenCalledOnce();
    agent.dispatchEvent(new Event("pointerenter"));
    expect(agentRow.classList.contains("is-corresponding")).toBe(true);
    agent.dispatchEvent(new Event("pointerleave"));
    expect(agentRow.classList.contains("is-corresponding")).toBe(false);

    agentRow.querySelector<HTMLButtonElement>(".ontology-locate-button")?.click();
    expect(agent.scrollIntoView).toHaveBeenCalledOnce();
    expect(agent.animate).toHaveBeenCalledTimes(2);
  });

  it("compacts tabs progressively without exposing a horizontal scroller", () => {
    const originalClientWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "clientWidth");
    const originalScrollWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "scrollWidth");
    let availableWidth = 300;
    Object.defineProperty(HTMLElement.prototype, "clientWidth", {
      configurable: true,
      get() {
        if (this.classList.contains("tabs")) return availableWidth;
        return originalClientWidth?.get?.call(this) ?? 0;
      },
    });
    Object.defineProperty(HTMLElement.prototype, "scrollWidth", {
      configurable: true,
      get() {
        if (this.classList.contains("tabs")) return [500, 380, 280, 120][Number(this.dataset.compact ?? 0)] ?? 500;
        return originalScrollWidth?.get?.call(this) ?? 0;
      },
    });
    try {
      const canonical = document.createElement("link");
      canonical.rel = "canonical";
      canonical.href = "https://example.com/vocabulary";
      document.head.append(canonical);
      document.body.innerHTML = [
        '<a href="http://www.w3.org/2002/07/owl#Class" rdf-subject="#Entity" rdf-predicate="http://www.w3.org/1999/02/22-rdf-syntax-ns#type">Class</a>',
        '<a href="https://example.com/more" rdf-subject="" rdf-predicate="http://www.w3.org/2000/01/rdf-schema#seeAlso">More</a>',
      ].join("");
      const drawer = mountRdfNavigator();
      let tabs = drawer.shadowRoot?.querySelector<HTMLElement>(".tabs")!;
      expect(tabs.dataset.compact).toBe("2");
      expect(drawer.shadowRoot?.querySelector("style")?.textContent).toMatch(/\.tabs \{[^}]*overflow: hidden/);
      expect(tabs.querySelector('[data-view="vocabulary"]')?.getAttribute("aria-label")).toBe("Vocabulary (1)");
      expect(tabs.querySelector('[data-view="vocabulary"]')?.getAttribute("title")).toBe("Vocabulary, 1 definition");

      availableWidth = 150;
      drawer.refresh();
      tabs = drawer.shadowRoot?.querySelector<HTMLElement>(".tabs")!;
      expect(tabs.dataset.compact).toBe("3");
      expect(tabs.querySelector<HTMLElement>(".tab-icon svg")).not.toBeNull();

      availableWidth = 600;
      drawer.refresh();
      tabs = drawer.shadowRoot?.querySelector<HTMLElement>(".tabs")!;
      expect(tabs.dataset.compact).toBe("0");
    } finally {
      if (originalClientWidth) Object.defineProperty(HTMLElement.prototype, "clientWidth", originalClientWidth);
      else delete (HTMLElement.prototype as unknown as { clientWidth?: number }).clientWidth;
      if (originalScrollWidth) Object.defineProperty(HTMLElement.prototype, "scrollWidth", originalScrollWidth);
      else delete (HTMLElement.prototype as unknown as { scrollWidth?: number }).scrollWidth;
    }
  });

  it("distinguishes pointer and keyboard focus when opening the drawer", async () => {
    const drawer = mountRdfNavigator();
    drawer.shadowRoot?.querySelector<HTMLButtonElement>(".launcher")
      ?.dispatchEvent(new MouseEvent("click", { bubbles: true, detail: 1 }));
    await Promise.resolve();
    expect(drawer.shadowRoot?.activeElement).toBe(drawer.shadowRoot?.querySelector(".panel"));

    drawer.close();
    await Promise.resolve();
    drawer.shadowRoot?.querySelector<HTMLButtonElement>(".launcher")
      ?.dispatchEvent(new MouseEvent("click", { bubbles: true, detail: 0 }));
    await Promise.resolve();
    expect(drawer.shadowRoot?.activeElement).toBe(drawer.shadowRoot?.querySelector('.tab[aria-selected="true"]'));
  });

  it("opens and closes without rebuilding the extracted view", () => {
    const drawer = mountRdfNavigator();
    const row = drawer.shadowRoot?.querySelector(".quad");
    const panel = drawer.shadowRoot?.querySelector<HTMLElement>(".panel");
    const launcher = drawer.shadowRoot?.querySelector(".launcher");

    drawer.open();
    expect(drawer.shadowRoot?.querySelector(".quad")).toBe(row);
    expect(panel?.dataset.open).toBe("true");
    expect(launcher?.getAttribute("aria-expanded")).toBe("true");

    drawer.close();
    expect(drawer.shadowRoot?.querySelector(".quad")).toBe(row);
    expect(panel?.dataset.open).toBe("false");
    expect(launcher?.getAttribute("aria-expanded")).toBe("false");
  });

  it("opens on a requested side and reveals one carrier in the Navigator", async () => {
    document.body.innerHTML = [
      '<span id="alice" rdf-subject="https://example.com/alice" rdf-predicate="https://schema.org/name">Alice</span>',
      '<span rdf-subject="https://example.com/bob" rdf-predicate="https://schema.org/name">Bob</span>',
    ].join("");
    const alice = document.querySelector("#alice")!;
    const originalScrollIntoView = HTMLElement.prototype.scrollIntoView;
    const scrollIntoView = vi.fn();
    Object.defineProperty(HTMLElement.prototype, "scrollIntoView", { configurable: true, value: scrollIntoView });
    try {
      const drawer = mountRdfNavigator();
      expect(drawer.revealSource(alice, "left")).toBe(true);
      await Promise.resolve();

      const panel = drawer.shadowRoot?.querySelector<HTMLElement>(".panel");
      const launcher = drawer.shadowRoot?.querySelector<HTMLElement>(".launcher");
      const rows = Array.from(drawer.shadowRoot?.querySelectorAll<HTMLElement>(".quad") ?? []);
      const selectedRows = rows.filter((row) => row.classList.contains("is-corresponding"));
      expect(panel?.dataset.open).toBe("true");
      expect(panel?.dataset.position).toBe("left");
      expect(launcher?.dataset.position).toBe("left");
      expect(drawer.shadowRoot?.querySelector('.position-option[data-position="left"]')?.getAttribute("aria-checked")).toBe("true");
      expect(selectedRows).toHaveLength(1);
      expect(selectedRows[0]?.textContent).toContain("Alice");
      expect(drawer.shadowRoot?.activeElement).toBe(selectedRows[0]);
      expect(scrollIntoView).toHaveBeenCalledWith({ block: "center" });
      expect(drawer.revealSource(document.body, "left")).toBe(false);
    } finally {
      if (originalScrollIntoView) {
        Object.defineProperty(HTMLElement.prototype, "scrollIntoView", { configurable: true, value: originalScrollIntoView });
      } else {
        delete (HTMLElement.prototype as unknown as { scrollIntoView?: typeof HTMLElement.prototype.scrollIntoView }).scrollIntoView;
      }
    }
  });

  it("keeps resource links inert on hover", () => {
    vi.useFakeTimers();
    try {
      const drawer = mountRdfNavigator();
      const predicate = drawer.shadowRoot?.querySelector<HTMLAnchorElement>('.navigator .predicate a[href="https://schema.org/name"]')!;
      predicate.dispatchEvent(new MouseEvent("pointerenter", { bubbles: true, clientX: 180, clientY: 220 }));
      predicate.dispatchEvent(new MouseEvent("pointermove", { bubbles: true, clientX: 220, clientY: 240 }));
      predicate.dispatchEvent(new Event("pointerleave"));
      vi.advanceTimersByTime(30_000);
      expect(drawer.shadowRoot?.querySelector(".resource-preview")).toBeNull();
    } finally {
      vi.useRealTimers();
    }
  });

  it("does not intercept local or canonical document links", () => {
    document.body.innerHTML = '<span id="alice" rdf-predicate="https://schema.org/name">Alice</span>';
    const alice = document.getElementById("alice")!;
    alice.scrollIntoView = vi.fn();
    const canonical = document.createElement("link");
    canonical.rel = "canonical";
    canonical.href = "https://ia2.dev/spec/html-rdf";
    document.head.append(canonical);
    const drawer = mountRdfNavigator();
    const localTerms = Array.from(
      drawer.shadowRoot?.querySelectorAll<HTMLAnchorElement>("a.term-link.local-term") ?? []
    );

    expect(localTerms.length).toBeGreaterThan(0);
    for (const term of localTerms) {
      term.dispatchEvent(new MouseEvent("click", { bubbles: true, button: 0, cancelable: true }));
      expect(drawer.shadowRoot?.querySelector(".resource-preview")).toBeNull();
    }

    drawer.shadowRoot?.querySelector<HTMLButtonElement>('[data-view="turtle"]')?.click();
    const canonicalIri = drawer.shadowRoot?.querySelector<HTMLAnchorElement>(
      'a.tok.iri[href^="https://ia2.dev/spec/html-rdf"]'
    );
    expect(canonicalIri).not.toBeNull();
    canonicalIri?.dispatchEvent(new MouseEvent("click", { bubbles: true, button: 0, cancelable: true }));
    expect(drawer.shadowRoot?.querySelector(".resource-preview")).toBeNull();
  });

  it("opens predicates in a movable, eight-way resizable definition window", () => {
    const drawer = mountRdfNavigator();
    const predicate = drawer.shadowRoot?.querySelector<HTMLAnchorElement>('.navigator .predicate a[href="https://schema.org/name"]')!;
    predicate.click();
    const preview = drawer.shadowRoot?.querySelector<HTMLElement>(".resource-preview")!;
    const frame = preview.querySelector<HTMLIFrameElement>(".resource-preview-frame")!;
    const bar = preview.querySelector<HTMLElement>(".resource-preview-bar")!;
    const resizeHandles = Array.from(preview.querySelectorAll<HTMLElement>(".resize-handle"));
    const southeastResize = preview.querySelector<HTMLElement>('[data-resize="se"]')!;
    const northwestResize = preview.querySelector<HTMLElement>('[data-resize="nw"]')!;
    const close = preview.querySelector<HTMLButtonElement>(".resource-preview-close")!;
    expect(preview.getAttribute("role")).toBe("dialog");
    expect(preview.dataset.previewKind).toBe("definition");
    expect(Number.parseFloat(preview.style.width)).toBe(620);
    expect(Number.parseFloat(preview.style.height)).toBe(520);
    expect(frame.tabIndex).toBe(0);
    expect(resizeHandles.map((handle) => handle.dataset.resize)).toEqual(["n", "ne", "e", "se", "s", "sw", "w", "nw"]);

    preview.getBoundingClientRect = () => {
      const left = Number.parseFloat(preview.style.left);
      const top = Number.parseFloat(preview.style.top);
      const width = Number.parseFloat(preview.style.width);
      const height = Number.parseFloat(preview.style.height);
      return { bottom: top + height, height, left, right: left + width, top, width, x: left, y: top, toJSON: () => ({}) } as DOMRect;
    };
    const startLeft = Number.parseFloat(preview.style.left);
    const startTop = Number.parseFloat(preview.style.top);
    bar.dispatchEvent(new MouseEvent("pointerdown", { bubbles: true, button: 0, clientX: 100, clientY: 100 }));
    window.dispatchEvent(new MouseEvent("pointermove", { clientX: 130, clientY: 125 }));
    window.dispatchEvent(new MouseEvent("pointerup"));
    expect(Number.parseFloat(preview.style.left)).toBe(startLeft + 30);
    expect(Number.parseFloat(preview.style.top)).toBe(startTop + 25);

    const startWidth = Number.parseFloat(preview.style.width);
    const startHeight = Number.parseFloat(preview.style.height);
    southeastResize.dispatchEvent(new MouseEvent("pointerdown", { bubbles: true, button: 0, clientX: 300, clientY: 300 }));
    window.dispatchEvent(new MouseEvent("pointermove", { clientX: 340, clientY: 325 }));
    window.dispatchEvent(new MouseEvent("pointerup"));
    expect(Number.parseFloat(preview.style.width)).toBe(startWidth + 40);
    expect(Number.parseFloat(preview.style.height)).toBe(startHeight + 25);

    const resizedLeft = Number.parseFloat(preview.style.left);
    const resizedTop = Number.parseFloat(preview.style.top);
    const resizedWidth = Number.parseFloat(preview.style.width);
    const resizedHeight = Number.parseFloat(preview.style.height);
    northwestResize.dispatchEvent(new MouseEvent("pointerdown", { bubbles: true, button: 0, clientX: 300, clientY: 300 }));
    window.dispatchEvent(new MouseEvent("pointermove", { clientX: 320, clientY: 315 }));
    window.dispatchEvent(new MouseEvent("pointerup"));
    expect(Number.parseFloat(preview.style.left)).toBe(resizedLeft + 20);
    expect(Number.parseFloat(preview.style.top)).toBe(resizedTop + 15);
    expect(Number.parseFloat(preview.style.width)).toBe(resizedWidth - 20);
    expect(Number.parseFloat(preview.style.height)).toBe(resizedHeight - 15);

    preview.dispatchEvent(new Event("pointerleave"));
    expect(drawer.shadowRoot?.querySelector(".resource-preview")).toBe(preview);
    close.click();
    expect(drawer.shadowRoot?.querySelector(".resource-preview")).toBeNull();
  });

  it("opens non-predicate terms in a larger centered resource window", () => {
    const drawer = mountRdfNavigator();
    const subject = drawer.shadowRoot?.querySelector<HTMLAnchorElement>('.navigator .subject a[href="https://example.com/alice"]')!;
    subject.click();
    const preview = drawer.shadowRoot?.querySelector<HTMLElement>(".resource-preview")!;
    const width = Number.parseFloat(preview.style.width);
    const height = Number.parseFloat(preview.style.height);
    expect(preview.dataset.previewKind).toBe("resource");
    expect(width).toBeGreaterThan(620);
    expect(height).toBeGreaterThan(520);
    expect(Number.parseFloat(preview.style.left)).toBe(Math.round((window.innerWidth - width) / 2));
    expect(Number.parseFloat(preview.style.top)).toBe(Math.round((window.innerHeight - height) / 2));
  });

  it("keeps multiple resource previews open and independently closable", () => {
    const drawer = mountRdfNavigator();
    const predicate = drawer.shadowRoot?.querySelector<HTMLAnchorElement>('.navigator .predicate a[href="https://schema.org/name"]')!;
    predicate.click();
    predicate.click();

    const previews = Array.from(drawer.shadowRoot?.querySelectorAll<HTMLElement>(".resource-preview") ?? []);
    expect(previews).toHaveLength(2);
    expect(Number.parseFloat(previews[1]!.style.left)).toBe(Number.parseFloat(previews[0]!.style.left) + 24);
    expect(Number.parseFloat(previews[1]!.style.top)).toBe(Number.parseFloat(previews[0]!.style.top) + 24);
    expect(Number.parseInt(previews[1]!.style.zIndex, 10)).toBeGreaterThan(Number.parseInt(previews[0]!.style.zIndex, 10));

    previews[1]!.querySelector<HTMLButtonElement>(".resource-preview-close")?.click();
    expect(drawer.shadowRoot?.querySelectorAll(".resource-preview")).toHaveLength(1);
    expect(previews[0]!.isConnected).toBe(true);
    expect(previews[1]!.isConnected).toBe(false);

    previews[0]!.querySelector<HTMLButtonElement>(".resource-preview-close")?.click();
    expect(drawer.shadowRoot?.querySelector(".resource-preview")).toBeNull();
  });

  it("uses a CORS-readable sandbox fallback for DCMI PURLs that reject framing", async () => {
    document.body.innerHTML = '<span rdf-subject="https://example.com/alice" rdf-predicate="http://purl.org/dc/terms/description">Alice</span>';
    const originalFetch = window.fetch;
    const fetchMock = vi.fn().mockResolvedValue({
      headers: { get: () => "text/html; charset=utf-8" },
      ok: true,
      text: () => Promise.resolve('<html><head><title>DCMI</title></head><body><article id="description">Description</article></body></html>'),
      url: "https://www.dublincore.org/specifications/dublin-core/dcmi-terms/",
    } as unknown as Response);
    Object.defineProperty(window, "fetch", { configurable: true, value: fetchMock });
    try {
      const drawer = mountRdfNavigator();
      const predicate = drawer.shadowRoot?.querySelector<HTMLAnchorElement>('.navigator .predicate a[href="http://purl.org/dc/terms/description"]')!;
      predicate.click();
      const loadingFrame = drawer.shadowRoot?.querySelector<HTMLIFrameElement>(".resource-preview-frame")!;
      expect(loadingFrame.getAttribute("src")).toBeNull();
      expect(loadingFrame.srcdoc).toContain("Loading definition…");
      await Promise.resolve();
      await Promise.resolve();
      const frame = drawer.shadowRoot?.querySelector<HTMLIFrameElement>(".resource-preview-frame")!;
      expect(frame.getAttribute("src")).toBeNull();
      expect(fetchMock).toHaveBeenCalledWith(
        "https://www.dublincore.org/specifications/dublin-core/dcmi-terms/#description",
        expect.objectContaining({ credentials: "omit", redirect: "follow", referrerPolicy: "no-referrer" }),
      );
      expect(frame.getAttribute("sandbox")).toBe("allow-forms allow-popups allow-popups-to-escape-sandbox allow-scripts");
      await vi.waitFor(() => expect(frame.srcdoc).toContain('<base href="https://www.dublincore.org/specifications/dublin-core/dcmi-terms/">'));
      expect(frame.srcdoc).toContain("data-ia2-preview-bridge");
      expect(frame.srcdoc).toContain("ia2-rdf-preview-navigate");
      expect(frame.srcdoc).toContain('id="description"');

      drawer.shadowRoot?.querySelector<HTMLButtonElement>(".resource-preview-close")?.click();
      predicate.click();
      const cachedFrame = drawer.shadowRoot?.querySelector<HTMLIFrameElement>(".resource-preview-frame")!;
      expect(cachedFrame.srcdoc).toContain('id="description"');
      expect(fetchMock).toHaveBeenCalledTimes(1);
    } finally {
      Object.defineProperty(window, "fetch", { configurable: true, value: originalFetch });
    }
  });

  it("times out and retries fetch-first previews instead of loading forever", async () => {
    vi.useFakeTimers();
    document.body.innerHTML = '<span rdf-subject="https://example.com/alice" rdf-predicate="https://www.dublincore.org/specifications/dublin-core/dcmi-terms/?ia2-timeout=1#description">Alice</span>';
    const originalFetch = window.fetch;
    const fetchMock = vi.fn(() => new Promise<Response>(() => undefined));
    Object.defineProperty(window, "fetch", { configurable: true, value: fetchMock });
    try {
      const drawer = mountRdfNavigator();
      const predicate = drawer.shadowRoot?.querySelector<HTMLAnchorElement>('.navigator .predicate a[href*="ia2-timeout=1"]')!;
      predicate.click();
      const frame = drawer.shadowRoot?.querySelector<HTMLIFrameElement>(".resource-preview-frame")!;
      expect(frame.srcdoc).toContain("Loading definition…");

      await vi.advanceTimersByTimeAsync(3_000);
      expect(fetchMock).toHaveBeenCalledTimes(2);
      expect(frame.srcdoc).toContain("Still loading; retrying…");

      await vi.advanceTimersByTimeAsync(3_000);
      expect(frame.srcdoc).toContain("Preview unavailable.");
      expect(frame.srcdoc).not.toContain("Loading definition…");
    } finally {
      Object.defineProperty(window, "fetch", { configurable: true, value: originalFetch });
      vi.useRealTimers();
    }
  });

  it("recovers automatically when a fetch-first preview retry succeeds", async () => {
    vi.useFakeTimers();
    document.body.innerHTML = '<span rdf-subject="https://example.com/alice" rdf-predicate="https://www.dublincore.org/specifications/dublin-core/dcmi-terms/?ia2-retry=1#description">Alice</span>';
    const originalFetch = window.fetch;
    const fetchMock = vi.fn()
      .mockImplementationOnce(() => new Promise<Response>(() => undefined))
      .mockResolvedValueOnce({
        headers: { get: () => "text/html; charset=utf-8" },
        ok: true,
        text: () => Promise.resolve('<html><body><article id="description">Description</article></body></html>'),
        url: "https://www.dublincore.org/specifications/dublin-core/dcmi-terms/?ia2-retry=1",
      } as unknown as Response);
    Object.defineProperty(window, "fetch", { configurable: true, value: fetchMock });
    try {
      const drawer = mountRdfNavigator();
      const predicate = drawer.shadowRoot?.querySelector<HTMLAnchorElement>('.navigator .predicate a[href*="ia2-retry=1"]')!;
      predicate.click();
      const frame = drawer.shadowRoot?.querySelector<HTMLIFrameElement>(".resource-preview-frame")!;

      await vi.advanceTimersByTimeAsync(3_000);
      await Promise.resolve();
      expect(fetchMock).toHaveBeenCalledTimes(2);
      expect(frame.srcdoc).toContain('id="description"');
      expect(frame.srcdoc).not.toContain("Still loading; retrying…");
    } finally {
      Object.defineProperty(window, "fetch", { configurable: true, value: originalFetch });
      vi.useRealTimers();
    }
  });

  it("resolves rdf:type to its human-readable RDF 1.2 definition", () => {
    document.body.innerHTML = '<span rdf-subject="https://example.com/alice" rdf-predicate="http://www.w3.org/1999/02/22-rdf-syntax-ns#type" rdf-object="https://schema.org/Person">Alice</span>';
    const originalFetch = window.fetch;
    const fetchMock = vi.fn(() => new Promise<Response>(() => undefined));
    Object.defineProperty(window, "fetch", { configurable: true, value: fetchMock });
    try {
      const drawer = mountRdfNavigator();
      const predicate = drawer.shadowRoot?.querySelector<HTMLAnchorElement>('.navigator .predicate a[href="http://www.w3.org/1999/02/22-rdf-syntax-ns#type"]')!;
      predicate.click();
      const frame = drawer.shadowRoot?.querySelector<HTMLIFrameElement>(".resource-preview-frame")!;
      const open = drawer.shadowRoot?.querySelector<HTMLAnchorElement>(".resource-preview-open")!;
      expect(frame.getAttribute("src")).toBeNull();
      expect(frame.srcdoc).toContain("Loading definition…");
      expect(fetchMock).toHaveBeenCalledWith("https://www.w3.org/TR/rdf12-schema/#ch_type", expect.any(Object));
      expect(open.href).toBe("http://www.w3.org/1999/02/22-rdf-syntax-ns#type");
    } finally {
      Object.defineProperty(window, "fetch", { configurable: true, value: originalFetch });
    }
  });

  it("keeps same-window links navigable inside a fetched preview", () => {
    const originalFetch = window.fetch;
    const fetchMock = vi.fn(() => new Promise<Response>(() => undefined));
    Object.defineProperty(window, "fetch", { configurable: true, value: fetchMock });
    try {
      const drawer = mountRdfNavigator();
      const predicate = drawer.shadowRoot?.querySelector<HTMLAnchorElement>('.navigator .predicate a[href="https://schema.org/name"]')!;
      predicate.click();
      const frame = drawer.shadowRoot?.querySelector<HTMLIFrameElement>(".resource-preview-frame")!;
      const url = drawer.shadowRoot?.querySelector<HTMLElement>(".resource-preview-url")!;
      const open = drawer.shadowRoot?.querySelector<HTMLAnchorElement>(".resource-preview-open")!;
      window.dispatchEvent(new MessageEvent("message", {
        data: { type: "ia2-rdf-preview-navigate", href: "https://schema.org/Person" },
        source: frame.contentWindow,
      }));
      expect(frame.src).toBe("https://schema.org/Person");
      expect(url.textContent).toBe("https://schema.org/Person");
      expect(open.href).toBe("https://schema.org/Person");
      expect(fetchMock).toHaveBeenLastCalledWith("https://schema.org/Person", expect.any(Object));
    } finally {
      Object.defineProperty(window, "fetch", { configurable: true, value: originalFetch });
    }
  });

  it("changes drawer position in place and preserves the selected layout", () => {
    const drawer = mountRdfNavigator();
    const positionSwitch = drawer.shadowRoot?.querySelector<HTMLElement>(".position-switch")!;
    const options = Array.from(drawer.shadowRoot?.querySelectorAll<HTMLButtonElement>(".position-option") ?? []);
    const viewport = drawer.shadowRoot?.querySelector<HTMLElement>(".viewport")!;
    viewport.scrollTop = 84;
    expect(options.every((option) => option.querySelector(".position-icon"))).toBe(true);
    expect(options.map((option) => option.textContent?.trim())).toEqual(["", "", "", "", "", "", ""]);
    expect(options.map((option) => option.getAttribute("aria-label"))).toEqual([
      "Right, full height",
      "Right, top half",
      "Right, bottom half",
      "Floating, centered",
      "Left, full height",
      "Left, bottom half",
      "Left, top half",
    ]);
    expect(options.map((option) => option.getAttribute("aria-checked"))).toEqual(["true", "false", "false", "false", "false", "false", "false"]);
    expect(options.map((option) => option.tabIndex)).toEqual([0, -1, -1, -1, -1, -1, -1]);
    expect(drawer.shadowRoot?.querySelector<HTMLElement>(".panel")?.dataset.position).toBe("right");

    options[0]!.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "ArrowRight" }));
    expect(drawer.shadowRoot?.querySelector<HTMLElement>(".panel")?.dataset.position).toBe("right-top");
    expect(options[1]!.getAttribute("aria-checked")).toBe("true");
    expect(options[1]!.tabIndex).toBe(0);
    expect(drawer.shadowRoot?.querySelector(".viewport")).toBe(viewport);
    expect(viewport.scrollTop).toBe(84);

    options[3]!.click();
    const panel = drawer.shadowRoot?.querySelector<HTMLElement>(".panel")!;
    expect(panel.dataset.position).toBe("floating");
    expect(drawer.shadowRoot?.querySelector<HTMLElement>(".launcher")?.dataset.position).toBe("floating");
    expect(panel.style.left).not.toBe("");
    expect(panel.style.top).not.toBe("");
    expect(panel.style.width).not.toBe("");
    expect(panel.style.height).not.toBe("");
    expect(drawer.shadowRoot?.querySelectorAll(".resize-handle")).toHaveLength(8);

    const startingLeft = Number.parseFloat(panel.style.left);
    const startingTop = Number.parseFloat(panel.style.top);
    panel.querySelector<HTMLElement>(".tabs")!.dispatchEvent(new MouseEvent("pointerdown", { bubbles: true, button: 0, clientX: 100, clientY: 100 }));
    window.dispatchEvent(new MouseEvent("pointermove", { clientX: 130, clientY: 120 }));
    window.dispatchEvent(new MouseEvent("pointerup"));
    expect(Number.parseFloat(panel.style.left)).toBe(startingLeft + 30);
    expect(Number.parseFloat(panel.style.top)).toBe(startingTop + 20);

    const draggedLeft = Number.parseFloat(panel.style.left);
    const draggedTop = Number.parseFloat(panel.style.top);
    panel.querySelector<HTMLElement>(".tab")!.dispatchEvent(new MouseEvent("pointerdown", { bubbles: true, button: 0, clientX: 100, clientY: 100 }));
    window.dispatchEvent(new MouseEvent("pointermove", { clientX: 150, clientY: 150 }));
    window.dispatchEvent(new MouseEvent("pointerup"));
    expect(Number.parseFloat(panel.style.left)).toBe(draggedLeft);
    expect(Number.parseFloat(panel.style.top)).toBe(draggedTop);

    const draggedWidth = Number.parseFloat(panel.style.width);
    const draggedHeight = Number.parseFloat(panel.style.height);
    panel.querySelector<HTMLElement>('[data-resize="se"]')!.dispatchEvent(new MouseEvent("pointerdown", { bubbles: true, button: 0, clientX: 200, clientY: 200 }));
    window.dispatchEvent(new MouseEvent("pointermove", { clientX: 240, clientY: 225 }));
    window.dispatchEvent(new MouseEvent("pointerup"));
    expect(Number.parseFloat(panel.style.width)).toBeGreaterThan(draggedWidth);
    expect(Number.parseFloat(panel.style.height)).toBeGreaterThan(draggedHeight);

    options[5]!.click();
    expect(drawer.shadowRoot?.querySelector<HTMLElement>(".launcher")?.dataset.position).toBe("left-bottom");
    positionSwitch.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "End" }));
    expect(drawer.shadowRoot?.querySelector<HTMLElement>(".panel")?.dataset.position).toBe("left-top");
    options[5]!.click();
    drawer.refresh();
    expect(drawer.shadowRoot?.querySelector<HTMLButtonElement>('.position-option[aria-checked="true"]')?.dataset.position).toBe("left-bottom");
  });

  it("restores the position mode and floating geometry from session storage", () => {
    const drawer = mountRdfNavigator();
    drawer.shadowRoot?.querySelector<HTMLButtonElement>('[data-position="floating"]')!.click();
    const panel = drawer.shadowRoot?.querySelector<HTMLElement>(".panel")!;
    panel.querySelector<HTMLElement>(".drag-grip")!.dispatchEvent(new MouseEvent("pointerdown", { bubbles: true, button: 0, clientX: 100, clientY: 100 }));
    window.dispatchEvent(new MouseEvent("pointermove", { clientX: 130, clientY: 120 }));
    window.dispatchEvent(new MouseEvent("pointerup"));
    panel.querySelector<HTMLElement>('[data-resize="se"]')!.dispatchEvent(new MouseEvent("pointerdown", { bubbles: true, button: 0, clientX: 200, clientY: 200 }));
    window.dispatchEvent(new MouseEvent("pointermove", { clientX: 240, clientY: 225 }));
    window.dispatchEvent(new MouseEvent("pointerup"));

    const stored = JSON.parse(sessionStorage.getItem(SESSION_STATE_KEY)!) as {
      floatingRect: { height: number; width: number; x: number; y: number };
      position: string;
    };
    expect(stored.position).toBe("floating");
    expect(stored.floatingRect).toEqual({
      height: Number.parseFloat(panel.style.height),
      width: Number.parseFloat(panel.style.width),
      x: Number.parseFloat(panel.style.left),
      y: Number.parseFloat(panel.style.top),
    });

    drawer.remove();
    const restored = mountRdfNavigator();
    const restoredPanel = restored.shadowRoot?.querySelector<HTMLElement>(".panel")!;
    expect(restoredPanel.dataset.position).toBe("floating");
    expect(restored.shadowRoot?.querySelector<HTMLButtonElement>('.position-option[aria-checked="true"]')?.dataset.position).toBe("floating");
    expect({
      height: Number.parseFloat(restoredPanel.style.height),
      width: Number.parseFloat(restoredPanel.style.width),
      x: Number.parseFloat(restoredPanel.style.left),
      y: Number.parseFloat(restoredPanel.style.top),
    }).toEqual(stored.floatingRect);
  });

  it("recognizes and locates visible elements represented by local terms", () => {
    const documentUrl = new URL(document.URL);
    documentUrl.hash = "";
    document.body.innerHTML = [
      `<span rdf-subject="" rdf-predicate="https://schema.org/name">Document</span>`,
      `<span id="decision" rdf-predicate="https://schema.org/name">Decision</span>`,
      `<a href="#decision" rdf-subject="https://example.com/claim" rdf-predicate="https://schema.org/about">Decision reference</a>`,
    ].join("");
    const documentScroll = vi.fn();
    document.documentElement.scrollIntoView = documentScroll;
    document.documentElement.animate = vi.fn() as unknown as typeof document.documentElement.animate;
    const decision = document.getElementById("decision")!;
    decision.scrollIntoView = vi.fn();
    decision.animate = vi.fn() as unknown as typeof decision.animate;

    const drawer = mountRdfNavigator();
    const localLinks = Array.from(drawer.shadowRoot?.querySelectorAll<HTMLAnchorElement>(".local-term") ?? []);
    const documentLink = localLinks.find((link) => link.href === documentUrl.href);
    const fragmentLink = localLinks.find((link) => link.href === `${documentUrl.href}#decision`);
    expect(documentLink?.target).toBe("");
    expect(fragmentLink?.target).toBe("");

    expect(fragmentLink?.href).toBe(`${documentUrl.href}#decision`);
    document.defaultView?.history.replaceState(null, "", `${documentUrl.href}#decision`);
    documentLink?.click();
    expect(document.location.hash).toBe("");
    expect(documentScroll).toHaveBeenCalledOnce();

    const termLocates = Array.from(drawer.shadowRoot?.querySelectorAll<HTMLButtonElement>(".term-locate-button") ?? []);
    const carrierLocates = Array.from(drawer.shadowRoot?.querySelectorAll<HTMLButtonElement>(".carrier-locate-button") ?? []);
    expect(termLocates.map((button) => button.getAttribute("aria-label"))).toEqual([
      "Locate <html>",
      "Locate <span#decision>",
      "Locate <span#decision>",
    ]);
    expect(carrierLocates).toHaveLength(2);
    expect(fragmentLink?.closest(".quad")?.querySelector(".carrier-locate-button")).toBeNull();
    termLocates[2]!.click();
    expect(decision.scrollIntoView).toHaveBeenCalledOnce();
    expect(decision.animate).toHaveBeenCalledOnce();
  });

  it("filters Navigator statements by terms and reports an empty result", () => {
    document.body.innerHTML = [
      '<span rdf-subject="https://example.com/alice" rdf-predicate="https://schema.org/name">Alice</span>',
      '<a href="https://example.com/charlie" rdf-subject="https://example.com/bob" rdf-predicate="https://schema.org/knows">Charlie</a>',
    ].join("");
    const drawer = mountRdfNavigator();
    const search = drawer.shadowRoot?.querySelector<HTMLInputElement>(".navigator-search");
    const rows = Array.from(drawer.shadowRoot?.querySelectorAll<HTMLLIElement>(".quad") ?? []);
    const count = drawer.shadowRoot?.querySelector<HTMLOutputElement>(".filter-count");
    const empty = drawer.shadowRoot?.querySelector<HTMLElement>(".filter-empty");

    expect(search?.getAttribute("aria-label")).toBeNull();
    expect(search?.labels?.[0]?.textContent).toBe("Filter RDF statements");
    expect(count?.parentElement?.classList.contains("navigator-search-group")).toBe(true);
    expect(count?.textContent).toBe("");
    search!.value = "example.com";
    search?.dispatchEvent(new Event("input"));
    expect(rows.map((row) => row.hidden)).toEqual([false, false]);
    expect(count?.textContent).toBe("");

    search!.value = "ALICE";
    search?.dispatchEvent(new Event("input"));
    expect(rows.map((row) => row.hidden)).toEqual([false, true]);
    expect(getComputedStyle(rows[0]!).display).not.toBe("none");
    expect(getComputedStyle(rows[1]!).display).toBe("none");
    expect(count?.textContent).toBe("1 of 2");

    search!.value = "schema.org/knows";
    search?.dispatchEvent(new Event("input"));
    expect(rows.map((row) => row.hidden)).toEqual([true, false]);

    search!.value = "missing term";
    search?.dispatchEvent(new Event("input"));
    expect(empty?.hidden).toBe(false);
    expect(count?.textContent).toBe("0 of 2");
  });

  it("suggests ontology terms by labels, OWL kinds, domains, and ranges", () => {
    document.body.innerHTML = [
      '<a href="http://www.w3.org/2002/07/owl#Class" rdf-subject="https://example.com/Person" rdf-predicate="http://www.w3.org/1999/02/22-rdf-syntax-ns#type">Class</a>',
      '<span rdf-subject="https://example.com/Person" rdf-predicate="http://www.w3.org/2000/01/rdf-schema#label">Person</span>',
      '<a href="https://example.com/Person" rdf-subject="https://schema.org/name" rdf-predicate="http://www.w3.org/2000/01/rdf-schema#domain">Person domain</a>',
      '<a href="http://www.w3.org/2001/XMLSchema#string" rdf-subject="https://schema.org/name" rdf-predicate="http://www.w3.org/2000/01/rdf-schema#range">String range</a>',
    ].join("");
    const drawer = mountRdfNavigator();
    drawer.open();
    const search = drawer.shadowRoot?.querySelector<HTMLInputElement>(".navigator-search")!;
    const suggestions = drawer.shadowRoot?.querySelector<HTMLElement>(".typeahead")!;

    expect(search.getAttribute("role")).toBe("combobox");
    expect(search.getAttribute("aria-autocomplete")).toBe("list");
    expect(search.getAttribute("aria-controls")).toBe(suggestions.id);

    search.focus();
    search.value = "Person";
    search.dispatchEvent(new Event("input"));
    const person = Array.from(suggestions.querySelectorAll<HTMLElement>('[role="option"]'))
      .find((option) => option.querySelector(".typeahead-term")?.textContent === "<https://example.com/Person>");
    expect(person?.querySelector(".typeahead-label")?.textContent).toBe("Person");
    expect(person?.querySelector(".typeahead-meta")?.textContent).toContain("OWL class");
    expect(search.getAttribute("aria-expanded")).toBe("true");

    search.value = "range string";
    search.dispatchEvent(new Event("input"));
    const rangeOptions = Array.from(suggestions.querySelectorAll<HTMLElement>('[role="option"]'));
    expect(rangeOptions).toHaveLength(1);
    expect(rangeOptions[0]?.querySelector(".typeahead-term")?.textContent).toBe("schema:name");
    expect(rangeOptions[0]?.querySelector(".typeahead-meta")?.textContent).toContain("range xsd:string");

    search.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, cancelable: true, key: "ArrowDown" }));
    expect(search.getAttribute("aria-activedescendant")).toBe(rangeOptions[0]?.id);
    search.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, cancelable: true, key: "Enter" }));
    expect(search.value).toBe("schema:name");
    expect(suggestions.hidden).toBe(true);
    expect(Array.from(drawer.shadowRoot?.querySelectorAll<HTMLLIElement>(".quad") ?? []).map((row) => row.hidden))
      .toEqual([true, true, false, false]);

    search.value = "Person";
    search.dispatchEvent(new Event("input"));
    search.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, cancelable: true, key: "Escape" }));
    expect(search.getAttribute("aria-expanded")).toBe("false");
    expect(drawer.shadowRoot?.querySelector<HTMLElement>(".panel")?.dataset.open).toBe("true");
  });

  it("keeps the active filter and caret through live document refreshes", async () => {
    document.body.innerHTML = [
      '<span rdf-subject="https://example.com/alice" rdf-predicate="https://schema.org/name">Alice</span>',
      '<span rdf-subject="https://example.com/bob" rdf-predicate="https://schema.org/name">Bob</span>',
    ].join("");
    const drawer = mountRdfNavigator();
    drawer.open();
    await Promise.resolve();
    const search = drawer.shadowRoot?.querySelector<HTMLInputElement>(".navigator-search")!;
    search.value = "Alice";
    search.dispatchEvent(new Event("input"));
    search.focus();
    search.setSelectionRange(1, 4);

    document.body.querySelector("span")!.textContent = "Alice updated";
    await new Promise((resolve) => window.setTimeout(resolve, 180));

    const replacement = drawer.shadowRoot?.querySelector<HTMLInputElement>(".navigator-search")!;
    const rows = Array.from(drawer.shadowRoot?.querySelectorAll<HTMLLIElement>(".quad") ?? []);
    expect(replacement).not.toBe(search);
    expect(replacement.value).toBe("Alice");
    expect(rows.map((row) => row.hidden)).toEqual([false, true]);
    expect(drawer.shadowRoot?.activeElement).toBe(replacement);
    expect([replacement.selectionStart, replacement.selectionEnd]).toEqual([1, 4]);
  });

  it("contains keyboard focus and key events while the Navigator is open", async () => {
    const drawer = mountRdfNavigator();
    drawer.open();
    await Promise.resolve();
    const pageKeydown = vi.fn();
    const pageKeyup = vi.fn();
    document.addEventListener("keydown", pageKeydown);
    document.addEventListener("keyup", pageKeyup);
    try {
      const panel = drawer.shadowRoot?.querySelector<HTMLElement>(".panel")!;
      const focusables = Array.from(panel.querySelectorAll<HTMLElement>('a[href], button, input, select, textarea, [tabindex]'))
        .filter((element) => element.tabIndex >= 0 && !element.hasAttribute("disabled") && !element.closest("[hidden]") && element.getAttribute("aria-hidden") !== "true");
      const first = focusables[0]!;
      const last = focusables.at(-1)!;
      last.focus();
      const tab = new KeyboardEvent("keydown", { bubbles: true, cancelable: true, composed: true, key: "Tab" });
      last.dispatchEvent(tab);
      expect(tab.defaultPrevented).toBe(true);
      expect(drawer.shadowRoot?.activeElement).toBe(first);
      expect(pageKeydown).not.toHaveBeenCalled();

      const search = drawer.shadowRoot?.querySelector<HTMLInputElement>(".navigator-search")!;
      search.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, composed: true, key: "a" }));
      search.dispatchEvent(new KeyboardEvent("keyup", { bubbles: true, composed: true, key: "a" }));
      expect(pageKeydown).not.toHaveBeenCalled();
      expect(pageKeyup).not.toHaveBeenCalled();
    } finally {
      document.removeEventListener("keydown", pageKeydown);
      document.removeEventListener("keyup", pageKeyup);
    }
  });

  it("toggles counted namespaces without losing focus during live refresh", async () => {
    document.body.innerHTML = [
      '<span rdf-subject="https://example.com/items/alice" rdf-predicate="https://schema.org/name">Alice</span>',
      '<a href="https://people.example/id/charlie" rdf-subject="https://example.com/items/bob" rdf-predicate="https://terms.example/vocab/knows">Charlie</a>',
    ].join("");
    const drawer = mountRdfNavigator();
    const rows = Array.from(drawer.shadowRoot?.querySelectorAll<HTMLLIElement>(".quad") ?? []);
    const schema = drawer.shadowRoot?.querySelector<HTMLButtonElement>('.vocabulary-toggle[data-namespace="https://schema.org/"]');
    const undeclared = drawer.shadowRoot?.querySelector<HTMLButtonElement>('.vocabulary-toggle[data-namespace="https://terms.example/vocab/"]');
    const definition = drawer.shadowRoot?.querySelector<HTMLAnchorElement>('.vocabulary-link[href="https://terms.example/vocab/"]');
    const navigation = drawer.shadowRoot?.querySelector<HTMLElement>(".vocabularies")!;
    const links = drawer.shadowRoot?.querySelector<HTMLElement>(".vocabulary-links")!;

    expect(schema?.getAttribute("aria-pressed")).toBe("true");
    expect(schema?.querySelector(".vocabulary-count")?.textContent).toBe("1");
    expect(undeclared?.textContent).toBe("terms.example/vocab1");
    expect(undeclared?.querySelector(".vocabulary-name")?.textContent).toBe("terms.example/vocab");
    expect(undeclared?.getAttribute("aria-label")).toBe("Hide 1 statement using https://terms.example/vocab/");
    expect(definition?.target).toBe("_blank");
    Object.defineProperty(links, "clientWidth", { configurable: true, value: 100 });
    Object.defineProperty(links, "scrollWidth", { configurable: true, value: 300 });
    links.scrollLeft = 0;
    links.dispatchEvent(new Event("scroll"));
    expect(navigation.dataset.overflowLeft).toBe("false");
    expect(navigation.dataset.overflowRight).toBe("true");
    links.scrollLeft = 200;
    links.dispatchEvent(new Event("scroll"));
    expect(navigation.dataset.overflowLeft).toBe("true");
    expect(navigation.dataset.overflowRight).toBe("false");
    schema?.focus();
    schema?.click();
    expect(schema?.getAttribute("aria-pressed")).toBe("false");
    expect(rows.map((row) => row.hidden)).toEqual([true, false]);
    expect(drawer.shadowRoot?.activeElement).toBe(schema);

    document.body.setAttribute("data-ui-state", "busy");
    await new Promise((resolve) => window.setTimeout(resolve, 180));
    expect(drawer.shadowRoot?.querySelector('.vocabulary-toggle[data-namespace="https://schema.org/"]')).toBe(schema);
    expect(drawer.shadowRoot?.activeElement).toBe(schema);

    document.body.querySelector("span")!.textContent = "Alice updated";
    await new Promise((resolve) => window.setTimeout(resolve, 180));
    const refreshedSchema = drawer.shadowRoot?.querySelector<HTMLButtonElement>('.vocabulary-toggle[data-namespace="https://schema.org/"]');
    expect(refreshedSchema).not.toBe(schema);
    expect(refreshedSchema?.getAttribute("aria-pressed")).toBe("false");
    expect(drawer.shadowRoot?.activeElement).toBe(refreshedSchema);

    refreshedSchema?.click();
    const refreshedRows = Array.from(drawer.shadowRoot?.querySelectorAll<HTMLLIElement>(".quad") ?? []);
    const refreshedUndeclared = drawer.shadowRoot?.querySelector<HTMLButtonElement>('.vocabulary-toggle[data-namespace="https://terms.example/vocab/"]');
    refreshedUndeclared?.click();
    expect(refreshedRows.map((row) => row.hidden)).toEqual([false, true]);
  });

  it("synchronizes page and Navigator focus through one mode control", async () => {
    document.body.innerHTML = [
      '<span rdf-subject="https://example.com/alice" rdf-predicate="https://schema.org/name">Alice</span>',
      '<span rdf-subject="https://example.com/bob" rdf-predicate="https://schema.org/name">Bob</span>',
    ].join("");
    const sources = Array.from(document.body.querySelectorAll<HTMLElement>("[rdf-predicate]"));
    const makeRect = (top: number, height = 30): DOMRect => ({
      bottom: top + height,
      height,
      left: 10,
      right: 210,
      top,
      width: 200,
      x: 10,
      y: top,
      toJSON: () => ({}),
    });
    sources[0]!.getBoundingClientRect = () => makeRect(20);
    sources[1]!.getBoundingClientRect = () => makeRect(window.innerHeight + 100);
    sources.forEach((source) => {
      source.scrollIntoView = vi.fn();
      source.animate = vi.fn(() => ({ cancel: vi.fn() }) as unknown as Animation);
    });

    const drawer = mountRdfNavigator();
    const syncSwitch = drawer.shadowRoot?.querySelector<HTMLElement>(".sync-switch")!;
    const syncOptions = Array.from(drawer.shadowRoot?.querySelectorAll<HTMLButtonElement>(".sync-option") ?? []);
    const viewport = drawer.shadowRoot?.querySelector<HTMLElement>(".viewport")!;
    const rows = Array.from(drawer.shadowRoot?.querySelectorAll<HTMLLIElement>(".quad") ?? []);
    rows.forEach((row) => { row.scrollIntoView = vi.fn(); });
    expect(syncSwitch.getAttribute("role")).toBe("radiogroup");
    expect(syncOptions.every((option) => option.querySelector(".sync-icon"))).toBe(true);
    expect(syncOptions.map((option) => option.textContent?.trim())).toEqual(["", "", ""]);
    expect(syncOptions.map((option) => option.getAttribute("aria-label"))).toEqual([
      "Scroll synchronization off",
      "Follow page viewport in Navigator",
      "Follow Navigator in page",
    ]);
    expect(syncOptions.map((option) => option.getAttribute("aria-checked"))).toEqual(["true", "false", "false"]);
    expect(syncOptions.map((option) => option.tabIndex)).toEqual([0, -1, -1]);

    syncOptions[1]!.click();
    expect(rows.map((row) => row.hidden)).toEqual([false, true]);
    expect(drawer.shadowRoot?.querySelector(".filter-count")?.textContent).toBe("1 of 2");
    expect(syncOptions[1]!.getAttribute("aria-checked")).toBe("true");
    sources[1]!.dispatchEvent(new Event("pointerenter"));
    expect(rows[1]?.hidden).toBe(false);
    expect(rows[1]?.classList.contains("is-corresponding")).toBe(true);
    expect(rows[1]?.scrollIntoView).toHaveBeenCalledOnce();
    sources[1]!.dispatchEvent(new Event("pointerleave"));
    expect(rows[1]?.hidden).toBe(true);

    viewport.getBoundingClientRect = () => makeRect(0, 300);
    rows[0]!.getBoundingClientRect = () => makeRect(8, 40);
    rows[1]!.getBoundingClientRect = () => makeRect(105, 40);
    syncOptions[1]!.focus();
    syncOptions[1]!.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "ArrowRight" }));
    expect(syncOptions[2]!.getAttribute("aria-checked")).toBe("true");
    expect(drawer.shadowRoot?.activeElement).toBe(syncOptions[2]);
    await new Promise((resolve) => window.setTimeout(resolve, 60));
    expect(sources[1]?.scrollIntoView).toHaveBeenCalled();
    rows[0]!.dispatchEvent(new Event("pointerenter"));
    expect(sources[0]?.scrollIntoView).toHaveBeenCalled();
    expect(sources[0]?.animate).toHaveBeenCalled();
  });

  it("indents nested RDF carriers while ignoring unannotated wrappers", () => {
    document.body.innerHTML = `
      <a id="parent" href="https://example.com/bob" rdf-predicate="https://schema.org/knows">
        <div><span id="child" rdf-predicate="https://schema.org/name">Bob</span></div>
      </a>
      <span id="sibling" rdf-predicate="https://schema.org/name">Alice</span>
    `;
    const drawer = mountRdfNavigator();
    const rows = Array.from(drawer.shadowRoot?.querySelectorAll<HTMLElement>(".quad") ?? []);
    expect(rows.map((row) => row.dataset.depth)).toEqual(["0", "1", "0"]);
    expect(rows[0]?.querySelector(".quad-terms code")?.textContent).not.toMatch(/^\d+\.\s/);
    expect(rows[1]?.style.getPropertyValue("--rdf-indent")).toBe("16px");
    expect(rows[1]?.querySelector(".structure-marker")?.textContent).toBe("↳");
    expect(rows[0]?.querySelector(".structure-marker")).toBeNull();
  });

  it("only offers Locate for rendered statement carriers", () => {
    document.head.insertAdjacentHTML(
      "beforeend",
      '<meta content="Hidden metadata" rdf-subject="https://example.com/page" rdf-predicate="https://schema.org/description">',
    );
    const drawer = mountRdfNavigator();
    const locateButtons = Array.from(drawer.shadowRoot?.querySelectorAll<HTMLButtonElement>(".carrier-locate-button") ?? []);
    expect(locateButtons.map((button) => button.getAttribute("aria-label"))).toEqual(["Locate <span>"]);
    expect(locateButtons[0]?.textContent).toBe("⌖");
    expect(locateButtons[0]?.closest(".preview-actions")).not.toBeNull();
    expect(drawer.shadowRoot?.querySelectorAll(".source-toggle")).toHaveLength(3);
    const metaRow = Array.from(drawer.shadowRoot?.querySelectorAll<HTMLElement>(".quad") ?? []).find((row) => row.textContent?.includes("Hidden metadata"));
    const metaToggles = Array.from(metaRow?.querySelectorAll<HTMLButtonElement>(".source-toggle") ?? []);
    expect(metaToggles).toHaveLength(1);
    expect(metaToggles[0]?.getAttribute("aria-label")).toBe("Show HTML for <meta>");
  });

  it("keeps Navigator state when locating a statement", async () => {
    const source = document.body.querySelector<HTMLElement>("[rdf-predicate]")!;
    const cancelLocate = vi.fn();
    source.scrollIntoView = vi.fn();
    source.animate = vi.fn(() => ({ cancel: cancelLocate }) as unknown as Animation);
    const drawer = mountRdfNavigator();
    const viewport = drawer.shadowRoot?.querySelector<HTMLElement>(".viewport")!;
    const row = drawer.shadowRoot?.querySelector<HTMLElement>(".quad")!;
    const search = drawer.shadowRoot?.querySelector<HTMLInputElement>(".navigator-search")!;
    const locate = drawer.shadowRoot?.querySelector<HTMLButtonElement>(".carrier-locate-button")!;
    search.value = "alice";
    search.dispatchEvent(new Event("input"));
    viewport.scrollTop = 96;

    locate.click();
    await new Promise((resolve) => window.setTimeout(resolve, 180));

    expect(source.scrollIntoView).toHaveBeenCalledOnce();
    expect(source.animate).toHaveBeenCalledOnce();
    expect(drawer.shadowRoot?.querySelector(".navigator-search")).toBe(search);
    expect(search.value).toBe("alice");
    expect(viewport.scrollTop).toBe(96);

    row.dispatchEvent(new Event("pointerleave"));
    expect(cancelLocate).toHaveBeenCalledOnce();
  });

  it("reveals highlighted carrier HTML with or without child content", () => {
    document.body.innerHTML = '<article id="profile" rdf-subject="https://example.com/alice" rdf-predicate="https://schema.org/name"><strong>Alice</strong></article>';
    const drawer = mountRdfNavigator();
    const elementButton = drawer.shadowRoot?.querySelector<HTMLButtonElement>('.source-toggle[data-children="false"]');
    const childrenButton = drawer.shadowRoot?.querySelector<HTMLButtonElement>('.source-toggle[data-children="true"]');
    expect(drawer.shadowRoot?.querySelector(".quad-actions > .preview-actions")).not.toBeNull();
    expect(elementButton?.textContent).toBe("</>");
    expect(childrenButton?.textContent).toBe("</>+");

    elementButton?.click();
    const elementCode = drawer.shadowRoot?.querySelector<HTMLElement>(".source-code code");
    expect(elementButton?.getAttribute("aria-expanded")).toBe("true");
    expect(elementButton?.getAttribute("aria-label")).toBe("Hide HTML for <article#profile> without child content");
    expect(elementButton?.closest(".quad")?.classList.contains("source-open")).toBe(true);
    expect(elementCode?.textContent).toContain('<article id="profile"');
    expect(elementCode?.textContent).not.toContain("<strong>");
    expect(drawer.shadowRoot?.querySelector('.source-code .tok.name')?.textContent).toBe("article");

    elementButton?.click();
    expect(elementButton?.getAttribute("aria-expanded")).toBe("false");
    expect(elementButton?.getAttribute("aria-label")).toBe("Show HTML for <article#profile> without child content");
    expect(elementButton?.closest(".quad")?.classList.contains("source-open")).toBe(false);
    expect(drawer.shadowRoot?.querySelector(".source-code")).toBeNull();

    childrenButton?.click();
    const childrenCode = drawer.shadowRoot?.querySelector<HTMLElement>(".source-code code");
    expect(elementButton?.getAttribute("aria-expanded")).toBe("false");
    expect(childrenButton?.getAttribute("aria-expanded")).toBe("true");
    expect(childrenCode?.textContent).toContain("<strong>Alice</strong>");

    childrenButton?.setAttribute("aria-expanded", "false");
    childrenButton?.click();
    expect(childrenButton?.getAttribute("aria-expanded")).toBe("false");
    expect(drawer.shadowRoot?.querySelector(".source-code")).toBeNull();
  });

  it("automatically reflects semantic mutations in the live DOM", async () => {
    const drawer = mountRdfNavigator();
    expect(drawer.shadowRoot?.querySelector(".count")?.textContent).toBe("1");

    const statement = document.createElement("a");
    statement.href = "https://example.com/bob";
    statement.setAttribute("rdf-subject", "https://example.com/alice");
    statement.setAttribute("rdf-predicate", "https://schema.org/knows");
    document.body.prepend(statement);

    await new Promise((resolve) => window.setTimeout(resolve, 180));
    expect(drawer.shadowRoot?.querySelector(".count")?.textContent).toBe("2");
  });

  it("updates local document terms when the canonical link changes", async () => {
    document.body.innerHTML = '<span id="alice" rdf-predicate="https://schema.org/name">Alice</span>';
    const alice = document.getElementById("alice")!;
    alice.scrollIntoView = vi.fn();
    const canonical = document.createElement("link");
    canonical.rel = "canonical";
    canonical.href = "https://ia2.dev/spec/html-rdf";
    document.head.append(canonical);
    const drawer = mountRdfNavigator();
    const subject = (): HTMLAnchorElement | null => drawer.shadowRoot?.querySelector('.quad-terms > code:first-child a') ?? null;

    expect(subject()?.href).toBe("https://ia2.dev/spec/html-rdf#alice");
    expect(subject()?.classList.contains("local-term")).toBe(true);
    expect(subject()?.target).toBe("");
    subject()?.click();
    expect(document.location.hash).toBe("#alice");
    expect(alice.scrollIntoView).toHaveBeenCalledOnce();

    canonical.href = "https://ia2.dev/spec/html-rdf-next";
    await new Promise((resolve) => window.setTimeout(resolve, 180));
    expect(subject()?.href).toBe("https://ia2.dev/spec/html-rdf-next#alice");
    expect(subject()?.classList.contains("local-term")).toBe(true);
  });
});
