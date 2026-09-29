// Generated from specs/html-rdf/binding-profile/core-0.1.ttl. Do not edit.
internal readonly record struct CarrierRule(string Element, string Attribute, string Kind, string Operation);

internal static class CarrierProfile
{
    internal static readonly CarrierRule[] Rules =
    [
        new("a", "href", "iri", "ResolveRdfIriReference"),
        new("area", "href", "iri", "ResolveRdfIriReference"),
        new("audio", "src", "iri", "ResolveRdfIriReference"),
        new("blockquote", "cite", "iri", "ResolveRdfIriReference"),
        new("button", "formaction", "iri", "ResolveRdfIriReference"),
        new("data", "value", "literal", "ExactAttributeValue"),
        new("del", "cite", "iri", "ResolveRdfIriReference"),
        new("embed", "src", "iri", "ResolveRdfIriReference"),
        new("form", "action", "iri", "ResolveRdfIriReference"),
        new("iframe", "src", "iri", "ResolveRdfIriReference"),
        new("img", "src", "iri", "ResolveRdfIriReference"),
        new("input", "formaction", "iri", "ResolveRdfIriReference"),
        new("input", "src", "iri", "ResolveRdfIriReference"),
        new("ins", "cite", "iri", "ResolveRdfIriReference"),
        new("link", "href", "iri", "ResolveRdfIriReference"),
        new("meta", "content", "literal", "ExactAttributeValue"),
        new("object", "data", "iri", "ResolveRdfIriReference"),
        new("q", "cite", "iri", "ResolveRdfIriReference"),
        new("script", "src", "iri", "ResolveRdfIriReference"),
        new("source", "src", "iri", "ResolveRdfIriReference"),
        new("time", "datetime", "literal", "ExactAttributeValue"),
        new("track", "src", "iri", "ResolveRdfIriReference"),
        new("video", "poster", "iri", "ResolveRdfIriReference"),
        new("video", "src", "iri", "ResolveRdfIriReference")
    ];
}
