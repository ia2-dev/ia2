import { copyFile, cp, mkdir, rm } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const output = join(root, ".site");

const assets = [
  ["site/index.html", "index.html"],
  ["site/home.css", "home.css"],
  ["site/home.js", "home.js"],
  ["site/spec-selector.css", "spec-selector.css"],
  ["site/spec-selector.js", "spec-selector.js"],
  ["site/assets/ia2-mark.svg", "assets/ia2-mark.svg"],
  ["site/assets/ia2-mark-512.png", "assets/ia2-mark-512.png"],
  ["site/guide/index.html", "guide/html-rdf/index.html"],
  ["site/guide.css", "guide.css"],
  ["site/guide.js", "guide.js"],
  ["site/_redirects", "_redirects"],
  ["specs/html-rdf/index.html", "spec/html-rdf/index.html"],
  ["specs/discovery-enrichment/index.html", "spec/discovery-enrichment/index.html"],
  ["specs/resource-envelope/index.html", "spec/resource-envelope/index.html"],
  [
    "specs/resource-envelope/examples/decision-handoff.html",
    "spec/resource-envelope/examples/decision-handoff.html",
  ],
  [
    "specs/resource-envelope/examples/vendor-review.html",
    "spec/resource-envelope/examples/vendor-review.html",
  ],
  [
    "specs/resource-envelope/examples/inspection-evidence.html",
    "spec/resource-envelope/examples/inspection-evidence.html",
  ],
  [
    "specs/resource-envelope/examples/release-handoff.html",
    "spec/resource-envelope/examples/release-handoff.html",
  ],
  [
    "packages/html-rdf-navigator/dist/html-rdf-navigator.js",
    "packages/html-rdf-navigator/dist/html-rdf-navigator.js",
  ],
  [
    "packages/html-rdf-navigator/dist/html-rdf-navigator.js.map",
    "packages/html-rdf-navigator/dist/html-rdf-navigator.js.map",
  ],
  [
    "packages/hare-viewer/dist/hare-viewer.js",
    "packages/hare-viewer/dist/hare-viewer.js",
  ],
  [
    "packages/hare-viewer/dist/hare-viewer.js.map",
    "packages/hare-viewer/dist/hare-viewer.js.map",
  ],
];

await rm(output, { force: true, recursive: true });

for (const [source, destination] of assets) {
  const target = join(output, destination);
  await mkdir(dirname(target), { recursive: true });
  await copyFile(join(root, source), target);
}

await cp(join(root, "demos"), join(output, "demos"), { recursive: true });

console.log(`Prepared ${assets.length} static assets and demos in .site/`);
