/* Generated from specs/html-rdf/binding-profile/core-0.1.ttl. Do not edit. */
#ifndef IA2_CARRIER_PROFILE_H
#define IA2_CARRIER_PROFILE_H

typedef struct {
    const char *element;
    const char *attribute;
    const char *kind;
    const char *operation;
} carrier_rule_t;

static const carrier_rule_t CARRIER_RULES[] = {
    {"a", "href", "iri", "ResolveRdfIriReference"},
    {"area", "href", "iri", "ResolveRdfIriReference"},
    {"audio", "src", "iri", "ResolveRdfIriReference"},
    {"blockquote", "cite", "iri", "ResolveRdfIriReference"},
    {"button", "formaction", "iri", "ResolveRdfIriReference"},
    {"data", "value", "literal", "ExactAttributeValue"},
    {"del", "cite", "iri", "ResolveRdfIriReference"},
    {"embed", "src", "iri", "ResolveRdfIriReference"},
    {"form", "action", "iri", "ResolveRdfIriReference"},
    {"iframe", "src", "iri", "ResolveRdfIriReference"},
    {"img", "src", "iri", "ResolveRdfIriReference"},
    {"input", "formaction", "iri", "ResolveRdfIriReference"},
    {"input", "src", "iri", "ResolveRdfIriReference"},
    {"ins", "cite", "iri", "ResolveRdfIriReference"},
    {"link", "href", "iri", "ResolveRdfIriReference"},
    {"meta", "content", "literal", "ExactAttributeValue"},
    {"object", "data", "iri", "ResolveRdfIriReference"},
    {"q", "cite", "iri", "ResolveRdfIriReference"},
    {"script", "src", "iri", "ResolveRdfIriReference"},
    {"source", "src", "iri", "ResolveRdfIriReference"},
    {"time", "datetime", "literal", "ExactAttributeValue"},
    {"track", "src", "iri", "ResolveRdfIriReference"},
    {"video", "poster", "iri", "ResolveRdfIriReference"},
    {"video", "src", "iri", "ResolveRdfIriReference"}
};

#define CARRIER_RULE_COUNT (sizeof(CARRIER_RULES) / sizeof(CARRIER_RULES[0]))

#endif
