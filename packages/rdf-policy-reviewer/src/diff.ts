import type { ObjectTerm, Quad, SubjectTerm } from "@ia2-dev/html-rdf";

export type SemanticChange =
  | {
    kind: "added" | "removed";
    quad: Quad;
    previousQuad?: never;
  }
  | {
    kind: "changed";
    quad: Quad;
    previousQuad: Quad;
  };

function termKey(term: SubjectTerm | ObjectTerm): string {
  if (term.termType === "NamedNode") return `I${term.value}`;
  if (term.termType === "BlankNode") {
    throw new Error(
      "Semantic diff requires stable named resources. Select a diff graph without blank nodes or canonicalize the datasets before comparison.",
    );
  }
  if (term.termType === "Literal") {
    return `L${JSON.stringify(term.value)}|${term.language}|${term.direction ?? ""}|${term.datatype.value}`;
  }
  return `T${termKey(term.subject)}|${term.predicate.value}|${termKey(term.object)}`;
}

function containsBlankNode(term: SubjectTerm | ObjectTerm): boolean {
  if (term.termType === "BlankNode") return true;
  if (term.termType !== "Triple") return false;
  return containsBlankNode(term.subject) || containsBlankNode(term.object);
}

export function quadKey(quad: Quad): string {
  return [
    termKey(quad.subject),
    quad.predicate.value,
    termKey(quad.object),
    quad.graph ? termKey(quad.graph) : "",
  ].join("\n");
}

function statementSlotKey(quad: Quad): string {
  return [
    termKey(quad.subject),
    quad.predicate.value,
    quad.graph ? termKey(quad.graph) : "",
  ].join("\n");
}

function quadsBySlot(quads: readonly Quad[]): Map<string, Quad[]> {
  const groups = new Map<string, Quad[]>();
  for (const quad of quads) {
    const key = statementSlotKey(quad);
    const values = groups.get(key);
    if (values) values.push(quad);
    else groups.set(key, [quad]);
  }
  return groups;
}

/**
 * Return set-level RDF changes for graphs whose resources have stable names.
 * Blank-node datasets require canonicalization before comparison.
 * A slot with exactly one object before and after is reported as one change;
 * multivalued slots retain separate additions and removals.
 */
export function diffQuads(
  previous: readonly Quad[],
  current: readonly Quad[],
  graphFilter?: ReadonlySet<string>,
): SemanticChange[] {
  const include = (quad: Quad) => (
    !graphFilter || (quad.graph?.termType === "NamedNode" && graphFilter.has(quad.graph.value))
  );
  const beforeQuads = previous.filter(include);
  const afterQuads = current.filter(include);
  if ([...beforeQuads, ...afterQuads].some((quad) => (
    containsBlankNode(quad.subject)
    || containsBlankNode(quad.object)
    || quad.graph?.termType === "BlankNode"
  ))) {
    throw new Error(
      "Semantic diff requires stable named resources. Select a diff graph without blank nodes or canonicalize the datasets before comparison.",
    );
  }
  const before = new Map(beforeQuads.map((quad) => [quadKey(quad), quad]));
  const after = new Map(afterQuads.map((quad) => [quadKey(quad), quad]));
  const beforeBySlot = quadsBySlot(beforeQuads);
  const afterBySlot = quadsBySlot(afterQuads);
  const changes: SemanticChange[] = [];
  const changedSlots = new Set<string>();
  for (const [slot, beforeValues] of beforeBySlot) {
    const afterValues = afterBySlot.get(slot);
    if (
      beforeValues.length === 1
      && afterValues?.length === 1
      && quadKey(beforeValues[0]!) !== quadKey(afterValues[0]!)
    ) {
      changes.push({
        kind: "changed",
        previousQuad: beforeValues[0]!,
        quad: afterValues[0]!,
      });
      changedSlots.add(slot);
    }
  }
  for (const [key, quad] of before) {
    if (!after.has(key) && !changedSlots.has(statementSlotKey(quad))) {
      changes.push({ kind: "removed", quad });
    }
  }
  for (const [key, quad] of after) {
    if (!before.has(key) && !changedSlots.has(statementSlotKey(quad))) {
      changes.push({ kind: "added", quad });
    }
  }
  return changes;
}
