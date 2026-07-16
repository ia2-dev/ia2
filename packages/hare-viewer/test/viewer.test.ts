import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { readHareEnvelope } from "../src/model.js";
import { resolveHareNavigation } from "../src/navigation.js";
import { HareViewerElement } from "../src/viewer.js";

const statements = `
  <section id="manifest" hidden>
    <a href="https://ia2.dev/spec/resource-envelope#Envelope" rdf-subject="" rdf-predicate="http://www.w3.org/1999/02/22-rdf-syntax-ns#type" rdf-graph="#manifest"></a>
    <a href="#manifest" rdf-subject="" rdf-predicate="https://ia2.dev/spec/resource-envelope#manifestGraph" rdf-graph="#manifest"></a>
    <a href="https://viewer-test.hare.invalid/" rdf-subject="" rdf-predicate="https://ia2.dev/spec/resource-envelope#virtualBase" rdf-graph="#manifest"></a>
    <a href="https://ia2.dev/spec/resource-envelope#HARE-0.1" rdf-subject="" rdf-predicate="http://purl.org/dc/terms/conformsTo" rdf-graph="#manifest"></a>
    <a href="https://ia2.dev/spec/resource-envelope#SelfViewingProfile" rdf-subject="" rdf-predicate="http://purl.org/dc/terms/conformsTo" rdf-graph="#manifest"></a>
    <a href="#hello" rdf-subject="" rdf-predicate="http://purl.org/dc/terms/hasPart" rdf-graph="#manifest"></a>
    <a href="#semantic" rdf-subject="" rdf-predicate="http://purl.org/dc/terms/hasPart" rdf-graph="#manifest"></a>
    <a href="#notes" rdf-subject="" rdf-predicate="http://purl.org/dc/terms/hasPart" rdf-graph="#manifest"></a>
    <a href="#badge" rdf-subject="" rdf-predicate="http://purl.org/dc/terms/hasPart" rdf-graph="#manifest"></a>
    <span rdf-subject="#hello" rdf-predicate="http://purl.org/dc/terms/title" rdf-graph="#manifest">Greeting</span>
    <a href="#hello-representation" rdf-subject="#hello" rdf-predicate="https://ia2.dev/spec/resource-envelope#representation" rdf-graph="#manifest"></a>
    <a href="https://ia2.dev/spec/resource-envelope#ByteRepresentation" rdf-subject="#hello-representation" rdf-predicate="http://www.w3.org/1999/02/22-rdf-syntax-ns#type" rdf-graph="#manifest"></a>
    <data value="/hello.txt" rdf-subject="#hello-representation" rdf-predicate="http://purl.org/dc/terms/identifier" rdf-graph="#manifest"></data>
    <data value="text/plain" rdf-subject="#hello-representation" rdf-predicate="http://purl.org/dc/elements/1.1/format" rdf-graph="#manifest"></data>
    <data value="5" rdf-subject="#hello-representation" rdf-predicate="https://ia2.dev/spec/resource-envelope#byteLength" rdf-graph="#manifest"></data>
    <data value="sha256-LPJNul+wow4m6DsqxbninhsWHlwfp0JecwQzYpOLmCQ=" rdf-subject="#hello-representation" rdf-predicate="https://www.w3.org/2018/credentials#digestSRI" rdf-datatype="https://www.w3.org/2018/credentials#sriString" rdf-graph="#manifest"></data>
    <a href="#payload-hello" rdf-subject="#hello-representation" rdf-predicate="https://ia2.dev/spec/resource-envelope#carrier" rdf-graph="#manifest"></a>
    <span rdf-subject="#semantic" rdf-predicate="http://purl.org/dc/terms/title" rdf-graph="#manifest">Semantic page</span>
    <a href="#semantic-representation" rdf-subject="#semantic" rdf-predicate="https://ia2.dev/spec/resource-envelope#representation" rdf-graph="#manifest"></a>
    <a href="https://ia2.dev/spec/resource-envelope#DOMRepresentation" rdf-subject="#semantic-representation" rdf-predicate="http://www.w3.org/1999/02/22-rdf-syntax-ns#type" rdf-graph="#manifest"></a>
    <data value="/semantic.html" rdf-subject="#semantic-representation" rdf-predicate="http://purl.org/dc/terms/identifier" rdf-graph="#manifest"></data>
    <data value="text/html" rdf-subject="#semantic-representation" rdf-predicate="http://purl.org/dc/elements/1.1/format" rdf-graph="#manifest"></data>
    <a href="#semantic-content" rdf-subject="#semantic-representation" rdf-predicate="https://ia2.dev/spec/resource-envelope#carrier" rdf-graph="#manifest"></a>
    <span rdf-subject="#notes" rdf-predicate="http://purl.org/dc/terms/title" rdf-graph="#manifest">Review notes</span>
    <a href="#notes-representation" rdf-subject="#notes" rdf-predicate="https://ia2.dev/spec/resource-envelope#representation" rdf-graph="#manifest"></a>
    <a href="https://ia2.dev/spec/resource-envelope#ByteRepresentation" rdf-subject="#notes-representation" rdf-predicate="http://www.w3.org/1999/02/22-rdf-syntax-ns#type" rdf-graph="#manifest"></a>
    <data value="/notes.md" rdf-subject="#notes-representation" rdf-predicate="http://purl.org/dc/terms/identifier" rdf-graph="#manifest"></data>
    <data value="text/markdown" rdf-subject="#notes-representation" rdf-predicate="http://purl.org/dc/elements/1.1/format" rdf-graph="#manifest"></data>
    <data value="56" rdf-subject="#notes-representation" rdf-predicate="https://ia2.dev/spec/resource-envelope#byteLength" rdf-graph="#manifest"></data>
    <data value="sha256-E1r2BfpH+Wqs/JGgvjFdb519WcKgWUgfFbxZviUKE5w=" rdf-subject="#notes-representation" rdf-predicate="https://www.w3.org/2018/credentials#digestSRI" rdf-datatype="https://www.w3.org/2018/credentials#sriString" rdf-graph="#manifest"></data>
    <a href="#payload-notes" rdf-subject="#notes-representation" rdf-predicate="https://ia2.dev/spec/resource-envelope#carrier" rdf-graph="#manifest"></a>
    <span rdf-subject="#badge" rdf-predicate="http://purl.org/dc/terms/title" rdf-graph="#manifest">Badge</span>
    <a href="#badge-representation" rdf-subject="#badge" rdf-predicate="https://ia2.dev/spec/resource-envelope#representation" rdf-graph="#manifest"></a>
    <a href="https://ia2.dev/spec/resource-envelope#ByteRepresentation" rdf-subject="#badge-representation" rdf-predicate="http://www.w3.org/1999/02/22-rdf-syntax-ns#type" rdf-graph="#manifest"></a>
    <data value="/badge.svg" rdf-subject="#badge-representation" rdf-predicate="http://purl.org/dc/terms/identifier" rdf-graph="#manifest"></data>
    <data value="image/svg+xml" rdf-subject="#badge-representation" rdf-predicate="http://purl.org/dc/elements/1.1/format" rdf-graph="#manifest"></data>
    <data value="67" rdf-subject="#badge-representation" rdf-predicate="https://ia2.dev/spec/resource-envelope#byteLength" rdf-graph="#manifest"></data>
    <data value="sha256-ehCBk6PFTlwHwSB8DjiwJ52c3cD7hE/b3K+CYp7Gnrg=" rdf-subject="#badge-representation" rdf-predicate="https://www.w3.org/2018/credentials#digestSRI" rdf-datatype="https://www.w3.org/2018/credentials#sriString" rdf-graph="#manifest"></data>
    <a href="#payload-badge" rdf-subject="#badge-representation" rdf-predicate="https://ia2.dev/spec/resource-envelope#carrier" rdf-graph="#manifest"></a>
  </section>
  <script id="payload-hello" type="application/octet-stream" data-encoding="base64">aGVsbG8=</script>
  <script id="payload-notes" type="application/octet-stream" data-encoding="base64">IyBOb3RlcwoKIVtiYWRnZV0oLi9iYWRnZS5zdmcpCgpbR3JlZXRpbmddKC4vaGVsbG8udHh0KQo=</script>
  <script id="payload-badge" type="application/octet-stream" data-encoding="base64">PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxIiBoZWlnaHQ9IjEiPjwvc3ZnPg==</script>
  <template id="semantic-content"><article><h1 id="readable">Readable HTML</h1><a href="/hello.txt">Text resource</a><script>window.bad = true</script></article></template>
`;

beforeAll(() => {
  if (!customElements.get("ia2-hare-viewer-test")) customElements.define("ia2-hare-viewer-test", HareViewerElement);
});

beforeEach(() => {
  document.head.innerHTML = '<link rel="canonical" href="https://example.test/viewer.hare.html">';
  document.body.innerHTML = statements;
});

describe("HareViewerElement modes", () => {
  it("uses a full file browser when the envelope has no authored content", () => {
    const viewer = document.createElement("ia2-hare-viewer-test") as HareViewerElement;
    document.body.prepend(viewer);
    expect(viewer.mode).toBe("full");
    expect(viewer.shadowRoot?.querySelector(".document-tab")?.hasAttribute("hidden")).toBe(true);
    expect(viewer.shadowRoot?.querySelectorAll(".file-button")).toHaveLength(4);
  });

  it("adds Document and Files tabs when authored content is present", () => {
    const article = document.createElement("main");
    article.textContent = "Authored handoff";
    document.body.prepend(article);
    const viewer = document.createElement("ia2-hare-viewer-test") as HareViewerElement;
    document.body.prepend(viewer);
    expect(viewer.mode).toBe("tabs");
    const files = viewer.shadowRoot?.querySelector<HTMLButtonElement>(".files-tab");
    files?.click();
    expect(viewer.filesOpen).toBe(true);
    expect(files?.getAttribute("aria-selected")).toBe("true");
    expect(viewer.shadowRoot?.querySelector(".workspace")?.hasAttribute("hidden")).toBe(false);
    expect(article.hidden).toBe(false);
  });

  it("keeps the document/files header when an extension owns the viewer", () => {
    const viewer = document.createElement("ia2-hare-viewer-test") as HareViewerElement;
    viewer.setAttribute("data-ia2-extension", "");
    viewer.setAttribute("mode", "tabs");
    document.body.prepend(viewer);
    expect(viewer.filesOpen).toBe(false);
    expect(viewer.shadowRoot?.querySelector(".bar")).not.toBeNull();
    expect(getComputedStyle(viewer).display).not.toBe("none");
    viewer.openFiles();
    expect(viewer.filesOpen).toBe(true);
    viewer.shadowRoot?.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    expect(viewer.filesOpen).toBe(false);
  });

  it("previews a DOM representation without offering an exact-byte download", async () => {
    const viewer = document.createElement("ia2-hare-viewer-test") as HareViewerElement;
    document.body.prepend(viewer);
    const semantic = viewer.shadowRoot?.querySelectorAll<HTMLButtonElement>(".file-button")[1];
    semantic?.click();
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(viewer.shadowRoot?.querySelector(".state")?.textContent).toBe("Semantic DOM");
    const frame = viewer.shadowRoot?.querySelector<HTMLIFrameElement>("iframe");
    expect(frame?.srcdoc).toContain("Readable HTML");
    expect(frame?.srcdoc).toContain('<base href="https://viewer-test.hare.invalid/semantic.html">');
    expect(frame?.srcdoc).toContain("Content-Security-Policy");
    expect(frame?.srcdoc).not.toContain("window.bad");
    expect(frame?.getAttribute("sandbox")).toBe("allow-same-origin");
    expect(viewer.shadowRoot?.querySelector(".download")).toBeNull();
  });

  it("renders Markdown and materializes only its verified bundled images", async () => {
    Object.defineProperty(URL, "createObjectURL", {
      configurable: true,
      value: vi.fn((blob: Blob) => blob.type === "image/svg+xml" ? "blob:verified-badge" : "blob:notes"),
    });
    Object.defineProperty(URL, "revokeObjectURL", { configurable: true, value: vi.fn() });
    const viewer = document.createElement("ia2-hare-viewer-test") as HareViewerElement;
    document.body.prepend(viewer);
    const notes = Array.from(viewer.shadowRoot?.querySelectorAll<HTMLButtonElement>(".file-button") ?? [])
      .find((button) => button.dataset.path === "/notes.md");
    notes?.click();
    await vi.waitFor(() => expect(viewer.shadowRoot?.querySelector(".markdown h1")).not.toBeNull());
    expect(viewer.shadowRoot?.querySelector(".markdown h1")?.textContent).toBe("Notes");
    const image = viewer.shadowRoot?.querySelector<HTMLImageElement>(".markdown img");
    expect(image?.dataset.markdownDestination).toBe("./badge.svg");
    expect(image?.src).toBe("blob:verified-badge");
    const link = viewer.shadowRoot?.querySelector<HTMLAnchorElement>(".markdown a");
    expect(link?.dataset.markdownDestination).toBe("./hello.txt");
    expect(link?.getAttribute("href")).toBe("#hare-navigation");
    link?.click();
    await vi.waitFor(() => expect(viewer.shadowRoot?.querySelector(".source")?.textContent).toBe("hello"));
  });
});

describe("HARE template navigation", () => {
  it("resolves representation, host, fragment, and external URLs", () => {
    const envelope = readHareEnvelope(document);
    const current = envelope.representations[1]!;

    expect(resolveHareNavigation(envelope, current, "/hello.txt#download")).toEqual(expect.objectContaining({
      kind: "representation",
      representation: expect.objectContaining({ path: "/hello.txt" }),
      fragment: "download",
    }));
    expect(resolveHareNavigation(envelope, current, "#readable")).toEqual(expect.objectContaining({
      kind: "representation",
      representation: current,
      fragment: "readable",
    }));
    expect(resolveHareNavigation(envelope, current, "/")).toEqual({ kind: "host", fragment: null });
    expect(resolveHareNavigation(envelope, current, "https://example.test/viewer.hare.html#manifest")).toEqual({
      kind: "host",
      fragment: "manifest",
    });
    expect(resolveHareNavigation(envelope, current, "https://example.org/page")).toEqual({
      kind: "external",
      url: "https://example.org/page",
    });
    expect(resolveHareNavigation(envelope, current, "javascript:alert(1)")).toEqual(expect.objectContaining({ kind: "blocked" }));
    expect(resolveHareNavigation(envelope, current, "/missing.html")).toEqual(expect.objectContaining({ kind: "blocked" }));
  });
});
