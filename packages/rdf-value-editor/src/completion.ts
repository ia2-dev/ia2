import { PREFIXES, extractDataset, termToTurtle } from "@ia2-dev/html-rdf";
import type { ObjectTerm, Quad } from "@ia2-dev/html-rdf";

const RDF_TYPE = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type";
const DCTERMS_CREATED = "http://purl.org/dc/terms/created";
const DCTERMS_CONFORMS_TO = "http://purl.org/dc/terms/conformsTo";
const PROV_ENTITY = "http://www.w3.org/ns/prov#Entity";
const PROV_WAS_DERIVED_FROM = "http://www.w3.org/ns/prov#wasDerivedFrom";
const XSD_DATE_TIME = "http://www.w3.org/2001/XMLSchema#dateTime";
const XSD_STRING = "http://www.w3.org/2001/XMLSchema#string";
export const COMPLETION_VALUES_PROFILE =
  "https://ia2.dev/spec/html-rdf#completion-values-profile";

export type CompletionFormat = "html" | "turtle";

export interface CompletionRecord {
  label: string;
  object: CompletionStatement["object"];
  predicate: string;
  subject: string;
}

export interface CompletionDocument {
  createdAt: string;
  records: CompletionRecord[];
  sourceDocumentIri: string;
  stateIri: string;
  title: string;
}

export interface ParsedCompletionDocument {
  issues: string[];
  sourceDocumentIris: string[];
  statements: CompletionStatement[];
}

export interface CompletionStatement {
  object: {
    datatype?: string;
    direction?: "ltr" | "rtl";
    language?: string;
    termType: "Literal" | "NamedNode";
    value: string;
  };
  predicate: string;
  subject: string;
}

export interface ParseCompletionOptions {
  baseIri: string;
  contentType?: string;
  document: Document;
}

function escapedHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function literalTerm(object: CompletionStatement["object"]): ObjectTerm {
  return {
    termType: "Literal",
    value: object.value,
    datatype: {
      termType: "NamedNode",
      value: object.datatype ?? XSD_STRING,
    },
    language: object.language ?? "",
    ...(object.direction ? { direction: object.direction } : {}),
  };
}

function turtleRecord(record: CompletionRecord): string {
  const subject = termToTurtle({ termType: "NamedNode", value: record.subject });
  const predicate = termToTurtle({ termType: "NamedNode", value: record.predicate });
  const object = record.object.termType === "NamedNode"
    ? termToTurtle({ termType: "NamedNode", value: record.object.value })
    : termToTurtle(literalTerm(record.object));
  return `${subject} ${predicate} ${object} .`;
}

function serializeTurtle(document: CompletionDocument): string {
  const state = termToTurtle({ termType: "NamedNode", value: document.stateIri });
  const source = termToTurtle({
    termType: "NamedNode",
    value: document.sourceDocumentIri,
  });
  const created = termToTurtle({
    termType: "Literal",
    value: document.createdAt,
    datatype: { termType: "NamedNode", value: XSD_DATE_TIME },
    language: "",
  });
  return [
    ...Object.entries(PREFIXES).map(([prefix, namespace]) => (
      `@prefix ${prefix}: <${namespace}> .`
    )),
    "",
    `${state} rdf:type prov:Entity ;`,
    `  prov:wasDerivedFrom ${source} ;`,
    `  dcterms:conformsTo <${COMPLETION_VALUES_PROFILE}> ;`,
    `  dcterms:created ${created} .`,
    "",
    ...document.records.map(turtleRecord),
    "",
  ].join("\n");
}

function htmlRecord(record: CompletionRecord): string {
  const subject = escapedHtml(record.subject);
  const predicate = escapedHtml(record.predicate);
  const label = escapedHtml(record.label);
  const object = escapedHtml(record.object.value);
  const carrier = record.object.termType === "NamedNode"
    ? `<a href="${object}" rdf-subject="${subject}" rdf-predicate="${predicate}">${object}</a>`
    : record.object.language
      ? `<span lang="${escapedHtml(record.object.language)}"${record.object.direction ? ` dir="${record.object.direction}"` : ""} rdf-subject="${subject}" rdf-predicate="${predicate}">${object}</span>`
      : `<data value="${object}" rdf-subject="${subject}" rdf-predicate="${predicate}"${record.object.datatype ? ` rdf-datatype="${escapedHtml(record.object.datatype)}"` : ""}>${object}</data>`;
  return `<tr><th scope="row">${label}</th><td>${carrier}</td></tr>`;
}

function serializeHtml(document: CompletionDocument): string {
  const title = escapedHtml(document.title);
  const source = escapedHtml(document.sourceDocumentIri);
  const state = escapedHtml(document.stateIri);
  const created = escapedHtml(document.createdAt);
  const rows = document.records.length > 0
    ? document.records.map(htmlRecord).join("\n          ")
    : '<tr><td colspan="2">No accepted values were saved.</td></tr>';
  return `<!doctype html>
<html lang="en" rdf-version="1.2">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <style>
    :root { color-scheme: light; font-family: "Avenir Next", Avenir, "Segoe UI", sans-serif; }
    body { background: oklch(96% 0.012 80); color: oklch(24% 0.025 286); margin: 0; padding: clamp(1rem, 5vw, 4rem); }
    main { background: oklch(99% 0.006 80); border: 1px solid oklch(84% 0.025 80); box-shadow: 0 18px 48px oklch(25% 0.02 286 / 12%); margin: auto; max-width: 52rem; padding: clamp(1.3rem, 5vw, 3.5rem); }
    .kicker { color: oklch(48% 0.16 294); font-size: .72rem; font-weight: 750; letter-spacing: .08em; text-transform: uppercase; }
    h1 { font-family: Georgia, "Times New Roman", serif; font-size: clamp(1.8rem, 5vw, 3rem); line-height: 1.05; margin: .45rem 0 1rem; }
    .source { color: oklch(46% 0.025 286); line-height: 1.55; }
    table { border-collapse: collapse; margin-top: 2rem; width: 100%; }
    th, td { border-top: 1px solid oklch(86% 0.02 80); padding: .8rem .35rem; text-align: left; vertical-align: top; }
    th { font-size: .78rem; width: 42%; }
    td { font-family: Georgia, "Times New Roman", serif; overflow-wrap: anywhere; }
    a { color: oklch(44% 0.15 294); }
    footer { color: oklch(50% 0.02 286); font-size: .7rem; margin-top: 2rem; }
  </style>
</head>
<body>
  <main>
    <p class="kicker">RDF completion values</p>
    <h1>${title}</h1>
    <p class="source">Values for <a href="${source}" rdf-subject="${state}" rdf-predicate="${PROV_WAS_DERIVED_FROM}">${source}</a></p>
    <a hidden href="${PROV_ENTITY}" rdf-subject="${state}" rdf-predicate="${RDF_TYPE}"></a>
    <a hidden href="${COMPLETION_VALUES_PROFILE}" rdf-subject="${state}" rdf-predicate="${DCTERMS_CONFORMS_TO}"></a>
    <time hidden datetime="${created}" rdf-subject="${state}" rdf-predicate="${DCTERMS_CREATED}" rdf-datatype="${XSD_DATE_TIME}">${created}</time>
    <table>
      <tbody>
          ${rows}
      </tbody>
    </table>
    <footer>Saved ${created}. This companion contains accepted values, not the source document.</footer>
  </main>
</body>
</html>
`;
}

export function serializeCompletionDocument(
  document: CompletionDocument,
  format: CompletionFormat,
): string {
  return format === "html" ? serializeHtml(document) : serializeTurtle(document);
}

function statementFromQuad(quad: Pick<Quad, "subject" | "predicate" | "object">):
CompletionStatement | undefined {
  if (quad.subject.termType !== "NamedNode" || quad.object.termType === "Triple") return undefined;
  if (quad.object.termType !== "NamedNode" && quad.object.termType !== "Literal") return undefined;
  return {
    subject: quad.subject.value,
    predicate: quad.predicate.value,
    object: quad.object.termType === "NamedNode"
      ? { termType: "NamedNode", value: quad.object.value }
      : {
          termType: "Literal",
          value: quad.object.value,
          datatype: quad.object.datatype.value,
          ...(quad.object.language ? { language: quad.object.language } : {}),
          ...(quad.object.direction ? { direction: quad.object.direction } : {}),
        },
  };
}

function isHtml(contentType: string | undefined, source: string): boolean {
  if (contentType?.toLowerCase().includes("html")) return true;
  return /^\s*(?:<!doctype\s+html|<html\b)/i.test(source);
}

function completionEntityIris(statements: readonly CompletionStatement[]): string[] {
  const entities = new Set(statements.flatMap((statement) => (
    statement.predicate === RDF_TYPE
    && statement.object.termType === "NamedNode"
    && statement.object.value === PROV_ENTITY
      ? [statement.subject]
      : []
  )));
  return Array.from(entities).filter((subject) => statements.some((statement) => (
    statement.subject === subject
    && statement.predicate === PROV_WAS_DERIVED_FROM
    && statement.object.termType === "NamedNode"
  )) && statements.some((statement) => (
    statement.subject === subject
    && statement.predicate === DCTERMS_CONFORMS_TO
    && statement.object.termType === "NamedNode"
    && statement.object.value === COMPLETION_VALUES_PROFILE
  )));
}

export async function parseCompletionDocument(
  source: string,
  options: ParseCompletionOptions,
): Promise<ParsedCompletionDocument> {
  if (isHtml(options.contentType, source)) {
    const Parser = options.document.defaultView?.DOMParser;
    if (!Parser) throw new Error("This browser does not provide an HTML parser.");
    const parsed = new Parser().parseFromString(source, "text/html");
    const result = extractDataset(parsed);
    const runtimeCarriers = Array.from(
      parsed.querySelectorAll<HTMLElement>("[data-ia2-rdf-value-editor-runtime]"),
    );
    if (runtimeCarriers.length > 0) {
      const runtimes = runtimeCarriers.map((carrier) => extractDataset(carrier));
      return {
        issues: runtimes.flatMap(({ diagnostics }) => diagnostics)
          .filter(({ severity }) => severity === "error")
          .map(({ message }) => message),
        sourceDocumentIris: Array.from(new Set(
          runtimes.map(({ sourceDocumentIri }) => sourceDocumentIri),
        )),
        statements: runtimes.flatMap(({ quads }) => quads)
          .map(statementFromQuad)
          .filter((statement): statement is CompletionStatement => Boolean(statement)),
      };
    }
    const statements = result.quads
      .map(statementFromQuad)
      .filter((statement): statement is CompletionStatement => Boolean(statement));
    const stateIris = completionEntityIris(statements);
    const issues = result.diagnostics
        .filter(({ severity }) => severity === "error")
        .map(({ message }) => message);
    if (stateIris.length !== 1) {
      issues.push(
        `A values document must identify exactly one prov:Entity derived from its source and conforming to ${COMPLETION_VALUES_PROFILE}.`,
      );
    }
    return {
      issues,
      sourceDocumentIris: statements.flatMap((statement) => (
        stateIris.includes(statement.subject)
        && statement.predicate === PROV_WAS_DERIVED_FROM
        && statement.object.termType === "NamedNode"
          ? [statement.object.value]
          : []
      )),
      statements,
    };
  }

  const { Parser } = await import("n3");
  const parser = new Parser({
    baseIRI: options.baseIri,
    ...(options.contentType ? { format: options.contentType } : {}),
  });
  const statements = parser.parse(source).flatMap((quad) => {
    const statement = statementFromQuad(quad as unknown as Quad);
    return statement ? [statement] : [];
  });
  const stateIris = completionEntityIris(statements);
  const issues = stateIris.length === 1
    ? []
    : [
        `A values document must identify exactly one prov:Entity derived from its source and conforming to ${COMPLETION_VALUES_PROFILE}.`,
      ];
  return {
    issues,
    sourceDocumentIris: statements.flatMap((statement) => (
      stateIris.includes(statement.subject)
      && statement.predicate === PROV_WAS_DERIVED_FROM
      && statement.object.termType === "NamedNode"
        ? [statement.object.value]
        : []
    )),
    statements,
  };
}
