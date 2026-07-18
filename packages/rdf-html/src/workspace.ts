import type * as RDF from "@rdfjs/types";
import { quadsToHtmlRdf } from "./carriers.js";
import type { RdfHtmlIssue, RdfHtmlWorkspaceOptions } from "./model.js";
import { RdfHtmlError } from "./model.js";
import { parseRdfHtml } from "./parse.js";
import { embedHtmlRdf, renderRdfHtmlDocument } from "./render.js";

type RenderOutcome = {
  descriptor: ReturnType<typeof parseRdfHtml>["documents"][number];
  rendered: ReturnType<typeof renderRdfHtmlDocument> | null;
  error: { message: string; issues: readonly RdfHtmlIssue[] } | null;
};

function escapeHtml(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function escapeAttribute(value: string): string {
  return escapeHtml(value).replaceAll('"', "&quot;");
}

function injectPreviewContext(html: string, baseIRI: string): string {
  const context = `<meta data-rdfhtml-runtime-context http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; img-src data: blob:; font-src data:; form-action 'none'"><base data-rdfhtml-runtime-context href="${escapeAttribute(baseIRI)}">`;
  const head = /<head(?:\s[^>]*)?>/i.exec(html);
  if (head?.index !== undefined) {
    const position = head.index + head[0].length;
    return `${html.slice(0, position)}${context}${html.slice(position)}`;
  }
  const root = /<html(?:\s[^>]*)?>/i.exec(html);
  if (root?.index !== undefined) {
    const position = root.index + root[0].length;
    return `${html.slice(0, position)}<head>${context}</head>${html.slice(position)}`;
  }
  return `<!doctype html><html rdf-version="1.2"><head>${context}</head><body>${html}</body></html>`;
}

function injectDocumentBase(html: string, baseIRI: string): string {
  const base = `<base data-rdfhtml-runtime-context href="${escapeAttribute(baseIRI)}">`;
  const head = /<head(?:\s[^>]*)?>/i.exec(html);
  if (head?.index !== undefined) {
    const position = head.index + head[0].length;
    return `${html.slice(0, position)}${base}${html.slice(position)}`;
  }
  const root = /<html(?:\s[^>]*)?>/i.exec(html);
  if (root?.index !== undefined) {
    const position = root.index + root[0].length;
    return `${html.slice(0, position)}<head>${base}</head>${html.slice(position)}`;
  }
  return `<!doctype html><html rdf-version="1.2"><head>${base}</head><body>${html}</body></html>`;
}

function issueMarkup(error: unknown): { message: string; issues: readonly RdfHtmlIssue[] } {
  if (error instanceof RdfHtmlError) return { message: error.message, issues: error.issues };
  return { message: error instanceof Error ? error.message : String(error), issues: [] };
}

function workspaceStyles(): string {
  return `
    :root { color-scheme: light; font-family: "Avenir Next", Avenir, "Segoe UI Variable", "Segoe UI", system-ui, sans-serif; }
    * { box-sizing: border-box; }
    body { background: oklch(98.5% 0.008 286); color: oklch(23% 0.035 286); margin: 0; min-height: 100vh; }
    a { color: inherit; }
    .shell { min-height: 100vh; }
    .bar { align-items: center; background: oklch(20% 0.075 294); color: oklch(97% 0.012 294); display: flex; gap: 1rem; justify-content: space-between; min-height: 4.25rem; padding: .8rem clamp(1rem, 3vw, 2.5rem); }
    .identity { align-items: baseline; display: flex; gap: .85rem; min-width: 0; }
    .mark { color: oklch(81% 0.15 135); font-size: 1.1rem; font-weight: 800; letter-spacing: -.04em; text-decoration: none; }
    .identity strong { font-size: .92rem; }
    .source { color: oklch(90% 0.065 294); display: block; font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace; font-size: .7rem; max-width: min(50vw, 72ch); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .safety { color: oklch(90% 0.065 294); font-size: .72rem; margin: 0; white-space: nowrap; }
    .document-nav { align-items: stretch; background: oklch(94.5% 0.02 286); border-bottom: 1px solid oklch(84% 0.025 286); display: flex; gap: 0; overflow-x: auto; padding: 0 clamp(1rem, 3vw, 2.5rem); }
    .document-nav a { border-bottom: 2px solid transparent; color: oklch(47% 0.025 286); flex: 0 0 auto; font-size: .78rem; font-weight: 720; padding: .9rem 1rem .75rem; text-decoration: none; }
    .document-nav a:hover, .document-nav a:focus-visible { background: oklch(93% 0.035 294); color: oklch(30% 0.12 294); }
    .document-nav a:focus-visible { outline: 3px solid oklch(81% 0.15 135); outline-offset: -3px; }
    .workspace { padding: clamp(1rem, 3vw, 2.5rem); }
    .preview { display: none; }
    .preview--default { display: block; }
    .workspace:has(.preview:target) .preview--default { display: none; }
    .workspace .preview:target { display: block; }
    .preview-head { align-items: end; display: flex; gap: 1rem; justify-content: space-between; margin-bottom: .8rem; }
    .preview-head h1 { font-size: clamp(1.2rem, 2vw, 1.7rem); letter-spacing: -.035em; margin: 0; }
    .preview-head code { color: oklch(47% 0.025 286); font-size: .7rem; overflow-wrap: anywhere; }
    iframe { background: oklch(98.5% 0.008 286); border: 1px solid oklch(84% 0.025 286); border-radius: 10px; display: block; height: calc(100vh - 10.8rem); min-height: 28rem; width: 100%; }
    .error { border: 1px solid oklch(65% 0.14 25); border-radius: 10px; color: oklch(38% 0.12 25); max-width: 72ch; padding: 1.2rem; }
    .error h1 { font-size: 1.25rem; margin: 0 0 .6rem; }
    .error p { line-height: 1.55; margin: 0; }
    @media (max-width: 700px) {
      .bar { align-items: flex-start; flex-direction: column; gap: .35rem; }
      .safety { white-space: normal; }
      .source { max-width: 88vw; }
      .workspace { padding-inline: .75rem; }
      .preview-head { align-items: start; flex-direction: column; gap: .3rem; }
      iframe { height: calc(100vh - 13.5rem); }
    }
  `;
}

function renderSource(
  source: string,
  options: RdfHtmlWorkspaceOptions,
): { outcomes: RenderOutcome[]; preservedHtml: string } {
  const parsed = parseRdfHtml(source, { baseIRI: options.sourceUrl, ...(options.contentType ? { contentType: options.contentType } : {}) });
  if (parsed.documents.length === 0) throw new RdfHtmlError("The RDF dataset does not define an rdfhtml:Document.");
  const outcomes: RenderOutcome[] = parsed.documents.map((descriptor) => {
    try {
      return { descriptor, rendered: renderRdfHtmlDocument(parsed.dataset, descriptor), error: null };
    } catch (error) {
      return { descriptor, rendered: null, error: issueMarkup(error) };
    }
  });
  const consumed = new Set<RDF.Quad>();
  for (const outcome of outcomes) for (const quad of outcome.rendered?.consumedQuads ?? []) consumed.add(quad);
  const remaining = Array.from(parsed.dataset).filter((quad) => !consumed.has(quad));
  return { outcomes, preservedHtml: quadsToHtmlRdf(remaining) };
}

function renderedPage(outcome: RenderOutcome, preservedHtml: string): string {
  if (outcome.error) {
    return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${escapeHtml(outcome.descriptor.label)}</title></head><body><main><h1>${escapeHtml(outcome.descriptor.label)}</h1><p>${escapeHtml(outcome.error.message)}</p></main></body></html>`;
  }
  return injectDocumentBase(embedHtmlRdf(outcome.rendered!.html, preservedHtml), outcome.rendered!.baseIRI);
}

function activeWorkspaceStyles(): string {
  return `
    :root { color-scheme: light; font-family: "Avenir Next", Avenir, "Segoe UI Variable", "Segoe UI", system-ui, sans-serif; }
    * { box-sizing: border-box; }
    html, body { height: 100%; margin: 0; }
    body { background: oklch(98.5% 0.008 286); display: grid; grid-template-rows: auto minmax(0, 1fr); }
    .selector { align-items: center; background: oklch(94.5% 0.02 286); border-bottom: 1px solid oklch(84% 0.025 286); display: grid; gap: .6rem; grid-template-columns: auto minmax(12rem, 1fr) auto; padding: .7rem clamp(.75rem, 3vw, 2rem); }
    label { color: oklch(47% 0.025 286); font-size: .72rem; font-weight: 750; }
    select, button { border: 1px solid oklch(84% 0.025 286); border-radius: 8px; color: oklch(23% 0.035 286); font: inherit; min-height: 2.55rem; }
    select { background: oklch(98.5% 0.008 286); padding: .4rem .7rem; width: 100%; }
    button { background: oklch(20% 0.075 294); color: oklch(97% 0.012 294); cursor: pointer; font-size: .76rem; font-weight: 750; padding: .5rem 1rem; }
    select:focus-visible, button:focus-visible { outline: 3px solid oklch(55% 0.17 294); outline-offset: 2px; }
    iframe { background: oklch(98.5% 0.008 286); border: 0; display: block; height: 100%; width: 100%; }
    @media (max-width: 540px) { .selector { grid-template-columns: 1fr auto; } label { grid-column: 1 / -1; } }
  `;
}

/** Render browser-opened RDF as an active HTML page. A single document is returned directly. */
export function renderRdfHtmlPage(source: string, options: RdfHtmlWorkspaceOptions): string {
  const { outcomes, preservedHtml } = renderSource(source, options);
  const pages = outcomes.map((outcome) => renderedPage(outcome, preservedHtml));
  if (pages.length === 1) return pages[0]!;
  const optionsMarkup = outcomes.map((outcome, index) => (
    `<option value="${index}" data-document="${escapeAttribute(pages[index]!)}">${escapeHtml(outcome.descriptor.label)}</option>`
  )).join("");
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Choose an RDF/HTML document</title>
  <style>${activeWorkspaceStyles()}</style>
</head>
<body>
  <form class="selector" id="document-selector">
    <label for="document">Document</label>
    <select id="document" name="document">${optionsMarkup}</select>
    <button type="submit">Open</button>
  </form>
  <iframe id="rendered-document" title="Rendered ${escapeAttribute(outcomes[0]!.descriptor.label)}" srcdoc="${escapeAttribute(pages[0]!)}"></iframe>
  <script>const selector = document.querySelector("#document-selector"); const frame = document.querySelector("#rendered-document"); selector.addEventListener("submit", (event) => { event.preventDefault(); const option = selector.elements.document.selectedOptions[0]; frame.srcdoc = option.dataset.document; frame.title = "Rendered " + option.textContent; });</script>
</body>
</html>`;
}

export function renderRdfHtmlWorkspace(source: string, options: RdfHtmlWorkspaceOptions): string {
  const { outcomes, preservedHtml } = renderSource(source, options);

  const navigation = outcomes.length > 1 ? `<nav class="document-nav" aria-label="HTML documents">${outcomes.map((outcome, index) => (
    `<a href="#rdfhtml-document-${index + 1}">${escapeHtml(outcome.descriptor.label)}</a>`
  )).join("")}</nav>` : "";

  const previews = outcomes.map((outcome, index) => {
    const classes = `preview${index === 0 ? " preview--default" : ""}`;
    if (outcome.error) {
      return `<section class="${classes}" id="rdfhtml-document-${index + 1}"><div class="error" role="alert"><h1>${escapeHtml(outcome.descriptor.label)}</h1><p>${escapeHtml(outcome.error.message)}</p></div></section>`;
    }
    const html = embedHtmlRdf(outcome.rendered!.html, preservedHtml);
    const preview = injectPreviewContext(html, outcome.rendered!.baseIRI);
    return `<section class="${classes}" id="rdfhtml-document-${index + 1}" aria-labelledby="rdfhtml-title-${index + 1}"><header class="preview-head"><h1 id="rdfhtml-title-${index + 1}">${escapeHtml(outcome.descriptor.label)}</h1><code>${escapeHtml(outcome.rendered!.baseIRI)}</code></header><iframe title="Rendered ${escapeAttribute(outcome.descriptor.label)}" sandbox referrerpolicy="no-referrer" srcdoc="${escapeAttribute(preview)}"></iframe></section>`;
  }).join("");

  return `<!doctype html>
<html lang="en" rdf-version="1.2">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; frame-src 'self'; base-uri 'none'; form-action 'none'">
  <title>${escapeHtml(options.title ?? "RDF/HTML renderer")}</title>
  <style>${workspaceStyles()}</style>
</head>
<body>
  <div class="shell">
    <header class="bar">
      <div class="identity"><a class="mark" href="https://ia2.dev/" aria-label="IA squared home">IA²</a><div><strong>RDF/HTML</strong><span class="source" title="${escapeAttribute(options.sourceUrl)}">${escapeHtml(options.sourceUrl)}</span></div></div>
      <p class="safety">Inert preview. Scripts, forms, nested frames, and network loads are blocked.</p>
    </header>
    ${navigation}
    <main class="workspace">${previews}</main>
  </div>
  <div hidden data-rdfhtml-source>${preservedHtml}</div>
</body>
</html>`;
}
