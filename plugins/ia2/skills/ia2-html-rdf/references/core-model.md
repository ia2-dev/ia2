# IA² HTML/RDF Core 0.1 reference

Use this reference for the proposed binding implemented by IA². The canonical source is `https://ia2.dev/spec/html-rdf`; in the IA² repository it is `specs/html-rdf/index.html`.

## Invariants

- One element bearing `rdf-predicate` determines one complete asserted statement.
- No subject, graph, vocabulary, or other RDF state is inherited from ancestors or siblings.
- No implicit chaining occurs through DOM nesting.
- Extraction uses only the supplied parsed root plus its retrieval, source, and base IRIs.
- Extraction records data and executes nothing.
- A document-root query does not enter template contents, shadow roots, or child documents.
- Unknown `rdf-*` attributes are ignored with a diagnostic.

## Attributes

| Attribute | Meaning |
| --- | --- |
| `rdf-version="1.2"` | Select Core 0.1 processing on `html`. Absence also selects 1.2; another value is an unsupported-version failure. |
| `rdf-subject` | Override the default subject with a resolved IRI reference. |
| `rdf-subject-key` | Override the subject with an extraction-local blank node. |
| `rdf-predicate` | Mark a statement and name its predicate IRI. |
| `rdf-object-key` | Select an extraction-local blank-node object. |
| `rdf-datatype` | Name a literal datatype IRI. |
| `rdf-graph` | Name an IRI graph for a statement, or declare a graph on a non-statement element. |
| `rdf-graph-key` | Select a blank-node graph, or declare one on a non-statement element. |

There is no general `rdf-object` attribute. All `*-key` values must be non-empty and contain no ASCII whitespace. Keys are case-sensitive, local to one extraction, and are not RDF identifiers.

## Document identity and IRI processing

Derive the source document IRI from exactly one usable `head link[rel~="canonical"][href]`: resolve it against the HTML base and require an absolute, fragmentless result. With zero candidates, use the retrieval IRI. With multiple or invalid candidates, diagnose and fall back to the retrieval IRI. Never dereference the canonical IRI merely to extract RDF.

Use the explicit HTML `base[href]` as the RDF base IRI. Without it, use the source document IRI. Read IRI-valued content attributes, not reflected IDL properties. Resolve them as RFC 3987/3986 IRI references without additional URL canonicalization. Fragment-only subjects resolve against the source document IRI so they remain aligned with `id`-derived subjects.

## Subject construction

Apply the first matching rule:

1. resolved `rdf-subject` IRI;
2. blank node selected by `rdf-subject-key`;
3. source document IRI plus the encoded non-empty `id` fragment; or
4. a fresh blank node associated with the statement element.

`rdf-subject` and `rdf-subject-key` are mutually exclusive. `rdf-subject=""` is a valid empty relative IRI reference, not missing state.

## Object construction

Exactly one object form must apply.

### IRI carrier allowlist

| Attribute | Allowed elements |
| --- | --- |
| `href` | `a`, `area`, `link` |
| `src` | `audio`, `embed`, `iframe`, `img`, `input`, `script`, `source`, `track`, `video` |
| `cite` | `blockquote`, `del`, `ins`, `q` |
| `action` | `form` |
| `formaction` | `button`, `input` |
| `data` | `object` |
| `poster` | `video` |

More than one supported pair is an error. `srcset`, `ping`, `srcdoc`, `usemap`, and `base[href]` are not object carriers.

### Literal carriers

Use exact attribute text from `meta[content]`, `data[value]`, or `time[datetime]`. Otherwise concatenate descendant text outside template contents, collapse each ASCII-whitespace run to one space, and trim leading/trailing spaces. Do not use CSS, layout, `innerText`, inherited language, or accessibility-name computation. A text-literal carrier must not contain a descendant statement outside a template.

If `rdf-datatype` is present, do not also use a non-empty direct `lang` or direct `dir=ltr|rtl`. Do not explicitly use `rdf:langString` or `rdf:dirLangString` as `rdf-datatype`.

Without `rdf-datatype`, inspect only directly present `lang` and `dir`:

- no language or direction produces `xsd:string`;
- a valid non-empty BCP 47 `lang` produces `rdf:langString`;
- `lang` plus `dir=ltr|rtl` produces RDF 1.2 `rdf:dirLangString`;
- direction without language is invalid;
- absent `dir` or `dir=auto` supplies no RDF direction; other values are invalid.

### Triple-term carrier

One direct child `template`, with no competing carrier, can carry an RDF 1.2 triple term. Its content must have exactly one element child and exactly one `[rdf-predicate]` in that fragment, no other non-whitespace top-level text, no graph declaration, and no graph attribute on the inner statement. Parse the inner statement as a term without asserting it. Nested object-position templates permit nested terms.

## Graphs

No graph attribute means the default graph. A statement may have exactly one of `rdf-graph` and `rdf-graph-key`; repeat it on every statement in that graph.

A non-statement element with exactly one graph attribute declares a named graph, including an empty graph. It does not scope descendants. Repeated declarations are idempotent.

## Recovery and trust

An invalid statement emits no triple. Continue extracting independent statements. A malformed nested term invalidates its containing statement recursively. Do not choose among competing carriers or infer replacement values.

Preserve retrieval and source IRIs, acquisition mode, observation time when relevant, graph identity, asserted-vs-triple-term distinctions, provenance, and diagnostics. Extraction does not authorize validation, rule execution, or actions.
