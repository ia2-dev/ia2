import type * as RDF from "@rdfjs/types";
import DataFactory from "n3/src/N3DataFactory.js";
import { quadsToHtmlRdf } from "./carriers.js";
import type { RenderedRdfHtmlDocument, RdfHtmlDataset, RdfHtmlDocumentDescriptor, RdfHtmlNode, RdfHtmlIssue } from "./model.js";
import { RdfHtmlError } from "./model.js";
import { ATTRIBUTE_BY_DEFINITION_IRI, ELEMENT_BY_CLASS_IRI, HTML_VOCABULARY_IRI, RDFHTML } from "./generated/elements.js";
import { TERMS, XSD } from "./vocabulary.js";

function escapeHtml(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function escapeAttribute(value: string): string {
  return escapeHtml(value).replaceAll('"', "&quot;");
}

function sameTerm(left: RDF.Term, right: RDF.Term): boolean {
  return left.equals(right);
}

function isNode(term: RDF.Term): term is RdfHtmlNode {
  return term.termType === "NamedNode" || term.termType === "BlankNode";
}

function termLabel(term: RDF.Term): string {
  if (term.termType === "NamedNode") return `<${term.value}>`;
  if (term.termType === "BlankNode") return `_:${term.value}`;
  return `${term.termType}(${term.value})`;
}

function uniqueTerms(quads: readonly RDF.Quad[]): RDF.Term[] {
  const values: RDF.Term[] = [];
  for (const quad of quads) {
    if (!values.some((value) => sameTerm(value, quad.object))) values.push(quad.object);
  }
  return values;
}

class Renderer {
  readonly #quads: RDF.Quad[];
  readonly #consumed = new Set<RDF.Quad>();
  readonly #warnings: RdfHtmlIssue[] = [];
  readonly #parents = new Map<string, string>();

  constructor(dataset: RdfHtmlDataset) {
    this.#quads = Array.from(dataset);
  }

  #matches(subject: RDF.Term | null, predicate: string | null, object: RDF.Term | null): RDF.Quad[] {
    const predicateNode = predicate ? DataFactory.namedNode(predicate) : null;
    return this.#quads.filter((quad) => (
      (!subject || sameTerm(quad.subject, subject))
      && (!predicateNode || sameTerm(quad.predicate, predicateNode))
      && (!object || sameTerm(quad.object, object))
    ));
  }

  #consume(quads: readonly RDF.Quad[]): void {
    for (const quad of quads) this.#consumed.add(quad);
  }

  #singleObject(node: RdfHtmlNode, predicate: string, required: boolean, kind?: RDF.Term["termType"]): RDF.Term | null {
    const quads = this.#matches(node, predicate, null);
    const values = uniqueTerms(quads);
    if (values.length === 0 && !required) return null;
    if (values.length !== 1) {
      throw new RdfHtmlError(`${termLabel(node)} must have ${required ? "exactly" : "at most"} one <${predicate}> value.`);
    }
    const value = values[0]!;
    if (kind && value.termType !== kind) throw new RdfHtmlError(`${termLabel(node)} <${predicate}> must be a ${kind}.`);
    this.#consume(quads);
    return value;
  }

  #structuralType(node: RdfHtmlNode): { classIri: string; definition: ReturnType<typeof ELEMENT_BY_CLASS_IRI.get> | null } {
    const typeQuads = this.#matches(node, TERMS.rdfType, null);
    const candidates = new Map<string, { classIri: string; definition: ReturnType<typeof ELEMENT_BY_CLASS_IRI.get> | null; quads: RDF.Quad[] }>();
    for (const quad of typeQuads) {
      if (quad.object.termType !== "NamedNode") continue;
      const definition = ELEMENT_BY_CLASS_IRI.get(quad.object.value);
      if (definition) {
        const candidate = candidates.get(quad.object.value) ?? { classIri: quad.object.value, definition, quads: [] };
        candidate.quads.push(quad);
        candidates.set(quad.object.value, candidate);
        continue;
      }
      if ([TERMS.document, TERMS.documentType, TERMS.text, TERMS.comment, `${RDFHTML}CustomElement`].includes(quad.object.value)) {
        const candidate = candidates.get(quad.object.value) ?? { classIri: quad.object.value, definition: null, quads: [] };
        candidate.quads.push(quad);
        candidates.set(quad.object.value, candidate);
      }
    }
    if (candidates.size !== 1) {
      throw new RdfHtmlError(`${termLabel(node)} must have exactly one supported RDF/HTML node class.`);
    }
    const candidate = Array.from(candidates.values())[0]!;
    this.#consume(candidate.quads);
    return candidate;
  }

  #hasType(node: RdfHtmlNode, classIri: string): boolean {
    return this.#matches(node, TERMS.rdfType, DataFactory.namedNode(classIri)).length > 0;
  }

  #assertLeaf(node: RdfHtmlNode): void {
    if (this.#matches(node, TERMS.children, null).length > 0
      || this.#matches(node, TERMS.hasChild, null).length > 0
      || this.#matches(null, TERMS.childOf, node).length > 0) {
      throw new RdfHtmlError(`${termLabel(node)} is not a container and cannot have child nodes.`);
    }
  }

  #listedChildren(parent: RdfHtmlNode): RdfHtmlNode[] | null {
    const links = this.#matches(parent, TERMS.children, null);
    if (links.length === 0) return null;
    const heads = uniqueTerms(links);
    if (heads.length !== 1) throw new RdfHtmlError(`${termLabel(parent)} must have at most one rdfhtml:children list.`);
    this.#consume(links);

    const members: RdfHtmlNode[] = [];
    const memberIds = new Set<string>();
    const cells = new Set<string>();
    let current: RDF.Term = heads[0]!;
    while (!sameTerm(current, DataFactory.namedNode(TERMS.rdfNil))) {
      if (!isNode(current)) throw new RdfHtmlError(`${termLabel(parent)} rdfhtml:children must point to a well-formed RDF list.`);
      const cellId = termLabel(current);
      if (cells.has(cellId)) throw new RdfHtmlError(`${termLabel(parent)} rdfhtml:children list contains an rdf:rest cycle.`);
      cells.add(cellId);

      const first = this.#matches(current, TERMS.rdfFirst, null);
      const rest = this.#matches(current, TERMS.rdfRest, null);
      const firstValues = uniqueTerms(first);
      const restValues = uniqueTerms(rest);
      if (firstValues.length !== 1 || restValues.length !== 1) {
        throw new RdfHtmlError(`${termLabel(parent)} rdfhtml:children list cell ${cellId} must have exactly one rdf:first and one rdf:rest.`);
      }
      if (!isNode(firstValues[0]!) || !isNode(restValues[0]!)) {
        throw new RdfHtmlError(`${termLabel(parent)} rdfhtml:children list must contain only resource child nodes and resource list links.`);
      }
      this.#consume([...first, ...rest]);
      this.#consume(this.#matches(current, TERMS.rdfType, DataFactory.namedNode(TERMS.rdfList)));

      const member = firstValues[0]! as RdfHtmlNode;
      const memberId = termLabel(member);
      if (memberIds.has(memberId)) throw new RdfHtmlError(`${termLabel(parent)} rdfhtml:children list repeats ${memberId}.`);
      memberIds.add(memberId);
      members.push(member);
      current = restValues[0]!;
    }
    return members;
  }

  #childNodes(parent: RdfHtmlNode): RdfHtmlNode[] {
    const listed = this.#listedChildren(parent);
    const childQuads = this.#matches(parent, TERMS.hasChild, null);
    const childOfQuads = this.#matches(null, TERMS.childOf, parent);
    if (listed === null && childQuads.length === 0 && childOfQuads.length === 0) return [];
    if (childQuads.some((quad) => !isNode(quad.object))) {
      throw new RdfHtmlError(`${termLabel(parent)} has a non-resource rdfhtml:hasChild value.`);
    }
    if (childOfQuads.some((quad) => !isNode(quad.subject))) {
      throw new RdfHtmlError(`${termLabel(parent)} has a non-resource inverse rdfhtml:childOf subject.`);
    }
    this.#consume([...childQuads, ...childOfQuads]);

    const byId = new Map<string, RdfHtmlNode>();
    const pending: RdfHtmlNode[] = [];
    for (const child of [
      ...(listed ?? []),
      ...childQuads.map((quad) => quad.object as RdfHtmlNode),
      ...childOfQuads.map((quad) => quad.subject as RdfHtmlNode),
    ]) {
      const id = termLabel(child);
      if (!byId.has(id)) pending.push(child);
      byId.set(id, child);
    }

    const immediateEdges = new Map<string, { from: RdfHtmlNode; to: RdfHtmlNode }>();
    const precedenceEdges = new Map<string, { from: RdfHtmlNode; to: RdfHtmlNode }>();
    for (let index = 1; index < (listed?.length ?? 0); index += 1) {
      const from = listed![index - 1]!;
      const to = listed![index]!;
      const key = `${termLabel(from)}\u0000${termLabel(to)}`;
      immediateEdges.set(key, { from, to });
      precedenceEdges.set(key, { from, to });
    }
    const expanded = new Set<string>();
    while (pending.length > 0) {
      const current = pending.shift()!;
      const id = termLabel(current);
      if (expanded.has(id)) continue;
      expanded.add(id);
      const connected = [
        ...this.#matches(current, TERMS.immediatelyPrecedes, null).map((quad) => ({ quad, from: quad.subject, to: quad.object, immediate: true })),
        ...this.#matches(null, TERMS.immediatelyPrecedes, current).map((quad) => ({ quad, from: quad.subject, to: quad.object, immediate: true })),
        ...this.#matches(current, TERMS.immediatelyFollows, null).map((quad) => ({ quad, from: quad.object, to: quad.subject, immediate: true })),
        ...this.#matches(null, TERMS.immediatelyFollows, current).map((quad) => ({ quad, from: quad.object, to: quad.subject, immediate: true })),
        ...this.#matches(current, TERMS.precedes, null).map((quad) => ({ quad, from: quad.subject, to: quad.object, immediate: false })),
        ...this.#matches(null, TERMS.precedes, current).map((quad) => ({ quad, from: quad.subject, to: quad.object, immediate: false })),
        ...this.#matches(current, TERMS.follows, null).map((quad) => ({ quad, from: quad.object, to: quad.subject, immediate: false })),
        ...this.#matches(null, TERMS.follows, current).map((quad) => ({ quad, from: quad.object, to: quad.subject, immediate: false })),
      ];
      this.#consume(connected.map(({ quad }) => quad));
      for (const edge of connected) {
        if (!isNode(edge.from) || !isNode(edge.to)) {
          throw new RdfHtmlError(`${id} has an ordering edge to a non-resource node.`);
        }
        const from = edge.from as RdfHtmlNode;
        const to = edge.to as RdfHtmlNode;
        const key = `${termLabel(from)}\u0000${termLabel(to)}`;
        precedenceEdges.set(key, { from, to });
        if (edge.immediate) immediateEdges.set(key, { from, to });
        for (const member of [from, to]) {
          const memberId = termLabel(member);
          if (!byId.has(memberId)) pending.push(member);
          byId.set(memberId, member);
        }
      }
    }

    const members = Array.from(byId.values());
    if (listed !== null) {
      const listedIds = new Set(listed.map(termLabel));
      const extras = members.filter((member) => !listedIds.has(termLabel(member)));
      if (extras.length > 0) {
        throw new RdfHtmlError(`${termLabel(parent)} rdfhtml:children is complete but flat assertions add ${extras.map(termLabel).join(", ")}.`);
      }
    }

    const immediateOutgoing = new Map<string, RdfHtmlNode>();
    const immediateIncoming = new Map<string, RdfHtmlNode>();
    for (const edge of immediateEdges.values()) {
      const from = termLabel(edge.from);
      const to = termLabel(edge.to);
      if (from === to) throw new RdfHtmlError(`${termLabel(parent)} contains a reflexive immediate-ordering edge.`);
      const existingSuccessor = immediateOutgoing.get(from);
      const existingPredecessor = immediateIncoming.get(to);
      if ((existingSuccessor && !sameTerm(existingSuccessor, edge.to)) || (existingPredecessor && !sameTerm(existingPredecessor, edge.from))) {
        throw new RdfHtmlError(`${termLabel(parent)} has a branching or merging immediate child chain.`);
      }
      immediateOutgoing.set(from, edge.to);
      immediateIncoming.set(to, edge.from);
    }

    const blocks: RdfHtmlNode[][] = [];
    const blockByMember = new Map<string, number>();
    const positionByMember = new Map<string, number>();
    for (const head of members.filter((member) => !immediateIncoming.has(termLabel(member)))) {
      const block: RdfHtmlNode[] = [];
      let current: RdfHtmlNode | undefined = head;
      while (current) {
        const id = termLabel(current);
        if (blockByMember.has(id)) throw new RdfHtmlError(`${termLabel(parent)} contains an immediate-ordering cycle.`);
        blockByMember.set(id, blocks.length);
        positionByMember.set(id, block.length);
        block.push(current);
        current = immediateOutgoing.get(id);
      }
      blocks.push(block);
    }
    if (blockByMember.size !== members.length) {
      throw new RdfHtmlError(`${termLabel(parent)} contains an immediate-ordering cycle.`);
    }

    const blockSuccessors = blocks.map(() => new Set<number>());
    const blockIndegrees = blocks.map(() => 0);
    for (const edge of precedenceEdges.values()) {
      const from = termLabel(edge.from);
      const to = termLabel(edge.to);
      if (from === to) throw new RdfHtmlError(`${termLabel(parent)} contains a reflexive precedence edge.`);
      const fromBlock = blockByMember.get(from)!;
      const toBlock = blockByMember.get(to)!;
      if (fromBlock === toBlock) {
        if (positionByMember.get(from)! >= positionByMember.get(to)!) {
          throw new RdfHtmlError(`${termLabel(parent)} has a broad precedence constraint that contradicts immediate adjacency.`);
        }
        continue;
      }
      if (!blockSuccessors[fromBlock]!.has(toBlock)) {
        blockSuccessors[fromBlock]!.add(toBlock);
        blockIndegrees[toBlock]! += 1;
      }
    }

    const ready = blockIndegrees.flatMap((indegree, index) => indegree === 0 ? [index] : []);
    const orderedBlocks: number[] = [];
    while (orderedBlocks.length < blocks.length) {
      if (ready.length === 0) throw new RdfHtmlError(`${termLabel(parent)} contains a strict-ordering cycle.`);
      if (ready.length > 1) {
        throw new RdfHtmlError(`${termLabel(parent)} precedence constraints do not determine a unique child order.`);
      }
      const block = ready.pop()!;
      orderedBlocks.push(block);
      for (const successor of blockSuccessors[block]!) {
        blockIndegrees[successor]! -= 1;
        if (blockIndegrees[successor] === 0) ready.push(successor);
      }
    }
    const ordered = orderedBlocks.flatMap((block) => blocks[block]!);

    const orderingTypes = this.#matches(parent, TERMS.rdfType, DataFactory.namedNode(TERMS.totalOrdering));
    this.#consume(orderingTypes);
    for (const member of members) {
      const comparableTypes = this.#matches(member, TERMS.rdfType, DataFactory.namedNode(TERMS.comparable));
      this.#consume(comparableTypes);
      const orderingMembership = this.#matches(member, TERMS.inOrdering, parent);
      this.#consume(orderingMembership);
      const id = termLabel(member);
      const existingParent = this.#parents.get(id);
      if (existingParent && existingParent !== termLabel(parent)) throw new RdfHtmlError(`${id} appears beneath more than one RDF/HTML parent.`);
      this.#parents.set(id, termLabel(parent));
    }
    return ordered;
  }

  #attributes(element: RdfHtmlNode): string {
    const links = this.#matches(element, TERMS.attribute, null);
    this.#consume(links);
    const attributes = new Map<string, { name: string; value: string }>();
    const addAttribute = (name: string, value: string, namespace: RDF.Term | null, node: string): void => {
      if (!/^[^\s"'<>/=]+$/.test(name)) throw new RdfHtmlError(`Invalid HTML attribute name ${JSON.stringify(name)}.`);
      const identity = `${namespace?.value ?? ""}\u0000${name.toLowerCase()}`;
      const existing = attributes.get(identity);
      if (existing) {
        if (existing.value !== value) throw new RdfHtmlError(`${termLabel(element)} declares conflicting ${JSON.stringify(name)} attribute values.`);
        return;
      }
      if (namespace) throw new RdfHtmlError(`The string serializer cannot faithfully recreate the namespace binding for ${name} on ${node}.`);
      attributes.set(identity, { name, value });
    };

    const directByDefinition = new Map<string, RDF.Quad[]>();
    for (const quad of this.#matches(element, null, null)) {
      const definition = ATTRIBUTE_BY_DEFINITION_IRI.get(quad.predicate.value);
      if (!definition) continue;
      const direct = directByDefinition.get(definition.definitionIri) ?? [];
      direct.push(quad);
      directByDefinition.set(definition.definitionIri, direct);
    }
    for (const [definitionIri, direct] of directByDefinition) {
      const definition = ATTRIBUTE_BY_DEFINITION_IRI.get(definitionIri)!;
      this.#consume(direct);
      if (direct.some((quad) => quad.object.termType !== "Literal")) {
        throw new RdfHtmlError(`${termLabel(element)} <${definition.definitionIri}> must be an xsd:string literal.`);
      }
      const values = direct.map((quad) => quad.object).filter((value): value is RDF.Literal => value.termType === "Literal");
      if (values.some((value) => value.language || value.datatype.value !== `${XSD}string`)) {
        throw new RdfHtmlError(`${termLabel(element)} <${definition.definitionIri}> must be an xsd:string literal without language or direction.`);
      }
      const distinctValues = new Set(values.map((value) => value.value));
      if (distinctValues.size !== 1) throw new RdfHtmlError(`${termLabel(element)} declares conflicting ${JSON.stringify(definition.localName)} attribute values.`);
      addAttribute(definition.localName, values[0]!.value, null, termLabel(element));
    }

    for (const link of links) {
      if (!isNode(link.object)) throw new RdfHtmlError(`${termLabel(element)} has a non-resource rdfhtml:attribute value.`);
      const definition = this.#singleObject(link.object, TERMS.attributeDefinition, false, "NamedNode");
      const known = definition?.termType === "NamedNode"
        ? ATTRIBUTE_BY_DEFINITION_IRI.get(definition.value)
        : undefined;
      if (definition && !known) throw new RdfHtmlError(`${termLabel(link.object)} uses unknown HTML attribute definition ${termLabel(definition)}.`);
      const explicitName = this.#singleObject(link.object, TERMS.attributeName, !known, "Literal");
      if (known && explicitName && explicitName.value.toLowerCase() !== known.localName) {
        throw new RdfHtmlError(`${termLabel(link.object)} definition maps to ${JSON.stringify(known.localName)} but rdfhtml:attributeName is ${JSON.stringify(explicitName.value)}.`);
      }
      const name = known?.localName ?? explicitName?.value;
      const value = this.#singleObject(link.object, TERMS.attributeValue, true, "Literal");
      const namespace = this.#singleObject(link.object, TERMS.attributeNamespace, false);
      if (!name || !value || value.termType !== "Literal") continue;
      if (known && namespace) throw new RdfHtmlError(`${termLabel(link.object)} uses a known HTML attribute definition with a namespace.`);
      addAttribute(name, value.value, namespace, termLabel(link.object));
      const attributeTypes = this.#matches(link.object, TERMS.rdfType, DataFactory.namedNode(`${RDFHTML}Attribute`));
      this.#consume(attributeTypes);
    }
    return attributes.size
      ? ` ${Array.from(attributes.values(), ({ name, value }) => `${name}="${escapeAttribute(value)}"`).join(" ")}`
      : "";
  }

  #renderNode(node: RdfHtmlNode, ancestors: Set<string>, rawTextTag?: string): string {
    const id = termLabel(node);
    if (ancestors.has(id)) throw new RdfHtmlError(`RDF/HTML child structure contains a cycle at ${id}.`);
    const nextAncestors = new Set(ancestors).add(id);
    const type = this.#structuralType(node);

    if (type.classIri === TERMS.text) {
      this.#assertLeaf(node);
      const data = this.#singleObject(node, TERMS.data, true, "Literal");
      const value = data?.value ?? "";
      if (rawTextTag) {
        if (new RegExp(`</${rawTextTag}(?:[\\s/>]|$)`, "i").test(value)) {
          throw new RdfHtmlError(`${id} contains a closing ${rawTextTag} sequence that cannot be serialized without changing the DOM.`);
        }
        return value;
      }
      return escapeHtml(value);
    }
    if (type.classIri === TERMS.comment) {
      this.#assertLeaf(node);
      const data = this.#singleObject(node, TERMS.data, true, "Literal");
      const value = data?.value ?? "";
      if (value.includes("--") || value.endsWith("-")) throw new RdfHtmlError(`${id} is not serializable as an HTML comment.`);
      return `<!--${value}-->`;
    }
    if (type.classIri === TERMS.documentType) {
      this.#assertLeaf(node);
      const name = this.#singleObject(node, TERMS.documentTypeName, true, "Literal");
      if (!name || !/^[A-Za-z][A-Za-z0-9:_-]*$/.test(name.value)) throw new RdfHtmlError(`${id} has an invalid document type name.`);
      return `<!doctype ${escapeAttribute(name.value)}>`;
    }
    if (type.classIri === TERMS.document) {
      const children = this.#childNodes(node);
      if (children.filter((child) => this.#hasType(child, `${RDFHTML}Html`)).length !== 1) {
        throw new RdfHtmlError(`${id} must contain exactly one rdfhtml:Html child.`);
      }
      if (children.filter((child) => this.#hasType(child, TERMS.documentType)).length > 1) {
        throw new RdfHtmlError(`${id} must contain at most one rdfhtml:DocumentType child.`);
      }
      return children.map((child) => this.#renderNode(child, nextAncestors)).join("");
    }

    let tagName = type.definition?.tagName;
    let kind = type.definition?.kind;
    if (type.classIri === `${RDFHTML}CustomElement`) {
      const localName = this.#singleObject(node, TERMS.localName, true, "Literal");
      tagName = localName?.value;
      kind = "normal";
      if (!tagName || !/^[a-z][.0-9_a-z-]*-[.0-9_a-z-]*$/.test(tagName)) throw new RdfHtmlError(`${id} has an invalid custom-element local name.`);
      const namespace = this.#singleObject(node, TERMS.namespace, false);
      if (namespace) throw new RdfHtmlError(`${id} is an HTML custom element and cannot declare a foreign namespace in the string serializer.`);
    }
    if (!tagName || !kind) throw new RdfHtmlError(`${id} has an unsupported RDF/HTML element class.`);

    const attributes = this.#attributes(node);
    const children = this.#childNodes(node);
    if (tagName === "html") {
      if (children.filter((child) => this.#hasType(child, `${RDFHTML}Head`)).length !== 1
        || children.filter((child) => this.#hasType(child, `${RDFHTML}Body`)).length !== 1) {
        throw new RdfHtmlError(`${id} must contain exactly one rdfhtml:Head child and one rdfhtml:Body child.`);
      }
    }
    if (kind === "void") {
      if (children.length) throw new RdfHtmlError(`${id} is a void ${tagName} element and cannot have children.`);
      return `<${tagName}${attributes}>`;
    }
    const content = children.map((child) => this.#renderNode(child, nextAncestors, kind === "raw-text" ? tagName : undefined)).join("");
    return `<${tagName}${attributes}>${content}</${tagName}>`;
  }

  render(descriptor: RdfHtmlDocumentDescriptor): RenderedRdfHtmlDocument {
    if (!descriptor.baseIRI) throw new RdfHtmlError(`${descriptor.nodeId} must declare exactly one named rdfhtml:base IRI.`);
    const baseQuads = this.#matches(descriptor.node, TERMS.base, null);
    const bases = uniqueTerms(baseQuads);
    if (bases.length !== 1 || bases[0]!.termType !== "NamedNode") {
      throw new RdfHtmlError(`${descriptor.nodeId} must declare exactly one named rdfhtml:base IRI.`);
    }
    this.#consume(baseQuads);
    const vocabularyQuads = this.#matches(descriptor.node, TERMS.conformsTo, DataFactory.namedNode(HTML_VOCABULARY_IRI));
    if (vocabularyQuads.length === 0) {
      throw new RdfHtmlError(`${descriptor.nodeId} must declare dcterms:conformsTo <${HTML_VOCABULARY_IRI}>.`);
    }
    this.#consume(vocabularyQuads);
    const html = this.#renderNode(descriptor.node, new Set());
    const preservedQuads = this.#quads.filter((quad) => !this.#consumed.has(quad));
    const preservedHtml = quadsToHtmlRdf(preservedQuads);
    const publicationHtml = embedHtmlRdf(html, preservedHtml);
    return {
      baseIRI: descriptor.baseIRI,
      consumedQuads: this.#quads.filter((quad) => this.#consumed.has(quad)),
      descriptor,
      html,
      publicationHtml,
      preservedHtml,
      preservedQuads,
      warnings: this.#warnings,
    };
  }
}

export function embedHtmlRdf(html: string, preservedHtml: string): string {
  if (!preservedHtml) return html;
  const opening = /<html(?:\s[^>]*)?>/i.exec(html);
  const htmlWithVersion = !opening || /\srdf-version\s*=/i.test(opening[0])
    ? html
    : `${html.slice(0, opening.index + 5)} rdf-version="1.2"${html.slice(opening.index + 5)}`;
  const island = `<div hidden data-rdfhtml-preserved>\n${preservedHtml}\n</div>`;
  const lower = htmlWithVersion.toLowerCase();
  const bodyEnd = lower.lastIndexOf("</body>");
  if (bodyEnd >= 0) return `${htmlWithVersion.slice(0, bodyEnd)}${island}${htmlWithVersion.slice(bodyEnd)}`;
  const htmlEnd = lower.lastIndexOf("</html>");
  if (htmlEnd >= 0) return `${htmlWithVersion.slice(0, htmlEnd)}${island}${htmlWithVersion.slice(htmlEnd)}`;
  return `${htmlWithVersion}${island}`;
}

export function renderRdfHtmlDocument(
  dataset: RdfHtmlDataset,
  descriptor: RdfHtmlDocumentDescriptor,
): RenderedRdfHtmlDocument {
  return new Renderer(dataset).render(descriptor);
}
