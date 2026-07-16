import { describe, expect, it } from "vitest";
import { getHareDomCarrier, readHareEnvelope, verifyHareRepresentation } from "../src/model.js";
import {
  materializeHareDomRepresentation,
  materializeHareHostSubresources,
} from "../src/materialize.js";
import { resolveHareNavigation } from "../src/navigation.js";
// @ts-expect-error Vitest supplies Vite's raw-fixture import during tests.
import decisionHandoffHtml from "../../../specs/resource-envelope/examples/decision-handoff.html?raw";
// @ts-expect-error Vitest supplies Vite's raw-fixture import during tests.
import vendorReviewHtml from "../../../specs/resource-envelope/examples/vendor-review.html?raw";
// @ts-expect-error Vitest supplies Vite's raw-fixture import during tests.
import inspectionEvidenceHtml from "../../../specs/resource-envelope/examples/inspection-evidence.html?raw";
// @ts-expect-error Vitest supplies Vite's raw-fixture import during tests.
import releaseHandoffHtml from "../../../specs/resource-envelope/examples/release-handoff.html?raw";
// @ts-expect-error Vitest supplies Vite's raw import during tests.
import packageJson from "../package.json?raw";

function parse(html: string): Document {
  return new DOMParser().parseFromString(html, "text/html");
}

function readBlob(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(String(reader.result || "")), { once: true });
    reader.addEventListener("error", () => reject(reader.error), { once: true });
    reader.readAsText(blob);
  });
}

describe("HARE viewer integration", () => {
  it("keeps the production source map external and unlinked", () => {
    expect(JSON.parse(packageJson).scripts.build).toContain("--sourcemap=external");
  });

  it("reads both self-contained specification examples", () => {
    const handoffPage = parse(decisionHandoffHtml);
    const reviewPage = parse(vendorReviewHtml);
    expect(readHareEnvelope(handoffPage).representations).toHaveLength(2);
    expect(readHareEnvelope(reviewPage).representations).toHaveLength(4);
  });

  it("verifies the vendor brief's Markdown image reference", async () => {
    const page = parse(vendorReviewHtml);
    const envelope = readHareEnvelope(page);
    const brief = envelope.representations.find((representation) => representation.path === "/docs/brief.md");
    if (!brief || brief.kind !== "bytes") throw new Error("Expected the vendor brief byte representation.");
    const verified = await verifyHareRepresentation(brief, page);
    const markdown = new TextDecoder().decode(verified.bytes);
    expect(markdown).toContain("**security baseline**");
    expect(markdown).toContain("[Open structured status](../data/status.json)");
    expect(markdown).toContain("![Verified review result](../assets/verified.svg)");
    expect(envelope.representations).toEqual(expect.arrayContaining([
      expect.objectContaining({ kind: "bytes", mediaType: "image/svg+xml", path: "/assets/verified.svg" }),
    ]));
  });

  it("reads both package mode demonstrations", () => {
    const evidencePage = parse(inspectionEvidenceHtml);
    const releasePage = parse(releaseHandoffHtml);
    expect(readHareEnvelope(evidencePage).representations).toHaveLength(3);
    expect(readHareEnvelope(evidencePage).representations[0]?.path).toBe("/README.md");
    const release = readHareEnvelope(releasePage);
    expect(release.representations).toHaveLength(5);
    expect(release.representations[0]).toEqual(expect.objectContaining({
      kind: "dom",
      path: "/release-notes.html",
    }));
    const viewerVersion = JSON.parse(packageJson).version;
    for (const page of [evidencePage, releasePage]) {
      expect(page.querySelector<HTMLScriptElement>("script[type='module']")?.src).toContain(`hare-viewer.js?v=${viewerVersion}`);
      expect(page.querySelectorAll("ia2-hare-viewer")).toHaveLength(1);
    }
  });

  it("materializes the authored example's verified CSS imports and SVG", async () => {
    const page = parse(releaseHandoffHtml);
    const envelope = readHareEnvelope(page);
    const greeting = envelope.representations[0]!;
    if (greeting.kind !== "dom") throw new Error("Expected release notes DOM.");
    let objectUrl = 0;
    const blobs: Blob[] = [];
    const materialized = await materializeHareDomRepresentation(
      envelope,
      greeting,
      getHareDomCarrier(greeting, page),
      page,
      {
        createObjectURL: (blob) => {
          blobs.push(blob);
          return `blob:authored-${objectUrl += 1}`;
        },
      },
    );
    expect(materialized.issues).toEqual([]);
    expect(materialized.materializedRepresentations).toHaveLength(3);
    expect(materialized.source).toContain('href="blob:authored-');
    expect(materialized.source).toContain('src="blob:authored-');
    const stylesheets = await Promise.all(blobs.filter((blob) => blob.type === "text/css").map(readBlob));
    expect(stylesheets.join("\n")).toContain('@import "blob:authored-');
    expect(blobs.filter((blob) => blob.type === "image/svg+xml")).toHaveLength(1);
  });

  it("materializes an inert virtual image reference in the authored host document", async () => {
    const page = parse(releaseHandoffHtml);
    const envelope = readHareEnvelope(page);
    const image = page.querySelector<HTMLImageElement>("main img[data-hare-src]");
    expect(image?.hasAttribute("src")).toBe(false);
    const result = await materializeHareHostSubresources(envelope, page, {
      createObjectURL: () => "blob:authored-host-image",
    });
    expect(result.issues).toEqual([]);
    expect(result.references).toBe(1);
    expect(result.materializedRepresentations).toEqual([
      expect.stringContaining("#release-map-representation"),
    ]);
    expect(image?.getAttribute("src")).toBe("blob:authored-host-image");
    expect(image?.hasAttribute("data-hare-materialized")).toBe(true);
    expect(image?.dataset.hareSrc).toBe("https://orion-release.hare.invalid/assets/orion-release-map.svg");
  });

  it("routes authored template links through their declared virtual URLs", () => {
    const page = parse(releaseHandoffHtml);
    const envelope = readHareEnvelope(page);
    const greeting = envelope.representations[0]!;
    if (greeting.kind !== "dom") throw new Error("Expected release notes DOM.");
    const links = Array.from(getHareDomCarrier(greeting, page).content.querySelectorAll<HTMLAnchorElement>("a[href]"));
    expect(resolveHareNavigation(envelope, greeting, links[0]!.getAttribute("href")!)).toEqual(expect.objectContaining({
      kind: "representation",
      representation: expect.objectContaining({ path: "/rollback-plan.html" }),
      fragment: "abort",
    }));
    expect(resolveHareNavigation(envelope, greeting, links[1]!.getAttribute("href")!)).toEqual({ kind: "host", fragment: null });
  });

  it("makes derived decision-handoff links inert while preserving their virtual targets", async () => {
    const page = parse(decisionHandoffHtml);
    const envelope = readHareEnvelope(page);
    const brief = envelope.representations[0]!;
    if (brief.kind !== "dom") throw new Error("Expected migration brief DOM.");
    const result = await materializeHareDomRepresentation(
      envelope,
      brief,
      getHareDomCarrier(brief, page),
      page,
    );
    const derived = parse(result.source);
    const links = Array.from(derived.querySelectorAll<HTMLAnchorElement>("a[data-hare-href]"));
    expect(links.map((link) => link.dataset.hareHref)).toEqual(["/decision.json", "/"]);
    expect(links.every((link) => link.getAttribute("href") === "#hare-navigation")).toBe(true);
  });
});
