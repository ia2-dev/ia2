# IA² HTML/RDF authoring patterns

Use full IRI references in authored HTML. The compact names below appear only in prose.

## Document identity and visible literals

```html
<!doctype html>
<html lang="en" rdf-version="1.2">
  <head>
    <link rel="canonical" href="https://example.org/people/alice">
    <title>Alice</title>
  </head>
  <body>
    <article id="profile">
      <h1
        rdf-subject=""
        rdf-predicate="https://schema.org/name"
      >Alice</h1>
      <p
        rdf-subject=""
        rdf-predicate="https://schema.org/description"
      >Builds information systems.</p>
    </article>
  </body>
</html>
```

Both statements describe the canonical document IRI. Each carrier is independently queryable and complete.

## IRI object

```html
<a
  href="https://example.org/people/bob"
  rdf-subject="https://example.org/people/alice"
  rdf-predicate="https://schema.org/knows"
>Bob</a>
```

The object is the resolved `href`; the link text is presentation.

## Exact typed literal

```html
<data
  value="01"
  rdf-subject="https://example.org/items/widget"
  rdf-predicate="https://example.org/vocab/count"
  rdf-datatype="http://www.w3.org/2001/XMLSchema#integer"
>1 item</data>
```

The literal lexical form is `01`, independent of the visible label.

## Directional language-tagged literal

```html
<cite
  lang="ar"
  dir="rtl"
  rdf-subject="https://example.org/books/1"
  rdf-predicate="https://schema.org/name"
>تصميم مواقع الويب</cite>
```

Direct `lang` and `dir` produce an RDF 1.2 directional language-tagged string. Ancestor language and direction do not participate.

## Shared blank node

```html
<span
  rdf-object-key="address-1"
  rdf-subject="https://example.org/people/alice"
  rdf-predicate="https://schema.org/address"
></span>
<span
  rdf-subject-key="address-1"
  rdf-predicate="https://schema.org/addressLocality"
>Victoria</span>
```

Use the same local key to correlate occurrences during one extraction. Do not expose the key as a persistent RDF identifier.

## Named graph

```html
<a
  href="https://example.org/people/bob"
  rdf-subject="https://example.org/people/alice"
  rdf-predicate="https://schema.org/knows"
  rdf-graph="https://example.org/graphs/public-profile"
>Bob</a>
```

Repeat `rdf-graph` on every statement in the graph. A container's graph attribute does not scope its descendants.

Declare an empty graph on a non-statement element:

```html
<template rdf-graph="https://example.org/graphs/reserved"></template>
```

## Reified triple term without accidental assertion

```html
<div
  rdf-subject-key="claim-1"
  rdf-predicate="http://www.w3.org/1999/02/22-rdf-syntax-ns#reifies"
>
  <template>
    <a
      href="https://example.org/people/bob"
      rdf-subject="https://example.org/people/alice"
      rdf-predicate="https://schema.org/knows"
    >Bob</a>
  </template>
</div>
<a
  href="https://example.org/sources/interview-7"
  rdf-subject-key="claim-1"
  rdf-predicate="http://www.w3.org/ns/prov#wasDerivedFrom"
>Interview 7</a>
```

The template constructs a triple term; it does not assert that Alice knows Bob. Assert the proposition separately only when intended.
