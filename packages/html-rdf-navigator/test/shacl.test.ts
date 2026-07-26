import { beforeEach, describe, expect, it } from "vitest";
import { extractDataset } from "../src/extract.js";
import { extractShaclCatalog } from "../src/shacl.js";

beforeEach(() => {
  document.documentElement.setAttribute("rdf-version", "1.2");
  document.body.innerHTML = "";
});

describe("extractShaclCatalog", () => {
  it("catalogs explicit and implicit shapes, property groups, and constraints", () => {
    document.body.innerHTML = `
      <a href="http://www.w3.org/ns/shacl#PropertyGroup" rdf-subject="#identity-group" rdf-predicate="http://www.w3.org/1999/02/22-rdf-syntax-ns#type"></a>
      <span rdf-subject="#identity-group" rdf-predicate="http://www.w3.org/ns/shacl#name">Identity</span>
      <data value="10" rdf-subject="#identity-group" rdf-predicate="http://www.w3.org/ns/shacl#order" rdf-datatype="http://www.w3.org/2001/XMLSchema#decimal"></data>

      <a href="http://www.w3.org/ns/shacl#NodeShape" rdf-subject="#person-shape" rdf-predicate="http://www.w3.org/1999/02/22-rdf-syntax-ns#type"></a>
      <span rdf-subject="#person-shape" rdf-predicate="http://www.w3.org/ns/shacl#name">Person record</span>
      <a href="https://schema.org/Person" rdf-subject="#person-shape" rdf-predicate="http://www.w3.org/ns/shacl#targetClass"></a>
      <a href="#name-shape" rdf-subject="#person-shape" rdf-predicate="http://www.w3.org/ns/shacl#property"></a>

      <a href="https://schema.org/name" rdf-subject="#name-shape" rdf-predicate="http://www.w3.org/ns/shacl#path"></a>
      <a href="#identity-group" rdf-subject="#name-shape" rdf-predicate="http://www.w3.org/ns/shacl#group"></a>
      <data value="1" rdf-subject="#name-shape" rdf-predicate="http://www.w3.org/ns/shacl#minCount" rdf-datatype="http://www.w3.org/2001/XMLSchema#integer"></data>

      <a href="https://example.com/alice" rdf-subject="#implicit-node-shape" rdf-predicate="http://www.w3.org/ns/shacl#targetNode"></a>
      <span rdf-subject="#implicit-node-shape" rdf-predicate="http://www.w3.org/ns/shacl#description">An implicit node shape.</span>

      <a href="#nested-node-shape" rdf-subject="#wrapper-property-shape" rdf-predicate="http://www.w3.org/ns/shacl#node"></a>
      <a href="#nested-name-shape" rdf-subject="#nested-node-shape" rdf-predicate="http://www.w3.org/ns/shacl#property"></a>
      <a href="https://schema.org/name" rdf-subject="#nested-name-shape" rdf-predicate="http://www.w3.org/ns/shacl#path"></a>
    `;

    const catalog = extractShaclCatalog(extractDataset(document));

    expect(catalog.count).toBe(6);
    expect(catalog.groups).toHaveLength(1);
    expect(catalog.groups[0]?.label).toBe("Identity");
    expect(catalog.groups[0]?.order).toBe(10);

    const person = catalog.shapes.find((shape) => shape.label === "Person record");
    expect(person?.kinds).toEqual(["node"]);
    expect(person?.targets.map((quad) => quad.predicate.value)).toEqual([
      "http://www.w3.org/ns/shacl#targetClass",
    ]);
    expect(person?.properties).toHaveLength(1);

    const name = catalog.shapes.find((shape) => shape.term.value.endsWith("#name-shape"));
    expect(name?.kinds).toEqual(["property"]);
    expect(name?.paths[0]?.object).toMatchObject({
      termType: "NamedNode",
      value: "https://schema.org/name",
    });
    expect(name?.constraints.map((quad) => quad.predicate.value)).toEqual([
      "http://www.w3.org/ns/shacl#minCount",
    ]);
    expect(name?.group?.value).toBe(catalog.groups[0]?.term.value);

    const implicit = catalog.shapes.find((shape) => shape.term.value.endsWith("#implicit-node-shape"));
    expect(implicit?.kinds).toEqual(["node"]);
    expect(implicit?.description).toBe("An implicit node shape.");

    expect(catalog.shapes.find((shape) => shape.term.value.endsWith("#nested-node-shape"))?.kinds)
      .toEqual(["node"]);
    expect(catalog.shapes.find((shape) => shape.term.value.endsWith("#nested-name-shape"))?.kinds)
      .toEqual(["property"]);
    expect(catalog.shapes.find((shape) => shape.term.value.endsWith("#wrapper-property-shape"))?.kinds)
      .toEqual(["node"]);
  });
});
