import { copyFile, mkdir, rm } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const output = join(root, ".site");

const assets = [
  ["site/_redirects", "_redirects"],
  ["specs/html-rdf/index.html", "spec/html-rdf/index.html"],
  ["demos/live-workspace/index.html", "demos/live-workspace/index.html"],
  ["demos/live-workspace/app.js", "demos/live-workspace/app.js"],
  ["demos/live-workspace/styles.css", "demos/live-workspace/styles.css"],
  [
    "packages/html-rdf-navigator/dist/html-rdf-navigator.js",
    "packages/html-rdf-navigator/dist/html-rdf-navigator.js",
  ],
  [
    "packages/html-rdf-navigator/dist/html-rdf-navigator.js.map",
    "packages/html-rdf-navigator/dist/html-rdf-navigator.js.map",
  ],
];

await rm(output, { force: true, recursive: true });

for (const [source, destination] of assets) {
  const target = join(output, destination);
  await mkdir(dirname(target), { recursive: true });
  await copyFile(join(root, source), target);
}

console.log(`Prepared ${assets.length} static assets in .site/`);
