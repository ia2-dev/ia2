import { describe, expect, it } from "vitest";
import {
  extractDataset,
  projectQuadsToDefaultGraph,
  toRdfJsDataset,
  type Quad,
} from "@ia2-dev/html-rdf";
import rdfDataModel from "@rdfjs/data-model";
import rdfDataset from "@rdfjs/dataset";
import { diffQuads } from "../src/diff.js";
import { Ia2RdfPolicyReviewer } from "../src/rdf-policy-reviewer.js";
import { validatePolicy } from "../src/validation.js";
// @ts-expect-error Vitest supplies Vite's raw-fixture import during tests.
import assignmentHtml from "../../../specs/rdf-html/examples/sources/assignment.html?raw";
// @ts-expect-error Vitest supplies Vite's raw-fixture import during tests.
import reviewHtml from "../../../specs/rdf-html/examples/sources/assignment-review.html?raw";

const CONTRACT = "https://ia2.dev/spec/rdf-html/examples/sources/assignment.html";
const REVIEW = "https://ia2.dev/spec/rdf-html/examples/sources/assignment-review.html";
const SCHEMA_RESULT = "https://schema.org/result";

if (!customElements.get("ia2-rdf-policy-reviewer")) {
  customElements.define("ia2-rdf-policy-reviewer", Ia2RdfPolicyReviewer);
}

function parse(source: string, url: string): Document {
  const page = new DOMParser().parseFromString(source, "text/html");
  Object.defineProperty(page, "URL", { configurable: true, value: url });
  return page;
}

function addSelection(page: Document, subject: string, object: string): void {
  const carrier = page.createElement("a");
  carrier.href = object;
  carrier.setAttribute("rdf-subject", subject);
  carrier.setAttribute("rdf-predicate", SCHEMA_RESULT);
  carrier.setAttribute("rdf-graph", "#runtime-graph");
  page.body.append(carrier);
}

function datasetFor(quads: readonly Quad[]) {
  return toRdfJsDataset(
    projectQuadsToDefaultGraph(quads),
    rdfDataModel,
    rdfDataset,
  );
}

describe("generic RDF policy review", () => {
  it("executes a separately authored SHACL profile", async () => {
    const contract = parse(assignmentHtml, CONTRACT);
    const review = parse(reviewHtml, REVIEW);
    const profile = review.querySelector("#counsel-policy")!;

    const initial = await validatePolicy(
      datasetFor(extractDataset(contract).quads),
      datasetFor(extractDataset(profile).quads),
    );
    expect(initial.findings.map(({ name }) => name)).toEqual(expect.arrayContaining([
      "Release election outstanding",
      "Debt-condition election outstanding",
      "Prepaid-balance election outstanding",
      "Indemnification election outstanding",
    ]));

    addSelection(contract, "#release-decision", "#release-option-a");
    const partiallySelected = await validatePolicy(
      datasetFor(extractDataset(contract).quads),
      datasetFor(extractDataset(profile).quads),
    );
    expect(partiallySelected.findings).not.toEqual(expect.arrayContaining([
      expect.objectContaining({ name: "Release election outstanding" }),
    ]));
    expect(partiallySelected.findings).toEqual(expect.arrayContaining([
      expect.objectContaining({
        name: "Debt-condition election outstanding",
        severity: "warning",
        target: `${CONTRACT}#clause-conditions`,
      }),
      expect.objectContaining({ name: "Prepaid-balance election outstanding" }),
      expect.objectContaining({ name: "Indemnification election outstanding" }),
    ]));

    addSelection(contract, "#debt-condition-decision", "#amounts-assumed-option");
    addSelection(contract, "#prepaid-clause-decision", "#include-prepaid-option");
    addSelection(contract, "#indemnification-decision", "#omit-indemnification-option");
    const selected = await validatePolicy(
      datasetFor(extractDataset(contract).quads),
      datasetFor(extractDataset(profile).quads),
    );

    expect(selected.findings.map(({ name }) => name)).toEqual(expect.arrayContaining([
      "Full release requires a clean account",
      "Prepaid transfer without indemnity",
    ]));
    expect(selected.findings.map(({ name }) => name)).not.toEqual(expect.arrayContaining([
      "Release election outstanding",
      "Debt-condition election outstanding",
      "Prepaid-balance election outstanding",
      "Indemnification election outstanding",
    ]));
  });

  it("reports set-level changes without interpreting application terms", () => {
    const contract = parse(assignmentHtml, CONTRACT);
    const before = extractDataset(contract).quads;
    addSelection(contract, "#release-decision", "#release-option-a");
    const after = extractDataset(contract).quads;

    const changes = diffQuads(
      before,
      after,
      new Set([`${CONTRACT}#runtime-graph`]),
    );
    expect(changes).toHaveLength(1);
    expect(changes[0]).toEqual(expect.objectContaining({
      kind: "added",
      quad: expect.objectContaining({
        predicate: expect.objectContaining({ value: SCHEMA_RESULT }),
        object: expect.objectContaining({ value: `${CONTRACT}#release-option-a` }),
      }),
    }));
  });

  it("presents a single-valued replacement as one semantic change", () => {
    const source = document.createElement("span");
    const statement = (value: string): Quad => ({
      subject: { termType: "NamedNode", value: "https://example.test/item" },
      predicate: { termType: "NamedNode", value: "https://example.test/status" },
      object: {
        termType: "Literal",
        value,
        datatype: { termType: "NamedNode", value: "http://www.w3.org/2001/XMLSchema#string" },
        language: "",
      },
      graph: { termType: "NamedNode", value: "https://example.test/runtime" },
      source,
    });

    expect(diffQuads([statement("draft")], [statement("approved")])).toEqual([{
      kind: "changed",
      previousQuad: expect.objectContaining({
        object: expect.objectContaining({ value: "draft" }),
      }),
      quad: expect.objectContaining({
        object: expect.objectContaining({ value: "approved" }),
      }),
    }]);
  });

  it("validates a non-legal configuration profile and resolves multiple OA targets", async () => {
    const named = (value: string) => rdfDataModel.namedNode(value);
    const data = rdfDataset.dataset([
      rdfDataModel.quad(
        named("https://example.test/service"),
        named("https://example.test/replicas"),
        rdfDataModel.literal("1", named("http://www.w3.org/2001/XMLSchema#integer")),
      ),
    ]);
    const shape = named("https://example.test/replica-policy");
    const annotation = named("https://example.test/replica-policy-presentation");
    const shapes = rdfDataset.dataset([
      rdfDataModel.quad(shape, named("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"), named("http://www.w3.org/ns/shacl#PropertyShape")),
      rdfDataModel.quad(shape, named("http://www.w3.org/ns/shacl#targetNode"), named("https://example.test/service")),
      rdfDataModel.quad(shape, named("http://www.w3.org/ns/shacl#path"), named("https://example.test/replicas")),
      rdfDataModel.quad(shape, named("http://www.w3.org/ns/shacl#minInclusive"), rdfDataModel.literal("2", named("http://www.w3.org/2001/XMLSchema#integer"))),
      rdfDataModel.quad(shape, named("http://www.w3.org/ns/shacl#name"), rdfDataModel.literal("Replica floor")),
      rdfDataModel.quad(shape, named("http://www.w3.org/ns/shacl#severity"), named("https://example.test/OperationalRisk")),
      rdfDataModel.quad(annotation, named("http://www.w3.org/ns/oa#hasBody"), shape),
      rdfDataModel.quad(annotation, named("http://www.w3.org/ns/oa#hasTarget"), named("https://example.test/dashboard#replicas")),
      rdfDataModel.quad(annotation, named("http://www.w3.org/ns/oa#hasTarget"), named("https://example.test/runbook#scaling")),
    ]);

    const result = await validatePolicy(data, shapes);
    expect(result.findings).toEqual([
      expect.objectContaining({
        name: "Replica floor",
        severity: "info",
        severityIri: "https://example.test/OperationalRisk",
        targets: [
          "https://example.test/dashboard#replicas",
          "https://example.test/runbook#scaling",
        ],
      }),
    ]);
  });

  it("refuses to compare unstable blank-node labels", () => {
    const source = document.createElement("span");
    const quads: Quad[] = [{
      subject: { termType: "BlankNode", value: "local-label" },
      predicate: { termType: "NamedNode", value: "https://example.test/p" },
      object: {
        termType: "Literal",
        value: "value",
        datatype: { termType: "NamedNode", value: "http://www.w3.org/2001/XMLSchema#string" },
        language: "",
      },
      graph: null,
      source,
    }];
    expect(() => diffQuads(quads, quads)).toThrow(/stable named resources/);
  });

  it("reports malformed programmatic profiles instead of claiming conformance", async () => {
    const profile = document.createDocumentFragment();
    const invalid = document.createElement("a");
    invalid.href = "https://example.test/object";
    invalid.setAttribute("rdf-object-key", "competing-object");
    invalid.setAttribute("rdf-subject", "https://example.test/shape");
    invalid.setAttribute("rdf-predicate", "http://www.w3.org/ns/shacl#path");
    profile.append(invalid);
    const source = document.createDocumentFragment();
    source.append(document.createElement("span"));
    const reviewer = document.createElement("ia2-rdf-policy-reviewer") as Ia2RdfPolicyReviewer;
    reviewer.profileRoot = profile;
    reviewer.sourceRoot = source;
    document.body.append(reviewer);
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(reviewer.shadowRoot?.textContent).toContain(
      "The policy profile contains RDF extraction errors.",
    );
  });

  it("connects to an already-present framed document without waiting for a missed load event", async () => {
    document.documentElement.setAttribute("rdf-version", "1.2");
    document.body.innerHTML = `
      <section id="profile" rdf-version="1.2"></section>
      <iframe id="source"></iframe>
    `;
    const frame = document.querySelector<HTMLIFrameElement>("#source")!;
    Object.defineProperty(frame.contentDocument, "URL", {
      configurable: true,
      value: "https://example.test/framed-document",
    });
    Object.defineProperty(frame.contentDocument, "readyState", {
      configurable: true,
      value: "interactive",
    });
    frame.contentDocument!.documentElement.setAttribute("rdf-version", "1.2");
    frame.contentDocument!.body.innerHTML = '<span rdf-subject="https://example.test/item" rdf-predicate="https://schema.org/name">Framed item</span>';

    const reviewer = document.createElement("ia2-rdf-policy-reviewer") as Ia2RdfPolicyReviewer;
    reviewer.setAttribute("profile-root", "#profile");
    reviewer.setAttribute("source-frame", "#source");
    document.body.append(reviewer);
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(reviewer.shadowRoot?.textContent).toContain("Policy profile loaded.");
  });

  it("compares edits with the source observed when review began", async () => {
    document.documentElement.setAttribute("rdf-version", "1.2");
    document.body.innerHTML = "";
    const profile = document.createDocumentFragment();
    const source = document.createDocumentFragment();
    const reviewer = document.createElement("ia2-rdf-policy-reviewer") as Ia2RdfPolicyReviewer;
    reviewer.setAttribute("diff-graphs", "https://example.test/runtime");
    reviewer.profileRoot = profile;
    reviewer.sourceRoot = source;
    const initialized = new Promise((resolve) => reviewer.addEventListener(
      "ia2-rdf-policy-review",
      resolve,
      { once: true },
    ));
    document.body.append(reviewer);
    await initialized;

    const carrier = document.createElement("span");
    carrier.setAttribute("rdf-subject", "https://example.test/signatory");
    carrier.setAttribute("rdf-predicate", "https://schema.org/name");
    carrier.setAttribute("rdf-graph", "https://example.test/runtime");
    carrier.textContent = "H";
    source.append(carrier);
    await reviewer.refresh();
    expect(reviewer.semanticChanges).toEqual([
      expect.objectContaining({
        kind: "added",
        quad: expect.objectContaining({
          object: expect.objectContaining({ value: "H" }),
        }),
      }),
    ]);

    carrier.textContent = "Hello";
    await reviewer.refresh();
    expect(reviewer.semanticChanges).toEqual([
      expect.objectContaining({
        kind: "added",
        quad: expect.objectContaining({
          object: expect.objectContaining({ value: "Hello" }),
        }),
      }),
    ]);
    expect(reviewer.shadowRoot?.textContent).toContain("1 change");
    expect(Array.from(
      reviewer.shadowRoot?.querySelectorAll(".change-kind") ?? [],
      (element) => element.textContent,
    )).toEqual(["added"]);
  });
});
