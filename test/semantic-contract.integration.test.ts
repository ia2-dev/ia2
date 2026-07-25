import { describe, expect, it } from "vitest";
import { extractDataset } from "@ia2-dev/html-rdf";
import { executeSparql } from "../packages/html-rdf-navigator/src/sparql-engine.js";
import { extractSuggestedSparqlQueries } from "../packages/html-rdf-navigator/src/suggested-queries.js";
// @ts-expect-error Vitest supplies Vite's raw-fixture import during tests.
import assignmentHtml from "../specs/rdf-html/examples/sources/assignment.html?raw";
// @ts-expect-error Vitest supplies Vite's raw-fixture import during tests.
import reviewHtml from "../specs/rdf-html/examples/sources/assignment-review.html?raw";

const CONTRACT = "https://ia2.dev/spec/rdf-html/examples/sources/assignment.html";
const REVIEW = "https://ia2.dev/spec/rdf-html/examples/sources/assignment-review.html";
const RDF = "http://www.w3.org/1999/02/22-rdf-syntax-ns#";
const OA = "http://www.w3.org/ns/oa#";
const AS = "http://www.w3.org/ns/activitystreams#";
const FIBO_CONTRACTS = "https://spec.edmcouncil.org/fibo/ontology/FND/Agreements/Contracts/";
const FIBO_AGREEMENTS = "https://spec.edmcouncil.org/fibo/ontology/FND/Agreements/Agreements/";
const FIBO_CAPACITY = "https://spec.edmcouncil.org/fibo/ontology/FND/Law/LegalCapacity/";
const FIBO_RELATIONS = "https://spec.edmcouncil.org/fibo/ontology/FND/Relations/Relations/";
const SHACL = "http://www.w3.org/ns/shacl#";
const SCHEMA = "https://schema.org/";
const PROV = "http://www.w3.org/ns/prov#";
const DOCO = "http://purl.org/spar/doco/";
const CMI = "https://ontology.inferal.com/modules/company-intelligence/";
const DCTERMS_RELATION = "http://purl.org/dc/terms/relation";

function extract(source: string, url: string) {
  const page = new DOMParser().parseFromString(source, "text/html");
  Object.defineProperty(page, "URL", { configurable: true, value: url });
  return { page, result: extractDataset(page) };
}

describe("separate assignment and counsel-review examples", () => {
  it("keeps the customer contract free of review content and review RDF", () => {
    const { page, result } = extract(assignmentHtml, CONTRACT);
    expect(result.diagnostics).toEqual([]);
    expect(page.querySelectorAll(".review-note, .review-brief, [rdf-graph=\"#review-graph\"]")).toHaveLength(0);
    expect(page.body.textContent).not.toContain("Question for counsel");
    expect(page.querySelector<HTMLAnchorElement>(
      'nav[aria-label="Document views and related material"] a[href="assignment-review.html"]',
    )?.textContent?.trim()).toBe("Legal review");
    expect(result.quads.some((quad) => (
      quad.subject.termType === "NamedNode"
      && quad.subject.value === CONTRACT
      && quad.predicate.value === DCTERMS_RELATION
      && quad.object.termType === "NamedNode"
      && quad.object.value === REVIEW
      && quad.graph?.value === `${CONTRACT}#artifact-graph`
    ))).toBe(true);

    const graphs = new Set(result.quads.flatMap((quad) => (
      quad.graph?.termType === "NamedNode" ? [quad.graph.value] : []
    )));
    expect(graphs).toEqual(new Set([
      `${CONTRACT}#artifact-graph`,
      `${CONTRACT}#claim-graph`,
      `${CONTRACT}#contract-graph`,
      `${CONTRACT}#meaning-graph`,
      `${CONTRACT}#query-graph`,
      `${CONTRACT}#structure-graph`,
      `${CONTRACT}#template-graph`,
      `${CONTRACT}#vocabulary-graph`,
    ]));
  });

  it("derives displayed ordinals from document structure instead of clause identity", () => {
    const { page } = extract(assignmentHtml, CONTRACT);
    const sectionStarts = Array.from(page.querySelectorAll<HTMLElement>(
      "#contract-sections > .clause[data-section-start]",
    ));
    const sectionHeadings = Array.from(page.querySelectorAll<HTMLElement>(
      "#contract-sections h2[data-section-heading]",
    ));
    const subsectionHeadings = Array.from(page.querySelectorAll<HTMLElement>(
      "#contract-sections h3[data-subsection]",
    ));
    const styles = Array.from(page.querySelectorAll("style"))
      .map((style) => style.textContent ?? "")
      .join("\n");

    expect(sectionStarts).toHaveLength(8);
    expect(sectionHeadings).toHaveLength(8);
    expect(subsectionHeadings).toHaveLength(16);
    expect(page.querySelectorAll("#contract-sections .number")).toHaveLength(0);
    expect([...sectionHeadings, ...subsectionHeadings].every((heading) => (
      !/^\s*\d/.test(heading.textContent ?? "")
    ))).toBe(true);
    expect(styles).toContain("counter-increment: contract-section");
    expect(styles).toContain("counter-set: contract-subsection 0");
    expect(styles).toContain('content: counter(contract-section) ". "');
    expect(styles).toContain(
      'content: counter(contract-section) "." counter(contract-subsection) " "',
    );
  });

  it("publishes review as a separate annotation collection targeting the contract", () => {
    const { page, result } = extract(reviewHtml, REVIEW);
    expect(result.diagnostics).toEqual([]);
    expect(page.querySelectorAll(".annotation")).toHaveLength(21);
    expect(page.body.textContent).not.toMatch(/\bSections?\s+\d/i);
    for (const target of page.querySelectorAll<HTMLAnchorElement>(".annotation-target a")) {
      expect(target.href).toContain("assignment.html#");
      expect(target.textContent).not.toMatch(/^\s*Sections?\s+\d/i);
    }

    const graphs = new Set(result.quads.flatMap((quad) => (
      quad.graph?.termType === "NamedNode" ? [quad.graph.value] : []
    )));
    expect(graphs).toEqual(new Set([
      `${REVIEW}#artifact-graph`,
      `${REVIEW}#policy-graph`,
      `${REVIEW}#review-graph`,
    ]));

    const annotations = result.quads.filter((quad) => (
      quad.predicate.value === `${RDF}type`
      && quad.object.termType === "NamedNode"
      && quad.object.value === `${OA}Annotation`
      && quad.graph?.value === `${REVIEW}#review-graph`
    ));
    expect(annotations).toHaveLength(28);
    expect(result.quads.some((quad) => (
      quad.subject.value === `${REVIEW}#review-collection`
      && quad.predicate.value === `${AS}first`
      && quad.object.termType === "NamedNode"
      && quad.object.value === `${REVIEW}#review-page-1`
    ))).toBe(true);
    expect(result.quads.some((quad) => (
      quad.subject.value === `${REVIEW}#review-page-1`
      && quad.predicate.value === `${RDF}type`
      && quad.object.termType === "NamedNode"
      && quad.object.value === `${OA}AnnotationPage`
    ))).toBe(true);
    const pageItems = result.quads.find((quad) => (
      quad.subject.value === `${REVIEW}#review-page-1`
      && quad.predicate.value === `${AS}items`
    ))?.object;
    const orderedItems: string[] = [];
    let cursor = pageItems?.termType === "NamedNode" ? pageItems.value : undefined;
    while (cursor && cursor !== `${RDF}nil`) {
      const first = result.quads.find((quad) => (
        quad.subject.value === cursor && quad.predicate.value === `${RDF}first`
      ))?.object;
      const rest = result.quads.find((quad) => (
        quad.subject.value === cursor && quad.predicate.value === `${RDF}rest`
      ))?.object;
      if (first?.termType !== "NamedNode" || rest?.termType !== "NamedNode") break;
      orderedItems.push(first.value);
      cursor = rest.value;
    }
    expect(orderedItems).toHaveLength(28);
    expect(orderedItems[0]).toBe(`${REVIEW}#review-request`);
    expect(orderedItems.at(-1)).toBe(`${REVIEW}#review-note-20`);

    for (let index = 0; index <= 20; index += 1) {
      const subject = `${REVIEW}#review-note-${index}`;
      expect(result.quads.some((quad) => (
        quad.subject.termType === "NamedNode"
        && quad.subject.value === subject
        && quad.predicate.value === `${OA}hasTarget`
        && quad.object.termType === "NamedNode"
        && quad.object.value.startsWith(`${CONTRACT}#`)
        && quad.graph?.value === `${REVIEW}#review-graph`
      ))).toBe(true);
    }

    expect(result.quads.some((quad) => (
      quad.subject.termType === "NamedNode"
      && quad.subject.value === REVIEW
      && quad.predicate.value === "http://purl.org/dc/terms/references"
      && quad.object.termType === "NamedNode"
      && quad.object.value === CONTRACT
    ))).toBe(true);
  });

  it("keeps executable counsel policy external to the customer document", () => {
    const { page: contractPage } = extract(assignmentHtml, CONTRACT);
    const { page: reviewPage, result } = extract(reviewHtml, REVIEW);

    expect(contractPage.querySelector("#counsel-policy")).toBeNull();
    expect(reviewPage.querySelector("ia2-rdf-policy-reviewer")).not.toBeNull();
    expect(reviewPage.querySelector<HTMLIFrameElement>("#contract-under-review")
      ?.getAttribute("src")).toBe("assignment.html");
    expect(reviewPage.querySelectorAll(
      '#counsel-policy [rdf-predicate="http://www.w3.org/ns/shacl#sparql"]',
    )).toHaveLength(4);
    expect(reviewPage.querySelectorAll(
      '#counsel-policy [rdf-predicate="http://www.w3.org/ns/shacl#minCount"]',
    )).toHaveLength(4);
    expect(result.quads.some((quad) => (
      quad.subject.value === `${REVIEW}#policy-release-paid-shape`
      && quad.predicate.value === `${SHACL}severity`
      && quad.object.termType === "NamedNode"
      && quad.object.value === `${SHACL}Violation`
      && quad.graph?.value === `${REVIEW}#policy-graph`
    ))).toBe(true);
    expect(result.quads.some((quad) => (
      quad.subject.value === `${REVIEW}#policy-release-paid-presentation`
      && quad.predicate.value === `${OA}hasBody`
      && quad.object.termType === "NamedNode"
      && quad.object.value === `${REVIEW}#policy-release-paid-shape`
    ))).toBe(true);
    expect(result.quads.some((quad) => (
      quad.subject.value === `${REVIEW}#policy-release-paid-presentation`
      && quad.predicate.value === `${OA}hasTarget`
      && quad.object.termType === "NamedNode"
      && quad.object.value === `${CONTRACT}#clause-conditions`
    ))).toBe(true);
  });

  it("makes every linked contract target resolvable and visibly identifiable", () => {
    const { page: contractPage } = extract(assignmentHtml, CONTRACT);
    const { page: reviewPage } = extract(reviewHtml, REVIEW);
    const targetLinks = Array.from(reviewPage.querySelectorAll<HTMLAnchorElement>(
      'a[href^="assignment.html#"]',
    )).filter((link) => !link.closest("#counsel-policy"));
    const styles = Array.from(contractPage.querySelectorAll("style"))
      .map((style) => style.textContent ?? "")
      .join("\n");

    expect(targetLinks.length).toBeGreaterThan(0);
    for (const link of targetLinks) {
      const fragment = new URL(link.getAttribute("href")!, REVIEW).hash.slice(1);
      expect(contractPage.getElementById(fragment), `Missing contract target #${fragment}`)
        .not.toBeNull();
    }
    expect(styles).toContain(".legal-surface :target");
    expect(styles).toContain("scroll-margin-top: 5.5rem");
    expect(styles).toContain("@keyframes referenced-target-arrival");
    expect(styles).toContain(".legal-surface :target { animation: none; }");
  });

  it("separates operative FIBO facts from completion fields and unresolved choices", () => {
    const { result } = extract(assignmentHtml, CONTRACT);
    const agreement = `${CONTRACT}#assignment-agreement`;
    const types = result.quads.flatMap((quad) => (
      quad.subject.termType === "NamedNode"
      && quad.subject.value === agreement
      && quad.predicate.value === `${RDF}type`
      && quad.object.termType === "NamedNode"
        ? [quad.object.value]
        : []
    ));

    expect(types).toEqual(expect.arrayContaining([
      `${FIBO_CONTRACTS}WrittenContract`,
      `${FIBO_CONTRACTS}MultilateralContract`,
    ]));
    expect(result.quads.some((quad) => (
      quad.subject.termType === "NamedNode"
      && quad.subject.value === agreement
      && quad.predicate.value === `${FIBO_CONTRACTS}hasEffectiveDate`
    ))).toBe(false);

    const effectiveDateField = `${CONTRACT}#effective-date-field`;
    expect(result.quads).toEqual(expect.arrayContaining([
      expect.objectContaining({
        subject: expect.objectContaining({ value: effectiveDateField }),
        predicate: expect.objectContaining({ value: `${RDF}type` }),
        object: expect.objectContaining({ value: `${SHACL}PropertyShape` }),
        graph: expect.objectContaining({ value: `${CONTRACT}#template-graph` }),
      }),
      expect.objectContaining({
        subject: expect.objectContaining({ value: effectiveDateField }),
        predicate: expect.objectContaining({ value: `${RDF}type` }),
        object: expect.objectContaining({ value: `${SCHEMA}PropertyValueSpecification` }),
        graph: expect.objectContaining({ value: `${CONTRACT}#template-graph` }),
      }),
    ]));

    expect(result.quads.some((quad) => (
      quad.subject.termType === "NamedNode"
      && quad.subject.value === `${CONTRACT}#billing-transition-days-field`
      && quad.predicate.value === `${SHACL}defaultValue`
      && quad.object.termType === "Literal"
      && quad.object.value === "10"
      && quad.graph?.value === `${CONTRACT}#template-graph`
    ))).toBe(true);
    expect(result.quads.some((quad) => (
      quad.subject.termType === "NamedNode"
      && quad.subject.value === `${CONTRACT}#counterparty`
      && quad.predicate.value === `${SCHEMA}legalName`
      && quad.graph?.value === `${CONTRACT}#contract-graph`
    ))).toBe(false);

    const releaseDecision = `${CONTRACT}#release-decision`;
    expect(result.quads.some((quad) => (
      quad.subject.termType === "NamedNode"
      && quad.subject.value === releaseDecision
      && quad.predicate.value === `${RDF}type`
      && quad.object.termType === "NamedNode"
      && quad.object.value === `${SCHEMA}ChooseAction`
      && quad.graph?.value === `${CONTRACT}#template-graph`
    ))).toBe(true);
    expect(result.quads.some((quad) => (
      quad.subject.termType === "NamedNode"
      && quad.subject.value === releaseDecision
      && quad.predicate.value === `${SCHEMA}result`
    ))).toBe(false);
  });

  it("publishes queryable legal effects as sourced interpretations of fixed clauses", () => {
    const { result } = extract(assignmentHtml, CONTRACT);
    const meaningGraph = `${CONTRACT}#meaning-graph`;
    const quads = result.quads.filter((quad) => quad.graph?.value === meaningGraph);
    const objects = (subject: string, predicate: string) => quads.flatMap((quad) => (
      quad.subject.value === subject
      && quad.predicate.value === predicate
      && quad.object.termType === "NamedNode"
        ? [quad.object.value]
        : []
    ));

    const annotations = objects(`${CONTRACT}#meaning-graph`, `${RDF}type`).length;
    expect(annotations).toBe(1);

    const interpretationIds = quads.flatMap((quad) => (
      quad.predicate.value === `${RDF}type`
      && quad.object.termType === "NamedNode"
      && quad.object.value === `${OA}Annotation`
        ? [quad.subject.value]
        : []
    ));
    expect(interpretationIds).toHaveLength(18);

    for (const interpretation of interpretationIds) {
      const targets = objects(interpretation, `${OA}hasTarget`);
      const bodies = objects(interpretation, `${OA}hasBody`);
      expect(targets).toHaveLength(1);
      expect(targets[0]).toMatch(new RegExp(`^${CONTRACT.replaceAll(".", "\\.")}#(?:opening|clause-)`));
      expect(bodies.length).toBeGreaterThan(0);
      for (const body of bodies) {
        expect(objects(body, `${PROV}wasDerivedFrom`)).toContain(targets[0]);
      }
    }

    const assigneeObligations = objects(
      `${CONTRACT}#assignee-obligor`,
      `${FIBO_AGREEMENTS}hasObligation`,
    );
    expect(assigneeObligations).toEqual(expect.arrayContaining([
      `${CONTRACT}#assignee-underlying-contract-obligation`,
      `${CONTRACT}#assignee-payment-obligation`,
      `${CONTRACT}#assignee-notification-obligation`,
    ]));

    const assigneePerformancesForCounterparty = new Set(quads.flatMap((quad) => (
      quad.predicate.value === `${SCHEMA}agent`
      && quad.object.termType === "NamedNode"
      && quad.object.value === `${CONTRACT}#assignee`
      && objects(quad.subject.value, `${SCHEMA}recipient`).includes(`${CONTRACT}#counterparty`)
        ? [quad.subject.value]
        : []
    )));
    expect(assigneePerformancesForCounterparty).toEqual(new Set([
      `${CONTRACT}#assignee-underlying-contract-performance`,
      `${CONTRACT}#assignee-payment-performance`,
      `${CONTRACT}#assignee-notification-performance`,
    ]));
    for (const performance of assigneePerformancesForCounterparty) {
      expect(objects(performance, `${FIBO_RELATIONS}isMandatedBy`)).toHaveLength(1);
    }

    expect(objects(
      `${CONTRACT}#paid-amounts-condition-precedent`,
      `${FIBO_CONTRACTS}qualifies`,
    )).toEqual([`${CONTRACT}#counterparty-consent-authorization`]);
    expect(objects(
      `${CONTRACT}#counterparty-consent-authorization`,
      `${SCHEMA}agent`,
    )).toEqual([`${CONTRACT}#counterparty`]);
    expect(objects(
      `${CONTRACT}#assignment-agreement`,
      `${FIBO_CONTRACTS}hasGoverningJurisdiction`,
    )).toEqual([`${CONTRACT}#governing-jurisdiction`]);

    for (const [body, party] of [
      ["assignor-representation-package", "assignor"],
      ["assignee-representation-package", "assignee"],
      ["counterparty-representation-package", "counterparty"],
    ]) {
      expect(objects(`${CONTRACT}#${body}`, `${PROV}wasAttributedTo`))
        .toEqual([`${CONTRACT}#${party}`]);
      expect(objects(`${CONTRACT}#${body}`, `${RDF}type`))
        .toEqual(expect.arrayContaining([
          `${FIBO_CONTRACTS}Representation`,
          `${FIBO_CONTRACTS}Warranty`,
        ]));
    }

    for (const legacyPredicate of [
      "transfersRightsTo",
      "transfersRight",
      "delegatesObligationsTo",
      "delegatesObligation",
      "consentsTo",
    ]) {
      expect(result.quads.some((quad) => quad.predicate.value === `${CONTRACT}#${legacyPredicate}`))
        .toBe(false);
    }
  });

  it("publishes an ordered SHACL query catalog over the contract semantics", () => {
    const { result } = extract(assignmentHtml, CONTRACT);
    const queries = extractSuggestedSparqlQueries(result);

    expect(queries.map(({ label }) => label)).toEqual([
      "Who are the parties?",
      "Who must do what for whom?",
      "Which rights are conditional?",
      "What does each party represent?",
    ]);
    expect(queries.every(({ kind, query }) => (
      kind === "select"
      && query.startsWith("PREFIX")
      && query.includes("\n")
      && /GRAPH\s+\?\w+/.test(query)
    ))).toBe(true);
    const partiesQuery = queries.find(({ label }) => label === "Who are the parties?")!;
    expect(partiesQuery.query).toContain("documents:records ?contract");
    expect(partiesQuery.query).toContain("contracts:hasContractParty ?roleResource");
    expect(partiesQuery.query).toContain("rdfs:subClassOf* contracts:ContractParty");
    expect(partiesQuery.query).not.toContain("#assignment-assignor-role");
    expect(partiesQuery.query).not.toContain("#assignment-assignee-role");
    expect(partiesQuery.query).not.toContain("#assignment-counterparty-role");
    expect(result.quads.some((quad) => (
      quad.subject.value === `${CONTRACT}#document`
      && quad.predicate.value === "http://purl.org/dc/terms/hasPart"
      && quad.object.termType === "NamedNode"
      && quad.object.value === `${CONTRACT}#legal-query-catalog`
      && quad.graph?.value === `${CONTRACT}#query-graph`
    ))).toBe(true);
  });

  it("runs every embedded contract query against the extracted RDF/JS dataset", async () => {
    const { result } = extract(assignmentHtml, CONTRACT);
    const queries = extractSuggestedSparqlQueries(result);
    const counts = new Map<string, number>();
    const labelPredicates = new Set([
      "http://www.w3.org/2000/01/rdf-schema#label",
      "http://www.w3.org/2004/02/skos/core#prefLabel",
      `${SCHEMA}name`,
      "http://purl.org/dc/terms/title",
      `${SHACL}name`,
    ]);
    const labeledResources = new Set(result.quads.flatMap((quad) => (
      labelPredicates.has(quad.predicate.value) && quad.object.termType === "Literal"
        ? [`${quad.subject.termType}:${quad.subject.value}`]
        : []
    )));

    for (const query of queries) {
      const output = await executeSparql(query.query, result);
      expect(output.kind).toBe("bindings");
      counts.set(query.label, output.kind === "bindings" ? output.rows.length : 0);
      if (output.kind === "bindings") {
        for (const row of output.rows) {
          for (const term of Object.values(row)) {
            if (term.termType === "NamedNode" || term.termType === "BlankNode") {
              expect(labeledResources, `${query.label} returned unlabeled ${term.value}`)
                .toContain(`${term.termType}:${term.value}`);
            }
          }
        }
      }
    }

    expect(counts.get("Who are the parties?")).toBe(3);
    expect(counts.get("Who must do what for whom?")).toBe(6);
    expect(counts.get("Which rights are conditional?")).toBeGreaterThanOrEqual(3);
    expect(counts.get("What does each party represent?")).toBe(3);
  }, 15_000);

  it("returns and paginates complete result sets larger than 500 rows", async () => {
    const { result } = extract(assignmentHtml, CONTRACT);
    const output = await executeSparql(
      "SELECT ?subject ?predicate ?object ?graph WHERE { GRAPH ?graph { ?subject ?predicate ?object } }",
      result,
    );

    expect(output.kind).toBe("bindings");
    if (output.kind !== "bindings") return;
    expect(output.rows.length).toBeGreaterThan(500);
  }, 15_000);

  it("joins accepted party names from the runtime graph into stable contract roles", async () => {
    const { page } = extract(assignmentHtml, CONTRACT);
    const acceptedName = page.createElement("data");
    acceptedName.value = "Assignee Ltd.";
    acceptedName.setAttribute("rdf-subject", "#assignee");
    acceptedName.setAttribute("rdf-predicate", `${SCHEMA}legalName`);
    acceptedName.setAttribute("rdf-datatype", "http://www.w3.org/2001/XMLSchema#string");
    acceptedName.setAttribute("rdf-graph", "#runtime-graph");
    page.body.append(acceptedName);

    const result = extractDataset(page);
    const partiesQuery = extractSuggestedSparqlQueries(result)
      .find(({ label }) => label === "Who are the parties?")!;
    const output = await executeSparql(partiesQuery.query, result);

    expect(output.kind).toBe("bindings");
    if (output.kind !== "bindings") return;
    expect(output.rows).toEqual(expect.arrayContaining([
      expect.objectContaining({
        role: expect.objectContaining({ value: `${CONTRACT}#AssigneeRole` }),
        party: expect.objectContaining({ value: `${CONTRACT}#assignee` }),
        legalName: expect.objectContaining({ value: "Assignee Ltd." }),
      }),
    ]));
  });

  it("projects choices through scoped Web Annotation template alternatives", () => {
    const { page, result } = extract(assignmentHtml, CONTRACT);
    const choiceItems = new Set<string>();
    for (const itemsQuad of result.quads.filter((quad) => (
      quad.predicate.value === `${AS}items`
      && result.quads.some((typeQuad) => (
        typeQuad.subject.value === quad.subject.value
        && typeQuad.predicate.value === `${RDF}type`
        && typeQuad.object.termType === "NamedNode"
        && typeQuad.object.value === `${OA}Choice`
      ))
    ))) {
      let cursor = itemsQuad.object.termType === "NamedNode" ? itemsQuad.object.value : undefined;
      while (cursor && cursor !== `${RDF}nil`) {
        const first = result.quads.find((quad) => (
          quad.subject.value === cursor && quad.predicate.value === `${RDF}first`
        ))?.object;
        const rest = result.quads.find((quad) => (
          quad.subject.value === cursor && quad.predicate.value === `${RDF}rest`
        ))?.object;
        if (first?.termType !== "NamedNode" || rest?.termType !== "NamedNode") break;
        choiceItems.add(first.value);
        cursor = rest.value;
      }
    }
    const alternatives = result.quads.filter((quad) => (
      choiceItems.has(quad.subject.value)
      &&
      quad.predicate.value === `${OA}hasSource`
      && quad.object.termType === "NamedNode"
      && quad.graph?.value === `${CONTRACT}#template-graph`
      && result.quads.some((typeQuad) => (
        typeQuad.subject.value === quad.subject.value
        && typeQuad.predicate.value === `${RDF}type`
        && typeQuad.object.termType === "NamedNode"
        && typeQuad.object.value === `${OA}SpecificResource`
      ))
      && result.quads.some((scopeQuad) => (
        scopeQuad.subject.value === quad.subject.value
        && scopeQuad.predicate.value === `${OA}hasScope`
      ))
    ));

    expect(alternatives).toHaveLength(26);
    for (const alternative of alternatives) {
      if (alternative.object.termType !== "NamedNode") {
        throw new Error("Choice source must be an identified HTML template.");
      }
      const fragmentId = new URL(alternative.object.value).hash.slice(1);
      expect(page.getElementById(fragmentId)?.localName).toBe("template");
    }

    expect(result.quads.some((quad) => (
      quad.predicate.value === `${RDF}type`
      && quad.object.termType === "NamedNode"
      && quad.object.value === `${OA}Choice`
      && quad.graph?.value === `${CONTRACT}#template-graph`
    ))).toBe(true);
    const renderingAnnotations = new Set(result.quads.flatMap((quad) => {
      if (quad.predicate.value !== `${OA}hasBody` || quad.object.termType !== "NamedNode") {
        return [];
      }
      const body = quad.object.value;
      return result.quads.some((typeQuad) => (
        typeQuad.subject.value === body
        && typeQuad.predicate.value === `${RDF}type`
        && typeQuad.object.termType === "NamedNode"
        && typeQuad.object.value === `${OA}Choice`
      ))
        ? [quad.subject.value]
        : [];
    }));
    expect(renderingAnnotations.size).toBeGreaterThan(0);
    for (const annotation of renderingAnnotations) {
      expect(result.quads.some((quad) => (
        quad.subject.value === annotation
        && quad.predicate.value === `${OA}motivatedBy`
        && quad.object.termType === "NamedNode"
        && quad.object.value === `${OA}editing`
      ))).toBe(true);
    }
  });

  it("correlates DoCO structure, sourced entity claims, and reusable signature shapes", () => {
    const { result } = extract(assignmentHtml, CONTRACT);

    expect(result.quads.some((quad) => (
      quad.subject.termType === "NamedNode"
      && quad.subject.value === `${CONTRACT}#clause-assignment`
      && quad.predicate.value === `${RDF}type`
      && quad.object.termType === "NamedNode"
      && quad.object.value === `${DOCO}Section`
      && quad.graph?.value === `${CONTRACT}#structure-graph`
    ))).toBe(true);
    expect(result.quads.some((quad) => (
      quad.subject.termType === "NamedNode"
      && quad.subject.value === `${CONTRACT}#assignor-identity-claim`
      && quad.predicate.value === `${CMI}assertedObject`
      && quad.object.termType === "NamedNode"
      && quad.object.value === `${CONTRACT}#assignor`
      && quad.graph?.value === `${CONTRACT}#claim-graph`
    ))).toBe(true);
    expect(result.quads.some((quad) => (
      quad.subject.termType === "NamedNode"
      && quad.subject.value === `${CONTRACT}#signatory-capacity-reference-field`
      && quad.predicate.value === `${SHACL}class`
      && quad.object.termType === "NamedNode"
      && quad.object.value === `${FIBO_CAPACITY}SignatoryCapacity`
      && quad.graph?.value === `${CONTRACT}#template-graph`
    ))).toBe(true);
  });

  it("connects every visible fillable through Web Annotation targets", () => {
    const { page, result } = extract(assignmentHtml, CONTRACT);
    const fillableIds = Array.from(page.querySelectorAll<HTMLElement>(".fill-in[id], .signature-field dd[id]"))
      .map(({ id }) => `${CONTRACT}#${id}`);
    const connectedPlaceholders = new Set(result.quads.flatMap((quad) => (
      quad.predicate.value === `${OA}hasTarget`
      && quad.object.termType === "NamedNode"
        ? [quad.object.value]
        : []
    )));

    expect(fillableIds).not.toHaveLength(0);
    expect(fillableIds.filter((iri) => !connectedPlaceholders.has(iri))).toEqual([]);
    expect(page.querySelector("ia2-rdf-value-editor")).not.toBeNull();
    expect(page.querySelector("ia2-rdf-value-editor")?.hasAttribute("connector-predicate"))
      .toBe(false);
    expect(page.querySelector("ia2-rdf-value-editor")?.getAttribute("position")).toBe("right");
    expect(page.querySelector("ia2-rdf-value-editor")?.hasAttribute("backlinks")).toBe(true);
    expect(page.querySelector<HTMLScriptElement>(
      'script[src="/packages/rdf-value-editor/dist/rdf-value-editor.js"]',
    )).not.toBeNull();
    expect(page.querySelector<HTMLScriptElement>(
      'script[src="/packages/html-rdf-navigator/dist/html-rdf-navigator.js"]',
    )).not.toBeNull();
  });

  it("uses one completion field for repeated references to the same party identity", () => {
    const { page, result } = extract(assignmentHtml, CONTRACT);
    const assignorNameShape = `${CONTRACT}#assignor-name-field`;
    const presentations = new Set(result.quads.flatMap((quad) => (
      quad.predicate.value === `${OA}hasBody`
      && quad.object.termType === "NamedNode"
      && quad.object.value === assignorNameShape
        ? [quad.subject.value]
        : []
    )));
    const placeholders = result.quads.flatMap((quad) => (
      presentations.has(quad.subject.value)
      && quad.predicate.value === `${OA}hasTarget`
      && quad.object.termType === "NamedNode"
        ? [quad.object.value]
        : []
    ));

    expect(placeholders).toEqual(expect.arrayContaining([
      `${CONTRACT}#assignor-name-value`,
      `${CONTRACT}#assignor-signature-party-name-value`,
    ]));
    for (const presentation of presentations) {
      expect(result.quads.some((quad) => (
        quad.subject.value === presentation
        && quad.predicate.value === `${OA}motivatedBy`
        && quad.object.termType === "NamedNode"
        && quad.object.value === `${OA}describing`
      ))).toBe(true);
    }
    expect(page.querySelectorAll("[data-value-subject], [data-value-label], [data-value-parent-subject]"))
      .toHaveLength(0);
    expect(result.quads.some((quad) => (
      quad.subject.value === `${CONTRACT}#assignor-jurisdiction-value-presentation`
      && quad.predicate.value === `${SCHEMA}about`
      && quad.object.termType === "NamedNode"
      && quad.object.value === `${CONTRACT}#assignor`
    ))).toBe(true);
  });
});
