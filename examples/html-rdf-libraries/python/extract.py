from __future__ import annotations

import re
import sys
from urllib.parse import urljoin

import html5lib
import httpx
from carrier_profile import CARRIER_RULES

XSD_STRING = "http://www.w3.org/2001/XMLSchema#string"
RDF_DIR_LANG_STRING = "http://www.w3.org/1999/02/22-rdf-syntax-ns#dirLangString"


def local_name(element) -> str:
    return element.tag.rsplit("}", 1)[-1]


# Fetch and parse with the HTML5 tree builder rather than an XML parser.
response = httpx.get(sys.argv[1], follow_redirects=True, timeout=10)
response.raise_for_status()
document = html5lib.parse(
    response.content,
    treebuilder="lxml",
    namespaceHTMLElements=True,
    transport_encoding=response.encoding,
)

# HTML/RDF resolves semantic references against the one canonical source IRI.
canonical = [
    element
    for element in document.xpath("//*[local-name()='head']/*[local-name()='link'][@rel][@href]")
    if "canonical" in element.get("rel", "").lower().split()
]
if len(canonical) != 1:
    raise RuntimeError("Expected one canonical link")
source_iri = urljoin(str(response.url), canonical[0].get("href"))

# XPath provides the same attribute-name discovery query as [rdf-predicate].
rows: list[list[str]] = []
for element in document.xpath("//*[@rdf-predicate]"):
    if any(local_name(parent) == "template" for parent in element.iterancestors()):
        continue
    subject = urljoin(source_iri, element.get("rdf-subject"))
    predicate = urljoin(source_iri, element.get("rdf-predicate"))

    # The generated profile identifies any native attribute that carries the value.
    carriers = [
        rule
        for rule in CARRIER_RULES
        if rule[0] == local_name(element) and element.get(rule[1]) is not None
    ]
    if len(carriers) > 1:
        raise RuntimeError(f"Conflicting value carriers on <{local_name(element)}>")
    carrier = carriers[0] if carriers else None

    # IRI carrier values are references; resolve them against the semantic source.
    if carrier and carrier[2] == "iri":
        object_iri = urljoin(source_iri, element.get(carrier[1]))
        rows.append([subject, predicate, "I", object_iri, "", "", ""])
        continue

    # Literal carriers are exact strings. Other elements use normalized visible text.
    if carrier and carrier[2] == "literal":
        value = element.get(carrier[1])
    else:
        value = re.sub(r"[\t\n\f\r ]+", " ", "".join(element.itertext())).strip()

    # lang and dir apply only when they are directly present on this carrier.
    language = element.get("lang", "")
    direction = element.get("dir", "").lower()
    direction = direction if direction in {"ltr", "rtl"} else ""

    # An explicit datatype wins; direction otherwise selects rdf:dirLangString.
    datatype = RDF_DIR_LANG_STRING if direction else XSD_STRING
    if element.get("rdf-datatype") is not None:
        datatype = urljoin(source_iri, element.get("rdf-datatype"))
    rows.append([subject, predicate, "L", value, datatype, language, direction])

for row in sorted(rows, key=lambda item: item[1]):
    print("\t".join(row))
