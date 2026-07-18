# RDF/HTML examples

These files are complete Turtle or TriG inputs for the
[IA² RDF/HTML Renderer](https://ia2.dev/render). The examples cover compact
RDF Collection orderings, independently contributed flat orderings, named
nodes, mixed content, attributes, comments, document metadata, retained domain
RDF, and multi-document selection.

## Authored examples

| File | Demonstrates |
| --- | --- |
| `welcome.ttl` | A small hand-authored document with retained domain RDF. |
| `accessibility-check.ttl` | Labels, fieldsets, form controls, attributes, and a comment. |
| `conference-agenda.ttl` | A styled event program with dates, a table, links, and lists. |
| `field-observations.ttl` | Article structure, measurements, mixed content, metadata, and quotations. |
| `independent-contributions.trig` | Separate named graphs contribute children without mutating a shared list; broad precedence avoids claiming adjacency. |
| `multi-audience.trig` | Two HTML documents selected from one dataset plus a shared named graph. |

The corresponding source HTML for generated examples is in `sources/`. IA²
contributors authored these documents for this project.

## Adapted public-source examples

The repository includes small, text-focused adaptations instead of mirroring
entire public pages. Site chrome, scripts, analytics, images, logos, and
third-party media are omitted.

| File | Source and reuse basis |
| --- | --- |
| `alice-rabbit-hole.ttl` | An excerpt from Lewis Carroll's *Alice's Adventures in Wonderland*, sourced from [Project Gutenberg ebook 11](https://www.gutenberg.org/ebooks/11). Its catalog identifies the underlying work as public domain in the United States. Project Gutenberg's name is used only to identify the source; see its [license policy](https://www.gutenberg.org/policy/license). |
| `whatwg-dom-introduction.ttl` | An adapted and shortened DOM introduction from the [HTML Living Standard](https://html.spec.whatwg.org/dev/introduction.html#a-quick-introduction-to-html), attributed to WHATWG contributors and distributed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). |
| `nasa-apollo-11.ttl` | A text-only adaptation of NASA's [Apollo 11 Mission Overview](https://www.nasa.gov/history/apollo-11-mission-overview/). It contains no NASA insignia, imagery, or identified third-party media. See NASA's [media usage guidelines](https://www.nasa.gov/nasa-brand-center/images-and-media/). |

These notes document the project's source selection and transformations. They
are not legal advice, and downstream users remain responsible for their reuse.

## Regeneration

The six generated Turtle files are deterministic conversions of the HTML files
in `sources/`:

```sh
npm run generate:rdf-html-examples
```

`npm run check` regenerates them in memory and fails if a checked-in Turtle
file is stale. The published package CLI can convert another HTML file or URL:

```sh
npx @ia2-dev/rdf-html describe source.html \
  --output document.ttl \
  --document-iri https://example.com/document#this \
  --base https://example.com/document/
```
