import { JSDOM } from "jsdom";
import { CARRIER_RULES } from "./carrier-profile.mjs";

const XSD_STRING = "http://www.w3.org/2001/XMLSchema#string";
const RDF_DIR_LANG_STRING = "http://www.w3.org/1999/02/22-rdf-syntax-ns#dirLangString";

// Fetch and parse the document with its retrieval URL as the DOM base URL.
const response = await fetch(process.argv[2]);
if (!response.ok) {
  throw new Error(`HTTP ${response.status}`);
}
const html = await response.text();
const document = new JSDOM(html, { url: response.url }).window.document;

// HTML/RDF resolves semantic references against the one canonical source IRI.
const canonical = [...document.head.querySelectorAll("link[rel][href]")]
  .filter((link) => link.relList.contains("canonical"));
if (canonical.length !== 1) {
  throw new Error("Expected one canonical link");
}
const sourceIri = new URL(canonical[0].getAttribute("href"), response.url).href;

// A normal attribute selector finds every locally complete statement carrier.
const rows = [...document.querySelectorAll("[rdf-predicate]")]
  .filter((element) => !element.parentElement?.closest("template"))
  .map((element) => {
    const subject = new URL(element.getAttribute("rdf-subject"), sourceIri).href;
    const predicate = new URL(element.getAttribute("rdf-predicate"), sourceIri).href;

    // The generated profile identifies any native attribute that carries the value.
    const carriers = CARRIER_RULES.filter((rule) =>
      rule.element === element.localName && element.hasAttribute(rule.attribute));
    if (carriers.length > 1) {
      throw new Error(`Conflicting value carriers on <${element.localName}>`);
    }
    const carrier = carriers[0];

    // IRI carrier values are references; resolve them against the semantic source.
    if (carrier?.kind === "iri") {
      const object = new URL(element.getAttribute(carrier.attribute), sourceIri).href;
      return [subject, predicate, "I", object, "", "", ""];
    }

    // Literal carriers are exact strings. Other elements use normalized visible text.
    const value = carrier?.kind === "literal"
      ? element.getAttribute(carrier.attribute)
      : element.textContent.replace(/[\t\n\f\r ]+/g, " ").trim();

    // lang and dir apply only when they are directly present on this carrier.
    const language = element.getAttribute("lang") ?? "";
    const rawDirection = element.getAttribute("dir")?.toLowerCase();
    const direction = ["ltr", "rtl"].includes(rawDirection)
      ? rawDirection
      : "";

    // An explicit datatype wins; direction otherwise selects rdf:dirLangString.
    let datatype = direction ? RDF_DIR_LANG_STRING : XSD_STRING;
    if (element.hasAttribute("rdf-datatype")) {
      datatype = new URL(element.getAttribute("rdf-datatype"), sourceIri).href;
    }
    return [subject, predicate, "L", value, datatype, language, direction];
  })
  .sort((left, right) => left[1].localeCompare(right[1]));

process.stdout.write(`${rows.map((row) => row.join("\t")).join("\n")}\n`);
