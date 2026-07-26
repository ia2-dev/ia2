import { extractDataset } from "./extract.js";
import {
  annotationTargetIris,
  DEFAULT_LABEL_PREDICATES,
  labelFor,
  termLabelMap,
} from "@ia2-dev/html-rdf";
import {
  WINDOW_PLACEMENT_CSS,
  bindScrollSyncControls,
  bindWindowPositionControls,
  isWindowPosition,
  positionControlsMarkup,
  scrollSyncControlsMarkup,
  updateScrollSyncControls,
  type ScrollSyncMode,
  type WindowPosition,
} from "@ia2-dev/ui-primitives";
import {
  detectDiscoveryCandidates,
  mergeDiscoveryContributions,
  type DiscoveryCandidate,
  type DiscoveryContribution,
} from "./discovery.js";
import { highlightedCode } from "./highlight.js";
import {
  XSD_STRING,
  type Diagnostic,
  type ExtractionResult,
  type GraphTerm,
  type ObjectTerm,
  type Quad,
  type SubjectTerm,
} from "./model.js";
import { compactTerm, containsTripleTerms, PREFIXES, serializeJsonLd, serializeTurtle } from "./serialize.js";
import { fromPortableExtractionResult, type NavigatorSource, type PortableNavigatorSource } from "./sources.js";
import {
  extractShaclCatalog,
  type ShaclCatalog,
  type ShaclShape,
} from "./shacl.js";
import {
  extractSuggestedSparqlQueryCatalog,
  type SuggestedSparqlQuery,
} from "./suggested-queries.js";
import type { SparqlExecutionResult, SparqlResultTerm } from "./sparql-engine.js";
import {
  extractDocumentVocabulary,
  type DocumentVocabulary,
  type VocabularyDefinition,
  type VocabularyKind,
} from "./vocabulary.js";

const CSS = String.raw`
  :host {
    --ink: oklch(27% 0.018 286);
    --muted: oklch(52% 0.018 286);
    --paper: oklch(98.4% 0.007 286);
    --layer: oklch(95.5% 0.012 286);
    --line: oklch(86% 0.018 286);
    --accent: oklch(55% 0.17 294);
    --accent-soft: oklch(93% 0.035 294);
    --warning: oklch(64% 0.15 67);
    color: var(--ink);
    font: 400 14px/1.5 -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
    position: fixed;
    z-index: 2147483000;
  }
  *, *::before, *::after { box-sizing: border-box; }
  [hidden] { display: none !important; }
  button { font: inherit; }
  .launcher {
    align-items: center;
    background: var(--ink);
    border: 1px solid color-mix(in oklch, var(--ink), var(--paper) 18%);
    border-radius: 999px;
    bottom: var(--ia2-rdf-launcher-bottom, 20px);
    box-shadow: 0 8px 28px oklch(20% 0.03 286 / 22%);
    color: var(--paper);
    cursor: grab;
    display: flex;
    gap: 9px;
    min-height: 44px;
    padding: 9px 13px 9px 11px;
    position: fixed;
    right: 20px;
    touch-action: none;
    transition: transform 180ms cubic-bezier(.22,1,.36,1), background 180ms ease;
    user-select: none;
  }
  .launcher:hover { background: color-mix(in oklch, var(--ink), var(--accent) 22%); transform: translateY(-2px); }
  .launcher.is-dragging { cursor: grabbing; transform: none; }
  .launcher[data-position^="left"] { left: 20px; right: auto; }
  .launcher:focus-visible, button:focus-visible, a:focus-visible { outline: 3px solid color-mix(in oklch, var(--accent), transparent 35%); outline-offset: 3px; }
  .mark { display: grid; height: 22px; place-items: center; width: 22px; }
  .mark svg { height: 100%; width: 100%; }
  .count { background: var(--accent); border-radius: 999px; color: var(--paper); font-size: 11px; font-variant-numeric: tabular-nums; font-weight: 700; min-width: 20px; padding: 1px 6px; text-align: center; }
  .panel {
    --ia2-window-floating-closed-transform: translateY(14px) scale(.985);
    --ia2-window-floating-left: 24px;
    --ia2-window-floating-open-transform: translateY(0) scale(1);
    --ia2-window-floating-top: 24px;
    --ia2-window-rule: var(--line);
    --ia2-window-transition-duration: 240ms;
    --ia2-window-width: min(760px, 72vw);
    background: var(--paper);
    display: grid;
    grid-template-rows: auto minmax(0, 1fr) auto;
  }
  .panel:focus { outline: none; }
  .toolbar { align-items: center; border-bottom: 1px solid var(--line); display: flex; gap: 8px; min-width: 0; padding: 0 8px 0 12px; }
  .drag-grip { color: var(--muted); display: none; flex: 0 0 30px; height: 36px; place-items: center; touch-action: none; user-select: none; }
  .panel[data-position="floating"] .drag-grip { cursor: grab; display: grid; }
  .panel[data-position="floating"] .tabs { cursor: grab; }
  .panel[data-position="floating"].is-dragging .drag-grip, .panel[data-position="floating"].is-dragging .tabs { cursor: grabbing; }
  .drag-grip svg { fill: currentColor; height: 18px; opacity: .68; width: 10px; }
  .header-actions { align-items: center; display: flex; flex: 0 0 auto; gap: 4px; }
  .position-switch { align-items: center; background: transparent; border: 1px solid transparent; border-radius: 7px; display: inline-flex; flex: 0 0 auto; overflow: hidden; transition: background 140ms ease, border-color 140ms ease; width: auto; }
  .position-switch:hover, .position-switch:focus-within { background: var(--layer); border-color: var(--line); }
  .position-switch:focus-within { border-color: var(--accent); }
  .position-option { align-items: center; background: transparent; border: 0; border-right: 1px solid transparent; color: var(--muted); cursor: pointer; display: inline-flex; flex: 0 0 28px; height: 32px; justify-content: center; opacity: .26; padding: 0; pointer-events: none; transition: background 140ms ease, border-color 140ms ease, color 140ms ease, opacity 110ms ease; visibility: visible; width: 28px; }
  .position-switch:hover .position-option, .position-switch:focus-within .position-option { border-right-color: var(--line); opacity: 1; pointer-events: auto; }
  .position-option:last-child { border-right: 0; }
  .position-option:hover { background: var(--accent-soft); color: var(--accent); }
  .position-option[aria-checked="true"] { background: var(--accent); color: var(--paper); opacity: 1; pointer-events: auto; visibility: visible; }
  .position-option:focus-visible { outline: 2px solid var(--accent); outline-offset: -3px; position: relative; z-index: 1; }
  .position-icon { display: block; fill: none; height: 16px; stroke: currentColor; stroke-linejoin: round; stroke-width: 1.25; width: 20px; }
  .position-region { fill: currentColor; stroke: none; }
  .resize-handles { display: none; }
  .panel[data-position="floating"] .resize-handles { display: contents; }
  .resize-handle { position: absolute; touch-action: none; z-index: 12; }
  .resize-handle[data-resize="n"], .resize-handle[data-resize="s"] { cursor: ns-resize; height: 8px; left: 14px; right: 14px; }
  .resize-handle[data-resize="n"] { top: 0; }
  .resize-handle[data-resize="s"] { bottom: 0; }
  .resize-handle[data-resize="e"], .resize-handle[data-resize="w"] { bottom: 14px; cursor: ew-resize; top: 14px; width: 8px; }
  .resize-handle[data-resize="e"] { right: 0; }
  .resize-handle[data-resize="w"] { left: 0; }
  .resize-handle[data-resize="ne"], .resize-handle[data-resize="nw"], .resize-handle[data-resize="se"], .resize-handle[data-resize="sw"] { height: 18px; width: 18px; }
  .resize-handle[data-resize="ne"] { cursor: nesw-resize; right: 0; top: 0; }
  .resize-handle[data-resize="nw"] { cursor: nwse-resize; left: 0; top: 0; }
  .resize-handle[data-resize="se"] { bottom: 0; cursor: nwse-resize; right: 0; }
  .resize-handle[data-resize="sw"] { bottom: 0; cursor: nesw-resize; left: 0; }
  .resize-handle[data-resize="se"]::after { border-bottom: 2px solid color-mix(in oklch, var(--muted), transparent 24%); border-right: 2px solid color-mix(in oklch, var(--muted), transparent 24%); bottom: 4px; content: ""; height: 6px; position: absolute; right: 4px; width: 6px; }
  .icon-button { align-items: center; background: transparent; border: 0; border-radius: 7px; color: var(--muted); cursor: pointer; display: flex; height: 36px; justify-content: center; padding: 0; width: 36px; }
  .icon-button:hover { background: var(--layer); color: var(--ink); }
  .tabs { align-items: end; align-self: stretch; display: flex; flex: 1 1 auto; gap: 3px; min-width: 0; overflow: hidden; padding: 0; }
  .tab { align-items: center; background: transparent; border: 0; border-bottom: 2px solid transparent; color: var(--muted); cursor: pointer; display: inline-flex; flex: 0 0 auto; font-size: 13px; font-weight: 650; gap: 0; justify-content: center; margin-bottom: -1px; min-width: 0; padding: 12px 10px 10px; white-space: nowrap; }
  .tab:focus-visible { border-radius: 5px 5px 2px 2px; outline: 2px solid color-mix(in oklch, var(--accent), transparent 25%); outline-offset: -4px; }
  .tab[aria-selected="true"] { border-bottom-color: var(--accent); color: var(--ink); }
  .tab-icon { display: none; height: 18px; place-items: center; width: 18px; }
  .tab-icon svg { fill: none; height: 18px; stroke: currentColor; stroke-linecap: round; stroke-linejoin: round; stroke-width: 1.45; width: 18px; }
  .tabs[data-compact="1"] .tab-count, .tabs[data-compact="2"] .tab-count { display: none; }
  .tabs[data-compact="2"] .tab-label { font-size: 0; }
  .tabs[data-compact="2"] .tab-label::after { content: attr(data-short); font-size: 13px; }
  .tabs[data-compact="3"] .tab { min-height: 42px; padding-inline: 9px; }
  .tabs[data-compact="3"] .tab-label, .tabs[data-compact="3"] .tab-count { display: none; }
  .tabs[data-compact="3"] .tab-icon { display: grid; }
  .viewport { min-height: 0; overflow: auto; overscroll-behavior: contain; padding: 18px 22px 28px; }
  .notice { background: var(--accent-soft); border: 1px solid color-mix(in oklch, var(--accent), var(--paper) 68%); border-radius: 8px; color: color-mix(in oklch, var(--ink), var(--accent) 25%); font-size: 12px; margin: 0 0 14px; padding: 9px 11px; }
  .sources-intro { color: var(--muted); font-size: 12px; margin: 0 0 16px; max-width: 66ch; }
  .source-list { border-bottom: 1px solid var(--line); list-style: none; margin: 0; padding: 0; }
  .source-item { border-top: 1px solid var(--line); }
  .source-option { align-items: start; cursor: pointer; display: grid; gap: 10px; grid-template-columns: auto minmax(0, 1fr) auto; padding: 14px 4px; }
  .source-option:hover { background: color-mix(in oklch, var(--accent-soft), transparent 42%); }
  .source-option input { accent-color: var(--accent); margin: 3px 0 0; }
  .source-copy { min-width: 0; }
  .source-title { display: block; font-size: 13px; font-weight: 700; line-height: 1.35; }
  .source-url { color: var(--muted); display: block; font: 11px/1.45 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; margin-top: 3px; overflow-wrap: anywhere; }
  .source-access { color: var(--muted); display: block; font-size: 10.5px; line-height: 1.35; margin-top: 5px; }
  .source-count { color: var(--muted); font-size: 11px; font-variant-numeric: tabular-nums; padding-top: 2px; white-space: nowrap; }
  .discovery-intro { color: var(--muted); font-size: 12px; margin: 0 0 16px; max-width: 66ch; }
  .discovery-list { list-style: none; margin: 0; padding: 0; }
  .discovery-item { border-bottom: 1px solid var(--line); display: grid; gap: 10px; grid-template-columns: minmax(0, 1fr) auto; padding: 15px 0; }
  .discovery-item:first-child { border-top: 1px solid var(--line); }
  .discovery-copy { min-width: 0; }
  .discovery-target { color: var(--accent); display: block; font: 650 12.5px/1.45 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; overflow-wrap: anywhere; text-decoration-color: color-mix(in oklch, currentColor, transparent 55%); text-underline-offset: 3px; }
  .discovery-target:hover { text-decoration-color: currentColor; }
  .discovery-context { color: var(--muted); font: 11px/1.45 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; margin: 4px 0 0; overflow-wrap: anywhere; }
  .discovery-meta { align-items: center; display: flex; flex-wrap: wrap; gap: 5px; margin-top: 8px; }
  .discovery-chip { background: var(--layer); border: 1px solid var(--line); border-radius: 999px; color: var(--muted); font-size: 10.5px; line-height: 1.2; max-width: 100%; overflow: hidden; padding: 4px 7px; text-overflow: ellipsis; white-space: nowrap; }
  .discovery-chip.role { background: var(--accent-soft); border-color: color-mix(in oklch, var(--accent), var(--paper) 72%); color: color-mix(in oklch, var(--accent), var(--ink) 20%); }
  .discovery-state { align-items: flex-end; display: flex; flex-direction: column; gap: 7px; justify-content: center; min-width: 112px; }
  .discovery-status { color: var(--muted); font-size: 10.5px; max-width: 24ch; text-align: right; }
  .discovery-status[data-state="loaded"] { color: oklch(45% 0.12 145); }
  .discovery-status[data-state="error"] { color: var(--warning); }
  .discovery-action { background: var(--accent); border: 1px solid var(--accent); border-radius: 7px; color: var(--paper); cursor: pointer; font-size: 12px; font-weight: 700; min-height: 34px; padding: 6px 11px; }
  .discovery-action:hover { background: color-mix(in oklch, var(--accent), var(--ink) 12%); }
  .discovery-action[data-state="loaded"], .discovery-action[data-state="loading"] { background: transparent; border-color: var(--line); color: var(--muted); }
  .discovery-action[data-state="loaded"]:hover, .discovery-action[data-state="loading"]:hover { background: var(--layer); color: var(--ink); }
  .ontology-intro { color: var(--muted); font-size: 12px; margin: 0 0 18px; max-width: 66ch; }
  .ontology-section + .ontology-section { margin-top: 26px; }
  .ontology-heading { align-items: baseline; border-bottom: 1px solid var(--line); display: flex; gap: 8px; margin: 0; padding: 0 2px 8px; }
  .ontology-heading h3 { font-size: 13px; margin: 0; }
  .ontology-count { color: var(--muted); font-size: 11px; font-variant-numeric: tabular-nums; }
  .ontology-tree, .ontology-children { list-style: none; margin: 0; padding: 0; }
  .ontology-tree { padding-top: 5px; }
  .ontology-children { border-left: 1px solid var(--line); margin-left: 13px; padding-left: 14px; }
  .ontology-node { min-width: 0; }
  .ontology-term-row { align-items: center; border-radius: 7px; display: grid; gap: 8px; grid-template-columns: minmax(0, 1fr) auto; min-width: 0; padding: 7px 5px 7px 7px; }
  .ontology-term-row:hover, .ontology-term-row:focus-within, .ontology-term-row.is-corresponding { background: color-mix(in oklch, var(--accent-soft), transparent 25%); }
  .ontology-term-copy { min-width: 0; }
  .ontology-term-copy code { display: block; font: 600 12px/1.45 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; overflow-wrap: anywhere; }
  .ontology-label { color: var(--ink); font-size: 11.5px; line-height: 1.35; margin-top: 2px; }
  .ontology-meta { color: var(--muted); font-size: 10px; line-height: 1.35; margin-top: 2px; }
  .ontology-context .ontology-term-copy code, .ontology-context .ontology-label { color: var(--muted); font-weight: 500; }
  .ontology-actions { opacity: 0; pointer-events: none; }
  .ontology-term-row:hover .ontology-actions, .ontology-term-row:focus-within .ontology-actions { opacity: 1; pointer-events: auto; }
  .ontology-actions .locate-button { opacity: 1; }
  .shapes-browser { margin: 0 auto; max-width: 920px; }
  .shapes-intro { color: var(--muted); font-size: 12px; margin: 0 0 15px; max-width: 70ch; }
  .shapes-tools { align-items: center; background: color-mix(in oklch, var(--paper), transparent 4%); border-bottom: 1px solid var(--line); display: grid; gap: 10px; grid-template-columns: minmax(180px, 1fr) auto; margin: 0 0 18px; padding: 0 0 12px; position: sticky; top: -18px; z-index: 4; }
  .shapes-search {
    background: var(--layer);
    border: 1px solid var(--line);
    border-radius: 8px;
    color: var(--ink);
    font: inherit;
    height: 36px;
    min-width: 0;
    padding: 6px 10px;
    width: 100%;
  }
  .shapes-search:hover { border-color: color-mix(in oklch, var(--accent), var(--line) 55%); }
  .shapes-search:focus { border-color: var(--accent); outline: 3px solid color-mix(in oklch, var(--accent), transparent 78%); outline-offset: 1px; }
  .shapes-filter-count { color: var(--muted); font-size: 11px; font-variant-numeric: tabular-nums; white-space: nowrap; }
  .shape-group + .shape-group { margin-top: 24px; }
  .shape-group-heading { align-items: baseline; border-bottom: 1px solid var(--line); display: flex; gap: 8px; margin: 0; padding: 0 2px 8px; }
  .shape-group-heading h3 { font-size: 13px; margin: 0; }
  .shape-group-count { color: var(--muted); font-size: 11px; font-variant-numeric: tabular-nums; }
  .shape-list { list-style: none; margin: 0; padding: 0; }
  .shape-row { border-bottom: 1px solid var(--line); }
  .shape-row summary { align-items: start; cursor: pointer; display: grid; gap: 6px 12px; grid-template-columns: minmax(0, 1fr) auto; list-style: none; padding: 12px 5px; }
  .shape-row summary::-webkit-details-marker { display: none; }
  .shape-row summary::after { color: var(--muted); content: "›"; font-size: 20px; line-height: 1; margin-top: 2px; transform: rotate(0); transition: transform 160ms cubic-bezier(.22,1,.36,1); }
  .shape-row[open] summary::after { transform: rotate(90deg); }
  .shape-row summary:hover, .shape-row summary:focus-visible { background: color-mix(in oklch, var(--accent-soft), transparent 34%); }
  .shape-row summary:focus-visible { border-radius: 7px; outline: 2px solid color-mix(in oklch, var(--accent), transparent 25%); outline-offset: -3px; }
  .shape-summary-copy { min-width: 0; }
  .shape-name { display: block; font-size: 13px; font-weight: 700; line-height: 1.35; }
  .shape-identifier { color: var(--muted); display: block; font: 10.5px/1.4 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; margin-top: 2px; overflow-wrap: anywhere; }
  .shape-summary-meta { align-items: center; display: flex; flex-wrap: wrap; gap: 5px; margin-top: 6px; }
  .shape-kind, .shape-stat { border: 1px solid var(--line); border-radius: 999px; color: var(--muted); font-size: 10px; line-height: 1.2; padding: 3px 6px; }
  .shape-kind { background: var(--accent-soft); border-color: color-mix(in oklch, var(--accent), var(--paper) 74%); color: color-mix(in oklch, var(--accent), var(--ink) 22%); }
  .shape-detail { background: color-mix(in oklch, var(--layer), transparent 48%); border-radius: 8px; margin: 0 4px 12px; padding: 14px 15px 16px; }
  .shape-description { color: var(--muted); font-size: 11.5px; margin: 0 0 13px; max-width: 70ch; }
  .shape-actions { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 13px; }
  .shape-locate { align-items: center; background: transparent; border: 1px solid var(--line); border-radius: 7px; color: var(--ink); cursor: pointer; display: inline-flex; font-size: 11px; font-weight: 700; gap: 6px; min-height: 32px; padding: 5px 9px; }
  .shape-locate:hover { background: var(--paper); border-color: color-mix(in oklch, var(--accent), var(--line) 55%); color: var(--accent); }
  .shape-block + .shape-block { margin-top: 13px; }
  .shape-block h4 { color: var(--muted); font-size: 10px; letter-spacing: .045em; margin: 0 0 5px; text-transform: uppercase; }
  .shape-facts { margin: 0; }
  .shape-fact { border-top: 1px solid color-mix(in oklch, var(--line), transparent 22%); display: grid; gap: 8px; grid-template-columns: minmax(105px, .34fr) minmax(0, 1fr); padding: 7px 0; }
  .shape-fact:first-child { border-top: 0; }
  .shape-fact dt { color: var(--muted); font-size: 10.5px; margin: 0; }
  .shape-fact dd { margin: 0; min-width: 0; }
  .shape-value + .shape-value { margin-top: 5px; }
  .shape-value-label { display: block; font-size: 11.5px; font-weight: 650; line-height: 1.35; }
  .shape-value code { color: var(--muted); display: block; font: 10.5px/1.45 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; overflow-wrap: anywhere; }
  .shape-value .term-link { color: var(--accent); }
  .shape-literal { font-size: 11.5px; line-height: 1.45; overflow-wrap: anywhere; }
  .shapes-empty { color: var(--muted); font-size: 12px; margin: 24px 0; text-align: center; }
  .sparql-workbench { display: grid; gap: 15px; margin: 0 auto; max-width: 920px; min-width: 0; }
  .sparql-intro { color: var(--muted); font-size: 12px; margin: 0; max-width: 72ch; }
  .sparql-catalog { display: grid; gap: 6px; min-width: 0; }
  .sparql-label { color: var(--ink); font-size: 12px; font-weight: 700; }
  .sparql-select, .sparql-editor-shell {
    background: var(--layer);
    border: 1px solid var(--line);
    border-radius: 8px;
    box-sizing: border-box;
    color: var(--ink);
    width: 100%;
  }
  .sparql-select { font: inherit; min-height: 38px; padding: 7px 10px; }
  .sparql-editor-shell {
    min-width: 0;
    overflow: hidden;
    position: relative;
  }
  .sparql-highlight, .sparql-editor {
    box-sizing: border-box;
    font: 12.5px/1.55 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    min-height: 230px;
    overflow-wrap: anywhere;
    padding: 13px 14px;
    tab-size: 2;
    white-space: pre-wrap;
    width: 100%;
  }
  .sparql-highlight {
    border: 0;
    inset: 0;
    margin: 0;
    overflow: hidden;
    pointer-events: none;
    position: absolute;
    z-index: 0;
  }
  .sparql-highlight code { font: inherit; }
  .sparql-highlight code::after { content: " "; }
  .sparql-editor {
    -webkit-text-fill-color: transparent;
    background: transparent;
    border: 0;
    caret-color: var(--ink);
    color: transparent;
    display: block;
    overflow-x: hidden;
    position: relative;
    resize: vertical;
    z-index: 1;
  }
  .sparql-editor::selection {
    background: color-mix(in oklch, var(--accent), transparent 72%);
  }
  .sparql-select:hover, .sparql-editor-shell:hover { border-color: color-mix(in oklch, var(--accent), var(--line) 55%); }
  .sparql-select:focus, .sparql-editor-shell:focus-within {
    border-color: var(--accent);
    outline: 3px solid color-mix(in oklch, var(--accent), transparent 78%);
    outline-offset: 1px;
  }
  .sparql-description { color: var(--muted); font-size: 11px; margin: 0; min-height: 1.5em; }
  .sparql-actions { align-items: center; display: flex; flex-wrap: wrap; gap: 9px; }
  .sparql-run, .sparql-reset {
    border: 1px solid var(--accent);
    border-radius: 7px;
    cursor: pointer;
    font-size: 12px;
    font-weight: 700;
    min-height: 36px;
    padding: 7px 13px;
  }
  .sparql-run { background: var(--accent); color: var(--paper); }
  .sparql-run:hover { background: color-mix(in oklch, var(--accent), var(--ink) 12%); }
  .sparql-run:disabled { cursor: wait; opacity: .62; }
  .sparql-reset { background: transparent; border-color: var(--line); color: var(--muted); }
  .sparql-reset:hover { background: var(--layer); color: var(--ink); }
  .sparql-observe {
    align-items: center;
    color: var(--muted);
    display: inline-flex;
    font-size: 11px;
    gap: 6px;
    min-height: 36px;
  }
  .sparql-observe input { accent-color: var(--accent); height: 16px; margin: 0; width: 16px; }
  .sparql-safety { color: var(--muted); flex: 1 1 240px; font-size: 10.5px; margin: 0; text-align: right; }
  .sparql-output { border-top: 1px solid var(--line); min-height: 56px; padding-top: 14px; }
  .sparql-status { color: var(--muted); font-size: 12px; margin: 0; }
  .sparql-status[data-state="error"] {
    background: color-mix(in oklch, var(--warning), transparent 88%);
    border: 1px solid color-mix(in oklch, var(--warning), var(--line) 30%);
    border-radius: 8px;
    color: var(--ink);
    padding: 10px 11px;
  }
  .sparql-summary { color: var(--muted); font-size: 11px; margin: 0 0 8px; }
  .sparql-boolean { color: var(--accent); font: 750 28px/1.2 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; margin: 4px 0; }
  .sparql-table-wrap { border: 1px solid var(--line); border-radius: 8px; overflow: auto; }
  .sparql-table { border-collapse: collapse; font-size: 11.5px; min-width: 100%; text-align: left; }
  .sparql-table th { background: var(--layer); color: var(--muted); font-size: 10px; letter-spacing: .045em; padding: 8px 10px; position: sticky; text-transform: uppercase; top: 0; white-space: nowrap; }
  .sparql-table td { border-top: 1px solid var(--line); max-width: 480px; padding: 8px 10px; vertical-align: top; }
  .sparql-table code, .sparql-table a { color: var(--ink); font: 11.5px/1.5 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; overflow-wrap: anywhere; }
  .sparql-table a { color: var(--accent); text-decoration-color: color-mix(in oklch, currentColor, transparent 60%); text-underline-offset: 2px; }
  .sparql-resource-term { display: block; min-width: 13ch; }
  .sparql-table .sparql-resource-label {
    color: var(--ink);
    font: 650 12px/1.4 -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
  }
  .sparql-table .sparql-resource-label:hover { color: var(--accent); }
  .sparql-literal-value { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif; line-height: 1.5; }
  .sparql-literal-qualifier { color: var(--muted); display: inline-block; font-size: 10.5px; margin-left: 5px; }
  .sparql-unbound { color: var(--muted); }
  .sparql-pagination { align-items: center; display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
  .sparql-page-size-label { align-items: center; color: var(--muted); display: inline-flex; font-size: 11px; gap: 7px; }
  .sparql-page-size {
    background: var(--paper);
    border: 1px solid var(--line);
    border-radius: 7px;
    color: var(--ink);
    font: inherit;
    min-height: 32px;
    padding: 4px 25px 4px 8px;
  }
  .sparql-page-size:hover { border-color: color-mix(in oklch, var(--accent), var(--line) 55%); }
  .sparql-page-size:focus { border-color: var(--accent); outline: 3px solid color-mix(in oklch, var(--accent), transparent 78%); outline-offset: 1px; }
  .sparql-page-status { color: var(--muted); flex: 1 1 auto; font-size: 11px; font-variant-numeric: tabular-nums; margin: 0; min-width: max-content; text-align: right; }
  .sparql-page-button {
    background: transparent;
    border: 1px solid var(--line);
    border-radius: 7px;
    color: var(--ink);
    cursor: pointer;
    font-size: 11px;
    font-weight: 700;
    min-height: 32px;
    padding: 5px 10px;
  }
  .sparql-page-button:hover:not(:disabled) { background: var(--layer); border-color: color-mix(in oklch, var(--accent), var(--line) 55%); }
  .sparql-page-button:disabled { color: var(--muted); cursor: default; opacity: .52; }
  pre { background: var(--layer); border: 1px solid var(--line); border-radius: 10px; color: var(--ink); font: 12.5px/1.65 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; margin: 0; min-height: 100%; overflow: auto; padding: 16px 17px; tab-size: 2; white-space: pre; }
  .tok.iri, .tok.name { color: oklch(49% 0.17 290); }
  .tok.variable { color: oklch(45% 0.13 235); }
  .tok.iri { text-decoration-color: color-mix(in oklch, currentColor, transparent 55%); text-underline-offset: 3px; }
  .tok.string { color: oklch(45% 0.12 145); }
  .tok.key, .tok.keyword { color: oklch(50% 0.15 32); }
  .tok.blank, .tok.number { color: oklch(50% 0.13 235); }
  .tok.comment { color: var(--muted); font-style: italic; }
  .navigator-tools { background: var(--paper); border-bottom: 1px solid var(--line); margin: -18px -22px 4px; padding: 18px 22px 12px; position: sticky; top: -18px; z-index: 5; }
  .navigator-filter { align-items: start; display: grid; gap: 10px; grid-template-columns: minmax(0, 1fr) auto; margin: 0 0 12px; }
  .navigator-search-group { min-width: 0; position: relative; }
  .navigator-search { background: var(--layer); border: 1px solid var(--line); border-radius: 8px; color: var(--ink); font: inherit; height: 36px; min-width: 0; padding: 6px 10px; width: 100%; }
  .navigator-search::placeholder { color: var(--muted); }
  .navigator-search:hover { border-color: color-mix(in oklch, var(--accent), var(--line) 55%); }
  .navigator-search:focus { border-color: var(--accent); outline: 3px solid color-mix(in oklch, var(--accent), transparent 78%); outline-offset: 1px; }
  .typeahead { background: var(--paper); border: 1px solid var(--line); border-radius: 9px; box-shadow: 0 12px 36px oklch(20% 0.03 286 / 20%); left: 0; list-style: none; margin: 5px 0 0; max-height: min(320px, 42vh); overflow: auto; padding: 4px; position: absolute; right: 0; top: 36px; z-index: 9; }
  .typeahead-option { border-radius: 6px; cursor: pointer; display: grid; gap: 2px; min-width: 0; padding: 7px 8px; }
  .typeahead-option[aria-selected="true"] { background: var(--accent-soft); }
  .typeahead-option:hover { background: color-mix(in oklch, var(--accent-soft), var(--paper) 24%); }
  .typeahead-primary { align-items: baseline; display: flex; gap: 7px; min-width: 0; }
  .typeahead-term { color: var(--accent); flex: 0 1 auto; font: 600 11.5px/1.4 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .typeahead-label { color: var(--ink); flex: 1 1 auto; font-size: 12px; font-weight: 650; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .typeahead-meta { color: var(--muted); font-size: 10.5px; line-height: 1.35; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .sync-control { align-items: center; display: inline-flex; gap: 6px; }
  .sync-label { color: var(--muted); font-size: 11px; font-weight: 700; letter-spacing: .04em; text-transform: uppercase; }
  .sync-switch { align-items: stretch; background: var(--layer); border: 1px solid var(--line); border-radius: 8px; display: inline-flex; height: 36px; overflow: hidden; }
  .sync-switch:focus-within { border-color: var(--accent); }
  .sync-option { align-items: center; background: transparent; border: 0; border-right: 1px solid var(--line); color: var(--muted); cursor: pointer; display: inline-flex; justify-content: center; padding: 0; width: 42px; }
  .sync-option:last-child { border-right: 0; }
  .sync-option:hover { background: var(--accent-soft); color: var(--accent); }
  .sync-option[aria-checked="true"] { background: var(--accent); color: var(--paper); }
  .sync-option:focus-visible { outline: 2px solid var(--accent); outline-offset: -3px; position: relative; z-index: 1; }
  .sync-icon { display: block; fill: none; height: 16px; stroke: currentColor; stroke-linecap: round; stroke-linejoin: round; stroke-width: 1.5; width: 32px; }
  .filter-count { color: var(--muted); display: block; font-size: 10px; font-variant-numeric: tabular-nums; line-height: 15px; margin: 2px 2px 0; min-height: 15px; white-space: nowrap; }
  .filter-count:empty { visibility: hidden; }
  .navigator { list-style: none; margin: 0; padding: 0; }
  .vocabularies { margin: 0; padding: 0 2px; position: relative; }
  .vocabularies::before, .vocabularies::after { bottom: 7px; content: ""; opacity: 0; pointer-events: none; position: absolute; top: 23px; transition: opacity 140ms ease; width: 28px; z-index: 2; }
  .vocabularies::before { background: linear-gradient(90deg, var(--paper) 15%, transparent); left: 2px; }
  .vocabularies::after { background: linear-gradient(270deg, var(--paper) 15%, transparent); right: 2px; }
  .vocabularies:not(:hover):not(:focus-within)[data-overflow-left="true"]::before, .vocabularies:not(:hover):not(:focus-within)[data-overflow-right="true"]::after { opacity: 1; }
  .vocabularies-label { color: var(--muted); font-size: 11px; font-weight: 700; letter-spacing: .08em; margin: 0 0 8px; text-transform: uppercase; }
  .vocabulary-links { display: flex; gap: 6px; overflow-x: auto; overflow-y: hidden; overscroll-behavior-inline: contain; padding: 0 0 7px; scrollbar-color: transparent transparent; scrollbar-gutter: stable; scrollbar-width: thin; }
  .vocabulary-links::-webkit-scrollbar { height: 6px; }
  .vocabulary-links::-webkit-scrollbar-track { background: transparent; }
  .vocabulary-links::-webkit-scrollbar-thumb { background: transparent; border-radius: 999px; }
  .vocabularies:hover .vocabulary-links, .vocabularies:focus-within .vocabulary-links { scrollbar-color: color-mix(in oklch, var(--muted), transparent 42%) transparent; }
  .vocabularies:hover .vocabulary-links::-webkit-scrollbar-thumb, .vocabularies:focus-within .vocabulary-links::-webkit-scrollbar-thumb { background: color-mix(in oklch, var(--muted), transparent 42%); }
  .vocabulary-control { align-items: stretch; background: var(--paper); border: 1px solid var(--line); border-radius: 999px; display: inline-flex; flex: 0 0 auto; overflow: hidden; }
  .vocabulary-control:focus-within { border-color: var(--accent); }
  .vocabulary-toggle { align-items: center; background: transparent; border: 0; color: color-mix(in oklch, var(--muted), var(--paper) 20%); cursor: pointer; display: inline-flex; font-size: 12px; font-weight: 650; gap: 6px; opacity: .68; padding: 5px 7px 5px 9px; }
  .vocabulary-toggle[aria-pressed="true"] { background: color-mix(in oklch, var(--accent), var(--paper) 18%); color: var(--paper); opacity: 1; }
  .vocabulary-toggle:hover { background: var(--accent-soft); color: var(--accent); opacity: 1; }
  .vocabulary-toggle[aria-pressed="true"]:hover { background: color-mix(in oklch, var(--accent), var(--ink) 10%); color: var(--paper); }
  .vocabulary-name { max-width: min(300px, 55vw); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .vocabulary-count { align-items: center; background: color-mix(in oklch, currentColor, transparent 84%); border-radius: 999px; display: inline-flex; font-size: 10px; font-variant-numeric: tabular-nums; font-weight: 750; justify-content: center; min-width: 18px; padding: 1px 5px; }
  .vocabulary-link { align-items: center; border-left: 1px solid var(--line); color: var(--muted); display: inline-flex; padding: 5px 7px; text-decoration: none; }
  .vocabulary-link:hover { background: var(--accent-soft); color: var(--accent); }
  .external-mark { color: var(--muted); font-size: 10px; }
  .quad { border-bottom: 1px solid var(--line); contain-intrinsic-size: auto 88px; content-visibility: auto; display: grid; gap: 7px; grid-template-columns: minmax(0, 1fr) auto; padding-block: 13px; padding-inline: calc(2px + var(--rdf-indent, 0px)) 2px; position: relative; }
  .quad.is-corresponding { background: color-mix(in oklch, var(--accent-soft), transparent 30%); border-radius: 7px; }
  .quad:first-child { padding-top: 0; }
  .quad code { display: block; font: 12px/1.55 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; overflow-wrap: anywhere; }
  .quad .graph code { display: inline; }
  .quad .predicate { color: var(--accent); }
  .term-link { color: inherit; text-decoration-color: color-mix(in oklch, currentColor, transparent 55%); text-underline-offset: 3px; }
  .term-link:hover { text-decoration-color: currentColor; }
  .term-link.local-term { text-decoration-style: dotted; }
  .resource-preview { background: var(--paper); border: 1px solid var(--line); border-radius: 10px; box-shadow: 0 18px 64px oklch(20% 0.03 286 / 28%); display: grid; grid-template-rows: 32px minmax(0, 1fr); overflow: hidden; position: fixed; z-index: 20; }
  .resource-preview-bar { align-items: center; background: var(--layer); border-bottom: 1px solid var(--line); cursor: grab; display: flex; gap: 4px; min-width: 0; padding: 0 5px 0 10px; user-select: none; }
  .resource-preview.is-dragging .resource-preview-bar { cursor: grabbing; }
  .resource-preview-url { color: var(--muted); flex: 1 1 auto; font: 11px/1.3 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .resource-preview-action { align-items: center; background: transparent; border: 0; border-radius: 5px; color: var(--muted); cursor: pointer; display: inline-flex; flex: 0 0 24px; font: inherit; font-size: 14px; height: 24px; justify-content: center; line-height: 1; padding: 0; position: relative; text-decoration: none; z-index: 13; }
  .resource-preview-action:hover { background: var(--accent-soft); color: var(--accent); }
  .resource-preview-frame { background: var(--paper); border: 0; display: block; height: 100%; width: 100%; }
  .resource-preview-resize-handles { display: contents; }
  .term-locate-button { margin-left: 6px; opacity: 0; vertical-align: -3px; }
  .quad:hover .term-locate-button, .quad:focus-within .term-locate-button { opacity: 1; }
  .structure-marker { color: color-mix(in oklch, var(--muted), transparent 22%); font: 600 11px/1 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; inset-inline-start: calc(4px + var(--rdf-indent) - 13px); position: absolute; top: 18px; }
  .quad-terms { min-width: 0; }
  .quad-actions { align-items: center; align-self: start; display: flex; flex-wrap: wrap; gap: 5px; justify-content: flex-end; max-width: 230px; min-height: 32px; }
  .preview-actions { align-items: center; display: flex; gap: 3px; opacity: 0; pointer-events: none; transition: opacity 140ms cubic-bezier(.22,1,.36,1); }
  .quad:hover .preview-actions, .quad:focus-within .preview-actions, .quad.source-open .preview-actions { opacity: 1; pointer-events: auto; }
  .row-action-button { align-items: center; background: color-mix(in oklch, var(--accent-soft), var(--paper) 35%); border: 1px solid color-mix(in oklch, var(--accent), var(--paper) 68%); border-radius: 5px; color: color-mix(in oklch, var(--accent), var(--ink) 18%); cursor: pointer; display: inline-flex; height: 22px; justify-content: center; min-width: 26px; padding: 0 5px; }
  .row-action-button:hover { background: var(--accent-soft); border-color: color-mix(in oklch, var(--accent), var(--paper) 38%); color: var(--accent); }
  .source-toggle[aria-expanded="true"] { background: var(--accent); border-color: var(--accent); color: var(--paper); }
  .source-glyph { font: 650 10px/1 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; letter-spacing: -.05em; }
  .locate-glyph { font-size: 14px; line-height: 1; }
  .source-code { grid-column: 1 / -1; min-width: 0; padding-top: 3px; }
  .source-code-label { color: var(--muted); font-size: 11px; font-weight: 700; letter-spacing: .04em; margin: 0 0 6px; text-transform: uppercase; }
  .source-code pre { max-height: 320px; min-height: 0; padding: 12px 14px; white-space: pre-wrap; }
  .tok.punctuation { color: var(--muted); }
  .graph { color: var(--muted); font-size: 11px; margin-top: 2px; }
  .empty { color: var(--muted); margin: 28px auto; max-width: 42ch; text-align: center; }
  .diagnostics { list-style: none; margin: 0; padding: 0; }
  .diagnostic { border-bottom: 1px solid var(--line); padding: 12px 0; }
  .diagnostic strong { color: var(--warning); display: block; font-size: 12px; margin-bottom: 3px; }
  .diagnostic p { margin: 0; }
  .footer { align-items: center; background: var(--layer); border-top: 1px solid var(--line); color: var(--muted); display: flex; font-size: 12px; justify-content: space-between; padding: 10px 18px; }
  .copy { background: transparent; border: 0; color: var(--accent); cursor: pointer; font-size: 12px; font-weight: 700; padding: 4px 5px; }
  .sr-only { height: 1px; margin: -1px; overflow: hidden; padding: 0; position: absolute; width: 1px; clip: rect(0,0,0,0); }
  @media (max-width: 760px) {
    .launcher { bottom: var(--ia2-rdf-launcher-bottom, 14px); right: 14px; }
    .launcher[data-position^="left"] { left: 14px; right: auto; }
    .toolbar { flex-wrap: wrap; padding: 8px 10px 0; }
    .drag-grip { order: 1; }
    .header-actions { margin-left: auto; order: 2; }
    .tabs { flex-basis: 100%; order: 3; }
    .viewport { padding-inline: 16px; }
    .navigator-tools { margin-inline: -16px; padding-inline: 16px; }
    .navigator-search-group { grid-column: 1 / -1; }
    .sync-control { grid-column: 2; justify-self: end; }
    .quad { grid-template-columns: minmax(0, 1fr); }
    .quad-actions { justify-content: flex-start; max-width: none; }
    .shapes-tools { top: -18px; }
    .shape-fact { grid-template-columns: minmax(0, 1fr); gap: 2px; }
    .discovery-item { grid-template-columns: minmax(0, 1fr); }
    .discovery-state { align-items: flex-start; min-width: 0; }
    .discovery-status { text-align: left; }
    .sparql-safety { flex-basis: 100%; text-align: left; }
    .sparql-highlight, .sparql-editor { min-height: 190px; }
    .sparql-pagination { display: grid; grid-template-columns: minmax(0, 1fr) auto; }
    .sparql-page-status { grid-column: 2; grid-row: 1; }
    .sparql-page-button { min-width: 76px; }
    .sparql-page-previous { grid-column: 1; grid-row: 2; justify-self: end; }
    .sparql-page-next { grid-column: 2; grid-row: 2; }
  }
  @media (hover: none) {
    .preview-actions { opacity: 1; pointer-events: auto; }
    .term-locate-button { opacity: 1; }
    .ontology-actions { opacity: 1; pointer-events: auto; }
    .position-switch { background: var(--layer); border-color: var(--line); }
    .position-option { border-right-color: var(--line); opacity: 1; pointer-events: auto; visibility: visible; }
  }
  @media (prefers-color-scheme: dark) {
    :host { --ink: oklch(92% 0.012 286); --muted: oklch(70% 0.018 286); --paper: oklch(20% 0.016 286); --layer: oklch(24% 0.019 286); --line: oklch(34% 0.022 286); --accent: oklch(73% 0.15 294); --accent-soft: oklch(29% 0.05 294); }
    .launcher { background: var(--accent); color: oklch(18% 0.02 286); }
    .tok.iri, .tok.name { color: oklch(77% 0.13 290); }
    .tok.variable { color: oklch(77% 0.1 235); }
    .tok.string { color: oklch(75% 0.11 145); }
    .tok.key, .tok.keyword { color: oklch(75% 0.12 42); }
    .tok.blank, .tok.number { color: oklch(77% 0.1 235); }
  }
  @media (forced-colors: active) {
    .sparql-highlight { display: none; }
    .sparql-editor {
      -webkit-text-fill-color: CanvasText;
      color: CanvasText;
    }
  }
  @media (prefers-reduced-motion: reduce) { .launcher { transition: none; } }
  ${WINDOW_PLACEMENT_CSS}
`;

type View = "turtle" | "json" | "navigator" | "sources" | "vocabulary" | "shapes" | "discovery" | "sparql" | "diagnostics";
type SyncMode = ScrollSyncMode;
export type DrawerPosition = WindowPosition;
type ResizeDirection = "n" | "ne" | "e" | "se" | "s" | "sw" | "w" | "nw";
type ResourcePreviewKind = "definition" | "resource";

const TAB_ICONS: Readonly<Record<View, string>> = {
  navigator: '<svg viewBox="0 0 18 18" aria-hidden="true" focusable="false"><circle cx="3" cy="5" r=".8" fill="currentColor" stroke="none"/><circle cx="3" cy="9" r=".8" fill="currentColor" stroke="none"/><circle cx="3" cy="13" r=".8" fill="currentColor" stroke="none"/><path d="M6 5h9M6 9h9M6 13h9"/></svg>',
  sources: '<svg viewBox="0 0 18 18" aria-hidden="true" focusable="false"><rect x="2.5" y="3" width="13" height="9" rx="1.5"/><path d="M6 15h6M9 12v3"/></svg>',
  vocabulary: '<svg viewBox="0 0 18 18" aria-hidden="true" focusable="false"><circle cx="9" cy="3.5" r="2"/><circle cx="4" cy="14" r="2"/><circle cx="14" cy="14" r="2"/><path d="M9 5.5v3M4 12V9h10v3"/></svg>',
  shapes: '<svg viewBox="0 0 18 18" aria-hidden="true" focusable="false"><path d="M3 3.5h5v5H3zM10 9.5h5v5h-5zM8 6h3v3.5"/><path d="m4.3 11.8 1.3 1.3 2.6-3"/></svg>',
  discovery: '<svg viewBox="0 0 18 18" aria-hidden="true" focusable="false"><circle cx="9" cy="9" r="6.5"/><path d="m11.7 6.3-1.5 3.9-3.9 1.5 1.5-3.9z"/></svg>',
  sparql: '<svg viewBox="0 0 18 18" aria-hidden="true" focusable="false"><path d="M3 4.5h8M3 9h6M3 13.5h5"/><circle cx="13" cy="12" r="3"/><path d="m15.2 14.2 1.5 1.5"/></svg>',
  turtle: '<svg viewBox="0 0 18 18" aria-hidden="true" focusable="false"><path d="m6.5 4.5-4 4.5 4 4.5M11.5 4.5l4 4.5-4 4.5"/></svg>',
  json: '<svg viewBox="0 0 18 18" aria-hidden="true" focusable="false"><path d="M7 3.5H5.5c-1 0-1.5.5-1.5 1.5v2c0 1-.5 1.5-1.5 2 1 .5 1.5 1 1.5 2v2c0 1 .5 1.5 1.5 1.5H7M11 3.5h1.5c1 0 1.5.5 1.5 1.5v2c0 1 .5 1.5 1.5 2-1 .5-1.5 1-1.5 2v2c0 1-.5 1.5-1.5 1.5H11"/></svg>',
  diagnostics: '<svg viewBox="0 0 18 18" aria-hidden="true" focusable="false"><path d="M8 3.2 2.3 13a1.2 1.2 0 0 0 1 1.8h11.4a1.2 1.2 0 0 0 1-1.8L10 3.2a1.15 1.15 0 0 0-2 0Z"/><path d="M9 6.8v3.4M9 13h.01"/></svg>',
};

function tabMarkup(
  view: View,
  selected: boolean,
  label: string,
  shortLabel: string,
  count?: number,
  countNoun?: string,
): string {
  const displayLabel = count === undefined ? label : `${label} (${count})`;
  const title = count === undefined || !countNoun
    ? label
    : `${label}, ${count} ${countNoun}${count === 1 ? "" : "s"}`;
  return `<button class="tab" role="tab" data-view="${view}" aria-selected="${selected}" aria-label="${displayLabel}" title="${title}"><span class="tab-icon" aria-hidden="true">${TAB_ICONS[view]}</span><span class="tab-label" data-short="${shortLabel}">${label}</span>${count === undefined ? "" : `<span class="tab-count"> (${count})</span>`}</button>`;
}

interface FloatingRect {
  height: number;
  width: number;
  x: number;
  y: number;
}

interface LauncherPosition {
  x: number;
  y: number;
}

interface LinkPreviewState {
  abortController: AbortController | null;
  interactionCleanup: (() => void) | null;
  navigationCleanup: (() => void) | null;
}

interface PersistedNavigatorState {
  floatingRect: FloatingRect | null;
  launcherPosition: LauncherPosition | null;
  position: DrawerPosition;
}

interface FocusSnapshot {
  end?: number | null;
  key?: string;
  kind: "close" | "copy" | "discovery-action" | "fallback" | "launcher" | "namespace" | "position" | "refresh" | "search" | "shapes-search" | "source" | "sparql-editor" | "sparql-observe" | "sparql-reset" | "sparql-run" | "sparql-suggestion" | "sync" | "tab" | "viewport";
  start?: number | null;
}

const SESSION_STATE_KEY = "ia2:rdf-navigator:state:v1";
const DEFAULT_SPARQL_QUERY = `SELECT ?subject ?predicate ?object ?graph
WHERE {
  {
    ?subject ?predicate ?object
    BIND("default graph" AS ?graph)
  }
  UNION
  {
    GRAPH ?graph {
      ?subject ?predicate ?object
    }
  }
}
LIMIT 100`;
const DEFAULT_SPARQL_PAGE_SIZE = 25;
const SPARQL_PAGE_SIZES = [10, 25, 50, 100] as const;
const SPARQL_LABEL_PREDICATES = [
  ...DEFAULT_LABEL_PREDICATES,
  "http://www.w3.org/ns/shacl#name",
] as const;
const LAUNCHER_DRAG_THRESHOLD = 4;
const LAUNCHER_EDGE_SNAP_DISTANCE = 28;
const DISCOVERY_MAX_HTML_LENGTH = 2_000_000;
const DISCOVERY_FETCH_TIMEOUT_MS = 10_000;
const DISCOVERY_ACCEPT = "text/html, application/xhtml+xml;q=0.95";
const RESOURCE_PREVIEW_MAX_HTML_LENGTH = 2_000_000;
const RESOURCE_PREVIEW_CACHE_LIMIT = 4;
const RESOURCE_PREVIEW_FETCH_ATTEMPTS = 2;
const RESOURCE_PREVIEW_FETCH_TIMEOUT_MS = 3_000;
const RESOURCE_PREVIEW_FETCHED_SANDBOX = "allow-forms allow-popups allow-popups-to-escape-sandbox allow-scripts";
const RESOURCE_PREVIEW_DIRECT_SANDBOX = `${RESOURCE_PREVIEW_FETCHED_SANDBOX} allow-same-origin`;
const RESOURCE_PREVIEW_DOCUMENT_CACHE = new Map<string, { baseUrl: string; html: string }>();
const HTTPS_PREVIEW_HOSTS = new Set([
  "ontology.inferal.com",
  "purl.archive.org",
  "purl.org",
  "schema.org",
  "www.schema.org",
  "www.w3.org",
]);

const RDF_SCHEMA_SECTIONS: Record<string, string> = {
  Alt: "ch_alt",
  Bag: "ch_bag",
  first: "ch_first",
  HTML: "ch_html",
  JSON: "ch_json",
  langString: "ch_langstring",
  List: "ch_list",
  nil: "ch_nil",
  object: "ch_object",
  predicate: "ch_predicate",
  Property: "ch_property",
  reifies: "ch_reifies",
  rest: "ch_rest",
  Seq: "ch_seq",
  Statement: "ch_statement",
  subject: "ch_subject",
  type: "ch_type",
  value: "ch_value",
  XMLLiteral: "ch_xmlliteral",
};

const RDFS_SCHEMA_SECTIONS: Record<string, string> = {
  Class: "ch_class",
  comment: "ch_comment",
  Container: "ch_container",
  ContainerMembershipProperty: "ch_containermembershipproperty",
  Datatype: "ch_datatype",
  domain: "ch_domain",
  isDefinedBy: "ch_isdefinedby",
  label: "ch_label",
  Literal: "ch_literal",
  member: "ch_member",
  Proposition: "ch_proposition",
  range: "ch_range",
  Resource: "ch_resource",
  seeAlso: "ch_seealso",
  subClassOf: "ch_subclassof",
  subPropertyOf: "ch_subpropertyof",
};

function isFloatingRect(value: unknown): value is FloatingRect {
  if (!value || typeof value !== "object") return false;
  const rect = value as Partial<Record<keyof FloatingRect, unknown>>;
  return typeof rect.height === "number" && Number.isFinite(rect.height) && rect.height > 0
    && typeof rect.width === "number" && Number.isFinite(rect.width) && rect.width > 0
    && typeof rect.x === "number" && Number.isFinite(rect.x)
    && typeof rect.y === "number" && Number.isFinite(rect.y);
}

function isLauncherPosition(value: unknown): value is LauncherPosition {
  if (!value || typeof value !== "object") return false;
  const position = value as Partial<Record<keyof LauncherPosition, unknown>>;
  return typeof position.x === "number" && Number.isFinite(position.x)
    && typeof position.y === "number" && Number.isFinite(position.y);
}

interface NavigatorRow {
  item: HTMLLIElement;
  namespaces: Set<string>;
  quad: Quad;
  searchText: string;
}

interface DiscoveryLoadState {
  controller?: AbortController;
  contribution?: DiscoveryContribution;
  message?: string;
  status: "error" | "loaded" | "loading";
}

interface VocabularyRowBinding {
  item: HTMLElement;
  target: Element;
}

interface SemanticSuggestion {
  display: string;
  domains: string[];
  iri: string;
  kinds: string[];
  label: string;
  localName: string;
  ranges: string[];
  searchText: string;
  statementCount: number;
}

interface SemanticSuggestionBuilder {
  domains: Set<string>;
  iri: string;
  ranges: Set<string>;
  statementCount: number;
  types: Set<string>;
}

const RDF_TYPE_IRI = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type";
const RDFS_DOMAIN_IRI = "http://www.w3.org/2000/01/rdf-schema#domain";
const RDFS_RANGE_IRI = "http://www.w3.org/2000/01/rdf-schema#range";
const TYPEAHEAD_LIMIT = 8;

const TYPE_LABELS: Readonly<Record<string, string>> = {
  "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property": "RDF property",
  "http://www.w3.org/2000/01/rdf-schema#Class": "RDFS class",
  "http://www.w3.org/2002/07/owl#AnnotationProperty": "Annotation property",
  "http://www.w3.org/2002/07/owl#Class": "OWL class",
  "http://www.w3.org/2002/07/owl#DatatypeProperty": "Datatype property",
  "http://www.w3.org/2002/07/owl#ObjectProperty": "Object property",
  "http://www.w3.org/2002/07/owl#Ontology": "OWL ontology",
};

const NON_RENDERED_ELEMENTS = new Set([
  "area",
  "base",
  "head",
  "link",
  "meta",
  "noscript",
  "script",
  "source",
  "style",
  "template",
  "title",
  "track",
]);

function elementLabel(element: Element): string {
  const id = element.id ? `#${element.id}` : "";
  return `<${element.localName}${id}>`;
}

function resourceKey(term: SubjectTerm | ObjectTerm | GraphTerm): string | null {
  return term.termType === "NamedNode" || term.termType === "BlankNode"
    ? `${term.termType}:${term.value}`
    : null;
}

function readableResourceName(term: SubjectTerm): string {
  if (term.termType === "BlankNode") return `Blank node ${term.value}`;
  try {
    const url = new URL(term.value);
    const fragment = decodeURIComponent(url.hash.slice(1));
    if (fragment) return fragment.replaceAll(/[-_]+/g, " ");
    const segment = url.pathname.split("/").filter(Boolean).at(-1);
    return decodeURIComponent(segment ?? term.value).replaceAll(/[-_]+/g, " ");
  } catch {
    return term.value;
  }
}

function shaclPredicateLabel(iri: string): string {
  const localName = iri.startsWith("http://www.w3.org/ns/shacl#")
    ? iri.slice("http://www.w3.org/ns/shacl#".length)
    : compactTerm({ termType: "NamedNode", value: iri });
  return localName
    .replaceAll(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replaceAll(/[-_]+/g, " ")
    .replace(/^./, (character) => character.toUpperCase());
}

function shapeKindLabel(shape: ShaclShape): string {
  if (shape.kinds.length > 1) return "Node + property shape";
  return shape.kinds[0] === "property" ? "Property shape" : "Node shape";
}

function isWebIri(value: string): boolean {
  return /^https?:\/\//i.test(value);
}

function resourcePreviewUrl(value: string): URL {
  const url = new URL(value);
  const rdfTerm = url.hostname === "www.w3.org" && url.pathname === "/1999/02/22-rdf-syntax-ns" ? decodeURIComponent(url.hash.slice(1)) : "";
  if (rdfTerm) {
    return new URL(`https://www.w3.org/TR/rdf12-schema/#${RDF_SCHEMA_SECTIONS[rdfTerm] ?? "rdf-namespace"}`);
  }
  const rdfsTerm = url.hostname === "www.w3.org" && url.pathname === "/2000/01/rdf-schema" ? decodeURIComponent(url.hash.slice(1)) : "";
  if (rdfsTerm) {
    return new URL(`https://www.w3.org/TR/rdf12-schema/#${RDFS_SCHEMA_SECTIONS[rdfsTerm] ?? "rdfs-namespace"}`);
  }
  const dcTerm = url.hostname === "purl.org" ? url.pathname.match(/^\/dc\/terms\/([^/]+)$/) : null;
  if (dcTerm) {
    return new URL(`https://www.dublincore.org/specifications/dublin-core/dcmi-terms/#${encodeURIComponent(dcTerm[1]!)}`);
  }
  if (url.hostname === "purl.org" && url.pathname === "/dc/terms/") {
    return new URL("https://www.dublincore.org/specifications/dublin-core/dcmi-terms/");
  }
  if (url.protocol === "http:" && HTTPS_PREVIEW_HOSTS.has(url.hostname)) url.protocol = "https:";
  return url;
}

function resourcePreviewFetchFirst(url: URL): boolean {
  return (url.hostname === "www.dublincore.org" && url.pathname === "/specifications/dublin-core/dcmi-terms/")
    || (url.hostname === "www.w3.org" && url.pathname.startsWith("/TR/"));
}

function resourcePreviewDocumentKey(url: URL): string {
  const key = new URL(url.href);
  key.hash = "";
  return key.href;
}

function cacheResourcePreviewDocument(key: string, document: { baseUrl: string; html: string }): void {
  RESOURCE_PREVIEW_DOCUMENT_CACHE.delete(key);
  RESOURCE_PREVIEW_DOCUMENT_CACHE.set(key, document);
  while (RESOURCE_PREVIEW_DOCUMENT_CACHE.size > RESOURCE_PREVIEW_CACHE_LIMIT) {
    const oldest = RESOURCE_PREVIEW_DOCUMENT_CACHE.keys().next().value as string | undefined;
    if (!oldest) break;
    RESOURCE_PREVIEW_DOCUMENT_CACHE.delete(oldest);
  }
}

function resourcePreviewStatusDocument(message: string): string {
  return `<!doctype html><meta charset="utf-8"><meta name="color-scheme" content="light dark"><style>
    :root { color: oklch(34% 0.015 286); font: 13px/1.45 ui-sans-serif, system-ui, sans-serif; }
    body { align-items: center; display: flex; justify-content: center; margin: 0; min-height: 100vh; }
    p { color: oklch(54% 0.018 286); margin: 24px; text-align: center; }
  </style><p role="status">${message}</p>`;
}

interface ResourcePreviewFetchResult {
  html: string;
  response: Response;
}

function fetchResourcePreviewDocument(
  view: Window & typeof globalThis,
  url: string,
  requestController: AbortController,
): Promise<ResourcePreviewFetchResult> {
  return new Promise((resolve, reject) => {
    const attemptController = new view.AbortController();
    let settled = false;
    let timeout = 0;
    const finish = (callback: () => void): void => {
      if (settled) return;
      settled = true;
      view.clearTimeout(timeout);
      requestController.signal.removeEventListener("abort", abort);
      callback();
    };
    const abort = (): void => {
      attemptController.abort();
      finish(() => reject(new Error("Resource preview request was cancelled.")));
    };
    requestController.signal.addEventListener("abort", abort, { once: true });
    timeout = view.setTimeout(() => {
      attemptController.abort();
      finish(() => reject(new Error("Resource preview request timed out.")));
    }, RESOURCE_PREVIEW_FETCH_TIMEOUT_MS);
    void view.fetch(url, {
      credentials: "omit",
      redirect: "follow",
      referrerPolicy: "no-referrer",
      signal: attemptController.signal,
    }).then(async (response) => {
      const html = await response.text();
      finish(() => resolve({ html, response }));
    }).catch((error: unknown) => finish(() => reject(error)));
  });
}

function htmlWithDocumentBase(html: string, baseUrl: string, fragment = ""): string {
  const escapedBase = baseUrl.replaceAll("&", "&amp;").replaceAll('"', "&quot;");
  const base = `<base href="${escapedBase}">`;
  const serializedBaseUrl = JSON.stringify(baseUrl).replaceAll("<", "\\u003c");
  const serializedFragment = JSON.stringify(fragment).replaceAll("<", "\\u003c");
  const bridge = `<script data-ia2-preview-bridge>(() => {
    const baseUrl = new URL(${serializedBaseUrl});
    const fragment = ${serializedFragment};
    const revealFragment = () => fragment && document.getElementById(fragment)?.scrollIntoView({ block: "start" });
    if (document.readyState === "loading") addEventListener("DOMContentLoaded", revealFragment, { once: true });
    else revealFragment();
    document.addEventListener("click", (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const target = event.target instanceof Element ? event.target.closest("a[href]") : null;
      if (!target || (target.target && target.target.toLowerCase() !== "_self")) return;
      const next = new URL(target.href, document.baseURI);
      if (!/^https?:$/.test(next.protocol)) return;
      const sameDocumentFragment = next.origin === baseUrl.origin && next.pathname === baseUrl.pathname && next.search === baseUrl.search && next.hash;
      if (sameDocumentFragment) return;
      event.preventDefault();
      parent.postMessage({ type: "ia2-rdf-preview-navigate", href: next.href }, "*");
    }, true);
  })();<\/script>`;
  const injection = `${base}${bridge}`;
  const head = /<head(?:\s[^>]*)?>/i.exec(html);
  if (!head) return `${injection}${html}`;
  const insertion = head.index + head[0].length;
  return `${html.slice(0, insertion)}${injection}${html.slice(insertion)}`;
}

function isLocatableSource(element: Element): boolean {
  const view = element.ownerDocument.defaultView;
  if (!view || !(element instanceof view.HTMLElement) || !element.isConnected) return false;
  if (NON_RENDERED_ELEMENTS.has(element.localName) || element.closest("head, template, [hidden]")) return false;
  if (element.localName === "input" && element.getAttribute("type")?.toLowerCase() === "hidden") return false;
  const style = view.getComputedStyle(element);
  return style.display !== "none" && style.visibility !== "hidden" && style.visibility !== "collapse";
}

function hasSerializableChildren(element: Element): boolean {
  if (element.localName === "template" && "content" in element) {
    return (element as HTMLTemplateElement).content.childNodes.length > 0;
  }
  return element.childNodes.length > 0;
}

function rdfCarrierDepth(element: Element, carriers: ReadonlySet<Element>): number {
  let depth = 0;
  let ancestor = element.parentElement;
  while (ancestor) {
    if (carriers.has(ancestor)) depth += 1;
    ancestor = ancestor.parentElement;
  }
  return depth;
}

function isInPageViewport(element: Element): boolean {
  const view = element.ownerDocument.defaultView;
  if (!view || !isLocatableSource(element)) return false;
  const rect = element.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.right > 0 && rect.top < view.innerHeight && rect.left < view.innerWidth;
}

function termSearchText(term: SubjectTerm | ObjectTerm | GraphTerm): string {
  if (term.termType === "Triple") {
    return [compactTerm(term), termSearchText(term.subject), termSearchText(term.predicate), termSearchText(term.object)].join(" ");
  }
  const metadata = term.termType === "Literal" ? `${term.datatype.value} ${term.language} ${term.direction ?? ""}` : "";
  return `${compactTerm(term)} ${term.value} ${metadata}`;
}

function quadSearchText(quad: Quad): string {
  return [
    termSearchText(quad.subject),
    termSearchText(quad.predicate),
    termSearchText(quad.object),
    quad.graph ? termSearchText(quad.graph) : "",
    elementLabel(quad.source),
  ].join(" ").toLocaleLowerCase();
}

function localDocumentUrl(
  document: Document,
  value: string,
  sourceDocumentIri = document.URL,
  cache?: Map<string, URL | null>,
): URL | null {
  if (cache?.has(value)) return cache.get(value) ?? null;
  let result: URL | null = null;
  try {
    const termUrl = new URL(value);
    const documentUrl = new URL(sourceDocumentIri);
    const termDocument = new URL(termUrl);
    const currentDocument = new URL(documentUrl);
    termDocument.hash = "";
    currentDocument.hash = "";
    result = termDocument.href === currentDocument.href ? termUrl : null;
  } catch {
    result = null;
  }
  cache?.set(value, result);
  return result;
}

function retrievalUrlForSemanticIri(value: string, result: ExtractionResult): string {
  try {
    const termUrl = new URL(value);
    const semanticDocumentUrl = new URL(result.sourceDocumentIri);
    const termDocumentUrl = new URL(termUrl);
    termDocumentUrl.hash = "";
    semanticDocumentUrl.hash = "";
    if (termDocumentUrl.href !== semanticDocumentUrl.href) return termUrl.href;

    const retrievalUrl = new URL(result.retrievalDocumentIri);
    retrievalUrl.hash = termUrl.hash;
    return retrievalUrl.href;
  } catch {
    return value;
  }
}

function navigateLocalDocument(document: Document, url: URL, event: MouseEvent): void {
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  const view = document.defaultView;
  if (!view) return;
  const currentUrl = new URL(document.URL);
  currentUrl.hash = url.hash;
  view.history.pushState(null, "", currentUrl.href);
  const target = url.hash ? locatableElementForUrl(document, url) : document.documentElement;
  target?.scrollIntoView({
    behavior: view.matchMedia?.("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    block: "start",
  });
}

function locatableElementForUrl(document: Document, localUrl: URL): Element | null {
  let target: Element | null = document.documentElement;
  if (localUrl.hash) {
    const encodedId = localUrl.hash.slice(1);
    try {
      target = document.getElementById(decodeURIComponent(encodedId));
    } catch {
      target = document.getElementById(encodedId);
    }
  }
  return target && isLocatableSource(target) ? target : null;
}

function locatableElementForTerm(
  document: Document,
  term: SubjectTerm | ObjectTerm | GraphTerm,
  sourceDocumentIri = document.URL,
  localUrlCache?: Map<string, URL | null>,
  targetCache?: Map<string, Element | null>,
): Element | null {
  if (term.termType !== "NamedNode" || !isWebIri(term.value)) return null;
  if (targetCache?.has(term.value)) return targetCache.get(term.value) ?? null;
  const localUrl = localDocumentUrl(document, term.value, sourceDocumentIri, localUrlCache);
  const target = localUrl ? locatableElementForUrl(document, localUrl) : null;
  targetCache?.set(term.value, target);
  return target;
}

function definitionTarget(
  document: Document,
  definition: VocabularyDefinition,
  sourceDocumentIri: string,
): Element | null {
  const termTarget = locatableElementForTerm(document, definition.term, sourceDocumentIri);
  if (termTarget) return termTarget;
  for (const source of definition.sources) {
    const identifiedContainer = source.closest("[id]");
    if (identifiedContainer && isLocatableSource(identifiedContainer)) return identifiedContainer;
    if (isLocatableSource(source)) return source;
  }
  return null;
}

function locateButton(
  document: Document,
  target: Element,
  className: string,
  onLocate: (target: Element) => void,
  delegatedTargets?: WeakMap<HTMLElement, Element>,
): HTMLButtonElement {
  const button = document.createElement("button");
  button.className = `row-action-button locate-button locate-glyph ${className}`;
  button.type = "button";
  button.setAttribute("aria-label", `Locate ${elementLabel(target)}`);
  button.title = button.getAttribute("aria-label")!;
  button.textContent = "⌖";
  if (delegatedTargets) delegatedTargets.set(button, target);
  else button.addEventListener("click", () => onLocate(target));
  return button;
}

function termCode(
  document: Document,
  term: SubjectTerm | ObjectTerm | GraphTerm,
  prefix = "",
  className = "",
  onLocate?: (target: Element) => void,
  sourceDocumentIri = document.URL,
  localUrlCache?: Map<string, URL | null>,
  targetCache?: Map<string, Element | null>,
  delegatedLocalLinks?: WeakMap<HTMLAnchorElement, URL>,
  delegatedLocateTargets?: WeakMap<HTMLElement, Element>,
): HTMLElement {
  const code = document.createElement("code");
  if (className) code.className = className;
  if (prefix) code.append(document.createTextNode(prefix));
  const label = compactTerm(term);
  if (term.termType !== "NamedNode" || !isWebIri(term.value)) {
    code.append(document.createTextNode(label));
    return code;
  }
  const anchor = document.createElement("a");
  anchor.className = "term-link";
  anchor.href = term.value;
  const localUrl = localDocumentUrl(document, term.value, sourceDocumentIri, localUrlCache);
  if (localUrl) {
    anchor.classList.add("local-term");
    anchor.title = localUrl.hash ? `Scroll to ${localUrl.hash} in this document` : "Scroll to the start of this document";
    if (delegatedLocalLinks) delegatedLocalLinks.set(anchor, localUrl);
    else anchor.addEventListener("click", (event) => navigateLocalDocument(document, localUrl, event));
  } else {
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    anchor.title = `Open ${term.value} in a new tab`;
  }
  anchor.textContent = label;
  code.append(anchor);
  const target = locatableElementForTerm(document, term, sourceDocumentIri, localUrlCache, targetCache);
  if (target && onLocate) {
    code.append(locateButton(document, target, "term-locate-button", onLocate, delegatedLocateTargets));
  }
  return code;
}

interface VocabularyLink {
  label: string;
  namespace: string;
}

interface VocabularyUsage extends VocabularyLink {
  count: number;
}

function namespaceFor(iri: string): VocabularyLink | null {
  for (const [label, namespace] of Object.entries(PREFIXES)) {
    if (iri.startsWith(namespace)) return { label, namespace };
  }
  if (!isWebIri(iri)) return null;
  const hash = iri.lastIndexOf("#");
  const slash = iri.lastIndexOf("/");
  const boundary = Math.max(hash, slash);
  if (boundary < 8) return null;
  const namespace = iri.slice(0, boundary + 1);
  try {
    const url = new URL(namespace);
    const path = url.pathname.replace(/\/$/, "");
    const suffix = namespace.endsWith("#") ? "#" : "";
    return { label: `${url.host}${path}${suffix}`, namespace };
  } catch {
    return null;
  }
}

function termIris(term: SubjectTerm | ObjectTerm | GraphTerm): string[] {
  if (term.termType === "NamedNode") return [term.value];
  if (term.termType === "BlankNode") return [];
  if (term.termType === "Literal") return compactTerm(term).includes("^^") ? [term.datatype.value] : [];
  return [...termIris(term.subject), ...termIris(term.predicate), ...termIris(term.object)];
}

function compactIri(iri: string): string {
  return compactTerm({ termType: "NamedNode", value: iri });
}

function localNameForIri(iri: string): string {
  const trimmed = iri.replace(/[\/#]+$/, "");
  const boundary = Math.max(trimmed.lastIndexOf("#"), trimmed.lastIndexOf("/"));
  const local = boundary >= 0 ? trimmed.slice(boundary + 1) : trimmed;
  try {
    return decodeURIComponent(local);
  } catch {
    return local;
  }
}

function readableLabelForIri(iri: string): string {
  const localName = localNameForIri(iri);
  const words = localName
    .replace(/\.[A-Za-z0-9]+$/u, "")
    .replace(/([\p{Ll}\d])(\p{Lu})/gu, "$1 $2")
    .replace(/[_-]+/gu, " ")
    .replace(/\s+/gu, " ")
    .trim();
  if (!words) return compactIri(iri);
  return `${words.charAt(0).toLocaleUpperCase()}${words.slice(1)}`;
}

function sparqlTermSignature(
  term: SparqlResultTerm | undefined,
  labels: ReadonlyMap<string, string>,
): string {
  if (!term) return "unbound";
  const label = term.termType === "NamedNode" || term.termType === "BlankNode"
    ? labels.get(`${term.termType}:${term.value}`) ?? ""
    : "";
  return JSON.stringify([
    term.termType,
    term.value,
    term.datatype ?? "",
    term.language ?? "",
    term.direction ?? "",
    label,
  ]);
}

function sparqlPresentationSignature(
  result: SparqlExecutionResult,
  labels: ReadonlyMap<string, string>,
): string {
  if (result.kind === "ask") return `ask:${String(result.value)}`;
  if (result.kind === "quads") {
    const quads = result.quads.map((quad) => JSON.stringify([
      sparqlTermSignature(quad.subject, labels),
      sparqlTermSignature(quad.predicate, labels),
      sparqlTermSignature(quad.object, labels),
      sparqlTermSignature(quad.graph, labels),
    ])).sort();
    return JSON.stringify(["quads", quads]);
  }
  const rows = result.rows.map((row) => JSON.stringify(
    result.variables.map((variable) => sparqlTermSignature(row[variable], labels)),
  )).sort();
  return JSON.stringify(["bindings", result.variables, rows]);
}

function semanticSuggestionsIn(result: ExtractionResult): SemanticSuggestion[] {
  const builders = new Map<string, SemanticSuggestionBuilder>();
  const ensure = (iri: string): SemanticSuggestionBuilder => {
    const existing = builders.get(iri);
    if (existing) return existing;
    const created: SemanticSuggestionBuilder = {
      domains: new Set(),
      iri,
      ranges: new Set(),
      statementCount: 0,
      types: new Set(),
    };
    builders.set(iri, created);
    return created;
  };

  for (const quad of result.quads) {
    const iris = new Set([
      ...termIris(quad.subject),
      ...termIris(quad.predicate),
      ...termIris(quad.object),
      ...(quad.graph ? termIris(quad.graph) : []),
    ]);
    for (const iri of iris) ensure(iri).statementCount += 1;
    if (quad.subject.termType !== "NamedNode") continue;
    const subject = ensure(quad.subject.value);
    if (quad.predicate.value === RDF_TYPE_IRI && quad.object.termType === "NamedNode") subject.types.add(quad.object.value);
    if (quad.predicate.value === RDFS_DOMAIN_IRI) subject.domains.add(compactTerm(quad.object));
    if (quad.predicate.value === RDFS_RANGE_IRI) subject.ranges.add(compactTerm(quad.object));
  }

  return Array.from(builders.values()).map((builder) => {
    const display = compactIri(builder.iri);
    const localName = localNameForIri(builder.iri);
    const label = labelFor(result.quads, builder.iri) ?? "";
    const kinds = Array.from(builder.types, (type) => TYPE_LABELS[type] ?? `type ${compactIri(type)}`).sort();
    const domains = Array.from(builder.domains).sort();
    const ranges = Array.from(builder.ranges).sort();
    const searchText = [
      display,
      builder.iri,
      localName,
      label,
      ...kinds,
      ...domains.flatMap((domain) => ["domain", domain, `domain ${domain}`]),
      ...ranges.flatMap((range) => ["range", range, `range ${range}`]),
    ].join(" ").toLocaleLowerCase();
    return {
      display,
      domains,
      iri: builder.iri,
      kinds,
      label,
      localName,
      ranges,
      searchText,
      statementCount: builder.statementCount,
    };
  });
}

function matchingSemanticSuggestions(
  suggestions: SemanticSuggestion[],
  value: string,
  limit = TYPEAHEAD_LIMIT,
): SemanticSuggestion[] {
  const query = value.trim().toLocaleLowerCase();
  if (!query) return [];
  const tokens = query.split(/\s+/).filter(Boolean);
  return suggestions
    .map((suggestion) => {
      if (!tokens.every((token) => suggestion.searchText.includes(token))) return null;
      const primary = [suggestion.display, suggestion.localName, suggestion.label].join(" ").toLocaleLowerCase();
      let score = 60;
      if ([suggestion.display, suggestion.localName, suggestion.label].some((field) => field.toLocaleLowerCase() === query)) score = 0;
      else if ([suggestion.display, suggestion.localName, suggestion.label].some((field) => field.toLocaleLowerCase().startsWith(query))) score = 10;
      else if (primary.includes(query)) score = 20;
      else if (tokens.every((token) => primary.includes(token))) score = 35;
      return { score: score - Math.min(suggestion.statementCount, 20) / 100, suggestion };
    })
    .filter((entry): entry is { score: number; suggestion: SemanticSuggestion } => entry !== null)
    .sort((a, b) => a.score - b.score || a.suggestion.display.localeCompare(b.suggestion.display))
    .slice(0, limit)
    .map(({ suggestion }) => suggestion);
}

function semanticSuggestionDetails(suggestion: SemanticSuggestion): string[] {
  const details = [
    ...suggestion.kinds,
    ...suggestion.domains.map((domain) => `domain ${domain}`),
    ...suggestion.ranges.map((range) => `range ${range}`),
  ];
  const count = `${suggestion.statementCount} statement${suggestion.statementCount === 1 ? "" : "s"}`;
  return [...details, count];
}

function namespacesInQuad(quad: Quad): VocabularyLink[] {
  const iris = [
    ...termIris(quad.subject),
    ...termIris(quad.predicate),
    ...termIris(quad.object),
    ...(quad.graph ? termIris(quad.graph) : []),
  ];
  const found = new Map<string, VocabularyLink>();
  for (const iri of iris) {
    const vocabulary = namespaceFor(iri);
    if (vocabulary) found.set(vocabulary.namespace, vocabulary);
  }
  return Array.from(found.values());
}

function vocabulariesIn(result: ExtractionResult): VocabularyUsage[] {
  const found = new Map<string, VocabularyUsage>();
  for (const quad of result.quads) {
    for (const vocabulary of namespacesInQuad(quad)) {
      const existing = found.get(vocabulary.namespace);
      if (existing) existing.count += 1;
      else found.set(vocabulary.namespace, { ...vocabulary, count: 1 });
    }
  }
  return Array.from(found.values()).sort((a, b) => a.label.localeCompare(b.label));
}

const NATIVE_RDF_VALUE_ATTRIBUTES = new Set(["content", "datetime", "dir", "href", "lang", "src", "value"]);
const RDF_ELEMENT_SELECTOR = "[rdf-predicate], [rdf-graph], [rdf-graph-key], base[href], link[rel]";

function mutationAffectsExtraction(record: MutationRecord): boolean {
  if (record.type === "characterData") {
    return record.target.parentElement?.closest("[rdf-predicate]") !== null;
  }
  if (record.type === "attributes") {
    const element = record.target instanceof Element ? record.target : null;
    const name = record.attributeName ?? "";
    if (!element) return false;
    if (name.startsWith("rdf-")) return true;
    if (element.localName === "base" && name === "href") return true;
    if (element.localName === "link" && (name === "href" || name === "rel")) return true;
    if (!element.hasAttribute("rdf-predicate")) return false;
    return name === "id" || NATIVE_RDF_VALUE_ATTRIBUTES.has(name);
  }
  const target = record.target instanceof Element ? record.target : null;
  if (target?.closest("[rdf-predicate]")) return true;
  return [...record.addedNodes, ...record.removedNodes].some((node) => {
    if (!(node instanceof Element)) return false;
    return node.matches(RDF_ELEMENT_SELECTOR) || node.querySelector(RDF_ELEMENT_SELECTOR) !== null;
  });
}

function retrievalIriForCandidate(targetIri: string, source: ExtractionResult): string {
  const target = new URL(targetIri);
  const canonicalSource = new URL(source.sourceDocumentIri);
  const retrievalSource = new URL(source.retrievalDocumentIri);
  if (target.origin !== canonicalSource.origin || canonicalSource.origin === retrievalSource.origin) return target.href;
  return new URL(`${target.pathname}${target.search}${target.hash}`, retrievalSource.origin).href;
}

function prepareRetrievedDocument(document: Document, retrievalIri: string): void {
  try {
    Object.defineProperty(document, "URL", { configurable: true, value: retrievalIri });
  } catch {
    // Some DOM implementations expose URL as a non-configurable property.
  }
  const base = document.head?.querySelector<HTMLBaseElement>("base[href]");
  if (base) base.href = new URL(base.getAttribute("href") ?? "", retrievalIri).href;
  document.head?.querySelectorAll<HTMLLinkElement>('link[rel~="canonical"][href]').forEach((link) => {
    link.href = new URL(link.getAttribute("href") ?? "", retrievalIri).href;
  });
}

function discoveryErrorMessage(error: unknown): string {
  if (error instanceof DOMException && error.name === "AbortError") return "Retrieval timed out.";
  if (error instanceof TypeError) return "Retrieval was blocked by CORS or network policy.";
  if (error instanceof Error) return error.message;
  return "The contribution could not be loaded.";
}

export class Ia2RdfNavigator extends HTMLElement {
  #result: ExtractionResult | null = null;
  #sourceResult: ExtractionResult | null = null;
  #topSourceResult: ExtractionResult | null = null;
  #directFrameSources: NavigatorSource[] = [];
  #externalSources: NavigatorSource[] = [];
  #sources: NavigatorSource[] = [];
  #selectedSourceId = "top-document";
  #frameSourceIds = new WeakMap<Element, string>();
  #nextFrameSourceId = 1;
  #discoveryCandidates: DiscoveryCandidate[] = [];
  #discoveryLoads = new Map<string, DiscoveryLoadState>();
  #documentVocabulary: DocumentVocabulary = { classes: [], count: 0, definitions: [], properties: [] };
  #shaclCatalog: ShaclCatalog = { count: 0, groups: [], shapes: [] };
  #view: View = "navigator";
  #open = false;
  #status = "";
  #navigatorQuery = "";
  #shapesQuery = "";
  #sparqlSuggestions: SuggestedSparqlQuery[] = [];
  #sparqlSuggestionDiagnostics: string[] = [];
  #selectedSparqlSuggestionId = "";
  #sparqlQuery = DEFAULT_SPARQL_QUERY;
  #sparqlExecution: { error?: string; result?: SparqlExecutionResult; status: "idle" | "running" | "success" | "error" } = { status: "idle" };
  #sparqlObserveChanges = true;
  #sparqlPresentationSignature = "";
  #sparqlResourceLabels = new Map<string, string>();
  #sparqlPage = 0;
  #sparqlPageSize = DEFAULT_SPARQL_PAGE_SIZE;
  #sparqlRunId = 0;
  #disabledNamespaces = new Set<string>();
  #syncMode: SyncMode = "off";
  #position: DrawerPosition = "right";
  #floatingRect: FloatingRect | null = null;
  #floatingInteractionCleanup: (() => void) | null = null;
  #launcherPosition: LauncherPosition | null = null;
  #launcherInteractionCleanup: (() => void) | null = null;
  #suppressLauncherClick = false;
  #linkPreviews = new Map<HTMLElement, LinkPreviewState>();
  #activeLinkPreview: HTMLElement | null = null;
  #sparqlLinkPreview: HTMLElement | null = null;
  #linkPreviewZIndex = 20;
  #locateAnimation: Animation | null = null;
  #syncCleanup: (() => void) | null = null;
  #resetSyncControl: (() => void) | null = null;
  #vocabularyTreeCleanup: (() => void) | null = null;
  #vocabularyResizeObserver: ResizeObserver | null = null;
  #tabResizeObserver: ResizeObserver | null = null;
  #observer: MutationObserver | null = null;
  #refreshTimer: number | null = null;
  #navigatorRows: NavigatorRow[] = [];
  #contentRendered = false;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback(): void {
    this.#restoreSessionState();
    this.refresh();
    this.addEventListener("keydown", this.#onKeydown);
    this.addEventListener("keyup", this.#onKeyup);
    this.ownerDocument.defaultView?.addEventListener("resize", this.#onWindowResize, { passive: true });
    this.#observeDocument();
  }

  disconnectedCallback(): void {
    this.removeEventListener("keydown", this.#onKeydown);
    this.removeEventListener("keyup", this.#onKeyup);
    this.ownerDocument.defaultView?.removeEventListener("resize", this.#onWindowResize);
    this.#observer?.disconnect();
    this.#observer = null;
    for (const state of this.#discoveryLoads.values()) state.controller?.abort();
    this.#discoveryLoads.clear();
    this.#vocabularyResizeObserver?.disconnect();
    this.#vocabularyResizeObserver = null;
    this.#tabResizeObserver?.disconnect();
    this.#tabResizeObserver = null;
    if (this.#refreshTimer !== null) window.clearTimeout(this.#refreshTimer);
    this.#stopFloatingInteraction();
    this.#stopLauncherInteraction();
    this.#clearLinkPreviews();
    this.#clearLocateEmphasis();
    this.#clearNavigatorSync();
    this.#clearVocabularyTreeInteractions();
  }

  #clearNavigatorSync(): void {
    this.#syncCleanup?.();
    this.#syncCleanup = null;
  }

  #turnOffNavigatorSync(): void {
    if (this.#resetSyncControl) {
      this.#resetSyncControl();
      return;
    }
    this.#syncMode = "off";
    this.#clearNavigatorSync();
  }

  #clearVocabularyTreeInteractions(): void {
    this.#vocabularyTreeCleanup?.();
    this.#vocabularyTreeCleanup = null;
  }

  #configureTabCompaction(tabs: HTMLElement | null): void {
    this.#tabResizeObserver?.disconnect();
    this.#tabResizeObserver = null;
    if (!tabs) return;
    const update = (): void => {
      tabs.dataset.compact = "0";
      if (tabs.clientWidth <= 0) return;
      for (let level = 0; level <= 3; level += 1) {
        tabs.dataset.compact = String(level);
        if (tabs.scrollWidth <= tabs.clientWidth + 1) return;
      }
    };
    update();
    const ResizeObserverConstructor = this.ownerDocument.defaultView?.ResizeObserver;
    if (!ResizeObserverConstructor) return;
    this.#tabResizeObserver = new ResizeObserverConstructor(update);
    this.#tabResizeObserver.observe(tabs);
  }

  #activateLinkPreview(preview: HTMLElement): void {
    if (!this.#linkPreviews.has(preview)) return;
    this.#activeLinkPreview = preview;
    preview.style.zIndex = String(++this.#linkPreviewZIndex);
  }

  #clearLinkPreview(preview: HTMLElement): void {
    const state = this.#linkPreviews.get(preview);
    if (!state) return;
    state.abortController?.abort();
    state.interactionCleanup?.();
    state.navigationCleanup?.();
    preview.remove();
    this.#linkPreviews.delete(preview);
    if (this.#sparqlLinkPreview === preview) this.#sparqlLinkPreview = null;
    if (this.#activeLinkPreview !== preview) return;
    const remaining = Array.from(this.#linkPreviews.keys()).at(-1) ?? null;
    this.#activeLinkPreview = null;
    if (remaining) this.#activateLinkPreview(remaining);
  }

  #clearLinkPreviews(): void {
    for (const preview of Array.from(this.#linkPreviews.keys())) this.#clearLinkPreview(preview);
    this.#activeLinkPreview = null;
    this.#linkPreviewZIndex = 20;
  }

  #linkPreviewRect(preview: HTMLElement): FloatingRect {
    const rect = preview.getBoundingClientRect();
    return {
      height: Number.parseFloat(preview.style.height) || rect.height,
      width: Number.parseFloat(preview.style.width) || rect.width,
      x: Number.parseFloat(preview.style.left) || rect.left,
      y: Number.parseFloat(preview.style.top) || rect.top,
    };
  }

  #applyLinkPreviewGeometry(preview: HTMLElement, rect: FloatingRect): void {
    const constrained = this.#constrainFloatingRect(rect);
    preview.style.height = `${constrained.height}px`;
    preview.style.left = `${constrained.x}px`;
    preview.style.top = `${constrained.y}px`;
    preview.style.width = `${constrained.width}px`;
  }

  #constrainLinkPreview(preview: HTMLElement): void {
    this.#applyLinkPreviewGeometry(preview, this.#linkPreviewRect(preview));
  }

  #startLinkPreviewInteraction(event: PointerEvent, preview: HTMLElement, resize?: ResizeDirection): void {
    if (event.button !== 0) return;
    const view = this.ownerDocument.defaultView;
    const state = this.#linkPreviews.get(preview);
    if (!view || !state) return;
    event.preventDefault();
    this.#activateLinkPreview(preview);
    state.interactionCleanup?.();
    state.interactionCleanup = null;
    this.#constrainLinkPreview(preview);
    const startRect = this.#linkPreviewRect(preview);
    const startX = event.clientX;
    const startY = event.clientY;
    preview.classList.add(resize ? "is-resizing" : "is-dragging");
    const update = (moveEvent: PointerEvent): void => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      const limits = this.#floatingLimits();
      const next = { ...startRect };
      if (!resize) {
        next.x = startRect.x + deltaX;
        next.y = startRect.y + deltaY;
      } else {
        if (resize.includes("e")) next.width = Math.min(Math.max(startRect.width + deltaX, limits.minWidth), limits.width - limits.margin - startRect.x);
        if (resize.includes("s")) next.height = Math.min(Math.max(startRect.height + deltaY, limits.minHeight), limits.height - limits.margin - startRect.y);
        if (resize.includes("w")) {
          next.x = Math.min(Math.max(startRect.x + deltaX, limits.margin), startRect.x + startRect.width - limits.minWidth);
          next.width = startRect.x + startRect.width - next.x;
        }
        if (resize.includes("n")) {
          next.y = Math.min(Math.max(startRect.y + deltaY, limits.margin), startRect.y + startRect.height - limits.minHeight);
          next.height = startRect.y + startRect.height - next.y;
        }
      }
      this.#applyLinkPreviewGeometry(preview, next);
    };
    const stop = (): void => {
      view.removeEventListener("pointermove", update);
      view.removeEventListener("pointerup", stop);
      view.removeEventListener("pointercancel", stop);
      preview.classList.remove("is-dragging", "is-resizing");
      if (state.interactionCleanup === stop) state.interactionCleanup = null;
    };
    view.addEventListener("pointermove", update);
    view.addEventListener("pointerup", stop);
    view.addEventListener("pointercancel", stop);
    state.interactionCleanup = stop;
  }

  #loadLinkPreviewFrame(preview: HTMLElement, frame: HTMLIFrameElement, href: string): void {
    const view = this.ownerDocument.defaultView;
    const state = this.#linkPreviews.get(preview);
    if (!view || !state) return;
    state.abortController?.abort();
    state.abortController = null;
    const previewUrl = resourcePreviewUrl(href);
    const fetchFirst = resourcePreviewFetchFirst(previewUrl);
    const documentKey = resourcePreviewDocumentKey(previewUrl);
    const fragment = previewUrl.hash ? decodeURIComponent(previewUrl.hash.slice(1)) : "";
    frame.removeAttribute("srcdoc");
    if (fetchFirst) {
      frame.removeAttribute("src");
      frame.setAttribute("sandbox", RESOURCE_PREVIEW_FETCHED_SANDBOX);
      const cached = RESOURCE_PREVIEW_DOCUMENT_CACHE.get(documentKey);
      if (cached) {
        frame.srcdoc = htmlWithDocumentBase(cached.html, cached.baseUrl, fragment);
        return;
      }
      frame.srcdoc = resourcePreviewStatusDocument("Loading definition…");
    } else {
      frame.setAttribute("sandbox", RESOURCE_PREVIEW_DIRECT_SANDBOX);
      frame.src = previewUrl.href;
    }
    if (typeof view.fetch !== "function" || typeof view.AbortController !== "function") {
      if (fetchFirst) frame.srcdoc = resourcePreviewStatusDocument("Preview unavailable. Use the open button above.");
      return;
    }
    const controller = new view.AbortController();
    state.abortController = controller;
    const attempts = fetchFirst ? RESOURCE_PREVIEW_FETCH_ATTEMPTS : 1;
    const fetchDocument = async (): Promise<ResourcePreviewFetchResult> => {
      let error: unknown;
      for (let attempt = 0; attempt < attempts; attempt += 1) {
        try {
          return await fetchResourcePreviewDocument(view, previewUrl.href, controller);
        } catch (caught) {
          error = caught;
          if (controller.signal.aborted || attempt + 1 >= attempts) throw caught;
          if (fetchFirst && frame.isConnected) frame.srcdoc = resourcePreviewStatusDocument("Still loading; retrying…");
        }
      }
      throw error;
    };
    void fetchDocument().then(({ html, response }) => {
      const contentType = response.headers.get("content-type")?.toLowerCase() ?? "";
      if (!response.ok || (!contentType.includes("text/html") && !contentType.includes("application/xhtml+xml"))) {
        if (fetchFirst && frame.isConnected) frame.srcdoc = resourcePreviewStatusDocument("Preview unavailable. Use the open button above.");
        return;
      }
      if (html.length > RESOURCE_PREVIEW_MAX_HTML_LENGTH || controller.signal.aborted || !frame.isConnected) {
        if (fetchFirst && !controller.signal.aborted && frame.isConnected) frame.srcdoc = resourcePreviewStatusDocument("Preview is too large. Use the open button above.");
        return;
      }
      const responseUrl = new URL(response.url || previewUrl.href);
      responseUrl.hash = "";
      cacheResourcePreviewDocument(documentKey, { baseUrl: responseUrl.href, html });
      frame.setAttribute("sandbox", RESOURCE_PREVIEW_FETCHED_SANDBOX);
      frame.srcdoc = htmlWithDocumentBase(html, responseUrl.href, fragment);
    }).catch(() => {
      if (fetchFirst && frame.isConnected && !controller.signal.aborted) {
        frame.srcdoc = resourcePreviewStatusDocument("Preview unavailable. Use the open button above.");
      }
      // For other resources, direct iframe navigation remains the fallback.
    }).finally(() => {
      if (state.abortController === controller) state.abortController = null;
    });
  }

  #navigateLinkPreview(preview: HTMLElement, href: string): void {
    const frame = preview.querySelector<HTMLIFrameElement>(".resource-preview-frame");
    const open = preview.querySelector<HTMLAnchorElement>(".resource-preview-open");
    const url = preview.querySelector<HTMLElement>(".resource-preview-url");
    if (!frame || !open || !url) return;
    const previewKind: ResourcePreviewKind = preview.dataset.previewKind === "definition" ? "definition" : "resource";
    const label = previewKind === "definition" ? "Definition" : "Resource";
    preview.setAttribute("aria-label", `${label} preview of ${href}`);
    url.textContent = href;
    url.title = href;
    open.href = href;
    open.setAttribute("aria-label", `Open ${href} in a new tab`);
    open.title = open.getAttribute("aria-label")!;
    frame.title = `${label} preview of ${href}`;
    this.#loadLinkPreviewFrame(preview, frame, href);
  }

  #showLinkPreview(anchor: HTMLAnchorElement, x: number, y: number): HTMLElement | null {
    const view = this.ownerDocument.defaultView;
    if (!view || !this.shadowRoot || !anchor.isConnected) return null;
    const document = this.ownerDocument;
    const preview = document.createElement("section");
    preview.className = "resource-preview";
    const previewKind: ResourcePreviewKind = anchor.closest(".predicate") ? "definition" : "resource";
    preview.dataset.previewKind = previewKind;
    preview.setAttribute("role", "dialog");
    preview.setAttribute("aria-label", `${previewKind === "definition" ? "Definition" : "Resource"} preview of ${anchor.href}`);
    const { height: viewportHeight, margin, width: viewportWidth } = this.#floatingLimits();
    const availableWidth = Math.max(1, viewportWidth - margin * 2);
    const availableHeight = Math.max(1, viewportHeight - margin * 2);
    const preferredWidth = previewKind === "definition" ? 620 : Math.max(760, Math.round(viewportWidth * 0.72));
    const preferredHeight = previewKind === "definition" ? 520 : Math.min(760, Math.max(560, Math.round(viewportHeight * 0.82)));
    const width = Math.min(preferredWidth, availableWidth);
    const height = Math.min(preferredHeight, availableHeight);
    const cascade = (this.#linkPreviews.size % 6) * 24;
    const initialRect = this.#constrainFloatingRect({
      height,
      width,
      x: previewKind === "definition" ? x - 24 : Math.round((viewportWidth - width) / 2),
      y: previewKind === "definition" ? y - 40 : Math.round((viewportHeight - height) / 2),
    });
    this.#applyLinkPreviewGeometry(preview, {
      ...initialRect,
      x: initialRect.x + cascade,
      y: initialRect.y + cascade,
    });

    const bar = document.createElement("header");
    bar.className = "resource-preview-bar";
    const url = document.createElement("span");
    url.className = "resource-preview-url";
    url.title = anchor.href;
    url.textContent = anchor.href;
    const open = document.createElement("a");
    open.className = "resource-preview-action resource-preview-open";
    open.href = anchor.href;
    open.target = "_blank";
    open.rel = "noopener noreferrer";
    open.setAttribute("aria-label", `Open ${anchor.href} in a new tab`);
    open.title = open.getAttribute("aria-label")!;
    open.textContent = "↗";
    bar.append(url, open);
    const close = document.createElement("button");
    close.className = "resource-preview-action resource-preview-close";
    close.type = "button";
    close.setAttribute("aria-label", "Close resource preview");
    close.title = close.getAttribute("aria-label")!;
    close.textContent = "×";
    close.addEventListener("click", () => this.#clearLinkPreview(preview));
    bar.append(close);
    bar.addEventListener("pointerdown", (event) => {
      const target = event.target instanceof Element ? event.target : null;
      if (target?.closest("a, button")) return;
      this.#startLinkPreviewInteraction(event, preview);
    });

    const frame = document.createElement("iframe");
    frame.className = "resource-preview-frame";
    frame.title = `${previewKind === "definition" ? "Definition" : "Resource"} preview of ${anchor.href}`;
    frame.setAttribute("sandbox", resourcePreviewFetchFirst(resourcePreviewUrl(anchor.href)) ? RESOURCE_PREVIEW_FETCHED_SANDBOX : RESOURCE_PREVIEW_DIRECT_SANDBOX);
    frame.referrerPolicy = "no-referrer";
    frame.tabIndex = 0;
    preview.append(bar, frame);
    const resizeHandles = document.createElement("div");
    resizeHandles.className = "resource-preview-resize-handles";
    resizeHandles.setAttribute("aria-hidden", "true");
    for (const direction of ["n", "ne", "e", "se", "s", "sw", "w", "nw"] as ResizeDirection[]) {
      const handle = document.createElement("span");
      handle.className = "resize-handle";
      handle.dataset.resize = direction;
      handle.addEventListener("pointerdown", (event) => this.#startLinkPreviewInteraction(event, preview, direction));
      resizeHandles.append(handle);
    }
    preview.append(resizeHandles);
    this.shadowRoot.append(preview);
    const state: LinkPreviewState = { abortController: null, interactionCleanup: null, navigationCleanup: null };
    this.#linkPreviews.set(preview, state);
    preview.addEventListener("pointerdown", () => this.#activateLinkPreview(preview), { capture: true });
    this.#activateLinkPreview(preview);
    const handlePreviewNavigation = (event: MessageEvent): void => {
      const data = event.data as { href?: unknown; type?: unknown } | null;
      if (event.source !== frame.contentWindow || data?.type !== "ia2-rdf-preview-navigate" || typeof data.href !== "string" || !isWebIri(data.href)) return;
      this.#navigateLinkPreview(preview, data.href);
    };
    view.addEventListener("message", handlePreviewNavigation);
    state.navigationCleanup = () => view.removeEventListener("message", handlePreviewNavigation);
    this.#loadLinkPreviewFrame(preview, frame, anchor.href);
    return preview;
  }

  #openLinkPreview(anchor: HTMLAnchorElement, event: MouseEvent): HTMLElement | null {
    const rect = anchor.getBoundingClientRect();
    const x = event.clientX || rect.left + Math.min(rect.width / 2, 24);
    const y = event.clientY || rect.top + Math.min(rect.height / 2, 12);
    return this.#showLinkPreview(anchor, x, y);
  }

  #openSparqlLinkPreview(anchor: HTMLAnchorElement, event: MouseEvent): void {
    const preview = this.#sparqlLinkPreview;
    if (preview?.isConnected && this.#linkPreviews.has(preview)) {
      this.#activateLinkPreview(preview);
      this.#navigateLinkPreview(preview, anchor.href);
      return;
    }
    this.#sparqlLinkPreview = this.#openLinkPreview(anchor, event);
  }

  #resourceAnchorForTarget(target: EventTarget | null): HTMLAnchorElement | null {
    if (!(target instanceof Element)) return null;
    const anchor = target.closest<HTMLAnchorElement>("a.term-link[href], a.vocabulary-link[href], a.tok.iri[href], a.sparql-resource-label[href]");
    if (!anchor || !this.shadowRoot?.contains(anchor)) return null;
    const sourceDocumentIri = this.#result?.sourceDocumentIri ?? this.ownerDocument.URL;
    const semanticIri = anchor.dataset.semanticIri ?? anchor.href;
    return localDocumentUrl(this.ownerDocument, semanticIri, sourceDocumentIri) ? null : anchor;
  }

  #configureLinkClicks(): void {
    if (!this.shadowRoot) return;
    const viewport = this.shadowRoot.querySelector<HTMLElement>(".viewport");
    if (!viewport) return;
    viewport.addEventListener("click", (event) => {
      const anchor = this.#resourceAnchorForTarget(event.target);
      if (!anchor || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      if (anchor.classList.contains("sparql-resource-label")) {
        this.#openSparqlLinkPreview(anchor, event);
      } else {
        this.#openLinkPreview(anchor, event);
      }
    });
  }

  #restoreSessionState(): void {
    try {
      const serialized = this.ownerDocument.defaultView?.sessionStorage.getItem(SESSION_STATE_KEY);
      if (!serialized) return;
      const state = JSON.parse(serialized) as Partial<PersistedNavigatorState>;
      if (isWindowPosition(state.position)) this.#position = state.position;
      if (isFloatingRect(state.floatingRect)) this.#floatingRect = this.#constrainFloatingRect(state.floatingRect);
      if (isLauncherPosition(state.launcherPosition)) this.#launcherPosition = state.launcherPosition;
    } catch {
      // Storage may be unavailable for opaque or restricted document origins.
    }
  }

  #persistSessionState(): void {
    try {
      const state: PersistedNavigatorState = {
        floatingRect: this.#floatingRect,
        launcherPosition: this.#launcherPosition,
        position: this.#position,
      };
      this.ownerDocument.defaultView?.sessionStorage.setItem(SESSION_STATE_KEY, JSON.stringify(state));
    } catch {
      // Persistence is an enhancement; extraction and navigation must still work without it.
    }
  }

  #captureFocus(): FocusSnapshot | null {
    const active = this.shadowRoot?.activeElement;
    if (!(active instanceof HTMLElement)) return null;
    if (active.classList.contains("navigator-search")) {
      const input = active as HTMLInputElement;
      return { kind: "search", start: input.selectionStart, end: input.selectionEnd };
    }
    if (active.classList.contains("shapes-search")) {
      const input = active as HTMLInputElement;
      return { kind: "shapes-search", start: input.selectionStart, end: input.selectionEnd };
    }
    if (active.classList.contains("sparql-editor")) {
      const input = active as HTMLTextAreaElement;
      return { kind: "sparql-editor", start: input.selectionStart, end: input.selectionEnd };
    }
    if (active.classList.contains("sparql-suggestion")) return { kind: "sparql-suggestion" };
    if (active.classList.contains("sparql-run")) return { kind: "sparql-run" };
    if (active.classList.contains("sparql-reset")) return { kind: "sparql-reset" };
    if (active.classList.contains("sparql-observe-input")) return { kind: "sparql-observe" };
    if (active.classList.contains("vocabulary-toggle") && active.dataset.namespace) return { kind: "namespace", key: active.dataset.namespace };
    if (active.classList.contains("sync-option") && active.dataset.syncMode) return { kind: "sync", key: active.dataset.syncMode };
    if (active.classList.contains("position-option") && active.dataset.position) return { kind: "position", key: active.dataset.position };
    if (active.classList.contains("discovery-action") && active.dataset.candidateId) return { kind: "discovery-action", key: active.dataset.candidateId };
    if (active.classList.contains("source-input") && active.dataset.sourceId) return { kind: "source", key: active.dataset.sourceId };
    if (active.classList.contains("tab") && active.dataset.view) return { kind: "tab", key: active.dataset.view };
    if (active.classList.contains("launcher")) return { kind: "launcher" };
    if (active.classList.contains("refresh")) return { kind: "refresh" };
    if (active.classList.contains("close")) return { kind: "close" };
    if (active.classList.contains("copy")) return { kind: "copy" };
    if (active.classList.contains("viewport")) return { kind: "viewport" };
    return this.shadowRoot?.querySelector(".panel")?.contains(active) ? { kind: "fallback" } : null;
  }

  #restoreFocus(snapshot: FocusSnapshot): void {
    if (!this.shadowRoot) return;
    let target: HTMLElement | null = null;
    if (snapshot.kind === "search") target = this.shadowRoot.querySelector<HTMLInputElement>(".navigator-search");
    if (snapshot.kind === "shapes-search") target = this.shadowRoot.querySelector<HTMLInputElement>(".shapes-search");
    if (snapshot.kind === "sparql-editor") target = this.shadowRoot.querySelector<HTMLTextAreaElement>(".sparql-editor");
    if (snapshot.kind === "sparql-suggestion") target = this.shadowRoot.querySelector<HTMLSelectElement>(".sparql-suggestion");
    if (snapshot.kind === "sparql-run") target = this.shadowRoot.querySelector<HTMLButtonElement>(".sparql-run");
    if (snapshot.kind === "sparql-reset") target = this.shadowRoot.querySelector<HTMLButtonElement>(".sparql-reset");
    if (snapshot.kind === "sparql-observe") target = this.shadowRoot.querySelector<HTMLInputElement>(".sparql-observe-input");
    if (snapshot.kind === "namespace") {
      target = Array.from(this.shadowRoot.querySelectorAll<HTMLButtonElement>(".vocabulary-toggle"))
        .find((button) => button.dataset.namespace === snapshot.key) ?? null;
    }
    if (snapshot.kind === "sync") target = Array.from(this.shadowRoot.querySelectorAll<HTMLButtonElement>(".sync-option")).find((button) => button.dataset.syncMode === snapshot.key) ?? null;
    if (snapshot.kind === "position") target = Array.from(this.shadowRoot.querySelectorAll<HTMLButtonElement>(".position-option")).find((button) => button.dataset.position === snapshot.key) ?? null;
    if (snapshot.kind === "discovery-action") target = Array.from(this.shadowRoot.querySelectorAll<HTMLButtonElement>(".discovery-action")).find((button) => button.dataset.candidateId === snapshot.key) ?? null;
    if (snapshot.kind === "source") target = Array.from(this.shadowRoot.querySelectorAll<HTMLInputElement>(".source-input")).find((input) => input.dataset.sourceId === snapshot.key) ?? null;
    if (snapshot.kind === "tab") target = Array.from(this.shadowRoot.querySelectorAll<HTMLButtonElement>(".tab")).find((button) => button.dataset.view === snapshot.key) ?? null;
    if (snapshot.kind === "launcher") target = this.shadowRoot.querySelector<HTMLElement>(".launcher");
    if (snapshot.kind === "refresh") target = this.shadowRoot.querySelector<HTMLElement>(".refresh");
    if (snapshot.kind === "close") target = this.shadowRoot.querySelector<HTMLElement>(".close");
    if (snapshot.kind === "copy") target = this.shadowRoot.querySelector<HTMLElement>(".copy");
    if (snapshot.kind === "viewport") target = this.shadowRoot.querySelector<HTMLElement>(".viewport");
    if (!target && snapshot.kind === "fallback") target = this.shadowRoot.querySelector<HTMLElement>('[role="tab"][aria-selected="true"]');
    target?.focus({ preventScroll: true });
    if (snapshot.kind === "search" && target instanceof HTMLInputElement) {
      target.setSelectionRange(snapshot.start ?? target.value.length, snapshot.end ?? target.value.length);
    }
    if (snapshot.kind === "shapes-search" && target instanceof HTMLInputElement) {
      target.setSelectionRange(snapshot.start ?? target.value.length, snapshot.end ?? target.value.length);
    }
    if (snapshot.kind === "sparql-editor" && target instanceof HTMLTextAreaElement) {
      target.setSelectionRange(snapshot.start ?? target.value.length, snapshot.end ?? target.value.length);
    }
  }

  #panelFocusables(): HTMLElement[] {
    const panel = this.shadowRoot?.querySelector<HTMLElement>(".panel");
    if (!panel) return [];
    const scopes = [panel, ...this.#linkPreviews.keys()];
    return scopes.flatMap((scope) => Array.from(scope.querySelectorAll<HTMLElement>('a[href], button, input, select, textarea, [tabindex]')))
      .filter((element) => element.tabIndex >= 0 && !element.hasAttribute("disabled") && !element.closest("[hidden]") && element.getAttribute("aria-hidden") !== "true");
  }

  #observeDocument(): void {
    this.#observer?.disconnect();
    const Observer = this.ownerDocument.defaultView?.MutationObserver ?? MutationObserver;
    this.#observer = new Observer((records) => {
      // Mutations inside the drawer's Shadow DOM are outside this observer.
      // Ignore the host itself in case another tool changes its attributes.
      if (!records.some((record) => record.target !== this && mutationAffectsExtraction(record))) return;
      if (this.#refreshTimer !== null) window.clearTimeout(this.#refreshTimer);
      this.#refreshTimer = window.setTimeout(() => {
        this.#refreshTimer = null;
        if (this.#sparqlExecution.status === "success") {
          void this.#refreshAfterDocumentChange();
        } else {
          this.refresh();
        }
      }, 120);
    });
    try {
      this.#observer.observe(this.ownerDocument.documentElement, {
        attributes: true,
        characterData: true,
        childList: true,
        subtree: true,
      });
    } catch {
      // A custom element adopted into another browsing context can retain its
      // defining realm in some hosts. Extraction and explicit dataset-change
      // events remain available even when that host rejects DOM observation.
      this.#observer = null;
    }
  }

  #rebuildResult(): void {
    if (!this.#sourceResult) {
      this.#result = null;
      this.#shaclCatalog = { count: 0, groups: [], shapes: [] };
      this.#sparqlResourceLabels.clear();
      return;
    }
    const contributions = Array.from(this.#discoveryLoads.values())
      .flatMap((state) => state.status === "loaded" && state.contribution ? [state.contribution] : []);
    this.#result = mergeDiscoveryContributions(this.#sourceResult, contributions);
    this.#shaclCatalog = extractShaclCatalog(this.#result);
    this.#sparqlResourceLabels = termLabelMap(this.#result.quads, {
      predicates: SPARQL_LABEL_PREDICATES,
      languages: [this.ownerDocument.documentElement.lang || "en"],
    });
  }

  #renderDiscoveryState(candidateId: string): void {
    this.#rebuildResult();
    this.#render();
    queueMicrotask(() => {
      Array.from(this.shadowRoot?.querySelectorAll<HTMLButtonElement>(".discovery-action") ?? [])
        .find((button) => button.dataset.candidateId === candidateId)
        ?.focus({ preventScroll: true });
    });
  }

  #removeDiscoveryContribution(candidateId: string): void {
    this.#discoveryLoads.get(candidateId)?.controller?.abort();
    this.#discoveryLoads.delete(candidateId);
    this.#renderDiscoveryState(candidateId);
  }

  async #loadDiscoveryContribution(candidate: DiscoveryCandidate): Promise<void> {
    const source = this.#sourceResult;
    const view = this.ownerDocument.defaultView;
    if (!source || !view) return;
    const existing = this.#discoveryLoads.get(candidate.id);
    if (existing?.status === "loading" || existing?.status === "loaded") {
      this.#removeDiscoveryContribution(candidate.id);
      return;
    }

    const controller = new AbortController();
    this.#discoveryLoads.set(candidate.id, { controller, status: "loading" });
    this.#renderDiscoveryState(candidate.id);
    const timeout = view.setTimeout(() => controller.abort(), DISCOVERY_FETCH_TIMEOUT_MS);
    try {
      const retrievalIri = retrievalIriForCandidate(candidate.target.value, source);
      const protocol = new URL(retrievalIri).protocol;
      if (protocol !== "http:" && protocol !== "https:") throw new Error(`Unsupported retrieval protocol: ${protocol}`);
      const response = await view.fetch(retrievalIri, {
        credentials: "omit",
        headers: { Accept: DISCOVERY_ACCEPT },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        signal: controller.signal,
      });
      if (!response.ok) throw new Error(`Retrieval failed with HTTP ${response.status}.`);
      const declaredLength = Number.parseInt(response.headers.get("content-length") ?? "", 10);
      if (Number.isFinite(declaredLength) && declaredLength > DISCOVERY_MAX_HTML_LENGTH) {
        throw new Error("The representation is larger than the 2 MB enrichment limit.");
      }
      const mediaType = (response.headers.get("content-type") ?? "").split(";", 1)[0]!.trim().toLowerCase();
      const text = await response.text();
      if (text.length > DISCOVERY_MAX_HTML_LENGTH) throw new Error("The representation is larger than the 2 MB enrichment limit.");
      const looksLikeHtml = /<!doctype\s+html|<html[\s>]/i.test(text);
      if (mediaType && mediaType !== "text/html" && mediaType !== "application/xhtml+xml") {
        throw new Error(`Unsupported enrichment representation: ${mediaType}. This preview currently extracts HTML/RDF.`);
      }
      if (!mediaType && !looksLikeHtml) throw new Error("The target did not return an identifiable HTML representation.");

      const retrievedDocument = new view.DOMParser().parseFromString(text, "text/html");
      const finalRetrievalIri = response.url || retrievalIri;
      prepareRetrievedDocument(retrievedDocument, finalRetrievalIri);
      const contributionResult = extractDataset(retrievedDocument);
      if (!contributionResult.quads.length && !contributionResult.graphs.length) {
        throw new Error("The retrieved HTML contained no extractable RDF.");
      }
      const current = this.#discoveryLoads.get(candidate.id);
      if (current?.controller !== controller) return;
      this.#discoveryLoads.set(candidate.id, {
        contribution: { candidateId: candidate.id, result: contributionResult, retrievalIri: finalRetrievalIri },
        status: "loaded",
      });
    } catch (error) {
      const current = this.#discoveryLoads.get(candidate.id);
      if (current?.controller !== controller) return;
      this.#discoveryLoads.set(candidate.id, { message: discoveryErrorMessage(error), status: "error" });
    } finally {
      view.clearTimeout(timeout);
    }
    this.#renderDiscoveryState(candidate.id);
  }

  #sourceIdForFrame(frame: Element): string {
    let id = this.#frameSourceIds.get(frame);
    if (!id) {
      id = `document-frame-${this.#nextFrameSourceId++}`;
      this.#frameSourceIds.set(frame, id);
    }
    return id;
  }

  #extractDirectFrameSources(): NavigatorSource[] {
    const frames = Array.from(this.ownerDocument.querySelectorAll("iframe, frame"));
    return frames.flatMap((frame, index) => {
      let frameDocument: Document | null = null;
      try {
        frameDocument = (frame as HTMLIFrameElement).contentDocument;
        if (!frameDocument?.documentElement) return [];
        // Accessing the root is the actual same-origin check in browsers.
        void frameDocument.documentElement.localName;
      } catch {
        return [];
      }
      const url = frameDocument.URL || frameDocument.baseURI;
      let origin = "Opaque origin";
      try { origin = new URL(url).origin; } catch { /* keep the explicit fallback */ }
      const title = frame.getAttribute("title")?.trim() || frameDocument.title.trim() || `Embedded document ${index + 1}`;
      return [{
        access: "direct" as const,
        id: this.#sourceIdForFrame(frame),
        label: title,
        origin,
        result: extractDataset(frameDocument),
        url,
      }];
    });
  }

  #applySelectedSource(preserveDiscovery: boolean, preserveSparqlExecution = false): void {
    const source = this.#sources.find((candidate) => candidate.id === this.#selectedSourceId) ?? this.#sources[0];
    if (!source) return;
    this.#selectedSourceId = source.id;
    this.#sourceResult = source.result;
    if (!preserveDiscovery) {
      for (const state of this.#discoveryLoads.values()) state.controller?.abort();
      this.#discoveryLoads.clear();
    }
    this.#discoveryCandidates = detectDiscoveryCandidates(this.#sourceResult);
    this.#documentVocabulary = extractDocumentVocabulary(this.#sourceResult);
    const queryCatalog = extractSuggestedSparqlQueryCatalog(this.#sourceResult);
    this.#sparqlSuggestions = queryCatalog.queries;
    this.#sparqlSuggestionDiagnostics = queryCatalog.diagnostics;
    if (!this.#sparqlSuggestions.some((query) => query.id === this.#selectedSparqlSuggestionId)) {
      this.#selectedSparqlSuggestionId = "";
    }
    if (!preserveSparqlExecution) {
      this.#sparqlRunId += 1;
      this.#sparqlPage = 0;
      this.#sparqlExecution = { status: "idle" };
      this.#sparqlPresentationSignature = "";
    }
    const candidateIds = new Set(this.#discoveryCandidates.map((candidate) => candidate.id));
    for (const [candidateId, state] of this.#discoveryLoads) {
      if (candidateIds.has(candidateId)) continue;
      state.controller?.abort();
      this.#discoveryLoads.delete(candidateId);
    }
    this.#rebuildResult();
  }

  #rebuildSources(preserveDiscovery: boolean, preserveSparqlExecution = false): void {
    if (!this.#topSourceResult) return;
    const previousSelectedSourceId = this.#selectedSourceId;
    const topUrl = this.ownerDocument.URL || this.ownerDocument.baseURI;
    let topOrigin = "Opaque origin";
    try { topOrigin = new URL(topUrl).origin; } catch { /* keep the explicit fallback */ }
    const seen = new Set<string>();
    const candidates: NavigatorSource[] = [
      {
        access: "direct",
        id: "top-document",
        label: "Top document",
        origin: topOrigin,
        result: this.#topSourceResult,
        url: topUrl,
      },
      ...this.#directFrameSources,
      ...this.#externalSources,
    ];
    this.#sources = candidates.filter((source) => {
      if (seen.has(source.id)) return false;
      seen.add(source.id);
      return true;
    });
    if (!this.#sources.some((source) => source.id === this.#selectedSourceId)) this.#selectedSourceId = "top-document";
    const top = this.#sources[0]!;
    const rdfChildren = this.#sources.slice(1).filter((source) => source.result.quads.length > 0);
    if (this.#selectedSourceId === top.id && top.result.quads.length === 0 && rdfChildren.length === 1) {
      this.#selectedSourceId = rdfChildren[0]!.id;
    }
    this.#applySelectedSource(
      preserveDiscovery,
      preserveSparqlExecution && previousSelectedSourceId === this.#selectedSourceId,
    );
  }

  #selectSource(sourceId: string): void {
    if (sourceId === this.#selectedSourceId || !this.#sources.some((source) => source.id === sourceId)) return;
    this.#selectedSourceId = sourceId;
    this.#applySelectedSource(false);
    this.#view = "navigator";
    this.#navigatorQuery = "";
    this.#shapesQuery = "";
    this.#disabledNamespaces.clear();
    this.#syncMode = "off";
    this.#render();
  }

  /** Supply structured-clone-safe document sources collected by an extension. */
  setSources(sources: readonly PortableNavigatorSource[]): void {
    this.#externalSources = sources.flatMap((source) => {
      if (!source || source.access !== "portable" || !source.id || source.id === "top-document") return [];
      try {
        return [{
          access: "portable" as const,
          id: source.id,
          label: source.label || "Embedded document",
          origin: source.origin || "Opaque origin",
          result: fromPortableExtractionResult(source.result, this.ownerDocument),
          url: source.url || source.result.retrievalDocumentIri,
        }];
      } catch {
        return [];
      }
    });
    if (!this.#topSourceResult) return;
    const focus = this.#captureFocus();
    this.#rebuildSources(true);
    this.#render();
    if (focus) queueMicrotask(() => this.#restoreFocus(focus));
  }

  #refreshExtraction(preserveSparqlExecution: boolean): void {
    this.#topSourceResult = extractDataset(this.ownerDocument);
    this.#directFrameSources = this.#extractDirectFrameSources();
    this.#rebuildSources(true, preserveSparqlExecution);
  }

  #totalStatementCount(): number {
    const activeSource = this.#sources.find((source) => source.id === this.#selectedSourceId) ?? this.#sources[0];
    const sourceStatements = this.#sources.reduce((sum, source) => sum + source.result.quads.length, 0);
    const selectedContributions = Math.max(0, (this.#result?.quads.length ?? 0) - (activeSource?.result.quads.length ?? 0));
    return sourceStatements + selectedContributions;
  }

  #updateLiveStatementCount(): void {
    const count = this.shadowRoot?.querySelector<HTMLElement>(".launcher .count");
    if (count) count.textContent = String(this.#totalStatementCount());
  }

  #replaceSparqlOutput(): void {
    const output = this.shadowRoot?.querySelector<HTMLElement>(".sparql-output");
    if (!output) return;
    output.replaceChildren();
    this.#renderSparqlOutput(output);
  }

  async #rerunObservedSparql(): Promise<void> {
    const query = this.#sparqlQuery.trim();
    if (
      !this.#sparqlObserveChanges
      || !query
      || !this.#result
      || this.#sparqlExecution.status !== "success"
    ) return;
    const runId = ++this.#sparqlRunId;
    const sourceResult = this.#result;
    try {
      const { executeSparql } = await import("./sparql-engine.js");
      const result = await executeSparql(query, sourceResult);
      if (runId !== this.#sparqlRunId) return;
      const signature = sparqlPresentationSignature(result, this.#sparqlResourceLabels);
      if (signature === this.#sparqlPresentationSignature) return;
      this.#sparqlExecution = { result, status: "success" };
      this.#sparqlPresentationSignature = signature;
    } catch (error) {
      if (runId !== this.#sparqlRunId) return;
      this.#sparqlExecution = {
        error: error instanceof Error ? error.message : "The query could not be run.",
        status: "error",
      };
      this.#sparqlPresentationSignature = "";
    }
    if (this.#view === "sparql") this.#replaceSparqlOutput();
  }

  async #refreshAfterDocumentChange(): Promise<void> {
    const selectedSourceId = this.#selectedSourceId;
    this.#refreshExtraction(true);
    if (selectedSourceId !== this.#selectedSourceId || this.#sparqlExecution.status !== "success") {
      this.#render();
      return;
    }
    if (this.#view === "sparql") this.#updateLiveStatementCount();
    else this.#render();
    await this.#rerunObservedSparql();
  }

  /** Re-extract the current owner document and redraw every view. */
  refresh(): void {
    const focus = this.#captureFocus();
    this.#refreshExtraction(false);
    this.#render();
    if (focus) queueMicrotask(() => this.#restoreFocus(focus));
  }

  open(focusTarget: "panel" | "tab" = "tab"): void {
    if (this.#open) return;
    this.#open = true;
    if (!this.#contentRendered) {
      this.#render();
    }
    this.shadowRoot?.querySelector(".launcher")?.setAttribute("aria-expanded", "true");
    const panel = this.shadowRoot?.querySelector<HTMLElement>(".panel");
    if (panel) panel.dataset.open = "true";
    queueMicrotask(() => {
      const active = this.shadowRoot?.activeElement;
      if (active instanceof HTMLElement && panel?.contains(active)) return;
      const target = focusTarget === "tab"
        ? this.shadowRoot?.querySelector<HTMLElement>('[role="tab"][aria-selected="true"]')
        : this.shadowRoot?.querySelector<HTMLElement>(".panel");
      target?.focus({ preventScroll: true });
    });
  }

  close(): void {
    this.#open = false;
    this.#stopFloatingInteraction();
    this.#clearLinkPreviews();
    this.#clearLocateEmphasis();
    this.#turnOffNavigatorSync();
    this.shadowRoot?.querySelector(".launcher")?.setAttribute("aria-expanded", "false");
    const panel = this.shadowRoot?.querySelector<HTMLElement>(".panel");
    if (panel) panel.dataset.open = "false";
    queueMicrotask(() => {
      const launcher = this.shadowRoot?.querySelector<HTMLButtonElement>(".launcher");
      if (launcher?.hidden) {
        (this.shadowRoot?.activeElement as HTMLElement | null)?.blur();
        return;
      }
      launcher?.focus();
    });
  }

  toggle(focusTarget: "panel" | "tab" = "tab"): void {
    if (this.#open) this.close();
    else this.open(focusTarget);
  }

  /** Open the Navigator at the statement carriers produced by one document element. */
  revealSource(source: Element, position: DrawerPosition = "left"): boolean {
    const represented = this.#sourceResult?.quads.some((quad) => quad.source === source) ?? false;
    if (!represented || source.ownerDocument !== this.ownerDocument) return false;

    this.#position = position;
    this.#view = "navigator";
    this.#navigatorQuery = "";
    this.#disabledNamespaces.clear();
    this.#syncMode = "off";
    this.#render();
    this.#persistSessionState();
    this.open("panel");

    queueMicrotask(() => {
      const matchingRows = this.#navigatorRows.filter(({ quad }) => quad.source === source);
      const primary = matchingRows[0]?.item;
      if (!primary) return;
      this.#navigatorRows.forEach(({ item }) => item.classList.remove("is-corresponding"));
      matchingRows.forEach(({ item }) => {
        item.hidden = false;
        item.classList.add("is-corresponding");
      });
      primary.tabIndex = -1;
      primary.scrollIntoView?.({ block: "center" });
      primary.focus({ preventScroll: true });
      this.#status = `Showing statements carried by ${elementLabel(source)}`;
      const status = this.shadowRoot?.querySelector<HTMLElement>(".sr-only");
      if (status) status.textContent = this.#status;
    });
    return true;
  }

  #floatingLimits(): { height: number; margin: number; minHeight: number; minWidth: number; width: number } {
    const view = this.ownerDocument.defaultView;
    const width = Math.max(view?.innerWidth ?? 1024, 1);
    const height = Math.max(view?.innerHeight ?? 768, 1);
    const margin = width <= 760 ? 10 : 24;
    return {
      height,
      margin,
      minHeight: Math.min(280, Math.max(height - margin * 2, 1)),
      minWidth: Math.min(360, Math.max(width - margin * 2, 1)),
      width,
    };
  }

  #constrainFloatingRect(rect: FloatingRect): FloatingRect {
    const { height: viewportHeight, margin, minHeight, minWidth, width: viewportWidth } = this.#floatingLimits();
    const availableWidth = Math.max(viewportWidth - margin * 2, 1);
    const availableHeight = Math.max(viewportHeight - margin * 2, 1);
    const width = Math.min(Math.max(rect.width, minWidth), availableWidth);
    const height = Math.min(Math.max(rect.height, minHeight), availableHeight);
    return {
      height,
      width,
      x: Math.min(Math.max(rect.x, margin), viewportWidth - margin - width),
      y: Math.min(Math.max(rect.y, margin), viewportHeight - margin - height),
    };
  }

  #defaultFloatingRect(): FloatingRect {
    const { height, margin, width } = this.#floatingLimits();
    const floatingWidth = Math.min(760, Math.max(width - margin * 2, 1));
    const floatingHeight = Math.min(860, Math.max(height - margin * 2, 1), Math.max(360, Math.round(height * 0.82)));
    return {
      height: floatingHeight,
      width: floatingWidth,
      x: Math.round((width - floatingWidth) / 2),
      y: Math.round((height - floatingHeight) / 2),
    };
  }

  #applyFloatingGeometry(panel: HTMLElement): void {
    this.#floatingRect = this.#constrainFloatingRect(this.#floatingRect ?? this.#defaultFloatingRect());
    panel.style.height = `${this.#floatingRect.height}px`;
    panel.style.left = `${this.#floatingRect.x}px`;
    panel.style.top = `${this.#floatingRect.y}px`;
    panel.style.width = `${this.#floatingRect.width}px`;
  }

  #clearFloatingGeometry(panel: HTMLElement): void {
    panel.style.height = "";
    panel.style.left = "";
    panel.style.top = "";
    panel.style.width = "";
  }

  #launcherLimits(launcher: HTMLElement): { margin: number; maxX: number; maxY: number } {
    const view = this.ownerDocument.defaultView;
    const viewportWidth = Math.max(view?.innerWidth ?? 1024, 1);
    const viewportHeight = Math.max(view?.innerHeight ?? 768, 1);
    const margin = viewportWidth <= 760 ? 14 : 20;
    const rect = launcher.getBoundingClientRect();
    const width = rect.width || launcher.offsetWidth;
    const height = rect.height || launcher.offsetHeight || 44;
    return {
      margin,
      maxX: Math.max(margin, viewportWidth - margin - width),
      maxY: Math.max(margin, viewportHeight - margin - height),
    };
  }

  #constrainLauncherPosition(launcher: HTMLElement, position: LauncherPosition): LauncherPosition {
    const { margin, maxX, maxY } = this.#launcherLimits(launcher);
    return {
      x: Math.min(Math.max(position.x, margin), maxX),
      y: Math.min(Math.max(position.y, margin), maxY),
    };
  }

  #snapLauncherPosition(launcher: HTMLElement, position: LauncherPosition): LauncherPosition {
    const { margin, maxX, maxY } = this.#launcherLimits(launcher);
    const snapped = this.#constrainLauncherPosition(launcher, position);
    if (snapped.x - margin <= LAUNCHER_EDGE_SNAP_DISTANCE) snapped.x = margin;
    if (maxX - snapped.x <= LAUNCHER_EDGE_SNAP_DISTANCE) snapped.x = maxX;
    if (snapped.y - margin <= LAUNCHER_EDGE_SNAP_DISTANCE) snapped.y = margin;
    if (maxY - snapped.y <= LAUNCHER_EDGE_SNAP_DISTANCE) snapped.y = maxY;
    return snapped;
  }

  #applyLauncherGeometry(launcher: HTMLElement): void {
    if (!this.#launcherPosition) return;
    this.#launcherPosition = this.#constrainLauncherPosition(launcher, this.#launcherPosition);
    launcher.style.bottom = "auto";
    launcher.style.left = `${this.#launcherPosition.x}px`;
    launcher.style.right = "auto";
    launcher.style.top = `${this.#launcherPosition.y}px`;
  }

  #stopLauncherInteraction(): void {
    this.#launcherInteractionCleanup?.();
    this.#launcherInteractionCleanup = null;
  }

  #startLauncherInteraction(event: PointerEvent, launcher: HTMLElement): void {
    if (event.button !== 0) return;
    const view = this.ownerDocument.defaultView;
    if (!view) return;
    this.#stopLauncherInteraction();
    const rect = launcher.getBoundingClientRect();
    const startPosition = { x: rect.left, y: rect.top };
    const startX = event.clientX;
    const startY = event.clientY;
    let dragged = false;

    const update = (moveEvent: PointerEvent): void => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      if (!dragged && Math.hypot(deltaX, deltaY) < LAUNCHER_DRAG_THRESHOLD) return;
      if (!dragged) {
        dragged = true;
        event.preventDefault();
        launcher.classList.add("is-dragging");
      }
      this.#launcherPosition = this.#constrainLauncherPosition(launcher, {
        x: startPosition.x + deltaX,
        y: startPosition.y + deltaY,
      });
      this.#applyLauncherGeometry(launcher);
    };
    const stop = (): void => {
      view.removeEventListener("pointermove", update);
      view.removeEventListener("pointerup", stop);
      view.removeEventListener("pointercancel", stop);
      launcher.classList.remove("is-dragging");
      if (dragged && this.#launcherPosition) {
        this.#launcherPosition = this.#snapLauncherPosition(launcher, this.#launcherPosition);
        this.#applyLauncherGeometry(launcher);
        this.#persistSessionState();
        this.#suppressLauncherClick = true;
        view.setTimeout(() => {
          this.#suppressLauncherClick = false;
        }, 0);
      }
      if (this.#launcherInteractionCleanup === stop) this.#launcherInteractionCleanup = null;
    };
    view.addEventListener("pointermove", update);
    view.addEventListener("pointerup", stop);
    view.addEventListener("pointercancel", stop);
    this.#launcherInteractionCleanup = stop;
  }

  #stopFloatingInteraction(): void {
    this.#floatingInteractionCleanup?.();
    this.#floatingInteractionCleanup = null;
  }

  #startFloatingInteraction(event: PointerEvent, panel: HTMLElement, resize?: ResizeDirection): void {
    if (this.#position !== "floating" || event.button !== 0) return;
    const view = this.ownerDocument.defaultView;
    if (!view) return;
    event.preventDefault();
    this.#stopFloatingInteraction();
    this.#applyFloatingGeometry(panel);
    const startRect = { ...this.#floatingRect! };
    const startX = event.clientX;
    const startY = event.clientY;
    panel.classList.add(resize ? "is-resizing" : "is-dragging");

    const update = (moveEvent: PointerEvent): void => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      const limits = this.#floatingLimits();
      const next = { ...startRect };
      if (!resize) {
        next.x = startRect.x + deltaX;
        next.y = startRect.y + deltaY;
      } else {
        if (resize.includes("e")) next.width = Math.min(Math.max(startRect.width + deltaX, limits.minWidth), limits.width - limits.margin - startRect.x);
        if (resize.includes("s")) next.height = Math.min(Math.max(startRect.height + deltaY, limits.minHeight), limits.height - limits.margin - startRect.y);
        if (resize.includes("w")) {
          next.x = Math.min(Math.max(startRect.x + deltaX, limits.margin), startRect.x + startRect.width - limits.minWidth);
          next.width = startRect.x + startRect.width - next.x;
        }
        if (resize.includes("n")) {
          next.y = Math.min(Math.max(startRect.y + deltaY, limits.margin), startRect.y + startRect.height - limits.minHeight);
          next.height = startRect.y + startRect.height - next.y;
        }
      }
      this.#floatingRect = this.#constrainFloatingRect(next);
      this.#applyFloatingGeometry(panel);
    };
    const stop = (): void => {
      view.removeEventListener("pointermove", update);
      view.removeEventListener("pointerup", stop);
      view.removeEventListener("pointercancel", stop);
      panel.classList.remove("is-dragging", "is-resizing");
      this.#persistSessionState();
      if (this.#floatingInteractionCleanup === stop) this.#floatingInteractionCleanup = null;
    };
    view.addEventListener("pointermove", update);
    view.addEventListener("pointerup", stop);
    view.addEventListener("pointercancel", stop);
    this.#floatingInteractionCleanup = stop;
  }

  #onWindowResize = (): void => {
    for (const preview of this.#linkPreviews.keys()) this.#constrainLinkPreview(preview);
    const launcher = this.shadowRoot?.querySelector<HTMLElement>(".launcher");
    if (launcher && this.#launcherPosition) {
      this.#applyLauncherGeometry(launcher);
      this.#persistSessionState();
    }
    if (this.#position !== "floating") return;
    const panel = this.shadowRoot?.querySelector<HTMLElement>(".panel");
    if (panel) {
      this.#applyFloatingGeometry(panel);
      this.#persistSessionState();
    }
  };

  #onKeydown = (event: KeyboardEvent): void => {
    event.stopPropagation();
    if (!this.#open) return;
    if (event.key === "Escape") {
      event.preventDefault();
      if (this.#activeLinkPreview) {
        this.#clearLinkPreview(this.#activeLinkPreview);
        return;
      }
      this.close();
      return;
    }
    if (event.key === "Tab") {
      const focusables = this.#panelFocusables();
      if (!focusables.length) return;
      const active = this.shadowRoot?.activeElement;
      const first = focusables[0]!;
      const last = focusables.at(-1)!;
      if (event.shiftKey && (active === first || !focusables.includes(active as HTMLElement))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || !focusables.includes(active as HTMLElement))) {
        event.preventDefault();
        first.focus();
      }
    }
  };

  #onKeyup = (event: KeyboardEvent): void => {
    event.stopPropagation();
  };

  #setView(view: View): void {
    this.#view = view;
    this.#render();
    queueMicrotask(() => this.shadowRoot?.querySelector<HTMLButtonElement>(`[data-view="${view}"]`)?.focus());
  }

  async #copyCurrent(): Promise<void> {
    if (!this.#result) return;
    const text = this.#view === "json" ? serializeJsonLd(this.#result) : serializeTurtle(this.#result);
    try {
      await navigator.clipboard.writeText(text);
      this.#status = "Copied to clipboard";
    } catch {
      this.#status = "Clipboard access was not available";
    }
    const status = this.shadowRoot?.querySelector<HTMLElement>(".sr-only");
    if (status) status.textContent = this.#status;
  }

  #locateElement(target: Element): void {
    this.#clearLocateEmphasis();
    const element = target as HTMLElement;
    const reducedMotion = element.ownerDocument.defaultView?.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    element.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "center" });
    if (!reducedMotion) {
      this.#locateAnimation = element.animate?.(
        [
          { outline: "3px solid transparent", outlineOffset: "8px" },
          { outline: "3px solid oklch(62% 0.18 294)", outlineOffset: "4px", offset: 0.16 },
          { outline: "3px solid transparent", outlineOffset: "8px" },
        ],
        { duration: 1800, easing: "cubic-bezier(.22,1,.36,1)" },
      ) ?? null;
    }
  }

  #locateSparqlResource(semanticIri: string, event: MouseEvent): void {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const sourceDocumentIri = this.#result?.sourceDocumentIri ?? this.ownerDocument.URL;
    const localUrl = localDocumentUrl(this.ownerDocument, semanticIri, sourceDocumentIri);
    if (!localUrl) return;
    const directTarget = locatableElementForUrl(this.ownerDocument, localUrl);
    const semanticTarget = this.#result?.quads
      .filter((quad) => quad.subject.termType === "NamedNode" && quad.subject.value === semanticIri)
      .map((quad) => quad.source)
      .find((source) => isLocatableSource(source));
    const target = directTarget ?? semanticTarget;
    if (!target) return;
    event.preventDefault();
    const view = this.ownerDocument.defaultView;
    if (view) {
      const currentUrl = new URL(this.ownerDocument.URL);
      currentUrl.hash = localUrl.hash;
      view.history.pushState(null, "", currentUrl.href);
    }
    this.#locateElement(target);
  }

  #clearLocateEmphasis(): void {
    this.#locateAnimation?.cancel();
    this.#locateAnimation = null;
  }

  #configureNavigatorSync(
    viewport: HTMLElement,
    rows: NavigatorRow[],
    applyFilter: () => void,
    setHoveredSource: (source: Element | null) => void,
  ): void {
    this.#clearNavigatorSync();
    if (this.#syncMode === "off") return;
    const view = this.ownerDocument.defaultView;
    if (!view) return;
    const cleanups: Array<() => void> = [];
    let timer: number | null = null;
    let activeAnimation: Animation | null = null;
    let lastFollowedSource: Element | null = null;
    const listen = (
      target: EventTarget,
      type: string,
      listener: EventListener,
      options?: AddEventListenerOptions,
    ): void => {
      target.addEventListener(type, listener, options);
      cleanups.push(() => target.removeEventListener(type, listener, options));
    };
    const schedule = (callback: () => void): void => {
      if (timer !== null) view.clearTimeout(timer);
      timer = view.setTimeout(() => {
        timer = null;
        callback();
      }, 32);
    };
    const sourceRows = new Map<Element, NavigatorRow[]>();
    for (const row of rows) {
      const entries = sourceRows.get(row.quad.source) ?? [];
      entries.push(row);
      sourceRows.set(row.quad.source, entries);
    }
    const emphasizeSource = (source: Element): void => {
      activeAnimation?.cancel();
      if (view.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
      activeAnimation = source.animate?.(
        [
          { outline: "2px solid transparent", outlineOffset: "7px" },
          { outline: "2px solid oklch(62% 0.18 294)", outlineOffset: "4px" },
        ],
        { direction: "alternate", duration: 520, easing: "cubic-bezier(.22,1,.36,1)", iterations: Infinity },
      ) ?? null;
    };
    const clearEmphasis = (): void => {
      activeAnimation?.cancel();
      activeAnimation = null;
    };

    const sourceAncestors = (target: EventTarget | null): Element[] => {
      const found: Element[] = [];
      let element = target instanceof Element ? target : null;
      while (element) {
        if (sourceRows.has(element)) found.push(element);
        element = element.parentElement;
      }
      return found;
    };
    const handleSourcePointerOver = (event: PointerEvent): void => {
      for (const source of sourceAncestors(event.target)) {
        if (event.relatedTarget instanceof Node && source.contains(event.relatedTarget)) continue;
        setHoveredSource(source);
        sourceRows.get(source)?.forEach(({ item }) => {
          item.classList.add("is-corresponding");
          item.scrollIntoView?.({ block: "nearest" });
        });
      }
    };
    const handleSourcePointerOut = (event: PointerEvent): void => {
      for (const source of sourceAncestors(event.target)) {
        if (event.relatedTarget instanceof Node && source.contains(event.relatedTarget)) continue;
        sourceRows.get(source)?.forEach(({ item }) => item.classList.remove("is-corresponding"));
        setHoveredSource(null);
      }
    };
    const rowsByItem = new WeakMap<Element, NavigatorRow>(rows.map((row) => [row.item, row]));
    const rowForTarget = (target: EventTarget | null): NavigatorRow | null => {
      if (!(target instanceof Element)) return null;
      const item = target.closest(".quad");
      return item ? rowsByItem.get(item) ?? null : null;
    };
    const handleRowPointerOver = (event: PointerEvent): void => {
      const row = rowForTarget(event.target);
      if (!row || (event.relatedTarget instanceof Node && row.item.contains(event.relatedTarget))) return;
      const source = row.quad.source as HTMLElement;
      row.item.classList.add("is-corresponding");
      emphasizeSource(source);
      if (this.#syncMode === "panel") {
        source.scrollIntoView({ behavior: view.matchMedia?.("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "center" });
      }
    };
    const handleRowPointerOut = (event: PointerEvent): void => {
      const row = rowForTarget(event.target);
      if (!row || (event.relatedTarget instanceof Node && row.item.contains(event.relatedTarget))) return;
      row.item.classList.remove("is-corresponding");
      clearEmphasis();
    };
    listen(this.ownerDocument, "pointerover", handleSourcePointerOver as EventListener);
    listen(this.ownerDocument, "pointerout", handleSourcePointerOut as EventListener);
    listen(viewport, "pointerover", handleRowPointerOver as EventListener);
    listen(viewport, "pointerout", handleRowPointerOut as EventListener);

    if (this.#syncMode === "page") {
      const update = (): void => schedule(applyFilter);
      listen(view, "scroll", update, { passive: true });
      listen(view, "resize", update, { passive: true });
    } else {
      const followNavigator = (): void => {
        const viewportRect = viewport.getBoundingClientRect();
        const readingLine = viewportRect.top + Math.min(viewportRect.height * 0.35, 140);
        let closest: NavigatorRow | null = null;
        let closestDistance = Number.POSITIVE_INFINITY;
        for (const row of rows) {
          if (row.item.hidden) continue;
          const rect = row.item.getBoundingClientRect();
          if (rect.bottom <= viewportRect.top || rect.top >= viewportRect.bottom) continue;
          const distance = Math.abs(rect.top - readingLine);
          if (distance < closestDistance) {
            closest = row;
            closestDistance = distance;
          }
        }
        const source = closest?.quad.source as HTMLElement | undefined;
        if (!source || source === lastFollowedSource || !isLocatableSource(source)) return;
        lastFollowedSource = source;
        source.scrollIntoView({ behavior: "auto", block: "center" });
        emphasizeSource(source);
      };
      listen(viewport, "scroll", () => schedule(followNavigator), { passive: true });
      schedule(followNavigator);
    }

    this.#syncCleanup = () => {
      cleanups.forEach((cleanup) => cleanup());
      if (timer !== null) view.clearTimeout(timer);
      clearEmphasis();
    };
  }

  #toggleSource(
    item: HTMLLIElement,
    button: HTMLButtonElement,
    source: Element,
    includeChildren: boolean,
    sourceId: string,
    equivalentOutput = false,
  ): void {
    const openViewer = item.querySelector<HTMLElement>(".source-code");
    const wasExpanded = openViewer?.dataset.children === String(includeChildren);
    item.querySelectorAll<HTMLButtonElement>(".source-toggle").forEach((toggle) => {
      toggle.setAttribute("aria-expanded", "false");
      const showLabel = toggle.dataset.showLabel;
      if (showLabel) {
        toggle.setAttribute("aria-label", showLabel);
        toggle.title = showLabel;
      }
    });
    item.querySelector(".source-code")?.remove();
    item.classList.remove("source-open");
    if (wasExpanded) return;

    item.classList.add("source-open");
    button.setAttribute("aria-expanded", "true");
    const hideLabel = button.dataset.hideLabel;
    if (hideLabel) {
      button.setAttribute("aria-label", hideLabel);
      button.title = hideLabel;
    }
    const viewer = this.ownerDocument.createElement("section");
    viewer.className = "source-code";
    viewer.id = sourceId;
    viewer.dataset.children = String(includeChildren);
    viewer.setAttribute("aria-label", equivalentOutput ? "Element HTML" : includeChildren ? "Element HTML with children" : "Element HTML without children");
    const label = this.ownerDocument.createElement("p");
    label.className = "source-code-label";
    label.textContent = equivalentOutput ? elementLabel(source) : includeChildren ? `${elementLabel(source)} with children` : `${elementLabel(source)} without children`;
    const clone = source.cloneNode(includeChildren) as Element;
    viewer.append(label, highlightedCode(clone.outerHTML, "html", this.ownerDocument));
    item.append(viewer);
  }

  #renderNavigator(container: HTMLElement, result: ExtractionResult): void {
    if (!result.quads.length) {
      const empty = document.createElement("p");
      empty.className = "empty";
      empty.textContent = "No asserted IA2 statements were found in the document light tree.";
      container.append(empty);
      return;
    }
    const tools = document.createElement("div");
    tools.className = "navigator-tools";
    const filter = document.createElement("div");
    filter.className = "navigator-filter";
    const filterLabel = document.createElement("label");
    filterLabel.className = "sr-only";
    filterLabel.htmlFor = "ia2-navigator-search";
    filterLabel.textContent = "Filter RDF statements";
    const search = document.createElement("input");
    search.className = "navigator-search";
    search.id = "ia2-navigator-search";
    search.type = "search";
    search.placeholder = "Filter statements";
    search.autocomplete = "off";
    search.spellcheck = false;
    search.value = this.#navigatorQuery;
    search.setAttribute("role", "combobox");
    search.setAttribute("aria-autocomplete", "list");
    search.setAttribute("aria-controls", "ia2-navigator-suggestions");
    search.setAttribute("aria-expanded", "false");
    const searchGroup = document.createElement("div");
    searchGroup.className = "navigator-search-group";
    const typeahead = document.createElement("ul");
    typeahead.className = "typeahead";
    typeahead.id = "ia2-navigator-suggestions";
    typeahead.setAttribute("role", "listbox");
    typeahead.setAttribute("aria-label", "Semantic term suggestions");
    typeahead.hidden = true;
    const typeaheadStatus = document.createElement("span");
    typeaheadStatus.className = "sr-only typeahead-status";
    typeaheadStatus.setAttribute("role", "status");
    typeaheadStatus.setAttribute("aria-live", "polite");
    const filterCount = document.createElement("output");
    filterCount.className = "filter-count";
    filterCount.setAttribute("for", search.id);
    filterCount.setAttribute("aria-live", "polite");
    const syncMarkup = document.createElement("div");
    syncMarkup.innerHTML = scrollSyncControlsMarkup({
      current: this.#syncMode,
      controlClass: "sync-control",
      labels: {
        page: "Follow page viewport in Navigator",
        panel: "Follow Navigator in page",
      },
      optionClass: "sync-option",
      switchClass: "sync-switch",
    });
    const syncControl = syncMarkup.firstElementChild as HTMLElement;
    const syncSwitch = syncControl.querySelector<HTMLElement>(".sync-switch")!;
    searchGroup.append(search, typeahead, filterCount, typeaheadStatus);
    filter.append(filterLabel, searchGroup, syncControl);
    tools.append(filter);
    container.append(tools);
    const vocabularies = vocabulariesIn(result);
    const semanticSuggestions = semanticSuggestionsIn(result);
    const namespaceButtons = new Map<string, HTMLButtonElement>();
    let applyFilter = (): void => {};
    if (vocabularies.length) {
      const navigation = document.createElement("nav");
      navigation.className = "vocabularies";
      navigation.setAttribute("aria-label", "Namespaces used in this document");
      const label = document.createElement("p");
      label.className = "vocabularies-label";
      label.textContent = "Namespaces";
      const links = document.createElement("div");
      links.className = "vocabulary-links";
      for (const vocabulary of vocabularies) {
        const control = document.createElement("span");
        control.className = "vocabulary-control";
        const toggle = document.createElement("button");
        toggle.className = "vocabulary-toggle";
        toggle.type = "button";
        toggle.dataset.namespace = vocabulary.namespace;
        const vocabularyLabel = document.createElement("span");
        vocabularyLabel.className = "vocabulary-name";
        vocabularyLabel.textContent = vocabulary.label;
        const vocabularyCount = document.createElement("span");
        vocabularyCount.className = "vocabulary-count";
        vocabularyCount.setAttribute("aria-hidden", "true");
        vocabularyCount.textContent = String(vocabulary.count);
        toggle.append(vocabularyLabel, vocabularyCount);
        toggle.addEventListener("click", () => {
          if (this.#disabledNamespaces.has(vocabulary.namespace)) this.#disabledNamespaces.delete(vocabulary.namespace);
          else this.#disabledNamespaces.add(vocabulary.namespace);
          applyFilter();
        });
        namespaceButtons.set(vocabulary.namespace, toggle);
        const anchor = document.createElement("a");
        anchor.className = "vocabulary-link";
        anchor.href = vocabulary.namespace;
        anchor.target = "_blank";
        anchor.rel = "noopener noreferrer";
        anchor.title = `Open ${vocabulary.namespace} in a new tab`;
        anchor.setAttribute("aria-label", `Open ${vocabulary.namespace} in a new tab`);
        const external = document.createElement("span");
        external.className = "external-mark";
        external.setAttribute("aria-hidden", "true");
        external.textContent = "↗";
        anchor.append(external);
        control.append(toggle, anchor);
        links.append(control);
      }
      navigation.append(label, links);
      tools.append(navigation);
      const updateOverflow = (): void => {
        const maxScroll = Math.max(links.scrollWidth - links.clientWidth, 0);
        navigation.dataset.overflowLeft = String(links.scrollLeft > 1);
        navigation.dataset.overflowRight = String(links.scrollLeft < maxScroll - 1);
      };
      links.addEventListener("scroll", updateOverflow, { passive: true });
      links.addEventListener("pointerenter", updateOverflow);
      links.addEventListener("focusin", updateOverflow);
      const ResizeObserverConstructor = this.ownerDocument.defaultView?.ResizeObserver;
      if (ResizeObserverConstructor) {
        this.#vocabularyResizeObserver = new ResizeObserverConstructor(() => updateOverflow());
        this.#vocabularyResizeObserver.observe(links);
      }
      queueMicrotask(updateOverflow);
    }
    const list = document.createElement("ol");
    list.className = "navigator";
    const carriers = new Set(result.quads.map((quad) => quad.source));
    const localUrlCache = new Map<string, URL | null>();
    const targetCache = new Map<string, Element | null>();
    const delegatedLocalLinks = new WeakMap<HTMLAnchorElement, URL>();
    const delegatedLocateTargets = new WeakMap<HTMLElement, Element>();
    const delegatedSourceToggles = new WeakMap<HTMLButtonElement, {
      equivalentOutput: boolean;
      includeChildren: boolean;
      item: HTMLLIElement;
      source: Element;
      sourceId: string;
    }>();
    const rows: NavigatorRow[] = [];
    result.quads.forEach((quad, index) => {
      const item = document.createElement("li");
      item.className = "quad";
      const depth = rdfCarrierDepth(quad.source, carriers);
      const visualDepth = Math.min(depth, 6);
      item.dataset.depth = String(depth);
      item.style.setProperty("--rdf-indent", `${visualDepth * 16}px`);
      if (depth > 0) {
        const marker = document.createElement("span");
        marker.className = "structure-marker";
        marker.setAttribute("aria-hidden", "true");
        marker.textContent = "↳";
        item.append(marker);
      }
      const terms = document.createElement("div");
      terms.className = "quad-terms";
      const onLocate = (target: Element): void => this.#locateElement(target);
      const subject = termCode(document, quad.subject, "", "subject", onLocate, result.sourceDocumentIri, localUrlCache, targetCache, delegatedLocalLinks, delegatedLocateTargets);
      const predicate = termCode(document, quad.predicate, "   ", "predicate", onLocate, result.sourceDocumentIri, localUrlCache, targetCache, delegatedLocalLinks, delegatedLocateTargets);
      const object = termCode(document, quad.object, "   ", "object", onLocate, result.sourceDocumentIri, localUrlCache, targetCache, delegatedLocalLinks, delegatedLocateTargets);
      terms.append(subject, predicate, object);
      if (quad.graph) {
        const graph = document.createElement("div");
        graph.className = "graph";
        graph.append("Graph: ", termCode(document, quad.graph, "", "", onLocate, result.sourceDocumentIri, localUrlCache, targetCache, delegatedLocalLinks, delegatedLocateTargets));
        terms.append(graph);
      }
      const termTargets = new Set(
        [quad.subject, quad.predicate, quad.object, quad.graph]
          .filter((term): term is SubjectTerm | ObjectTerm | GraphTerm => term !== null)
          .map((term) => locatableElementForTerm(document, term, result.sourceDocumentIri, localUrlCache, targetCache))
          .filter((target): target is Element => target !== null),
      );
      const sourceId = `ia2-source-${index}`;
      const actions = document.createElement("div");
      actions.className = "quad-actions preview-actions";
      actions.setAttribute("role", "group");
      actions.setAttribute("aria-label", `Actions for ${elementLabel(quad.source)}`);
      if (isLocatableSource(quad.source) && !termTargets.has(quad.source)) {
        actions.append(locateButton(document, quad.source, "carrier-locate-button", onLocate, delegatedLocateTargets));
      }
      const hasChildren = hasSerializableChildren(quad.source);
      const createToggle = (includeChildren: boolean, equivalentOutput = false): HTMLButtonElement => {
        const button = document.createElement("button");
        button.className = "row-action-button source-toggle source-glyph";
        button.type = "button";
        button.dataset.children = String(includeChildren);
        button.setAttribute("aria-expanded", "false");
        button.setAttribute("aria-controls", sourceId);
        const mode = equivalentOutput ? "" : includeChildren ? " with child content" : " without child content";
        const showLabel = `Show HTML for ${elementLabel(quad.source)}${mode}`;
        const hideLabel = `Hide HTML for ${elementLabel(quad.source)}${mode}`;
        button.dataset.showLabel = showLabel;
        button.dataset.hideLabel = hideLabel;
        button.setAttribute("aria-label", showLabel);
        button.title = showLabel;
        button.textContent = includeChildren ? "</>+" : "</>";
        delegatedSourceToggles.set(button, {
          equivalentOutput,
          includeChildren,
          item,
          source: quad.source,
          sourceId,
        });
        return button;
      };
      actions.append(createToggle(false, !hasChildren));
      if (hasChildren) actions.append(createToggle(true));
      item.append(terms, actions);
      list.append(item);
      rows.push({ item, namespaces: new Set(namespacesInQuad(quad).map((entry) => entry.namespace)), quad, searchText: quadSearchText(quad) });
    });
    list.addEventListener("click", (event) => {
      if (!(event.target instanceof Element)) return;
      const localLink = event.target.closest<HTMLAnchorElement>("a.local-term");
      const localUrl = localLink ? delegatedLocalLinks.get(localLink) : undefined;
      if (localUrl) {
        navigateLocalDocument(document, localUrl, event);
        return;
      }
      const button = event.target.closest<HTMLButtonElement>("button");
      if (!button) return;
      const locateTarget = delegatedLocateTargets.get(button);
      if (locateTarget) {
        this.#locateElement(locateTarget);
        return;
      }
      const toggle = delegatedSourceToggles.get(button);
      if (toggle) {
        this.#toggleSource(
          toggle.item,
          button,
          toggle.source,
          toggle.includeChildren,
          toggle.sourceId,
          toggle.equivalentOutput,
        );
      }
    });
    list.addEventListener("pointerout", (event) => {
      if (!(event.target instanceof Element)) return;
      const item = event.target.closest(".quad");
      if (!item || (event.relatedTarget instanceof Node && item.contains(event.relatedTarget))) return;
      this.#clearLocateEmphasis();
    });
    container.append(list);
    this.#navigatorRows = rows;
    const noMatches = document.createElement("p");
    noMatches.className = "empty filter-empty";
    noMatches.textContent = "No statements match the active filters.";
    noMatches.hidden = true;
    container.append(noMatches);
    let hoveredSource: Element | null = null;
    applyFilter = (): void => {
      this.#navigatorQuery = search.value;
      const query = search.value.trim().toLocaleLowerCase();
      let matchCount = 0;
      rows.forEach(({ item, namespaces, quad, searchText }) => {
        const matchesNamespace = Array.from(namespaces).every((namespace) => !this.#disabledNamespaces.has(namespace));
        const matchesViewport = this.#syncMode !== "page" || isInPageViewport(quad.source);
        const matches = quad.source === hoveredSource || (matchesNamespace && matchesViewport && (!query || searchText.includes(query)));
        item.hidden = !matches;
        if (matches) matchCount += 1;
      });
      namespaceButtons.forEach((button, namespace) => {
        const active = !this.#disabledNamespaces.has(namespace);
        const count = vocabularies.find((vocabulary) => vocabulary.namespace === namespace)?.count ?? 0;
        const statementLabel = `${count} statement${count === 1 ? "" : "s"}`;
        button.setAttribute("aria-pressed", String(active));
        button.setAttribute("aria-label", `${active ? "Hide" : "Show"} ${statementLabel} using ${namespace}`);
        button.title = button.getAttribute("aria-label")!;
      });
      const hasNamespaceFilter = vocabularies.some((vocabulary) => this.#disabledNamespaces.has(vocabulary.namespace));
      const filtering = Boolean(query) || hasNamespaceFilter || this.#syncMode === "page";
      filterCount.textContent = filtering && matchCount !== rows.length ? `${matchCount} of ${rows.length}` : "";
      noMatches.hidden = !filtering || matchCount > 0;
      list.hidden = filtering && matchCount === 0;
    };
    let visibleSuggestions: SemanticSuggestion[] = [];
    let activeSuggestion = -1;
    const closeTypeahead = (): void => {
      visibleSuggestions = [];
      activeSuggestion = -1;
      typeahead.hidden = true;
      typeahead.replaceChildren();
      search.setAttribute("aria-expanded", "false");
      search.removeAttribute("aria-activedescendant");
      typeaheadStatus.textContent = "";
    };
    const setActiveSuggestion = (index: number): void => {
      if (!visibleSuggestions.length) return;
      activeSuggestion = (index + visibleSuggestions.length) % visibleSuggestions.length;
      const options = Array.from(typeahead.querySelectorAll<HTMLElement>('[role="option"]'));
      options.forEach((option, optionIndex) => option.setAttribute("aria-selected", String(optionIndex === activeSuggestion)));
      const active = options[activeSuggestion];
      if (!active) return;
      search.setAttribute("aria-activedescendant", active.id);
      active.scrollIntoView?.({ block: "nearest" });
    };
    const selectSuggestion = (suggestion: SemanticSuggestion): void => {
      search.value = suggestion.display;
      this.#navigatorQuery = search.value;
      applyFilter();
      closeTypeahead();
    };
    const renderTypeahead = (): void => {
      visibleSuggestions = matchingSemanticSuggestions(semanticSuggestions, search.value);
      activeSuggestion = -1;
      typeahead.replaceChildren();
      search.removeAttribute("aria-activedescendant");
      if (!visibleSuggestions.length || this.shadowRoot?.activeElement !== search) {
        typeahead.hidden = true;
        search.setAttribute("aria-expanded", "false");
        typeaheadStatus.textContent = "";
        return;
      }
      visibleSuggestions.forEach((suggestion, index) => {
        const option = document.createElement("li");
        option.className = "typeahead-option";
        option.id = `ia2-navigator-suggestion-${index}`;
        option.setAttribute("role", "option");
        option.setAttribute("aria-selected", "false");
        const primary = document.createElement("span");
        primary.className = "typeahead-primary";
        const term = document.createElement("span");
        term.className = "typeahead-term";
        term.textContent = suggestion.display;
        primary.append(term);
        if (suggestion.label && suggestion.label !== suggestion.display) {
          const label = document.createElement("span");
          label.className = "typeahead-label";
          label.textContent = suggestion.label;
          primary.append(label);
        }
        const details = semanticSuggestionDetails(suggestion);
        const metadata = document.createElement("span");
        metadata.className = "typeahead-meta";
        metadata.textContent = details.join(" · ");
        option.setAttribute("aria-label", [suggestion.display, suggestion.label, ...details].filter(Boolean).join(", "));
        option.append(primary, metadata);
        option.addEventListener("pointerdown", (event) => event.preventDefault());
        option.addEventListener("pointermove", () => setActiveSuggestion(index));
        option.addEventListener("click", () => selectSuggestion(suggestion));
        typeahead.append(option);
      });
      typeahead.hidden = false;
      search.setAttribute("aria-expanded", "true");
      typeaheadStatus.textContent = `${visibleSuggestions.length} semantic suggestion${visibleSuggestions.length === 1 ? "" : "s"} available.`;
    };
    search.addEventListener("input", () => {
      applyFilter();
      renderTypeahead();
    });
    search.addEventListener("focus", renderTypeahead);
    search.addEventListener("blur", () => {
      this.ownerDocument.defaultView?.setTimeout(() => {
        if (this.shadowRoot?.activeElement !== search) closeTypeahead();
      }, 0);
    });
    search.addEventListener("keydown", (event) => {
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        if (typeahead.hidden) renderTypeahead();
        if (!visibleSuggestions.length) return;
        event.preventDefault();
        event.stopPropagation();
        setActiveSuggestion(activeSuggestion + (event.key === "ArrowDown" ? 1 : -1));
        return;
      }
      if (event.key === "Enter" && activeSuggestion >= 0) {
        event.preventDefault();
        event.stopPropagation();
        selectSuggestion(visibleSuggestions[activeSuggestion]!);
        return;
      }
      if (event.key === "Escape" && !typeahead.hidden) {
        event.preventDefault();
        event.stopPropagation();
        closeTypeahead();
        return;
      }
      if (event.key === "Tab") closeTypeahead();
    });
    const configureSync = (): void => {
      this.#configureNavigatorSync(container, rows, applyFilter, (source) => {
        hoveredSource = source;
        applyFilter();
      });
    };
    const setSyncMode = (mode: SyncMode, focus = false): void => {
      this.#syncMode = mode;
      hoveredSource = null;
      updateScrollSyncControls(syncSwitch, mode, focus);
      applyFilter();
      configureSync();
    };
    this.#resetSyncControl = () => setSyncMode("off");
    bindScrollSyncControls(syncSwitch, (mode, focus) => setSyncMode(mode, focus));
    applyFilter();
    configureSync();
  }

  #renderShapes(container: HTMLElement): void {
    const result = this.#result;
    if (!result || !this.#shaclCatalog.count) return;
    const document = this.ownerDocument;
    const browser = document.createElement("div");
    browser.className = "shapes-browser";

    const intro = document.createElement("p");
    intro.className = "shapes-intro";
    intro.textContent = "Shape definitions found in the extracted dataset. This view exposes targets, paths, groups, and constraints; it does not run SHACL validation or rules.";
    browser.append(intro);

    const tools = document.createElement("div");
    tools.className = "shapes-tools";
    const search = document.createElement("input");
    search.className = "shapes-search";
    search.type = "search";
    search.placeholder = "Filter shapes, paths, targets, or constraints";
    search.setAttribute("aria-label", search.placeholder);
    search.value = this.#shapesQuery;
    const filterCount = document.createElement("span");
    filterCount.className = "shapes-filter-count";
    tools.append(search, filterCount);
    browser.append(tools);

    const labels = termLabelMap(result.quads, {
      predicates: SPARQL_LABEL_PREDICATES,
      languages: [document.documentElement.lang || "en"],
    });
    const shapeLabel = (shape: ShaclShape): string => shape.label ?? readableResourceName(shape.term);

    const termValue = (term: ObjectTerm | GraphTerm): HTMLElement => {
      const value = document.createElement("div");
      value.className = "shape-value";
      if (term.termType === "Literal") {
        const literal = document.createElement("span");
        literal.className = "shape-literal";
        literal.textContent = term.value;
        value.append(literal);
        if (term.datatype.value !== XSD_STRING || term.language || term.direction) {
          const qualifier = document.createElement("code");
          qualifier.textContent = [
            term.language ? `@${term.language}${term.direction ? `--${term.direction}` : ""}` : "",
            term.datatype.value !== XSD_STRING ? compactTerm(term.datatype) : "",
          ].filter(Boolean).join(" · ");
          value.append(qualifier);
        }
        return value;
      }
      const label = labels.get(resourceKey(term)!);
      if (label) {
        const readable = document.createElement("span");
        readable.className = "shape-value-label";
        readable.textContent = label;
        value.append(readable);
      }
      value.append(termCode(document, term, "", "", undefined, result.sourceDocumentIri));
      return value;
    };

    const factBlock = (
      parent: HTMLElement,
      title: string,
      quads: readonly Quad[],
    ): void => {
      if (!quads.length) return;
      const block = document.createElement("section");
      block.className = "shape-block";
      const heading = document.createElement("h4");
      heading.textContent = title;
      const facts = document.createElement("dl");
      facts.className = "shape-facts";
      const grouped = new Map<string, Quad[]>();
      for (const quad of quads) {
        const key = quad.predicate.value;
        const values = grouped.get(key) ?? [];
        values.push(quad);
        grouped.set(key, values);
      }
      for (const [predicate, values] of grouped) {
        const fact = document.createElement("div");
        fact.className = "shape-fact";
        const name = document.createElement("dt");
        name.textContent = shaclPredicateLabel(predicate);
        const objects = document.createElement("dd");
        values.forEach((quad) => objects.append(termValue(quad.object)));
        fact.append(name, objects);
        facts.append(fact);
      }
      block.append(heading, facts);
      parent.append(block);
    };

    const definitionBlock = (parent: HTMLElement, shape: ShaclShape): void => {
      const block = document.createElement("section");
      block.className = "shape-block";
      const heading = document.createElement("h4");
      heading.textContent = "Definition";
      const facts = document.createElement("dl");
      facts.className = "shape-facts";
      const definition = document.createElement("div");
      definition.className = "shape-fact";
      const definitionName = document.createElement("dt");
      definitionName.textContent = "Shape";
      const definitionValue = document.createElement("dd");
      definitionValue.append(termValue(shape.term));
      definition.append(definitionName, definitionValue);
      facts.append(definition);
      if (shape.graphs.length) {
        const graph = document.createElement("div");
        graph.className = "shape-fact";
        const graphName = document.createElement("dt");
        graphName.textContent = shape.graphs.length === 1 ? "Graph" : "Graphs";
        const graphValue = document.createElement("dd");
        shape.graphs.forEach((term) => graphValue.append(termValue(term)));
        graph.append(graphName, graphValue);
        facts.append(graph);
      }
      block.append(heading, facts);
      parent.append(block);
    };

    const rows: HTMLDetailsElement[] = [];
    const shapesByGroup = new Map<string, ShaclShape[]>();
    for (const shape of this.#shaclCatalog.shapes) {
      const key = shape.group ? resourceKey(shape.group)! : "";
      const shapes = shapesByGroup.get(key) ?? [];
      shapes.push(shape);
      shapesByGroup.set(key, shapes);
    }
    const orderedGroups = [
      ...this.#shaclCatalog.groups.map((group) => ({
        key: resourceKey(group.term)!,
        label: group.label ?? readableResourceName(group.term),
      })),
      { key: "", label: "Ungrouped shapes" },
    ];

    for (const group of orderedGroups) {
      const shapes = shapesByGroup.get(group.key) ?? [];
      if (!shapes.length) continue;
      const section = document.createElement("section");
      section.className = "shape-group";
      const groupHeading = document.createElement("header");
      groupHeading.className = "shape-group-heading";
      const title = document.createElement("h3");
      title.textContent = group.label;
      const count = document.createElement("span");
      count.className = "shape-group-count";
      count.textContent = `${shapes.length} ${shapes.length === 1 ? "shape" : "shapes"}`;
      groupHeading.append(title, count);
      const list = document.createElement("div");
      list.className = "shape-list";

      for (const shape of shapes) {
        const details = document.createElement("details");
        details.className = "shape-row";
        const name = shapeLabel(shape);
        const searchText = [
          name,
          compactTerm(shape.term),
          group.label,
          ...shape.quads.flatMap((quad) => [
            quad.predicate.value,
            termSearchText(quad.object),
          ]),
        ].join(" ").toLocaleLowerCase();
        details.dataset.search = searchText;

        const summary = document.createElement("summary");
        const summaryCopy = document.createElement("span");
        summaryCopy.className = "shape-summary-copy";
        const shapeName = document.createElement("span");
        shapeName.className = "shape-name";
        shapeName.textContent = name;
        const identifier = document.createElement("span");
        identifier.className = "shape-identifier";
        identifier.textContent = compactTerm(shape.term);
        const metadata = document.createElement("span");
        metadata.className = "shape-summary-meta";
        const kind = document.createElement("span");
        kind.className = "shape-kind";
        kind.textContent = shapeKindLabel(shape);
        metadata.append(kind);
        if (shape.targets.length) {
          const targetCount = document.createElement("span");
          targetCount.className = "shape-stat";
          targetCount.textContent = `${shape.targets.length} ${shape.targets.length === 1 ? "target" : "targets"}`;
          metadata.append(targetCount);
        }
        if (shape.paths.length) {
          const pathCount = document.createElement("span");
          pathCount.className = "shape-stat";
          pathCount.textContent = `${shape.paths.length} ${shape.paths.length === 1 ? "path" : "paths"}`;
          metadata.append(pathCount);
        }
        if (shape.constraints.length) {
          const constraintCount = document.createElement("span");
          constraintCount.className = "shape-stat";
          constraintCount.textContent = `${shape.constraints.length} ${shape.constraints.length === 1 ? "constraint" : "constraints"}`;
          metadata.append(constraintCount);
        }
        summaryCopy.append(shapeName, identifier, metadata);
        summary.append(summaryCopy);

        const detail = document.createElement("div");
        detail.className = "shape-detail";
        if (shape.description) {
          const description = document.createElement("p");
          description.className = "shape-description";
          description.textContent = shape.description;
          detail.append(description);
        }

        const relatedIris = new Set(annotationTargetIris(result.quads, shape.term));
        for (const target of shape.targets) {
          if (
            target.predicate.value === "http://www.w3.org/ns/shacl#targetNode"
            && target.object.termType === "NamedNode"
          ) relatedIris.add(target.object.value);
        }
        const relatedTargets = Array.from(relatedIris)
          .flatMap((iri) => {
            const target = locatableElementForTerm(
              document,
              { termType: "NamedNode", value: iri },
              result.sourceDocumentIri,
            );
            return target ? [target] : [];
          })
          .filter((target, index, targets) => targets.indexOf(target) === index);
        if (relatedTargets.length) {
          const actions = document.createElement("div");
          actions.className = "shape-actions";
          relatedTargets.slice(0, 4).forEach((target) => {
            const locate = document.createElement("button");
            locate.className = "shape-locate";
            locate.type = "button";
            locate.textContent = `⌖ Locate ${elementLabel(target)}`;
            locate.addEventListener("click", () => this.#locateElement(target));
            actions.append(locate);
          });
          detail.append(actions);
        }

        definitionBlock(detail, shape);
        factBlock(detail, "Targets", shape.targets);
        factBlock(detail, "Path", shape.paths);
        factBlock(detail, "Property shapes", shape.properties);
        factBlock(detail, "Constraints", shape.constraints);
        details.append(summary, detail);
        list.append(details);
        rows.push(details);
      }
      section.append(groupHeading, list);
      browser.append(section);
    }

    const empty = document.createElement("p");
    empty.className = "shapes-empty";
    empty.textContent = "No shapes match this filter.";
    empty.hidden = true;
    browser.append(empty);
    container.append(browser);

    const applyFilter = (): void => {
      this.#shapesQuery = search.value;
      const query = search.value.trim().toLocaleLowerCase();
      let visible = 0;
      rows.forEach((row) => {
        const matches = !query || row.dataset.search?.includes(query);
        row.hidden = !matches;
        if (matches) visible += 1;
      });
      browser.querySelectorAll<HTMLElement>(".shape-group").forEach((section) => {
        section.hidden = !Array.from(section.querySelectorAll<HTMLDetailsElement>(".shape-row"))
          .some((row) => !row.hidden);
      });
      filterCount.textContent = query && visible !== rows.length ? `${visible} of ${rows.length}` : `${rows.length} shapes`;
      empty.hidden = visible > 0;
    };
    search.addEventListener("input", applyFilter);
    applyFilter();
  }

  #renderDiagnostics(container: HTMLElement, diagnostics: Diagnostic[]): void {
    if (!diagnostics.length) {
      const empty = document.createElement("p");
      empty.className = "empty";
      empty.textContent = "No extraction diagnostics. The document passed the checks implemented by this preview extractor.";
      container.append(empty);
      return;
    }
    const list = document.createElement("ul");
    list.className = "diagnostics";
    for (const diagnostic of diagnostics) {
      const item = document.createElement("li");
      item.className = "diagnostic";
      const heading = document.createElement("strong");
      heading.textContent = `${diagnostic.severity.toUpperCase()} · ${diagnostic.code}`;
      const message = document.createElement("p");
      message.textContent = diagnostic.source ? `${diagnostic.message} Source: ${elementLabel(diagnostic.source)}` : diagnostic.message;
      item.append(heading, message);
      list.append(item);
    }
    container.append(list);
  }

  #configureVocabularyTreeInteractions(bindings: VocabularyRowBinding[]): void {
    this.#clearVocabularyTreeInteractions();
    const view = this.ownerDocument.defaultView;
    if (!view || !bindings.length) return;
    const cleanups: Array<() => void> = [];
    const rowsByTarget = new Map<Element, HTMLElement[]>();
    let activeAnimation: Animation | null = null;
    const listen = (target: EventTarget, type: string, listener: EventListener): void => {
      target.addEventListener(type, listener);
      cleanups.push(() => target.removeEventListener(type, listener));
    };
    const emphasize = (target: Element): void => {
      activeAnimation?.cancel();
      if (view.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
      activeAnimation = target.animate?.(
        [
          { outline: "2px solid transparent", outlineOffset: "7px" },
          { outline: "2px solid oklch(62% 0.18 294)", outlineOffset: "4px" },
        ],
        { direction: "alternate", duration: 520, easing: "cubic-bezier(.22,1,.36,1)", iterations: Infinity },
      ) ?? null;
    };
    const clearEmphasis = (): void => {
      activeAnimation?.cancel();
      activeAnimation = null;
    };

    for (const binding of bindings) {
      const matchingRows = rowsByTarget.get(binding.target) ?? [];
      matchingRows.push(binding.item);
      rowsByTarget.set(binding.target, matchingRows);
      listen(binding.item, "pointerenter", () => emphasize(binding.target));
      listen(binding.item, "pointerleave", clearEmphasis);
    }
    rowsByTarget.forEach((rows, target) => {
      listen(target, "pointerenter", () => {
        rows.forEach((row) => {
          row.classList.add("is-corresponding");
          row.scrollIntoView?.({ block: "nearest" });
        });
      });
      listen(target, "pointerleave", () => rows.forEach((row) => row.classList.remove("is-corresponding")));
    });

    this.#vocabularyTreeCleanup = () => {
      cleanups.forEach((cleanup) => cleanup());
      clearEmphasis();
    };
  }

  #renderVocabulary(container: HTMLElement): void {
    const document = this.ownerDocument;
    const sourceDocumentIri = this.#sourceResult?.sourceDocumentIri ?? document.URL;
    const bindings: VocabularyRowBinding[] = [];
    const intro = document.createElement("p");
    intro.className = "ontology-intro";
    intro.textContent = "Classes and properties defined by this document. The trees follow RDFS hierarchy statements; muted parent terms provide external context.";
    container.append(intro);

    const renderGroup = (
      title: string,
      definitions: VocabularyDefinition[],
      kind: VocabularyKind,
    ): void => {
      if (!definitions.length) return;
      const section = document.createElement("section");
      section.className = "ontology-section";
      section.setAttribute("aria-label", title);
      const heading = document.createElement("div");
      heading.className = "ontology-heading";
      const headingText = document.createElement("h3");
      headingText.textContent = title;
      const count = document.createElement("span");
      count.className = "ontology-count";
      count.textContent = `${definitions.length} defined`;
      heading.append(headingText, count);
      section.append(heading);

      const byIri = new Map(definitions.map((definition) => [definition.term.value, definition]));
      const children = new Map<string, VocabularyDefinition[]>();
      const parentsFor = (definition: VocabularyDefinition) => kind === "class" ? definition.classParents : definition.propertyParents;
      for (const definition of definitions) {
        for (const parent of parentsFor(definition)) {
          const entries = children.get(parent.value) ?? [];
          if (!entries.some((entry) => entry.term.value === definition.term.value)) entries.push(definition);
          children.set(parent.value, entries);
        }
      }
      const sortDefinitions = (values: VocabularyDefinition[]): VocabularyDefinition[] => [...values]
        .sort((left, right) => (left.label ?? left.term.value).localeCompare(right.label ?? right.term.value));
      children.forEach((values, parent) => children.set(parent, sortDefinitions(values)));
      const presented = new Set<string>();
      const onLocate = (target: Element): void => this.#locateElement(target);

      const renderNode = (
        term: VocabularyDefinition["term"],
        definition: VocabularyDefinition | null,
        path: ReadonlySet<string>,
        cycle = false,
      ): HTMLLIElement => {
        const item = document.createElement("li");
        item.className = "ontology-node";
        const row = document.createElement("div");
        row.className = `ontology-term-row${definition ? "" : " ontology-context"}`;
        row.dataset.term = term.value;
        const copy = document.createElement("div");
        copy.className = "ontology-term-copy";
        copy.append(termCode(document, term, "", "", undefined, sourceDocumentIri));
        if (definition?.label) {
          const label = document.createElement("div");
          label.className = "ontology-label";
          label.textContent = definition.label;
          copy.append(label);
        }
        const metadata = document.createElement("div");
        metadata.className = "ontology-meta";
        if (!definition) metadata.textContent = "External parent";
        else if (cycle) metadata.textContent = "Cycle reference";
        else if (definition.types.length) metadata.textContent = definition.types.map((type) => compactTerm(type)).join(" · ");
        if (metadata.textContent) copy.append(metadata);
        row.append(copy);

        if (definition) {
          presented.add(definition.term.value);
          const target = definitionTarget(document, definition, sourceDocumentIri);
          if (target) {
            const actions = document.createElement("div");
            actions.className = "ontology-actions";
            actions.append(locateButton(document, target, "ontology-locate-button", onLocate));
            row.append(actions);
            bindings.push({ item: row, target });
          }
        }
        item.append(row);

        if (cycle) return item;
        const descendants = children.get(term.value) ?? [];
        if (descendants.length) {
          const subtree = document.createElement("ul");
          subtree.className = "ontology-children";
          const nextPath = new Set(path);
          nextPath.add(term.value);
          for (const child of descendants) {
            subtree.append(renderNode(child.term, child, nextPath, nextPath.has(child.term.value)));
          }
          item.append(subtree);
        }
        return item;
      };

      const tree = document.createElement("ul");
      tree.className = "ontology-tree";
      const externalParents = new Map<string, VocabularyDefinition["term"]>();
      for (const definition of definitions) {
        for (const parent of parentsFor(definition)) {
          if (!byIri.has(parent.value)) externalParents.set(parent.value, parent);
        }
      }
      for (const parent of Array.from(externalParents.values()).sort((left, right) => left.value.localeCompare(right.value))) {
        tree.append(renderNode(parent, null, new Set()));
      }
      const roots = sortDefinitions(definitions.filter((definition) => parentsFor(definition).length === 0));
      for (const root of roots) tree.append(renderNode(root.term, root, new Set()));
      for (const definition of definitions) {
        if (!presented.has(definition.term.value)) tree.append(renderNode(definition.term, definition, new Set()));
      }
      section.append(tree);
      container.append(section);
    };

    renderGroup("Classes", this.#documentVocabulary.classes, "class");
    renderGroup("Properties", this.#documentVocabulary.properties, "property");
    this.#configureVocabularyTreeInteractions(bindings);
  }

  #renderDiscovery(container: HTMLElement): void {
    const document = this.ownerDocument;
    const intro = document.createElement("p");
    intro.className = "discovery-intro";
    intro.textContent = "Additional knowledge advertised by this document. Loading is explicit, sends no credentials or referrer, does not run scripts, and keeps the retrieved contribution in a separate named graph.";
    container.append(intro);

    const list = document.createElement("ul");
    list.className = "discovery-list";
    for (const candidate of this.#discoveryCandidates) {
      const state = this.#discoveryLoads.get(candidate.id);
      const stateName = state?.status ?? "available";
      const item = document.createElement("li");
      item.className = "discovery-item";
      item.dataset.candidateId = candidate.id;

      const copy = document.createElement("div");
      copy.className = "discovery-copy";
      const target = document.createElement("a");
      target.className = "discovery-target";
      target.href = candidate.target.value;
      target.target = "_blank";
      target.rel = "noopener noreferrer";
      target.textContent = candidate.target.value;
      target.title = `Open ${candidate.target.value} in a new tab`;
      const context = document.createElement("p");
      context.className = "discovery-context";
      context.textContent = `About ${compactTerm(candidate.context)}`;
      copy.append(target, context);

      const metadata = document.createElement("div");
      metadata.className = "discovery-meta";
      for (const predicate of candidate.predicates) {
        const chip = document.createElement("span");
        chip.className = "discovery-chip";
        chip.textContent = compactTerm(predicate);
        chip.title = predicate.value;
        metadata.append(chip);
      }
      for (const role of candidate.roles) {
        const chip = document.createElement("span");
        chip.className = "discovery-chip role";
        chip.textContent = compactTerm(role);
        chip.title = role.value;
        metadata.append(chip);
      }
      if (candidate.graph) {
        const chip = document.createElement("span");
        chip.className = "discovery-chip";
        chip.textContent = `graph ${compactTerm(candidate.graph)}`;
        metadata.append(chip);
      }
      if (metadata.childElementCount) copy.append(metadata);

      const controls = document.createElement("div");
      controls.className = "discovery-state";
      const status = document.createElement("span");
      status.className = "discovery-status";
      status.dataset.state = stateName;
      if (!state) status.textContent = "Available";
      if (state?.status === "loading") status.textContent = "Retrieving HTML/RDF…";
      if (state?.status === "error") status.textContent = state.message ?? "Retrieval failed.";
      if (state?.status === "loaded") {
        const count = state.contribution?.result.quads.length ?? 0;
        status.textContent = `${count} statement${count === 1 ? "" : "s"} loaded`;
      }
      const action = document.createElement("button");
      action.className = "discovery-action";
      action.type = "button";
      action.dataset.candidateId = candidate.id;
      action.dataset.state = stateName;
      if (!state) action.textContent = "Load";
      if (state?.status === "loading") action.textContent = "Cancel";
      if (state?.status === "error") action.textContent = "Retry";
      if (state?.status === "loaded") action.textContent = "Remove";
      action.setAttribute("aria-describedby", `${candidate.id}-status`);
      status.id = `${candidate.id}-status`;
      action.addEventListener("click", () => void this.#loadDiscoveryContribution(candidate));
      controls.append(status, action);
      item.append(copy, controls);
      list.append(item);
    }
    container.append(list);
  }

  #renderSources(container: HTMLElement): void {
    const intro = this.ownerDocument.createElement("p");
    intro.className = "sources-intro";
    intro.textContent = "Inspect one document at a time. Sources remain separate so blank nodes, bases, and document identity are not silently merged.";
    const list = this.ownerDocument.createElement("ul");
    list.className = "source-list";
    for (const source of this.#sources) {
      const item = this.ownerDocument.createElement("li");
      item.className = "source-item";
      const label = this.ownerDocument.createElement("label");
      label.className = "source-option";
      const input = this.ownerDocument.createElement("input");
      input.className = "source-input";
      input.type = "radio";
      input.name = "ia2-navigator-source";
      input.checked = source.id === this.#selectedSourceId;
      input.dataset.sourceId = source.id;
      input.addEventListener("change", () => this.#selectSource(source.id));
      const copy = this.ownerDocument.createElement("span");
      copy.className = "source-copy";
      const title = this.ownerDocument.createElement("strong");
      title.className = "source-title";
      title.textContent = source.label;
      const url = this.ownerDocument.createElement("span");
      url.className = "source-url";
      url.textContent = source.url;
      const access = this.ownerDocument.createElement("span");
      access.className = "source-access";
      const accessLabel = source.access === "direct"
        ? "DOM correlation available"
        : "Collected from an isolated frame; source locations are read-only";
      access.textContent = `${source.origin} · ${accessLabel}`;
      copy.append(title, url, access);
      const count = this.ownerDocument.createElement("span");
      count.className = "source-count";
      count.textContent = `${source.result.quads.length} statement${source.result.quads.length === 1 ? "" : "s"}`;
      label.append(input, copy, count);
      item.append(label);
      list.append(item);
    }
    container.append(intro, list);
  }

  #redrawPreservingFocus(): void {
    const focus = this.#captureFocus();
    this.#render();
    if (focus) queueMicrotask(() => this.#restoreFocus(focus));
  }

  #appendSparqlTerm(container: HTMLElement, term: SparqlResultTerm | undefined): void {
    if (!term) {
      const unbound = this.ownerDocument.createElement("span");
      unbound.className = "sparql-unbound";
      unbound.textContent = "—";
      container.append(unbound);
      return;
    }
    if (term.termType === "NamedNode" || term.termType === "BlankNode") {
      const explicitLabel = this.#sparqlResourceLabels.get(`${term.termType}:${term.value}`);
      if (term.termType === "BlankNode" && !explicitLabel) {
        const identifier = this.ownerDocument.createElement("code");
        identifier.textContent = `_:${term.value}`;
        container.append(identifier);
        return;
      }
      const resource = this.ownerDocument.createElement("span");
      resource.className = "sparql-resource-term";
      const readableLabel = term.termType === "NamedNode"
        ? this.ownerDocument.createElement("a")
        : this.ownerDocument.createElement("span");
      readableLabel.className = "sparql-resource-label";
      readableLabel.textContent = explicitLabel ?? readableLabelForIri(term.value);
      if (readableLabel instanceof HTMLAnchorElement) {
        const compactIriValue = compactIri(term.value);
        const sourceDocumentIri = this.#result?.sourceDocumentIri ?? this.ownerDocument.URL;
        const localUrl = localDocumentUrl(this.ownerDocument, term.value, sourceDocumentIri);
        readableLabel.dataset.semanticIri = term.value;
        readableLabel.href = this.#result
          ? retrievalUrlForSemanticIri(term.value, this.#result)
          : term.value;
        if (localUrl) {
          readableLabel.classList.add("local-term");
          readableLabel.addEventListener("click", (event) => this.#locateSparqlResource(term.value, event));
        } else {
          readableLabel.target = "_blank";
          readableLabel.rel = "noopener noreferrer";
        }
        readableLabel.title = term.value;
        readableLabel.setAttribute("aria-label", `${readableLabel.textContent} (${compactIriValue})`);
      } else {
        readableLabel.title = `_:${term.value}`;
      }
      resource.append(readableLabel);
      container.append(resource);
      return;
    }
    if (term.termType === "DefaultGraph") {
      const code = this.ownerDocument.createElement("code");
      code.textContent = "default graph";
      container.append(code);
    } else if (term.termType === "Literal") {
      const literal = this.ownerDocument.createElement("span");
      literal.className = "sparql-literal";
      const value = this.ownerDocument.createElement("span");
      value.className = "sparql-literal-value";
      value.textContent = term.value || "Empty string";
      const suffix = term.language
        ? `@${term.language}${term.direction ? `--${term.direction}` : ""}`
        : term.datatype && term.datatype !== XSD_STRING
          ? `^^${compactTerm({ termType: "NamedNode", value: term.datatype })}`
          : "";
      literal.append(value);
      if (suffix) {
        const qualifier = this.ownerDocument.createElement("code");
        qualifier.className = "sparql-literal-qualifier";
        qualifier.textContent = suffix;
        literal.append(qualifier);
      }
      container.append(literal);
    } else {
      const code = this.ownerDocument.createElement("code");
      code.textContent = term.value;
      container.append(code);
    }
  }

  #appendSparqlTable(
    container: HTMLElement,
    variables: readonly string[],
    rows: readonly Record<string, SparqlResultTerm>[],
  ): void {
    const wrap = this.ownerDocument.createElement("div");
    wrap.className = "sparql-table-wrap";
    const table = this.ownerDocument.createElement("table");
    table.className = "sparql-table";
    const head = table.createTHead().insertRow();
    for (const variable of variables) {
      const cell = this.ownerDocument.createElement("th");
      cell.scope = "col";
      cell.textContent = `?${variable}`;
      head.append(cell);
    }
    const body = table.createTBody();
    for (const row of rows) {
      const tableRow = body.insertRow();
      for (const variable of variables) {
        this.#appendSparqlTerm(tableRow.insertCell(), row[variable]);
      }
    }
    wrap.append(table);
    container.append(wrap);
  }

  #appendPaginatedSparqlTable(
    container: HTMLElement,
    variables: readonly string[],
    rows: readonly Record<string, SparqlResultTerm>[],
    noun: string,
  ): void {
    const summary = this.ownerDocument.createElement("p");
    summary.className = "sparql-summary";
    const resultBody = this.ownerDocument.createElement("div");
    resultBody.className = "sparql-result-body";
    container.append(summary, resultBody);

    const showPagination = rows.length > SPARQL_PAGE_SIZES[0];
    let pageSize: HTMLSelectElement | null = null;
    let previous: HTMLButtonElement | null = null;
    let next: HTMLButtonElement | null = null;
    let pageStatus: HTMLParagraphElement | null = null;

    if (showPagination) {
      const pagination = this.ownerDocument.createElement("nav");
      pagination.className = "sparql-pagination";
      pagination.setAttribute("aria-label", "SPARQL result pages");

      const pageSizeLabel = this.ownerDocument.createElement("label");
      pageSizeLabel.className = "sparql-page-size-label";
      pageSizeLabel.append("Rows per page");
      pageSize = this.ownerDocument.createElement("select");
      pageSize.className = "sparql-page-size";
      for (const value of SPARQL_PAGE_SIZES) {
        const option = this.ownerDocument.createElement("option");
        option.value = String(value);
        option.textContent = String(value);
        option.selected = value === this.#sparqlPageSize;
        pageSize.append(option);
      }
      pageSizeLabel.append(pageSize);

      pageStatus = this.ownerDocument.createElement("p");
      pageStatus.className = "sparql-page-status";
      pageStatus.setAttribute("aria-live", "polite");

      previous = this.ownerDocument.createElement("button");
      previous.className = "sparql-page-button sparql-page-previous";
      previous.type = "button";
      previous.textContent = "Previous";

      next = this.ownerDocument.createElement("button");
      next.className = "sparql-page-button sparql-page-next";
      next.type = "button";
      next.textContent = "Next";

      pagination.append(pageSizeLabel, pageStatus, previous, next);
      container.append(pagination);
    }

    const renderPage = (): void => {
      const pageCount = Math.max(1, Math.ceil(rows.length / this.#sparqlPageSize));
      this.#sparqlPage = Math.min(Math.max(0, this.#sparqlPage), pageCount - 1);
      const start = this.#sparqlPage * this.#sparqlPageSize;
      const end = Math.min(start + this.#sparqlPageSize, rows.length);
      summary.textContent = showPagination
        ? `Showing ${start + 1} to ${end} of ${rows.length} ${noun}${rows.length === 1 ? "" : "s"}`
        : `${rows.length} ${noun}${rows.length === 1 ? "" : "s"}`;
      resultBody.replaceChildren();
      if (rows.length) this.#appendSparqlTable(resultBody, variables, rows.slice(start, end));
      if (pageStatus) pageStatus.textContent = `Page ${this.#sparqlPage + 1} of ${pageCount}`;
      if (previous) previous.disabled = this.#sparqlPage === 0;
      if (next) next.disabled = this.#sparqlPage === pageCount - 1;
    };

    pageSize?.addEventListener("change", () => {
      const firstVisibleRow = this.#sparqlPage * this.#sparqlPageSize;
      this.#sparqlPageSize = Number(pageSize?.value) || DEFAULT_SPARQL_PAGE_SIZE;
      this.#sparqlPage = Math.floor(firstVisibleRow / this.#sparqlPageSize);
      renderPage();
    });
    previous?.addEventListener("click", () => {
      this.#sparqlPage -= 1;
      renderPage();
    });
    next?.addEventListener("click", () => {
      this.#sparqlPage += 1;
      renderPage();
    });
    renderPage();
  }

  #renderSparqlOutput(container: HTMLElement): void {
    container.className = "sparql-output";
    if (this.#sparqlExecution.status === "idle") {
      const status = this.ownerDocument.createElement("p");
      status.className = "sparql-status";
      status.textContent = "Run the query to inspect its results.";
      container.append(status);
      return;
    }
    if (this.#sparqlExecution.status === "running") {
      const status = this.ownerDocument.createElement("p");
      status.className = "sparql-status";
      status.setAttribute("role", "status");
      status.textContent = "Running locally…";
      container.append(status);
      return;
    }
    if (this.#sparqlExecution.status === "error") {
      const status = this.ownerDocument.createElement("p");
      status.className = "sparql-status";
      status.dataset.state = "error";
      status.setAttribute("role", "alert");
      status.textContent = this.#sparqlExecution.error || "The query could not be run.";
      container.append(status);
      return;
    }

    const result = this.#sparqlExecution.result;
    if (!result) return;
    if (result.kind === "ask") {
      const summary = this.ownerDocument.createElement("p");
      summary.className = "sparql-summary";
      summary.textContent = "ASK result";
      const value = this.ownerDocument.createElement("p");
      value.className = "sparql-boolean";
      value.textContent = String(result.value);
      container.append(summary, value);
      return;
    }
    if (result.kind === "bindings") {
      this.#appendPaginatedSparqlTable(
        container,
        result.variables,
        result.rows,
        "result",
      );
      return;
    }

    this.#appendPaginatedSparqlTable(
      container,
      ["subject", "predicate", "object", "graph"],
      result.quads,
      "statement",
    );
  }

  async #runSparql(): Promise<void> {
    const query = this.#sparqlQuery.trim();
    if (!query || !this.#result || this.#sparqlExecution.status === "running") return;
    const runId = ++this.#sparqlRunId;
    const sourceResult = this.#result;
    this.#sparqlPage = 0;
    this.#sparqlExecution = { status: "running" };
    this.#redrawPreservingFocus();
    try {
      const { executeSparql } = await import("./sparql-engine.js");
      const result = await executeSparql(query, sourceResult);
      if (runId !== this.#sparqlRunId) return;
      this.#sparqlExecution = { result, status: "success" };
      this.#sparqlPresentationSignature = sparqlPresentationSignature(result, this.#sparqlResourceLabels);
    } catch (error) {
      if (runId !== this.#sparqlRunId) return;
      this.#sparqlExecution = {
        error: error instanceof Error ? error.message : "The query could not be run.",
        status: "error",
      };
      this.#sparqlPresentationSignature = "";
    }
    this.#redrawPreservingFocus();
  }

  #renderSparql(container: HTMLElement): void {
    const workbench = this.ownerDocument.createElement("div");
    workbench.className = "sparql-workbench";
    const intro = this.ownerDocument.createElement("p");
    intro.className = "sparql-intro";
    intro.textContent = this.#sparqlSuggestions.length
      ? "Choose a query suggested by this document or write your own. Suggestions are RDF resources, not Navigator configuration."
      : "Write a SPARQL query against the RDF currently extracted from this document.";
    workbench.append(intro);
    if (this.#sparqlSuggestionDiagnostics.length > 0) {
      const diagnostics = this.ownerDocument.createElement("p");
      diagnostics.className = "sparql-status";
      diagnostics.dataset.state = "error";
      diagnostics.setAttribute("role", "alert");
      diagnostics.textContent = this.#sparqlSuggestionDiagnostics.join(" ");
      workbench.append(diagnostics);
    }

    if (this.#sparqlSuggestions.length) {
      const catalog = this.ownerDocument.createElement("div");
      catalog.className = "sparql-catalog";
      const label = this.ownerDocument.createElement("label");
      label.className = "sparql-label";
      label.htmlFor = "ia2-sparql-suggestion";
      label.textContent = "Suggested query";
      const select = this.ownerDocument.createElement("select");
      select.id = "ia2-sparql-suggestion";
      select.className = "sparql-select sparql-suggestion";
      const custom = this.ownerDocument.createElement("option");
      custom.value = "";
      custom.textContent = "Custom query";
      select.append(custom);
      for (const suggestion of this.#sparqlSuggestions) {
        const option = this.ownerDocument.createElement("option");
        option.value = suggestion.id;
        option.textContent = suggestion.label;
        option.selected = suggestion.id === this.#selectedSparqlSuggestionId;
        select.append(option);
      }
      select.addEventListener("change", () => {
        this.#selectedSparqlSuggestionId = select.value;
        const suggestion = this.#sparqlSuggestions.find(({ id }) => id === select.value);
        if (suggestion) this.#sparqlQuery = suggestion.query;
        else this.#sparqlQuery = DEFAULT_SPARQL_QUERY;
        this.#sparqlPage = 0;
        this.#sparqlExecution = { status: "idle" };
        this.#sparqlPresentationSignature = "";
        this.#redrawPreservingFocus();
      });
      catalog.append(label, select);
      const description = this.ownerDocument.createElement("p");
      description.className = "sparql-description";
      description.textContent = this.#sparqlSuggestions.find(({ id }) => id === this.#selectedSparqlSuggestionId)?.description ?? "";
      catalog.append(description);
      workbench.append(catalog);
    }

    const editorLabel = this.ownerDocument.createElement("label");
    editorLabel.className = "sparql-catalog";
    const editorHeading = this.ownerDocument.createElement("span");
    editorHeading.className = "sparql-label";
    editorHeading.textContent = "SPARQL query";
    const editorShell = this.ownerDocument.createElement("div");
    editorShell.className = "sparql-editor-shell";
    const highlight = highlightedCode(this.#sparqlQuery, "sparql", this.ownerDocument);
    highlight.className = "sparql-highlight";
    highlight.setAttribute("aria-hidden", "true");
    const editor = this.ownerDocument.createElement("textarea");
    editor.className = "sparql-editor";
    editor.autocapitalize = "off";
    editor.autocomplete = "off";
    editor.spellcheck = false;
    editor.wrap = "soft";
    editor.value = this.#sparqlQuery;
    editor.setAttribute("aria-keyshortcuts", "Control+Enter Meta+Enter");
    const refreshHighlight = (): void => {
      const rendered = highlightedCode(editor.value, "sparql", this.ownerDocument);
      highlight.replaceChildren(...rendered.childNodes);
      highlight.scrollTop = editor.scrollTop;
    };
    editor.addEventListener("input", () => {
      this.#sparqlQuery = editor.value;
      refreshHighlight();
      const suggestion = this.#sparqlSuggestions.find(({ id }) => id === this.#selectedSparqlSuggestionId);
      if (suggestion?.query !== editor.value) {
        this.#selectedSparqlSuggestionId = "";
        const select = workbench.querySelector<HTMLSelectElement>(".sparql-suggestion");
        if (select) select.value = "";
        const description = workbench.querySelector<HTMLElement>(".sparql-description");
        if (description) description.textContent = "";
      }
      if (this.#sparqlExecution.status !== "idle") {
        this.#sparqlRunId += 1;
        this.#sparqlPage = 0;
        this.#sparqlExecution = { status: "idle" };
        this.#sparqlPresentationSignature = "";
        const output = workbench.querySelector<HTMLElement>(".sparql-output");
        if (output) {
          output.replaceChildren();
          this.#renderSparqlOutput(output);
        }
      }
    });
    editor.addEventListener("scroll", () => {
      highlight.scrollTop = editor.scrollTop;
      editor.scrollLeft = 0;
    });
    editor.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" || (!event.ctrlKey && !event.metaKey)) return;
      event.preventDefault();
      void this.#runSparql();
    });
    editorShell.append(highlight, editor);
    editorLabel.append(editorHeading, editorShell);
    workbench.append(editorLabel);

    const actions = this.ownerDocument.createElement("div");
    actions.className = "sparql-actions";
    const run = this.ownerDocument.createElement("button");
    run.className = "sparql-run";
    run.type = "button";
    run.disabled = this.#sparqlExecution.status === "running";
    run.textContent = this.#sparqlExecution.status === "running" ? "Running…" : "Run query";
    run.addEventListener("click", () => void this.#runSparql());
    const reset = this.ownerDocument.createElement("button");
    reset.className = "sparql-reset";
    reset.type = "button";
    reset.textContent = "Reset";
    reset.addEventListener("click", () => {
      this.#selectedSparqlSuggestionId = "";
      this.#sparqlQuery = DEFAULT_SPARQL_QUERY;
      this.#sparqlRunId += 1;
      this.#sparqlPage = 0;
      this.#sparqlExecution = { status: "idle" };
      this.#sparqlPresentationSignature = "";
      this.#redrawPreservingFocus();
    });
    const observe = this.ownerDocument.createElement("label");
    observe.className = "sparql-observe";
    const observeInput = this.ownerDocument.createElement("input");
    observeInput.className = "sparql-observe-input";
    observeInput.type = "checkbox";
    observeInput.checked = this.#sparqlObserveChanges;
    observeInput.addEventListener("change", () => {
      this.#sparqlObserveChanges = observeInput.checked;
      if (this.#sparqlObserveChanges) void this.#rerunObservedSparql();
    });
    observe.append(observeInput, "Observe changes");
    const safety = this.ownerDocument.createElement("p");
    safety.className = "sparql-safety";
    safety.textContent = "Local dataset · Read-only";
    actions.append(run, reset, observe, safety);
    workbench.append(actions);

    const output = this.ownerDocument.createElement("section");
    output.setAttribute("aria-label", "SPARQL results");
    output.setAttribute("aria-live", "polite");
    this.#renderSparqlOutput(output);
    workbench.append(output);
    container.append(workbench);
  }

  #render(): void {
    this.#stopFloatingInteraction();
    this.#stopLauncherInteraction();
    this.#clearLinkPreviews();
    this.#clearLocateEmphasis();
    this.#resetSyncControl = null;
    this.#clearNavigatorSync();
    this.#clearVocabularyTreeInteractions();
    this.#vocabularyResizeObserver?.disconnect();
    this.#vocabularyResizeObserver = null;
    this.#tabResizeObserver?.disconnect();
    this.#tabResizeObserver = null;
    this.#navigatorRows = [];
    this.#contentRendered = false;
    const result = this.#result;
    if (!result || !this.shadowRoot) return;
    if (this.#view === "diagnostics" && !result.diagnostics.length) this.#view = "navigator";
    if (this.#view === "discovery" && !this.#discoveryCandidates.length) this.#view = "navigator";
    if (this.#view === "vocabulary" && !this.#documentVocabulary.count) this.#view = "navigator";
    if (this.#view === "shapes" && !this.#shaclCatalog.count) this.#view = "navigator";
    if (this.#view === "sources" && this.#sources.length <= 1) this.#view = "navigator";
    const activeSource = this.#sources.find((source) => source.id === this.#selectedSourceId) ?? this.#sources[0];
    const totalStatements = this.#totalStatementCount();
    this.shadowRoot.innerHTML = `
      <style>${CSS}</style>
      <button class="launcher" type="button" data-position="${this.#position}" aria-expanded="${this.#open}" aria-controls="ia2-rdf-panel" title="Open RDF Navigator. Drag to move."${this.hasAttribute("data-ia2-extension") ? " hidden" : ""}>
        <span class="mark" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><circle cx="5" cy="12" r="2.6" fill="currentColor"/><circle cx="18.5" cy="5" r="2.6" fill="currentColor"/><circle cx="18.5" cy="19" r="2.6" fill="currentColor"/><path d="M7.2 10.8 16 6.2M7.2 13.2 16 17.8" stroke="currentColor" stroke-width="1.8"/></svg></span>
        <span>RDF</span><span class="count">${totalStatements}</span>
      </button>
      <aside class="panel ia2-window-surface" id="ia2-rdf-panel" data-open="${this.#open}" data-position="${this.#position}" aria-label="Document RDF" tabindex="-1">
        <header class="toolbar">
          <span class="drag-grip" aria-hidden="true" title="Drag floating navigator"><svg viewBox="0 0 8 18"><circle cx="2" cy="4" r="1.2"/><circle cx="6" cy="4" r="1.2"/><circle cx="2" cy="9" r="1.2"/><circle cx="6" cy="9" r="1.2"/><circle cx="2" cy="14" r="1.2"/><circle cx="6" cy="14" r="1.2"/></svg></span>
          <div class="tabs" role="tablist" aria-label="RDF views" data-compact="0">
            ${tabMarkup("navigator", this.#view === "navigator", "Navigator", "Nav")}
            ${this.#sources.length > 1 ? tabMarkup("sources", this.#view === "sources", "Sources", "Sources", this.#sources.length, "document") : ""}
            ${this.#documentVocabulary.count ? tabMarkup("vocabulary", this.#view === "vocabulary", "Vocabulary", "Vocab", this.#documentVocabulary.count, "definition") : ""}
            ${this.#shaclCatalog.count ? tabMarkup("shapes", this.#view === "shapes", "Shapes", "Shapes", this.#shaclCatalog.count, "shape") : ""}
            ${this.#discoveryCandidates.length ? tabMarkup("discovery", this.#view === "discovery", "Discovery", "Discover", this.#discoveryCandidates.length, "candidate") : ""}
            ${tabMarkup("sparql", this.#view === "sparql", "SPARQL", "Query", this.#sparqlSuggestions.length || undefined, "suggested query")}
            ${tabMarkup("turtle", this.#view === "turtle", "Turtle", "TTL")}
            ${tabMarkup("json", this.#view === "json", "JSON-LD", "JSON")}
            ${result.diagnostics.length ? tabMarkup("diagnostics", this.#view === "diagnostics", "Diagnostics", "Issues", result.diagnostics.length, "diagnostic") : ""}
          </div>
          <div class="header-actions">
            ${positionControlsMarkup({
              ariaLabel: "Drawer position",
              current: this.#position,
              groupClass: "position-switch",
              optionClass: "position-option",
            })}
            <button class="icon-button refresh" type="button" aria-label="Refresh extraction" title="Refresh extraction">↻</button><button class="icon-button close" type="button" aria-label="Close RDF Navigator" title="Close">×</button>
          </div>
        </header>
        <section class="viewport" role="tabpanel" tabindex="0"></section>
        <footer class="footer"><span>RDF 1.2 · ${activeSource?.label ?? "Document"}</span>${this.#view === "turtle" || this.#view === "json" ? '<button class="copy" type="button">Copy view</button>' : ""}</footer>
        <div class="resize-handles" aria-hidden="true">
          ${(["n", "ne", "e", "se", "s", "sw", "w", "nw"] as ResizeDirection[]).map((direction) => `<span class="resize-handle" data-resize="${direction}"></span>`).join("")}
        </div>
        <p class="sr-only" aria-live="polite">${this.#status}</p>
      </aside>`;

    const viewport = this.shadowRoot.querySelector<HTMLElement>(".viewport");
    const tabs = this.shadowRoot.querySelector<HTMLElement>(".tabs");
    this.#configureTabCompaction(tabs);
    if (!viewport) return;
    if (this.#open && this.#view === "turtle") viewport.append(highlightedCode(serializeTurtle(result), "turtle", document));
    if (this.#open && this.#view === "json") {
      if (containsTripleTerms(result)) {
        const notice = document.createElement("p");
        notice.className = "notice";
        notice.textContent = "JSON-LD 1.1 has no native RDF 1.2 triple-term syntax. This view preserves triple terms as typed JSON literals; use Turtle for the semantic form.";
        viewport.append(notice);
      }
      viewport.append(highlightedCode(serializeJsonLd(result), "json", document));
    }
    if (this.#open && this.#view === "navigator") this.#renderNavigator(viewport, result);
    if (this.#open && this.#view === "sources") this.#renderSources(viewport);
    if (this.#open && this.#view === "vocabulary") this.#renderVocabulary(viewport);
    if (this.#open && this.#view === "shapes") this.#renderShapes(viewport);
    if (this.#open && this.#view === "discovery") this.#renderDiscovery(viewport);
    if (this.#open && this.#view === "sparql") this.#renderSparql(viewport);
    if (this.#open && this.#view === "diagnostics") this.#renderDiagnostics(viewport, result.diagnostics);
    this.#contentRendered = this.#open;

    const launcher = this.shadowRoot.querySelector<HTMLElement>(".launcher");
    if (launcher) {
      this.#applyLauncherGeometry(launcher);
      launcher.addEventListener("pointerdown", (event) => this.#startLauncherInteraction(event, launcher));
      launcher.addEventListener("click", (event) => {
        if (this.#suppressLauncherClick) {
          event.preventDefault();
          this.#suppressLauncherClick = false;
          return;
        }
        this.toggle(event instanceof MouseEvent && event.detail !== 0 ? "panel" : "tab");
      });
    }
    this.shadowRoot.querySelector(".close")?.addEventListener("click", () => this.close());
    this.shadowRoot.querySelector(".refresh")?.addEventListener("click", () => this.refresh());
    const positionSwitch = this.shadowRoot.querySelector<HTMLElement>(".position-switch");
    const positionOptions = Array.from(this.shadowRoot.querySelectorAll<HTMLButtonElement>(".position-option"));
    const panel = this.shadowRoot.querySelector<HTMLElement>(".panel");
    const applyPosition = (position: DrawerPosition, focus = false): void => {
      this.#position = position;
      const launcher = this.shadowRoot?.querySelector<HTMLElement>(".launcher");
      if (panel) {
        panel.dataset.position = this.#position;
        if (position === "floating") this.#applyFloatingGeometry(panel);
        else this.#clearFloatingGeometry(panel);
      }
      if (launcher) {
        launcher.dataset.position = this.#position;
        this.#applyLauncherGeometry(launcher);
      }
      for (const option of positionOptions) {
        const selected = option.dataset.position === this.#position;
        option.setAttribute("aria-checked", String(selected));
        option.tabIndex = selected ? 0 : -1;
        if (selected && focus) option.focus();
      }
      this.#persistSessionState();
    };
    if (panel) {
      if (this.#position === "floating") this.#applyFloatingGeometry(panel);
      const toolbar = panel.querySelector<HTMLElement>(".toolbar");
      const tabs = toolbar?.querySelector<HTMLElement>(".tabs");
      toolbar?.addEventListener("pointerdown", (event) => {
        const target = event.target instanceof Element ? event.target : null;
        if (target !== toolbar && target !== tabs && !target?.closest(".drag-grip")) return;
        this.#startFloatingInteraction(event, panel);
      });
      panel.querySelectorAll<HTMLElement>(".resize-handle").forEach((handle) => {
        handle.addEventListener("pointerdown", (event) => {
          this.#startFloatingInteraction(event, panel, handle.dataset.resize as ResizeDirection);
        });
      });
    }
    if (positionSwitch) {
      bindWindowPositionControls(positionSwitch, (position, focus) => {
        applyPosition(position, focus);
      });
    }
    this.shadowRoot.querySelector(".copy")?.addEventListener("click", () => void this.#copyCurrent());
    this.shadowRoot.querySelectorAll<HTMLButtonElement>("[data-view]").forEach((button) => {
      button.addEventListener("click", () => this.#setView(button.dataset.view as View));
    });
    this.#configureLinkClicks();
  }
}
