// Generated from specs/html-rdf/binding-profile/core-0.1.ttl. Do not edit.
package dev.ia2.example;

import java.util.List;

record CarrierRule(String element, String attribute, String kind, String operation) {}

final class CarrierProfile {
  static final List<CarrierRule> RULES = List.of(
      new CarrierRule("a", "href", "iri", "ResolveRdfIriReference"),
      new CarrierRule("area", "href", "iri", "ResolveRdfIriReference"),
      new CarrierRule("audio", "src", "iri", "ResolveRdfIriReference"),
      new CarrierRule("blockquote", "cite", "iri", "ResolveRdfIriReference"),
      new CarrierRule("button", "formaction", "iri", "ResolveRdfIriReference"),
      new CarrierRule("data", "value", "literal", "ExactAttributeValue"),
      new CarrierRule("del", "cite", "iri", "ResolveRdfIriReference"),
      new CarrierRule("embed", "src", "iri", "ResolveRdfIriReference"),
      new CarrierRule("form", "action", "iri", "ResolveRdfIriReference"),
      new CarrierRule("iframe", "src", "iri", "ResolveRdfIriReference"),
      new CarrierRule("img", "src", "iri", "ResolveRdfIriReference"),
      new CarrierRule("input", "formaction", "iri", "ResolveRdfIriReference"),
      new CarrierRule("input", "src", "iri", "ResolveRdfIriReference"),
      new CarrierRule("ins", "cite", "iri", "ResolveRdfIriReference"),
      new CarrierRule("link", "href", "iri", "ResolveRdfIriReference"),
      new CarrierRule("meta", "content", "literal", "ExactAttributeValue"),
      new CarrierRule("object", "data", "iri", "ResolveRdfIriReference"),
      new CarrierRule("q", "cite", "iri", "ResolveRdfIriReference"),
      new CarrierRule("script", "src", "iri", "ResolveRdfIriReference"),
      new CarrierRule("source", "src", "iri", "ResolveRdfIriReference"),
      new CarrierRule("time", "datetime", "literal", "ExactAttributeValue"),
      new CarrierRule("track", "src", "iri", "ResolveRdfIriReference"),
      new CarrierRule("video", "poster", "iri", "ResolveRdfIriReference"),
      new CarrierRule("video", "src", "iri", "ResolveRdfIriReference")
  );

  private CarrierProfile() {}
}
