import { readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { Parser } from "n3";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dataDirectory = resolve(root, "data");
const snapshots = (await readdir(dataDirectory))
  .filter((name) => /^html-elements-\d{4}-\d{2}-\d{2}\.json$/.test(name))
  .sort();
if (snapshots.length === 0) throw new Error("No dated HTML element snapshot is available.");
const snapshotFile = snapshots.at(-1);
const inputPath = resolve(dataDirectory, snapshotFile);
const tsPath = resolve(root, "src/generated/elements.ts");
const specPath = resolve(root, "../../specs/rdf-html/index.html");
const check = process.argv.includes("--check");
const snapshot = JSON.parse(await readFile(inputPath, "utf8"));
const ttlPath = resolve(root, `vocabulary/rdf-html-${snapshot.snapshotDate}.ttl`);
const namespace = "https://ia2.dev/spec/rdf-html#";

function className(name) {
  return `${name[0].toUpperCase()}${name.slice(1)}`;
}

function turtleString(value) {
  return JSON.stringify(value);
}

function html(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

if (snapshot.schemaVersion !== 4) throw new Error(`Unsupported HTML classification snapshot schema: ${snapshot.schemaVersion}.`);
if (!/^\d{4}-\d{2}-\d{2}$/.test(snapshot.snapshotDate)) throw new Error("Snapshot date must use YYYY-MM-DD.");
for (const [key, source] of Object.entries(snapshot.sources ?? {})) {
  if (!source.url?.startsWith("https://") || !/^[a-f0-9]{64}$/.test(source.sha256 ?? "")) {
    throw new Error(`Invalid ${key} source provenance.`);
  }
}
const requiredSources = ["elementIndex", "attributeIndex", "contentCategoryIndex", "syntaxKinds", "webIdl"];
if (requiredSources.some((key) => !snapshot.sources[key])) throw new Error("Snapshot is missing an authoritative source.");

const validKinds = new Set(["normal", "void", "template", "raw-text", "escapable-raw-text", "foreign"]);
const kindDefinitions = new Map(snapshot.syntaxKinds.map((kind) => [kind.name, kind]));
if (kindDefinitions.size !== 6 || [...validKinds].some((kind) => !kindDefinitions.has(kind))) {
  throw new Error("Snapshot must define all six HTML syntax kinds.");
}
const categoryDefinitions = new Map(snapshot.contentCategories.map((category) => [category.name, category]));
if (categoryDefinitions.size !== snapshot.contentCategories.length || categoryDefinitions.size < 14) {
  throw new Error("Snapshot contains duplicate or implausibly few content categories.");
}

const seen = new Set();
for (const element of snapshot.elements) {
  if (!/^[a-z][a-z0-9]*$/.test(element.name)) throw new Error(`Invalid element name: ${element.name}`);
  if (seen.has(element.name)) throw new Error(`Duplicate element name: ${element.name}`);
  if (!validKinds.has(element.kind) || element.kind === "foreign") throw new Error(`Invalid HTML-namespace element kind for ${element.name}: ${element.kind}`);
  if (!element.source?.startsWith("https://") || !element.kindSource?.startsWith("https://")) {
    throw new Error(`Element ${element.name} is missing source provenance.`);
  }
  const memberships = new Set();
  for (const membership of element.categories) {
    if (!categoryDefinitions.has(membership.name)) throw new Error(`Unknown category ${membership.name} on ${element.name}.`);
    if (memberships.has(membership.name)) throw new Error(`Duplicate category ${membership.name} on ${element.name}.`);
    memberships.add(membership.name);
    if (membership.conditional) {
      if (!membership.conditionId || (!membership.conditionText && !membership.indexNotation)) {
        throw new Error(`Conditional category ${membership.name} on ${element.name} lacks its source condition.`);
      }
    } else if (membership.conditionId || membership.conditionText || membership.indexNotation) {
      throw new Error(`Unconditional category ${membership.name} on ${element.name} carries conditional fields.`);
    }
  }
  seen.add(element.name);
}
if (snapshot.elements.length < 100 || !seen.has("selectedcontent") || seen.has("keygen")) {
  throw new Error("Snapshot element inventory is implausible or contains an obsolete element.");
}

const attributeNames = new Set();
const attributeTerms = new Set();
const attributeContextIds = new Set();
for (const attribute of snapshot.attributes ?? []) {
  if (!/^[a-z][a-z0-9-]*$/.test(attribute.name)) throw new Error(`Invalid attribute name: ${attribute.name}`);
  if (attributeNames.has(attribute.name)) throw new Error(`Duplicate attribute name: ${attribute.name}`);
  if (!/^[a-z][A-Za-z0-9]*$/.test(attribute.termName) || attributeTerms.has(attribute.termName)) {
    throw new Error(`Invalid or duplicate attribute definition term: ${attribute.termName}`);
  }
  if (!Array.isArray(attribute.idlReflections)) throw new Error(`Attribute ${attribute.name} lacks Web IDL reflection metadata.`);
  for (const reflection of attribute.idlReflections) {
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(reflection.idlName) || !reflection.sources.length || reflection.sources.some((source) => !source.startsWith("https://html.spec.whatwg.org/#"))) {
      throw new Error(`Attribute ${attribute.name} contains invalid Web IDL reflection provenance.`);
    }
  }
  if (!Array.isArray(attribute.contexts) || attribute.contexts.length === 0) throw new Error(`Attribute ${attribute.name} has no contexts.`);
  attributeNames.add(attribute.name);
  attributeTerms.add(attribute.termName);
  for (const context of attribute.contexts) {
    if (!context.id?.startsWith(`${attribute.name}-`) || attributeContextIds.has(context.id)) {
      throw new Error(`Invalid or duplicate attribute context: ${context.id}`);
    }
    if (context.global === (context.elements.length > 0 || context.specialParticipants.length > 0)) {
      throw new Error(`Attribute context ${context.id} has an inconsistent applicability scope.`);
    }
    if (!context.description || !context.valueSyntaxText || !context.source?.startsWith("https://")) {
      throw new Error(`Attribute context ${context.id} lacks descriptive provenance.`);
    }
    if (context.elements.some((name) => !seen.has(name))) throw new Error(`Attribute context ${context.id} names an unknown element.`);
    if (context.definitionSources.some((source) => !source.startsWith("https://")) || context.valueSyntaxSources.some((source) => !source.startsWith("https://"))) {
      throw new Error(`Attribute context ${context.id} contains a non-HTTPS source.`);
    }
    attributeContextIds.add(context.id);
  }
}
if (attributeNames.size < 125 || !attributeNames.has("href") || !attributeNames.has("writingsuggestions") || attributeNames.has("onclick")) {
  throw new Error("Snapshot attribute inventory is implausible or includes excluded event handlers.");
}

const kindClass = {
  "normal": "NormalElement",
  "void": "VoidElement",
  "template": "TemplateElement",
  "raw-text": "RawTextElement",
  "escapable-raw-text": "EscapableRawTextElement",
  "foreign": "ForeignElement",
};

const sourceSnapshots = Object.values(snapshot.sources).map((source) => `        [
            a rdfhtml:SourceSnapshot ;
            dcterms:source <${source.url}> ;
            rdfhtml:sha256 ${turtleString(source.sha256)}
        ]`).join(",\n");
const conformsTo = Object.values(snapshot.sources).map((source) => `<${source.url}>`).join(",\n        ");

const ttlHeader = `@prefix rdfhtml: <${namespace}> .
@prefix ord: <https://ontology.inferal.com/modules/ordering/> .
@prefix dcterms: <http://purl.org/dc/terms/> .
@prefix owl: <http://www.w3.org/2002/07/owl#> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

<${namespace.slice(0, -1)}>
    a owl:Ontology ;
    dcterms:title "IA² RDF/HTML vocabulary"@en ;
    dcterms:description "A dated, mechanically generated vocabulary for current HTML elements, attributes, syntax kinds, content categories, and DOM structure in RDF."@en ;
    dcterms:issued "${snapshot.snapshotDate}"^^xsd:date ;
    dcterms:conformsTo ${conformsTo} ;
    rdfhtml:sourceSnapshot
${sourceSnapshots} ;
    owl:versionInfo "0.1 (${snapshot.snapshotDate} HTML Living Standard snapshot)" .

rdfhtml:SourceSnapshot a owl:Class ; rdfs:label "source snapshot"@en .
rdfhtml:sourceSnapshot a owl:ObjectProperty ; rdfs:range rdfhtml:SourceSnapshot .
rdfhtml:sha256 a owl:DatatypeProperty ; rdfs:range xsd:string .
rdfhtml:ContentCategory a owl:Class ; rdfs:label "HTML content category"@en .
rdfhtml:ConditionalCategoryMembership a owl:Class ; rdfs:label "conditional category membership"@en .
rdfhtml:classifiedElementClass a owl:ObjectProperty ; rdfs:domain rdfhtml:ConditionalCategoryMembership ; rdfs:range owl:Class .
rdfhtml:category a owl:ObjectProperty ; rdfs:domain rdfhtml:ConditionalCategoryMembership ; rdfs:range owl:Class .
rdfhtml:conditionText a owl:DatatypeProperty ; rdfs:domain rdfhtml:ConditionalCategoryMembership ; rdfs:range xsd:string .
rdfhtml:indexNotation a owl:DatatypeProperty ; rdfs:domain rdfhtml:ConditionalCategoryMembership ; rdfs:range xsd:string .

rdfhtml:Node a owl:Class ; rdfs:label "DOM node"@en .
rdfhtml:Document a owl:Class ; rdfs:subClassOf rdfhtml:Node, ord:TotalOrdering ; rdfs:label "HTML document"@en .
rdfhtml:DocumentType a owl:Class ; rdfs:subClassOf rdfhtml:Node, ord:Comparable ; rdfs:label "document type"@en .
rdfhtml:Text a owl:Class ; rdfs:subClassOf rdfhtml:Node, ord:Comparable ; rdfs:label "text node"@en .
rdfhtml:Comment a owl:Class ; rdfs:subClassOf rdfhtml:Node, ord:Comparable ; rdfs:label "comment node"@en .
rdfhtml:Element a owl:Class ; rdfs:subClassOf rdfhtml:Node, ord:Comparable, ord:TotalOrdering ; rdfs:label "HTML element"@en .
rdfhtml:NormalElement a owl:Class ; rdfs:subClassOf rdfhtml:Element ; dcterms:source <${kindDefinitions.get("normal").source}> .
rdfhtml:VoidElement a owl:Class ; rdfs:subClassOf rdfhtml:Element ; dcterms:source <${kindDefinitions.get("void").source}> .
rdfhtml:TemplateElement a owl:Class ; rdfs:subClassOf rdfhtml:Element ; dcterms:source <${kindDefinitions.get("template").source}> .
rdfhtml:RawTextElement a owl:Class ; rdfs:subClassOf rdfhtml:Element ; dcterms:source <${kindDefinitions.get("raw-text").source}> .
rdfhtml:EscapableRawTextElement a owl:Class ; rdfs:subClassOf rdfhtml:Element ; dcterms:source <${kindDefinitions.get("escapable-raw-text").source}> .
rdfhtml:ForeignElement a owl:Class ; rdfs:subClassOf rdfhtml:Element ; dcterms:source <${kindDefinitions.get("foreign").source}> ; rdfs:comment "MathML and SVG namespace elements are a syntax kind recorded for provenance; generated named element classes cover only the HTML namespace."@en .
rdfhtml:CustomElement a owl:Class ; rdfs:subClassOf rdfhtml:Element ; rdfs:label "custom or future element"@en .
rdfhtml:Attribute a owl:Class ; rdfs:label "HTML attribute occurrence"@en .
rdfhtml:AttributeDefinition a owl:Class ; rdfs:label "indexed HTML attribute definition"@en .
rdfhtml:AttributeContext a owl:Class ; rdfs:label "HTML attribute applicability and value context"@en .

rdfhtml:hasChild a owl:ObjectProperty ;
    rdfs:domain rdfhtml:Node ;
    rdfs:range rdfhtml:Node ;
    rdfs:label "has child"@en ;
    owl:inverseOf rdfhtml:childOf ;
    owl:propertyChainAxiom ( rdfhtml:hasChild ord:immediatelyPrecedes ) ;
    owl:propertyChainAxiom ( rdfhtml:hasChild ord:precedes ) ;
    rdfs:comment "Associates a document or element with a direct child. Strict-precedence closure derives the remaining children in the same sibling ordering; immediate precedence additionally asserts adjacency."@en .
rdfhtml:childOf a owl:ObjectProperty ;
    rdfs:subPropertyOf ord:inOrdering ;
    rdfs:domain rdfhtml:Node ;
    rdfs:range rdfhtml:Node ;
    rdfs:label "child of"@en ;
    rdfs:comment "Inverse of rdfhtml:hasChild and a specialization of ordering-context membership."@en .
rdfhtml:children a owl:ObjectProperty ;
    rdfs:domain rdfhtml:Node ;
    rdfs:range rdf:List ;
    rdfs:label "ordered children"@en ;
    rdfs:comment "Links a document or element to one complete RDF list of its direct children. Processors normalize the list to child membership and immediate precedence before validation."@en .
rdfhtml:base a owl:ObjectProperty ; rdfs:domain rdfhtml:Document ; rdfs:label "document base IRI"@en .
rdfhtml:data a owl:DatatypeProperty ; rdfs:domain rdfhtml:Node ; rdfs:range xsd:string ; rdfs:label "node data"@en .
rdfhtml:documentTypeName a owl:DatatypeProperty ; rdfs:domain rdfhtml:DocumentType ; rdfs:range xsd:string .
rdfhtml:attribute a owl:ObjectProperty ; rdfs:domain rdfhtml:Element ; rdfs:range rdfhtml:Attribute .
rdfhtml:attributeName a owl:DatatypeProperty ; rdfs:domain rdfhtml:Attribute ; rdfs:range xsd:string .
rdfhtml:attributeValue a owl:DatatypeProperty ; rdfs:domain rdfhtml:Attribute ; rdfs:range xsd:string .
rdfhtml:attributeNamespace a owl:ObjectProperty ; rdfs:domain rdfhtml:Attribute .
rdfhtml:attributeDefinition a owl:ObjectProperty ; rdfs:domain rdfhtml:Attribute ; rdfs:range rdfhtml:AttributeDefinition .
rdfhtml:attributeContext a owl:ObjectProperty ; rdfs:domain rdfhtml:AttributeDefinition ; rdfs:range rdfhtml:AttributeContext .
rdfhtml:appliesTo a owl:ObjectProperty ; rdfs:domain rdfhtml:AttributeContext ; rdfs:range owl:Class .
rdfhtml:applicableParticipant a owl:DatatypeProperty ; rdfs:domain rdfhtml:AttributeContext ; rdfs:range xsd:string .
rdfhtml:globalAttribute a owl:DatatypeProperty ; rdfs:domain rdfhtml:AttributeContext ; rdfs:range xsd:boolean .
rdfhtml:valueSyntaxText a owl:DatatypeProperty ; rdfs:domain rdfhtml:AttributeContext ; rdfs:range xsd:string .
rdfhtml:definitionSource a owl:ObjectProperty ; rdfs:domain rdfhtml:AttributeContext .
rdfhtml:valueSyntaxSource a owl:ObjectProperty ; rdfs:domain rdfhtml:AttributeContext .
rdfhtml:localName a owl:DatatypeProperty ; rdfs:range xsd:string .
rdfhtml:namespace a owl:ObjectProperty .
rdfhtml:tagName a owl:AnnotationProperty ; rdfs:range xsd:string .
rdfhtml:attributeLocalName a owl:DatatypeProperty ; rdfs:domain rdfhtml:AttributeDefinition ; rdfs:range xsd:string .
rdfhtml:reflectedIdlName a owl:DatatypeProperty ; rdfs:domain rdfhtml:AttributeDefinition ; rdfs:range xsd:string .
rdfhtml:snapshotDate a owl:AnnotationProperty ; rdfs:range xsd:date .

`;

const ttlCategories = snapshot.contentCategories.map((category) => `rdfhtml:${category.className}
    a owl:Class, rdfhtml:ContentCategory ;
    dcterms:source <${category.source}> ;
    rdfs:label ${turtleString(category.label.toLowerCase())}@en .`).join("\n\n");

const ttlElements = snapshot.elements.map((element) => {
  const term = className(element.name);
  const superclasses = [kindClass[element.kind], ...element.categories
    .filter((membership) => !membership.conditional)
    .map((membership) => categoryDefinitions.get(membership.name).className)];
  return `rdfhtml:${term}
    a owl:Class ;
    rdfs:subClassOf ${superclasses.map((name) => `rdfhtml:${name}`).join(",\n        ")} ;
    rdfhtml:tagName ${turtleString(element.name)} ;
    rdfhtml:snapshotDate "${snapshot.snapshotDate}"^^xsd:date ;
    dcterms:source <${element.source}>, <${element.kindSource}> ;
    rdfs:label ${turtleString(`${element.name} element`)}@en .`;
}).join("\n\n");

const ttlAttributes = snapshot.attributes.map((attribute) => {
  const term = attribute.termName;
  const contexts = attribute.contexts.map((context) => `rdfhtml:attribute-context-${context.id}`);
  return `rdfhtml:${term}
    a rdfhtml:AttributeDefinition, owl:DatatypeProperty ;
    rdfs:domain rdfhtml:Element ;
    rdfs:range xsd:string ;
    rdfhtml:attributeLocalName ${turtleString(attribute.name)} ;
${attribute.idlReflections.map((reflection) => `    rdfhtml:reflectedIdlName ${turtleString(reflection.idlName)} ;`).join("\n")}${attribute.idlReflections.length ? "\n" : ""}    rdfhtml:attributeContext ${contexts.join(",\n        ")} ;
    rdfhtml:snapshotDate "${snapshot.snapshotDate}"^^xsd:date ;
    dcterms:source <${snapshot.sources.attributeIndex.url}>${attribute.idlReflections.flatMap((reflection) => reflection.sources).map((source) => `,\n        <${source}>`).join("")} ;
    rdfs:label ${turtleString(`${attribute.name} attribute`)}@en .`;
}).join("\n\n");

const ttlAttributeContexts = snapshot.attributes.flatMap((attribute) => attribute.contexts.map((context) => {
  const appliesTo = context.global ? ["rdfhtml:Element"] : context.elements.map((name) => `rdfhtml:${className(name)}`);
  const lines = [
    `    a rdfhtml:AttributeContext ;`,
    `    rdfhtml:attributeDefinition rdfhtml:${attribute.termName} ;`,
    `    rdfhtml:globalAttribute ${context.global ? "true" : "false"} ;`,
    ...(appliesTo.length ? [`    rdfhtml:appliesTo ${appliesTo.join(",\n        ")} ;`] : []),
    ...(context.specialParticipants.length ? [`    rdfhtml:applicableParticipant ${context.specialParticipants.map(turtleString).join(", ")} ;`] : []),
    `    rdfhtml:valueSyntaxText ${turtleString(context.valueSyntaxText)} ;`,
    ...context.definitionSources.map((source) => `    rdfhtml:definitionSource <${source}> ;`),
    ...context.valueSyntaxSources.map((source) => `    rdfhtml:valueSyntaxSource <${source}> ;`),
    `    dcterms:description ${turtleString(context.description)}@en ;`,
    `    dcterms:source <${context.source}> .`,
  ];
  return `rdfhtml:attribute-context-${context.id}\n${lines.join("\n")}`;
})).join("\n\n");

const conditionalMemberships = [
  ...snapshot.elements.flatMap((element) => element.categories
    .filter((membership) => membership.conditional)
    .map((membership) => ({ elementClass: className(element.name), ...membership }))),
  ...snapshot.specialParticipants.flatMap((participant) => participant.categories
    .filter((membership) => membership.conditional && participant.id === "text")
    .map((membership) => ({ elementClass: "Text", ...membership }))),
];
const ttlConditions = conditionalMemberships.map((membership) => {
  const category = categoryDefinitions.get(membership.name);
  return `rdfhtml:condition-${membership.conditionId}
    a rdfhtml:ConditionalCategoryMembership ;
    dcterms:identifier ${turtleString(membership.conditionId)} ;
    dcterms:source <${membership.source}> ;
    rdfhtml:classifiedElementClass rdfhtml:${membership.elementClass} ;
    rdfhtml:category rdfhtml:${category.className} ;${membership.conditionText ? `\n    rdfhtml:conditionText ${turtleString(membership.conditionText)} ;` : ""}
    rdfhtml:indexNotation ${turtleString(membership.indexNotation)} .`;
}).join("\n\n");

const ttl = `${ttlHeader}${ttlCategories}\n\n${ttlElements}\n\n${ttlAttributes}\n\n${ttlAttributeContexts}\n\n${ttlConditions}\n`;

const embeddedVocabularyStart = "    <!-- BEGIN GENERATED RDF/HTML HTML/RDF VOCABULARY -->";
const embeddedVocabularyEnd = "    <!-- END GENERATED RDF/HTML HTML/RDF VOCABULARY -->";
const ontologyIri = namespace.slice(0, -1);
const xsdString = "http://www.w3.org/2001/XMLSchema#string";
const embeddedBlankKeys = new Map();

function embeddedIri(iri) {
  if (iri === ontologyIri) return "";
  return iri.startsWith(namespace) ? `#${iri.slice(namespace.length)}` : iri;
}

function embeddedBlankKey(term) {
  let key = embeddedBlankKeys.get(term.value);
  if (!key) {
    key = `rdfhtml-vocabulary-${embeddedBlankKeys.size + 1}`;
    embeddedBlankKeys.set(term.value, key);
  }
  return key;
}

function embeddedSubject(term) {
  if (term.termType === "NamedNode") return `rdf-subject="${html(embeddedIri(term.value))}"`;
  if (term.termType === "BlankNode") return `rdf-subject-key="${html(embeddedBlankKey(term))}"`;
  throw new Error(`Unsupported embedded vocabulary subject: ${term.termType}.`);
}

function embeddedVocabularyCarrier(quad) {
  if (quad.graph.termType !== "DefaultGraph") throw new Error("The generated RDF/HTML vocabulary must use the default graph.");
  const subject = embeddedSubject(quad.subject);
  const predicate = `rdf-predicate="${html(embeddedIri(quad.predicate.value))}"`;
  if (quad.object.termType === "NamedNode") {
    return `      <link hidden href="${html(embeddedIri(quad.object.value))}" ${subject} ${predicate}>`;
  }
  if (quad.object.termType === "BlankNode") {
    return `      <meta hidden ${subject} ${predicate} rdf-object-key="${html(embeddedBlankKey(quad.object))}">`;
  }
  if (quad.object.termType === "Literal") {
    const language = quad.object.language ? ` lang="${html(quad.object.language)}"` : "";
    const direction = quad.object.direction ? ` dir="${html(quad.object.direction)}"` : "";
    const datatype = !quad.object.language && quad.object.datatype.value !== xsdString
      ? ` rdf-datatype="${html(embeddedIri(quad.object.datatype.value))}"`
      : "";
    return `      <meta hidden content="${html(quad.object.value)}" ${subject} ${predicate}${language}${direction}${datatype}>`;
  }
  throw new Error(`Unsupported embedded vocabulary object: ${quad.object.termType}.`);
}

const embeddedVocabularyQuads = new Parser({ baseIRI: ontologyIri }).parse(ttl);
const generatedEmbeddedVocabulary = `${embeddedVocabularyStart}
    <div id="embedded-rdfhtml-vocabulary" hidden data-generated-vocabulary-statements="${embeddedVocabularyQuads.length}">
${embeddedVocabularyQuads.map(embeddedVocabularyCarrier).join("\n")}
    </div>
${embeddedVocabularyEnd}`;

const elementReferenceStart = "    <!-- BEGIN GENERATED HTML ELEMENT REFERENCE -->";
const elementReferenceEnd = "    <!-- END GENERATED HTML ELEMENT REFERENCE -->";
const globalAttributes = snapshot.attributes.filter((attribute) => attribute.contexts.some((context) => context.global));

function renderElementAttribute(attribute, conditional = false) {
  return `<li data-element-attribute="${html(attribute.name)}"${conditional ? ' data-conditional-applicability="true"' : ""}>
                    <a href="#attribute-${html(attribute.name)}"><code>rdfhtml:${html(attribute.termName)}</code></a>
                    <code class="element-attribute-local-name">${html(attribute.name)}</code>${conditional ? '\n                    <span class="element-attribute-condition">conditional</span>' : ""}
                  </li>`;
}

const generatedElementDefinitions = snapshot.elements.map((element) => {
  const term = className(element.name);
  const unconditional = element.categories.filter((membership) => !membership.conditional);
  const conditional = element.categories.filter((membership) => membership.conditional);
  const indexedAttributes = new Map(element.attributes.map((attribute) => [attribute.name, attribute]));
  const specificAttributes = snapshot.attributes.filter((attribute) => (
    indexedAttributes.has(attribute.name)
    || attribute.contexts.some((context) => context.elements.includes(element.name))
  ));
  const categorySentence = unconditional.length
    ? `Unconditional categories: ${unconditional.map((membership) => `<a href="${html(membership.source)}">${html(categoryDefinitions.get(membership.name).label)}</a>`).join(", ")}.`
    : "No unconditional indexed content-category memberships.";
  const conditionalSentence = conditional.length
    ? ` Conditional categories: ${conditional.map((membership) => `<a href="${html(membership.source)}">${html(categoryDefinitions.get(membership.name).label)}</a> (${html(membership.conditionText || membership.indexNotation)})`).join("; ")}.`
    : "";
  const specificAttributeItems = specificAttributes.length
    ? specificAttributes.map((attribute) => renderElementAttribute(attribute, indexedAttributes.get(attribute.name)?.notation.endsWith("*") ?? false)).join("\n                  ")
    : '<li class="element-attribute-empty">No element-specific attributes.</li>';
  const globalAttributeItems = globalAttributes.map((attribute) => renderElementAttribute(attribute)).join("\n                  ");
  return `        <details id="element-${html(element.name)}" class="element-definition" data-generated-element="${html(element.name)}">
          <summary>
            <span class="element-summary">
              <strong><code>rdfhtml:${html(term)}</code></strong>
              <code class="element-local-name">&lt;${html(element.name)}&gt;</code>
              <span class="element-attribute-count">${specificAttributes.length} specific · ${globalAttributes.length} global</span>
            </span>
          </summary>
          <div class="element-definition-body">
            <p>
              Represents the <a href="${html(element.source)}"><code>${html(element.name)}</code> element</a>
              in the HTML namespace. Its <a href="${html(element.kindSource)}">syntax kind</a> is
              <code>${html(element.kind)}</code>. ${categorySentence}${conditionalSentence}
            </p>
            <div class="element-attribute-applicability">
              <div class="element-attribute-group" data-attribute-scope="specific">
                <p class="element-attribute-group-label">Element-specific <span>${specificAttributes.length}</span></p>
                <ul class="element-attribute-list">
                  ${specificAttributeItems}
                </ul>
              </div>
              <div class="element-attribute-group" data-attribute-scope="global">
                <p class="element-attribute-group-label">Applies to all elements <span>${globalAttributes.length}</span></p>
                <ul class="element-attribute-list">
                  ${globalAttributeItems}
                </ul>
              </div>
            </div>
          </div>
        </details>`;
}).join("\n");
const generatedElementReference = `${elementReferenceStart}
    <section id="element-reference" class="appendix informative">
      <h2>Generated HTML element reference</h2>
      <p>
        This appendix is generated from the dated ${snapshot.snapshotDate}
        HTML Living Standard snapshot. It defines all ${snapshot.elements.length}
        current conforming HTML-namespace element classes in that snapshot.
        Obsolete elements are excluded. Conditional category descriptions are
        provenance records, not unconditional subclass axioms. Expand an
        element to inspect its element-specific attribute definitions and the
        definitions that apply to all elements. A <em>conditional</em> marker
        preserves an applicability asterisk from the Living Standard index.
      </p>
      <div class="element-reference-list">
${generatedElementDefinitions}
      </div>
    </section>
${elementReferenceEnd}`;

const attributeReferenceStart = "    <!-- BEGIN GENERATED HTML ATTRIBUTE REFERENCE -->";
const attributeReferenceEnd = "    <!-- END GENERATED HTML ATTRIBUTE REFERENCE -->";
const generatedAttributeDefinitions = snapshot.attributes.map((attribute) => {
  const term = attribute.termName;
  const contexts = attribute.contexts.map((context) => {
    const applicability = context.global
      ? "all HTML elements"
      : [
          ...context.elements.map((name) => `<a href="#element-${html(name)}"><code>&lt;${html(name)}&gt;</code></a>`),
          ...context.specialParticipants.map((participant) => html(participant.replaceAll("-", " "))),
        ].join(", ");
    const definitions = context.definitionSources.length
      ? `<span class="attribute-context-sources">${context.definitionSources.length === 1 ? "Source" : "Sources"}: ${context.definitionSources.map((source, index) => `<a href="${html(source)}">definition${context.definitionSources.length === 1 ? "" : ` ${index + 1}`}</a>`).join(", ")}.</span>`
      : "";
    return `<li data-generated-attribute-context="${html(context.id)}">
                <span class="attribute-context-scope">${applicability}</span>
                <span class="attribute-context-detail">
                  <span>${html(context.description)}.</span>
                  <span class="attribute-value-syntax">Value: <code>${html(context.valueSyntaxText)}</code>.</span>
                  ${definitions || "<!-- No linked definition source in the index. -->"}
                </span>
              </li>`;
  }).join("\n              ");
  const contextCount = attribute.contexts.length;
  return `        <details id="attribute-${html(attribute.name)}" class="attribute-definition" data-generated-attribute="${html(attribute.name)}">
          <summary>
            <span class="attribute-summary">
              <strong><code>rdfhtml:${html(term)}</code></strong>
              <code class="attribute-local-name">${html(attribute.name)}</code>
              <span class="attribute-context-count">${contextCount} ${contextCount === 1 ? "context" : "contexts"}</span>
            </span>
          </summary>
          <div class="attribute-definition-body">
            <p>
              This <code>rdfhtml:AttributeDefinition</code> and
              <code>owl:DatatypeProperty</code> maps to the HTML local name
              <code>${html(attribute.name)}</code>.${attribute.idlReflections.length ? ` Reflected Web IDL names: ${attribute.idlReflections.map((reflection) => `<a href="${html(reflection.sources[0])}"><code>${html(reflection.idlName)}</code></a>`).join(", ")}.` : " No reflected Web IDL name is indexed for this attribute."}
              Its direct value and expanded <code>rdfhtml:attributeValue</code>
              remain exact DOM strings.
            </p>
            <ul class="attribute-context-list">
              ${contexts}
            </ul>
          </div>
        </details>`;
}).join("\n");
const generatedAttributeReference = `${attributeReferenceStart}
    <section id="attribute-reference" class="appendix informative">
      <h2>Generated HTML attribute reference</h2>
      <p>
        This appendix is generated from the dated ${snapshot.snapshotDate}
        HTML Living Standard snapshot. It defines ${snapshot.attributes.length}
        current non-event-handler HTML attribute definitions and preserves all
        ${snapshot.attributes.reduce((count, attribute) => count + attribute.contexts.length, 0)}
        indexed applicability and value-syntax contexts. The value syntax is
        descriptive metadata; RDF/HTML preserves the exact DOM attribute value
        as a string.
      </p>
      <div class="attribute-reference-list">
${generatedAttributeDefinitions}
      </div>
    </section>
${attributeReferenceEnd}`;

const categoryNameUnion = snapshot.contentCategories.map((category) => turtleString(category.name)).join(" | ");
const kindNameUnion = [...validKinds].map(turtleString).join(" | ");
const tsCategoryRecords = snapshot.contentCategories.map((category) => (
  `  { classIri: RDFHTML + ${turtleString(category.className)}, label: ${turtleString(category.label)}, name: ${turtleString(category.name)}, source: ${turtleString(category.source)} },`
)).join("\n");
const tsKindRecords = snapshot.syntaxKinds.map((kind) => (
  `  ${JSON.stringify(kind)},`
)).join("\n");
const tsElementRecords = snapshot.elements.map((element) => (
  `  { categories: ${JSON.stringify(element.categories)}, classIri: RDFHTML + ${turtleString(className(element.name))}, kind: ${turtleString(element.kind)}, kindSource: ${turtleString(element.kindSource)}, source: ${turtleString(element.source)}, tagName: ${turtleString(element.name)} },`
)).join("\n");
const tsAttributeRecords = snapshot.attributes.map((attribute) => (
  `  { contexts: ${JSON.stringify(attribute.contexts)}, definitionIri: RDFHTML + ${turtleString(attribute.termName)}, idlReflections: ${JSON.stringify(attribute.idlReflections)}, localName: ${turtleString(attribute.name)}, termName: ${turtleString(attribute.termName)} },`
)).join("\n");
const ts = `// Generated by scripts/generate-vocabulary.mjs from data/${snapshotFile}.
// Do not edit this file directly.

export const RDFHTML = ${turtleString(namespace)};
export const HTML_SNAPSHOT_DATE = ${turtleString(snapshot.snapshotDate)};
export const HTML_VOCABULARY_IRI = ${turtleString(`https://ia2.dev/spec/rdf-html/vocabulary/rdf-html-${snapshot.snapshotDate}.ttl`)};
export const HTML_SNAPSHOT_SOURCES = ${JSON.stringify(snapshot.sources, null, 2)} as const;
export const HTML_SNAPSHOT_SOURCE = HTML_SNAPSHOT_SOURCES.elementIndex.url;

export type HtmlElementKind = ${kindNameUnion};
export type HtmlContentCategoryName = ${categoryNameUnion};

export interface HtmlCategoryMembership {
  name: HtmlContentCategoryName;
  conditional: boolean;
  source: string;
  conditionId?: string;
  conditionText?: string;
  indexNotation?: string;
  elementIndexNotation?: string;
}

export interface HtmlContentCategoryDefinition {
  classIri: string;
  label: string;
  name: HtmlContentCategoryName;
  source: string;
}

export interface HtmlElementDefinition {
  categories: readonly HtmlCategoryMembership[];
  classIri: string;
  kind: Exclude<HtmlElementKind, "foreign">;
  kindSource: string;
  source: string;
  tagName: string;
}

export interface HtmlAttributeContext {
  id: string;
  global: boolean;
  elements: readonly string[];
  specialParticipants: readonly string[];
  description: string;
  valueSyntaxText: string;
  definitionSources: readonly string[];
  valueSyntaxSources: readonly string[];
  source: string;
}

export interface HtmlAttributeDefinition {
  contexts: readonly HtmlAttributeContext[];
  definitionIri: string;
  idlReflections: readonly { idlName: string; sources: readonly string[] }[];
  localName: string;
  termName: string;
}

export const HTML_SYNTAX_KINDS = [
${tsKindRecords}
] as const;

export const HTML_CONTENT_CATEGORIES: readonly HtmlContentCategoryDefinition[] = [
${tsCategoryRecords}
];

export const HTML_SPECIAL_CATEGORY_PARTICIPANTS = ${JSON.stringify(snapshot.specialParticipants, null, 2)} as const;
export const HTML_CLASSIFICATION_CROSS_CHECK_EXCEPTIONS = ${JSON.stringify(snapshot.crossCheckExceptions, null, 2)} as const;
export const HTML_ATTRIBUTE_CROSS_CHECK_EXCEPTIONS = ${JSON.stringify(snapshot.attributeCrossCheckExceptions, null, 2)} as const;
export const HTML_ATTRIBUTE_INDEX_EXCLUSION = ${JSON.stringify(snapshot.attributeIndexExclusion, null, 2)} as const;

export const HTML_ELEMENTS: readonly HtmlElementDefinition[] = [
${tsElementRecords}
];

export const HTML_ATTRIBUTES: readonly HtmlAttributeDefinition[] = [
${tsAttributeRecords}
];

export const ELEMENT_BY_CLASS_IRI = new Map(HTML_ELEMENTS.map((definition) => [definition.classIri, definition]));
export const ATTRIBUTE_BY_DEFINITION_IRI = new Map(HTML_ATTRIBUTES.map((definition) => [definition.definitionIri, definition]));
export const ATTRIBUTE_BY_LOCAL_NAME = new Map(HTML_ATTRIBUTES.map((definition) => [definition.localName, definition]));
export const VOID_ELEMENTS = new Set(HTML_ELEMENTS.filter((definition) => definition.kind === "void").map((definition) => definition.tagName));
`;

async function emit(path, content) {
  if (check) {
    let current = "";
    try { current = await readFile(path, "utf8"); } catch {}
    if (current !== content) throw new Error(`${path} is stale; run npm run generate`);
    return;
  }
  await writeFile(path, content);
}

function replaceMarkedBlock(path, current, start, end, content) {
  const startIndex = current.indexOf(start);
  const endIndex = current.indexOf(end);
  if (startIndex < 0 || endIndex < 0 || endIndex < startIndex) {
    throw new Error(`${path} is missing generated reference markers.`);
  }
  if (current.indexOf(start, startIndex + start.length) >= 0 || current.indexOf(end, endIndex + end.length) >= 0) {
    throw new Error(`${path} contains duplicate generated reference markers.`);
  }
  const updated = `${current.slice(0, startIndex)}${content}${current.slice(endIndex + end.length)}`;
  return updated;
}

const currentSpecification = await readFile(specPath, "utf8");
const generatedSpecification = replaceMarkedBlock(
  specPath,
  replaceMarkedBlock(
    specPath,
    replaceMarkedBlock(specPath, currentSpecification, embeddedVocabularyStart, embeddedVocabularyEnd, generatedEmbeddedVocabulary),
    elementReferenceStart,
    elementReferenceEnd,
    generatedElementReference,
  ),
  attributeReferenceStart,
  attributeReferenceEnd,
  generatedAttributeReference,
);

await Promise.all([
  emit(ttlPath, ttl),
  emit(tsPath, ts),
  emit(specPath, generatedSpecification),
]);
console.log(check
  ? `Verified ${snapshot.elements.length} HTML element classes, ${snapshot.attributes.length} attribute definitions, ${embeddedVocabularyQuads.length} embedded HTML/RDF statements, both specification references, and ${snapshot.contentCategories.length} content categories for ${snapshot.snapshotDate}.`
  : `Generated ${snapshot.elements.length} HTML element classes, ${snapshot.attributes.length} attribute definitions, ${embeddedVocabularyQuads.length} embedded HTML/RDF statements, both specification references, and ${snapshot.contentCategories.length} content categories for ${snapshot.snapshotDate}.`);
