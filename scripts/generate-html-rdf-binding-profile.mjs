import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { Parser, Store } from "n3";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sourcePath = resolve(root, "specs/html-rdf/binding-profile/core-0.1.ttl");
const check = process.argv.includes("--check");
const HTMLRDF = "https://ia2.dev/spec/html-rdf#";
const RDFHTML = "https://ia2.dev/spec/rdf-html#";
const RDF_TYPE = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type";
const PROFILE = "https://ia2.dev/spec/html-rdf/binding-profile/core-0.1";

const source = await readFile(sourcePath, "utf8");
const store = new Store(new Parser({ baseIRI: PROFILE }).parse(source));

function one(subject, predicate) {
  const values = store.getObjects(subject, predicate, null);
  if (values.length !== 1) {
    throw new Error(`${subject.value} must have exactly one ${predicate.value}`);
  }
  return values[0];
}

const nn = (value) => ({ termType: "NamedNode", value });
const profile = nn(PROFILE);
const carrierRule = nn(`${HTMLRDF}carrierRule`);
const elementClass = nn(`${HTMLRDF}elementClass`);
const valueAttribute = nn(`${HTMLRDF}valueAttribute`);
const transformation = nn(`${HTMLRDF}transformation`);
const fallbackTransformation = nn(`${HTMLRDF}fallbackTransformation`);
const tagName = nn(`${RDFHTML}tagName`);
const attributeLocalName = nn(`${RDFHTML}attributeLocalName`);
const rdfType = nn(RDF_TYPE);
const iriCarrier = `${HTMLRDF}IriCarrierRule`;
const literalCarrier = `${HTMLRDF}LiteralCarrierRule`;

const rules = store.getObjects(profile, carrierRule, null).map((rule) => {
  const types = new Set(store.getObjects(rule, rdfType, null).map(({ value }) => value));
  const kind = types.has(iriCarrier) ? "iri" : types.has(literalCarrier) ? "literal" : null;
  if (!kind) throw new Error(`${rule.value} has no supported carrier-rule type`);
  const elementTerm = one(rule, elementClass);
  const attributeTerm = one(rule, valueAttribute);
  const operation = one(rule, transformation).value.slice(HTMLRDF.length);
  return {
    id: rule.value.slice(HTMLRDF.length),
    element: one(elementTerm, tagName).value,
    attribute: one(attributeTerm, attributeLocalName).value,
    kind,
    operation,
  };
}).sort((left, right) =>
  left.element.localeCompare(right.element) || left.attribute.localeCompare(right.attribute)
);

if (rules.length !== 24) throw new Error(`Expected 24 carrier rules, found ${rules.length}`);
const keys = new Set(rules.map(({ element, attribute }) => `${element}\0${attribute}`));
if (keys.size !== rules.length) throw new Error("Carrier rules contain duplicate element/attribute pairs");
if (rules.some(({ element, attribute }) => !/^[a-z][a-z0-9]*$/.test(element) || !/^[a-z][a-z0-9-]*$/.test(attribute))) {
  throw new Error("Carrier rules contain invalid DOM local names");
}
const fallback = one(profile, fallbackTransformation).value.slice(HTMLRDF.length);
if (fallback !== "NormalizedDescendantText") throw new Error(`Unsupported fallback: ${fallback}`);

const compiled = { schemaVersion: 1, profile: PROFILE, fallback, rules };
const header = "Generated from specs/html-rdf/binding-profile/core-0.1.ttl. Do not edit.";
const tupleRows = rules.map(({ element, attribute, kind, operation }) =>
  [element, attribute, kind, operation]
);

const outputs = new Map([
  ["examples/html-rdf-libraries/generated/carrier-profile.json", `${JSON.stringify(compiled, null, 2)}\n`],
  ["examples/html-rdf-libraries/javascript-typescript/carrier-profile.mjs",
    `// ${header}\nexport const CARRIER_RULES = Object.freeze(${JSON.stringify(rules, null, 2)});\n`],
  ["examples/html-rdf-libraries/python/carrier_profile.py",
    `# ${header}\nCARRIER_RULES = ${JSON.stringify(tupleRows, null, 2).replaceAll("null", "None")}\n`],
  ["examples/html-rdf-libraries/java/src/main/java/dev/ia2/example/CarrierProfile.java",
    `// ${header}\npackage dev.ia2.example;\n\nimport java.util.List;\n\nrecord CarrierRule(String element, String attribute, String kind, String operation) {}\n\nfinal class CarrierProfile {\n  static final List<CarrierRule> RULES = List.of(\n${tupleRows.map((row) => `      new CarrierRule(${row.map(JSON.stringify).join(", ")})`).join(",\n")}\n  );\n\n  private CarrierProfile() {}\n}\n`],
  ["examples/html-rdf-libraries/kotlin/src/main/kotlin/CarrierProfile.kt",
    `// ${header}\ndata class CarrierRule(val element: String, val attribute: String, val kind: String, val operation: String)\n\nval carrierRules = listOf(\n${tupleRows.map((row) => `    CarrierRule(${row.map(JSON.stringify).join(", ")})`).join(",\n")}\n)\n`],
  ["examples/html-rdf-libraries/scala/CarrierProfile.scala",
    `// ${header}\ncase class CarrierRule(element: String, attribute: String, kind: String, operation: String)\n\nval carrierRules = Vector(\n${tupleRows.map((row) => `  CarrierRule(${row.map(JSON.stringify).join(", ")})`).join(",\n")}\n)\n`],
  ["examples/html-rdf-libraries/csharp/CarrierProfile.cs",
    `// ${header}\ninternal readonly record struct CarrierRule(string Element, string Attribute, string Kind, string Operation);\n\ninternal static class CarrierProfile\n{\n    internal static readonly CarrierRule[] Rules =\n    [\n${tupleRows.map((row) => `        new(${row.map(JSON.stringify).join(", ")})`).join(",\n")}\n    ];\n}\n`],
  ["examples/html-rdf-libraries/go/carrier_profile.go",
    `// ${header}\npackage main\n\ntype carrierRule struct {\n\telement string\n\tattribute string\n\tkind string\n\toperation string\n}\n\nvar carrierRules = []carrierRule{\n${tupleRows.map((row) => `\t{${row.map(JSON.stringify).join(", ")}}`).join(",\n")},\n}\n`],
  ["examples/html-rdf-libraries/rust/src/carrier_profile.rs",
    `// ${header}\npub struct CarrierRule {\n    pub element: &'static str,\n    pub attribute: &'static str,\n    pub kind: &'static str,\n    pub operation: &'static str,\n}\n\npub const CARRIER_RULES: &[CarrierRule] = &[\n${tupleRows.map((row) => `    CarrierRule { element: ${JSON.stringify(row[0])}, attribute: ${JSON.stringify(row[1])}, kind: ${JSON.stringify(row[2])}, operation: ${JSON.stringify(row[3])} }`).join(",\n")},\n];\n`],
  ["examples/html-rdf-libraries/php/carrier-profile.php",
    `<?php\n// ${header}\nreturn ${phpArray(tupleRows)};\n`],
  ["examples/html-rdf-libraries/ruby/carrier_profile.rb",
    `# ${header}\nCARRIER_RULES = ${rubyArray(tupleRows)}.freeze\n`],
  ["examples/html-rdf-libraries/swift/Sources/HtmlRdfExample/CarrierProfile.swift",
    `// ${header}\nstruct CarrierRule {\n    let element: String\n    let attribute: String\n    let kind: String\n    let operation: String\n}\n\nenum CarrierProfile {\n    static let rules = [\n${tupleRows.map((row) => `        CarrierRule(element: ${JSON.stringify(row[0])}, attribute: ${JSON.stringify(row[1])}, kind: ${JSON.stringify(row[2])}, operation: ${JSON.stringify(row[3])})`).join(",\n")}\n    ]\n}\n`],
  ["examples/html-rdf-libraries/dart/lib/carrier_profile.dart",
    `// ${header}\ntypedef CarrierRule = ({String element, String attribute, String kind, String operation});\n\nconst carrierRules = <CarrierRule>[\n${tupleRows.map((row) => `  (element: ${singleQuote(row[0])}, attribute: ${singleQuote(row[1])}, kind: ${singleQuote(row[2])}, operation: ${singleQuote(row[3])})`).join(",\n")}\n];\n`],
  ["examples/html-rdf-libraries/c/carrier_profile.h", cHeader(header, tupleRows)],
  ["examples/html-rdf-libraries/cpp/carrier_profile.hpp", cppHeader(header, tupleRows)],
  ["examples/html-rdf-libraries/elixir/lib/carrier_profile.ex",
    `# ${header}\ndefmodule CarrierProfile do\n  @rules [\n${tupleRows.map((row) => `    {${row.map(elixirString).join(", ")}}`).join(",\n")}\n  ]\n\n  def rules, do: @rules\nend\n`],
]);

function singleQuote(value) {
  return `'${value.replaceAll("'", "\\'")}'`;
}

function elixirString(value) {
  return JSON.stringify(value);
}

function phpArray(rows) {
  return `[\n${rows.map((row) => `    [${row.map(singleQuote).join(", ")}]`).join(",\n")}\n]`;
}

function rubyArray(rows) {
  return `[\n${rows.map((row) => `  [${row.map(JSON.stringify).join(", ")}].freeze`).join(",\n")}\n]`;
}

function cHeader(comment, rows) {
  return `/* ${comment} */\n#ifndef IA2_CARRIER_PROFILE_H\n#define IA2_CARRIER_PROFILE_H\n\ntypedef struct {\n    const char *element;\n    const char *attribute;\n    const char *kind;\n    const char *operation;\n} carrier_rule_t;\n\nstatic const carrier_rule_t CARRIER_RULES[] = {\n${rows.map((row) => `    {${row.map(JSON.stringify).join(", ")}}`).join(",\n")}\n};\n\n#define CARRIER_RULE_COUNT (sizeof(CARRIER_RULES) / sizeof(CARRIER_RULES[0]))\n\n#endif\n`;
}

function cppHeader(comment, rows) {
  return `// ${comment}\n#pragma once\n\n#include <array>\n#include <string_view>\n\nstruct CarrierRule {\n    std::string_view element;\n    std::string_view attribute;\n    std::string_view kind;\n    std::string_view operation;\n};\n\ninline constexpr std::array CARRIER_RULES{\n${rows.map((row) => `    CarrierRule{${row.map(JSON.stringify).join(", ")}}`).join(",\n")}\n};\n`;
}

for (const [relativePath, content] of outputs) {
  const path = resolve(root, relativePath);
  if (check) {
    const current = await readFile(path, "utf8").catch(() => null);
    if (current !== content) throw new Error(`${relativePath} is not generated from ${sourcePath}`);
  } else {
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, content);
  }
}

console.log(`${check ? "Verified" : "Generated"} ${outputs.size} binding-profile artifacts from ${rules.length} RDF rules`);
