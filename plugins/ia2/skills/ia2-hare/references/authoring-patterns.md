# HARE 0.1 authoring patterns

Use full IRI references. Every manifest statement below explicitly belongs to `#manifest`.

## Envelope declaration

```html
<!doctype html>
<html lang="en" rdf-version="1.2">
<head>
  <meta charset="utf-8">
  <link rel="canonical" href="https://example.org/bundles/greeting.hare.html">
  <title>Greeting bundle</title>
</head>
<body>
  <header>
    <h1>Greeting bundle</h1>
    <p>One semantic greeting and its exact text source.</p>
    <p><strong>Trust:</strong> Byte commitments detect changes; they do not establish authority or permission.</p>
  </header>

  <section id="manifest" rdf-graph="#manifest">
    <a hidden href="https://ia2.dev/spec/resource-envelope#Envelope"
      rdf-subject=""
      rdf-predicate="http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
      rdf-graph="#manifest"></a>
    <a hidden href="https://ia2.dev/spec/resource-envelope#HARE-0.1"
      rdf-subject=""
      rdf-predicate="http://purl.org/dc/terms/conformsTo"
      rdf-graph="#manifest"></a>
    <a hidden href="https://ia2.dev/spec/resource-envelope#DeclarativeProfile"
      rdf-subject=""
      rdf-predicate="http://purl.org/dc/terms/conformsTo"
      rdf-graph="#manifest"></a>
    <a hidden href="#manifest"
      rdf-subject=""
      rdf-predicate="https://ia2.dev/spec/resource-envelope#manifestGraph"
      rdf-graph="#manifest"></a>
    <a hidden href="https://greeting-7f3a.hare.invalid/"
      rdf-subject=""
      rdf-predicate="https://ia2.dev/spec/resource-envelope#virtualBase"
      rdf-graph="#manifest"></a>
    <a href="#greeting"
      rdf-subject=""
      rdf-predicate="http://purl.org/dc/terms/hasPart"
      rdf-graph="#manifest">Greeting resource</a>
  </section>

  <!-- Add representation statements and carriers here. -->
</body>
</html>
```

The `rdf-graph` attribute on the section only declares the graph. It does not replace `rdf-graph` on each statement.

## Semantic DOM representation

```html
<a hidden href="#greeting-dom"
  rdf-subject="#greeting"
  rdf-predicate="https://ia2.dev/spec/resource-envelope#representation"
  rdf-graph="#manifest"></a>
<a hidden href="https://ia2.dev/spec/resource-envelope#DOMRepresentation"
  rdf-subject="#greeting-dom"
  rdf-predicate="http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
  rdf-graph="#manifest"></a>
<data hidden value="/hello.html"
  rdf-subject="#greeting-dom"
  rdf-predicate="http://purl.org/dc/terms/identifier"
  rdf-graph="#manifest"></data>
<data hidden value="text/html"
  rdf-subject="#greeting-dom"
  rdf-predicate="http://purl.org/dc/elements/1.1/format"
  rdf-graph="#manifest"></data>
<a hidden href="#greeting-content"
  rdf-subject="#greeting-dom"
  rdf-predicate="https://ia2.dev/spec/resource-envelope#carrier"
  rdf-graph="#manifest"></a>

<template id="greeting-content">
  <article>
    <h1>Hello</h1>
    <p>Welcome, agent.</p>
  </article>
</template>
```

The template fragment is the semantic content. Do not claim its serialization is original or byte-exact.

## Exact byte representation

For the five UTF-8 bytes `hello`, the commitments and carrier are:

```html
<a hidden href="#greeting-bytes"
  rdf-subject="#greeting"
  rdf-predicate="https://ia2.dev/spec/resource-envelope#representation"
  rdf-graph="#manifest"></a>
<a hidden href="https://ia2.dev/spec/resource-envelope#ByteRepresentation"
  rdf-subject="#greeting-bytes"
  rdf-predicate="http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
  rdf-graph="#manifest"></a>
<data hidden value="/hello.txt"
  rdf-subject="#greeting-bytes"
  rdf-predicate="http://purl.org/dc/terms/identifier"
  rdf-graph="#manifest"></data>
<data hidden value="text/plain; charset=utf-8"
  rdf-subject="#greeting-bytes"
  rdf-predicate="http://purl.org/dc/elements/1.1/format"
  rdf-graph="#manifest"></data>
<data hidden value="5"
  rdf-subject="#greeting-bytes"
  rdf-predicate="https://ia2.dev/spec/resource-envelope#byteLength"
  rdf-datatype="http://www.w3.org/2001/XMLSchema#nonNegativeInteger"
  rdf-graph="#manifest"></data>
<data hidden value="sha256-LPJNul+wow4m6DsqxbninhsWHlwfp0JecwQzYpOLmCQ="
  rdf-subject="#greeting-bytes"
  rdf-predicate="https://www.w3.org/2018/credentials#digestSRI"
  rdf-datatype="https://www.w3.org/2018/credentials#sriString"
  rdf-graph="#manifest"></data>
<a hidden href="#greeting-byte-carrier"
  rdf-subject="#greeting-bytes"
  rdf-predicate="https://ia2.dev/spec/resource-envelope#carrier"
  rdf-graph="#manifest"></a>

<script id="greeting-byte-carrier"
  type="application/octet-stream"
  data-encoding="base64">aGVsbG8=</script>
```

Run `scripts/byte-commitment.mjs --base64 <file>` for real content. Commitments must cover the final exact bytes.

## Passive linked subresources

Inside a DOM representation, author ordinary relative URLs such as `../images/mark.svg`. A materializing viewer may resolve them through the virtual URL space only when the destination matches a declared, verified, media-compatible byte representation.

In the host document, keep a virtual reference inert until a viewer verifies it:

```html
<img data-hare-src="/images/mark.svg" alt="Bundled mark">
```

Do not put the `.invalid` URL directly in host `src`; a browser may attempt a network request before the viewer runs.
