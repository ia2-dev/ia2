// Generated from specs/html-rdf/binding-profile/core-0.1.ttl. Do not edit.
pub struct CarrierRule {
    pub element: &'static str,
    pub attribute: &'static str,
    pub kind: &'static str,
    pub operation: &'static str,
}

pub const CARRIER_RULES: &[CarrierRule] = &[
    CarrierRule { element: "a", attribute: "href", kind: "iri", operation: "ResolveRdfIriReference" },
    CarrierRule { element: "area", attribute: "href", kind: "iri", operation: "ResolveRdfIriReference" },
    CarrierRule { element: "audio", attribute: "src", kind: "iri", operation: "ResolveRdfIriReference" },
    CarrierRule { element: "blockquote", attribute: "cite", kind: "iri", operation: "ResolveRdfIriReference" },
    CarrierRule { element: "button", attribute: "formaction", kind: "iri", operation: "ResolveRdfIriReference" },
    CarrierRule { element: "data", attribute: "value", kind: "literal", operation: "ExactAttributeValue" },
    CarrierRule { element: "del", attribute: "cite", kind: "iri", operation: "ResolveRdfIriReference" },
    CarrierRule { element: "embed", attribute: "src", kind: "iri", operation: "ResolveRdfIriReference" },
    CarrierRule { element: "form", attribute: "action", kind: "iri", operation: "ResolveRdfIriReference" },
    CarrierRule { element: "iframe", attribute: "src", kind: "iri", operation: "ResolveRdfIriReference" },
    CarrierRule { element: "img", attribute: "src", kind: "iri", operation: "ResolveRdfIriReference" },
    CarrierRule { element: "input", attribute: "formaction", kind: "iri", operation: "ResolveRdfIriReference" },
    CarrierRule { element: "input", attribute: "src", kind: "iri", operation: "ResolveRdfIriReference" },
    CarrierRule { element: "ins", attribute: "cite", kind: "iri", operation: "ResolveRdfIriReference" },
    CarrierRule { element: "link", attribute: "href", kind: "iri", operation: "ResolveRdfIriReference" },
    CarrierRule { element: "meta", attribute: "content", kind: "literal", operation: "ExactAttributeValue" },
    CarrierRule { element: "object", attribute: "data", kind: "iri", operation: "ResolveRdfIriReference" },
    CarrierRule { element: "q", attribute: "cite", kind: "iri", operation: "ResolveRdfIriReference" },
    CarrierRule { element: "script", attribute: "src", kind: "iri", operation: "ResolveRdfIriReference" },
    CarrierRule { element: "source", attribute: "src", kind: "iri", operation: "ResolveRdfIriReference" },
    CarrierRule { element: "time", attribute: "datetime", kind: "literal", operation: "ExactAttributeValue" },
    CarrierRule { element: "track", attribute: "src", kind: "iri", operation: "ResolveRdfIriReference" },
    CarrierRule { element: "video", attribute: "poster", kind: "iri", operation: "ResolveRdfIriReference" },
    CarrierRule { element: "video", attribute: "src", kind: "iri", operation: "ResolveRdfIriReference" },
];
