import rdfDataModel from "@rdfjs/data-model";
import rdfDataset from "@rdfjs/dataset";
import Validator, {
  type ShaclEngineResult,
} from "shacl-engine/Validator.js";
import type {
  Literal,
  NamedNode,
  Quad,
} from "@ia2-dev/html-rdf";
import {
  projectQuadsToDefaultGraph,
  toRdfJsDataset,
  toRdfJsLiteral,
} from "@ia2-dev/html-rdf";

export type ShaclAuthorValue = NamedNode | Literal;

export interface ShaclAuthoringBinding {
  key: string;
  shape: string;
  subject: string;
  path: string;
  active: boolean;
  object?: ShaclAuthorValue;
  representationError?: string;
}

export interface ShaclAuthoringResult {
  conforms: boolean;
  messages: Map<string, string[]>;
  resultCount: number;
}

const SH_MIN_COUNT_CONSTRAINT_COMPONENT =
  "http://www.w3.org/ns/shacl#MinCountConstraintComponent";

function flattenResults(results: readonly ShaclEngineResult[]): ShaclEngineResult[] {
  return results.flatMap((result) => [result, ...flattenResults(result.results ?? [])]);
}

function resultMessages(results: readonly ShaclEngineResult[]): string[] {
  return Array.from(new Set(
    flattenResults(results)
      .flatMap((result) => {
        const messages = (result.message ?? [])
          .map(({ value }) => value.trim())
          .filter(Boolean);
        const isDefaultRequiredMessage = (
          result.constraintComponent?.value === SH_MIN_COUNT_CONSTRAINT_COMPONENT
          && messages.length === 1
          && messages[0] === "Less than 1 values"
        );
        return isDefaultRequiredMessage ? ["This value is required."] : messages;
      })
      .filter(Boolean),
  ));
}

function pointerValue(pointer: any): string | undefined {
  return pointer?.term?.value ?? pointer?.terms?.[0]?.value;
}

/**
 * Project the HTML/RDF dataset into one explicit SHACL data graph, then
 * validate every active authoring shape in one engine invocation. Activation
 * remains a presentation concern; inactive shapes are not supplied to the
 * validator.
 */
export async function validateShaclAuthoringState(
  sourceQuads: readonly Quad[],
  bindings: readonly ShaclAuthoringBinding[],
): Promise<ShaclAuthoringResult> {
  const authoredPairs = new Set(bindings.map(({ path, subject }) => `${subject}\n${path}`));
  const baseData = sourceQuads
    .filter(({ predicate, subject }) => (
      !authoredPairs.has(`${subject.value}\n${predicate.value}`)
    ));
  const data = toRdfJsDataset(
    projectQuadsToDefaultGraph(baseData),
    rdfDataModel,
    rdfDataset,
  );
  const shapes = toRdfJsDataset(
    projectQuadsToDefaultGraph(sourceQuads),
    rdfDataModel,
    rdfDataset,
  );

  for (const binding of bindings) {
    if (!binding.active || !binding.object || binding.representationError) continue;
    data.add(rdfDataModel.quad(
      rdfDataModel.namedNode(binding.subject),
      rdfDataModel.namedNode(binding.path),
      binding.object.termType === "NamedNode"
        ? rdfDataModel.namedNode(binding.object.value)
        : toRdfJsLiteral(binding.object, rdfDataModel),
    ));
  }

  const validator = new Validator(shapes, {
    details: true,
    factory: rdfDataModel,
  });
  const messages = new Map<string, string[]>();
  const activeBindings = bindings.filter(({ active }) => active);
  const validBindings = activeBindings.filter(({ representationError }) => !representationError);

  for (const binding of activeBindings) {
    if (binding.representationError) {
      messages.set(binding.key, [binding.representationError]);
    }
  }

  const shapePointers = Array.from(new Set(validBindings.map(({ shape }) => shape)))
    .map((shape) => ({ terms: [rdfDataModel.namedNode(shape)] }));
  const report = shapePointers.length > 0
    ? await validator.validate({ dataset: data }, shapePointers)
    : { conforms: true, results: [] };
  const results = flattenResults(report.results ?? []);

  for (const binding of validBindings) {
    const bindingResults = results.filter((result) => (
      pointerValue(result.shape?.ptr) === binding.shape
      && pointerValue(result.focusNode) === binding.subject
    ));
    if (bindingResults.length === 0) continue;
    const bindingMessages = resultMessages(bindingResults);
    messages.set(
      binding.key,
      bindingMessages.length > 0 ? bindingMessages : ["The value does not conform to its SHACL shape."],
    );
  }

  return {
    conforms: messages.size === 0,
    messages,
    resultCount: results.length + activeBindings.filter(({ representationError }) => representationError).length,
  };
}
