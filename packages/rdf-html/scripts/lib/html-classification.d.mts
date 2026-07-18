export interface HtmlClassificationMembership {
  name: string;
  conditional: boolean;
  source: string;
  conditionId?: string;
  conditionText?: string;
  indexNotation?: string;
  elementIndexNotation?: string;
}

export interface HtmlClassificationElement {
  name: string;
  source: string;
  kind: "normal" | "void" | "template" | "raw-text" | "escapable-raw-text";
  kindSource: string;
  categories: HtmlClassificationMembership[];
  attributes: Array<{ name: string; notation: string }>;
  specialAttributeNotations: string[];
}

export interface HtmlAttributeContext {
  id: string;
  global: boolean;
  elements: string[];
  specialParticipants: string[];
  description: string;
  valueSyntaxText: string;
  definitionSources: string[];
  valueSyntaxSources: string[];
  source: string;
}

export interface HtmlAttributeDefinition {
  name: string;
  termName: string;
  idlReflections: Array<{ idlName: string; sources: string[] }>;
  contexts: HtmlAttributeContext[];
}

export interface HtmlClassificationCategory {
  label: string;
  name: string;
  className: string;
  source: string;
}

export interface HtmlClassificationParticipant {
  id: string;
  label: string;
  source: string;
  categories: HtmlClassificationMembership[];
}

export interface HtmlSyntaxKind {
  name: "normal" | "void" | "template" | "raw-text" | "escapable-raw-text" | "foreign";
  label: string;
  source: string;
  elements?: string[];
  namespaces?: Array<{ label: string; source: string }>;
}

export interface HtmlClassificationSnapshot {
  schemaVersion: 4;
  snapshotDate: string;
  sources: Record<string, { url: string; sha256: string }>;
  scope: Record<string, string>;
  syntaxKinds: HtmlSyntaxKind[];
  contentCategories: HtmlClassificationCategory[];
  crossCheckExceptions: Array<{ scope: string; category: string; element?: string; reason: string }>;
  attributeCrossCheckExceptions: Array<{ scope: string; attribute: string; element: string; reason: string }>;
  attributeIndexExclusion: { description: string; source: string };
  specialParticipants: HtmlClassificationParticipant[];
  attributes: HtmlAttributeDefinition[];
  elements: HtmlClassificationElement[];
}

export const SOURCE_URLS: Readonly<Record<"elementIndex" | "attributeIndex" | "contentCategoryIndex" | "syntaxKinds" | "webIdl", string>>;
export const CATEGORY_DEFINITIONS: readonly HtmlClassificationCategory[];
export function extractHtmlClassification(input: {
  indicesHtml: string;
  syntaxHtml: string;
  webIdlHtml: string;
  snapshotDate: string;
  sourceDigests: { indices: string; syntax: string; webIdl: string };
}): HtmlClassificationSnapshot;
