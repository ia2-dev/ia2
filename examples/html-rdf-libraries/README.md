# HTML/RDF parser library examples

These focused programs show how to fetch the same HTML document, find statement
carriers by the `rdf-predicate` attribute, and construct the same four RDF
terms. The inert statement inside `<template>` is intentionally outside normal
document extraction.

The readable source in each language is a parser adapter. It imports a small
generated carrier table instead of repeating the HTML element-to-value policy.
That table is compiled from the canonical RDF profile at
`specs/html-rdf/binding-profile/core-0.1.ttl`; a neutral form is available as
`generated/carrier-profile.json`. The examples remain starting points rather
than alternative complete implementations of the normative algorithm.

## Reading an example

Every version calls out the same semantic decisions beside the code that
implements them:

- The generated profile selects a supported native carrier by element and
  attribute name.
- IRI carriers resolve their exact attribute value against the semantic source.
- Literal carriers preserve their exact attribute value. Other elements use
  whitespace-normalized descendant text in this example.
- `lang` and `dir` are read only from the statement carrier. Their HTML
  inheritance behavior does not become hidden RDF parser state.
- An explicit `rdf-datatype` takes precedence. Without one, a directed literal
  uses `rdf:dirLangString`; other literals in this fixture use `xsd:string`.

The comments are deliberately parallel across languages. The generated table
contains shared policy, while the surrounding code demonstrates the parser
library's native selectors, attribute access, tree traversal, URL resolution,
and RDF term construction.

## Regenerating the carrier tables

The generator parses the Turtle profile as ordinary RDF, validates its joins
and cardinalities, and writes the neutral JSON table plus fifteen native source
files. It fails closed if a rule is incomplete, duplicated, or unsupported.

```sh
npm run generate:html-rdf-profile
npm run check:html-rdf-profile
```

No generated adapter needs SPARQL. The compiler iterates the profile's triples,
joins `rdfhtml:tagName` and `rdfhtml:attributeLocalName`, and emits a lookup
table keyed by the element and attribute pair.

Run all fifteen examples in isolated Docker toolchains. The shared check keeps
the examples comparable and fails if any version produces different terms:

```sh
npm run test:library-examples
```

For a faster development check, run every example whose toolchain and
dependencies are already available on the host. This command reports missing
toolchains as skips and is intentionally not the conformance gate:

```sh
npm run test:library-examples:available
```

CI divides the suite with `HTML_RDF_ONLY=<manifest-id>` so every language is an
independently reported job. Running without that variable executes the complete
matrix:

```sh
node examples/html-rdf-libraries/test-containers.mjs
```

Every program accepts the fixture URL as its first argument and prints only
TSV rows to standard output. This keeps the behavioral contract independent of
language-specific RDF object APIs. Each directory contains its native
dependency manifest and a `run` script.
