import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  extractDataset,
  fromPortableExtractionResult,
  mountRdfNavigator,
  toPortableExtractionResult,
} from "../src/index.js";

beforeEach(() => {
  document.documentElement.setAttribute("rdf-version", "1.2");
  document.body.innerHTML = "";
});

afterEach(() => {
  document.querySelector("ia2-rdf-navigator")?.remove();
});

describe("Navigator document sources", () => {
  it("serializes frame results without DOM references and restores inert carriers", () => {
    document.body.innerHTML = '<strong rdf-subject="https://example.test/item" rdf-predicate="https://schema.org/name">Portable fact</strong>';
    const portable = toPortableExtractionResult(extractDataset(document));
    const cloned = structuredClone(portable);

    expect(cloned.portableVersion).toBe(1);
    expect(cloned.quads).toHaveLength(1);
    expect(cloned.sources).toEqual([
      expect.objectContaining({ markup: expect.stringContaining("Portable fact") }),
    ]);
    const restored = fromPortableExtractionResult(cloned, document);
    expect(restored.quads[0]?.source).toBeInstanceOf(Element);
    expect(restored.quads[0]?.source.isConnected).toBe(false);
    expect(restored.quads[0]?.source.outerHTML).toContain("Portable fact");
  });

  it("lists directly accessible frames and inspects one document without unioning datasets", () => {
    document.body.innerHTML = '<span rdf-subject="https://example.test/top" rdf-predicate="https://schema.org/name">Top fact</span>';
    const frame = document.createElement("iframe");
    frame.title = "Rendered document";
    document.body.append(frame);
    frame.contentDocument!.documentElement.setAttribute("rdf-version", "1.2");
    frame.contentDocument!.body.innerHTML = '<span rdf-subject="https://example.test/frame" rdf-predicate="https://schema.org/name">Frame fact</span>';

    const drawer = mountRdfNavigator();
    expect(drawer.shadowRoot?.querySelector(".launcher .count")?.textContent).toBe("2");
    expect(drawer.shadowRoot?.querySelectorAll(".quad")).toHaveLength(1);
    expect(drawer.shadowRoot?.textContent).toContain("Top fact");

    drawer.shadowRoot?.querySelector<HTMLButtonElement>('[data-view="sources"]')?.click();
    const options = Array.from(drawer.shadowRoot?.querySelectorAll<HTMLElement>(".source-option") ?? []);
    expect(options).toHaveLength(2);
    expect(options[0]?.textContent).toContain("Top document");
    expect(options[1]?.textContent).toContain("Rendered document");
    expect(options[1]?.textContent).toContain("DOM correlation available");
    const frameInput = options[1]?.querySelector<HTMLInputElement>("input")!;
    frameInput.checked = true;
    frameInput.dispatchEvent(new Event("change"));

    expect(drawer.shadowRoot?.querySelector('[data-view="navigator"]')?.getAttribute("aria-selected")).toBe("true");
    expect(drawer.shadowRoot?.querySelectorAll(".quad")).toHaveLength(1);
    expect(drawer.shadowRoot?.textContent).toContain("Frame fact");
    expect(drawer.shadowRoot?.textContent).not.toContain("Top fact");
    expect(drawer.shadowRoot?.querySelector(".footer")?.textContent).toContain("Rendered document");
  });

  it("automatically selects the sole RDF-bearing portable child of an empty top document", () => {
    const frameDocument = document.implementation.createHTMLDocument("Rendered report");
    frameDocument.documentElement.setAttribute("rdf-version", "1.2");
    frameDocument.body.innerHTML = '<span rdf-subject="https://example.test/report" rdf-predicate="https://schema.org/name">Isolated fact</span>';
    const drawer = mountRdfNavigator();
    drawer.setSources([{
      access: "portable",
      id: "extension-frame-7",
      label: "Rendered report",
      origin: "Opaque origin",
      result: toPortableExtractionResult(extractDataset(frameDocument)),
      url: "about:srcdoc",
    }]);

    expect(drawer.shadowRoot?.querySelector(".launcher .count")?.textContent).toBe("1");
    expect(drawer.shadowRoot?.textContent).toContain("Isolated fact");
    expect(drawer.shadowRoot?.querySelector(".footer")?.textContent).toContain("Rendered report");
    drawer.shadowRoot?.querySelector<HTMLButtonElement>('[data-view="sources"]')?.click();
    const selected = drawer.shadowRoot?.querySelector<HTMLInputElement>('.source-input:checked');
    expect(selected?.dataset.sourceId).toBe("extension-frame-7");
    expect(selected?.closest(".source-option")?.textContent).toContain("source locations are read-only");
  });
});
