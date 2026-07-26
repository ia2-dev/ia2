import rdfDataModel from "@rdfjs/data-model";
import type * as RDF from "@rdfjs/types";
import Validator from "shacl-engine/Validator.js";
import { targetResolvers, validations } from "shacl-engine/sparql.js";

const OA_HAS_BODY = "http://www.w3.org/ns/oa#hasBody";
const OA_HAS_SOURCE = "http://www.w3.org/ns/oa#hasSource";
const OA_HAS_TARGET = "http://www.w3.org/ns/oa#hasTarget";
const SH_NAME = "http://www.w3.org/ns/shacl#name";
const SH_VIOLATION = "http://www.w3.org/ns/shacl#Violation";
const SH_WARNING = "http://www.w3.org/ns/shacl#Warning";

export type PolicySeverity = "info" | "warning" | "violation";

export interface PolicyFinding {
  focusNode?: string;
  message: string;
  name: string;
  path?: string;
  severity: PolicySeverity;
  severityIri?: string;
  sourceShape?: string;
  /** First navigation target, retained as a convenience for simple consumers. */
  target?: string;
  targets: string[];
  value?: string;
}

export interface PolicyValidationResult {
  conforms: boolean;
  findings: PolicyFinding[];
}

export interface PolicyValidationOptions {
  languages?: readonly string[];
}

function pointerTerm(pointer: any): RDF.Term | undefined {
  return pointer?.term ?? pointer?.terms?.[0];
}

function termValue(pointer: any): string | undefined {
  return pointerTerm(pointer)?.value;
}

function severity(value: string | undefined): PolicySeverity {
  if (value === SH_VIOLATION) return "violation";
  if (value === SH_WARNING) return "warning";
  return "info";
}

function firstLiteral(
  dataset: RDF.DatasetCore,
  subject: RDF.Term | undefined,
  predicate: string,
  languages: readonly string[],
): string | undefined {
  if (!subject) return undefined;
  const literals = Array.from(
    dataset.match(subject, rdfDataModel.namedNode(predicate), null, null),
  ).flatMap(({ object }) => object.termType === "Literal" ? [object] : []);
  for (const language of languages) {
    const match = literals.find((literal) => (
      literal.language.toLowerCase() === language.toLowerCase()
    ));
    if (match) return match.value;
  }
  return literals.find((literal) => !literal.language)?.value ?? literals[0]?.value;
}

function targetIris(dataset: RDF.DatasetCore, body: RDF.Term | undefined): string[] {
  if (!body) return [];
  const targets: RDF.Term[] = [];
  for (const bodyQuad of dataset.match(null, rdfDataModel.namedNode(OA_HAS_BODY), body, null)) {
    for (
      const targetQuad of dataset.match(
        bodyQuad.subject,
        rdfDataModel.namedNode(OA_HAS_TARGET),
        null,
        null,
      )
    ) {
      targets.push(targetQuad.object);
    }
  }
  return Array.from(new Set(targets.flatMap((target) => {
    const sources = Array.from(
      dataset.match(target, rdfDataModel.namedNode(OA_HAS_SOURCE), null, null),
    ).flatMap(({ object }) => object.termType === "NamedNode" ? [object.value] : []);
    if (sources.length > 0) return sources;
    return target.termType === "NamedNode" ? [target.value] : [];
  })));
}

function flatten(results: readonly any[]): any[] {
  return results.flatMap((result) => [result, ...flatten(result.results ?? [])]);
}

/**
 * Validate one RDF/JS data graph against one independently supplied RDF/JS
 * SHACL graph. HTML/RDF extraction and named-graph projection belong to
 * adapters, not this headless policy engine.
 */
export async function validatePolicy(
  data: RDF.DatasetCore,
  shapes: RDF.DatasetCore,
  options: PolicyValidationOptions = {},
): Promise<PolicyValidationResult> {
  const validator = new Validator(shapes, {
    details: true,
    factory: rdfDataModel,
    targetResolvers,
    validations,
  });
  const report = await validator.validate({ dataset: data });
  const findings = flatten(report.results ?? []).map((result): PolicyFinding => {
    const sourceShapeTerm = pointerTerm(result.shape?.ptr);
    const sourceShape = sourceShapeTerm?.value;
    const targets = targetIris(shapes, sourceShapeTerm);
    const severityIri = result.severity?.value;
    const messages = (result.message ?? []).filter((message: any) => message.value?.trim());
    const localizedMessage = options.languages?.flatMap((language) => (
      messages.filter((message: any) => message.language?.toLowerCase() === language.toLowerCase())
    ))[0] ?? messages.find((message: any) => !message.language) ?? messages[0];
    return {
      message: localizedMessage?.value?.trim()
        ?? "The document does not conform to this policy shape.",
      name: firstLiteral(
        shapes,
        sourceShapeTerm,
        SH_NAME,
        options.languages ?? [],
      ) ?? "Policy finding",
      severity: severity(severityIri),
      targets,
      ...(severityIri ? { severityIri } : {}),
      ...(sourceShape ? { sourceShape } : {}),
      ...(termValue(result.focusNode) ? { focusNode: termValue(result.focusNode)! } : {}),
      ...(termValue(result.path) ? { path: termValue(result.path)! } : {}),
      ...(termValue(result.value) ? { value: termValue(result.value)! } : {}),
      ...(targets[0] ? { target: targets[0] } : {}),
    };
  });

  const unique = Array.from(new Map(
    findings.map((finding) => [
      [
        finding.sourceShape,
        finding.focusNode,
        finding.path,
        finding.value,
        finding.message,
      ].join("\n"),
      finding,
    ]),
  ).values());

  return { conforms: unique.length === 0, findings: unique };
}
