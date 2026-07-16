// src/model.ts
var HARE = "https://ia2.dev/spec/resource-envelope#";
var RDF_TYPE = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type";
var DC_FORMAT = "http://purl.org/dc/elements/1.1/format";
var DCT_CONFORMS_TO = "http://purl.org/dc/terms/conformsTo";
var DCT_HAS_PART = "http://purl.org/dc/terms/hasPart";
var DCT_IDENTIFIER = "http://purl.org/dc/terms/identifier";
var DCT_TITLE = "http://purl.org/dc/terms/title";
var CRED_DIGEST_SRI = "https://www.w3.org/2018/credentials#digestSRI";
var HARE_0_1 = `${HARE}HARE-0.1`;
var DECLARATIVE_PROFILE = `${HARE}DeclarativeProfile`;
var SELF_VIEWING_PROFILE = `${HARE}SelfViewingProfile`;
function canonicalIri(target) {
  const canonicalLinks = Array.from(target.querySelectorAll("link[href]")).filter((link) => link.relList.contains("canonical"));
  if (canonicalLinks.length > 1) throw new Error("The HARE document declares multiple canonical links.");
  const declared = canonicalLinks[0]?.href;
  if (declared && new URL(declared).hash) throw new Error("The HARE canonical IRI must be fragmentless.");
  return new URL(declared || target.URL).href.replace(/#.*$/, "");
}
function resolve(reference, base) {
  return new URL(reference || "", base).href;
}
function carrierValue(element, base) {
  if (element instanceof HTMLAnchorElement || element instanceof HTMLLinkElement) {
    return resolve(element.getAttribute("href"), base);
  }
  if (element instanceof HTMLDataElement) return element.value;
  if (element instanceof HTMLMetaElement) return element.content;
  if (element instanceof HTMLTimeElement && element.dateTime) return element.dateTime;
  return element.textContent?.replace(/[\t\n\f\r ]+/g, " ").trim() || "";
}
function statements(target, subject, predicate, graph, base) {
  return Array.from(target.querySelectorAll("[rdf-predicate]")).filter((element) => resolve(element.getAttribute("rdf-subject"), base) === subject && resolve(element.getAttribute("rdf-predicate"), base) === predicate && (graph === null || resolve(element.getAttribute("rdf-graph"), base) === graph)).map((element) => carrierValue(element, base));
}
function exactlyOne(values, label) {
  if (values.length !== 1) throw new Error(`Expected exactly one ${label}; found ${values.length}.`);
  return values[0];
}
function atMostOne(values, label) {
  if (values.length > 1) throw new Error(`Expected at most one ${label}; found ${values.length}.`);
  return values[0] || null;
}
function readHareEnvelope(target = document) {
  const envelopeId = canonicalIri(target);
  const envelopeTypes = statements(target, envelopeId, RDF_TYPE, null, envelopeId);
  if (!envelopeTypes.includes(`${HARE}Envelope`)) throw new Error("The document does not declare a HARE Envelope.");
  const manifestGraph = exactlyOne(
    statements(target, envelopeId, `${HARE}manifestGraph`, null, envelopeId),
    "manifestGraph"
  );
  const virtualBase = exactlyOne(
    statements(target, envelopeId, `${HARE}virtualBase`, manifestGraph, envelopeId),
    "virtualBase"
  );
  const virtualBaseUrl = new URL(virtualBase);
  if (virtualBaseUrl.protocol !== "https:" || !virtualBaseUrl.hostname.endsWith(".invalid") || virtualBaseUrl.pathname !== "/" || virtualBaseUrl.username !== "" || virtualBaseUrl.password !== "" || virtualBaseUrl.search !== "" || virtualBaseUrl.hash !== "") {
    throw new Error("The HARE virtualBase must be a credential-free HTTPS origin under .invalid with root path /.");
  }
  const conformsTo = statements(target, envelopeId, DCT_CONFORMS_TO, manifestGraph, envelopeId);
  if (!conformsTo.includes(HARE_0_1)) throw new Error(`The envelope does not conform to ${HARE_0_1}.`);
  const profiles = conformsTo.filter((value) => value === DECLARATIVE_PROFILE || value === SELF_VIEWING_PROFILE);
  if (profiles.length !== 1) throw new Error(`Expected exactly one HARE artifact profile; found ${profiles.length}.`);
  const profile = profiles[0] === SELF_VIEWING_PROFILE ? "self-viewing" : "declarative";
  const resourceIds = statements(target, envelopeId, DCT_HAS_PART, manifestGraph, envelopeId);
  if (resourceIds.length === 0) throw new Error("The HARE manifest has no resources.");
  const representations = resourceIds.flatMap((resourceId) => {
    const representationIds = statements(target, resourceId, `${HARE}representation`, manifestGraph, envelopeId);
    if (representationIds.length === 0) throw new Error(`The resource ${resourceId} has no representation.`);
    return representationIds.map((representationId) => {
      const representationTypes = statements(target, representationId, RDF_TYPE, manifestGraph, envelopeId);
      const kinds = representationTypes.filter((value) => value === `${HARE}DOMRepresentation` || value === `${HARE}ByteRepresentation`);
      if (kinds.length !== 1) throw new Error(`Expected exactly one representation kind for ${representationId}; found ${kinds.length}.`);
      const kind = kinds[0] === `${HARE}DOMRepresentation` ? "dom" : "bytes";
      const path = atMostOne(
        statements(target, representationId, DCT_IDENTIFIER, manifestGraph, envelopeId),
        `logical path identifier for ${representationId}`
      );
      if (kind === "dom" && path === null) {
        throw new Error(`DOM representation ${representationId} must have a logical path and virtual URL.`);
      }
      const titles = statements(target, resourceId, DCT_TITLE, manifestGraph, envelopeId);
      if (titles.length > 1) throw new Error(`Expected at most one title for ${resourceId}; found ${titles.length}.`);
      const base = {
        id: representationId,
        resourceId,
        title: titles[0] || path?.split("/").filter(Boolean).at(-1) || representationId,
        path,
        mediaType: exactlyOne(statements(target, representationId, DC_FORMAT, manifestGraph, envelopeId), `media type for ${representationId}`),
        carrier: exactlyOne(statements(target, representationId, `${HARE}carrier`, manifestGraph, envelopeId), `carrier for ${representationId}`)
      };
      if (kind === "dom") return { ...base, kind };
      const byteLength = Number(exactlyOne(
        statements(target, representationId, `${HARE}byteLength`, manifestGraph, envelopeId),
        `byteLength for ${representationId}`
      ));
      if (!Number.isSafeInteger(byteLength) || byteLength < 0) {
        throw new Error(`Invalid byteLength for ${representationId}.`);
      }
      return {
        ...base,
        kind,
        byteLength,
        integrity: exactlyOne(statements(target, representationId, CRED_DIGEST_SRI, manifestGraph, envelopeId), `SRI digest for ${representationId}`)
      };
    });
  });
  const paths = /* @__PURE__ */ new Set();
  for (const representation of representations) {
    if (representation.path === null) continue;
    if (!representation.path.startsWith("/")) throw new Error(`Logical path must start with /: ${representation.path}`);
    if (representation.path === "/") throw new Error("Logical path / is reserved for the host envelope document.");
    if (paths.has(representation.path)) throw new Error(`Duplicate logical path ${representation.path}.`);
    paths.add(representation.path);
  }
  return { id: envelopeId, conformsTo, manifestGraph, virtualBase: virtualBaseUrl.href, profile, representations };
}
function decodeBase64(source) {
  const encoded = source.replace(/[\t\n\f\r ]+/g, "");
  if (!/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(encoded)) {
    throw new Error("The byte carrier is not strict padded base64.");
  }
  const binary = atob(encoded);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}
function localCarrierId(carrierIri, target) {
  const carrierUrl = new URL(carrierIri);
  if (!carrierUrl.hash) throw new Error("A HARE carrier IRI must include a fragment.");
  const sourceIri = canonicalIri(target);
  if (carrierUrl.href.replace(/#.*$/, "") !== sourceIri) {
    throw new Error(`A HARE carrier must belong to the envelope source ${sourceIri}.`);
  }
  return decodeURIComponent(carrierUrl.hash.slice(1));
}
function digestBase64(bytes) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}
async function verifyHareRepresentation(representation, target = document) {
  const carrierId = localCarrierId(representation.carrier, target);
  const carrier = target.getElementById(carrierId);
  if (!(carrier instanceof HTMLScriptElement)) throw new Error(`Missing byte carrier ${carrierId}.`);
  if (carrier.type !== "application/octet-stream" || carrier.dataset.encoding !== "base64") {
    throw new Error(`Unsupported byte carrier ${carrierId}.`);
  }
  const bytes = decodeBase64(carrier.textContent || "");
  if (bytes.byteLength !== representation.byteLength) {
    throw new Error(`Length mismatch for ${representation.path}.`);
  }
  if (!globalThis.crypto?.subtle) throw new Error("Web Crypto is unavailable; the resource cannot be verified.");
  const digestInput = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(digestInput).set(bytes);
  const digest = new Uint8Array(await globalThis.crypto.subtle.digest("SHA-256", digestInput));
  if (`sha256-${digestBase64(digest)}` !== representation.integrity) {
    throw new Error(`Digest mismatch for ${representation.path}.`);
  }
  return { representation, bytes };
}
function getHareDomCarrier(representation, target = document) {
  const carrierId = localCarrierId(representation.carrier, target);
  const carrier = target.getElementById(carrierId);
  if (!(carrier instanceof HTMLTemplateElement)) throw new Error(`Missing DOM carrier ${carrierId}.`);
  if (representation.mediaType !== "text/html") throw new Error(`Unsupported DOM media type ${representation.mediaType}.`);
  return carrier;
}

// src/navigation.ts
function decodedFragment(url) {
  if (!url.hash) return null;
  try {
    return decodeURIComponent(url.hash.slice(1));
  } catch {
    return url.hash.slice(1);
  }
}
function withoutFragment(url) {
  const copy = new URL(url);
  copy.hash = "";
  return copy.href;
}
function isAbsoluteReference(reference) {
  return /^[A-Za-z][A-Za-z0-9+.-]*:/.test(reference) || reference.startsWith("//");
}
function hareRepresentationUrl(envelope, representation) {
  return representation.path === null ? null : new URL(representation.path, envelope.virtualBase).href;
}
function resolveHareNavigation(envelope, current, reference) {
  const value = reference.trim();
  if (value === "" || value.startsWith("#")) {
    let fragment = null;
    if (value.startsWith("#")) {
      try {
        fragment = decodeURIComponent(value.slice(1));
      } catch {
        fragment = value.slice(1);
      }
    }
    return { kind: "representation", representation: current, fragment };
  }
  if (current.path === null && !isAbsoluteReference(value)) {
    return {
      kind: "blocked",
      reason: "This representation has no logical path, so its relative link has no virtual base."
    };
  }
  let target;
  try {
    const base = current.path === null ? envelope.virtualBase : hareRepresentationUrl(envelope, current);
    target = new URL(value, base);
  } catch {
    return { kind: "blocked", reason: `The link target is not a valid URL: ${value}` };
  }
  const exactRepresentation = envelope.representations.find((representation) => representation.id === target.href);
  if (exactRepresentation) {
    return { kind: "representation", representation: exactRepresentation, fragment: null };
  }
  if (withoutFragment(target) === envelope.virtualBase) {
    return { kind: "host", fragment: decodedFragment(target) };
  }
  if (target.origin === new URL(envelope.virtualBase).origin) {
    const representation = envelope.representations.find((candidate) => hareRepresentationUrl(envelope, candidate) === withoutFragment(target));
    if (representation) {
      return { kind: "representation", representation, fragment: decodedFragment(target) };
    }
    return { kind: "blocked", reason: `No bundled representation has virtual URL ${withoutFragment(target)}.` };
  }
  if (withoutFragment(target) === envelope.id) {
    return { kind: "host", fragment: decodedFragment(target) };
  }
  if (["http:", "https:", "mailto:", "tel:"].includes(target.protocol)) {
    return { kind: "external", url: target.href };
  }
  return { kind: "blocked", reason: `The viewer does not allow ${target.protocol} links.` };
}

// src/materialize.ts
var BLOCKED_URL = "about:blank#hare-blocked";
function mediaTypeEssence(value) {
  return value.split(";", 1)[0].trim().toLowerCase();
}
function acceptsMediaType(mediaType, destination) {
  const essence = mediaTypeEssence(mediaType);
  if (destination === "stylesheet") return essence === "text/css";
  if (destination === "image") return essence.startsWith("image/");
  if (destination === "audio") return essence.startsWith("audio/");
  if (destination === "video") return essence.startsWith("video/");
  if (destination === "media") return essence.startsWith("audio/") || essence.startsWith("video/");
  if (destination === "track") return essence === "text/vtt";
  return essence.startsWith("image/") || essence.startsWith("font/") || essence.startsWith("application/font-") || essence === "application/vnd.ms-fontobject";
}
function bytesAsBlob(bytes, mediaType) {
  const buffer = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(buffer).set(bytes);
  return new Blob([buffer], { type: mediaType });
}
function serializeDocument(target) {
  return `<!doctype html>
${target.documentElement.outerHTML}`;
}
function srcsetCandidates(value) {
  const candidates = [];
  let position = 0;
  while (position < value.length) {
    while (position < value.length && /[\s,]/.test(value[position])) position += 1;
    if (position >= value.length) break;
    const dataUrl = value.slice(position, position + 5).toLowerCase() === "data:";
    const urlStart = position;
    while (position < value.length && !/\s/.test(value[position]) && (dataUrl || value[position] !== ",")) position += 1;
    const url = value.slice(urlStart, position);
    while (position < value.length && /\s/.test(value[position])) position += 1;
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
async function replaceAsync(value, pattern, replacer) {
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
async function materializeHareDomRepresentation(envelope, representation, carrier, target = document, options = {}) {
  const preview = target.implementation.createHTMLDocument(representation.title);
  const virtualUrl = hareRepresentationUrl(envelope, representation);
  if (!virtualUrl) throw new Error(`DOM representation ${representation.id} has no virtual URL.`);
  const base = preview.createElement("base");
  base.href = virtualUrl;
  const policy = preview.createElement("meta");
  policy.httpEquiv = "Content-Security-Policy";
  policy.content = "default-src 'none'; img-src data: blob:; media-src data: blob:; style-src 'unsafe-inline' data: blob:; font-src data: blob:; form-action 'none'";
  preview.head.prepend(policy, base);
  const content = carrier.content.cloneNode(true);
  content.querySelectorAll("script, base, meta[http-equiv='refresh' i]").forEach((element) => element.remove());
  preview.body.replaceChildren(content);
  preview.querySelectorAll("a[href]").forEach((anchor) => {
    anchor.dataset.hareHref = anchor.getAttribute("href") || "";
    anchor.setAttribute("href", "#hare-navigation");
  });
  const issues = [];
  const objectUrls = /* @__PURE__ */ new Set();
  const materialized = /* @__PURE__ */ new Set();
  const verified = /* @__PURE__ */ new Map();
  const materializedUrls = /* @__PURE__ */ new Map();
  const activeStylesheets = /* @__PURE__ */ new Set();
  const verify = options.verify || verifyHareRepresentation;
  const createObjectURL = options.createObjectURL || ((blob) => URL.createObjectURL(blob));
  const issue = (attribute, reference, reason) => {
    issues.push({ attribute, reference, reason });
    return null;
  };
  const resolveReference = (owner, reference, attribute) => {
    const value = reference.trim();
    if (!value) return issue(attribute, reference, "The reference is empty.");
    if (value.startsWith("#")) return "inline";
    let resolved;
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
  const verifyOnce = (candidate) => {
    let pending = verified.get(candidate.id);
    if (!pending) {
      pending = verify(candidate, target);
      verified.set(candidate.id, pending);
    }
    return pending;
  };
  const materializeReference = async (owner, reference, destination, attribute) => {
    const resolved = resolveReference(owner, reference, attribute);
    if (resolved === "inline") return reference;
    if (!resolved) return null;
    const candidate = resolved.representation;
    if (!acceptsMediaType(candidate.mediaType, destination)) {
      return issue(
        attribute,
        reference,
        `${candidate.mediaType} is not allowed for the ${destination} destination.`
      );
    }
    if (destination === "stylesheet" && activeStylesheets.has(candidate.id)) {
      return issue(attribute, reference, `The stylesheet import cycle through ${candidate.path || candidate.id} was blocked.`);
    }
    let pending = materializedUrls.get(candidate.id);
    if (!pending) {
      pending = (async () => {
        try {
          const checked = await verifyOnce(candidate);
          let blob;
          if (mediaTypeEssence(candidate.mediaType) === "text/css") {
            activeStylesheets.add(candidate.id);
            try {
              const css = new TextDecoder().decode(checked.bytes);
              blob = bytesAsBlob(
                new TextEncoder().encode(await rewriteCss(css, candidate)),
                candidate.mediaType
              );
            } finally {
              activeStylesheets.delete(candidate.id);
            }
          } else {
            blob = bytesAsBlob(checked.bytes, candidate.mediaType);
          }
          const objectUrl2 = createObjectURL(blob);
          objectUrls.add(objectUrl2);
          materialized.add(candidate.id);
          return objectUrl2;
        } catch (error) {
          return issue(
            attribute,
            reference,
            error instanceof Error ? error.message : String(error)
          );
        }
      })();
      materializedUrls.set(candidate.id, pending);
    }
    const objectUrl = await pending;
    return objectUrl ? `${objectUrl}${resolved.fragment}` : null;
  };
  const rewriteCss = async (css, owner) => {
    const quotedImports = /@import\s+(["'])([^"']+)\1/gi;
    let rewritten = await replaceAsync(css, quotedImports, async (match) => {
      const replacement = await materializeReference(owner, match[2], "stylesheet", "@import");
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
  const rewriteAttribute = async (element, attribute, destination) => {
    const reference = element.getAttribute(attribute);
    if (reference === null) return;
    const replacement = await materializeReference(representation, reference, destination, attribute);
    if (replacement) element.setAttribute(attribute, replacement);
    else element.removeAttribute(attribute);
  };
  const attributeJobs = [];
  const schedule = (selector, attribute, destination) => {
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
      const rewritten = [];
      for (const candidate of srcsetCandidates(element.getAttribute("srcset") || "")) {
        const replacement = await materializeReference(representation, candidate.url, destination, "srcset");
        if (replacement) rewritten.push(`${replacement}${candidate.descriptor ? ` ${candidate.descriptor}` : ""}`);
      }
      if (rewritten.length) element.setAttribute("srcset", rewritten.join(", "));
      else element.removeAttribute("srcset");
    })());
  });
  preview.querySelectorAll("[style]").forEach((element) => {
    attributeJobs.push(rewriteCss(element.getAttribute("style") || "", representation).then((style) => {
      element.setAttribute("style", style);
    }));
  });
  preview.querySelectorAll("style").forEach((element) => {
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
    objectUrls: Array.from(objectUrls)
  };
}
async function materializeHareHostSubresources(envelope, target = document, options = {}) {
  const elements = Array.from(target.querySelectorAll("[data-hare-src]")).filter((element) => element.matches("img, audio, video, track, source, input[type='image' i]"));
  if (elements.length === 0) {
    return { issues: [], materializedRepresentations: [], objectUrls: [], references: 0 };
  }
  const carrier = target.createElement("template");
  elements.forEach((element, index) => {
    const clone = element.cloneNode(false);
    clone.removeAttribute("src");
    clone.setAttribute("src", element.dataset.hareSrc || "");
    clone.setAttribute("data-hare-host-reference", String(index));
    carrier.content.append(clone);
  });
  const hostRepresentation = {
    id: `${envelope.id}#hare-host-document`,
    resourceId: envelope.id,
    title: "Host document",
    path: "/",
    mediaType: "text/html",
    carrier: "",
    kind: "dom"
  };
  const result = await materializeHareDomRepresentation(
    envelope,
    hostRepresentation,
    carrier,
    target,
    options
  );
  const Parser = target.defaultView?.DOMParser ?? DOMParser;
  const materialized = new Parser().parseFromString(result.source, "text/html");
  elements.forEach((element, index) => {
    const derived = materialized.querySelector(`[data-hare-host-reference="${index}"]`);
    const source = derived?.getAttribute("src");
    if (!source) return;
    element.setAttribute("src", source);
    element.setAttribute("data-hare-materialized", "");
  });
  return {
    issues: result.issues,
    materializedRepresentations: result.materializedRepresentations,
    objectUrls: result.objectUrls,
    references: elements.length
  };
}

// src/markdown.ts
var BLOCK_START = /^(?: {0,3}(?:#{1,6}\s|>|(?:[-+*]|\d+[.)])\s|`{3,}|~{3,}|(?:[*_-]\s*){3,}$)| {4}\S)/;
var SAFE_LINK = /^(?:https?:|mailto:|tel:|#|\/|\.\/|\.\.\/)/i;
function splitTableRow(line) {
  const value = line.trim().replace(/^\|/, "").replace(/\|$/, "");
  const cells = [];
  let cell = "";
  let escaped = false;
  for (const character of value) {
    if (escaped) {
      cell += character;
      escaped = false;
    } else if (character === "\\") {
      escaped = true;
      cell += character;
    } else if (character === "|") {
      cells.push(cell.trim());
      cell = "";
    } else {
      cell += character;
    }
  }
  cells.push(cell.trim());
  return cells;
}
function tableDelimiter(line) {
  const cells = splitTableRow(line);
  if (cells.length === 0 || cells.some((cell) => !/^:?-{3,}:?$/.test(cell))) return null;
  return cells.map((cell) => cell.startsWith(":") && cell.endsWith(":") ? "center" : cell.endsWith(":") ? "right" : cell.startsWith(":") ? "left" : null);
}
function parseDestination(value) {
  const trimmed = value.trim();
  const match = trimmed.match(/^<?([^\s>]+)>?(?:\s+["']([^"']*)["'])?$/);
  return match ? { destination: match[1], title: match[2] ?? null } : null;
}
async function appendInline(parent, source, options, document2) {
  let index = 0;
  let text = "";
  const flush = () => {
    if (text) parent.appendChild(document2.createTextNode(text));
    text = "";
  };
  const enclosed = (start, marker) => source.indexOf(marker, start + marker.length);
  while (index < source.length) {
    const rest = source.slice(index);
    if (rest.startsWith("\\\n")) {
      flush();
      parent.appendChild(document2.createElement("br"));
      index += 2;
      continue;
    }
    if (rest.startsWith("  \n")) {
      flush();
      parent.appendChild(document2.createElement("br"));
      index += 3;
      continue;
    }
    if (source[index] === "\n") {
      text += " ";
      index += 1;
      continue;
    }
    if (source[index] === "\\" && /[\\`*{}\[\]()#+.!_>~-]/.test(source[index + 1] ?? "")) {
      text += source[index + 1];
      index += 2;
      continue;
    }
    if (source[index] === "`") {
      const run = rest.match(/^`+/)?.[0] ?? "`";
      const end = source.indexOf(run, index + run.length);
      if (end >= 0) {
        flush();
        const code = document2.createElement("code");
        code.textContent = source.slice(index + run.length, end).replace(/\s*\n\s*/g, " ");
        parent.appendChild(code);
        index = end + run.length;
        continue;
      }
    }
    const isImage = rest.startsWith("![");
    if (isImage || rest.startsWith("[")) {
      const labelStart = index + (isImage ? 2 : 1);
      const labelEnd = source.indexOf("](", labelStart);
      const destinationEnd = labelEnd >= 0 ? source.indexOf(")", labelEnd + 2) : -1;
      if (labelEnd >= 0 && destinationEnd >= 0) {
        const reference = parseDestination(source.slice(labelEnd + 2, destinationEnd));
        if (reference) {
          flush();
          const label = source.slice(labelStart, labelEnd);
          if (isImage) {
            const resolved = await options.resolveImage?.(reference);
            if (resolved) {
              const image = document2.createElement("img");
              image.alt = label;
              image.src = resolved;
              image.dataset.markdownDestination = reference.destination;
              if (reference.title) image.title = reference.title;
              parent.appendChild(image);
            } else {
              const fallback = document2.createElement("span");
              fallback.className = "markdown-image-unavailable";
              fallback.textContent = label || reference.destination;
              fallback.dataset.markdownDestination = reference.destination;
              parent.appendChild(fallback);
            }
          } else {
            const resolved = await options.resolveLink?.(reference);
            if (resolved) {
              const anchor = document2.createElement("a");
              anchor.href = resolved;
              anchor.dataset.markdownDestination = reference.destination;
              if (reference.title) anchor.title = reference.title;
              await appendInline(anchor, label, options, document2);
              parent.appendChild(anchor);
            } else {
              await appendInline(parent, label, options, document2);
            }
          }
          index = destinationEnd + 1;
          continue;
        }
      }
    }
    if (source[index] === "<") {
      const end = source.indexOf(">", index + 1);
      if (end >= 0) {
        const target = source.slice(index + 1, end);
        const destination = /^https?:\/\//i.test(target) ? target : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(target) ? `mailto:${target}` : null;
        if (destination) {
          flush();
          const resolved = await options.resolveLink?.({ destination, title: null });
          if (resolved) {
            const anchor = document2.createElement("a");
            anchor.href = resolved;
            anchor.dataset.markdownDestination = destination;
            anchor.textContent = target;
            parent.appendChild(anchor);
          } else text += target;
          index = end + 1;
          continue;
        }
      }
    }
    const markers = [["**", "strong"], ["__", "strong"], ["~~", "del"], ["*", "em"], ["_", "em"]];
    let matched = false;
    for (const [marker, tag] of markers) {
      if (!rest.startsWith(marker)) continue;
      const end = enclosed(index, marker);
      if (end <= index + marker.length) continue;
      flush();
      const element = document2.createElement(tag);
      await appendInline(element, source.slice(index + marker.length, end), options, document2);
      parent.appendChild(element);
      index = end + marker.length;
      matched = true;
      break;
    }
    if (matched) continue;
    text += source[index];
    index += 1;
  }
  flush();
}
async function renderBlocks(lines, parent, options, document2) {
  let index = 0;
  while (index < lines.length) {
    const line = lines[index];
    if (!line.trim()) {
      index += 1;
      continue;
    }
    const fence = line.match(/^ {0,3}(`{3,}|~{3,})\s*([^\s`]*)?.*$/);
    if (fence) {
      const marker = fence[1];
      const body = [];
      index += 1;
      while (index < lines.length && !new RegExp(`^ {0,3}${marker[0]}{${marker.length},}\\s*$`).test(lines[index])) {
        body.push(lines[index]);
        index += 1;
      }
      if (index < lines.length) index += 1;
      const pre = document2.createElement("pre");
      const code = document2.createElement("code");
      code.textContent = body.join("\n");
      if (fence[2]) code.className = `language-${fence[2].replace(/[^A-Za-z0-9_-]/g, "")}`;
      pre.append(code);
      parent.append(pre);
      continue;
    }
    const heading = line.match(/^ {0,3}(#{1,6})(?:\s+|$)(.*?)(?:\s+#+\s*)?$/);
    if (heading) {
      const element2 = document2.createElement(`h${heading[1].length}`);
      await appendInline(element2, heading[2], options, document2);
      parent.append(element2);
      index += 1;
      continue;
    }
    if (index + 1 < lines.length && /^ {0,3}(?:=+|-+)\s*$/.test(lines[index + 1]) && line.trim()) {
      const element2 = document2.createElement(lines[index + 1].includes("=") ? "h1" : "h2");
      await appendInline(element2, line.trim(), options, document2);
      parent.append(element2);
      index += 2;
      continue;
    }
    if (/^ {0,3}(?:(?:\*\s*){3,}|(?:-\s*){3,}|(?:_\s*){3,})$/.test(line)) {
      parent.append(document2.createElement("hr"));
      index += 1;
      continue;
    }
    if (/^ {0,3}>/.test(line)) {
      const quoteLines = [];
      while (index < lines.length && (/^ {0,3}>/.test(lines[index]) || !lines[index].trim())) {
        quoteLines.push(lines[index].replace(/^ {0,3}> ?/, ""));
        index += 1;
      }
      const quote = document2.createElement("blockquote");
      await renderBlocks(quoteLines, quote, options, document2);
      parent.append(quote);
      continue;
    }
    const listMatch = line.match(/^ {0,3}([-+*]|\d+[.)])\s+(.*)$/);
    if (listMatch) {
      const ordered = /\d/.test(listMatch[1]);
      const list = document2.createElement(ordered ? "ol" : "ul");
      if (ordered) list.setAttribute("start", listMatch[1].match(/^\d+/)[0]);
      while (index < lines.length) {
        const itemMatch = lines[index].match(/^ {0,3}([-+*]|\d+[.)])\s+(.*)$/);
        if (!itemMatch || /\d/.test(itemMatch[1]) !== ordered) break;
        const itemLines = [itemMatch[2]];
        index += 1;
        while (index < lines.length && (/^ {2,}\S/.test(lines[index]) || !lines[index].trim())) {
          itemLines.push(lines[index].replace(/^ {2,4}/, ""));
          index += 1;
        }
        const item = document2.createElement("li");
        const task = itemLines[0].match(/^\[([ xX])\]\s+(.*)$/);
        if (task) {
          item.classList.add("task-list-item");
          const checkbox = document2.createElement("input");
          checkbox.type = "checkbox";
          checkbox.checked = task[1].toLowerCase() === "x";
          checkbox.disabled = true;
          checkbox.setAttribute("aria-label", checkbox.checked ? "Completed" : "Not completed");
          item.append(checkbox, " ");
          itemLines[0] = task[2];
        }
        await renderBlocks(itemLines, item, options, document2);
        list.append(item);
      }
      parent.append(list);
      continue;
    }
    if (index + 1 < lines.length && line.includes("|") && tableDelimiter(lines[index + 1])) {
      const alignments = tableDelimiter(lines[index + 1]);
      const table = document2.createElement("table");
      const head = document2.createElement("thead");
      const headerRow = document2.createElement("tr");
      for (const [cellIndex, value] of splitTableRow(line).entries()) {
        const cell = document2.createElement("th");
        if (alignments[cellIndex]) cell.style.textAlign = alignments[cellIndex];
        await appendInline(cell, value, options, document2);
        headerRow.append(cell);
      }
      head.append(headerRow);
      table.append(head);
      index += 2;
      const body = document2.createElement("tbody");
      while (index < lines.length && lines[index].includes("|") && lines[index].trim()) {
        const row = document2.createElement("tr");
        for (const [cellIndex, value] of splitTableRow(lines[index]).entries()) {
          const cell = document2.createElement("td");
          if (alignments[cellIndex]) cell.style.textAlign = alignments[cellIndex];
          await appendInline(cell, value, options, document2);
          row.append(cell);
        }
        body.append(row);
        index += 1;
      }
      table.append(body);
      parent.append(table);
      continue;
    }
    if (/^ {4}/.test(line)) {
      const body = [];
      while (index < lines.length && (/^ {4}/.test(lines[index]) || !lines[index].trim())) {
        body.push(lines[index].replace(/^ {4}/, ""));
        index += 1;
      }
      const pre = document2.createElement("pre");
      const code = document2.createElement("code");
      code.textContent = body.join("\n").replace(/\n+$/, "");
      pre.append(code);
      parent.append(pre);
      continue;
    }
    const paragraph = [line];
    index += 1;
    while (index < lines.length && lines[index].trim() && !BLOCK_START.test(lines[index])) {
      if (index + 1 < lines.length && tableDelimiter(lines[index + 1])) break;
      paragraph.push(lines[index]);
      index += 1;
    }
    const element = document2.createElement("p");
    await appendInline(element, paragraph.join("\n"), options, document2);
    parent.append(element);
  }
}
async function renderSafeMarkdown(markdown, options = {}) {
  const document2 = options.document ?? globalThis.document;
  const section = document2.createElement("section");
  section.className = "markdown";
  const normalized = markdown.replace(/\r\n?/g, "\n").replace(/^\uFEFF/, "");
  await renderBlocks(normalized.split("\n"), section, {
    ...options,
    resolveLink: options.resolveLink ?? ((reference) => SAFE_LINK.test(reference.destination) ? reference.destination : null)
  }, document2);
  return section;
}

// src/viewer.ts
var CSS = String.raw`
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
function hasAuthoredContent(target, viewer) {
  return Array.from(target.body.children).some((element) => {
    if (element === viewer || element.hasAttribute("hidden")) return false;
    return !["SCRIPT", "STYLE", "LINK", "TEMPLATE", "NOSCRIPT"].includes(element.tagName);
  });
}
function filename(path, title) {
  return path?.split("/").filter(Boolean).at(-1) || title || "resource";
}
var HareViewerElement = class extends HTMLElement {
  #envelope = null;
  #mode = "full";
  #selected = null;
  #blobUrl = null;
  #objectUrls = /* @__PURE__ */ new Set();
  #hostObjectUrls = /* @__PURE__ */ new Set();
  #previousBodyOverflow = "";
  #filesOpen = false;
  connectedCallback() {
    if (this.shadowRoot) return;
    try {
      this.#envelope = readHareEnvelope(this.ownerDocument);
      const requested = this.getAttribute("mode") || "auto";
      this.#mode = requested === "auto" ? hasAuthoredContent(this.ownerDocument, this) ? "tabs" : "full" : requested;
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
  disconnectedCallback() {
    this.#releaseObjectUrls();
    for (const url of this.#hostObjectUrls) URL.revokeObjectURL(url);
    this.#hostObjectUrls.clear();
    if (this.#mode === "tabs") this.ownerDocument.body.style.overflow = this.#previousBodyOverflow;
  }
  get mode() {
    return this.#mode;
  }
  get envelope() {
    return this.#envelope;
  }
  get filesOpen() {
    return this.#filesOpen;
  }
  openFiles() {
    if (this.#mode === "full" || this.#filesOpen) return;
    this.#filesOpen = true;
    this.#previousBodyOverflow = this.ownerDocument.body.style.overflow;
    this.ownerDocument.body.style.overflow = "hidden";
    this.#syncTabs();
  }
  closeFiles() {
    if (this.#mode === "full" || !this.#filesOpen) return;
    this.#filesOpen = false;
    this.ownerDocument.body.style.overflow = this.#previousBodyOverflow;
    this.#syncTabs();
  }
  async #materializeHostSubresources() {
    if (!this.#envelope) return;
    const result = await materializeHareHostSubresources(this.#envelope, this.ownerDocument);
    if (!this.isConnected) {
      result.objectUrls.forEach((url) => URL.revokeObjectURL(url));
      return;
    }
    result.objectUrls.forEach((url) => this.#hostObjectUrls.add(url));
    this.dataset.hostMaterializationIssues = String(result.issues.length);
  }
  #render() {
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
    root.querySelector(".document-tab")?.addEventListener("click", () => this.closeFiles());
    root.querySelector(".files-tab")?.addEventListener("click", () => this.openFiles());
    root.addEventListener("keydown", (event) => {
      if (event.key === "Escape") this.closeFiles();
    });
    root.querySelector(".search")?.addEventListener("input", (event) => {
      this.#renderFiles(event.currentTarget.value);
    });
    this.#renderFiles();
    this.#syncTabs();
  }
  #syncTabs() {
    const root = this.shadowRoot;
    if (!root) return;
    const documentTab = root.querySelector(".document-tab");
    const filesTab = root.querySelector(".files-tab");
    const workspace = root.querySelector(".workspace");
    if (!documentTab || !filesTab || !workspace) return;
    documentTab.hidden = this.#mode === "full";
    this.dataset.open = String(this.#filesOpen);
    documentTab.setAttribute("aria-selected", String(!this.#filesOpen));
    documentTab.tabIndex = this.#filesOpen ? -1 : 0;
    filesTab.setAttribute("aria-selected", String(this.#filesOpen));
    filesTab.tabIndex = this.#filesOpen ? 0 : -1;
    workspace.hidden = !this.#filesOpen;
  }
  #renderFiles(query = "") {
    const list = this.shadowRoot?.querySelector(".files");
    if (!list || !this.#envelope) return;
    list.replaceChildren();
    const normalized = query.trim().toLowerCase();
    const matches = this.#envelope.representations.filter((representation) => `${representation.title} ${representation.path} ${representation.mediaType}`.toLowerCase().includes(normalized));
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
  async #open(representation, fragment = null) {
    this.#selected = representation;
    this.#renderFiles(this.shadowRoot?.querySelector(".search")?.value || "");
    const preview = this.shadowRoot?.querySelector(".preview");
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
        const meta2 = this.ownerDocument.createElement("div");
        meta2.className = "meta";
        const virtualUrl = this.#envelope ? hareRepresentationUrl(this.#envelope, representation) : null;
        for (const value of [virtualUrl, representation.mediaType, "Template carrier"].filter(Boolean)) {
          const part = this.ownerDocument.createElement("span");
          part.textContent = value;
          meta2.append(part);
        }
        preview.append(meta2);
        if (!this.#envelope) throw new Error("The envelope model is unavailable.");
        const materialization = await materializeHareDomRepresentation(
          this.#envelope,
          representation,
          carrier,
          this.ownerDocument
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
          meta2.append(part);
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
      for (const value of [representation.path, representation.mediaType, `${representation.byteLength} bytes`].filter(Boolean)) {
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
  #renderDomRepresentation(source, representation, preview, fragment) {
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
        const origin = FrameElement && event.target instanceof FrameElement ? event.target : null;
        const anchor = origin?.closest("a[href]");
        if (!anchor) return;
        event.preventDefault();
        event.stopPropagation();
        void this.#followLink(
          representation,
          anchor.dataset.hareHref ?? anchor.getAttribute("href") ?? ""
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
  #materializationNote(issues) {
    const details = this.ownerDocument.createElement("details");
    details.className = "materialization-note";
    const summary = this.ownerDocument.createElement("summary");
    summary.textContent = `${issues.length} subresource reference${issues.length === 1 ? " was" : "s were"} left inert`;
    const list = this.ownerDocument.createElement("ul");
    for (const issue of issues) {
      const item = this.ownerDocument.createElement("li");
      const reference = this.ownerDocument.createElement("code");
      reference.textContent = issue.reference || "(empty reference)";
      item.append(reference, ` \u2014 ${issue.reason}`);
      list.append(item);
    }
    details.append(summary, list);
    return details;
  }
  async #followLink(current, reference) {
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
  #openHostDocument(fragment) {
    const target = fragment === null ? this.ownerDocument.body : this.ownerDocument.getElementById(fragment);
    if (target && "scrollIntoView" in target) {
      this.closeFiles();
      target.scrollIntoView({ block: "start" });
      return;
    }
    this.#showNavigationError(fragment === null ? "The envelope has no authored document view." : `No host-document fragment named #${fragment} exists.`);
  }
  #showNavigationError(message) {
    const preview = this.shadowRoot?.querySelector(".preview");
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
  async #renderRepresentation(bytes, representation, preview) {
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
        }
      });
      section.addEventListener("click", (event) => {
        const origin = event.target instanceof Element ? event.target : null;
        const anchor = origin?.closest("a[data-markdown-destination]");
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
  #releaseObjectUrls() {
    for (const url of this.#objectUrls) URL.revokeObjectURL(url);
    this.#objectUrls.clear();
    this.#blobUrl = null;
  }
  #renderFailure(error) {
    const root = this.attachShadow({ mode: "open" });
    const message = error instanceof Error ? error.message : String(error);
    root.innerHTML = `<style>${CSS}</style><div class="bar"><div class="identity"><strong>HARE</strong><span>Viewer unavailable</span></div></div><main class="preview"><h2 class="preview-title">The envelope could not be opened</h2><p class="error"></p></main>`;
    const output = root.querySelector(".error");
    if (output) output.textContent = message;
  }
};

// src/index.ts
if (!customElements.get("ia2-hare-viewer")) {
  customElements.define("ia2-hare-viewer", HareViewerElement);
}
function mountHareViewer(options = {}) {
  const target = options.document ?? document;
  const existing = target.querySelector("ia2-hare-viewer");
  if (existing) return existing;
  const viewer = target.createElement("ia2-hare-viewer");
  if (options.mode) viewer.setAttribute("mode", options.mode);
  target.body.prepend(viewer);
  return viewer;
}
function autoMount() {
  if (window.__IA2_HARE_VIEWER_NO_AUTO__) return;
  mountHareViewer();
}
if (typeof window !== "undefined" && typeof document !== "undefined") {
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", autoMount, { once: true });
  else autoMount();
}
export {
  HARE,
  HareViewerElement,
  getHareDomCarrier,
  hareRepresentationUrl,
  materializeHareDomRepresentation,
  materializeHareHostSubresources,
  mountHareViewer,
  readHareEnvelope,
  renderSafeMarkdown,
  resolveHareNavigation,
  verifyHareRepresentation
};
