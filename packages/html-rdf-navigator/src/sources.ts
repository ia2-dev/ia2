import type {
  Diagnostic,
  ExtractionResult,
  GraphTerm,
  NamedNode,
  ObjectTerm,
  SubjectTerm,
} from "./model.js";

export type NavigatorSourceAccess = "direct" | "portable";

export interface NavigatorSource {
  access: NavigatorSourceAccess;
  id: string;
  label: string;
  origin: string;
  result: ExtractionResult;
  url: string;
}

export interface PortableSourceElement {
  id: string;
  markup: string;
}

export interface PortableQuad {
  graph: GraphTerm | null;
  object: ObjectTerm;
  predicate: NamedNode;
  sourceId: string;
  subject: SubjectTerm;
}

export interface PortableDiagnostic extends Omit<Diagnostic, "source"> {
  sourceId?: string;
}

export interface PortableExtractionResult extends Omit<ExtractionResult, "diagnostics" | "quads"> {
  diagnostics: PortableDiagnostic[];
  portableVersion: 1;
  quads: PortableQuad[];
  sources: PortableSourceElement[];
}

export interface PortableNavigatorSource extends Omit<NavigatorSource, "access" | "result"> {
  access: "portable";
  result: PortableExtractionResult;
}

function sourceIdFor(
  source: Element,
  ids: Map<Element, string>,
  sources: PortableSourceElement[],
): string {
  const existing = ids.get(source);
  if (existing) return existing;
  const id = `source-${ids.size + 1}`;
  ids.set(source, id);
  sources.push({ id, markup: source.outerHTML });
  return id;
}

/** Convert an extraction result to structured-clone-safe data for extension frame boundaries. */
export function toPortableExtractionResult(result: ExtractionResult): PortableExtractionResult {
  const ids = new Map<Element, string>();
  const sources: PortableSourceElement[] = [];
  return {
    baseIri: result.baseIri,
    diagnostics: result.diagnostics.map((diagnostic) => ({
      code: diagnostic.code,
      message: diagnostic.message,
      severity: diagnostic.severity,
      ...(diagnostic.source ? { sourceId: sourceIdFor(diagnostic.source, ids, sources) } : {}),
    })),
    graphs: result.graphs,
    portableVersion: 1,
    quads: result.quads.map((quad) => ({
      graph: quad.graph,
      object: quad.object,
      predicate: quad.predicate,
      sourceId: sourceIdFor(quad.source, ids, sources),
      subject: quad.subject,
    })),
    retrievalDocumentIri: result.retrievalDocumentIri,
    sourceDocumentIri: result.sourceDocumentIri,
    sources,
    version: "1.2",
  };
}

function inertSourceElement(markup: string, ownerDocument: Document): Element {
  const inertDocument = ownerDocument.implementation.createHTMLDocument("");
  const template = inertDocument.createElement("template");
  template.innerHTML = markup;
  return template.content.firstElementChild ?? inertDocument.createElement("span");
}

/** Rehydrate portable data with inert carrier elements for source-code display. */
export function fromPortableExtractionResult(
  result: PortableExtractionResult,
  ownerDocument: Document,
): ExtractionResult {
  if (result.portableVersion !== 1 || result.version !== "1.2") {
    throw new Error("Unsupported portable Navigator source version.");
  }
  const elements = new Map(result.sources.map((source) => [source.id, inertSourceElement(source.markup, ownerDocument)]));
  const sourceFor = (sourceId: string): Element => elements.get(sourceId) ?? inertSourceElement("<span></span>", ownerDocument);
  return {
    baseIri: result.baseIri,
    diagnostics: result.diagnostics.map((diagnostic) => ({
      code: diagnostic.code,
      message: diagnostic.message,
      severity: diagnostic.severity,
      ...(diagnostic.sourceId ? { source: sourceFor(diagnostic.sourceId) } : {}),
    })),
    graphs: result.graphs,
    quads: result.quads.map((quad) => ({
      graph: quad.graph,
      object: quad.object,
      predicate: quad.predicate,
      source: sourceFor(quad.sourceId),
      subject: quad.subject,
    })),
    retrievalDocumentIri: result.retrievalDocumentIri,
    sourceDocumentIri: result.sourceDocumentIri,
    version: "1.2",
  };
}
