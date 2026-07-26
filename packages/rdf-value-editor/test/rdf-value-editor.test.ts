import { beforeEach, describe, expect, it, vi } from "vitest";
import { JSDOM } from "jsdom";
import { extractDataset } from "@ia2-dev/html-rdf";
import { Ia2RdfValueEditor } from "../src/rdf-value-editor.js";
// @ts-expect-error Vitest supplies Vite's raw-fixture import during tests.
import assignmentHtml from "../../../specs/rdf-html/examples/sources/assignment.html?raw";

const SOURCE = "https://example.test/contract";
const SCHEMA = "https://schema.org/";
const SHACL = "http://www.w3.org/ns/shacl#";
const XSD = "http://www.w3.org/2001/XMLSchema#";
const RDF = "http://www.w3.org/1999/02/22-rdf-syntax-ns#";
const OA = "http://www.w3.org/ns/oa#";
const AS = "http://www.w3.org/ns/activitystreams#";

if (!customElements.get("ia2-rdf-value-editor")) {
  customElements.define("ia2-rdf-value-editor", Ia2RdfValueEditor);
}

function presentation(
  id: string,
  shape: string,
  target: string | string[],
  scope?: string,
): string {
  const body = scope ? `${id}-body` : shape;
  const targets = Array.isArray(target) ? target : [target];
  return `
    <a href="${OA}Annotation" rdf-subject="${id}" rdf-predicate="${RDF}type" rdf-graph="#template"></a>
    <a href="${OA}describing" rdf-subject="${id}" rdf-predicate="${OA}motivatedBy" rdf-graph="#template"></a>
    <a href="${body}" rdf-subject="${id}" rdf-predicate="${OA}hasBody" rdf-graph="#template"></a>
    ${targets.map((iri) => (
      `<a href="${iri}" rdf-subject="${id}" rdf-predicate="${OA}hasTarget" rdf-graph="#template"></a>`
    )).join("")}
    ${scope ? `
      <a href="${OA}SpecificResource" rdf-subject="${body}" rdf-predicate="${RDF}type" rdf-graph="#template"></a>
      <a href="${shape}" rdf-subject="${body}" rdf-predicate="${OA}hasSource" rdf-graph="#template"></a>
      <a href="${scope}" rdf-subject="${body}" rdf-predicate="${OA}hasScope" rdf-graph="#template"></a>
    ` : ""}
  `;
}

function renderingChoice(
  id: string,
  target: string,
  alternatives: Array<[scope: string, template: string]>,
): string {
  const choice = `${id}-choice`;
  const listNodes = alternatives.map((_, index) => `${id}-items-${index + 1}`);
  return `
    <a href="${OA}Annotation" rdf-subject="${id}" rdf-predicate="${RDF}type" rdf-graph="#template"></a>
    <a href="${OA}editing" rdf-subject="${id}" rdf-predicate="${OA}motivatedBy" rdf-graph="#template"></a>
    <a href="${choice}" rdf-subject="${id}" rdf-predicate="${OA}hasBody" rdf-graph="#template"></a>
    <a href="${target}" rdf-subject="${id}" rdf-predicate="${OA}hasTarget" rdf-graph="#template"></a>
    <a href="${OA}Choice" rdf-subject="${choice}" rdf-predicate="${RDF}type" rdf-graph="#template"></a>
    <a href="${listNodes[0]}" rdf-subject="${choice}" rdf-predicate="${AS}items" rdf-graph="#template"></a>
    ${alternatives.map(([scope, template], index) => {
      const item = `${id}-alternative-${index + 1}`;
      return `
        <a href="${item}" rdf-subject="${listNodes[index]}" rdf-predicate="${RDF}first" rdf-graph="#template"></a>
        <a href="${listNodes[index + 1] ?? RDF + "nil"}" rdf-subject="${listNodes[index]}" rdf-predicate="${RDF}rest" rdf-graph="#template"></a>
        <a href="${OA}SpecificResource" rdf-subject="${item}" rdf-predicate="${RDF}type" rdf-graph="#template"></a>
        <a href="${template}" rdf-subject="${item}" rdf-predicate="${OA}hasSource" rdf-graph="#template"></a>
        <a href="${scope}" rdf-subject="${item}" rdf-predicate="${OA}hasScope" rdf-graph="#template"></a>
      `;
    }).join("")}
  `;
}

function semanticCarrierMarkup(): string {
  return `
    <span id="name-one">[Legal name]</span>
    <span id="name-two">[Legal name]</span>
    <data id="notice-days" value="10">[10]</data>
    <span id="scope-choice">[Choose scope]</span>
    <p id="future-content">Future-only terms.</p>
    <p id="all-content">All-liability terms: <span id="detail-choice">[Choose treatment]</span>, notice <span id="conditional-value">[days]</span>.</p>
    <p id="literal-boundary-content">Condition<span id="literal-boundary-choice">[ punctuation]</span></p>
    <template id="future-wording"><span data-projected-content>arising <strong>after</strong> signing</span></template>
    <template id="all-wording"><span data-projected-content>whether arising before or <em>after</em> signing</span></template>
    <template id="literal-boundary-wording"><span data-projected-content>&nbsp;; suite</span></template>
    <template id="empty-content"></template>
    <div hidden>
      <a href="${SHACL}PropertyShape" rdf-subject="#name-field" rdf-predicate="http://www.w3.org/1999/02/22-rdf-syntax-ns#type" rdf-graph="#template"></a>
      <a href="#party" rdf-subject="#name-field" rdf-predicate="${SHACL}targetNode" rdf-graph="#template"></a>
      <a href="${SCHEMA}legalName" rdf-subject="#name-field" rdf-predicate="${SHACL}path" rdf-graph="#template"></a>
      <span rdf-subject="#name-field" rdf-predicate="${SHACL}name" rdf-graph="#template">Party legal name</span>
      <data value="1" rdf-subject="#name-field" rdf-predicate="${SHACL}minCount" rdf-datatype="${XSD}integer" rdf-graph="#template"></data>
      ${presentation("#name-presentation", "#name-field", ["#name-one", "#name-two"])}

      <a href="${SHACL}PropertyShape" rdf-subject="#days-field" rdf-predicate="http://www.w3.org/1999/02/22-rdf-syntax-ns#type" rdf-graph="#template"></a>
      <a href="#agreement" rdf-subject="#days-field" rdf-predicate="${SHACL}targetNode" rdf-graph="#template"></a>
      <a href="#noticeDays" rdf-subject="#days-field" rdf-predicate="${SHACL}path" rdf-graph="#template"></a>
      <a href="${XSD}integer" rdf-subject="#days-field" rdf-predicate="${SHACL}datatype" rdf-graph="#template"></a>
      <span rdf-subject="#days-field" rdf-predicate="${SHACL}name" rdf-graph="#template">Notice period</span>
      <data value="1" rdf-subject="#days-field" rdf-predicate="${SHACL}minCount" rdf-datatype="${XSD}integer" rdf-graph="#template"></data>
      <data value="5" rdf-subject="#days-field" rdf-predicate="${SHACL}minInclusive" rdf-datatype="${XSD}integer" rdf-graph="#template"></data>
      <data value="60" rdf-subject="#days-field" rdf-predicate="${SHACL}maxInclusive" rdf-datatype="${XSD}integer" rdf-graph="#template"></data>
      <span rdf-subject="#days-field" rdf-predicate="${SHACL}message" rdf-graph="#template">Use 5 to 60 whole days.</span>
      <data value="10" rdf-subject="#days-field" rdf-predicate="${SHACL}defaultValue" rdf-datatype="${XSD}integer" rdf-graph="#template"></data>
      ${presentation("#days-presentation", "#days-field", "#notice-days")}

      <a href="${SCHEMA}ChooseAction" rdf-subject="#scope-action" rdf-predicate="http://www.w3.org/1999/02/22-rdf-syntax-ns#type" rdf-graph="#template"></a>
      <span rdf-subject="#scope-action" rdf-predicate="${SCHEMA}name" rdf-graph="#template">Liability scope</span>
      <a href="#future-only" rdf-subject="#scope-action" rdf-predicate="${SCHEMA}actionOption" rdf-graph="#template"></a>
      <a href="#all-liabilities" rdf-subject="#scope-action" rdf-predicate="${SCHEMA}actionOption" rdf-graph="#template"></a>
      ${presentation("#scope-presentation", "#scope-shape", "#scope-choice")}
      <span rdf-subject="#future-only" rdf-predicate="${SCHEMA}name" rdf-graph="#template">Future liabilities only</span>
      <span rdf-subject="#all-liabilities" rdf-predicate="${SCHEMA}name" rdf-graph="#template">All liabilities</span>
      ${renderingChoice("#scope-wording-rendering", "#scope-choice", [
        ["#future-only", "#future-wording"],
        ["#all-liabilities", "#all-wording"],
      ])}
      ${renderingChoice("#future-content-rendering", "#future-content", [
        ["#all-liabilities", "#empty-content"],
      ])}
      ${renderingChoice("#all-content-rendering", "#all-content", [
        ["#future-only", "#empty-content"],
        ["#detail-primary", "#empty-content"],
      ])}
      ${renderingChoice("#literal-boundary-rendering", "#literal-boundary-choice", [
        ["#future-only", "#literal-boundary-wording"],
        ["#all-liabilities", "#empty-content"],
      ])}
      <a href="${SHACL}PropertyShape" rdf-subject="#scope-shape" rdf-predicate="http://www.w3.org/1999/02/22-rdf-syntax-ns#type" rdf-graph="#template"></a>
      <a href="#scope-action" rdf-subject="#scope-shape" rdf-predicate="${SHACL}targetNode" rdf-graph="#template"></a>
      <a href="${SCHEMA}result" rdf-subject="#scope-shape" rdf-predicate="${SHACL}path" rdf-graph="#template"></a>
      <span rdf-subject="#scope-shape" rdf-predicate="${SHACL}name" rdf-graph="#template">Liability scope</span>
      <data value="1" rdf-subject="#scope-shape" rdf-predicate="${SHACL}minCount" rdf-datatype="${XSD}integer" rdf-graph="#template"></data>
      <data value="1" rdf-subject="#scope-shape" rdf-predicate="${SHACL}maxCount" rdf-datatype="${XSD}integer" rdf-graph="#template"></data>
      <a href="#scope-option-list" rdf-subject="#scope-shape" rdf-predicate="${SHACL}in" rdf-graph="#template"></a>
      <a href="#future-only" rdf-subject="#scope-option-list" rdf-predicate="http://www.w3.org/1999/02/22-rdf-syntax-ns#first" rdf-graph="#template"></a>
      <a href="#scope-option-list-tail" rdf-subject="#scope-option-list" rdf-predicate="http://www.w3.org/1999/02/22-rdf-syntax-ns#rest" rdf-graph="#template"></a>
      <a href="#all-liabilities" rdf-subject="#scope-option-list-tail" rdf-predicate="http://www.w3.org/1999/02/22-rdf-syntax-ns#first" rdf-graph="#template"></a>
      <a href="http://www.w3.org/1999/02/22-rdf-syntax-ns#nil" rdf-subject="#scope-option-list-tail" rdf-predicate="http://www.w3.org/1999/02/22-rdf-syntax-ns#rest" rdf-graph="#template"></a>

      <a href="${SCHEMA}ChooseAction" rdf-subject="#detail-action" rdf-predicate="http://www.w3.org/1999/02/22-rdf-syntax-ns#type" rdf-graph="#template"></a>
      <span rdf-subject="#detail-action" rdf-predicate="${SCHEMA}name" rdf-graph="#template">Liability treatment</span>
      <a href="#detail-primary" rdf-subject="#detail-action" rdf-predicate="${SCHEMA}actionOption" rdf-graph="#template"></a>
      <a href="#detail-secondary" rdf-subject="#detail-action" rdf-predicate="${SCHEMA}actionOption" rdf-graph="#template"></a>
      ${presentation("#detail-presentation", "#detail-shape", "#detail-choice", "#all-liabilities")}
      <span rdf-subject="#detail-primary" rdf-predicate="${SCHEMA}name" rdf-graph="#template">Primary</span>
      <span rdf-subject="#detail-secondary" rdf-predicate="${SCHEMA}name" rdf-graph="#template">Secondary</span>
      <a href="${SHACL}PropertyShape" rdf-subject="#detail-shape" rdf-predicate="http://www.w3.org/1999/02/22-rdf-syntax-ns#type" rdf-graph="#template"></a>
      <a href="#detail-action" rdf-subject="#detail-shape" rdf-predicate="${SHACL}targetNode" rdf-graph="#template"></a>
      <a href="${SCHEMA}result" rdf-subject="#detail-shape" rdf-predicate="${SHACL}path" rdf-graph="#template"></a>
      <span rdf-subject="#detail-shape" rdf-predicate="${SHACL}name" rdf-graph="#template">Liability treatment</span>
      <data value="1" rdf-subject="#detail-shape" rdf-predicate="${SHACL}minCount" rdf-datatype="${XSD}integer" rdf-graph="#template"></data>
      <data value="1" rdf-subject="#detail-shape" rdf-predicate="${SHACL}maxCount" rdf-datatype="${XSD}integer" rdf-graph="#template"></data>
      <a href="#detail-option-list" rdf-subject="#detail-shape" rdf-predicate="${SHACL}in" rdf-graph="#template"></a>
      <a href="#detail-primary" rdf-subject="#detail-option-list" rdf-predicate="http://www.w3.org/1999/02/22-rdf-syntax-ns#first" rdf-graph="#template"></a>
      <a href="#detail-option-list-tail" rdf-subject="#detail-option-list" rdf-predicate="http://www.w3.org/1999/02/22-rdf-syntax-ns#rest" rdf-graph="#template"></a>
      <a href="#detail-secondary" rdf-subject="#detail-option-list-tail" rdf-predicate="http://www.w3.org/1999/02/22-rdf-syntax-ns#first" rdf-graph="#template"></a>
      <a href="http://www.w3.org/1999/02/22-rdf-syntax-ns#nil" rdf-subject="#detail-option-list-tail" rdf-predicate="http://www.w3.org/1999/02/22-rdf-syntax-ns#rest" rdf-graph="#template"></a>

      <a href="${SHACL}PropertyShape" rdf-subject="#conditional-field" rdf-predicate="http://www.w3.org/1999/02/22-rdf-syntax-ns#type" rdf-graph="#template"></a>
      <a href="#agreement" rdf-subject="#conditional-field" rdf-predicate="${SHACL}targetNode" rdf-graph="#template"></a>
      <a href="#conditionalDays" rdf-subject="#conditional-field" rdf-predicate="${SHACL}path" rdf-graph="#template"></a>
      <a href="${XSD}integer" rdf-subject="#conditional-field" rdf-predicate="${SHACL}datatype" rdf-graph="#template"></a>
      <span rdf-subject="#conditional-field" rdf-predicate="${SHACL}name" rdf-graph="#template">Conditional notice period</span>
      <data value="1" rdf-subject="#conditional-field" rdf-predicate="${SHACL}minCount" rdf-datatype="${XSD}integer" rdf-graph="#template"></data>
      ${presentation("#conditional-presentation", "#conditional-field", "#conditional-value", "#all-liabilities")}
    </div>
  `;
}

async function mount(attributes: Record<string, string> = {}): Promise<Ia2RdfValueEditor> {
  document.documentElement.setAttribute("rdf-version", "1.2");
  document.head.innerHTML = `<link rel="canonical" href="${SOURCE}">`;
  document.body.innerHTML = semanticCarrierMarkup();
  const beforeMount = extractDataset(document);
  if (beforeMount.quads.length === 0) {
    throw new Error(`Fixture extraction failed: ${JSON.stringify(beforeMount.diagnostics)}`);
  }
  const editor = document.createElement("ia2-rdf-value-editor") as Ia2RdfValueEditor;
  editor.setAttribute("runtime-graph", "#runtime");
  for (const [name, value] of Object.entries(attributes)) editor.setAttribute(name, value);
  document.body.append(editor);
  await new Promise((resolve) => setTimeout(resolve, 0));
  return editor;
}

beforeEach(() => {
  document.head.replaceChildren();
  document.body.replaceChildren();
  document.documentElement.removeAttribute("rdf-version");
});

describe("IA² RDF value editor", () => {
  it("discovers SHACL fields and projects one value into every connected placeholder", async () => {
    const editor = await mount();
    const nameInput = Array.from(editor.shadowRoot!.querySelectorAll<HTMLInputElement>(".controls input"))
      .find((input) => input.previousElementSibling?.textContent === "Party legal name")!;

    expect(editor.shadowRoot!.querySelectorAll(".controls input, .controls select")).toHaveLength(5);
    expect(editor.shadowRoot?.textContent).not.toContain("SHACL shape enforced");
    expect(nameInput.required).toBe(true);
    nameInput.value = "Sample Entity LLC";
    nameInput.dispatchEvent(new Event("input", { bubbles: true }));
    await editor.validate();

    expect(document.querySelector("#name-one")?.textContent).toBe("Sample Entity LLC");
    expect(document.querySelector("#name-two")?.textContent).toBe("Sample Entity LLC");

    const result = extractDataset(document);
    expect(result.quads.some((quad) => (
      quad.subject.value === `${SOURCE}#party`
      && quad.predicate.value === `${SCHEMA}legalName`
      && quad.object.termType === "Literal"
      && quad.object.value === "Sample Entity LLC"
      && quad.graph?.value === `${SOURCE}#runtime`
    ))).toBe(true);
  });

  it("presents an empty minCount 1 and maxCount 1 field as required", async () => {
    const editor = await mount();
    const scopeSelect = Array.from(
      editor.shadowRoot!.querySelectorAll<HTMLSelectElement>(".controls select"),
    ).find((select) => select.previousElementSibling?.textContent === "Liability scope")!;

    expect(scopeSelect.required).toBe(true);
    scopeSelect.dispatchEvent(new Event("change", { bubbles: true }));
    const validation = await editor.validate();

    expect(validation.issues.find(({ label }) => label === "Liability scope")?.messages)
      .toEqual(["This value is required."]);
    expect(scopeSelect.validationMessage).toBe("This value is required.");
    expect(scopeSelect.getAttribute("aria-invalid")).toBe("true");
  });

  it("enforces declared datatypes and only publishes valid values as runtime RDF", async () => {
    const editor = await mount();
    const daysInput = Array.from(editor.shadowRoot!.querySelectorAll<HTMLInputElement>(".controls input"))
      .find((input) => input.previousElementSibling?.textContent === "Notice period")!;

    expect(daysInput.type).toBe("number");
    expect(daysInput.value).toBe("10");
    expect(document.querySelector("#notice-days")?.textContent).toBe("[10]");

    daysInput.value = "4.5";
    daysInput.dispatchEvent(new Event("input", { bubbles: true }));
    await editor.validate();
    expect(daysInput.getAttribute("aria-invalid")).toBe("true");
    expect(document.querySelector("#notice-days")?.getAttribute("data-value-state")).toBe("invalid");
    expect(extractDataset(document).quads.some((quad) => (
      quad.predicate.value === `${SOURCE}#noticeDays`
      && quad.graph?.value === `${SOURCE}#runtime`
    ))).toBe(false);

    daysInput.value = "4";
    daysInput.dispatchEvent(new Event("input", { bubbles: true }));
    const rangeValidation = await editor.validate();
    expect(rangeValidation.conforms).toBe(false);
    expect(rangeValidation.issues.find(({ label }) => label === "Notice period")?.messages)
      .toContain("Use 5 to 60 whole days.");
    expect(daysInput.validationMessage).toContain("Use 5 to 60 whole days.");

    daysInput.value = "30";
    daysInput.dispatchEvent(new Event("input", { bubbles: true }));
    const valid = await editor.validate();
    expect(valid.issues.some(({ label }) => label === "Notice period")).toBe(false);
    expect(daysInput.getAttribute("aria-invalid")).toBe("false");
    expect(document.querySelector("#notice-days")?.textContent).toBe("30");
    expect(extractDataset(document).quads.some((quad) => (
      quad.predicate.value === `${SOURCE}#noticeDays`
      && quad.object.termType === "Literal"
      && quad.object.value === "30"
      && quad.object.datatype.value === `${XSD}integer`
      && quad.graph?.value === `${SOURCE}#runtime`
    ))).toBe(true);
  });

  it("rejects replacement content outside the restricted template profile", async () => {
    document.documentElement.setAttribute("rdf-version", "1.2");
    document.head.innerHTML = `<link rel="canonical" href="${SOURCE}">`;
    document.body.innerHTML = semanticCarrierMarkup();
    document.querySelector<HTMLTemplateElement>("#future-wording")!.innerHTML
      = "<span>Unsafe projection</span><script>globalThis.compromised = true</script>";
    const editor = document.createElement("ia2-rdf-value-editor") as Ia2RdfValueEditor;
    editor.setAttribute("runtime-graph", "#runtime");
    document.body.append(editor);
    await new Promise((resolve) => setTimeout(resolve, 0));

    const scope = Array.from(editor.shadowRoot!.querySelectorAll<HTMLSelectElement>("select"))
      .find((select) => select.previousElementSibling?.textContent === "Liability scope")!;
    scope.value = `${SOURCE}#future-only`;
    scope.dispatchEvent(new Event("change", { bubbles: true }));
    await editor.validate();

    expect(document.querySelector("#scope-choice")?.textContent).toBe("[Choose scope]");
    expect(document.querySelector("#scope-choice script")).toBeNull();
    expect(editor.shadowRoot!.querySelector<HTMLElement>(".data-status")?.dataset.state)
      .toBe("warning");
  });

  it("projects declared option alternatives exactly and activates nested choices", async () => {
    const editor = await mount();
    const selects = Array.from(editor.shadowRoot!.querySelectorAll<HTMLSelectElement>(".controls select"));
    const scopeSelect = selects.find(
      (select) => select.previousElementSibling?.textContent === "Liability scope",
    )!;
    const detailSelect = selects.find(
      (select) => select.previousElementSibling?.textContent === "Liability treatment",
    )!;
    const conditionalInput = Array.from(
      editor.shadowRoot!.querySelectorAll<HTMLInputElement>(".controls input"),
    ).find((input) => input.previousElementSibling?.textContent === "Conditional notice period")!;

    expect(detailSelect.disabled).toBe(true);
    expect(detailSelect.closest<HTMLElement>(".field")?.hidden).toBe(true);
    expect(conditionalInput.disabled).toBe(true);

    scopeSelect.value = `${SOURCE}#future-only`;
    scopeSelect.dispatchEvent(new Event("change", { bubbles: true }));
    await editor.validate();
    expect(document.querySelector("#scope-choice")?.textContent).toBe("arising after signing");
    expect(document.querySelector("#scope-choice strong")?.textContent).toBe("after");
    expect(document.querySelector("#scope-choice [data-projected-content]")).not.toBeNull();
    expect(document.querySelector("#literal-boundary-content")?.textContent)
      .toBe("Condition\u00a0; suite");
    expect(document.querySelector<HTMLElement>("#future-content")?.hidden).toBe(false);
    expect(document.querySelector<HTMLElement>("#all-content")?.hidden).toBe(true);
    expect(detailSelect.disabled).toBe(true);
    expect(extractDataset(document).quads.some((quad) => (
      quad.subject.value === `${SOURCE}#scope-action`
      && quad.predicate.value === `${SCHEMA}result`
      && quad.object.termType === "NamedNode"
      && quad.object.value === `${SOURCE}#future-only`
      && quad.graph?.value === `${SOURCE}#runtime`
    ))).toBe(true);

    scopeSelect.value = `${SOURCE}#all-liabilities`;
    scopeSelect.dispatchEvent(new Event("change", { bubbles: true }));
    await editor.validate();
    expect(document.querySelector("#scope-choice")?.textContent)
      .toBe("whether arising before or after signing");
    expect(document.querySelector("#scope-choice em")?.textContent).toBe("after");
    expect(document.querySelector("#literal-boundary-content")?.textContent).toBe("Condition");
    expect(document.querySelector("#scope-choice template")).toBeNull();
    expect(document.querySelector<HTMLElement>("#future-content")?.hidden).toBe(true);
    expect(document.querySelector<HTMLElement>("#all-content")?.hidden).toBe(false);
    expect(document.querySelector("#detail-choice")).not.toBeNull();
    expect(document.querySelector("#conditional-value")).not.toBeNull();
    expect(detailSelect.disabled).toBe(false);
    expect(detailSelect.closest<HTMLElement>(".field")?.hidden).toBe(false);
    expect(conditionalInput.disabled).toBe(false);

    conditionalInput.value = "20";
    conditionalInput.dispatchEvent(new Event("input", { bubbles: true }));

    detailSelect.value = `${SOURCE}#detail-primary`;
    detailSelect.dispatchEvent(new Event("change", { bubbles: true }));
    await editor.validate();
    expect(document.querySelector<HTMLElement>("#all-content")?.hidden).toBe(true);
    expect(detailSelect.disabled).toBe(false);
    expect(detailSelect.closest<HTMLElement>(".field")?.hidden).toBe(false);
    expect(extractDataset(document).quads.some((quad) => (
      quad.subject.value === `${SOURCE}#detail-action`
      && quad.predicate.value === `${SCHEMA}result`
      && quad.object.termType === "NamedNode"
      && quad.object.value === `${SOURCE}#detail-primary`
      && quad.graph?.value === `${SOURCE}#runtime`
    ))).toBe(true);

    scopeSelect.value = `${SOURCE}#future-only`;
    scopeSelect.dispatchEvent(new Event("change", { bubbles: true }));
    await editor.validate();
    expect(document.querySelector("#scope-choice strong")?.textContent).toBe("after");
    expect(document.querySelector("#scope-choice em")).toBeNull();
    expect(document.querySelector("#literal-boundary-content")?.textContent)
      .toBe("Condition\u00a0; suite");
    expect(conditionalInput.disabled).toBe(true);
    expect(extractDataset(document).quads.some((quad) => (
      quad.subject.value === `${SOURCE}#detail-action`
      && quad.predicate.value === `${SCHEMA}result`
      && quad.graph?.value === `${SOURCE}#runtime`
    ))).toBe(false);
    expect(extractDataset(document).quads.some((quad) => (
      quad.predicate.value === `${SOURCE}#conditionalDays`
      && quad.graph?.value === `${SOURCE}#runtime`
    ))).toBe(false);
  });

  it("optionally backlinks every visible value to its generated control", async () => {
    const scrollTo = vi.fn();
    Object.defineProperty(HTMLElement.prototype, "scrollTo", {
      configurable: true,
      value: scrollTo,
    });
    const editor = await mount({ backlinks: "" });
    const firstPlaceholder = document.querySelector<HTMLElement>("#name-one")!;
    const repeatedPlaceholder = document.querySelector<HTMLElement>("#name-two")!;
    const nameInput = Array.from(editor.shadowRoot!.querySelectorAll<HTMLInputElement>(".controls input"))
      .find((input) => input.previousElementSibling?.textContent === "Party legal name")!;
    const pageScroll = vi.fn();
    firstPlaceholder.scrollIntoView = pageScroll;
    repeatedPlaceholder.scrollIntoView = pageScroll;
    expect(editor.setSyncMode("panel")).toBe(true);

    expect(firstPlaceholder.dataset.rdfValueEditorBacklink).toBe("");
    expect(firstPlaceholder.getAttribute("role")).toBe("button");
    expect(firstPlaceholder.tabIndex).toBe(0);
    expect(firstPlaceholder.getAttribute("aria-label")).toBe("Edit Party legal name");
    expect(firstPlaceholder.getAttribute("title")).toBe(
      "Edit Party legal name in Complete document",
    );

    repeatedPlaceholder.focus();
    expect(repeatedPlaceholder.dispatchEvent(new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
    }))).toBe(false);
    await new Promise((resolve) => setTimeout(resolve, 80));
    expect(editor.shadowRoot!.querySelector(".drawer")?.hasAttribute("data-open")).toBe(true);
    expect(editor.shadowRoot!.activeElement).toBe(nameInput);
    expect(scrollTo).toHaveBeenCalledWith({ behavior: "auto", top: 0 });
    expect(pageScroll).not.toHaveBeenCalled();
    expect(editor.getAttribute("sync")).toBe("panel");
    expect(editor.shadowRoot!.querySelector('[data-sync-mode="panel"]')?.getAttribute("aria-checked"))
      .toBe("true");

    const noticePlaceholder = document.querySelector<HTMLElement>("#notice-days")!;
    const noticeInput = Array.from(
      editor.shadowRoot!.querySelectorAll<HTMLInputElement>(".controls input"),
    ).find((input) => input.previousElementSibling?.textContent === "Notice period")!;
    nameInput.value = "Sample Entity LLC";
    nameInput.dispatchEvent(new Event("input", { bubbles: true }));
    nameInput.focus();
    expect(noticePlaceholder.dispatchEvent(new MouseEvent("pointerdown", {
      bubbles: true,
      button: 0,
      cancelable: true,
    }))).toBe(false);
    await new Promise((resolve) => setTimeout(resolve, 80));
    expect(editor.shadowRoot!.activeElement).toBe(noticeInput);

    const makeRect = (top: number, height = 40): DOMRect => ({
      bottom: top + height,
      height,
      left: 10,
      right: 210,
      top,
      width: 200,
      x: 10,
      y: top,
      toJSON: () => ({}),
    });
    const controls = editor.shadowRoot!.querySelector<HTMLElement>(".controls")!;
    controls.getBoundingClientRect = () => makeRect(0, 300);
    for (const control of editor.shadowRoot!.querySelectorAll<HTMLElement>(".controls input, .controls select")) {
      control.getBoundingClientRect = () => makeRect(500);
    }
    nameInput.getBoundingClientRect = () => makeRect(100);
    controls.dispatchEvent(new Event("scroll"));
    await new Promise((resolve) => setTimeout(resolve, 60));
    expect(pageScroll).toHaveBeenCalledWith({ behavior: "auto", block: "center" });

    editor.close();
    expect(document.activeElement).toBe(noticePlaceholder);

    firstPlaceholder.dispatchEvent(new KeyboardEvent("keydown", {
      bubbles: true,
      cancelable: true,
      key: " ",
    }));
    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(editor.shadowRoot!.activeElement).toBe(nameInput);
  });

  it("leaves visible value interactions unchanged unless backlinks are enabled", async () => {
    const editor = await mount();
    const placeholder = document.querySelector<HTMLElement>("#name-one")!;

    expect(placeholder.hasAttribute("data-rdf-value-editor-backlink")).toBe(false);
    expect(placeholder.hasAttribute("role")).toBe(false);
    expect(placeholder.hasAttribute("tabindex")).toBe(false);
    expect(placeholder.hasAttribute("aria-label")).toBe(false);
    expect(editor.shadowRoot!.querySelector(".drawer")?.hasAttribute("data-open")).toBe(false);
  });

  it("shares Navigator sync modes and follows in either direction", async () => {
    const makeRect = (top: number, height = 40): DOMRect => ({
      bottom: top + height,
      height,
      left: 10,
      right: 210,
      top,
      width: 200,
      x: 10,
      y: top,
      toJSON: () => ({}),
    });
    const editor = await mount();
    editor.open();
    const root = editor.shadowRoot!;
    const controls = root.querySelector<HTMLElement>(".controls")!;
    const syncSwitch = root.querySelector<HTMLElement>(".sync-switch")!;
    const syncOptions = Array.from(root.querySelectorAll<HTMLButtonElement>(".sync-option"));
    const inputs = Array.from(root.querySelectorAll<HTMLInputElement>(".controls input"));
    const nameInput = inputs.find(
      (input) => input.previousElementSibling?.textContent === "Party legal name",
    )!;
    const daysInput = inputs.find(
      (input) => input.previousElementSibling?.textContent === "Notice period",
    )!;
    const namePlaceholder = document.querySelector<HTMLElement>("#name-one")!;
    const daysPlaceholder = document.querySelector<HTMLElement>("#notice-days")!;
    const scrollAuthor = vi.fn();
    const scrollPage = vi.fn();
    Object.defineProperty(controls, "scrollTo", { configurable: true, value: scrollAuthor });
    controls.getBoundingClientRect = () => makeRect(0, 300);
    for (const placeholder of document.querySelectorAll<HTMLElement>("#name-one, #name-two, #notice-days, #scope-choice")) {
      placeholder.getBoundingClientRect = () => makeRect(window.innerHeight + 100);
    }
    namePlaceholder.getBoundingClientRect = () => makeRect(30);
    nameInput.getBoundingClientRect = () => makeRect(110);

    expect(syncSwitch.getAttribute("role")).toBe("radiogroup");
    expect(syncOptions.map(({ dataset }) => dataset.syncMode)).toEqual(["off", "page", "panel"]);
    expect(syncOptions.map((option) => option.getAttribute("aria-label"))).toEqual([
      "Scroll synchronization off",
      "Follow page viewport in editor",
      "Follow editor in page",
    ]);
    expect(syncOptions.every((option) => option.querySelector(".sync-icon"))).toBe(true);

    expect(editor.setSyncMode("page")).toBe(true);
    await new Promise((resolve) => setTimeout(resolve, 60));
    expect(editor.getAttribute("sync")).toBe("page");
    expect(scrollAuthor).toHaveBeenCalled();
    expect(nameInput.closest(".field")?.classList.contains("is-corresponding")).toBe(true);

    for (const input of inputs) input.getBoundingClientRect = () => makeRect(500);
    daysInput.getBoundingClientRect = () => makeRect(95);
    daysPlaceholder.scrollIntoView = scrollPage;
    expect(editor.setSyncMode("panel")).toBe(true);
    await new Promise((resolve) => setTimeout(resolve, 60));
    expect(scrollPage).toHaveBeenCalledWith({ behavior: "auto", block: "center" });
    expect(daysInput.closest(".field")?.classList.contains("is-corresponding")).toBe(true);

    syncOptions[2]!.focus();
    syncOptions[2]!.dispatchEvent(new KeyboardEvent("keydown", {
      bubbles: true,
      key: "Home",
    }));
    expect(syncOptions[0]!.getAttribute("aria-checked")).toBe("true");
    expect(root.activeElement).toBe(syncOptions[0]);
  });

  it("offers the Navigator position vocabulary for the completion window", async () => {
    const editor = await mount();
    const drawer = editor.shadowRoot!.querySelector<HTMLElement>(".drawer")!;
    const launcher = editor.shadowRoot!.querySelector<HTMLElement>(".launcher")!;
    const positions = editor.shadowRoot!.querySelectorAll<HTMLButtonElement>(".editor-position-option");

    expect(positions).toHaveLength(9);
    expect(Array.from(positions, ({ dataset }) => dataset.position)).toContain("bottom");
    expect(Array.from(positions, ({ dataset }) => dataset.position)).toContain("top");
    expect(drawer.dataset.position).toBe("right");
    expect(editor.setPosition("floating")).toBe(true);
    expect(drawer.dataset.position).toBe("floating");
    expect(launcher.dataset.position).toBe("floating");
    expect(editor.getAttribute("position")).toBe("floating");
    expect(editor.shadowRoot!.querySelector('[aria-label="Floating, centered"]')?.getAttribute("aria-checked"))
      .toBe("true");

    const resizeHandles = editor.shadowRoot!
      .querySelectorAll<HTMLElement>(".ia2-window-resize-handle");
    expect(resizeHandles).toHaveLength(8);
    drawer.getBoundingClientRect = () => ({
      bottom: 380,
      height: 300,
      left: 100,
      right: 500,
      top: 80,
      width: 400,
      x: 100,
      y: 80,
      toJSON: () => ({}),
    });
    editor.shadowRoot!.querySelector<HTMLElement>('[data-resize="se"]')!
      .dispatchEvent(new MouseEvent("pointerdown", {
        bubbles: true,
        button: 0,
        cancelable: true,
        clientX: 500,
        clientY: 380,
      }));
    window.dispatchEvent(new MouseEvent("pointermove", {
      clientX: 580,
      clientY: 450,
    }));
    window.dispatchEvent(new MouseEvent("pointerup"));
    expect(drawer.style.width).toBe("480px");
    expect(drawer.style.height).toBe("370px");
    expect(drawer.dataset.dragged).toBe("true");

    expect(editor.setPosition("right")).toBe(true);
    expect(drawer.style.width).toBe("");
    expect(drawer.style.height).toBe("");
    expect(drawer.dataset.dragged).toBeUndefined();

    editor.shadowRoot!.querySelector<HTMLElement>('[data-resize="w"]')!
      .dispatchEvent(new MouseEvent("pointerdown", {
        bubbles: true,
        button: 0,
        cancelable: true,
        clientX: 100,
        clientY: 200,
      }));
    window.dispatchEvent(new MouseEvent("pointermove", {
      clientX: 50,
      clientY: 200,
    }));
    window.dispatchEvent(new MouseEvent("pointerup"));
    expect(drawer.style.getPropertyValue("--ia2-window-width")).toBe("450px");
  });

  it("lets the host restrict or disable reader positioning", async () => {
    const restricted = await mount({
      "allowed-positions": "floating right-bottom",
      position: "floating",
    });
    expect(restricted.shadowRoot!.querySelectorAll(".editor-position-option")).toHaveLength(2);
    expect(restricted.setPosition("left")).toBe(false);
    expect(restricted.setPosition("right-bottom")).toBe(true);
    expect(restricted.shadowRoot!.querySelector<HTMLElement>(".drawer")?.dataset.position)
      .toBe("right-bottom");

    restricted.remove();
    const fixed = await mount({
      position: "left",
      positioning: "fixed",
    });
    expect(fixed.shadowRoot!.querySelector(".editor-position-switch")).toBeNull();
    expect(fixed.shadowRoot!.querySelector(".ia2-window-resize-handles")).toBeNull();
    expect(fixed.shadowRoot!.querySelector<HTMLElement>(".drawer")?.dataset.position).toBe("left");
  });

  it("uses a host label and can refresh, disconnect, and reconnect without stale projections", async () => {
    const editor = await mount({ label: "Author values" });
    const input = Array.from(editor.shadowRoot!.querySelectorAll<HTMLInputElement>(".controls input"))
      .find((candidate) => candidate.previousElementSibling?.textContent === "Party legal name")!;
    input.value = "Example Cooperative";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await editor.validate();

    expect(editor.shadowRoot!.querySelector(".launcher")?.textContent).toContain("Author values");
    expect(document.querySelectorAll("[data-ia2-rdf-value-editor-runtime]")).toHaveLength(1);
    expect(document.getElementById("ia2-rdf-value-editor-runtime-data")).toBeNull();

    editor.remove();
    expect(document.querySelector("#name-one")?.textContent).toBe("[Legal name]");
    expect(document.querySelector("#name-one")?.hasAttribute("data-value-placeholder")).toBe(false);
    expect(document.querySelectorAll("[data-ia2-rdf-value-editor-runtime]")).toHaveLength(0);

    document.body.append(editor);
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(editor.shadowRoot!.querySelectorAll(".controls input, .controls select")).toHaveLength(5);
    expect(document.querySelectorAll("[data-ia2-rdf-value-editor-runtime]")).toHaveLength(1);

    document.querySelector("[rdf-subject='#days-field']")?.setAttribute(
      "rdf-subject",
      "#renamed-days-field",
    );
    editor.refresh();
    expect(editor.shadowRoot!.querySelectorAll(".controls input, .controls select").length).toBeLessThan(5);
  });

  it("round-trips accepted values through completed HTML and companion RDF documents", async () => {
    const editor = await mount();
    const root = editor.shadowRoot!;
    const inputFor = (label: string): HTMLInputElement => (
      Array.from(root.querySelectorAll<HTMLInputElement>(".controls input"))
        .find((input) => input.previousElementSibling?.textContent === label)!
    );
    const selectFor = (label: string): HTMLSelectElement => (
      Array.from(root.querySelectorAll<HTMLSelectElement>(".controls select"))
        .find((select) => select.previousElementSibling?.textContent === label)!
    );
    const name = inputFor("Party legal name");
    const conditional = inputFor("Conditional notice period");
    const scope = selectFor("Liability scope");
    const detail = selectFor("Liability treatment");

    name.value = "Sample Entity LLC";
    name.dispatchEvent(new Event("input", { bubbles: true }));
    scope.value = `${SOURCE}#all-liabilities`;
    scope.dispatchEvent(new Event("change", { bubbles: true }));
    detail.value = `${SOURCE}#detail-secondary`;
    detail.dispatchEvent(new Event("change", { bubbles: true }));
    conditional.value = "21";
    conditional.dispatchEvent(new Event("input", { bubbles: true }));
    expect(() => editor.exportCompletion("turtle")).toThrow(
      "SHACL validation is still running",
    );
    await editor.validate();

    const turtle = editor.exportCompletion("turtle");
    expect(turtle).toContain("@prefix prov: <http://www.w3.org/ns/prov#>");
    expect(turtle).toContain(`prov:wasDerivedFrom <${SOURCE}>`);
    expect(turtle).toContain(`<${SOURCE}#party> schema:legalName "Sample Entity LLC"`);
    expect(turtle).toContain(`<${SOURCE}#scope-action> schema:result <${SOURCE}#all-liabilities>`);
    expect(turtle).toContain(`<${SOURCE}#conditionalDays> "21"^^xsd:integer`);
    expect(turtle).not.toContain(`${SOURCE}#noticeDays`);

    name.value = "Changed value";
    name.dispatchEvent(new Event("input", { bubbles: true }));
    scope.value = `${SOURCE}#future-only`;
    scope.dispatchEvent(new Event("change", { bubbles: true }));

    const loadedTurtle = await editor.loadCompletion(turtle, {
      contentType: "text/turtle",
      filename: "contract.values.ttl",
    });
    expect(loadedTurtle).toEqual({
      applied: 4,
      issues: [],
      sourceDocumentIris: [SOURCE],
    });
    expect(name.value).toBe("Sample Entity LLC");
    expect(scope.value).toBe(`${SOURCE}#all-liabilities`);
    expect(detail.value).toBe(`${SOURCE}#detail-secondary`);
    expect(conditional.value).toBe("21");
    expect(document.querySelector("#name-one")?.textContent).toBe("Sample Entity LLC");
    expect(document.querySelector<HTMLElement>("#all-content")?.hidden).toBe(false);
    expect(extractDataset(document).quads.some((quad) => (
      quad.subject.value === `${SOURCE}#agreement`
      && quad.predicate.value === `${SOURCE}#conditionalDays`
      && quad.object.termType === "Literal"
      && quad.object.value === "21"
      && quad.graph?.value === `${SOURCE}#runtime`
    ))).toBe(true);

    const completed = editor.exportCompletedDocument();
    expect(completed).toContain("Sample Entity LLC");
    expect(completed).toContain("whether arising before or <em>after</em> signing");
    expect(completed).not.toContain("<ia2-rdf-value-editor");
    expect(completed).not.toContain("data-value-placeholder");
    expect(completed).not.toContain("data-value-state");
    expect(completed).toContain("data-ia2-completed-value");
    expect(completed).toContain("background: transparent !important");
    expect(completed).toContain("border-bottom-color: transparent !important");
    expect(completed).toContain("text-decoration: none !important");
    const completedDocument = new DOMParser().parseFromString(completed, "text/html");
    expect(extractDataset(completedDocument).quads.some((quad) => (
      quad.subject.value === `${SOURCE}#party`
      && quad.predicate.value === `${SCHEMA}legalName`
      && quad.object.termType === "Literal"
      && quad.object.value === "Sample Entity LLC"
      && quad.graph?.value === `${SOURCE}#runtime`
    ))).toBe(true);

    const html = editor.exportCompletion("html");
    expect(html).toContain('<html lang="en" rdf-version="1.2">');
    expect(html).toContain("http://www.w3.org/ns/prov#wasDerivedFrom");
    expect(html).toContain("This companion contains accepted values, not the source document.");

    const completedAuthor = await mount();
    const loadedCompleted = await completedAuthor.loadCompletion(completed, {
      contentType: "text/html",
      filename: "contract.completed.html",
    });
    expect(loadedCompleted).toEqual({
      applied: 4,
      issues: [],
      sourceDocumentIris: [SOURCE],
    });
    expect(document.querySelector("#name-two")?.textContent).toBe("Sample Entity LLC");
    expect(document.querySelector("#conditional-value")?.textContent).toBe("21");

    const freshAuthor = await mount();
    const loadedHtml = await freshAuthor.loadCompletion(html, {
      contentType: "text/html",
      filename: "contract.values.html",
    });
    expect(loadedHtml.applied).toBe(4);
    expect(loadedHtml.issues).toEqual([]);
    expect(document.querySelector("#name-two")?.textContent).toBe("Sample Entity LLC");
    expect(document.querySelector("#conditional-value")?.textContent).toBe("21");

    const freshName = Array.from(
      freshAuthor.shadowRoot!.querySelectorAll<HTMLInputElement>(".controls input"),
    ).find((input) => input.previousElementSibling?.textContent === "Party legal name")!;
    const wrongSource = `
      @prefix prov: <http://www.w3.org/ns/prov#> .
      @prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
      @prefix dcterms: <http://purl.org/dc/terms/> .
      @prefix schema: <https://schema.org/> .
      <urn:state> rdf:type prov:Entity ;
        prov:wasDerivedFrom <https://example.test/other-contract> ;
        dcterms:conformsTo <https://ia2.dev/spec/html-rdf#completion-values-profile> .
      <${SOURCE}#party> schema:legalName "Wrong source" .
    `;
    const rejected = await freshAuthor.loadCompletion(wrongSource, { contentType: "text/turtle" });
    expect(rejected.applied).toBe(0);
    expect(rejected.issues).toContain("These values were saved for a different source document.");
    expect(freshName.value).toBe("Sample Entity LLC");

    const unrelatedProv = `
      @prefix prov: <http://www.w3.org/ns/prov#> .
      <urn:state> a prov:Entity ; prov:wasDerivedFrom <${SOURCE}> .
    `;
    const rejectedProv = await freshAuthor.loadCompletion(unrelatedProv, {
      contentType: "text/turtle",
    });
    expect(rejectedProv.applied).toBe(0);
    expect(rejectedProv.issues.join(" ")).toContain("completion-values-profile");

    const duplicate = `${turtle}
      <${SOURCE}#party> <${SCHEMA}legalName> "Duplicate" .
    `;
    const rejectedDuplicate = await freshAuthor.loadCompletion(duplicate, {
      contentType: "text/turtle",
    });
    expect(rejectedDuplicate.applied).toBe(0);
    expect(rejectedDuplicate.issues).toContain(
      "Party legal name has 2 values; this control requires at most one.",
    );

    const missingProvenance = `
      @prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
      @prefix prov: <http://www.w3.org/ns/prov#> .
      <urn:state> rdf:type prov:Entity .
      <${SOURCE}#party> <${SCHEMA}legalName> "Unproven" .
    `;
    const rejectedUnproven = await freshAuthor.loadCompletion(missingProvenance, {
      contentType: "text/turtle",
    });
    expect(rejectedUnproven.applied).toBe(0);
    expect(rejectedUnproven.issues).toContain(
      "A completion document must identify exactly one source with prov:wasDerivedFrom.",
    );
  });

  it("saves a selected completed or portable values document", async () => {
    const editor = await mount();
    const input = Array.from(
      editor.shadowRoot!.querySelectorAll<HTMLInputElement>(".controls input"),
    ).find((candidate) => candidate.previousElementSibling?.textContent === "Party legal name")!;
    input.value = "Two Artifact LLC";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await editor.validate();

    const downloads: string[] = [];
    const urls: string[] = [];
    const click = vi.spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(function recordDownload(this: HTMLAnchorElement) {
        downloads.push(this.download);
      });
    const createObjectURL = vi.fn((_blob: Blob) => {
      const url = `blob:completion-${urls.length + 1}`;
      urls.push(url);
      return url;
    });
    const revokeObjectURL = vi.fn();
    const originalCreateObjectURL = window.URL.createObjectURL;
    const originalRevokeObjectURL = window.URL.revokeObjectURL;
    Object.defineProperty(window.URL, "createObjectURL", {
      configurable: true,
      value: createObjectURL,
    });
    Object.defineProperty(window.URL, "revokeObjectURL", {
      configurable: true,
      value: revokeObjectURL,
    });
    try {
      const completed = editor.saveArtifact("completed");
      const htmlValues = editor.saveArtifact("values", "html");
      const turtleValues = editor.saveArtifact("values", "turtle");
      expect(completed).toContain("Two Artifact LLC");
      expect(htmlValues).toContain("Two Artifact LLC");
      expect(turtleValues).toContain("Two Artifact LLC");
      expect(downloads).toEqual([
        "contract.completed.html",
        "contract.values.html",
        "contract.values.ttl",
      ]);
      expect(createObjectURL).toHaveBeenCalledTimes(3);
      expect(createObjectURL.mock.calls.map(([blob]) => (blob as Blob).type)).toEqual([
        "text/html;charset=utf-8",
        "text/html;charset=utf-8",
        "text/turtle;charset=utf-8",
      ]);
      expect(editor.shadowRoot!.querySelector(".data-status")?.textContent)
        .toBe("Saved Turtle values document.");
      await new Promise((resolve) => setTimeout(resolve, 0));
      expect(revokeObjectURL).toHaveBeenCalledTimes(3);
    } finally {
      click.mockRestore();
      Object.defineProperty(window.URL, "createObjectURL", {
        configurable: true,
        value: originalCreateObjectURL,
      });
      Object.defineProperty(window.URL, "revokeObjectURL", {
        configurable: true,
        value: originalRevokeObjectURL,
      });
    }
  });

  it("explains the ontology-driven architecture in a focused centered window", async () => {
    const editor = await mount();
    editor.open();
    const trigger = editor.shadowRoot!.querySelector<HTMLButtonElement>(".how-link")!;
    trigger.click();

    const help = editor.shadowRoot!.querySelector<HTMLElement>(".architecture-window")!;
    expect(help.dataset.open).toBe("true");
    expect(help.hasAttribute("inert")).toBe(false);
    expect(help.hasAttribute("data-position")).toBe(false);
    expect(help.querySelector(".help-position-switch")).toBeNull();
    expect(help.querySelector(".drag-grip")).toBeNull();
    expect(help.textContent).toContain("no field list, document selectors, or domain-specific branches");
    expect(help.textContent).toContain("oa:Annotation");
    expect(help.textContent).toContain("oa:Choice");
    expect(help.textContent).toContain("host-selected named graph");
    expect(help.textContent).toContain("Save offers the completed document and portable state separately");
    expect(help.textContent).toContain("clean completed HTML/RDF copy");
    expect(help.textContent).not.toContain("FIBO");
    expect(help.textContent).not.toContain("contract fields");
    expect(help.querySelector(".inspect-rdf")).toBeNull();
    expect(help.querySelector('[role="img"]')?.getAttribute("aria-label"))
      .toContain("SHACL property shapes");
    expect(help.querySelector(".connector-example")?.textContent)
      .toContain("http://www.w3.org/ns/oa#hasTarget");
    expect(help.querySelector(".connector-example")?.textContent).not.toContain("rdf-resource");

    help.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "Escape" }));
    expect(help.dataset.open).toBe("false");
    expect(help.hasAttribute("inert")).toBe(true);
    expect(document.activeElement).not.toBe(trigger);
    expect(editor.shadowRoot!.activeElement).toBe(trigger);
  });

  it("authors a scoped non-legal semantic island with literal enums, custom labels, and IRI values", async () => {
    const labSource = "https://example.test/lab-intake";
    const ex = `${labSource}#`;
    document.documentElement.setAttribute("rdf-version", "1.2");
    document.head.innerHTML = `<link rel="canonical" href="${labSource}">`;
    document.body.innerHTML = `
      <section id="lab-island">
        <p>Status: <span id="sample-status">[status]</span></p>
        <p>Storage: <span id="sample-storage">[storage]</span></p>
        <p>Protocol: <span id="sample-protocol">[protocol IRI]</span></p>
        <div hidden>
          <a href="${SHACL}PropertyShape" rdf-subject="#status-shape" rdf-predicate="http://www.w3.org/1999/02/22-rdf-syntax-ns#type"></a>
          <a href="#sample-17" rdf-subject="#status-shape" rdf-predicate="${SHACL}targetNode"></a>
          <a href="#status" rdf-subject="#status-shape" rdf-predicate="${SHACL}path"></a>
          <span rdf-subject="#status-shape" rdf-predicate="${SHACL}name">Processing status</span>
          ${presentation("#status-presentation", "#status-shape", "#sample-status")}
          <a href="#status-list" rdf-subject="#status-shape" rdf-predicate="${SHACL}in"></a>
          <data value="queued" rdf-subject="#status-list" rdf-predicate="http://www.w3.org/1999/02/22-rdf-syntax-ns#first"></data>
          <a href="#status-list-tail" rdf-subject="#status-list" rdf-predicate="http://www.w3.org/1999/02/22-rdf-syntax-ns#rest"></a>
          <data value="processed" rdf-subject="#status-list-tail" rdf-predicate="http://www.w3.org/1999/02/22-rdf-syntax-ns#first"></data>
          <a href="http://www.w3.org/1999/02/22-rdf-syntax-ns#nil" rdf-subject="#status-list-tail" rdf-predicate="http://www.w3.org/1999/02/22-rdf-syntax-ns#rest"></a>

          <a href="${SHACL}PropertyShape" rdf-subject="#storage-shape" rdf-predicate="http://www.w3.org/1999/02/22-rdf-syntax-ns#type"></a>
          <a href="#sample-17" rdf-subject="#storage-shape" rdf-predicate="${SHACL}targetNode"></a>
          <a href="#storageMode" rdf-subject="#storage-shape" rdf-predicate="${SHACL}path"></a>
          <span rdf-subject="#storage-shape" rdf-predicate="${SHACL}name">Storage mode</span>
          ${presentation("#storage-presentation", "#storage-shape", "#sample-storage")}
          <a href="#storage-list" rdf-subject="#storage-shape" rdf-predicate="${SHACL}in"></a>
          <a href="#cold" rdf-subject="#storage-list" rdf-predicate="http://www.w3.org/1999/02/22-rdf-syntax-ns#first"></a>
          <a href="#storage-list-tail" rdf-subject="#storage-list" rdf-predicate="http://www.w3.org/1999/02/22-rdf-syntax-ns#rest"></a>
          <a href="#ambient" rdf-subject="#storage-list-tail" rdf-predicate="http://www.w3.org/1999/02/22-rdf-syntax-ns#first"></a>
          <a href="http://www.w3.org/1999/02/22-rdf-syntax-ns#nil" rdf-subject="#storage-list-tail" rdf-predicate="http://www.w3.org/1999/02/22-rdf-syntax-ns#rest"></a>
          <span rdf-subject="#cold" rdf-predicate="#displayName">Cold storage</span>
          <span rdf-subject="#ambient" rdf-predicate="#displayName">Ambient storage</span>

          <a href="${SHACL}PropertyShape" rdf-subject="#protocol-shape" rdf-predicate="http://www.w3.org/1999/02/22-rdf-syntax-ns#type"></a>
          <a href="#sample-17" rdf-subject="#protocol-shape" rdf-predicate="${SHACL}targetNode"></a>
          <a href="#protocol" rdf-subject="#protocol-shape" rdf-predicate="${SHACL}path"></a>
          <a href="${SHACL}IRI" rdf-subject="#protocol-shape" rdf-predicate="${SHACL}nodeKind"></a>
          <span rdf-subject="#protocol-shape" rdf-predicate="${SHACL}name">Protocol record</span>
          ${presentation("#protocol-presentation", "#protocol-shape", "#sample-protocol")}
        </div>
      </section>
      <section id="unrelated-island">
        <span id="ignored-value">[ignored]</span>
        <a href="${SHACL}PropertyShape" rdf-subject="#ignored-shape" rdf-predicate="http://www.w3.org/1999/02/22-rdf-syntax-ns#type"></a>
        <a href="#ignored" rdf-subject="#ignored-shape" rdf-predicate="${SHACL}targetNode"></a>
        <a href="#value" rdf-subject="#ignored-shape" rdf-predicate="${SHACL}path"></a>
        ${presentation("#ignored-presentation", "#ignored-shape", "#ignored-value")}
      </section>
    `;
    const editor = document.createElement("ia2-rdf-value-editor") as Ia2RdfValueEditor;
    editor.setAttribute("source-root", "#lab-island");
    editor.setAttribute("runtime-graph", "#runtime");
    editor.setAttribute("label-predicates", `${ex}displayName`);
    document.body.append(editor);
    await new Promise((resolve) => setTimeout(resolve, 0));

    const controls = Array.from(
      editor.shadowRoot!.querySelectorAll<HTMLInputElement | HTMLSelectElement>(".controls input, .controls select"),
    );
    expect(controls).toHaveLength(3);
    expect(editor.modelIssues).toEqual([]);

    const status = controls.find((control) => control.previousElementSibling?.textContent === "Processing status") as HTMLSelectElement;
    const processed = Array.from(status.options).find((option) => option.textContent === "processed")!;
    status.value = processed.value;
    status.dispatchEvent(new Event("change", { bubbles: true }));

    const storage = controls.find((control) => control.previousElementSibling?.textContent === "Storage mode") as HTMLSelectElement;
    expect(Array.from(storage.options, ({ textContent }) => textContent)).toContain("Cold storage");
    storage.value = Array.from(storage.options).find((option) => option.textContent === "Cold storage")!.value;
    storage.dispatchEvent(new Event("change", { bubbles: true }));

    const protocol = controls.find((control) => control.previousElementSibling?.textContent === "Protocol record") as HTMLInputElement;
    expect(protocol.type).toBe("url");
    protocol.value = "https://example.test/protocols/centrifuge-v2";
    protocol.dispatchEvent(new Event("input", { bubbles: true }));
    await editor.validate();

    const runtime = extractDataset(document.querySelector("#lab-island")!);
    expect(runtime.quads.some((quad) => (
      quad.subject.value === `${ex}sample-17`
      && quad.predicate.value === `${ex}status`
      && quad.object.termType === "Literal"
      && quad.object.value === "processed"
    ))).toBe(true);
    expect(runtime.quads.some((quad) => (
      quad.predicate.value === `${ex}protocol`
      && quad.object.termType === "NamedNode"
      && quad.object.value === "https://example.test/protocols/centrifuge-v2"
    ))).toBe(true);
    expect(editor.exportCompletion("turtle")).toContain("<https://example.test/protocols/centrifuge-v2>");
  });

  it("owns runtime RDF, events, and completed export in an external document root", async () => {
    const external = new JSDOM(
      `<!doctype html><html rdf-version="1.2"><head>
        <link rel="canonical" href="${SOURCE}">
        <title>External shaped source</title>
      </head><body>${semanticCarrierMarkup()}</body></html>`,
      { url: "https://preview.example.test/contract" },
    );
    const editor = document.createElement("ia2-rdf-value-editor") as Ia2RdfValueEditor;
    editor.sourceRoot = external.window.document;
    editor.setAttribute("runtime-graph", "#runtime");
    document.body.innerHTML = '<p id="host-only">Editor host</p>';
    document.body.append(editor);
    const datasetChange = vi.fn();
    external.window.document.addEventListener("ia2-rdf-dataset-change", datasetChange);
    await new Promise((resolve) => setTimeout(resolve, 0));

    const name = Array.from(
      editor.shadowRoot!.querySelectorAll<HTMLInputElement>(".controls input"),
    ).find((input) => input.previousElementSibling?.textContent === "Party legal name")!;
    name.value = "External Entity";
    name.dispatchEvent(new Event("input", { bubbles: true }));
    await editor.validate();

    expect(external.window.document.querySelector("#name-one")?.textContent).toBe("External Entity");
    expect(external.window.document.querySelector("[data-ia2-rdf-value-editor-runtime]")).not.toBeNull();
    expect(document.querySelector("[data-ia2-rdf-value-editor-runtime]")).toBeNull();
    expect(datasetChange).toHaveBeenCalled();
    const completed = editor.exportCompletedDocument();
    expect(completed).toContain("<title>External shaped source</title>");
    expect(completed).toContain("External Entity");
    expect(completed).not.toContain("host-only");
  });

  it("authors the assignment without document-specific configuration or model issues", async () => {
    const parsed = new DOMParser().parseFromString(assignmentHtml, "text/html");
    document.documentElement.setAttribute("rdf-version", "1.2");
    document.head.innerHTML = parsed.head.innerHTML;
    document.body.innerHTML = parsed.body.innerHTML;
    await new Promise((resolve) => setTimeout(resolve, 0));

    const editor = document.querySelector<Ia2RdfValueEditor>("ia2-rdf-value-editor")!;
    expect(editor.shadowRoot!.querySelectorAll(".controls input, .controls select").length)
      .toBeGreaterThan(30);
    expect(editor.shadowRoot!.querySelectorAll(".controls select")).toHaveLength(7);
    expect(editor.hasAttribute("connector-predicate")).toBe(false);
    expect(editor.hasAttribute("uses-shape-predicate")).toBe(false);
    expect(editor.shadowRoot!.querySelector<HTMLElement>(".data-status")?.hidden).toBe(true);
    expect(Array.from(editor.shadowRoot!.querySelectorAll(".group-title"), ({ textContent }) => textContent))
      .toEqual([
        "Agreement and parties",
        "Agreement terms",
        "Drafting decisions",
        "Execution",
      ]);

    const debtCondition = Array.from(
      editor.shadowRoot!.querySelectorAll<HTMLSelectElement>(".controls select"),
    ).find((select) => select.previousElementSibling?.textContent === "Debt condition")!;
    const conditionsText = (): string => document.querySelector("#clause-conditions p")?.textContent ?? "";
    debtCondition.value = "https://ia2.dev/spec/rdf-html/examples/sources/assignment.html#amounts-paid-option";
    debtCondition.dispatchEvent(new Event("change", { bubbles: true }));
    await editor.validate();
    expect(conditionsText()).toContain("having been paid in full. This consent");
    expect(conditionsText()).not.toMatch(/\s+[.,;:!?]/u);
    const completedConditions = new DOMParser()
      .parseFromString(editor.exportCompletedDocument(), "text/html")
      .querySelector("#clause-conditions p")?.textContent;
    expect(completedConditions).toContain("having been paid in full. This consent");

    debtCondition.value = "https://ia2.dev/spec/rdf-html/examples/sources/assignment.html#amounts-assumed-option";
    debtCondition.dispatchEvent(new Event("change", { bubbles: true }));
    await editor.validate();
    expect(conditionsText())
      .toContain("having been paid in full or assumed by Assignee under Section 2. This consent");
    expect(conditionsText()).not.toMatch(/\s+[.,;:!?]/u);

    debtCondition.value = "https://ia2.dev/spec/rdf-html/examples/sources/assignment.html#amounts-paid-option";
    debtCondition.dispatchEvent(new Event("change", { bubbles: true }));
    await editor.validate();
    expect(conditionsText()).toContain("having been paid in full. This consent");

    const indemnification = Array.from(
      editor.shadowRoot!.querySelectorAll<HTMLSelectElement>(".controls select"),
    ).find((select) => select.previousElementSibling?.textContent === "Indemnification clause")!;
    const operativeRelation = (): boolean => extractDataset(document).quads.some((quad) => (
      quad.subject.value.endsWith("#assignment-agreement")
      && quad.predicate.value === "https://spec.edmcouncil.org/fibo/ontology/FND/Agreements/Contracts/hasContractualElement"
      && quad.object.termType === "NamedNode"
      && quad.object.value.endsWith("#clause-indemnification")
      && quad.graph?.value.endsWith("#runtime-graph")
    ));
    expect(operativeRelation()).toBe(false);
    indemnification.value = "https://ia2.dev/spec/rdf-html/examples/sources/assignment.html#include-indemnification-option";
    indemnification.dispatchEvent(new Event("change", { bubbles: true }));
    await editor.validate();
    expect(operativeRelation()).toBe(true);
    indemnification.value = "https://ia2.dev/spec/rdf-html/examples/sources/assignment.html#omit-indemnification-option";
    indemnification.dispatchEvent(new Event("change", { bubbles: true }));
    await editor.validate();
    expect(operativeRelation()).toBe(false);
  });
});
