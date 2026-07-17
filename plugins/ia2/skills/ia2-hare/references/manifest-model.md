# HARE 0.1 manifest model

Use this reference for the exploratory IA² HARE 0.1 proposal. The canonical source is `https://ia2.dev/spec/resource-envelope`; in the IA² repository it is `specs/resource-envelope/index.html`.

Namespace: `https://ia2.dev/spec/resource-envelope#`

## Envelope requirements

A conforming envelope is a UTF-8 HTML document with the HTML doctype and `rdf-version="1.2"`. It has:

- exactly one node of type `hare:Envelope`;
- `dcterms:conformsTo hare:HARE-0.1`;
- exactly one of `hare:DeclarativeProfile` and `hare:SelfViewingProfile` through `dcterms:conformsTo`;
- exactly one `hare:manifestGraph` IRI;
- exactly one `hare:virtualBase` IRI;
- at least one resource and representation;
- a visible title, description, resource list, and trust statement; and
- meaningful no-script presentation.

Use one usable HTML canonical link when a stable retrievable location exists. It carries identity and retrieval metadata only, not proof of availability, integrity, authority, or permission.

## Canonical manifest

The canonical manifest is the named HTML/RDF graph selected by `hare:manifestGraph`, not a JSON or JSON-LD block. A derived JSON, Turtle, index, or search view may be an ordinary resource but must not compete with the HTML/RDF graph.

Every manifest statement explicitly states the manifest `rdf-graph`. Grouping statements inside `<section id="manifest">` is presentational and does not scope the graph.

Discovery is inert:

1. parse HTML without executing code;
2. extract its HTML/RDF dataset;
3. require exactly one `hare:Envelope`;
4. require supported HARE and artifact profiles;
5. select the graph named by `hare:manifestGraph` and require that it exists; and
6. read and validate `hare:virtualBase`.

Preserve unknown statements and do not dereference the HARE namespace to process the bundle.

## Vocabulary

| Term | Meaning |
| --- | --- |
| `hare:Envelope` | The single HTML resource-bundle artifact. |
| `hare:Representation` | A semantic or byte realization of a resource. |
| `hare:DOMRepresentation` | Semantic HTML carried by a `template`. |
| `hare:ByteRepresentation` | Exact bytes carried as base64. |
| `hare:ViewerRuntime` | Executable enhancement declared by a self-viewing envelope. |
| `hare:manifestGraph` | Canonical manifest graph name. |
| `hare:virtualBase` | Host document URL in the non-retrievable virtual space. |
| `hare:representation` | Relates a resource to a representation. |
| `hare:carrier` | IRI of the HTML carrier element. |
| `hare:byteLength` | Exact decoded-octet count. |
| `hare:runtime` | Relates the envelope to a declared viewer runtime. |

Reused terms:

- `dcterms:hasPart` includes conceptual resources in the envelope.
- `dcterms:identifier` gives a representation an optional logical path.
- `dc:format` gives a representation one IANA media type string.
- `cred:digestSRI` gives a byte representation one SHA-256 SRI value with datatype `cred:sriString`.

Media type, logical path, carrier, byte length, and digest belong to the representation, not the conceptual resource. One resource may have multiple representations.

## Representation constraints

Every representation has exactly one representation-kind type, exactly one `dc:format`, and exactly one `hare:carrier`. It may have at most one logical path.

### DOM representation

- type: `hare:DOMRepresentation` only;
- media type: `text/html`;
- carrier: one `template` with a unique `id`;
- logical path: required and unique; and
- content: parsed semantic DOM, not canonical source bytes.

Inspect or clone the fragment without execution. Serialization is a derived artifact. Add a separate byte representation when exact downloadable HTML matters.

### Byte representation

- type: `hare:ByteRepresentation` only;
- carrier: one `script` with a unique `id`, `type="application/octet-stream"`, and `data-encoding="base64"`;
- `hare:byteLength`: exactly one non-negative integer; and
- `cred:digestSRI`: exactly one `sha256-<base64-digest>` typed as `cred:sriString`.

Carrier processing removes ASCII whitespace from DOM text, decodes strict padded base64, checks decoded length, computes SHA-256 over decoded bytes, compares the SRI value, and returns bytes only after every check passes.

## Virtual base and logical paths

The virtual base is a credential-free HTTPS URL under `.invalid`, with path `/` and no query or fragment. It is the host envelope's virtual URL and must not be dereferenced. Scope it to the declaring envelope; it is not RDF identity.

A logical path:

- starts with `/` but is not `/`;
- contains no query, fragment, empty segment, `.` segment, or `..` segment;
- uses uppercase hexadecimal in percent escapes;
- does not encode slash, backslash, dot segments, or NUL; and
- is case-sensitively unique in the envelope.

Resolve a representation path against `virtualBase` to derive its virtual URL. Resolve links in a DOM representation against that representation's virtual URL. A declared target routes within the bundle, `/` routes to the host, a fragment routes within the selected document, and an outside-origin result is external and requires deliberate user navigation.

A representation without a logical path has no virtual URL. Byte representations may omit a path; DOM representations may not.
