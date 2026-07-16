import type { HareEnvelope, HareRepresentation } from "./model.js";

export type HareNavigationTarget =
  | { kind: "representation"; representation: HareRepresentation; fragment: string | null }
  | { kind: "host"; fragment: string | null }
  | { kind: "external"; url: string }
  | { kind: "blocked"; reason: string };

function decodedFragment(url: URL): string | null {
  if (!url.hash) return null;
  try {
    return decodeURIComponent(url.hash.slice(1));
  } catch {
    return url.hash.slice(1);
  }
}

function withoutFragment(url: URL): string {
  const copy = new URL(url);
  copy.hash = "";
  return copy.href;
}

function isAbsoluteReference(reference: string): boolean {
  return /^[A-Za-z][A-Za-z0-9+.-]*:/.test(reference) || reference.startsWith("//");
}

export function hareRepresentationUrl(envelope: HareEnvelope, representation: HareRepresentation): string | null {
  return representation.path === null ? null : new URL(representation.path, envelope.virtualBase).href;
}

export function resolveHareNavigation(
  envelope: HareEnvelope,
  current: HareRepresentation,
  reference: string,
): HareNavigationTarget {
  const value = reference.trim();
  if (value === "" || value.startsWith("#")) {
    let fragment: string | null = null;
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
      reason: "This representation has no logical path, so its relative link has no virtual base.",
    };
  }

  let target: URL;
  try {
    const base = current.path === null ? envelope.virtualBase : hareRepresentationUrl(envelope, current)!;
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
    const representation = envelope.representations.find((candidate) => (
      hareRepresentationUrl(envelope, candidate) === withoutFragment(target)
    ));
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
