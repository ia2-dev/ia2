import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { assertPublicSourceUrl, fetchRdfSource, handleRequest } from "../worker.js";

const turtle = `@prefix rdfhtml: <https://ia2.dev/spec/rdf-html#> .
@prefix dcterms: <http://purl.org/dc/terms/> .
@prefix ord: <https://ontology.inferal.com/modules/ordering/> .
@prefix ex: <https://example.org/> .
ex:page a rdfhtml:Document ; rdfhtml:base <https://example.org/rendered/> ; dcterms:conformsTo <https://ia2.dev/spec/rdf-html/vocabulary/rdf-html-2026-07-18.ttl> ; dcterms:title "Worker document" ; rdfhtml:hasChild [ a rdfhtml:Html ; rdfhtml:hasChild [ a rdfhtml:Head ; ord:precedes [ a rdfhtml:Body ] ] ] .`;

const multipleTurtle = `${turtle}\n${turtle
  .replaceAll("ex:page", "ex:second-page")
  .replace('dcterms:title "Worker document"', 'dcterms:title "Second document"')}`;

test("rejects non-public source URLs", () => {
  for (const value of ["file:///tmp/a.ttl", "http://localhost/a.ttl", "http://127.0.0.1/a.ttl", "http://10.0.0.2/a.ttl", "http://192.0.2.1/a.ttl", "http://198.51.100.2/a.ttl", "http://203.0.113.4/a.ttl", "http://[::1]/a.ttl", "http://[::ffff:127.0.0.1]/a.ttl", "https://user:pass@example.org/a.ttl"]) {
    assert.throws(() => assertPublicSourceUrl(value));
  }
  assert.equal(assertPublicSourceUrl("https://example.org/document.ttl").href, "https://example.org/document.ttl");
});

test("allows loopback URLs only when development mode opts in", () => {
  for (const value of ["http://localhost:8787/source.ttl", "http://app.localhost:4321/source.ttl", "http://127.42.0.1:9000/source.ttl", "http://[::1]:8787/source.ttl"]) {
    assert.equal(assertPublicSourceUrl(value, { allowLocalhost: true }).href, value);
  }
  assert.throws(() => assertPublicSourceUrl("http://192.168.1.2:8787/source.ttl", { allowLocalhost: true }), /blocked/);
});

test("checks redirect destinations before following them", async () => {
  await assert.rejects(() => fetchRdfSource("https://example.org/source.ttl", async () => new Response(null, {
    status: 302,
    headers: { location: "http://127.0.0.1/private.ttl" },
  })), /blocked|public hostname/);
});

test("renders a single document with broad precedence in a frameless sandbox", async () => {
  const response = await handleRequest(
    new Request("https://ia2.dev/render/https://example.org/document.ttl"),
    { ASSETS: { fetch() { throw new Error("assets should not be used"); } } },
    async () => new Response(turtle, { headers: { "content-type": "text/turtle" } }),
  );
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Worker document/);
  assert.match(html, /<iframe[^>]+sandbox/);
  assert.match(html, /\/render\/document\/0\/https:\/\/example.org\/document.ttl/);
  assert.doesNotMatch(html, /[?&]url=/);
  assert.doesNotMatch(html, /Inert preview|class="bar"/);
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
});

test("reads same-origin RDF sources from the static-assets binding", async () => {
  let assetUrl = "";
  const response = await handleRequest(
    new Request("https://ia2.dev/render/https://ia2.dev/spec/rdf-html/examples/welcome.ttl"),
    {
      ASSETS: {
        fetch(request) {
          assetUrl = request.url;
          return new Response(turtle, { headers: { "content-type": "text/turtle" } });
        },
      },
    },
    async () => { throw new Error("same-origin sources must not use the external fetcher"); },
  );
  assert.equal(response.status, 200);
  assert.equal(assetUrl, "https://ia2.dev/spec/rdf-html/examples/welcome.ttl");
  assert.match(await response.text(), /Worker document/);
});

test("serves the selected document directly inside the sandbox", async () => {
  const response = await handleRequest(
    new Request("https://ia2.dev/render/document/0/https://example.org/document.ttl"),
    { ASSETS: { fetch() { throw new Error("assets should not be used"); } } },
    async () => new Response(turtle, { headers: { "content-type": "text/turtle" } }),
  );
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /<html rdf-version="1.2">/);
  assert.match(html, /<base data-rdfhtml-runtime-context href="https:\/\/example.org\/rendered\/">/);
  assert.doesNotMatch(html, /<iframe|Inert preview|class="shell"/);
  assert.match(response.headers.get("content-security-policy"), /^sandbox;/);
  assert.match(response.headers.get("content-security-policy"), /frame-ancestors 'self'/);
});

test("offers a selector before rendering one of several documents", async () => {
  const response = await handleRequest(
    new Request("https://ia2.dev/render/https://example.org/multiple.ttl"),
    { ASSETS: { fetch() { throw new Error("assets should not be used"); } } },
    async () => new Response(multipleTurtle, { headers: { "content-type": "text/turtle" } }),
  );
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /<select id="document" name="document">/);
  assert.match(html, />Worker document<\/option>/);
  assert.match(html, />Second document<\/option>/);
  assert.match(html, /value="\/render\/document\/1\/https:\/\/example.org\/multiple.ttl"/);
  assert.match(html, /frame\.src = option\.value/);
  assert.equal(html.match(/<iframe/g)?.length, 1);
});

test("serves the renderer form and delegates other routes to static assets", async () => {
  const assets = { fetch(request) { return new Response(`asset:${new URL(request.url).pathname}`); } };
  const form = await handleRequest(new Request("https://ia2.dev/render", { headers: { accept: "text/html,application/xhtml+xml" } }), { ASSETS: assets });
  assert.equal(form.status, 200);
  assert.equal(form.headers.get("content-type"), "text/html; charset=utf-8");
  const formHtml = await form.text();
  assert.match(formHtml, /Public Turtle or TriG URL/);
  assert.match(formHtml, /Included examples/);
  assert.match(formHtml, /Accessibility review/);
  assert.match(formHtml, /Multi-audience incident/);
  assert.match(formHtml, /Independent contributions/);
  assert.match(formHtml, /Apollo 11 mission/);
  assert.equal(formHtml.match(/<li><a data-render-example href="\/spec\/rdf-html\/examples\//g)?.length, 9);
  assert.match(formHtml, /href="\/spec\/rdf-html\/examples\/independent-contributions\.trig"/);
  assert.match(formHtml, /href="\/spec\/rdf-html\/examples\/multi-audience\.trig"/);
  assert.match(formHtml, /new URL\("\/render\/" \+ source\.href/);
  assert.doesNotMatch(formHtml, /name="url"|searchParams\.set\("url"/);
  const nonce = formHtml.match(/<script nonce="([a-f0-9]+)">/)?.[1];
  assert.ok(nonce);
  assert.match(form.headers.get("content-security-policy"), new RegExp(`script-src 'nonce-${nonce}'`));
  const asset = await handleRequest(new Request("https://ia2.dev/guide/html-rdf"), { ASSETS: assets });
  assert.equal(await asset.text(), "asset:/guide/html-rdf");
});

test("serves top-level TriG navigation inline without changing RDF fetch responses", async () => {
  const assets = { fetch() { return new Response(multipleTurtle, { headers: { "content-type": "application/trig" } }); } };
  const navigation = await handleRequest(new Request("https://ia2.dev/spec/rdf-html/examples/multiple.trig", {
    headers: { "sec-fetch-dest": "document" },
  }), { ASSETS: assets });
  assert.equal(navigation.headers.get("content-type"), "text/plain; charset=utf-8");
  assert.equal(navigation.headers.get("content-disposition"), "inline");

  const rdfFetch = await handleRequest(new Request("https://ia2.dev/spec/rdf-html/examples/multiple.trig", {
    headers: { accept: "application/trig" },
  }), { ASSETS: assets });
  assert.equal(rdfFetch.headers.get("content-type"), "application/trig");
});

test("routes published RDF/HTML TriG examples through the Worker", async () => {
  const config = await readFile(new URL("../wrangler.jsonc", import.meta.url), "utf8");
  assert.match(config, /"run_worker_first"\s*:\s*\[[^\]]*"\/spec\/rdf-html\/examples\/\*\.trig"/s);
});

test("requires a URL for non-browser requests", async () => {
  const response = await handleRequest(
    new Request("https://ia2.dev/render", { headers: { accept: "application/json" } }),
    { ASSETS: { fetch() { throw new Error("assets should not be used"); } } },
  );
  assert.equal(response.status, 400);
  assert.equal(response.headers.get("content-type"), "application/problem+json; charset=utf-8");
  assert.deepEqual(await response.json(), {
    type: "https://ia2.dev/problems/missing-rdf-html-url",
    title: "RDF/HTML source URL required",
    status: 400,
    detail: "Append a public Turtle or TriG URL to /render/.",
  });
});

test("uses the current loopback origin for the development form", async () => {
  const response = await handleRequest(
    new Request("http://localhost:8787/render", { headers: { accept: "text/html" } }),
    { RDF_HTML_ALLOW_LOCALHOST: "true", ASSETS: { fetch() { throw new Error("assets should not be used"); } } },
  );
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /placeholder="https:\/\/example\.com\/document\.ttl" required value=""/);
  assert.match(html, /href="\/spec\/rdf-html\/examples\/accessibility-check\.ttl"/);
  assert.match(html, /Enter a Turtle or TriG URL to render the HTML it describes/);
  assert.doesNotMatch(html, /Development mode allows loopback URLs on any port/);
  assert.doesNotMatch(html, /<small>/);
});

test("preserves a source URL query string without a nested url parameter", async () => {
  let fetchedUrl = "";
  const response = await handleRequest(
    new Request("https://ia2.dev/render/https://example.org/document.ttl?edition=plain&lang=en"),
    { ASSETS: { fetch() { throw new Error("assets should not be used"); } } },
    async (url) => {
      fetchedUrl = url;
      return new Response(turtle, { headers: { "content-type": "text/turtle" } });
    },
  );
  assert.equal(response.status, 200);
  assert.equal(fetchedUrl, "https://example.org/document.ttl?edition=plain&lang=en");
  const html = await response.text();
  assert.match(html, /\/render\/document\/0\/https:\/\/example.org\/document.ttl\?edition=plain&amp;lang=en/);
});

test("does not accept the unpublished url query form", async () => {
  const response = await handleRequest(
    new Request("https://ia2.dev/render?url=https%3A%2F%2Fexample.org%2Fdocument.ttl", { headers: { accept: "application/json" } }),
    { ASSETS: { fetch() { throw new Error("assets should not be used"); } } },
  );
  assert.equal(response.status, 400);
  assert.match((await response.json()).detail, /Append a public Turtle or TriG URL/);
});

test("rejects oversized sources", async () => {
  const response = await handleRequest(
    new Request("https://ia2.dev/render/https://example.org/large.ttl"),
    { ASSETS: { fetch() { throw new Error("assets should not be used"); } } },
    async () => new Response("small", { headers: { "content-type": "text/turtle", "content-length": String(2 * 1024 * 1024 + 1) } }),
  );
  assert.equal(response.status, 413);
});
