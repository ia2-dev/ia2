import { describe, expect, it } from "vitest";
import { extractDataset } from "@ia2-dev/html-rdf";
import {
  extractSuggestedSparqlQueryCatalog,
} from "../src/suggested-queries.js";

function catalog(body: string) {
  document.documentElement.setAttribute("rdf-version", "1.2");
  document.head.innerHTML = '<link rel="canonical" href="https://example.test/dashboard">';
  document.body.innerHTML = body;
  return extractSuggestedSparqlQueryCatalog(extractDataset(document));
}

describe("document-authored SPARQL query catalogs", () => {
  it("diagnoses executable resources with competing query bodies", () => {
    const result = catalog(`
      <a href="http://www.w3.org/ns/shacl#SPARQLExecutable"
         rdf-subject="#query"
         rdf-predicate="http://www.w3.org/1999/02/22-rdf-syntax-ns#type"></a>
      <pre rdf-subject="#query" rdf-predicate="http://www.w3.org/ns/shacl#select">SELECT * WHERE { ?s ?p ?o }</pre>
      <pre rdf-subject="#query" rdf-predicate="http://www.w3.org/ns/shacl#ask">ASK { ?s ?p ?o }</pre>
    `);
    expect(result.queries).toEqual([]);
    expect(result.diagnostics).toEqual([
      "Query must declare exactly one sh:select, sh:ask, or sh:construct query.",
    ]);
  });

  it("gives blank-node executable resources content-stable identifiers", () => {
    const markup = `
      <a href="http://www.w3.org/ns/shacl#SPARQLExecutable"
         rdf-subject-key="query"
         rdf-predicate="http://www.w3.org/1999/02/22-rdf-syntax-ns#type"></a>
      <pre rdf-subject-key="query" rdf-predicate="http://www.w3.org/ns/shacl#select">SELECT * WHERE { ?s ?p ?o }</pre>
    `;
    expect(catalog(markup).queries[0]?.id).toBe(catalog(markup).queries[0]?.id);
    expect(catalog(markup).queries[0]?.id).toMatch(/^BlankNodeQuery:/);
  });
});
