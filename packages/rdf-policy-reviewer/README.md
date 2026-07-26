# RDF Policy Reviewer

`@ia2-dev/rdf-policy-reviewer` is a generic web component that observes an
HTML/RDF document, validates its current dataset against a separately supplied
SHACL profile, and explains RDF statement changes.

```html
<iframe id="draft" src="contract.html"></iframe>
<ia2-rdf-policy-reviewer
  source-frame="#draft"
  profile-root="#counsel-policy"
  diff-graphs="https://example.test/contract#runtime"
></ia2-rdf-policy-reviewer>
```

The component understands RDF, SHACL Core, SHACL-SPARQL, labels, and optional
Web Annotations whose `oa:hasBody` is a source shape and whose `oa:hasTarget`
identifies one or more presentation locations. It contains no contract or legal vocabulary.
The profile remains an independent RDF artifact and can stay internal when the
reviewed document is distributed.

Local roots are observed with `MutationObserver`. Framed documents can also
publish `ia2-rdf-dataset-change`. Override the whitespace-separated
`change-events` attribute when another host has its own dataset-change event.

Assign `Document`, `DocumentFragment`, or `Element` values to the `sourceRoot`
and `profileRoot` properties when CSS selectors are not appropriate. Profile
extraction errors stop review rather than producing a misleading conformance
result.

For SHACL, the HTML/RDF adapter deliberately projects each extracted dataset's
named graphs into one explicit RDF graph. The headless `validatePolicy(data,
shapes)` export accepts ordinary RDF/JS `DatasetCore` graphs and has no HTML
dependency.

```ts
import { validatePolicy } from "@ia2-dev/rdf-policy-reviewer/validation";
import { diffQuads } from "@ia2-dev/rdf-policy-reviewer/diff";
```

Those subpath exports do not register a custom element or require browser
globals. Import the package root only when using `<ia2-rdf-policy-reviewer>`.

Semantic diffs require stable named resources. Configure `diff-graphs` to a
runtime or application graph without blank nodes. `diffQuads` rejects
blank-node-bearing inputs instead of treating extraction-local blank-node
labels as persistent identity. The component keeps the dataset observed when
review begins as its baseline, so transient keystrokes do not become the next
comparison point. A single-valued replacement is presented as one change;
multivalued RDF retains separate additions and removals.
