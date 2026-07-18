export declare const RDFHTML = "https://ia2.dev/spec/rdf-html#";
export declare const HTML_SNAPSHOT_DATE = "2026-07-18";
export declare const HTML_VOCABULARY_IRI = "https://ia2.dev/spec/rdf-html/vocabulary/rdf-html-2026-07-18.ttl";
export declare const HTML_SNAPSHOT_SOURCES: {
    readonly elementIndex: {
        readonly url: "https://html.spec.whatwg.org/multipage/indices.html#elements-3";
        readonly sha256: "0f041a55046de178c6b644a0024d5ac0c0e925d7eaf30a946baa13ff6e61fe1e";
    };
    readonly attributeIndex: {
        readonly url: "https://html.spec.whatwg.org/multipage/indices.html#attributes-3";
        readonly sha256: "0f041a55046de178c6b644a0024d5ac0c0e925d7eaf30a946baa13ff6e61fe1e";
    };
    readonly contentCategoryIndex: {
        readonly url: "https://html.spec.whatwg.org/multipage/indices.html#element-content-categories";
        readonly sha256: "0f041a55046de178c6b644a0024d5ac0c0e925d7eaf30a946baa13ff6e61fe1e";
    };
    readonly syntaxKinds: {
        readonly url: "https://html.spec.whatwg.org/multipage/syntax.html#elements-2";
        readonly sha256: "b71c19de942b28a9a86585fe97fde22e492a5666295a0470149fbd98f187323d";
    };
    readonly webIdl: {
        readonly url: "https://html.spec.whatwg.org/";
        readonly sha256: "5c5869be6ff3dbed33594f78be38dfcdc500b059cc4ff61b51f9dfc561494068";
    };
};
export declare const HTML_SNAPSHOT_SOURCE: "https://html.spec.whatwg.org/multipage/indices.html#elements-3";
export type HtmlElementKind = "normal" | "void" | "template" | "raw-text" | "escapable-raw-text" | "foreign";
export type HtmlContentCategoryName = "metadata" | "flow" | "sectioning" | "heading" | "phrasing" | "embedded" | "interactive" | "form-associated" | "listed" | "submittable" | "resettable" | "autocapitalize-and-autocorrect-inheriting" | "labelable" | "palpable" | "script-supporting";
export interface HtmlCategoryMembership {
    name: HtmlContentCategoryName;
    conditional: boolean;
    source: string;
    conditionId?: string;
    conditionText?: string;
    indexNotation?: string;
    elementIndexNotation?: string;
}
export interface HtmlContentCategoryDefinition {
    classIri: string;
    label: string;
    name: HtmlContentCategoryName;
    source: string;
}
export interface HtmlElementDefinition {
    categories: readonly HtmlCategoryMembership[];
    classIri: string;
    kind: Exclude<HtmlElementKind, "foreign">;
    kindSource: string;
    source: string;
    tagName: string;
}
export interface HtmlAttributeContext {
    id: string;
    global: boolean;
    elements: readonly string[];
    specialParticipants: readonly string[];
    description: string;
    valueSyntaxText: string;
    definitionSources: readonly string[];
    valueSyntaxSources: readonly string[];
    source: string;
}
export interface HtmlAttributeDefinition {
    contexts: readonly HtmlAttributeContext[];
    definitionIri: string;
    idlReflections: readonly {
        idlName: string;
        sources: readonly string[];
    }[];
    localName: string;
    termName: string;
}
export declare const HTML_SYNTAX_KINDS: readonly [{
    readonly name: "void";
    readonly label: "Void elements";
    readonly source: "https://html.spec.whatwg.org/multipage/syntax.html#void-elements";
    readonly elements: readonly ["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"];
}, {
    readonly name: "template";
    readonly label: "The template element";
    readonly source: "https://html.spec.whatwg.org/multipage/syntax.html#the-template-element-2";
    readonly elements: readonly ["template"];
}, {
    readonly name: "raw-text";
    readonly label: "Raw text elements";
    readonly source: "https://html.spec.whatwg.org/multipage/syntax.html#raw-text-elements";
    readonly elements: readonly ["script", "style"];
}, {
    readonly name: "escapable-raw-text";
    readonly label: "Escapable raw text elements";
    readonly source: "https://html.spec.whatwg.org/multipage/syntax.html#escapable-raw-text-elements";
    readonly elements: readonly ["textarea", "title"];
}, {
    readonly name: "foreign";
    readonly label: "Foreign elements";
    readonly source: "https://html.spec.whatwg.org/multipage/syntax.html#foreign-elements";
    readonly namespaces: readonly [{
        readonly label: "MathML";
        readonly source: "https://infra.spec.whatwg.org/#mathml-namespace";
    }, {
        readonly label: "SVG";
        readonly source: "https://infra.spec.whatwg.org/#svg-namespace";
    }];
}, {
    readonly name: "normal";
    readonly label: "Normal elements";
    readonly source: "https://html.spec.whatwg.org/multipage/syntax.html#normal-elements";
}];
export declare const HTML_CONTENT_CATEGORIES: readonly HtmlContentCategoryDefinition[];
export declare const HTML_SPECIAL_CATEGORY_PARTICIPANTS: readonly [{
    readonly id: "autonomous-custom-elements";
    readonly label: "autonomous custom elements";
    readonly source: "https://html.spec.whatwg.org/multipage/custom-elements.html#autonomous-custom-element";
    readonly categories: readonly [{
        readonly name: "flow";
        readonly conditional: false;
        readonly source: "https://html.spec.whatwg.org/multipage/dom.html#flow-content-2";
        readonly elementIndexNotation: "flow";
    }, {
        readonly name: "phrasing";
        readonly conditional: false;
        readonly source: "https://html.spec.whatwg.org/multipage/dom.html#phrasing-content-2";
        readonly elementIndexNotation: "phrasing";
    }, {
        readonly name: "palpable";
        readonly conditional: false;
        readonly source: "https://html.spec.whatwg.org/multipage/dom.html#palpable-content-2";
        readonly elementIndexNotation: "palpable";
    }];
}, {
    readonly id: "form-associated-custom-elements";
    readonly label: "form-associated custom elements";
    readonly source: "https://html.spec.whatwg.org/multipage/custom-elements.html#form-associated-custom-element";
    readonly categories: readonly [{
        readonly name: "form-associated";
        readonly conditional: false;
        readonly source: "https://html.spec.whatwg.org/multipage/forms.html#form-associated-element";
    }, {
        readonly name: "listed";
        readonly conditional: false;
        readonly source: "https://html.spec.whatwg.org/multipage/forms.html#category-listed";
    }, {
        readonly name: "submittable";
        readonly conditional: false;
        readonly source: "https://html.spec.whatwg.org/multipage/forms.html#category-submit";
    }, {
        readonly name: "resettable";
        readonly conditional: false;
        readonly source: "https://html.spec.whatwg.org/multipage/forms.html#category-reset";
    }, {
        readonly name: "labelable";
        readonly conditional: false;
        readonly source: "https://html.spec.whatwg.org/multipage/forms.html#category-label";
    }];
}, {
    readonly id: "mathml-math";
    readonly label: "MathML math";
    readonly source: "https://w3c.github.io/mathml-core/#the-top-level-math-element";
    readonly categories: readonly [{
        readonly name: "flow";
        readonly conditional: false;
        readonly source: "https://html.spec.whatwg.org/multipage/dom.html#flow-content-2";
        readonly elementIndexNotation: "flow";
    }, {
        readonly name: "phrasing";
        readonly conditional: false;
        readonly source: "https://html.spec.whatwg.org/multipage/dom.html#phrasing-content-2";
        readonly elementIndexNotation: "phrasing";
    }, {
        readonly name: "embedded";
        readonly conditional: false;
        readonly source: "https://html.spec.whatwg.org/multipage/dom.html#embedded-content-category";
        readonly elementIndexNotation: "embedded";
    }, {
        readonly name: "palpable";
        readonly conditional: false;
        readonly source: "https://html.spec.whatwg.org/multipage/dom.html#palpable-content-2";
        readonly elementIndexNotation: "palpable";
    }];
}, {
    readonly id: "svg-svg";
    readonly label: "SVG svg";
    readonly source: "https://w3c.github.io/svgwg/svg2-draft/struct.html#elementdef-svg";
    readonly categories: readonly [{
        readonly name: "flow";
        readonly conditional: false;
        readonly source: "https://html.spec.whatwg.org/multipage/dom.html#flow-content-2";
        readonly elementIndexNotation: "flow";
    }, {
        readonly name: "phrasing";
        readonly conditional: false;
        readonly source: "https://html.spec.whatwg.org/multipage/dom.html#phrasing-content-2";
        readonly elementIndexNotation: "phrasing";
    }, {
        readonly name: "embedded";
        readonly conditional: false;
        readonly source: "https://html.spec.whatwg.org/multipage/dom.html#embedded-content-category";
        readonly elementIndexNotation: "embedded";
    }, {
        readonly name: "palpable";
        readonly conditional: false;
        readonly source: "https://html.spec.whatwg.org/multipage/dom.html#palpable-content-2";
        readonly elementIndexNotation: "palpable";
    }];
}, {
    readonly id: "text";
    readonly label: "Text";
    readonly source: "https://html.spec.whatwg.org/multipage/dom.html#text-content";
    readonly categories: readonly [{
        readonly name: "flow";
        readonly conditional: false;
        readonly source: "https://html.spec.whatwg.org/multipage/dom.html#flow-content-2";
    }, {
        readonly name: "phrasing";
        readonly conditional: false;
        readonly source: "https://html.spec.whatwg.org/multipage/dom.html#phrasing-content-2";
    }, {
        readonly name: "palpable";
        readonly conditional: true;
        readonly source: "https://html.spec.whatwg.org/multipage/dom.html#palpable-content-2";
        readonly conditionId: "palpable-text";
        readonly conditionText: "that is not inter-element whitespace";
        readonly indexNotation: "Text that is not inter-element whitespace";
    }];
}];
export declare const HTML_CLASSIFICATION_CROSS_CHECK_EXCEPTIONS: readonly [{
    readonly scope: "category-index-only";
    readonly category: "autocapitalize-and-autocorrect-inheriting";
    readonly reason: "The element table omits this auxiliary forms category from every Categories cell.";
}, {
    readonly scope: "category-index-only-membership";
    readonly element: "hgroup";
    readonly category: "heading";
    readonly reason: "The element table lists only flow and palpable for hgroup.";
}, {
    readonly scope: "category-index-only-membership";
    readonly element: "label";
    readonly category: "form-associated";
    readonly reason: "The compact element table omits this association-only membership.";
}, {
    readonly scope: "category-index-only-membership";
    readonly element: "selectedcontent";
    readonly category: "phrasing";
    readonly reason: "The element table currently lists no categories for selectedcontent.";
}, {
    readonly scope: "element-index-only-conditional";
    readonly element: "object";
    readonly category: "interactive";
    readonly reason: "The element table says interactive* while the dedicated category table omits object; preserve the asterisk without asserting a universal subclass.";
}, {
    readonly scope: "element-index-only-conditional";
    readonly element: "th";
    readonly category: "interactive";
    readonly reason: "The element table says interactive* while the dedicated category table omits th; preserve the asterisk without asserting a universal subclass.";
}];
export declare const HTML_ATTRIBUTE_CROSS_CHECK_EXCEPTIONS: readonly [{
    readonly scope: "attribute-index-only";
    readonly element: "dialog";
    readonly attribute: "closedby";
    readonly reason: "The dedicated attribute index includes closedby while the compact element table currently omits it.";
}, {
    readonly scope: "element-index-only";
    readonly element: "form";
    readonly attribute: "rel";
    readonly reason: "The compact element table includes rel for form while the dedicated attribute index currently omits that context.";
}];
export declare const HTML_ATTRIBUTE_INDEX_EXCLUSION: {
    readonly description: "Event handler content attributes are explicitly excluded from the WHATWG attribute index and remain generic RDF/HTML attributes.";
    readonly source: "https://html.spec.whatwg.org/multipage/indices.html#attributes-3";
};
export declare const HTML_ELEMENTS: readonly HtmlElementDefinition[];
export declare const HTML_ATTRIBUTES: readonly HtmlAttributeDefinition[];
export declare const ELEMENT_BY_CLASS_IRI: Map<string, HtmlElementDefinition>;
export declare const ATTRIBUTE_BY_DEFINITION_IRI: Map<string, HtmlAttributeDefinition>;
export declare const ATTRIBUTE_BY_LOCAL_NAME: Map<string, HtmlAttributeDefinition>;
export declare const VOID_ELEMENTS: Set<string>;
