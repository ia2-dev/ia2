// Generated from specs/html-rdf/binding-profile/core-0.1.ttl. Do not edit.
typedef CarrierRule = ({String element, String attribute, String kind, String operation});

const carrierRules = <CarrierRule>[
  (element: 'a', attribute: 'href', kind: 'iri', operation: 'ResolveRdfIriReference'),
  (element: 'area', attribute: 'href', kind: 'iri', operation: 'ResolveRdfIriReference'),
  (element: 'audio', attribute: 'src', kind: 'iri', operation: 'ResolveRdfIriReference'),
  (element: 'blockquote', attribute: 'cite', kind: 'iri', operation: 'ResolveRdfIriReference'),
  (element: 'button', attribute: 'formaction', kind: 'iri', operation: 'ResolveRdfIriReference'),
  (element: 'data', attribute: 'value', kind: 'literal', operation: 'ExactAttributeValue'),
  (element: 'del', attribute: 'cite', kind: 'iri', operation: 'ResolveRdfIriReference'),
  (element: 'embed', attribute: 'src', kind: 'iri', operation: 'ResolveRdfIriReference'),
  (element: 'form', attribute: 'action', kind: 'iri', operation: 'ResolveRdfIriReference'),
  (element: 'iframe', attribute: 'src', kind: 'iri', operation: 'ResolveRdfIriReference'),
  (element: 'img', attribute: 'src', kind: 'iri', operation: 'ResolveRdfIriReference'),
  (element: 'input', attribute: 'formaction', kind: 'iri', operation: 'ResolveRdfIriReference'),
  (element: 'input', attribute: 'src', kind: 'iri', operation: 'ResolveRdfIriReference'),
  (element: 'ins', attribute: 'cite', kind: 'iri', operation: 'ResolveRdfIriReference'),
  (element: 'link', attribute: 'href', kind: 'iri', operation: 'ResolveRdfIriReference'),
  (element: 'meta', attribute: 'content', kind: 'literal', operation: 'ExactAttributeValue'),
  (element: 'object', attribute: 'data', kind: 'iri', operation: 'ResolveRdfIriReference'),
  (element: 'q', attribute: 'cite', kind: 'iri', operation: 'ResolveRdfIriReference'),
  (element: 'script', attribute: 'src', kind: 'iri', operation: 'ResolveRdfIriReference'),
  (element: 'source', attribute: 'src', kind: 'iri', operation: 'ResolveRdfIriReference'),
  (element: 'time', attribute: 'datetime', kind: 'literal', operation: 'ExactAttributeValue'),
  (element: 'track', attribute: 'src', kind: 'iri', operation: 'ResolveRdfIriReference'),
  (element: 'video', attribute: 'poster', kind: 'iri', operation: 'ResolveRdfIriReference'),
  (element: 'video', attribute: 'src', kind: 'iri', operation: 'ResolveRdfIriReference')
];
