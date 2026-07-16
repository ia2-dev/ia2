import {
  verifyHareRepresentation,
  type HareByteRepresentation,
  type HareDomRepresentation,
  type HareEnvelope,
  type VerifiedHareRepresentation,
} from "./model.js";
import { hareRepresentationUrl } from "./navigation.js";

type MaterializationDestination = "audio" | "css-resource" | "image" | "media" | "stylesheet" | "track" | "video";

export interface HareMaterializationIssue {
  attribute: string;
  reference: string;
  reason: string;
}

export interface HareMaterializationResult {
  source: string;
  issues: HareMaterializationIssue[];
  materializedRepresentations: string[];
  objectUrls: string[];
}

export interface HareHostMaterializationResult {
  issues: HareMaterializationIssue[];
  materializedRepresentations: string[];
  objectUrls: string[];
  references: number;
}

export interface HareMaterializationOptions {
  createObjectURL?: (blob: Blob) => string;
  verify?: (
    representation: HareByteRepresentation,
    target: Document,
  ) => Promise<VerifiedHareRepresentation>;
}

interface ResolvedReference {
  fragment: string;
  representation: HareByteRepresentation;
}

const BLOCKED_URL = "about:blank#hare-blocked";

function mediaTypeEssence(value: string): string {
  return value.split(";", 1)[0]!.trim().toLowerCase();
}

function acceptsMediaType(mediaType: string, destination: MaterializationDestination): boolean {
  const essence = mediaTypeEssence(mediaType);
  if (destination === "stylesheet") return essence === "text/css";
  if (destination === "image") return essence.startsWith("image/");
  if (destination === "audio") return essence.startsWith("audio/");
  if (destination === "video") return essence.startsWith("video/");
  if (destination === "media") return essence.startsWith("audio/") || essence.startsWith("video/");
  if (destination === "track") return essence === "text/vtt";
  return essence.startsWith("image/")
    || essence.startsWith("font/")
    || essence.startsWith("application/font-")
    || essence === "application/vnd.ms-fontobject";
}

function bytesAsBlob(bytes: Uint8Array, mediaType: string): Blob {
  const buffer = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(buffer).set(bytes);
  return new Blob([buffer], { type: mediaType });
}

function serializeDocument(target: Document): string {
  return `<!doctype html>\n${target.documentElement.outerHTML}`;
}

function srcsetCandidates(value: string): Array<{ descriptor: string; url: string }> {
  const candidates: Array<{ descriptor: string; url: string }> = [];
  let position = 0;
  while (position < value.length) {
    while (position < value.length && /[\s,]/.test(value[position]!)) position += 1;
    if (position >= value.length) break;

    const dataUrl = value.slice(position, position + 5).toLowerCase() === "data:";
    const urlStart = position;
    while (position < value.length && !/\s/.test(value[position]!) && (dataUrl || value[position] !== ",")) position += 1;
    const url = value.slice(urlStart, position);
    while (position < value.length && /\s/.test(value[position]!)) position += 1;

    const descriptorStart = position;
    let parentheses = 0;
    while (position < value.length) {
      if (value[position] === "(") parentheses += 1;
      if (value[position] === ")" && parentheses > 0) parentheses -= 1;
      if (value[position] === "," && parentheses === 0) break;
      position += 1;
    }
    const descriptor = value.slice(descriptorStart, position).trim();
    if (position < value.length && value[position] === ",") position += 1;
    if (url) candidates.push({ url, descriptor });
  }
  return candidates;
}

async function replaceAsync(
  value: string,
  pattern: RegExp,
  replacer: (match: RegExpExecArray) => Promise<string>,
): Promise<string> {
  const matches = Array.from(value.matchAll(pattern));
  if (matches.length === 0) return value;
  const replacements = await Promise.all(matches.map(replacer));
  let result = "";
  let position = 0;
  matches.forEach((match, index) => {
    result += value.slice(position, match.index) + replacements[index];
    position = (match.index || 0) + match[0].length;
  });
  return result + value.slice(position);
}

/**
 * Derive a sandboxed HTML browsing document from a DOM representation and
 * materialize verified passive byte subresources into object URLs.
 */
export async function materializeHareDomRepresentation(
  envelope: HareEnvelope,
  representation: HareDomRepresentation,
  carrier: HTMLTemplateElement,
  target: Document = document,
  options: HareMaterializationOptions = {},
): Promise<HareMaterializationResult> {
  const preview = target.implementation.createHTMLDocument(representation.title);
  const virtualUrl = hareRepresentationUrl(envelope, representation);
  if (!virtualUrl) throw new Error(`DOM representation ${representation.id} has no virtual URL.`);

  const base = preview.createElement("base");
  base.href = virtualUrl;
  const policy = preview.createElement("meta");
  policy.httpEquiv = "Content-Security-Policy";
  policy.content = "default-src 'none'; img-src data: blob:; media-src data: blob:; style-src 'unsafe-inline' data: blob:; font-src data: blob:; form-action 'none'";
  preview.head.prepend(policy, base);

  const content = carrier.content.cloneNode(true) as DocumentFragment;
  content.querySelectorAll("script, base, meta[http-equiv='refresh' i]").forEach((element) => element.remove());
  preview.body.replaceChildren(content);

  // Keep navigation inert even before the viewer has attached its router to
  // the derived frame. The authored template remains unchanged; only this
  // presentation copy carries the preserved virtual reference.
  preview.querySelectorAll<HTMLAnchorElement>("a[href]").forEach((anchor) => {
    anchor.dataset.hareHref = anchor.getAttribute("href") || "";
    anchor.setAttribute("href", "#hare-navigation");
  });

  const issues: HareMaterializationIssue[] = [];
  const objectUrls = new Set<string>();
  const materialized = new Set<string>();
  const verified = new Map<string, Promise<VerifiedHareRepresentation>>();
  const materializedUrls = new Map<string, Promise<string | null>>();
  const activeStylesheets = new Set<string>();
  const verify = options.verify || verifyHareRepresentation;
  const createObjectURL = options.createObjectURL || ((blob: Blob) => URL.createObjectURL(blob));

  const issue = (attribute: string, reference: string, reason: string): null => {
    issues.push({ attribute, reference, reason });
    return null;
  };

  const resolveReference = (
    owner: HareDomRepresentation | HareByteRepresentation,
    reference: string,
    attribute: string,
  ): ResolvedReference | "inline" | null => {
    const value = reference.trim();
    if (!value) return issue(attribute, reference, "The reference is empty.");
    if (value.startsWith("#")) return "inline";

    let resolved: URL;
    try {
      const ownerUrl = hareRepresentationUrl(envelope, owner);
      if (!ownerUrl) return issue(attribute, reference, "The containing representation has no virtual URL.");
      resolved = new URL(value, ownerUrl);
    } catch {
      return issue(attribute, reference, "The reference is not a valid URL.");
    }

    if (resolved.protocol === "data:") return "inline";
    if (resolved.origin !== new URL(envelope.virtualBase).origin) {
      return issue(attribute, reference, "External subresources are not fetched during HARE materialization.");
    }

    const fragment = resolved.hash;
    resolved.hash = "";
    const candidate = envelope.representations.find((item) => hareRepresentationUrl(envelope, item) === resolved.href);
    if (!candidate) return issue(attribute, reference, `No bundled representation has virtual URL ${resolved.href}.`);
    if (candidate.kind !== "bytes") {
      return issue(attribute, reference, "Only exact byte representations can be materialized as subresources.");
    }
    return { representation: candidate, fragment };
  };

  const verifyOnce = (candidate: HareByteRepresentation): Promise<VerifiedHareRepresentation> => {
    let pending = verified.get(candidate.id);
    if (!pending) {
      pending = verify(candidate, target);
      verified.set(candidate.id, pending);
    }
    return pending;
  };

  const materializeReference = async (
    owner: HareDomRepresentation | HareByteRepresentation,
    reference: string,
    destination: MaterializationDestination,
    attribute: string,
  ): Promise<string | null> => {
    const resolved = resolveReference(owner, reference, attribute);
    if (resolved === "inline") return reference;
    if (!resolved) return null;
    const candidate = resolved.representation;
    if (!acceptsMediaType(candidate.mediaType, destination)) {
      return issue(
        attribute,
        reference,
        `${candidate.mediaType} is not allowed for the ${destination} destination.`,
      );
    }

    if (destination === "stylesheet" && activeStylesheets.has(candidate.id)) {
      return issue(attribute, reference, `The stylesheet import cycle through ${candidate.path || candidate.id} was blocked.`);
    }

    let pending = materializedUrls.get(candidate.id);
    if (!pending) {
      pending = (async (): Promise<string | null> => {
        try {
          const checked = await verifyOnce(candidate);
          let blob: Blob;
          if (mediaTypeEssence(candidate.mediaType) === "text/css") {
            activeStylesheets.add(candidate.id);
            try {
              const css = new TextDecoder().decode(checked.bytes);
              blob = bytesAsBlob(
                new TextEncoder().encode(await rewriteCss(css, candidate)),
                candidate.mediaType,
              );
            } finally {
              activeStylesheets.delete(candidate.id);
            }
          } else {
            blob = bytesAsBlob(checked.bytes, candidate.mediaType);
          }
          const objectUrl = createObjectURL(blob);
          objectUrls.add(objectUrl);
          materialized.add(candidate.id);
          return objectUrl;
        } catch (error) {
          return issue(
            attribute,
            reference,
            error instanceof Error ? error.message : String(error),
          );
        }
      })();
      materializedUrls.set(candidate.id, pending);
    }
    const objectUrl = await pending;
    return objectUrl ? `${objectUrl}${resolved.fragment}` : null;
  };

  const rewriteCss = async (
    css: string,
    owner: HareDomRepresentation | HareByteRepresentation,
  ): Promise<string> => {
    const quotedImports = /@import\s+(["'])([^"']+)\1/gi;
    let rewritten = await replaceAsync(css, quotedImports, async (match) => {
      const replacement = await materializeReference(owner, match[2]!, "stylesheet", "@import");
      return replacement ? `@import "${replacement}"` : `@import "${BLOCKED_URL}"`;
    });

    const urls = /url\(\s*(?:(["'])(.*?)\1|([^)]*?))\s*\)/gi;
    rewritten = await replaceAsync(rewritten, urls, async (match) => {
      const reference = (match[2] ?? match[3] ?? "").trim();
      const before = rewritten.slice(Math.max(0, (match.index || 0) - 48), match.index);
      const destination = /@import\s*$/i.test(before) ? "stylesheet" : "css-resource";
      const replacement = await materializeReference(owner, reference, destination, "url()");
      return `url("${replacement || BLOCKED_URL}")`;
    });
    return rewritten;
  };

  const rewriteAttribute = async (
    element: Element,
    attribute: string,
    destination: MaterializationDestination,
  ): Promise<void> => {
    const reference = element.getAttribute(attribute);
    if (reference === null) return;
    const replacement = await materializeReference(representation, reference, destination, attribute);
    if (replacement) element.setAttribute(attribute, replacement);
    else element.removeAttribute(attribute);
  };

  const attributeJobs: Promise<void>[] = [];
  const schedule = (selector: string, attribute: string, destination: MaterializationDestination): void => {
    preview.querySelectorAll(selector).forEach((element) => {
      attributeJobs.push(rewriteAttribute(element, attribute, destination));
    });
  };
  schedule("img[src]", "src", "image");
  schedule("audio[src]", "src", "audio");
  schedule("video[src]", "src", "video");
  schedule("video[poster]", "poster", "image");
  schedule("track[src]", "src", "track");
  schedule("input[type='image' i][src]", "src", "image");
  schedule("link[rel~='stylesheet' i][href]", "href", "stylesheet");

  preview.querySelectorAll("source[src]").forEach((element) => {
    const parent = element.parentElement?.localName;
    const destination = parent === "picture" ? "image" : parent === "audio" ? "audio" : parent === "video" ? "video" : "media";
    attributeJobs.push(rewriteAttribute(element, "src", destination));
  });
  preview.querySelectorAll("svg image[href], svg use[href]").forEach((element) => {
    attributeJobs.push(rewriteAttribute(element, "href", "image"));
  });
  preview.querySelectorAll("svg image, svg use").forEach((element) => {
    if (element.hasAttributeNS("http://www.w3.org/1999/xlink", "href")) {
      const reference = element.getAttributeNS("http://www.w3.org/1999/xlink", "href") || "";
      attributeJobs.push(materializeReference(representation, reference, "image", "xlink:href").then((replacement) => {
        if (replacement) element.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", replacement);
        else element.removeAttributeNS("http://www.w3.org/1999/xlink", "href");
      }));
    }
  });

  preview.querySelectorAll("img[srcset], source[srcset]").forEach((element) => {
    attributeJobs.push((async () => {
      const destination = element.localName === "source" && element.parentElement?.localName !== "picture" ? "media" : "image";
      const rewritten: string[] = [];
      for (const candidate of srcsetCandidates(element.getAttribute("srcset") || "")) {
        const replacement = await materializeReference(representation, candidate.url, destination, "srcset");
        if (replacement) rewritten.push(`${replacement}${candidate.descriptor ? ` ${candidate.descriptor}` : ""}`);
      }
      if (rewritten.length) element.setAttribute("srcset", rewritten.join(", "));
      else element.removeAttribute("srcset");
    })());
  });

  preview.querySelectorAll<HTMLElement>("[style]").forEach((element) => {
    attributeJobs.push(rewriteCss(element.getAttribute("style") || "", representation).then((style) => {
      element.setAttribute("style", style);
    }));
  });
  preview.querySelectorAll<HTMLStyleElement>("style").forEach((element) => {
    attributeJobs.push(rewriteCss(element.textContent || "", representation).then((style) => {
      element.textContent = style;
    }));
  });

  preview.querySelectorAll("iframe, frame, object, embed").forEach((element) => {
    const attribute = element.localName === "object" ? "data" : "src";
    const reference = element.getAttribute(attribute);
    if (reference) issue(attribute, reference, "Nested browsing contexts and plugin content are not materialized.");
    element.remove();
  });
  preview.querySelectorAll("link[href]:not([rel~='stylesheet' i])").forEach((element) => {
    issue("href", element.getAttribute("href") || "", "Only stylesheet links are materialized in a derived document.");
    element.remove();
  });

  await Promise.all(attributeJobs);
  return {
    source: serializeDocument(preview),
    issues,
    materializedRepresentations: Array.from(materialized),
    objectUrls: Array.from(objectUrls),
  };
}

/**
 * Materialize explicitly inert `data-hare-src` references in the authored
 * host document. Keeping the virtual URL outside `src` prevents the browser
 * from attempting a network request before verification has completed.
 */
export async function materializeHareHostSubresources(
  envelope: HareEnvelope,
  target: Document = document,
  options: HareMaterializationOptions = {},
): Promise<HareHostMaterializationResult> {
  const elements = Array.from(target.querySelectorAll<HTMLElement>("[data-hare-src]"))
    .filter((element) => (
      element.matches("img, audio, video, track, source, input[type='image' i]")
    ));
  if (elements.length === 0) {
    return { issues: [], materializedRepresentations: [], objectUrls: [], references: 0 };
  }

  const carrier = target.createElement("template");
  elements.forEach((element, index) => {
    const clone = element.cloneNode(false) as HTMLElement;
    clone.removeAttribute("src");
    clone.setAttribute("src", element.dataset.hareSrc || "");
    clone.setAttribute("data-hare-host-reference", String(index));
    carrier.content.append(clone);
  });

  const hostRepresentation: HareDomRepresentation = {
    id: `${envelope.id}#hare-host-document`,
    resourceId: envelope.id,
    title: "Host document",
    path: "/",
    mediaType: "text/html",
    carrier: "",
    kind: "dom",
  };
  const result = await materializeHareDomRepresentation(
    envelope,
    hostRepresentation,
    carrier,
    target,
    options,
  );

  const Parser = target.defaultView?.DOMParser ?? DOMParser;
  const materialized = new Parser().parseFromString(result.source, "text/html");
  elements.forEach((element, index) => {
    const derived = materialized.querySelector<HTMLElement>(`[data-hare-host-reference="${index}"]`);
    const source = derived?.getAttribute("src");
    if (!source) return;
    element.setAttribute("src", source);
    element.setAttribute("data-hare-materialized", "");
  });

  return {
    issues: result.issues,
    materializedRepresentations: result.materializedRepresentations,
    objectUrls: result.objectUrls,
    references: elements.length,
  };
}
