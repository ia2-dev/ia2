import { describe, expect, it } from "vitest";
import { materializeHareDomRepresentation } from "../src/materialize.js";
import type {
  HareByteRepresentation,
  HareDomRepresentation,
  HareEnvelope,
  VerifiedHareRepresentation,
} from "../src/model.js";

const dom: HareDomRepresentation = {
  id: "https://example.test/envelope.html#page-representation",
  resourceId: "https://example.test/envelope.html#page",
  title: "Page",
  path: "/docs/index.html",
  mediaType: "text/html",
  carrier: "https://example.test/envelope.html#page-content",
  kind: "dom",
};

function bytes(id: string, path: string, mediaType: string): HareByteRepresentation {
  return {
    id,
    resourceId: `${id}-resource`,
    title: path,
    path,
    mediaType,
    carrier: `${id}-carrier`,
    kind: "bytes",
    byteLength: 0,
    integrity: "sha256-test",
  };
}

const image = bytes("https://example.test/envelope.html#image-representation", "/assets/mark.svg", "image/svg+xml");
const stylesheet = bytes("https://example.test/envelope.html#stylesheet-representation", "/styles/site.css", "text/css");
const nestedStylesheet = bytes("https://example.test/envelope.html#nested-stylesheet-representation", "/styles/nested.css", "text/css");

function envelope(representations: HareEnvelope["representations"] = [dom, image, stylesheet, nestedStylesheet]): HareEnvelope {
  return {
    id: "https://example.test/envelope.html",
    conformsTo: ["https://ia2.dev/spec/resource-envelope#HARE-0.1"],
    manifestGraph: "https://example.test/envelope.html#manifest",
    virtualBase: "https://materialize-test.hare.invalid/",
    profile: "declarative",
    representations,
  };
}

function verifier(sources: Map<string, string>) {
  return async (representation: HareByteRepresentation): Promise<VerifiedHareRepresentation> => ({
    representation,
    bytes: new TextEncoder().encode(sources.get(representation.id) || ""),
  });
}

function readBlob(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(String(reader.result || "")), { once: true });
    reader.addEventListener("error", () => reject(reader.error), { once: true });
    reader.readAsText(blob);
  });
}

describe("HARE subresource materialization", () => {
  it("materializes verified passive resources, recursive CSS, and each representation only once", async () => {
    const carrier = document.createElement("template");
    carrier.innerHTML = `
      <link rel="stylesheet" href="../styles/site.css">
      <article style="background-image: url('../assets/mark.svg')">
        <img src="../assets/mark.svg" srcset="../assets/mark.svg 1x, https://outside.test/mark.svg 2x" alt="Mark">
        <a href="/docs/next.html">Next document</a>
        <a href="/">Return to the envelope</a>
        <iframe src="/docs/nested.html"></iframe>
      </article>
    `;
    const blobs: Blob[] = [];
    const result = await materializeHareDomRepresentation(
      envelope(),
      dom,
      carrier,
      document,
      {
        verify: verifier(new Map([
          [image.id, "<svg xmlns='http://www.w3.org/2000/svg'><circle r='4'/></svg>"],
          [stylesheet.id, "@import './nested.css'; .hero { background: url('../assets/mark.svg') }"],
          [nestedStylesheet.id, ".nested { mask-image: url('../assets/mark.svg') }"],
        ])),
        createObjectURL: (blob) => {
          blobs.push(blob);
          return `blob:hare-${blobs.length}`;
        },
      },
    );

    expect(result.source).toContain('<base href="https://materialize-test.hare.invalid/docs/index.html">');
    expect(result.source).toContain('href="blob:hare-');
    expect(result.source).toContain('src="blob:hare-');
    expect(result.source).toContain('data-hare-href="/docs/next.html"');
    expect(result.source).toContain('data-hare-href="/"');
    expect(result.source.match(/href="#hare-navigation"/g)).toHaveLength(2);
    expect(result.source).not.toContain("<iframe");
    expect(result.source).not.toContain("https://outside.test/mark.svg");
    expect(result.materializedRepresentations).toEqual(expect.arrayContaining([
      image.id,
      stylesheet.id,
      nestedStylesheet.id,
    ]));
    expect(result.materializedRepresentations).toHaveLength(3);
    expect(result.objectUrls).toHaveLength(3);
    expect(blobs).toHaveLength(3);
    const rewrittenStylesheets = await Promise.all(
      blobs.filter((blob) => blob.type === "text/css").map(readBlob),
    );
    expect(rewrittenStylesheets.join("\n")).toContain("blob:hare-");
    expect(rewrittenStylesheets.join("\n")).not.toContain("../assets/mark.svg");
    expect(result.issues.map((issue) => issue.reason).join(" ")).toMatch(/not fetched/);
    expect(result.issues.map((issue) => issue.reason).join(" ")).toMatch(/Nested browsing contexts/);
  });

  it("leaves DOM documents and incompatible media types inert in subresource destinations", async () => {
    const text = bytes("https://example.test/envelope.html#text-representation", "/asset.txt", "text/plain");
    const carrier = document.createElement("template");
    carrier.innerHTML = '<img src="/docs/index.html"><img src="/asset.txt">';
    const result = await materializeHareDomRepresentation(
      envelope([dom, text]),
      dom,
      carrier,
      document,
      {
        verify: verifier(new Map([[text.id, "not an image"]])),
        createObjectURL: () => "blob:unexpected",
      },
    );

    expect(result.source).not.toContain("blob:unexpected");
    expect(result.source).not.toContain('src="/docs/index.html"');
    expect(result.source).not.toContain('src="/asset.txt"');
    expect(result.issues.map((issue) => issue.reason)).toEqual(expect.arrayContaining([
      expect.stringMatching(/Only exact byte representations/),
      expect.stringMatching(/not allowed for the image destination/),
    ]));
  });

  it("blocks recursive stylesheet cycles without abandoning the usable stylesheets", async () => {
    const first = bytes("https://example.test/envelope.html#first-css", "/styles/first.css", "text/css");
    const second = bytes("https://example.test/envelope.html#second-css", "/styles/second.css", "text/css");
    const carrier = document.createElement("template");
    carrier.innerHTML = '<link rel="stylesheet" href="/styles/first.css">';
    let objectUrl = 0;
    const result = await materializeHareDomRepresentation(
      envelope([dom, first, second]),
      dom,
      carrier,
      document,
      {
        verify: verifier(new Map([
          [first.id, '@import "./second.css";'],
          [second.id, '@import "./first.css";'],
        ])),
        createObjectURL: () => `blob:cycle-${objectUrl += 1}`,
      },
    );

    expect(result.materializedRepresentations).toHaveLength(2);
    expect(result.source).toContain('href="blob:cycle-');
    expect(result.issues.map((issue) => issue.reason).join(" ")).toMatch(/import cycle/);
  });
});
