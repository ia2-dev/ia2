import { JSDOM } from "jsdom";

export const SOURCE_URLS = Object.freeze({
  elementIndex: "https://html.spec.whatwg.org/multipage/indices.html#elements-3",
  attributeIndex: "https://html.spec.whatwg.org/multipage/indices.html#attributes-3",
  contentCategoryIndex: "https://html.spec.whatwg.org/multipage/indices.html#element-content-categories",
  syntaxKinds: "https://html.spec.whatwg.org/multipage/syntax.html#elements-2",
  webIdl: "https://html.spec.whatwg.org/",
});

const SOURCE_DOCUMENTS = Object.freeze({
  indices: new URL(SOURCE_URLS.elementIndex).origin + new URL(SOURCE_URLS.elementIndex).pathname,
  syntax: new URL(SOURCE_URLS.syntaxKinds).origin + new URL(SOURCE_URLS.syntaxKinds).pathname,
  webIdl: SOURCE_URLS.webIdl,
});

// Attribute definition resources normally use the content attribute's spelling,
// refined by a same-letter reflected Web IDL identifier when WHATWG supplies
// one. This single collision is vocabulary design rather than a word-boundary
// guess: rdfhtml:data is already the structural node-data property.
const ATTRIBUTE_TERM_EXCEPTIONS = new Map([
  ["data", "dataAttribute"],
]);

const REFLECTION_EXTENDED_ATTRIBUTE = /\bReflect(?:Setter|URL|NonNegative|Positive(?:WithFallback)?|Range)?(?:\s*=\s*"([^"]+)")?/;

function hyphenatedLowerCamel(name) {
  return name.replace(/-([a-z0-9])/g, (_, character) => character.toUpperCase());
}

function parseReflectedWebIdl(document) {
  const obsoleteBoundary = document.getElementById("obsolete");
  if (!obsoleteBoundary || obsoleteBoundary.localName !== "h2") {
    throw new Error("WHATWG Web IDL structure drift: missing the #obsolete section boundary.");
  }
  const byContentName = new Map();
  let reflectedMemberCount = 0;
  for (const block of document.querySelectorAll("code.idl")) {
    if (obsoleteBoundary.compareDocumentPosition(block) & 4) continue;
    const sourcesByName = new Map();
    for (const definition of block.querySelectorAll('dfn[id^="dom-"], a[href^="#dom-"]')) {
      const name = normalizedText(definition);
      const fragment = definition.localName === "a"
        ? definition.getAttribute("href")?.slice(1)
        : definition.id;
      if (!name || !fragment) continue;
      const sources = sourcesByName.get(name) ?? new Set();
      sources.add(`${SOURCE_DOCUMENTS.webIdl}#${fragment}`);
      sourcesByName.set(name, sources);
    }
    for (const rawLine of block.textContent.split("\n")) {
      const reflection = rawLine.match(REFLECTION_EXTENDED_ATTRIBUTE);
      if (!reflection || !/\battribute\b/.test(rawLine)) continue;
      const member = rawLine.match(/\battribute\b.*?\b([A-Za-z_][A-Za-z0-9_]*)\s*;/);
      if (!member) throw new Error(`WHATWG Web IDL structure drift: could not isolate a reflected attribute member from ${JSON.stringify(rawLine.trim())}.`);
      const idlName = member[1];
      const contentName = reflection[1] || idlName.toLowerCase();
      if (!/^[a-z][a-z0-9-]*$/.test(contentName)) {
        throw new Error(`WHATWG Web IDL contains an unexpected reflected content attribute name: ${JSON.stringify(contentName)}.`);
      }
      const sources = sourcesByName.get(idlName);
      if (!sources?.size) throw new Error(`WHATWG Web IDL reflected member ${idlName} has no stable definition fragment.`);
      const reflections = byContentName.get(contentName) ?? new Map();
      const reflectionSources = reflections.get(idlName) ?? new Set();
      for (const source of sources) reflectionSources.add(source);
      reflections.set(idlName, reflectionSources);
      byContentName.set(contentName, reflections);
      reflectedMemberCount += 1;
    }
  }
  if (reflectedMemberCount < 175 || byContentName.size < 90) {
    throw new Error(`WHATWG Web IDL yielded an implausible ${reflectedMemberCount} reflected members for ${byContentName.size} content attributes.`);
  }
  return byContentName;
}

function attributeNaming(name, reflectedWebIdl) {
  const reflections = reflectedWebIdl.get(name) ?? new Map();
  const flattenedName = name.replaceAll("-", "");
  const boundaryCandidates = [...reflections.keys()].filter((idlName) => idlName.toLowerCase() === flattenedName);
  if (new Set(boundaryCandidates.map((candidate) => candidate.toLowerCase())).size > 1) {
    throw new Error(`Attribute ${name} has conflicting same-letter Web IDL names: ${boundaryCandidates.join(", ")}.`);
  }
  const inferred = boundaryCandidates[0] ?? hyphenatedLowerCamel(name);
  const termName = ATTRIBUTE_TERM_EXCEPTIONS.get(name) ?? inferred;
  if (!/^[a-z][A-Za-z0-9]*$/.test(termName)) throw new Error(`Attribute ${name} produced invalid RDF term name ${termName}.`);
  const idlReflections = [...reflections.entries()]
    .map(([idlName, sources]) => ({ idlName, sources: [...sources].sort() }))
    .sort((left, right) => left.idlName.localeCompare(right.idlName));
  return { idlReflections, termName };
}

// This is intentionally a label-to-term mapping, not an element inventory. The
// stable keys and RDF class names are RDF/HTML API design; all memberships come
// from the captured Living Standard tables.
export const CATEGORY_DEFINITIONS = Object.freeze([
  { label: "Metadata content", name: "metadata", className: "MetadataContent" },
  { label: "Flow content", name: "flow", className: "FlowContent" },
  { label: "Sectioning content", name: "sectioning", className: "SectioningContent" },
  { label: "Heading content", name: "heading", className: "HeadingContent" },
  { label: "Phrasing content", name: "phrasing", className: "PhrasingContent" },
  { label: "Embedded content", name: "embedded", className: "EmbeddedContent" },
  { label: "Interactive content", name: "interactive", className: "InteractiveContent" },
  { label: "Form-associated elements", name: "form-associated", className: "FormAssociatedElement" },
  { label: "Listed elements", name: "listed", className: "ListedElement" },
  { label: "Submittable elements", name: "submittable", className: "SubmittableElement" },
  { label: "Resettable elements", name: "resettable", className: "ResettableElement" },
  {
    label: "Autocapitalize-and-autocorrect inheriting elements",
    name: "autocapitalize-and-autocorrect-inheriting",
    className: "AutocapitalizeAndAutocorrectInheritingElement",
  },
  { label: "Labelable elements", name: "labelable", className: "LabelableElement" },
  { label: "Palpable content", name: "palpable", className: "PalpableContent" },
  { label: "Script-supporting elements", name: "script-supporting", className: "ScriptSupportingElement" },
]);

const CATEGORY_BY_LABEL = new Map(CATEGORY_DEFINITIONS.map((definition) => [definition.label, definition]));
const CATEGORY_BY_SHORT_LABEL = new Map([
  ["metadata", "metadata"],
  ["flow", "flow"],
  ["sectioning", "sectioning"],
  ["heading", "heading"],
  ["phrasing", "phrasing"],
  ["embedded", "embedded"],
  ["interactive", "interactive"],
  ["form-associated", "form-associated"],
  ["listed", "listed"],
  ["submittable", "submittable"],
  ["resettable", "resettable"],
  ["autocapitalize-and-autocorrect inheriting", "autocapitalize-and-autocorrect-inheriting"],
  ["labelable", "labelable"],
  ["palpable", "palpable"],
  ["script-supporting", "script-supporting"],
]);

// As above, these labels are the six normative kinds in the syntax section.
// There are deliberately no hard-coded element sets here.
const SYNTAX_KIND_BY_LABEL = new Map([
  ["Void elements", "void"],
  ["The template element", "template"],
  ["Raw text elements", "raw-text"],
  ["Escapable raw text elements", "escapable-raw-text"],
  ["Foreign elements", "foreign"],
  ["Normal elements", "normal"],
]);

const SPECIAL_PARTICIPANT_IDS = new Map([
  ["MathML math", "mathml-math"],
  ["SVG svg", "svg-svg"],
  ["autonomous custom elements", "autonomous-custom-elements"],
  ["form-associated custom elements", "form-associated-custom-elements"],
  ["Text", "text"],
  ["Text that is not inter-element whitespace", "text"],
]);

const CROSS_CHECK_EXCEPTIONS = Object.freeze([
  {
    scope: "category-index-only",
    category: "autocapitalize-and-autocorrect-inheriting",
    reason: "The element table omits this auxiliary forms category from every Categories cell.",
  },
  { scope: "category-index-only-membership", element: "hgroup", category: "heading", reason: "The element table lists only flow and palpable for hgroup." },
  { scope: "category-index-only-membership", element: "label", category: "form-associated", reason: "The compact element table omits this association-only membership." },
  { scope: "category-index-only-membership", element: "selectedcontent", category: "phrasing", reason: "The element table currently lists no categories for selectedcontent." },
  {
    scope: "element-index-only-conditional",
    element: "object",
    category: "interactive",
    reason: "The element table says interactive* while the dedicated category table omits object; preserve the asterisk without asserting a universal subclass.",
  },
  {
    scope: "element-index-only-conditional",
    element: "th",
    category: "interactive",
    reason: "The element table says interactive* while the dedicated category table omits th; preserve the asterisk without asserting a universal subclass.",
  },
]);
const CATEGORY_INDEX_ONLY = new Set(CROSS_CHECK_EXCEPTIONS.filter((item) => item.scope === "category-index-only").map((item) => item.category));
const CATEGORY_CROSSCHECK_EXCEPTIONS = new Set(CROSS_CHECK_EXCEPTIONS.filter((item) => item.scope === "category-index-only-membership").map((item) => `${item.element}:${item.category}`));
const ELEMENT_INDEX_ONLY_CONDITIONAL = new Set(CROSS_CHECK_EXCEPTIONS.filter((item) => item.scope === "element-index-only-conditional").map((item) => `${item.element}:${item.category}`));

const ATTRIBUTE_CROSS_CHECK_EXCEPTIONS = Object.freeze([
  {
    scope: "attribute-index-only",
    element: "dialog",
    attribute: "closedby",
    reason: "The dedicated attribute index includes closedby while the compact element table currently omits it.",
  },
  {
    scope: "element-index-only",
    element: "form",
    attribute: "rel",
    reason: "The compact element table includes rel for form while the dedicated attribute index currently omits that context.",
  },
]);
const ATTRIBUTE_INDEX_ONLY = new Set(ATTRIBUTE_CROSS_CHECK_EXCEPTIONS.filter((item) => item.scope === "attribute-index-only").map((item) => `${item.element}:${item.attribute}`));
const ELEMENT_INDEX_ONLY_ATTRIBUTE = new Set(ATTRIBUTE_CROSS_CHECK_EXCEPTIONS.filter((item) => item.scope === "element-index-only").map((item) => `${item.element}:${item.attribute}`));

function normalizedText(node) {
  return (node?.textContent ?? "").trim().replace(/\s+/g, " ");
}

function findFollowingTable(document, headingId, expectedHeaders) {
  const heading = document.getElementById(headingId);
  if (!heading) throw new Error(`WHATWG structure drift: missing #${headingId}.`);
  let table = heading.nextElementSibling;
  while (table && table.localName !== "table" && /^p$/i.test(table.localName)) table = table.nextElementSibling;
  if (!table || table.localName !== "table") {
    throw new Error(`WHATWG structure drift: #${headingId} is not followed by the expected table.`);
  }
  const headers = Array.from(table.querySelectorAll(":scope > thead > tr > th"), normalizedText);
  if (JSON.stringify(headers) !== JSON.stringify(expectedHeaders)) {
    throw new Error(`WHATWG structure drift at #${headingId}: expected headers ${expectedHeaders.join(" | ")}, received ${headers.join(" | ") || "none"}.`);
  }
  return table;
}

function followingTextStartsWithAsterisk(anchor) {
  let sibling = anchor.nextSibling;
  while (sibling && sibling.nodeType === 3 && !sibling.textContent?.trim()) sibling = sibling.nextSibling;
  return Boolean(sibling?.nodeType === 3 && /^\s*\*/.test(sibling.textContent ?? ""));
}

function parseElementIndex(document) {
  const table = findFollowingTable(document, "elements-3", [
    "Element", "Description", "Categories", "Parents†", "Children", "Attributes", "Interface",
  ]);
  const elements = [];
  const specialParticipants = [];
  const names = new Set();
  for (const row of table.querySelectorAll(":scope > tbody > tr")) {
    const cells = Array.from(row.children);
    if (cells.length !== 7 || cells[0]?.localName !== "th") {
      throw new Error("WHATWG structure drift: an element-index row does not have one heading and six data cells.");
    }
    const nameCodes = Array.from(cells[0].querySelectorAll(":scope > code"));
    if (nameCodes.length === 0) {
      const label = normalizedText(cells[0]);
      const id = SPECIAL_PARTICIPANT_IDS.get(label);
      if (!id) throw new Error(`Unexpected non-HTML element index entry: ${JSON.stringify(label)}.`);
      const source = cells[0].querySelector("a")?.href;
      const categories = [];
      for (const anchor of cells[2].querySelectorAll(":scope > a")) {
        const categoryLabel = normalizedText(anchor).toLowerCase();
        const categoryName = CATEGORY_BY_SHORT_LABEL.get(categoryLabel);
        if (!categoryName) throw new Error(`Unknown category ${JSON.stringify(normalizedText(anchor))} in the element row for ${label}.`);
        categories.push({ name: categoryName, notation: `${categoryLabel}${followingTextStartsWithAsterisk(anchor) ? "*" : ""}` });
      }
      specialParticipants.push({ id, label, source, categories });
      continue;
    }
    const categories = [];
    for (const anchor of cells[2].querySelectorAll(":scope > a")) {
      const label = normalizedText(anchor).toLowerCase();
      const categoryName = CATEGORY_BY_SHORT_LABEL.get(label);
      if (!categoryName) throw new Error(`Unknown category ${JSON.stringify(normalizedText(anchor))} in an element-index row.`);
      categories.push({ name: categoryName, notation: `${label}${followingTextStartsWithAsterisk(anchor) ? "*" : ""}` });
    }
    if (categories.length === 0 && !["—", "none"].includes(normalizedText(cells[2]).toLowerCase())) {
      throw new Error(`Could not parse an element Categories cell: ${JSON.stringify(normalizedText(cells[2]))}.`);
    }
    const attributes = Array.from(cells[5].querySelectorAll(":scope > code"), (code) => {
      const name = normalizedText(code);
      return { name, notation: `${name}${followingTextStartsWithAsterisk(code) ? "*" : ""}` };
    });
    const hasGlobals = Array.from(cells[5].querySelectorAll(":scope > a"), normalizedText).includes("globals");
    const specialAttributeNotations = Array.from(cells[5].querySelectorAll(":scope > a"))
      .filter((anchor) => normalizedText(anchor) === "any")
      .map((anchor) => `any${followingTextStartsWithAsterisk(anchor) ? "*" : ""}`);
    if (!hasGlobals) throw new Error(`Element-index row ${JSON.stringify(normalizedText(cells[0]))} no longer includes the globals marker.`);
    if (specialAttributeNotations.some((notation) => notation !== "any*")) {
      throw new Error(`Unknown special attribute notation in the element row for ${normalizedText(cells[0])}.`);
    }
    for (const code of nameCodes) {
      const name = normalizedText(code);
      if (!/^[a-z][a-z0-9]*$/.test(name)) throw new Error(`Unexpected HTML element index entry: ${JSON.stringify(name)}.`);
      if (names.has(name)) throw new Error(`Duplicate HTML element index entry: ${name}.`);
      names.add(name);
      const source = code.querySelector(":scope > a")?.href;
      if (!source?.startsWith("https://html.spec.whatwg.org/multipage/")) {
        throw new Error(`Element ${name} has no stable WHATWG definition URL.`);
      }
      elements.push({
        name,
        source,
        categories: categories.map((category) => ({ ...category })),
        attributes: attributes.map((attribute) => ({ ...attribute })),
        specialAttributeNotations: [...specialAttributeNotations],
      });
    }
  }
  if (elements.length < 100 || elements.length > 200 || !names.has("html") || !names.has("selectedcontent")) {
    throw new Error(`The element index yielded an implausible ${elements.length} current HTML elements.`);
  }
  return { elements, specialParticipants };
}

function attributeContextId(name, global, elements, specialParticipants) {
  const scope = global ? "global" : [...elements, ...specialParticipants].join("-");
  if (!scope) throw new Error(`Attribute ${name} has no applicability scope.`);
  return `${name}-${scope}`;
}

function parseAttributeIndex(document, elementIndex, reflectedWebIdl) {
  const table = findFollowingTable(document, "attributes-3", ["Attribute", "Element(s)", "Description", "Value"]);
  if (normalizedText(table.querySelector("caption")) !== "List of attributes (excluding event handler content attributes)") {
    throw new Error("WHATWG structure drift: the attribute index no longer declares its event-handler exclusion.");
  }
  const elementNames = new Set(elementIndex.elements.map((element) => element.name));
  const globalNames = new Set();
  const byName = new Map();
  const seenContextIds = new Set();
  for (const row of table.querySelectorAll(":scope > tbody > tr")) {
    const cells = Array.from(row.children);
    if (cells.length !== 4 || cells[0]?.localName !== "th") {
      throw new Error("WHATWG structure drift: an attribute-index row does not have one heading and three data cells.");
    }
    const nameCodes = Array.from(cells[0].querySelectorAll(":scope > code"));
    if (nameCodes.length !== 1) throw new Error("WHATWG structure drift: an attribute-index row does not name exactly one attribute.");
    const name = normalizedText(nameCodes[0]);
    if (!/^[a-z][a-z0-9-]*$/.test(name)) throw new Error(`Unexpected HTML attribute index entry: ${JSON.stringify(name)}.`);

    const global = normalizedText(cells[1]) === "HTML elements";
    if (global) globalNames.add(name);
    const elements = [];
    const specialParticipants = [];
    const definitionSources = [];
    if (global) {
      const source = cells[1].querySelector(":scope > a")?.href;
      if (!source?.startsWith("https://html.spec.whatwg.org/multipage/")) {
        throw new Error(`Global attribute ${name} has no stable WHATWG definition URL.`);
      }
      definitionSources.push(source);
    } else {
      const definitionAnchors = Array.from(cells[1].querySelectorAll("code[id^='attributes-3:attr-'] > a"));
      const applicabilityAnchors = definitionAnchors.length > 0
        ? definitionAnchors
        : splitCellSegments(cells[1]).map((segment) => segment.querySelector("code > a")).filter(Boolean);
      for (const anchor of applicabilityAnchors) {
        const participant = normalizedText(anchor);
        if (!elementNames.has(participant)) throw new Error(`Attribute ${name} applies to unknown HTML element ${participant}.`);
        if (!elements.includes(participant)) elements.push(participant);
        if (!definitionSources.includes(anchor.href)) definitionSources.push(anchor.href);
      }
      if (normalizedText(cells[1]).includes("form-associated custom elements")) {
        specialParticipants.push("form-associated-custom-elements");
      }
      if (elements.length === 0 && specialParticipants.length === 0) {
        throw new Error(`Attribute ${name} has no recognized applicability participant.`);
      }
    }
    elements.sort();
    specialParticipants.sort();
    definitionSources.sort();
    const id = attributeContextId(name, global, elements, specialParticipants);
    if (seenContextIds.has(id)) throw new Error(`Duplicate HTML attribute context: ${id}.`);
    seenContextIds.add(id);

    const description = normalizedText(cells[2]);
    const valueSyntaxText = normalizedText(cells[3]);
    if (!description || !valueSyntaxText) throw new Error(`Attribute context ${id} has empty descriptive fields.`);
    const valueSyntaxSources = [...new Set(Array.from(cells[3].querySelectorAll("a"), (anchor) => anchor.href))].sort();
    const context = {
      id,
      global,
      elements,
      specialParticipants,
      description,
      valueSyntaxText,
      definitionSources,
      valueSyntaxSources,
      source: SOURCE_URLS.attributeIndex,
    };
    const definition = byName.get(name) ?? { name, ...attributeNaming(name, reflectedWebIdl), contexts: [] };
    definition.contexts.push(context);
    byName.set(name, definition);
  }
  const attributes = Array.from(byName.values()).sort((left, right) => left.name.localeCompare(right.name));
  if (attributes.length < 125 || attributes.length > 200 || !byName.has("href") || !byName.has("writingsuggestions")) {
    throw new Error(`The attribute index yielded an implausible ${attributes.length} current HTML attributes.`);
  }

  const contextsByElement = new Map(elementIndex.elements.map((element) => [element.name, new Set()]));
  for (const attribute of attributes) {
    for (const context of attribute.contexts) {
      for (const element of context.elements) contextsByElement.get(element).add(attribute.name);
    }
  }
  for (const element of elementIndex.elements) {
    const fromElementTable = new Set(element.attributes.map((attribute) => attribute.name).filter((name) => !/^on/.test(name)));
    const fromAttributeTable = new Set([...contextsByElement.get(element.name)].filter((name) => !globalNames.has(name)));
    const missing = [...fromElementTable].filter((name) => !fromAttributeTable.has(name) && !ELEMENT_INDEX_ONLY_ATTRIBUTE.has(`${element.name}:${name}`));
    const extra = [...fromAttributeTable].filter((name) => !fromElementTable.has(name) && !ATTRIBUTE_INDEX_ONLY.has(`${element.name}:${name}`));
    if (missing.length || extra.length) {
      throw new Error(`Attribute cross-check failed for ${element.name}: element table only [${missing.join(", ")}], attribute table only [${extra.join(", ")}].`);
    }
  }
  return {
    attributes,
    exceptions: ATTRIBUTE_CROSS_CHECK_EXCEPTIONS,
    eventHandlerExclusion: {
      description: "Event handler content attributes are explicitly excluded from the WHATWG attribute index and remain generic RDF/HTML attributes.",
      source: SOURCE_URLS.attributeIndex,
    },
  };
}

function splitCellSegments(cell) {
  const segments = [];
  let current = [];
  const flush = () => {
    const container = cell.ownerDocument.createElement("span");
    for (const node of current) container.append(node);
    const text = normalizedText(container);
    if (text && text !== "—") segments.push(container);
    current = [];
  };
  for (const child of Array.from(cell.childNodes)) {
    if (child.nodeType !== 3 || !child.textContent?.includes(";")) {
      current.push(child.cloneNode(true));
      continue;
    }
    const pieces = child.textContent.split(";");
    pieces.forEach((piece, index) => {
      if (piece) current.push(cell.ownerDocument.createTextNode(piece));
      if (index < pieces.length - 1) flush();
    });
  }
  flush();
  return segments;
}

function segmentParticipant(segment, elementNames) {
  const text = normalizedText(segment);
  const firstCode = segment.querySelector("code");
  const codeName = normalizedText(firstCode).toLowerCase();
  if (elementNames.has(codeName) && text.toLowerCase().startsWith(codeName)) {
    return { kind: "element", id: codeName, label: codeName };
  }
  for (const [label, id] of SPECIAL_PARTICIPANT_IDS) {
    if (text === label || text.startsWith(`${label} (`) || (id === "text" && text.startsWith("Text that "))) {
      return { kind: "special", id, label: id === "text" ? "Text" : label };
    }
  }
  throw new Error(`Unknown participant in the element content-category index: ${JSON.stringify(text)}.`);
}

function conditionFromNotation(notation, participantLabel) {
  const remainder = notation.slice(participantLabel.length).trim();
  if (!remainder) return undefined;
  if (remainder.startsWith("(") && remainder.endsWith(")")) return remainder.slice(1, -1).trim();
  if (participantLabel === "Text" && notation.startsWith("Text that ")) return notation.slice(5).trim();
  throw new Error(`Could not isolate condition text from category notation ${JSON.stringify(notation)}.`);
}

function parseCategoryIndex(document, elementIndex) {
  const table = findFollowingTable(document, "element-content-categories", [
    "Category", "Elements", "Elements with exceptions",
  ]);
  const indexedElements = elementIndex.elements;
  const elementNames = new Set(indexedElements.map((element) => element.name));
  const categories = [];
  const membershipByElement = new Map(indexedElements.map((element) => [element.name, []]));
  const specialById = new Map();
  const seenCategories = new Set();

  for (const row of table.querySelectorAll(":scope > tbody > tr")) {
    const cells = Array.from(row.children);
    if (cells.length !== 3) throw new Error("WHATWG structure drift: a content-category row does not have three cells.");
    const label = normalizedText(cells[0]);
    const definition = CATEGORY_BY_LABEL.get(label);
    if (!definition) throw new Error(`Unknown content-category row: ${JSON.stringify(label)}.`);
    if (seenCategories.has(definition.name)) throw new Error(`Duplicate content-category row: ${label}.`);
    seenCategories.add(definition.name);
    const source = cells[0].querySelector("a")?.href;
    if (!source) throw new Error(`Content category ${label} has no definition URL.`);
    categories.push({ ...definition, source });

    for (const [cellIndex, conditional] of [[1, false], [2, true]]) {
      for (const segment of splitCellSegments(cells[cellIndex])) {
        const notation = normalizedText(segment);
        const participant = segmentParticipant(segment, elementNames);
        const conditionText = conditionFromNotation(notation, participant.label);
        if (conditional && !conditionText) {
          throw new Error(`Conditional ${label} entry has no condition text: ${notation}.`);
        }
        if (!conditional && conditionText) {
          throw new Error(`Unconditional ${label} entry unexpectedly contains a condition: ${notation}.`);
        }
        const membership = {
          name: definition.name,
          conditional,
          source,
          ...(conditional ? {
            conditionId: `${definition.name}-${participant.id}`,
            conditionText,
            indexNotation: notation,
          } : {}),
        };
        if (participant.kind === "element") {
          const memberships = membershipByElement.get(participant.id);
          if (memberships.some((candidate) => candidate.name === definition.name)) {
            throw new Error(`${participant.id} is listed twice for ${label}.`);
          }
          memberships.push(membership);
        } else {
          const special = specialById.get(participant.id) ?? {
            id: participant.id,
            label: participant.label,
            source: segment.querySelector("a")?.href ?? SOURCE_URLS.contentCategoryIndex,
            categories: [],
          };
          if (special.categories.some((candidate) => candidate.name === definition.name)) {
            throw new Error(`${participant.label} is listed twice for ${label}.`);
          }
          special.categories.push(membership);
          specialById.set(participant.id, special);
        }
      }
    }
  }
  const missingCategories = CATEGORY_DEFINITIONS.filter((definition) => !seenCategories.has(definition.name));
  if (missingCategories.length) {
    throw new Error(`Missing expected content-category rows: ${missingCategories.map((item) => item.label).join(", ")}.`);
  }

  for (const indexed of indexedElements) {
    for (const indexedCategory of indexed.categories) {
      const key = `${indexed.name}:${indexedCategory.name}`;
      if (!ELEMENT_INDEX_ONLY_CONDITIONAL.has(key)) continue;
      const memberships = membershipByElement.get(indexed.name);
      if (!memberships.some((membership) => membership.name === indexedCategory.name)) {
        memberships.push({
          name: indexedCategory.name,
          conditional: true,
          source: indexed.source,
          conditionId: `${indexedCategory.name}-${indexed.name}`,
          indexNotation: indexedCategory.notation,
          elementIndexNotation: indexedCategory.notation,
        });
      }
    }
    const fromElementTable = new Set(indexed.categories.map((category) => category.name));
    const fromCategoryTable = new Set(membershipByElement.get(indexed.name).map((category) => category.name));
    const missing = [...fromElementTable].filter((name) => !fromCategoryTable.has(name));
    const extra = [...fromCategoryTable].filter((name) => (
      !fromElementTable.has(name)
      && !CATEGORY_INDEX_ONLY.has(name)
      && !CATEGORY_CROSSCHECK_EXCEPTIONS.has(`${indexed.name}:${name}`)
    ));
    if (missing.length || extra.length) {
      throw new Error(`Category cross-check failed for ${indexed.name}: element table only [${missing.join(", ")}], category table only [${extra.join(", ")}].`);
    }
    for (const membership of membershipByElement.get(indexed.name)) {
      membership.elementIndexNotation = indexed.categories.find((category) => category.name === membership.name)?.notation;
    }
  }
  for (const indexed of elementIndex.specialParticipants) {
    const participant = specialById.get(indexed.id);
    if (!participant) throw new Error(`Category cross-check failed: ${indexed.label} is absent from the category index.`);
    const fromElementTable = new Set(indexed.categories.map((category) => category.name));
    const fromCategoryTable = new Set(participant.categories.map((category) => category.name));
    const missing = [...fromElementTable].filter((name) => !fromCategoryTable.has(name));
    const extra = [...fromCategoryTable].filter((name) => !fromElementTable.has(name));
    if (missing.length || extra.length) {
      throw new Error(`Category cross-check failed for ${indexed.label}: element table only [${missing.join(", ")}], category table only [${extra.join(", ")}].`);
    }
    participant.source = indexed.source;
    for (const membership of participant.categories) {
      membership.elementIndexNotation = indexed.categories.find((category) => category.name === membership.name)?.notation;
    }
  }
  return {
    categories,
    memberships: membershipByElement,
    specialParticipants: Array.from(specialById.values()).sort((left, right) => left.id.localeCompare(right.id)),
  };
}

function parseSyntaxKinds(document, indexedElements) {
  const heading = document.getElementById("elements-2");
  if (!heading || heading.localName !== "h4") throw new Error("WHATWG structure drift: missing syntax heading #elements-2.");
  const introduction = heading.nextElementSibling;
  if (!introduction || introduction.localName !== "p" || !normalizedText(introduction).startsWith("There are six different kinds of elements:")) {
    throw new Error("WHATWG structure drift: the syntax-kind introduction no longer declares six kinds.");
  }
  let list = introduction.nextElementSibling;
  if (!list || list.localName !== "dl") throw new Error("WHATWG structure drift: the syntax-kind definition list is missing.");
  const kinds = [];
  const explicitAssignments = new Map();
  const seen = new Set();
  for (let term = list.firstElementChild; term; term = term.nextElementSibling?.nextElementSibling) {
    const description = term.nextElementSibling;
    if (term.localName !== "dt" || description?.localName !== "dd") {
      throw new Error("WHATWG structure drift: syntax kinds are no longer represented as dt/dd pairs.");
    }
    const label = normalizedText(term);
    const name = SYNTAX_KIND_BY_LABEL.get(label);
    if (!name) throw new Error(`Unknown HTML syntax kind: ${JSON.stringify(label)}.`);
    if (seen.has(name)) throw new Error(`Duplicate HTML syntax kind: ${label}.`);
    seen.add(name);
    const dfn = term.querySelector("dfn");
    if (!dfn?.id) throw new Error(`Syntax kind ${label} has no stable fragment identifier.`);
    const source = `${SOURCE_DOCUMENTS.syntax}#${dfn.id}`;
    if (name === "foreign") {
      const namespaces = Array.from(description.querySelectorAll("a"), (anchor) => ({
        label: normalizedText(anchor).replace(/ namespace$/, ""),
        source: anchor.href,
      }));
      if (namespaces.length !== 2 || !namespaces.some((item) => item.label === "MathML") || !namespaces.some((item) => item.label === "SVG")) {
        throw new Error("WHATWG foreign-element syntax kind no longer names exactly the MathML and SVG namespaces.");
      }
      kinds.push({ name, label, source, namespaces });
      continue;
    }
    if (name === "normal") {
      if (description.querySelectorAll("code").length !== 0 || !normalizedText(description).startsWith("All other allowed HTML elements")) {
        throw new Error("WHATWG normal-element syntax kind is no longer the residual HTML element class.");
      }
      kinds.push({ name, label, source });
      continue;
    }
    const elements = Array.from(description.querySelectorAll("code"), normalizedText);
    if (elements.length === 0) throw new Error(`Syntax kind ${label} contains no HTML elements.`);
    for (const element of elements) {
      if (!indexedElements.some((candidate) => candidate.name === element)) {
        throw new Error(`Syntax kind ${label} names unknown element ${element}.`);
      }
      if (explicitAssignments.has(element)) {
        throw new Error(`Element ${element} appears in both ${explicitAssignments.get(element)} and ${name} syntax kinds.`);
      }
      explicitAssignments.set(element, name);
    }
    kinds.push({ name, label, source, elements });
  }
  if (seen.size !== SYNTAX_KIND_BY_LABEL.size) {
    throw new Error(`Expected six HTML syntax kinds, received ${seen.size}.`);
  }
  const kindByElement = new Map(indexedElements.map((element) => [element.name, explicitAssignments.get(element.name) ?? "normal"]));
  return { kinds, kindByElement };
}

export function extractHtmlClassification({ indicesHtml, syntaxHtml, webIdlHtml, snapshotDate, sourceDigests }) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(snapshotDate)) throw new Error("Snapshot date must use YYYY-MM-DD.");
  const indicesDocument = new JSDOM(indicesHtml, { url: SOURCE_DOCUMENTS.indices }).window.document;
  const syntaxDocument = new JSDOM(syntaxHtml, { url: SOURCE_DOCUMENTS.syntax }).window.document;
  const webIdlDocument = new JSDOM(webIdlHtml, { url: SOURCE_DOCUMENTS.webIdl }).window.document;
  const reflectedWebIdl = parseReflectedWebIdl(webIdlDocument);
  const elementIndex = parseElementIndex(indicesDocument);
  const indexedElements = elementIndex.elements;
  const attributeData = parseAttributeIndex(indicesDocument, elementIndex, reflectedWebIdl);
  const categoryData = parseCategoryIndex(indicesDocument, elementIndex);
  const syntaxData = parseSyntaxKinds(syntaxDocument, indexedElements);
  const syntaxSourceByKind = new Map(syntaxData.kinds.map((kind) => [kind.name, kind.source]));
  const elements = indexedElements.map((element) => ({
    name: element.name,
    source: element.source,
    kind: syntaxData.kindByElement.get(element.name),
    kindSource: syntaxSourceByKind.get(syntaxData.kindByElement.get(element.name)),
    categories: categoryData.memberships.get(element.name),
    attributes: element.attributes,
    specialAttributeNotations: element.specialAttributeNotations,
  }));
  return {
    schemaVersion: 4,
    snapshotDate,
    sources: {
      elementIndex: { url: SOURCE_URLS.elementIndex, sha256: sourceDigests.indices },
      attributeIndex: { url: SOURCE_URLS.attributeIndex, sha256: sourceDigests.indices },
      contentCategoryIndex: { url: SOURCE_URLS.contentCategoryIndex, sha256: sourceDigests.indices },
      syntaxKinds: { url: SOURCE_URLS.syntaxKinds, sha256: sourceDigests.syntax },
      webIdl: { url: SOURCE_URLS.webIdl, sha256: sourceDigests.webIdl },
    },
    scope: {
      elements: "Current conforming elements in the HTML namespace; obsolete elements are excluded.",
      foreignElements: "MathML and SVG namespace elements are preserved as syntax-kind provenance but are outside the generated HTML element-class inventory.",
      specialParticipants: "Text nodes, autonomous custom elements, form-associated custom elements, and foreign category participants are preserved separately from named HTML element classes.",
      attributes: "Current conforming non-event-handler HTML content attributes are generated from the attribute index. Definition-resource names use same-letter reflected Web IDL casing where available, hyphen boundaries otherwise, and never guessed English word boundaries. Event handlers, data-* attributes, ARIA attributes, and other extension attributes use the generic fallback.",
    },
    syntaxKinds: syntaxData.kinds,
    contentCategories: categoryData.categories,
    crossCheckExceptions: CROSS_CHECK_EXCEPTIONS,
    attributeCrossCheckExceptions: attributeData.exceptions,
    attributeIndexExclusion: attributeData.eventHandlerExclusion,
    specialParticipants: categoryData.specialParticipants,
    attributes: attributeData.attributes,
    elements,
  };
}
