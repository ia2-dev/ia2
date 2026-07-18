import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { DataFactory, Parser, Store, type Term } from "n3";
import { describe, expect, it } from "vitest";
import {
  ATTRIBUTE_BY_DEFINITION_IRI,
  ATTRIBUTE_BY_LOCAL_NAME,
  HTML_ATTRIBUTES,
  HTML_ATTRIBUTE_CROSS_CHECK_EXCEPTIONS,
  HTML_CONTENT_CATEGORIES,
  HTML_ELEMENTS,
  HTML_SNAPSHOT_DATE,
  HTML_SPECIAL_CATEGORY_PARTICIPANTS,
  HTML_SYNTAX_KINDS,
  RDFHTML,
} from "../src/generated/elements.js";
import { extractHtmlClassification } from "../scripts/lib/html-classification.mjs";
import type { HtmlClassificationSnapshot } from "../scripts/lib/html-classification.mjs";

const { namedNode } = DataFactory;
const RDF = "http://www.w3.org/1999/02/22-rdf-syntax-ns#";
const RDFS = "http://www.w3.org/2000/01/rdf-schema#";
const SH = "http://www.w3.org/ns/shacl#";
const EX = "https://example.test/conditional/";
const snapshotPath = resolve(process.cwd(), `data/html-elements-${HTML_SNAPSHOT_DATE}.json`);
const snapshot = JSON.parse(readFileSync(snapshotPath, "utf8")) as HtmlClassificationSnapshot;

function element(name: string) {
  const definition = HTML_ELEMENTS.find((candidate) => candidate.tagName === name);
  if (!definition) throw new Error(`Missing fixture element ${name}.`);
  return definition;
}

function sourceFixtureFromSnapshot() {
  const escape = (value: string) => value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
  const categoriesByElement = new Map<string, string[]>(snapshot.elements.map((item) => [
    item.name,
    item.categories.flatMap((membership) => membership.elementIndexNotation ? [membership.elementIndexNotation] : []),
  ]));
  const elementRows = snapshot.elements.map((item) => {
    const attributes = [
      '<a href="dom.html#global-attributes">globals</a>',
      ...item.attributes.map((attribute) => `<code><a href="fixture.html#attr-${attribute.name}">${attribute.name}</a></code>${attribute.notation.endsWith("*") ? "*" : ""}`),
      ...item.specialAttributeNotations.map((notation) => `<a href="fixture.html#embed-anything">any</a>${notation.endsWith("*") ? "*" : ""}`),
    ].join("; ");
    return `<tr><th><code><a href="${item.source}">${item.name}</a></code></th><td>Fixture</td><td>${(categoriesByElement.get(item.name) ?? []).map((notation) => `<a href="dom.html#${notation.replace("*", "")}-content">${notation.replace("*", "")}</a>${notation.endsWith("*") ? "*" : ""}`).join("; ") || "none"}</td><td>fixture</td><td>fixture</td><td>${attributes}</td><td>HTMLElement</td></tr>`;
  }).join("");
  const indexedSpecial = snapshot.specialParticipants.filter((participant: { id: string }) => ["autonomous-custom-elements", "mathml-math", "svg-svg"].includes(participant.id));
  const specialRows = indexedSpecial.map((participant) => `<tr><th><a href="${participant.source}">${participant.label}</a></th><td>Fixture</td><td>${participant.categories.filter((membership) => membership.elementIndexNotation).map((membership) => `<a href="dom.html#${membership.name}-content">${membership.elementIndexNotation!.replace("*", "")}</a>${membership.elementIndexNotation!.endsWith("*") ? "*" : ""}`).join("; ")}</td><td>fixture</td><td>fixture</td><td>fixture</td><td>Element</td></tr>`).join("");
  const categoryRows = snapshot.contentCategories.map((category) => {
    const standard = snapshot.elements.flatMap((item) => item.categories
      .filter((membership) => membership.name === category.name && (membership.conditionText || membership.source !== item.source))
      .map((membership) => ({ participant: item.name, ...membership })));
    const special = snapshot.specialParticipants.flatMap((item) => item.categories
      .filter((membership) => membership.name === category.name)
      .map((membership) => ({ participant: item.label, ...membership })));
    const entries = [...standard, ...special];
    const render = (entry: { participant: string; conditional?: boolean; indexNotation?: string }) => entry.conditional
      ? `<code><a href="fixture.html#${entry.participant}">${entry.participant}</a></code>${entry.indexNotation!.slice(entry.participant.length)}`
      : `<code><a href="fixture.html#${entry.participant}">${entry.participant}</a></code>`;
    const unconditional = entries.filter((entry) => !entry.conditional).map(render).join("; ") || "—";
    const conditional = entries.filter((entry) => entry.conditional).map(render).join("; ") || "—";
    return `<tr><th><a href="${category.source}">${category.label}</a></th><td>${unconditional}</td><td>${conditional}</td></tr>`;
  }).join("");
  const attributeRows = snapshot.attributes.flatMap((attribute) => attribute.contexts.map((context) => {
    const participants = context.global
      ? `<a href="${context.definitionSources[0]}">HTML elements</a>`
      : [
          ...context.elements.map((element, index) => `<code id="attributes-3:attr-${context.id}-${index}"><a href="${context.definitionSources[index] ?? context.definitionSources[0]}">${element}</a></code>`),
          ...context.specialParticipants.map(() => "form-associated custom elements"),
        ].join("; ");
    return `<tr><th><code>${attribute.name}</code></th><td>${participants}</td><td>${escape(context.description)}</td><td>${escape(context.valueSyntaxText)}</td></tr>`;
  })).join("");
  const indicesHtml = `<!doctype html><base href="https://html.spec.whatwg.org/multipage/indices.html"><h3 id="elements-3">Elements</h3><p>Fixture.</p><table><thead><tr><th>Element</th><th>Description</th><th>Categories</th><th>Parents†</th><th>Children</th><th>Attributes</th><th>Interface</th></tr></thead><tbody>${elementRows}${specialRows}</tbody></table><h3 id="attributes-3">Attributes</h3><p>Fixture.</p><table><caption>List of attributes (excluding event handler content attributes)</caption><thead><tr><th>Attribute</th><th>Element(s)</th><th>Description</th><th>Value</th></tr></thead><tbody>${attributeRows}</tbody></table><h3 id="element-content-categories">Element content categories</h3><p>Fixture.</p><table><thead><tr><th>Category</th><th>Elements</th><th>Elements with exceptions</th></tr></thead><tbody>${categoryRows}</tbody></table>`;
  const syntaxTerms = snapshot.syntaxKinds.map((kind) => {
    const fragment = new URL(kind.source).hash.slice(1);
    const description = kind.name === "normal"
      ? '<a href="infrastructure.html#html-elements">All other allowed HTML elements</a> are normal elements.'
      : kind.name === "foreign"
        ? kind.namespaces!.map((namespace) => `<a href="${namespace.source}">${namespace.label} namespace</a>`).join(" and ") + "."
        : kind.elements!.map((name) => `<code><a href="fixture.html#${name}">${name}</a></code>`).join(", ");
    return `<dt><dfn id="${fragment}">${kind.label}</dfn></dt><dd>${description}</dd>`;
  }).join("");
  const syntaxHtml = `<!doctype html><base href="https://html.spec.whatwg.org/multipage/syntax.html"><h4 id="elements-2">Elements</h4><p>There are six different kinds of elements: fixture.</p><dl>${syntaxTerms}</dl>`;
  const reflectedMembers = snapshot.attributes.flatMap((attribute) => attribute.idlReflections.map((reflection) => (
    `[Reflect="${attribute.name}"] attribute DOMString <dfn id="dom-fixture-${attribute.name}-${reflection.idlName}" data-dfn-type="attribute">${reflection.idlName}</dfn>;`
  )));
  const fillerMembers = Array.from({ length: 300 }, (_, index) => (
    `[Reflect] attribute DOMString <dfn id="dom-fixture-${index}" data-dfn-type="attribute">fixture${index}</dfn>;`
  ));
  const webIdlHtml = `<!doctype html><base href="https://html.spec.whatwg.org/"><pre><code class="idl">${[...reflectedMembers, ...fillerMembers].join("\n")}</code></pre><h2 id="obsolete">Obsolete features</h2>`;
  return { indicesHtml, syntaxHtml, webIdlHtml };
}

function parseTurtle(path: string) {
  return new Store(new Parser({ baseIRI: `file://${path}` }).parse(readFileSync(path, "utf8")));
}

function objects(store: Store, subject: Term, predicate: string) {
  return store.getObjects(subject, namedNode(predicate), null);
}

function rdfList(store: Store, head: Term): Term[] {
  const values: Term[] = [];
  let cursor = head;
  while (!cursor.equals(namedNode(`${RDF}nil`))) {
    const first = objects(store, cursor, `${RDF}first`);
    const rest = objects(store, cursor, `${RDF}rest`);
    if (first.length !== 1 || rest.length !== 1) throw new Error("Malformed SHACL RDF list in reviewed rules.");
    values.push(first[0]!);
    cursor = rest[0]!;
  }
  return values;
}

function pathValues(data: Store, rules: Store, focus: Term, path: Term): Term[] {
  if (path.termType === "NamedNode") return objects(data, focus, path.value);
  const zeroOrMore = objects(rules, path, `${SH}zeroOrMorePath`);
  if (zeroOrMore.length === 1) {
    const reached = new Map([[`${focus.termType}:${focus.value}`, focus]]);
    const queue = [focus];
    while (queue.length) {
      const current = queue.shift()!;
      for (const next of pathValues(data, rules, current, zeroOrMore[0]!)) {
        const key = `${next.termType}:${next.value}`;
        if (!reached.has(key)) { reached.set(key, next); queue.push(next); }
      }
    }
    return [...reached.values()];
  }
  if (objects(rules, path, `${RDF}first`).length === 1) {
    return rdfList(rules, path).reduce((values, segment) => values.flatMap((value) => pathValues(data, rules, value, segment)), [focus]);
  }
  throw new Error(`Unsupported reviewed SHACL path ${path.value}.`);
}

function conforms(data: Store, rules: Store, focus: Term, shape: Term): boolean {
  const alternatives = objects(rules, shape, `${SH}or`);
  if (alternatives.length) return rdfList(rules, alternatives[0]!).some((alternative) => conforms(data, rules, focus, alternative));
  const requiredClasses = objects(rules, shape, `${SH}class`);
  if (requiredClasses.some((required) => data.countQuads(focus, namedNode(`${RDF}type`), required, null) === 0)) return false;
  return objects(rules, shape, `${SH}property`).every((propertyShape) => {
    const path = objects(rules, propertyShape, `${SH}path`)[0];
    if (!path) throw new Error("Reviewed SHACL property shape has no path.");
    const values = pathValues(data, rules, focus, path);
    const minimum = Number(objects(rules, propertyShape, `${SH}minCount`)[0]?.value ?? 0);
    if (values.length < minimum) return false;
    const requiredValues = objects(rules, propertyShape, `${SH}hasValue`);
    if (requiredValues.length && !requiredValues.every((required) => values.some((value) => value.equals(required)))) return false;
    const qualifiedShape = objects(rules, propertyShape, `${SH}qualifiedValueShape`)[0];
    const qualifiedMinimum = Number(objects(rules, propertyShape, `${SH}qualifiedMinCount`)[0]?.value ?? 0);
    return !qualifiedShape || values.filter((value) => conforms(data, rules, value, qualifiedShape)).length >= qualifiedMinimum;
  });
}

function applyReviewedRules(data: Store, rules: Store) {
  const inferred = new Set<string>();
  for (const target of rules.getQuads(null, namedNode(`${SH}targetClass`), null, null)) {
    const focusNodes = data.getSubjects(namedNode(`${RDF}type`), target.object, null);
    for (const focus of focusNodes) {
      for (const rule of objects(rules, target.subject, `${SH}rule`)) {
        const condition = objects(rules, rule, `${SH}condition`)[0];
        const predicate = objects(rules, rule, `${SH}predicate`)[0];
        const object = objects(rules, rule, `${SH}object`)[0];
        if (!condition || !predicate?.equals(namedNode(`${RDF}type`)) || !object) throw new Error("Unsupported reviewed SHACL rule structure.");
        if (conforms(data, rules, focus, condition)) inferred.add(`${focus.value} ${object.value}`);
      }
    }
  }
  return inferred;
}

describe("Living Standard classification", () => {
  it("captures every current conforming HTML element and excludes obsolete names", () => {
    expect(HTML_ELEMENTS).toHaveLength(113);
    expect(HTML_ELEMENTS.map((item) => item.tagName)).toEqual([...HTML_ELEMENTS.map((item) => item.tagName)].sort());
    for (const obsolete of ["acronym", "applet", "basefont", "big", "center", "dir", "font", "frame", "frameset", "isindex", "keygen", "marquee", "nobr", "noembed", "noframes", "param", "plaintext", "rb", "rtc", "strike", "tt", "xmp"]) {
      expect(HTML_ELEMENTS.some((item) => item.tagName === obsolete), obsolete).toBe(false);
    }
  });

  it("extracts syntax kinds from the syntax fixture without hard-coded element sets", () => {
    expect(HTML_SYNTAX_KINDS.map((kind) => kind.name)).toEqual(["void", "template", "raw-text", "escapable-raw-text", "foreign", "normal"]);
    expect(element("area").kind).toBe("void");
    expect(element("script").kind).toBe("raw-text");
    expect(element("template").kind).toBe("template");
    expect(element("textarea").kind).toBe("escapable-raw-text");
    expect(element("main").kind).toBe("normal");
    expect(HTML_SYNTAX_KINDS.find((kind) => kind.name === "foreign")).toMatchObject({ namespaces: [{ label: "MathML" }, { label: "SVG" }] });
  });

  it("captures indexed attribute names and preserves contextual value syntax", () => {
    expect(HTML_ATTRIBUTES).toHaveLength(144);
    expect(ATTRIBUTE_BY_LOCAL_NAME.get("href")?.definitionIri).toBe(`${RDFHTML}href`);
    expect(ATTRIBUTE_BY_DEFINITION_IRI.get(`${RDFHTML}type`)?.contexts).toHaveLength(6);
    expect(ATTRIBUTE_BY_LOCAL_NAME.get("accesskey")).toMatchObject({ termName: "accessKey" });
    expect(ATTRIBUTE_BY_LOCAL_NAME.get("accept-charset")).toMatchObject({ termName: "acceptCharset" });
    expect(ATTRIBUTE_BY_LOCAL_NAME.get("maxlength")).toMatchObject({ termName: "maxLength" });
    expect(ATTRIBUTE_BY_LOCAL_NAME.get("data")).toMatchObject({ termName: "dataAttribute" });
    expect(ATTRIBUTE_BY_LOCAL_NAME.get("for")).toMatchObject({ termName: "for", idlReflections: [{ idlName: "htmlFor" }] });
    expect(ATTRIBUTE_BY_LOCAL_NAME.get("muted")).toMatchObject({ termName: "muted", idlReflections: [{ idlName: "defaultMuted" }] });
    expect(ATTRIBUTE_BY_LOCAL_NAME.get("charset")?.idlReflections).toEqual([]);
    expect(ATTRIBUTE_BY_LOCAL_NAME.get("color")?.idlReflections).toEqual([]);
    expect(ATTRIBUTE_BY_LOCAL_NAME.get("autocomplete")?.contexts.map((context) => context.elements)).toEqual([
      ["form"],
      ["input", "select", "textarea"],
    ]);
    expect(ATTRIBUTE_BY_LOCAL_NAME.get("disabled")?.contexts.some((context) => context.valueSyntaxText === "Boolean attribute")).toBe(true);
    expect(HTML_ATTRIBUTES.some((attribute) => attribute.localName === "onclick")).toBe(false);
  });

  it("retains representative unconditional and conditional memberships", () => {
    const memberships = (name: string) => new Map(element(name).categories.map((membership) => [membership.name, membership]));
    expect(memberships("a").get("flow")?.conditional).toBe(false);
    expect(memberships("a").get("interactive")).toMatchObject({ conditional: true, conditionText: "if the href attribute is present" });
    expect(memberships("area").get("flow")).toMatchObject({ conditional: true, conditionText: "if it is a descendant of a map element" });
    expect(memberships("audio").get("interactive")?.conditional).toBe(true);
    expect(memberships("link").get("flow")?.conditional).toBe(true);
    expect(memberships("main").get("flow")?.conditional).toBe(true);
    expect(memberships("meta").get("phrasing")?.conditional).toBe(true);
    expect(memberships("script").get("script-supporting")?.conditional).toBe(false);
    expect(memberships("template").get("metadata")?.conditional).toBe(false);
    expect(memberships("textarea").get("labelable")?.conditional).toBe(false);
    expect(memberships("input").get("form-associated")?.conditional).toBe(false);
    expect(memberships("input").get("interactive")?.conditional).toBe(true);
  });

  it("preserves text, custom, and foreign category participants outside the HTML class inventory", () => {
    expect(HTML_SPECIAL_CATEGORY_PARTICIPANTS.map((participant) => participant.id)).toEqual([
      "autonomous-custom-elements", "form-associated-custom-elements", "mathml-math", "svg-svg", "text",
    ]);
    expect(HTML_SPECIAL_CATEGORY_PARTICIPANTS.find((participant) => participant.id === "text")?.categories.find((category) => category.name === "palpable")).toMatchObject({ conditional: true });
  });

  it("records every deliberate cross-table exception in the snapshot", () => {
    expect(snapshot.crossCheckExceptions.map((exception) => `${exception.scope}:${exception.element ?? "*"}:${exception.category}`)).toEqual([
      "category-index-only:*:autocapitalize-and-autocorrect-inheriting",
      "category-index-only-membership:hgroup:heading",
      "category-index-only-membership:label:form-associated",
      "category-index-only-membership:selectedcontent:phrasing",
      "element-index-only-conditional:object:interactive",
      "element-index-only-conditional:th:interactive",
    ]);
    expect(HTML_ATTRIBUTE_CROSS_CHECK_EXCEPTIONS.map((exception) => `${exception.scope}:${exception.element}:${exception.attribute}`)).toEqual([
      "attribute-index-only:dialog:closedby",
      "element-index-only:form:rel",
    ]);
  });

  it("re-extracts deterministically from the committed snapshot fixture without network access", () => {
    const fixture = sourceFixtureFromSnapshot();
    const extracted = extractHtmlClassification({ ...fixture, snapshotDate: HTML_SNAPSHOT_DATE, sourceDigests: { indices: "0".repeat(64), syntax: "1".repeat(64), webIdl: "2".repeat(64) } });
    expect(extracted.elements.map((item) => ({ name: item.name, kind: item.kind, categories: item.categories.map((category) => [category.name, category.conditional]) }))).toEqual(
      snapshot.elements.map((item) => ({ name: item.name, kind: item.kind, categories: item.categories.map((category) => [category.name, category.conditional]) })),
    );
    expect(extracted.attributes.map((attribute) => ({ name: attribute.name, termName: attribute.termName, idlNames: attribute.idlReflections.map((reflection) => reflection.idlName), contexts: attribute.contexts.map((context) => ({ id: context.id, global: context.global, elements: context.elements, specialParticipants: context.specialParticipants, description: context.description, valueSyntaxText: context.valueSyntaxText })) }))).toEqual(
      snapshot.attributes.map((attribute) => ({ name: attribute.name, termName: attribute.termName, idlNames: attribute.idlReflections.map((reflection) => reflection.idlName), contexts: attribute.contexts.map((context) => ({ id: context.id, global: context.global, elements: context.elements, specialParticipants: context.specialParticipants, description: context.description, valueSyntaxText: context.valueSyntaxText })) })),
    );
  });

  it("fails loudly on unknown categories and changed table structure", () => {
    const fixture = sourceFixtureFromSnapshot();
    const sourceDigests = { indices: "0".repeat(64), syntax: "1".repeat(64), webIdl: "2".repeat(64) };
    expect(() => extractHtmlClassification({ ...fixture, indicesHtml: fixture.indicesHtml.replace(">flow</a>", ">mystery</a>"), snapshotDate: HTML_SNAPSHOT_DATE, sourceDigests })).toThrow(/Unknown category/);
    expect(() => extractHtmlClassification({ ...fixture, indicesHtml: fixture.indicesHtml.replace("<th>Categories</th>", "<th>Kinds</th>"), snapshotDate: HTML_SNAPSHOT_DATE, sourceDigests })).toThrow(/structure drift/);
    expect(() => extractHtmlClassification({ ...fixture, indicesHtml: fixture.indicesHtml.replace("<th>Value</th>", "<th>Datatype</th>"), snapshotDate: HTML_SNAPSHOT_DATE, sourceDigests })).toThrow(/structure drift/);
    expect(() => extractHtmlClassification({ ...fixture, syntaxHtml: fixture.syntaxHtml.replace("Void elements", "Hollow elements"), snapshotDate: HTML_SNAPSHOT_DATE, sourceDigests })).toThrow(/Unknown HTML syntax kind/);
    expect(() => extractHtmlClassification({ ...fixture, webIdlHtml: fixture.webIdlHtml.replaceAll("Reflect", "Mirror"), snapshotDate: HTML_SNAPSHOT_DATE, sourceDigests })).toThrow(/Web IDL yielded an implausible/);
  });

  it("keeps generated TypeScript and Turtle synchronized with the committed snapshot", () => {
    expect(HTML_ELEMENTS.map((item) => ({ name: item.tagName, kind: item.kind, source: item.source, kindSource: item.kindSource, categories: item.categories }))).toEqual(snapshot.elements.map((item) => ({ name: item.name, kind: item.kind, source: item.source, kindSource: item.kindSource, categories: item.categories })));
    expect(HTML_ATTRIBUTES.map((item) => ({ name: item.localName, termName: item.termName, idlReflections: item.idlReflections, contexts: item.contexts }))).toEqual(snapshot.attributes);
    expect(HTML_CONTENT_CATEGORIES).toHaveLength(snapshot.contentCategories.length);
    execFileSync(process.execPath, ["scripts/generate-vocabulary.mjs", "--check"], { cwd: process.cwd(), stdio: "pipe" });
  });

  it("injects one deterministic specification definition for every snapshot element", () => {
    const specification = readFileSync(resolve(process.cwd(), "../../specs/rdf-html/index.html"), "utf8");
    const generatedNames = [...specification.matchAll(/data-generated-element="([a-z0-9]+)"/g)].map((match) => match[1]);
    expect(generatedNames).toEqual(snapshot.elements.map((item) => item.name));
    expect(specification.match(/BEGIN GENERATED HTML ELEMENT REFERENCE/g)).toHaveLength(1);
    expect(specification.match(/END GENERATED HTML ELEMENT REFERENCE/g)).toHaveLength(1);
    expect(specification).toContain('<details id="element-a" class="element-definition" data-generated-element="a">');
    expect(specification).toContain("Conditional categories:");
    expect(specification).toContain("if it is a descendant of a map element");
    expect(specification).not.toContain('data-generated-element="keygen"');
  });

  it("shows element-specific and global attributes inside every generated element definition", () => {
    const specification = readFileSync(resolve(process.cwd(), "../../specs/rdf-html/index.html"), "utf8");
    const elementA = specification.slice(specification.indexOf('id="element-a"'), specification.indexOf('id="element-abbr"'));
    const elementForm = specification.slice(specification.indexOf('id="element-form"'), specification.indexOf('id="element-h1"'));
    const elementLi = specification.slice(specification.indexOf('id="element-li"'), specification.indexOf('id="element-link"'));
    const globalAttributeCount = snapshot.attributes.filter((attribute) => attribute.contexts.some((context) => context.global)).length;
    expect(specification.match(/data-attribute-scope="specific"/g)).toHaveLength(snapshot.elements.length);
    expect(specification.match(/data-attribute-scope="global"/g)).toHaveLength(snapshot.elements.length);
    expect(elementA).toContain('<a href="#attribute-href"><code>rdfhtml:href</code></a>');
    expect(elementA).toContain('<a href="#attribute-accesskey"><code>rdfhtml:accessKey</code></a>');
    expect(elementA).toContain(`Applies to all elements <span>${globalAttributeCount}</span>`);
    expect(elementForm).toContain('<a href="#attribute-rel"><code>rdfhtml:rel</code></a>');
    expect(elementLi).toContain('data-element-attribute="value" data-conditional-applicability="true"');
  });

  it("injects one deterministic specification definition for every indexed attribute", () => {
    const specification = readFileSync(resolve(process.cwd(), "../../specs/rdf-html/index.html"), "utf8");
    const generatedNames = [...specification.matchAll(/data-generated-attribute="([a-z0-9-]+)"/g)].map((match) => match[1]);
    expect(generatedNames).toEqual(snapshot.attributes.map((item) => item.name));
    expect(specification.match(/BEGIN GENERATED HTML ATTRIBUTE REFERENCE/g)).toHaveLength(1);
    expect(specification.match(/END GENERATED HTML ATTRIBUTE REFERENCE/g)).toHaveLength(1);
    expect(specification).toContain('<details id="attribute-href" class="attribute-definition" data-generated-attribute="href">');
    expect(specification).toContain("rdfhtml:accessKey");
    expect(specification).not.toContain("AccesskeyAttribute");
    expect(specification).toContain("Valid MIME type string");
  });

  it("injects one generated HTML/RDF publication of the complete Turtle vocabulary", () => {
    const specification = readFileSync(resolve(process.cwd(), "../../specs/rdf-html/index.html"), "utf8");
    const vocabulary = parseTurtle(resolve(process.cwd(), `vocabulary/rdf-html-${HTML_SNAPSHOT_DATE}.ttl`));
    expect(specification.match(/BEGIN GENERATED RDF\/HTML HTML\/RDF VOCABULARY/g)).toHaveLength(1);
    expect(specification.match(/END GENERATED RDF\/HTML HTML\/RDF VOCABULARY/g)).toHaveLength(1);
    expect(specification).toContain(`id="embedded-rdfhtml-vocabulary" hidden data-generated-vocabulary-statements="${vocabulary.size}"`);
    expect(specification.match(/data-generated-vocabulary-statements=/g)).toHaveLength(1);
  });

  it("never emits a conditional membership as an unconditional subclass", () => {
    const vocabulary = parseTurtle(resolve(process.cwd(), `vocabulary/rdf-html-${HTML_SNAPSHOT_DATE}.ttl`));
    for (const item of snapshot.elements) {
      for (const membership of item.categories.filter((candidate: { conditional: boolean }) => candidate.conditional)) {
        const category = snapshot.contentCategories.find((candidate: { name: string }) => candidate.name === membership.name);
        if (!category) throw new Error(`Missing category ${membership.name}.`);
        const elementClass = `${item.name.charAt(0).toUpperCase()}${item.name.slice(1)}`;
        expect(vocabulary.countQuads(namedNode(`${RDFHTML}${elementClass}`), namedNode(`${RDFS}subClassOf`), namedNode(`${RDFHTML}${category.className}`), null), `${item.name} -> ${membership.name}`).toBe(0);
      }
    }
  });
});

describe("reviewed conditional SHACL-AF rules", () => {
  const rules = parseTurtle(resolve(process.cwd(), "vocabulary/rdf-html-conditional-rules.ttl"));

  it("classifies every positive fixture", () => {
    const data = parseTurtle(resolve(process.cwd(), "test/fixtures/conditional-rules-positive.ttl"));
    const inferred = applyReviewedRules(data, rules);
    for (const expected of data.getQuads(null, namedNode(`${EX}expectedCategory`), null, null)) {
      expect(inferred.has(`${expected.subject.value} ${expected.object.value}`), `${expected.subject.value} -> ${expected.object.value}`).toBe(true);
    }
  });

  it("does not classify any negative fixture", () => {
    const data = parseTurtle(resolve(process.cwd(), "test/fixtures/conditional-rules-negative.ttl"));
    const inferred = applyReviewedRules(data, rules);
    for (const forbidden of data.getQuads(null, namedNode(`${EX}mustNotClassifyAs`), null, null)) {
      expect(inferred.has(`${forbidden.subject.value} ${forbidden.object.value}`), `${forbidden.subject.value} -> ${forbidden.object.value}`).toBe(false);
    }
  });
});
