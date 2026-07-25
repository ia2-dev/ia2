import { QueryEngine } from "@comunica/query-sparql-rdfjs-lite";
import { toRdfJsQuad } from "@ia2-dev/html-rdf";
import type * as RDF from "@rdfjs/types";
import { DataFactory, Store } from "n3";
import { Parser } from "sparqljs";
import type { ExtractionResult } from "./model.js";

const factory = DataFactory as unknown as RDF.DataFactory;

export interface SparqlResultTerm {
  datatype?: string;
  direction?: string;
  language?: string;
  termType: string;
  value: string;
}

export type SparqlExecutionResult =
  | { kind: "ask"; value: boolean }
  | { kind: "bindings"; rows: Array<Record<string, SparqlResultTerm>>; variables: string[] }
  | { kind: "quads"; quads: Array<{ graph: SparqlResultTerm; object: SparqlResultTerm; predicate: SparqlResultTerm; subject: SparqlResultTerm }> };

function toResultTerm(term: RDF.Term): SparqlResultTerm {
  const result: SparqlResultTerm = { termType: term.termType, value: term.value };
  if (term.termType === "Literal") {
    result.datatype = term.datatype.value;
    if (term.language) result.language = term.language;
    if (term.direction) result.direction = term.direction;
  }
  if (term.termType === "Quad") {
    result.value = `<<${termToDisplay(term.subject)} ${termToDisplay(term.predicate)} ${termToDisplay(term.object)}>>`;
  }
  return result;
}

function termToDisplay(term: RDF.Term): string {
  if (term.termType === "NamedNode") return `<${term.value}>`;
  if (term.termType === "BlankNode") return `_:${term.value}`;
  if (term.termType === "Variable") return `?${term.value}`;
  if (term.termType === "DefaultGraph") return "default graph";
  if (term.termType === "Quad") return `<<${termToDisplay(term.subject)} ${termToDisplay(term.predicate)} ${termToDisplay(term.object)}>>`;
  const suffix = term.language
    ? `@${term.language}${term.direction ? `--${term.direction}` : ""}`
    : `^^<${term.datatype.value}>`;
  return `${JSON.stringify(term.value)}${suffix}`;
}

function datasetFor(result: ExtractionResult): Store {
  const store = new Store();
  for (const quad of result.quads) {
    store.addQuad(toRdfJsQuad(quad, factory) as never);
  }
  return store;
}

async function collect<T>(stream: AsyncIterable<T>): Promise<T[]> {
  const items: T[] = [];
  for await (const item of stream) {
    items.push(item);
  }
  return items;
}

/** Execute one read-only SPARQL query against the currently extracted RDF/JS dataset. */
export async function executeSparql(queryText: string, result: ExtractionResult): Promise<SparqlExecutionResult> {
  const parsed = new Parser({
    baseIRI: result.sourceDocumentIri,
    factory,
    sparqlStar: true,
  }).parse(queryText);
  if (parsed.type === "update") {
    throw new Error("SPARQL Update is disabled. Navigator queries are read-only because the document remains the source of truth.");
  }
  const engine = new QueryEngine();
  const query = await engine.query(queryText, {
    baseIRI: result.sourceDocumentIri,
    readOnly: true,
    sources: [datasetFor(result)],
  });

  if (query.resultType === "void") {
    throw new Error("SPARQL Update is disabled. Navigator queries are read-only because the document remains the source of truth.");
  }
  if (query.resultType === "boolean") {
    return { kind: "ask", value: await query.execute() };
  }
  if (query.resultType === "quads") {
    const items = await collect(await query.execute());
    return {
      kind: "quads",
      quads: items.map((quad) => ({
        graph: toResultTerm(quad.graph),
        object: toResultTerm(quad.object),
        predicate: toResultTerm(quad.predicate),
        subject: toResultTerm(quad.subject),
      })),
    };
  }

  const metadata = await query.metadata();
  const variables = metadata.variables.map((variable) => variable.value);
  const items = await collect(await query.execute());
  const rows = items.map((bindings) => {
    const row: Record<string, SparqlResultTerm> = {};
    for (const [variable, term] of bindings) row[variable.value] = toResultTerm(term);
    return row;
  });
  return { kind: "bindings", rows, variables };
}
