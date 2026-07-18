import { execFile } from "node:child_process";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { promisify } from "node:util";
import { describe, expect, it, vi } from "vitest";
import { htmlToRdfHtml } from "../src/node.js";
import { parseRdfHtml } from "../src/parse.js";
import { renderRdfHtmlDocument } from "../src/render.js";
// @ts-expect-error The published CLI is JavaScript and intentionally has no declaration surface.
import { readInput } from "../bin/rdf-html.mjs";

const execute = promisify(execFile);
const packageRoot = process.cwd();
const cli = resolve(packageRoot, "bin/rdf-html.mjs");
const welcome = resolve(packageRoot, "../../specs/rdf-html/examples/welcome.ttl");
const multiple = resolve(packageRoot, "../../specs/rdf-html/examples/multi-audience.trig");
const sourceHtml = resolve(packageRoot, "../../specs/rdf-html/examples/sources/field-observations.html");

async function run(args: string[]): Promise<{ stderr: string; stdout: string }> {
  return execute(process.execPath, [cli, ...args], {
    cwd: packageRoot,
    maxBuffer: 4 * 1024 * 1024,
  });
}

describe("rdf-html CLI and Node API", () => {
  it("renders RDF/HTML files and requires a selection for multiple documents", async () => {
    const rendered = await run(["render", welcome]);
    expect(rendered.stderr).toBe("");
    expect(rendered.stdout).toContain("<h1>Welcome</h1>");
    expect(rendered.stdout).not.toContain("data-rdfhtml-preserved");

    const publication = await run(["render", welcome, "--publication"]);
    expect(publication.stdout).toContain("data-rdfhtml-preserved");
    expect(publication.stdout).toContain('rdf-version="1.2"');

    await expect(run(["render", multiple])).rejects.toMatchObject({
      stderr: expect.stringContaining("Select one with --document"),
    });
    const selected = await run(["render", multiple, "--document", "Public service update"]);
    expect(selected.stdout).toContain("<h1>Service update</h1>");
  });

  it("describes HTML files and exposes the Node string API", async () => {
    const described = await run([
      "describe",
      sourceHtml,
      "--base",
      "https://example.test/observations/",
      "--document-iri",
      "https://example.test/observations#document",
    ]);
    const parsed = parseRdfHtml(described.stdout, { baseIRI: "https://example.test/observations.ttl" });
    expect(parsed.documents).toHaveLength(1);
    expect(parsed.documents[0]?.label).toBe("Estuary field observations");

    const turtle = htmlToRdfHtml("<!doctype html><html><head><title>String API</title></head><body><p>Works</p></body></html>", {
      baseIRI: "https://example.test/string/",
      documentIRI: "https://example.test/string#document",
    });
    expect(turtle).toContain("\"String API\"");
    expect(turtle).toContain("rdfhtml:P");
  });

  it("loads RDF/HTML and HTML URL inputs", async () => {
    const welcomeSource = await readFile(welcome, "utf8");
    const fetchMock = vi.fn(async (input: string | URL | Request) => {
      const url = String(input);
      if (url.endsWith("/welcome.ttl")) {
        return new Response(welcomeSource, { headers: { "content-type": "text/turtle; charset=utf-8" } });
      }
      return new Response("<!doctype html><html><head><title>Remote note</title></head><body><h1>Remote note</h1></body></html>", {
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    });
    vi.stubGlobal("fetch", fetchMock);
    try {
      const rdfInput = await readInput("https://example.test/welcome.ttl", "render");
      const parsed = parseRdfHtml(rdfInput.text, { baseIRI: rdfInput.url, contentType: rdfInput.contentType });
      expect(renderRdfHtmlDocument(parsed.dataset, parsed.documents[0]!).html).toContain("<h1>Welcome</h1>");

      const htmlInput = await readInput("https://example.test/page.html", "describe");
      const described = htmlToRdfHtml(htmlInput.text, {
        baseIRI: htmlInput.url,
        documentIRI: htmlInput.url + "#document",
        sourceIRI: htmlInput.url,
      });
      expect(described).toContain("\"Remote note\"");
      expect(described).toContain("dcterms:source <https://example.test/page.html>");
      expect(fetchMock).toHaveBeenCalledTimes(2);
    } finally {
      vi.unstubAllGlobals();
    }
  });
});
