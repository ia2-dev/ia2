import { copyFile, cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import hljs from "highlight.js/lib/core";
import c from "highlight.js/lib/languages/c";
import cpp from "highlight.js/lib/languages/cpp";
import csharp from "highlight.js/lib/languages/csharp";
import dart from "highlight.js/lib/languages/dart";
import elixir from "highlight.js/lib/languages/elixir";
import go from "highlight.js/lib/languages/go";
import java from "highlight.js/lib/languages/java";
import javascript from "highlight.js/lib/languages/javascript";
import kotlin from "highlight.js/lib/languages/kotlin";
import php from "highlight.js/lib/languages/php";
import python from "highlight.js/lib/languages/python";
import ruby from "highlight.js/lib/languages/ruby";
import rust from "highlight.js/lib/languages/rust";
import scala from "highlight.js/lib/languages/scala";
import swift from "highlight.js/lib/languages/swift";

for (const [name, language] of Object.entries({
  c, cpp, csharp, dart, elixir, go, java, javascript, kotlin, php, python, ruby, rust, scala, swift,
})) {
  hljs.registerLanguage(name, language);
}

const root = fileURLToPath(new URL("../", import.meta.url));
const output = join(root, ".site");

const assets = [
  ["site/index.html", "index.html"],
  ["site/llms.txt", "llms.txt"],
  ["site/home.css", "home.css"],
  ["site/home.js", "home.js"],
  ["site/privacy.css", "privacy.css"],
  ["site/privacy/index.html", "privacy/index.html"],
  ["site/support/index.html", "support/index.html"],
  ["site/spec-selector.css", "spec-selector.css"],
  ["site/spec-selector.js", "spec-selector.js"],
  ["site/assets/ia2-mark.svg", "assets/ia2-mark.svg"],
  ["site/assets/ia2-mark-512.png", "assets/ia2-mark-512.png"],
  ["site/guide/index.html", "guide/html-rdf/index.html"],
  ["site/guide.css", "guide.css"],
  ["site/guide.js", "guide.js"],
  ["site/_redirects", "_redirects"],
  ["specs/html-rdf/index.html", "spec/html-rdf/index.html"],
  [
    "specs/html-rdf/binding-profile/core-0.1.ttl",
    "spec/html-rdf/binding-profile/core-0.1.ttl",
  ],
  [
    "examples/html-rdf-libraries/generated/carrier-profile.json",
    "spec/html-rdf/binding-profile/core-0.1.json",
  ],
  ["specs/rdf-html/index.html", "spec/rdf-html/index.html"],
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
  [
    "packages/rdf-html/dist/index.js",
    "packages/rdf-html/dist/index.js",
  ],
  [
    "packages/rdf-html/dist/index.js.map",
    "packages/rdf-html/dist/index.js.map",
  ],
];

await rm(output, { force: true, recursive: true });

for (const [source, destination] of assets) {
  const target = join(output, destination);
  await mkdir(dirname(target), { recursive: true });
  await copyFile(join(root, source), target);
}

const libraryRoot = join(root, "examples/html-rdf-libraries");
const libraryManifest = JSON.parse(await readFile(join(libraryRoot, "manifest.json"), "utf8"));
const guideTarget = join(output, "guide/html-rdf/index.html");
let guide = await readFile(guideTarget, "utf8");
const sourcePattern = /<code data-library-source="([^"]+)" data-language="([^"]+)">[\s\S]*?<\/code>/g;
const declarations = [...guide.matchAll(sourcePattern)];
const declaredSources = declarations.map((match) => match[1]).sort();
const manifestSources = libraryManifest.map(({ source }) => source).sort();

if (JSON.stringify(declaredSources) !== JSON.stringify(manifestSources)) {
  throw new Error("The guide must declare one source disclosure for every library example");
}

for (const declaration of declarations) {
  const [markup, source, language] = declaration;
  const code = await readFile(join(libraryRoot, source), "utf8");
  const highlighted = hljs.highlight(code, { language, ignoreIllegals: true }).value;
  guide = guide.replace(
    markup,
    `<code class="hljs language-${language}" data-library-source="${source}" data-language="${language}">${highlighted}</code>`,
  );
}

await writeFile(guideTarget, guide);

await cp(join(root, "demos"), join(output, "demos"), { recursive: true });
await cp(
  join(root, "packages/rdf-html/vocabulary"),
  join(output, "spec/rdf-html/vocabulary"),
  { recursive: true },
);
await cp(
  join(root, "packages/rdf-html/data"),
  join(output, "spec/rdf-html/data"),
  { recursive: true },
);
await cp(
  join(root, "specs/rdf-html/examples"),
  join(output, "spec/rdf-html/examples"),
  { recursive: true },
);
await cp(
  join(root, "specs/rdf-html/tests"),
  join(output, "spec/rdf-html/tests"),
  { recursive: true },
);
console.log(`Prepared ${assets.length} static assets, RDF/HTML snapshots and vocabularies, and demos in .site/`);
