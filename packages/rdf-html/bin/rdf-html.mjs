#!/usr/bin/env node

import { realpathSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import {
  parseRdfHtml,
  renderRdfHtmlDocument,
  renderRdfHtmlWorkspace,
} from "../dist/index.js";
import { htmlToRdfHtml } from "../dist/node.js";

const MAX_REMOTE_BYTES = 10 * 1024 * 1024;
const BOOLEAN_OPTIONS = new Set(["help", "publication", "workspace"]);
const VALUE_OPTIONS = new Set([
  "attribution", "base", "content-type", "description", "document",
  "document-iri", "license", "output", "source", "title",
]);
const SHORT_OPTIONS = new Map([["-h", "help"], ["-o", "output"]]);
const HELP = [
  "Usage:",
  "  rdf-html render <file-or-url> [options]",
  "  rdf-html describe <file-or-url> [options]",
  "",
  "Commands:",
  "  render      Convert RDF/HTML Turtle or TriG to HTML.",
  "  describe    Convert parsed HTML to RDF/HTML Turtle.",
  "",
  "Input and output:",
  "  <file-or-url>          Local path, HTTP(S) URL, or - for stdin.",
  "  -o, --output <path>    Write to a file instead of stdout.",
  "  --content-type <type>  Override input media-type detection.",
  "  --base <iri>           Override the source or document base IRI.",
  "",
  "Render options:",
  "  --document <value>     Zero-based index, document IRI, or unique title.",
  "  --publication          Preserve unused RDF in an HTML/RDF island.",
  "  --workspace            Render every document in an inert workspace.",
  "",
  "Describe options:",
  "  --document-iri <iri>   RDF identity of the described document.",
  "  --source <iri>         Source IRI recorded as dcterms:source.",
  "  --title <text>         Override the parsed document title.",
  "  --license <iri>        Record dcterms:license.",
  "  --attribution <text>   Record dcterms:creator.",
  "  --description <text>   Record dcterms:description.",
  "",
  "Examples:",
  "  npx @ia2-dev/rdf-html render page.ttl -o page.html",
  "  npx @ia2-dev/rdf-html render https://example.org/pages.trig --document 1",
  "  npx @ia2-dev/rdf-html describe page.html -o page.ttl",
  "  npx @ia2-dev/rdf-html describe https://example.org/ --document-iri https://example.org/#document",
  "",
].join("\n");

function parseArguments(argv) {
  const args = [...argv];
  const command = args.shift();
  const options = new Map();
  const positional = [];
  while (args.length > 0) {
    const argument = args.shift();
    if (argument === "--") {
      positional.push(...args);
      break;
    }
    if (argument?.startsWith("--")) {
      const equals = argument.indexOf("=");
      const name = argument.slice(2, equals < 0 ? undefined : equals);
      if (BOOLEAN_OPTIONS.has(name)) {
        if (equals >= 0) throw new Error("--" + name + " does not accept a value.");
        options.set(name, true);
        continue;
      }
      if (!VALUE_OPTIONS.has(name)) throw new Error("Unknown option --" + name + ".");
      const value = equals >= 0 ? argument.slice(equals + 1) : args.shift();
      if (!value || value.startsWith("--")) throw new Error("Missing value for --" + name + ".");
      options.set(name, value);
      continue;
    }
    if (argument && SHORT_OPTIONS.has(argument)) {
      const name = SHORT_OPTIONS.get(argument);
      if (name === "help") options.set(name, true);
      else {
        const value = args.shift();
        if (!value) throw new Error("Missing value for " + argument + ".");
        options.set(name, value);
      }
      continue;
    }
    if (argument?.startsWith("-") && argument !== "-") throw new Error("Unknown option " + argument + ".");
    if (argument !== undefined) positional.push(argument);
  }
  return { command, options, positional };
}

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(Buffer.from(chunk));
  return Buffer.concat(chunks).toString("utf8");
}

function remoteUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:" ? url : null;
  } catch {
    return null;
  }
}

async function readRemote(url, accept) {
  const response = await fetch(url, { headers: { Accept: accept }, redirect: "follow" });
  if (!response.ok) throw new Error(url.href + " returned HTTP " + response.status + ".");
  const declaredLength = Number.parseInt(response.headers.get("content-length") ?? "", 10);
  if (Number.isFinite(declaredLength) && declaredLength > MAX_REMOTE_BYTES) {
    throw new Error("Remote input exceeds the " + (MAX_REMOTE_BYTES / 1024 / 1024) + " MiB limit.");
  }
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.byteLength > MAX_REMOTE_BYTES) {
    throw new Error("Remote input exceeds the " + (MAX_REMOTE_BYTES / 1024 / 1024) + " MiB limit.");
  }
  return {
    contentType: response.headers.get("content-type")?.split(";", 1)[0].trim().toLowerCase() ?? "",
    text: bytes.toString("utf8"),
    url: response.url || url.href,
  };
}

export async function readInput(source, command, baseOverride) {
  if (source === "-") {
    if (!baseOverride) throw new Error("Stdin input requires --base with an absolute IRI.");
    return { contentType: "", text: await readStdin(), url: baseOverride };
  }
  const url = remoteUrl(source);
  if (url) {
    const accept = command === "render"
      ? "text/turtle, application/trig;q=0.9, text/plain;q=0.5"
      : "text/html, application/xhtml+xml;q=0.9";
    return readRemote(url, accept);
  }
  const path = resolve(source);
  return { contentType: "", text: await readFile(path, "utf8"), url: pathToFileURL(path).href };
}

function rdfContentType(input, override) {
  if (override) return override;
  if (["application/trig", "application/x-trig"].includes(input.contentType) || /\.trig(?:$|[?#])/i.test(input.url)) {
    return "application/trig";
  }
  if (["text/turtle", "application/x-turtle", "text/plain"].includes(input.contentType) || /\.ttl(?:$|[?#])/i.test(input.url)) {
    return "text/turtle";
  }
  throw new Error("Cannot determine whether the RDF input is Turtle or TriG; pass --content-type.");
}

function chooseDocument(documents, value) {
  if (documents.length === 0) throw new Error("The RDF dataset does not define an rdfhtml:Document.");
  if (value === undefined && documents.length === 1) return documents[0];
  if (value === undefined) {
    const choices = documents.map((document, index) => "  " + index + ": " + document.label + " (" + document.nodeId + ")").join("\n");
    throw new Error("The source describes " + documents.length + " documents. Select one with --document:\n" + choices);
  }
  if (/^\d+$/.test(value)) {
    const selected = documents[Number(value)];
    if (selected) return selected;
  }
  const matches = documents.filter((document) => document.nodeId === value || document.label === value);
  if (matches.length === 1) return matches[0];
  if (matches.length > 1) throw new Error("Document selector " + JSON.stringify(value) + " matches more than one title; use its index or IRI.");
  throw new Error("Document selector " + JSON.stringify(value) + " does not match any RDF/HTML document.");
}

function defaultDocumentIri(inputUrl) {
  const url = new URL(inputUrl);
  url.hash = "document";
  return url.href;
}

async function writeResult(value, output) {
  if (!output || output === "-") {
    process.stdout.write(value);
    return;
  }
  await writeFile(resolve(output), value, "utf8");
}

async function packageVersion() {
  const packageJson = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
  return packageJson.version;
}

async function main() {
  const { command, options, positional } = parseArguments(process.argv.slice(2));
  if (command === "--version" || command === "-v" || command === "version") {
    process.stdout.write((await packageVersion()) + "\n");
    return;
  }
  if (!command || command === "help" || command === "--help" || command === "-h" || options.has("help")) {
    process.stdout.write(HELP);
    return;
  }
  if (command !== "render" && command !== "describe") {
    throw new Error("Unknown command " + JSON.stringify(command) + ".\n\n" + HELP);
  }
  if (positional.length !== 1) throw new Error(command + " requires exactly one file, URL, or - input.");

  const input = await readInput(positional[0], command, options.get("base"));
  if (command === "render") {
    const sourceUrl = options.get("base") ?? input.url;
    const contentType = rdfContentType(input, options.get("content-type"));
    let html;
    if (options.has("workspace")) {
      html = renderRdfHtmlWorkspace(input.text, { contentType, sourceUrl });
    } else {
      const parsed = parseRdfHtml(input.text, { baseIRI: sourceUrl, contentType });
      const document = chooseDocument(parsed.documents, options.get("document"));
      const rendered = renderRdfHtmlDocument(parsed.dataset, document);
      html = options.has("publication") ? rendered.publicationHtml : rendered.html;
    }
    await writeResult(html, options.get("output"));
    return;
  }

  const baseIRI = options.get("base") ?? input.url;
  const documentIRI = options.get("document-iri") ?? defaultDocumentIri(input.url);
  const turtle = htmlToRdfHtml(input.text, {
    baseIRI,
    documentIRI,
    sourceIRI: options.get("source") ?? input.url,
    ...(options.has("title") ? { title: options.get("title") } : {}),
    ...(options.has("license") ? { licenseIRI: options.get("license") } : {}),
    ...(options.has("attribution") ? { attribution: options.get("attribution") } : {}),
    ...(options.has("description") ? { description: options.get("description") } : {}),
  });
  await writeResult(turtle, options.get("output"));
}

function isMainModule() {
  if (!process.argv[1]) return false;
  try {
    return realpathSync(process.argv[1]) === fileURLToPath(import.meta.url);
  } catch {
    return false;
  }
}

if (isMainModule()) {
  main().catch((error) => {
    process.stderr.write("rdf-html: " + (error instanceof Error ? error.message : String(error)) + "\n");
    process.exitCode = 1;
  });
}
