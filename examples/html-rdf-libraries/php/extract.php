<?php

require __DIR__ . '/vendor/autoload.php';
$carrierRules = require __DIR__ . '/carrier-profile.php';

use Symfony\Component\HttpClient\HttpClient;

const XSD_STRING = 'http://www.w3.org/2001/XMLSchema#string';
const RDF_DIR_LANG_STRING = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#dirLangString';

function resolve_iri(string $base, string $reference): string {
    if (preg_match('/^[A-Za-z][A-Za-z0-9+.-]*:/', $reference)) {
        return $reference;
    }
    $parts = parse_url($base);
    $port = isset($parts['port']) ? ':' . $parts['port'] : '';
    $origin = $parts['scheme'] . '://' . $parts['host'] . $port;
    if (str_starts_with($reference, '#')) {
        return preg_replace('/#.*$/', '', $base) . $reference;
    }
    if (str_starts_with($reference, '/')) {
        return $origin . $reference;
    }
    $path = $parts['path'] ?? '/';
    return $origin . preg_replace('~/[^/]*$~', '/', $path) . $reference;
}

// Fetch and parse the document with the HTML5 DOM parser in PHP 8.4+.
$response = HttpClient::create(['max_redirects' => 5])->request('GET', $argv[1]);
$html = $response->getContent();
$retrievalIri = $response->getInfo('url');
$document = Dom\HTMLDocument::createFromString($html, LIBXML_NOERROR);

// Resolve semantic references against the one canonical source IRI.
$canonical = [];
foreach ($document->querySelectorAll('head link[rel][href]') as $link) {
    $relTokens = preg_split('/\s+/', strtolower($link->getAttribute('rel')));
    if (in_array('canonical', $relTokens, true)) {
        $canonical[] = $link;
    }
}
if (count($canonical) !== 1) {
    throw new RuntimeException('Expected one canonical link');
}
$sourceIri = resolve_iri($retrievalIri, $canonical[0]->getAttribute('href'));

// A normal attribute selector finds every locally complete carrier.
$rows = [];
foreach ($document->querySelectorAll('[rdf-predicate]') as $element) {
    $insideTemplate = false;
    for ($parent = $element->parentElement; $parent !== null; $parent = $parent->parentElement) {
        if ($parent->localName === 'template') {
            $insideTemplate = true;
            break;
        }
    }
    if ($insideTemplate) {
        continue;
    }
    $subject = resolve_iri($sourceIri, $element->getAttribute('rdf-subject'));
    $predicate = resolve_iri($sourceIri, $element->getAttribute('rdf-predicate'));

    // The generated profile identifies any native attribute carrying the value.
    $valueCarriers = array_values(array_filter(
        $carrierRules,
        fn($rule) => $rule[0] === $element->localName && $element->hasAttribute($rule[1])
    ));
    if (count($valueCarriers) > 1) {
        throw new RuntimeException("Conflicting value carriers on <{$element->localName}>");
    }
    $carrier = $valueCarriers[0] ?? null;

    // IRI carrier values are references; resolve them against the semantic source.
    if ($carrier !== null && $carrier[2] === 'iri') {
        $objectIri = resolve_iri($sourceIri, $element->getAttribute($carrier[1]));
        $rows[] = [$subject, $predicate, 'I', $objectIri, '', '', ''];
        continue;
    }

    // Literal carriers are exact strings. Other elements use normalized visible text.
    if ($carrier !== null && $carrier[2] === 'literal') {
        $value = $element->getAttribute($carrier[1]);
    } else {
        $value = trim(preg_replace('/[\t\n\f\r ]+/', ' ', $element->textContent));
    }

    // lang and dir apply only when directly present on this carrier.
    $language = $element->getAttribute('lang') ?? '';
    $rawDirection = strtolower($element->getAttribute('dir') ?? '');
    $direction = in_array($rawDirection, ['ltr', 'rtl'], true) ? $rawDirection : '';

    // An explicit datatype wins; direction otherwise selects rdf:dirLangString.
    $datatype = $direction !== '' ? RDF_DIR_LANG_STRING : XSD_STRING;
    if ($element->hasAttribute('rdf-datatype')) {
        $datatype = resolve_iri($sourceIri, $element->getAttribute('rdf-datatype'));
    }
    $rows[] = [$subject, $predicate, 'L', $value, $datatype, $language, $direction];
}
usort($rows, fn($left, $right) => $left[1] <=> $right[1]);
foreach ($rows as $row) {
    echo implode("\t", $row) . "\n";
}
