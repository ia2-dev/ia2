import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { extractHtmlClassification, SOURCE_URLS } from "./lib/html-classification.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const valueArgument = (name) => process.argv.find((argument) => argument.startsWith(`--${name}=`))?.slice(name.length + 3);
const dateArgument = valueArgument("date");
const indicesPath = valueArgument("indices");
const syntaxPath = valueArgument("syntax");
const webIdlPath = valueArgument("webidl");
const replace = process.argv.includes("--replace");
const snapshotDate = dateArgument || new Date().toISOString().slice(0, 10);
if (!/^\d{4}-\d{2}-\d{2}$/.test(snapshotDate)) throw new Error("Snapshot date must use YYYY-MM-DD.");
if (new Set([Boolean(indicesPath), Boolean(syntaxPath), Boolean(webIdlPath)]).size !== 1) {
  throw new Error("Offline refresh requires --indices=PATH, --syntax=PATH, and --webidl=PATH together.");
}

async function retrieve(url, path) {
  if (path) return readFile(resolve(path), "utf8");
  const response = await fetch(url, { headers: { accept: "text/html" } });
  if (!response.ok) throw new Error(`HTML Living Standard returned HTTP ${response.status} for ${url}.`);
  return response.text();
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

const [indicesHtml, syntaxHtml, webIdlHtml] = await Promise.all([
  retrieve(SOURCE_URLS.elementIndex, indicesPath),
  retrieve(SOURCE_URLS.syntaxKinds, syntaxPath),
  retrieve(SOURCE_URLS.webIdl, webIdlPath),
]);
const snapshot = extractHtmlClassification({
  indicesHtml,
  syntaxHtml,
  webIdlHtml,
  snapshotDate,
  sourceDigests: { indices: sha256(indicesHtml), syntax: sha256(syntaxHtml), webIdl: sha256(webIdlHtml) },
});
const output = resolve(root, `data/html-elements-${snapshotDate}.json`);
await writeFile(output, `${JSON.stringify(snapshot, null, 2)}\n`, { flag: replace ? "w" : "wx" });
const conditionalCount = snapshot.elements.flatMap((element) => element.categories).filter((membership) => membership.conditional).length;
console.log(`Captured ${snapshot.elements.length} current HTML elements, ${snapshot.attributes.length} current HTML attributes, ${snapshot.contentCategories.length} categories, and ${conditionalCount} conditional memberships in ${output}.`);
