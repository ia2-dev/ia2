import type { HtmlToRdfHtmlOptions } from "./model.js";
import { ATTRIBUTE_BY_LOCAL_NAME, HTML_ELEMENTS, HTML_VOCABULARY_IRI } from "./generated/elements.js";

const HTML_NAMESPACE = "http://www.w3.org/1999/xhtml";
const ELEMENT_CLASS = new Map(HTML_ELEMENTS.map((element) => [element.tagName, element.classIri.split("#").at(-1)!]));

function turtleString(value: string): string {
  return JSON.stringify(value).replaceAll("\u2028", "\\u2028").replaceAll("\u2029", "\\u2029");
}

function iri(value: string, label: string): string {
  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    throw new TypeError(`${label} must be an absolute IRI.`);
  }
  if (!parsed.protocol) throw new TypeError(`${label} must be an absolute IRI.`);
  return `<${value.replaceAll(">", "%3E")}>`;
}

function indentation(depth: number): string {
  return "    ".repeat(depth);
}

interface Property {
  object: string;
  predicate: string;
}

function propertyBlock(properties: readonly Property[], depth: number, terminal: string): string {
  const pad = indentation(depth);
  return properties.map((property, index) => (
    `${pad}${property.predicate} ${property.object}${index === properties.length - 1 ? terminal : " ;"}`
  )).join("\n");
}

function attributeNode(attribute: Attr, depth: number): string {
  const properties: Property[] = [
    { predicate: "a", object: "rdfhtml:Attribute" },
    { predicate: "rdfhtml:attributeName", object: turtleString(attribute.name) },
    { predicate: "rdfhtml:attributeValue", object: turtleString(attribute.value) },
  ];
  if (attribute.namespaceURI) {
    properties.push({ predicate: "rdfhtml:attributeNamespace", object: iri(attribute.namespaceURI, "Attribute namespace") });
  }
  return `[\n${propertyBlock(properties, depth + 1, "")}\n${indentation(depth)}]`;
}

function childNodes(node: Node): readonly Node[] {
  if (node.nodeType === 1 && (node as Element).localName === "template") {
    const content = (node as HTMLTemplateElement).content;
    return Array.from(content.childNodes);
  }
  return Array.from(node.childNodes);
}

function structuralProperties(node: Node, depth: number): Property[] {
  if (node.nodeType === 10) {
    return [
      { predicate: "a", object: "rdfhtml:DocumentType" },
      { predicate: "rdfhtml:documentTypeName", object: turtleString((node as DocumentType).name) },
    ];
  }
  if (node.nodeType === 3) {
    return [
      { predicate: "a", object: "rdfhtml:Text" },
      { predicate: "rdfhtml:data", object: turtleString(node.nodeValue ?? "") },
    ];
  }
  if (node.nodeType === 8) {
    return [
      { predicate: "a", object: "rdfhtml:Comment" },
      { predicate: "rdfhtml:data", object: turtleString(node.nodeValue ?? "") },
    ];
  }
  if (node.nodeType !== 1) throw new TypeError(`Unsupported DOM node type ${node.nodeType}.`);

  const element = node as Element;
  if (element.namespaceURI !== HTML_NAMESPACE) {
    throw new TypeError(`Only HTML-namespace elements are supported; found ${element.namespaceURI ?? "no namespace"}:${element.localName}.`);
  }
  const className = ELEMENT_CLASS.get(element.localName);
  if (!className && !element.localName.includes("-")) {
    throw new TypeError(`Unsupported HTML element <${element.localName}> is not in the current vocabulary snapshot.`);
  }
  const properties: Property[] = className
    ? [{ predicate: "a", object: `rdfhtml:${className}` }]
    : [{ predicate: "a", object: "rdfhtml:CustomElement" }, { predicate: "rdfhtml:localName", object: turtleString(element.localName) }];
  for (const attribute of Array.from(element.attributes)) {
    const known = attribute.namespaceURI === null ? ATTRIBUTE_BY_LOCAL_NAME.get(attribute.name) : undefined;
    properties.push(known
      ? { predicate: `rdfhtml:${known.termName}`, object: turtleString(attribute.value) }
      : { predicate: "rdfhtml:attribute", object: attributeNode(attribute, depth + 1) });
  }
  const children = childNodes(element);
  if (children.length > 0) properties.push({ predicate: "rdfhtml:children", object: nodeList(children, depth + 1) });
  return properties;
}

function nodeDescription(node: Node, depth: number): string {
  const properties = structuralProperties(node, depth);
  return `[\n${propertyBlock(properties, depth + 1, "")}\n${indentation(depth)}]`;
}

function nodeList(nodes: readonly Node[], depth: number): string {
  if (nodes.length === 0) throw new TypeError("Cannot serialize an empty child list.");
  return `(\n${nodes.map((node) => `${indentation(depth + 1)}${nodeDescription(node, depth + 1)}`).join("\n")}\n${indentation(depth)})`;
}

export function htmlDocumentToRdfHtml(document: Document, options: HtmlToRdfHtmlOptions): string {
  const documentIRI = iri(options.documentIRI, "Document IRI");
  const baseIRI = iri(options.baseIRI, "Document base IRI");
  const nodes = Array.from(document.childNodes).filter((node) => [1, 8, 10].includes(node.nodeType));
  if (nodes.length === 0 || !nodes.some((node) => node.nodeType === 1 && (node as Element).localName === "html")) {
    throw new TypeError("The source DOM must contain an html document element.");
  }

  const properties: Property[] = [
    { predicate: "a", object: "rdfhtml:Document" },
    { predicate: "rdfhtml:base", object: baseIRI },
    { predicate: "dcterms:conformsTo", object: iri(HTML_VOCABULARY_IRI, "RDF/HTML vocabulary IRI") },
    { predicate: "dcterms:title", object: turtleString(options.title || document.title || options.documentIRI) },
  ];
  if (options.sourceIRI) properties.push({ predicate: "dcterms:source", object: iri(options.sourceIRI, "Source IRI") });
  if (options.licenseIRI) properties.push({ predicate: "dcterms:license", object: iri(options.licenseIRI, "License IRI") });
  if (options.attribution) properties.push({ predicate: "dcterms:creator", object: turtleString(options.attribution) });
  if (options.description) properties.push({ predicate: "dcterms:description", object: turtleString(options.description) });
  properties.push({ predicate: "rdfhtml:children", object: nodeList(nodes, 1) });

  return `@prefix rdfhtml: <https://ia2.dev/spec/rdf-html#> .\n@prefix dcterms: <http://purl.org/dc/terms/> .\n\n${documentIRI}\n${propertyBlock(properties, 1, " .")}\n`;
}
