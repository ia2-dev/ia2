# IA² HTML/RDF

`@ia2-dev/html-rdf` is the dependency-free host-binding layer for IA²
HTML/RDF. It extracts an RDF 1.2 dataset from a `Document` or
`DocumentFragment`, retains correlations to statement carriers, and serializes
the result as Turtle, TriG, or JSON-LD views.

```ts
import { extractDataset, serializeTurtle } from "@ia2-dev/html-rdf";

const result = extractDataset(document);
console.log(serializeTurtle(result));
```

UI packages such as RDF Navigator and RDF Value Editor consume this package. The
core does not register custom elements or mutate the source DOM.
