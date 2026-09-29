// Generated from specs/html-rdf/binding-profile/core-0.1.ttl. Do not edit.
data class CarrierRule(val element: String, val attribute: String, val kind: String, val operation: String)

val carrierRules = listOf(
    CarrierRule("a", "href", "iri", "ResolveRdfIriReference"),
    CarrierRule("area", "href", "iri", "ResolveRdfIriReference"),
    CarrierRule("audio", "src", "iri", "ResolveRdfIriReference"),
    CarrierRule("blockquote", "cite", "iri", "ResolveRdfIriReference"),
    CarrierRule("button", "formaction", "iri", "ResolveRdfIriReference"),
    CarrierRule("data", "value", "literal", "ExactAttributeValue"),
    CarrierRule("del", "cite", "iri", "ResolveRdfIriReference"),
    CarrierRule("embed", "src", "iri", "ResolveRdfIriReference"),
    CarrierRule("form", "action", "iri", "ResolveRdfIriReference"),
    CarrierRule("iframe", "src", "iri", "ResolveRdfIriReference"),
    CarrierRule("img", "src", "iri", "ResolveRdfIriReference"),
    CarrierRule("input", "formaction", "iri", "ResolveRdfIriReference"),
    CarrierRule("input", "src", "iri", "ResolveRdfIriReference"),
    CarrierRule("ins", "cite", "iri", "ResolveRdfIriReference"),
    CarrierRule("link", "href", "iri", "ResolveRdfIriReference"),
    CarrierRule("meta", "content", "literal", "ExactAttributeValue"),
    CarrierRule("object", "data", "iri", "ResolveRdfIriReference"),
    CarrierRule("q", "cite", "iri", "ResolveRdfIriReference"),
    CarrierRule("script", "src", "iri", "ResolveRdfIriReference"),
    CarrierRule("source", "src", "iri", "ResolveRdfIriReference"),
    CarrierRule("time", "datetime", "literal", "ExactAttributeValue"),
    CarrierRule("track", "src", "iri", "ResolveRdfIriReference"),
    CarrierRule("video", "poster", "iri", "ResolveRdfIriReference"),
    CarrierRule("video", "src", "iri", "ResolveRdfIriReference")
)
