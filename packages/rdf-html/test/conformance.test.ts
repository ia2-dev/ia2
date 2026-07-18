import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { parseRdfHtml, renderRdfHtmlDocument } from "../src/index.js";

interface Fixture {
  id: string;
  input: string;
  contentType: string;
  documents: number;
  renderable: boolean;
  htmlContains?: string;
  errorContains?: string;
}

const root = resolve(process.cwd(), "../../specs/rdf-html/tests");
const manifest = JSON.parse(readFileSync(resolve(root, "manifest.json"), "utf8")) as { tests: Fixture[] };

describe("implementation-neutral RDF/HTML conformance fixtures", () => {
  for (const fixture of manifest.tests) {
    it(fixture.id, () => {
      const source = readFileSync(resolve(root, fixture.input), "utf8");
      const parsed = parseRdfHtml(source, {
        baseIRI: `https://ia2.dev/spec/rdf-html/tests/${fixture.input}`,
        contentType: fixture.contentType,
      });
      expect(parsed.documents).toHaveLength(fixture.documents);
      const render = () => renderRdfHtmlDocument(parsed.dataset, parsed.documents[0]!);
      if (fixture.renderable) {
        expect(render().html).toContain(fixture.htmlContains);
      } else {
        expect(render).toThrow(fixture.errorContains ? new RegExp(fixture.errorContains) : undefined);
      }
    });
  }
});
