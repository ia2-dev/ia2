import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { htmlToRdfHtml } from "../packages/rdf-html/dist/node.js";

const root = fileURLToPath(new URL("../", import.meta.url));
const examples = join(root, "specs/rdf-html/examples");
const check = process.argv.includes("--check");

const manifest = [
  {
    slug: "accessibility-check",
    title: "Accessibility review",
    baseIRI: "https://example.invalid/accessibility-review/",
    sourceIRI: "https://ia2.dev/spec/rdf-html/examples/sources/accessibility-check.html",
    licenseIRI: "https://github.com/ia2-dev/ia2/blob/main/LICENSE",
    attribution: "IA² contributors",
    description: "Authored example demonstrating accessible form structure and attributes.",
  },
  {
    slug: "conference-agenda",
    title: "Open Systems Forum agenda",
    baseIRI: "https://example.invalid/open-systems-forum/",
    sourceIRI: "https://ia2.dev/spec/rdf-html/examples/sources/conference-agenda.html",
    licenseIRI: "https://github.com/ia2-dev/ia2/blob/main/LICENSE",
    attribution: "IA² contributors",
    description: "Authored example demonstrating tables, dates, and a styled event program.",
  },
  {
    slug: "field-observations",
    title: "Estuary field observations",
    baseIRI: "https://example.invalid/field-observations/",
    sourceIRI: "https://ia2.dev/spec/rdf-html/examples/sources/field-observations.html",
    licenseIRI: "https://github.com/ia2-dev/ia2/blob/main/LICENSE",
    attribution: "IA² contributors",
    description: "Authored example demonstrating an article, mixed content, metadata, and measurements.",
  },
  {
    slug: "alice-rabbit-hole",
    title: "Down the Rabbit-Hole",
    baseIRI: "https://www.gutenberg.org/cache/epub/11/",
    sourceIRI: "https://www.gutenberg.org/ebooks/11",
    licenseIRI: "https://www.gutenberg.org/policy/license",
    attribution: "Lewis Carroll",
    description: "Text-only excerpt from a work identified by Project Gutenberg as public domain in the United States; Project Gutenberg branding and license text are not reproduced.",
  },
  {
    slug: "whatwg-dom-introduction",
    title: "A quick introduction to the DOM",
    baseIRI: "https://html.spec.whatwg.org/dev/",
    sourceIRI: "https://html.spec.whatwg.org/dev/introduction.html#a-quick-introduction-to-html",
    licenseIRI: "https://creativecommons.org/licenses/by/4.0/",
    attribution: "WHATWG contributors",
    description: "Adapted and shortened from the HTML Living Standard to focus on its DOM explanation.",
  },
  {
    slug: "nasa-apollo-11",
    title: "Apollo 11 mission overview",
    baseIRI: "https://www.nasa.gov/history/apollo-11-mission-overview/",
    sourceIRI: "https://www.nasa.gov/history/apollo-11-mission-overview/",
    licenseIRI: "https://www.nasa.gov/nasa-brand-center/images-and-media/",
    attribution: "National Aeronautics and Space Administration",
    description: "Text-only adapted excerpt; NASA identifiers, imagery, and third-party media are omitted.",
  },
];

for (const entry of manifest) {
  const input = join(examples, "sources", `${entry.slug}.html`);
  const output = join(examples, `${entry.slug}.ttl`);
  const source = await readFile(input, "utf8");
  const turtle = htmlToRdfHtml(source, {
    ...entry,
    documentIRI: `https://ia2.dev/spec/rdf-html/examples/${entry.slug}#document`,
  });
  if (check) {
    const existing = await readFile(output, "utf8");
    if (existing !== turtle) throw new Error(`${entry.slug}.ttl is stale; run npm run generate:rdf-html-examples.`);
  } else {
    await writeFile(output, turtle, "utf8");
  }
}

console.log(`${check ? "Verified" : "Generated"} ${manifest.length} HTML-to-RDF/HTML examples.`);
