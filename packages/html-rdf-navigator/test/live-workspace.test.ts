import { describe, expect, it } from "vitest";
import { extractDataset } from "../src/extract.js";
// @ts-expect-error Vitest supplies Vite's raw-fixture import during tests.
import briefingHtml from "../../../demos/live-workspace/release-brief/index.html?raw";
// @ts-expect-error Vitest supplies Vite's raw-fixture import during tests.
import issueHtml from "../../../demos/live-workspace/issues/index.html?raw";
// @ts-expect-error Vitest supplies Vite's raw-fixture import during tests.
import inboxHtml from "../../../demos/live-workspace/inbox/index.html?raw";
// @ts-expect-error Vitest supplies Vite's raw-fixture import during tests.
import vendorHtml from "../../../demos/live-workspace/vendor-review/index.html?raw";
// @ts-expect-error Vitest supplies Vite's raw-fixture import during tests.
import knowledgeHtml from "../../../demos/live-workspace/knowledge-model/index.html?raw";

const BASE = "https://ia2.dev/demos/live-workspace/release-brief/";
const ISSUE = "https://ia2.dev/demos/live-workspace/issues/";
const INBOX = "https://ia2.dev/demos/live-workspace/inbox/";
const VENDOR = "https://ia2.dev/demos/live-workspace/vendor-review/";
const KNOWLEDGE = "https://ia2.dev/demos/live-workspace/knowledge-model/";
const DECISION = "https://ontology.inferal.com/modules/decision/";
const DCTERMS = "http://purl.org/dc/terms/";
const ODRL = "http://www.w3.org/ns/odrl/2/";
const PROV = "http://www.w3.org/ns/prov#";
const RDF = "http://www.w3.org/1999/02/22-rdf-syntax-ns#";
const SHACL = "http://www.w3.org/ns/shacl#";
const XSD = "http://www.w3.org/2001/XMLSchema#";

describe("live workspace semantics", () => {
  it("connects the release, decision, evidence, claim, and contract", () => {
    const page = new DOMParser().parseFromString(briefingHtml, "text/html");
    Object.defineProperty(page, "URL", { configurable: true, value: "http://127.0.0.1:8791/demos/live-workspace/release-brief/" });

    const result = extractDataset(page);
    const named = (fragment: string): string => `${BASE}#${fragment}`;
    const hasNamed = (subject: string, predicate: string, object: string, graph?: string): boolean => (
      result.quads.some((quad) => (
        quad.subject.termType === "NamedNode"
        && quad.subject.value === subject
        && quad.predicate.value === predicate
        && quad.object.termType === "NamedNode"
        && quad.object.value === object
        && (graph === undefined || (quad.graph?.termType === "NamedNode" && quad.graph.value === graph))
      ))
    );
    expect(result.diagnostics).toEqual([]);
    expect(result.sourceDocumentIri).toBe(BASE);
    expect(hasNamed(
      named("release-accessibility"),
      `${DCTERMS}hasPart`,
      named("decision-record-focus-return"),
    )).toBe(true);
    expect(hasNamed(
      named("decision-record-focus-return"),
      `${DECISION}recordsDecision`,
      named("decision-focus-return"),
    )).toBe(true);
    expect(hasNamed(
      named("decision-focus-return"),
      `${DECISION}selectedOption`,
      named("option-return-to-invoker"),
      named("runtime-state"),
    )).toBe(true);
    expect(hasNamed(
      named("decision-record-focus-return"),
      `${PROV}wasDerivedFrom`,
      `${INBOX}#message-31`,
    )).toBe(true);
    expect(hasNamed(
      named("decision-issue-focus-return"),
      `${DCTERMS}isPartOf`,
      `${ISSUE}#issue-142`,
    )).toBe(true);
    expect(hasNamed(
      named("decision-shape"),
      `${SHACL}targetClass`,
      `${DECISION}Decision`,
      named("validation-contract"),
    )).toBe(true);
    expect(hasNamed(
      named("decision-record-shape"),
      `${SHACL}targetClass`,
      `${DECISION}DecisionRecord`,
      named("validation-contract"),
    )).toBe(true);
    expect(result.quads.some((quad) => (
      quad.predicate.value === `${RDF}reifies`
      && quad.object.termType === "Triple"
      && quad.object.predicate.value === `${DECISION}selectedOption`
    ))).toBe(true);
    expect(result.graphs).toEqual(expect.arrayContaining([
      { termType: "NamedNode", value: named("runtime-state") },
      { termType: "NamedNode", value: named("validation-contract") },
    ]));
  });

  it("keeps the original applications in separate canonical RDF spaces", () => {
    const issuePage = new DOMParser().parseFromString(issueHtml, "text/html");
    const inboxPage = new DOMParser().parseFromString(inboxHtml, "text/html");
    Object.defineProperty(issuePage, "URL", { configurable: true, value: "http://127.0.0.1:8791/issues" });
    Object.defineProperty(inboxPage, "URL", { configurable: true, value: "http://127.0.0.1:8791/inbox" });

    const issueResult = extractDataset(issuePage);
    const inboxResult = extractDataset(inboxPage);

    expect(issueResult.diagnostics).toEqual([]);
    expect(inboxResult.diagnostics).toEqual([]);
    expect(issueResult.sourceDocumentIri).toBe(ISSUE);
    expect(inboxResult.sourceDocumentIri).toBe(INBOX);
    expect(issueResult.quads.some((quad) => quad.subject.value.startsWith(INBOX))).toBe(false);
    expect(inboxResult.quads.some((quad) => quad.subject.value.startsWith(ISSUE))).toBe(false);
  });

  it("connects vendor requirements, evidence, policy, approval, and shapes", () => {
    const page = new DOMParser().parseFromString(vendorHtml, "text/html");
    Object.defineProperty(page, "URL", { configurable: true, value: "http://127.0.0.1:8791/vendor-review" });
    const result = extractDataset(page);
    const named = (fragment: string): string => `${VENDOR}#${fragment}`;
    const hasNamed = (subject: string, predicate: string, object: string, graph?: string): boolean => (
      result.quads.some((quad) => (
        quad.subject.termType === "NamedNode"
        && quad.subject.value === subject
        && quad.predicate.value === predicate
        && quad.object.termType === "NamedNode"
        && quad.object.value === object
        && (graph === undefined || (quad.graph?.termType === "NamedNode" && quad.graph.value === graph))
      ))
    );
    const hasLiteral = (subject: string, predicate: string, value: string, datatype: string, graph?: string): boolean => (
      result.quads.some((quad) => (
        quad.subject.termType === "NamedNode"
        && quad.subject.value === subject
        && quad.predicate.value === predicate
        && quad.object.termType === "Literal"
        && quad.object.value === value
        && quad.object.datatype.value === datatype
        && (graph === undefined || (quad.graph?.termType === "NamedNode" && quad.graph.value === graph))
      ))
    );

    expect(result.diagnostics).toEqual([]);
    expect(result.sourceDocumentIri).toBe(VENDOR);
    expect(hasNamed(
      named("requirement-encryption"),
      "https://current.example/security/satisfiedBy",
      named("claim-encryption"),
    )).toBe(true);
    expect(hasNamed(
      named("claim-encryption"),
      `${PROV}wasDerivedFrom`,
      named("soc2-report"),
    )).toBe(true);
    expect(hasNamed(
      named("decision-northstar"),
      `${DECISION}selectedOption`,
      named("option-conditional"),
      named("runtime-state"),
    )).toBe(true);
    expect(hasLiteral(
      named("review-northstar"),
      "https://current.example/security/satisfiedRequirementCount",
      "2",
      `${XSD}integer`,
    )).toBe(true);
    expect(hasLiteral(
      named("requirement-notification"),
      "https://current.example/security/maximumIncidentNotificationDelay",
      "PT24H",
      `${XSD}dayTimeDuration`,
    )).toBe(true);
    expect(hasLiteral(
      named("claim-notification"),
      "https://current.example/security/maximumIncidentNotificationDelay",
      "PT72H",
      `${XSD}dayTimeDuration`,
    )).toBe(true);
    expect(hasNamed(
      named("requirement-notification"),
      "https://current.example/security/requirementStatus",
      "https://current.example/security/status/gap",
      named("runtime-state"),
    )).toBe(true);
    expect(hasNamed(
      named("dpa"),
      `${DCTERMS}hasPart`,
      named("dpa-section-8-2"),
    )).toBe(true);
    expect(hasNamed(
      named("dpa-section-8-2"),
      `${RDF}type`,
      "http://purl.org/spar/doco/Section",
    )).toBe(true);
    expect(hasNamed(
      named("claim-notification"),
      `${PROV}wasDerivedFrom`,
      named("dpa-section-8-2"),
    )).toBe(true);
    expect(hasNamed(
      named("notification-gap"),
      "https://current.example/security/evaluatesRequirement",
      named("requirement-notification"),
    )).toBe(true);
    expect(hasNamed(
      named("notification-gap"),
      "https://current.example/security/evaluatesClaim",
      named("claim-notification"),
    )).toBe(true);
    expect(hasLiteral(
      named("notification-gap"),
      "https://current.example/security/delayDifference",
      "PT48H",
      `${XSD}dayTimeDuration`,
    )).toBe(true);
    expect(hasNamed(
      named("decision-northstar"),
      "https://current.example/security/approvalStatus",
      "https://current.example/security/status/conditional-approval",
      named("runtime-state"),
    )).toBe(true);
    expect(hasNamed(
      named("option-conditional"),
      `${DCTERMS}requires`,
      named("notification-amendment-condition"),
    )).toBe(true);
    expect(hasNamed(
      named("notification-amendment-condition"),
      "https://current.example/security/resolves",
      named("notification-gap"),
    )).toBe(true);
    expect(hasLiteral(
      named("notification-amendment-condition"),
      "https://current.example/security/maximumIncidentNotificationDelay",
      "PT24H",
      `${XSD}dayTimeDuration`,
    )).toBe(true);
    expect(hasNamed(
      named("authority-policy"),
      `${ODRL}permission`,
      named("draft-amendment-permission"),
    )).toBe(true);
    expect(hasNamed(
      named("draft-amendment-permission"),
      `${ODRL}assignee`,
      named("review-agent"),
    )).toBe(true);
    expect(hasNamed(
      named("draft-amendment-permission"),
      `${ODRL}action`,
      `${ODRL}derive`,
    )).toBe(true);
    expect(hasNamed(
      named("draft-amendment-permission"),
      `${ODRL}target`,
      named("dpa"),
    )).toBe(true);
    expect(hasNamed(
      named("authority-policy"),
      `${ODRL}obligation`,
      named("approve-vendor-duty"),
    )).toBe(true);
    expect(hasNamed(
      named("approve-vendor-duty"),
      `${ODRL}assignee`,
      named("maya-chen"),
    )).toBe(true);
    expect(hasNamed(
      named("approve-vendor-duty"),
      `${ODRL}action`,
      "https://current.example/security/approveVendor",
    )).toBe(true);
    expect(hasNamed(
      named("approve-vendor-duty"),
      `${ODRL}target`,
      named("northstar-platform"),
    )).toBe(true);
    expect(hasNamed(
      named("requirement-shape"),
      `${SHACL}targetClass`,
      "https://current.example/security/Requirement",
      named("validation-contract"),
    )).toBe(true);
    expect(hasNamed(
      named("notification-duration-shape"),
      `${SHACL}targetSubjectsOf`,
      "https://current.example/security/maximumIncidentNotificationDelay",
      named("validation-contract"),
    )).toBe(true);
    expect(result.quads.some((quad) => (
      quad.predicate.value === `${SHACL}datatype`
      && quad.object.termType === "NamedNode"
      && quad.object.value === `${XSD}dayTimeDuration`
      && quad.graph?.termType === "NamedNode"
      && quad.graph.value === named("validation-contract")
    ))).toBe(true);
    expect(result.graphs).toEqual(expect.arrayContaining([
      { termType: "NamedNode", value: named("runtime-state") },
      { termType: "NamedNode", value: named("validation-contract") },
    ]));
  });

  it("layers concepts, decisions, artifacts, quality, and constraints", () => {
    const page = new DOMParser().parseFromString(knowledgeHtml, "text/html");
    Object.defineProperty(page, "URL", { configurable: true, value: "http://127.0.0.1:8791/knowledge-model" });
    const result = extractDataset(page);
    const named = (fragment: string): string => `${KNOWLEDGE}#${fragment}`;
    const hasNamed = (subject: string, predicate: string, object: string, graph?: string): boolean => (
      result.quads.some((quad) => (
        quad.subject.termType === "NamedNode"
        && quad.subject.value === subject
        && quad.predicate.value === predicate
        && quad.object.termType === "NamedNode"
        && quad.object.value === object
        && (graph === undefined || (quad.graph?.termType === "NamedNode" && quad.graph.value === graph))
      ))
    );

    expect(result.diagnostics).toEqual([]);
    expect(result.sourceDocumentIri).toBe(KNOWLEDGE);
    expect(hasNamed(
      named("authorization-flow"),
      `${RDF}type`,
      "http://www.w3.org/2004/02/skos/core#Concept",
      named("knowledge-model"),
    )).toBe(true);
    expect(hasNamed(
      named("latency-decision"),
      `${DECISION}selectedOption`,
      named("option-200ms"),
      named("runtime-state"),
    )).toBe(true);
    expect(hasNamed(
      named("artifact-map-auth"),
      `${PROV}hadPrimarySource`,
      named("auth-handler"),
      named("knowledge-model"),
    )).toBe(true);
    expect(hasNamed(
      named("sync-measurement"),
      "http://www.w3.org/ns/dqv#computedOn",
      named("artifact-map-auth"),
      named("knowledge-model"),
    )).toBe(true);
    expect(hasNamed(
      named("concept-shape"),
      `${SHACL}targetClass`,
      "http://www.w3.org/2004/02/skos/core#Concept",
      named("validation-contract"),
    )).toBe(true);
    expect(result.quads.some((quad) => (
      quad.predicate.value === `${RDF}reifies`
      && quad.object.termType === "Triple"
      && quad.object.predicate.value === `${DECISION}selectedOption`
      && quad.object.object.termType === "NamedNode"
      && quad.object.object.value === named("option-200ms")
    ))).toBe(true);
    expect(result.graphs).toEqual(expect.arrayContaining([
      { termType: "NamedNode", value: named("knowledge-model") },
      { termType: "NamedNode", value: named("runtime-state") },
      { termType: "NamedNode", value: named("validation-contract") },
    ]));
  });
});
