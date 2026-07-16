export const HARE = "https://ia2.dev/spec/resource-envelope#";
const RDF_TYPE = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type";
const DC_FORMAT = "http://purl.org/dc/elements/1.1/format";
const DCT_CONFORMS_TO = "http://purl.org/dc/terms/conformsTo";
const DCT_HAS_PART = "http://purl.org/dc/terms/hasPart";
const DCT_IDENTIFIER = "http://purl.org/dc/terms/identifier";
const DCT_TITLE = "http://purl.org/dc/terms/title";
const CRED_DIGEST_SRI = "https://www.w3.org/2018/credentials#digestSRI";
const HARE_0_1 = `${HARE}HARE-0.1`;
const DECLARATIVE_PROFILE = `${HARE}DeclarativeProfile`;
const SELF_VIEWING_PROFILE = `${HARE}SelfViewingProfile`;

interface HareRepresentationBase {
  id: string;
  resourceId: string;
  title: string;
  path: string | null;
  mediaType: string;
  carrier: string;
}

export interface HareDomRepresentation extends HareRepresentationBase {
  kind: "dom";
}

export interface HareByteRepresentation extends HareRepresentationBase {
  kind: "bytes";
  byteLength: number;
  integrity: string;
}

export type HareRepresentation = HareDomRepresentation | HareByteRepresentation;

export interface HareEnvelope {
  id: string;
  conformsTo: string[];
  manifestGraph: string;
  virtualBase: string;
  profile: "declarative" | "self-viewing";
  representations: HareRepresentation[];
}

export interface VerifiedHareRepresentation {
  representation: HareByteRepresentation;
  bytes: Uint8Array;
}

function canonicalIri(target: Document): string {
  const canonicalLinks = Array.from(target.querySelectorAll<HTMLLinkElement>("link[href]"))
    .filter((link) => link.relList.contains("canonical"));
  if (canonicalLinks.length > 1) throw new Error("The HARE document declares multiple canonical links.");
  const declared = canonicalLinks[0]?.href;
  if (declared && new URL(declared).hash) throw new Error("The HARE canonical IRI must be fragmentless.");
  return new URL(declared || target.URL).href.replace(/#.*$/, "");
}

function resolve(reference: string | null, base: string): string {
  return new URL(reference || "", base).href;
}

function carrierValue(element: Element, base: string): string {
  if (element instanceof HTMLAnchorElement || element instanceof HTMLLinkElement) {
    return resolve(element.getAttribute("href"), base);
  }
  if (element instanceof HTMLDataElement) return element.value;
  if (element instanceof HTMLMetaElement) return element.content;
  if (element instanceof HTMLTimeElement && element.dateTime) return element.dateTime;
  return element.textContent?.replace(/[\t\n\f\r ]+/g, " ").trim() || "";
}

function statements(
  target: Document,
  subject: string,
  predicate: string,
  graph: string | null,
  base: string,
): string[] {
  return Array.from(target.querySelectorAll<HTMLElement>("[rdf-predicate]"))
    .filter((element) => (
      resolve(element.getAttribute("rdf-subject"), base) === subject
      && resolve(element.getAttribute("rdf-predicate"), base) === predicate
      && (graph === null || resolve(element.getAttribute("rdf-graph"), base) === graph)
    ))
    .map((element) => carrierValue(element, base));
}

function exactlyOne(values: string[], label: string): string {
  if (values.length !== 1) throw new Error(`Expected exactly one ${label}; found ${values.length}.`);
  return values[0]!;
}

function atMostOne(values: string[], label: string): string | null {
  if (values.length > 1) throw new Error(`Expected at most one ${label}; found ${values.length}.`);
  return values[0] || null;
}

export function readHareEnvelope(target: Document = document): HareEnvelope {
  const envelopeId = canonicalIri(target);
  const envelopeTypes = statements(target, envelopeId, RDF_TYPE, null, envelopeId);
  if (!envelopeTypes.includes(`${HARE}Envelope`)) throw new Error("The document does not declare a HARE Envelope.");

  const manifestGraph = exactlyOne(
    statements(target, envelopeId, `${HARE}manifestGraph`, null, envelopeId),
    "manifestGraph",
  );
  const virtualBase = exactlyOne(
    statements(target, envelopeId, `${HARE}virtualBase`, manifestGraph, envelopeId),
    "virtualBase",
  );
  const virtualBaseUrl = new URL(virtualBase);
  if (
    virtualBaseUrl.protocol !== "https:"
    || !virtualBaseUrl.hostname.endsWith(".invalid")
    || virtualBaseUrl.pathname !== "/"
    || virtualBaseUrl.username !== ""
    || virtualBaseUrl.password !== ""
    || virtualBaseUrl.search !== ""
    || virtualBaseUrl.hash !== ""
  ) {
    throw new Error("The HARE virtualBase must be a credential-free HTTPS origin under .invalid with root path /.");
  }
  const conformsTo = statements(target, envelopeId, DCT_CONFORMS_TO, manifestGraph, envelopeId);
  if (!conformsTo.includes(HARE_0_1)) throw new Error(`The envelope does not conform to ${HARE_0_1}.`);
  const profiles = conformsTo.filter((value) => value === DECLARATIVE_PROFILE || value === SELF_VIEWING_PROFILE);
  if (profiles.length !== 1) throw new Error(`Expected exactly one HARE artifact profile; found ${profiles.length}.`);
  const profile = profiles[0] === SELF_VIEWING_PROFILE ? "self-viewing" : "declarative";

  const resourceIds = statements(target, envelopeId, DCT_HAS_PART, manifestGraph, envelopeId);
  if (resourceIds.length === 0) throw new Error("The HARE manifest has no resources.");

  const representations = resourceIds.flatMap((resourceId): HareRepresentation[] => {
    const representationIds = statements(target, resourceId, `${HARE}representation`, manifestGraph, envelopeId);
    if (representationIds.length === 0) throw new Error(`The resource ${resourceId} has no representation.`);
    return representationIds.map((representationId): HareRepresentation => {
      const representationTypes = statements(target, representationId, RDF_TYPE, manifestGraph, envelopeId);
      const kinds = representationTypes.filter((value) => value === `${HARE}DOMRepresentation` || value === `${HARE}ByteRepresentation`);
      if (kinds.length !== 1) throw new Error(`Expected exactly one representation kind for ${representationId}; found ${kinds.length}.`);
      const kind = kinds[0] === `${HARE}DOMRepresentation` ? "dom" : "bytes";
      const path = atMostOne(
        statements(target, representationId, DCT_IDENTIFIER, manifestGraph, envelopeId),
        `logical path identifier for ${representationId}`,
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
        carrier: exactlyOne(statements(target, representationId, `${HARE}carrier`, manifestGraph, envelopeId), `carrier for ${representationId}`),
      };
      if (kind === "dom") return { ...base, kind };
      const byteLength = Number(exactlyOne(
        statements(target, representationId, `${HARE}byteLength`, manifestGraph, envelopeId),
        `byteLength for ${representationId}`,
      ));
      if (!Number.isSafeInteger(byteLength) || byteLength < 0) {
        throw new Error(`Invalid byteLength for ${representationId}.`);
      }
      return {
        ...base,
        kind,
        byteLength,
        integrity: exactlyOne(statements(target, representationId, CRED_DIGEST_SRI, manifestGraph, envelopeId), `SRI digest for ${representationId}`),
      };
    });
  });

  const paths = new Set<string>();
  for (const representation of representations) {
    if (representation.path === null) continue;
    if (!representation.path.startsWith("/")) throw new Error(`Logical path must start with /: ${representation.path}`);
    if (representation.path === "/") throw new Error("Logical path / is reserved for the host envelope document.");
    if (paths.has(representation.path)) throw new Error(`Duplicate logical path ${representation.path}.`);
    paths.add(representation.path);
  }

  return { id: envelopeId, conformsTo, manifestGraph, virtualBase: virtualBaseUrl.href, profile, representations };
}

function decodeBase64(source: string): Uint8Array {
  const encoded = source.replace(/[\t\n\f\r ]+/g, "");
  if (!/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(encoded)) {
    throw new Error("The byte carrier is not strict padded base64.");
  }
  const binary = atob(encoded);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

function localCarrierId(carrierIri: string, target: Document): string {
  const carrierUrl = new URL(carrierIri);
  if (!carrierUrl.hash) throw new Error("A HARE carrier IRI must include a fragment.");
  const sourceIri = canonicalIri(target);
  if (carrierUrl.href.replace(/#.*$/, "") !== sourceIri) {
    throw new Error(`A HARE carrier must belong to the envelope source ${sourceIri}.`);
  }
  return decodeURIComponent(carrierUrl.hash.slice(1));
}

function digestBase64(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

export async function verifyHareRepresentation(
  representation: HareByteRepresentation,
  target: Document = document,
): Promise<VerifiedHareRepresentation> {
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

export function getHareDomCarrier(
  representation: HareDomRepresentation,
  target: Document = document,
): HTMLTemplateElement {
  const carrierId = localCarrierId(representation.carrier, target);
  const carrier = target.getElementById(carrierId);
  if (!(carrier instanceof HTMLTemplateElement)) throw new Error(`Missing DOM carrier ${carrierId}.`);
  if (representation.mediaType !== "text/html") throw new Error(`Unsupported DOM media type ${representation.mediaType}.`);
  return carrier;
}
