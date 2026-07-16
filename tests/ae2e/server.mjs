import { createReadStream } from "node:fs";
import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, resolve } from "node:path";

const root = resolve(import.meta.dirname, "../..");
const port = Number(process.env.IA2_AE2E_PORT ?? 4187);
const results = [];
const files = new Map([
  ["/contract", resolve(root, "tests/ae2e/pages/contract.html")],
  ["/fixture.css", resolve(root, "tests/ae2e/pages/fixture.css")],
  ["/contract-runner.mjs", resolve(root, "tests/ae2e/shared/contract-runner.mjs")],
  ["/navigator-contract.mjs", resolve(root, "tests/ae2e/shared/navigator-contract.mjs")],
  ["/navigator.js", resolve(root, "packages/html-rdf-navigator/dist/html-rdf-navigator.js")],
]);
const contentTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".mjs", "text/javascript; charset=utf-8"],
]);

function evidenceHtml() {
  return `<!doctype html><html rdf-version="1.2"><head><link rel="canonical" href="http://127.0.0.1:${port}/evidence"></head><body>
    <span id="evidence-name" rdf-subject="" rdf-predicate="https://schema.org/name">Evidence set</span>
    <time rdf-subject="" rdf-predicate="https://schema.org/dateCreated" datetime="2026-07-16">2026-07-16</time>
  </body></html>`;
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url ?? "/", `http://127.0.0.1:${port}`);
  if (url.pathname === "/health") {
    response.writeHead(200, { "content-type": "text/plain" });
    response.end("ok");
    return;
  }
  if (url.pathname === "/evidence") {
    response.writeHead(200, {
      "access-control-allow-origin": "*",
      "content-type": "text/html; charset=utf-8",
    });
    response.end(evidenceHtml());
    return;
  }
  if (url.pathname === "/results" && request.method === "POST") {
    let body = "";
    for await (const chunk of request) body += chunk;
    results.push(JSON.parse(body));
    response.writeHead(204);
    response.end();
    return;
  }
  if (url.pathname === "/results") {
    response.writeHead(200, { "content-type": "application/json" });
    response.end(JSON.stringify(results.at(-1) ?? null));
    return;
  }
  const file = files.get(url.pathname);
  if (file) {
    try {
      await readFile(file);
      response.writeHead(200, { "content-type": contentTypes.get(extname(file)) ?? "application/octet-stream" });
      createReadStream(file).pipe(response);
    } catch (error) {
      response.writeHead(500, { "content-type": "text/plain" });
      response.end(String(error));
    }
    return;
  }
  response.writeHead(404, { "content-type": "text/plain" });
  response.end("Not found");
});

server.listen(port, "127.0.0.1", () => {
  console.log(`IA² AE2E server listening on http://127.0.0.1:${port}`);
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => server.close(() => process.exit(0)));
}
