import { parseRdfHtml, renderRdfHtmlDocument } from "@ia2-dev/rdf-html";

const MAX_SOURCE_BYTES = 2 * 1024 * 1024;
const MAX_REDIRECTS = 4;
const FETCH_TIMEOUT_MS = 10_000;
const REDIRECT_STATUSES = new Set([301, 302, 303, 307, 308]);
const RENDER_PATH = "/render";
const RENDER_SOURCE_PREFIX = `${RENDER_PATH}/`;
const RENDER_DOCUMENT_PREFIX = `${RENDER_PATH}/document/`;
const RENDERER_EXAMPLE_GROUPS = [
  {
    label: "Authored",
    examples: [
      { description: "A minimal document with retained domain RDF.", file: "welcome.ttl", format: "Turtle", label: "Welcome" },
      { description: "Forms, labels, attributes, and a comment.", file: "accessibility-check.ttl", format: "Turtle", label: "Accessibility review" },
      { description: "Dates, tables, links, lists, and styling.", file: "conference-agenda.ttl", format: "Turtle", label: "Open Systems Forum" },
      { description: "Mixed content, measurements, and quotations.", file: "field-observations.ttl", format: "Turtle", label: "Estuary observations" },
      { description: "Independent graphs contribute children with broad relative ordering.", file: "independent-contributions.trig", format: "TriG", label: "Independent contributions" },
      { description: "Two documents and a shared named graph.", file: "multi-audience.trig", format: "TriG", label: "Multi-audience incident" },
    ],
  },
  {
    label: "Adapted sources",
    examples: [
      { description: "A public-domain literary excerpt.", file: "alice-rabbit-hole.ttl", format: "Turtle", label: "Down the Rabbit-Hole" },
      { description: "A shortened HTML Living Standard passage.", file: "whatwg-dom-introduction.ttl", format: "Turtle", label: "Introduction to the DOM" },
      { description: "A text-only adaptation of NASA's overview.", file: "nasa-apollo-11.ttl", format: "Turtle", label: "Apollo 11 mission" },
    ],
  },
];
function htmlResponse(body, status = 200, scriptNonce = "") {
  return new Response(body, {
    status,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "content-security-policy": `default-src 'none'; style-src 'unsafe-inline'; frame-src 'self'; base-uri 'none'; form-action 'self'${scriptNonce ? `; script-src 'nonce-${scriptNonce}'` : ""}`,
      "referrer-policy": "no-referrer",
      "vary": "accept",
      "x-content-type-options": "nosniff",
      "x-frame-options": "DENY",
    },
  });
}

function renderedDocumentResponse(body, status = 200) {
  return new Response(body, {
    status,
    headers: {
      "cache-control": "no-store",
      "content-type": "text/html; charset=utf-8",
      "content-security-policy": "sandbox; default-src 'none'; style-src 'unsafe-inline'; img-src data: blob:; font-src data:; media-src data: blob:; connect-src 'none'; object-src 'none'; worker-src 'none'; frame-src 'none'; form-action 'none'; frame-ancestors 'self'",
      "permissions-policy": "camera=(), geolocation=(), microphone=(), payment=(), usb=()",
      "referrer-policy": "no-referrer",
      "x-content-type-options": "nosniff",
    },
  });
}

function acceptsHtml(request) {
  const accept = request.headers.get("accept") || "";
  return accept.split(",").some((range) => {
    const [mediaType, ...parameters] = range.trim().toLowerCase().split(";");
    const quality = parameters.map((parameter) => parameter.trim()).find((parameter) => /^q\s*=/.test(parameter));
    const qualityValue = quality ? Number(quality.split("=", 2)[1]) : 1;
    return (mediaType === "text/html" || mediaType === "application/xhtml+xml")
      && Number.isFinite(qualityValue)
      && qualityValue > 0;
  });
}

function missingUrlResponse() {
  return new Response(JSON.stringify({
    type: "https://ia2.dev/problems/missing-rdf-html-url",
    title: "RDF/HTML source URL required",
    status: 400,
    detail: "Append a public Turtle or TriG URL to /render/.",
  }), {
    status: 400,
    headers: {
      "content-type": "application/problem+json; charset=utf-8",
      "cache-control": "no-store",
      "vary": "accept",
      "x-content-type-options": "nosniff",
    },
  });
}

function escapeHtml(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function rendererRequest(requestUrl) {
  if (requestUrl.pathname === RENDER_PATH || requestUrl.pathname === RENDER_SOURCE_PREFIX) {
    return { documentIndex: null, sourceUrl: "" };
  }
  if (requestUrl.pathname.startsWith(RENDER_DOCUMENT_PREFIX)) {
    const remainder = requestUrl.pathname.slice(RENDER_DOCUMENT_PREFIX.length);
    const separator = remainder.indexOf("/");
    if (separator < 1) return null;
    return {
      documentIndex: remainder.slice(0, separator),
      sourceUrl: `${remainder.slice(separator + 1)}${requestUrl.search}`,
    };
  }
  if (!requestUrl.pathname.startsWith(RENDER_SOURCE_PREFIX)) return null;
  return {
    documentIndex: null,
    sourceUrl: `${requestUrl.pathname.slice(RENDER_SOURCE_PREFIX.length)}${requestUrl.search}`,
  };
}

function rendererExamples() {
  return RENDERER_EXAMPLE_GROUPS.map((group) => `<section class="example-group" aria-labelledby="examples-${group.label.toLowerCase().replaceAll(" ", "-")}">
    <h3 id="examples-${group.label.toLowerCase().replaceAll(" ", "-")}">${group.label}</h3>
    <ul>${group.examples.map((example) => `<li><a data-render-example href="/spec/rdf-html/examples/${escapeHtml(example.file)}"><span><strong>${escapeHtml(example.label)}</strong><span class="example-description">${escapeHtml(example.description)}</span></span><code>${example.format}</code></a></li>`).join("")}</ul>
  </section>`).join("");
}

function rendererForm(
  message = "",
  sourceUrl = "",
  allowLocalhost = false,
  scriptNonce = "",
) {
  const sourceScope = allowLocalhost ? "Turtle or TriG URL" : "Public Turtle or TriG URL";
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>RDF/HTML URL renderer</title><style>
    :root { color-scheme: light; font-family: "Avenir Next", Avenir, "Segoe UI Variable", "Segoe UI", system-ui, sans-serif; }
    * { box-sizing: border-box; }
    body { background: oklch(49% 0.18 294); color: oklch(97% 0.012 294); margin: 0; min-height: 100vh; }
    main { display: grid; min-height: 100vh; padding: clamp(1.25rem, 5vw, 5rem); place-items: center; }
    .renderer { max-width: 58rem; width: 100%; }
    .mark { color: oklch(81% 0.15 135); font-size: 1.15rem; font-weight: 800; letter-spacing: -.05em; text-decoration: none; }
    h1 { font-size: clamp(2.7rem, 7vw, 5.8rem); letter-spacing: -.06em; line-height: .92; margin: 1.5rem 0; max-width: 10ch; }
    p { color: oklch(90% 0.065 294); font-size: clamp(1.05rem, 2vw, 1.3rem); line-height: 1.55; max-width: 62ch; }
    form { border-top: 1px solid oklch(90% 0.065 294 / 45%); display: grid; gap: .75rem; grid-template-columns: 1fr auto; margin-top: clamp(2rem, 6vw, 4rem); padding-top: 1.25rem; }
    label { font-size: .76rem; font-weight: 750; grid-column: 1 / -1; }
    input { background: oklch(97% 0.012 294); border: 1px solid transparent; border-radius: 8px; color: oklch(20% 0.075 294); font: inherit; min-height: 3.25rem; padding: .75rem 1rem; width: 100%; }
    input:focus-visible, button:focus-visible, a:focus-visible { outline: 3px solid oklch(81% 0.15 135); outline-offset: 3px; }
    button { background: oklch(20% 0.075 294); border: 1px solid oklch(90% 0.065 294 / 45%); border-radius: 8px; color: oklch(97% 0.012 294); cursor: pointer; font: inherit; font-size: .78rem; font-weight: 750; min-height: 3.25rem; padding: .75rem 1.2rem; }
    button:hover { background: oklch(30% 0.12 294); }
    .message { background: oklch(97% 0.012 294); border-radius: 8px; color: oklch(38% 0.12 25); font-size: .9rem; margin-top: 1rem; padding: .85rem 1rem; }
    .examples { border-top: 1px solid oklch(90% 0.065 294 / 45%); margin-top: clamp(2.5rem, 6vw, 4.5rem); padding-top: 1.25rem; }
    .examples h2 { font-size: clamp(1.25rem, 2vw, 1.65rem); letter-spacing: -.03em; margin: 0; }
    .examples > p { font-size: .92rem; margin: .45rem 0 1.8rem; }
    .example-groups { display: grid; gap: clamp(1.75rem, 4vw, 3.5rem); grid-template-columns: 1.45fr 1fr; }
    .example-group h3 { color: oklch(90% 0.065 294); font-size: .72rem; letter-spacing: .05em; margin: 0 0 .55rem; text-transform: uppercase; }
    .example-group ul { border-bottom: 1px solid oklch(90% 0.065 294 / 30%); list-style: none; margin: 0; padding: 0; }
    .example-group li { border-top: 1px solid oklch(90% 0.065 294 / 30%); }
    .example-group a { align-items: start; color: inherit; display: grid; gap: 1rem; grid-template-columns: minmax(0, 1fr) auto; padding: .85rem 0; text-decoration: none; }
    .example-group a:hover strong { text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: .2em; }
    .example-group strong, .example-description { display: block; }
    .example-group strong { font-size: .96rem; line-height: 1.3; }
    .example-description { color: oklch(90% 0.065 294); font-size: .78rem; line-height: 1.45; margin-top: .18rem; }
    .example-group code { color: oklch(81% 0.15 135); font-size: .68rem; line-height: 1.3; padding-top: .16rem; }
    @media (max-width: 650px) { form, .example-groups { grid-template-columns: 1fr; } button { width: 100%; } }
  </style></head><body><main><section class="renderer"><a class="mark" href="/" aria-label="IA squared home">IA²</a><h1>Render HTML described in RDF.</h1><p>Enter a ${allowLocalhost ? "Turtle or TriG" : "public Turtle or TriG"} URL to render the HTML it describes. If the source contains multiple documents, you can choose which one to open.</p>${message ? `<p class="message" role="alert">${escapeHtml(message)}</p>` : ""}<form id="renderer-form" action="/render"><label for="url">${sourceScope}</label><input id="url" name="source" type="url" inputmode="url" placeholder="https://example.com/document.ttl" required value="${escapeHtml(sourceUrl)}"><button type="submit">Render document</button></form><section class="examples" aria-labelledby="included-examples"><h2 id="included-examples">Included examples</h2><p>Open a complete source from the RDF/HTML example suite.</p><div class="example-groups">${rendererExamples()}</div></section></section></main><script nonce="${escapeHtml(scriptNonce)}">const renderPath = (value) => { const source = new URL(value, document.baseURI); source.hash = ""; return new URL("/render/" + source.href, document.baseURI).href; }; const form = document.querySelector("#renderer-form"); form.addEventListener("submit", (event) => { event.preventDefault(); location.assign(renderPath(form.elements.source.value)); }); for (const link of document.querySelectorAll("[data-render-example]")) { link.href = renderPath(link.getAttribute("href")); }</script></body></html>`;
}

function rendererFormResponse(message = "", sourceUrl = "", allowLocalhost = false, status = 200) {
  const scriptNonce = crypto.randomUUID().replaceAll("-", "");
  return htmlResponse(rendererForm(message, sourceUrl, allowLocalhost, scriptNonce), status, scriptNonce);
}

function selectedDocumentUrl(requestUrl, sourceUrl, documentIndex) {
  const source = new URL(sourceUrl);
  source.hash = "";
  const selected = new URL(`${RENDER_DOCUMENT_PREFIX}${documentIndex}/${source.href}`, requestUrl);
  return `${selected.pathname}${selected.search}`;
}

function rendererShell(requestUrl, sourceUrl, documents, scriptNonce) {
  const multiple = documents.length > 1;
  const firstDocumentUrl = selectedDocumentUrl(requestUrl, sourceUrl, 0);
  const controls = multiple ? `<form class="selector" id="document-selector">
    <label for="document">Document</label>
    <select id="document" name="document">${documents.map((document, index) => `<option value="${escapeHtml(selectedDocumentUrl(requestUrl, sourceUrl, index))}">${escapeHtml(document.label)}</option>`).join("")}</select>
    <button type="submit">Open</button>
  </form>` : "";
  const selectorScript = multiple ? `<script nonce="${escapeHtml(scriptNonce)}">const selector = document.querySelector("#document-selector"); const frame = document.querySelector("#rendered-document"); selector.addEventListener("submit", (event) => { event.preventDefault(); const option = selector.elements.document.selectedOptions[0]; frame.src = option.value; frame.title = "Rendered " + option.textContent; });</script>` : "";
  const title = multiple ? "Choose an RDF/HTML document" : documents[0].label;
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <style>
    :root { color-scheme: light; font-family: "Avenir Next", Avenir, "Segoe UI Variable", "Segoe UI", system-ui, sans-serif; }
    * { box-sizing: border-box; }
    html, body { height: 100%; margin: 0; }
    body { background: oklch(98.5% 0.008 286); display: grid; grid-template-rows: ${multiple ? "auto minmax(0, 1fr)" : "minmax(0, 1fr)"}; }
    .selector { align-items: center; background: oklch(94.5% 0.02 286); border-bottom: 1px solid oklch(84% 0.025 286); display: grid; gap: .6rem; grid-template-columns: auto minmax(12rem, 1fr) auto; padding: .7rem clamp(.75rem, 3vw, 2rem); }
    label { color: oklch(47% 0.025 286); font-size: .72rem; font-weight: 750; }
    select, button { border: 1px solid oklch(84% 0.025 286); border-radius: 8px; color: oklch(23% 0.035 286); font: inherit; min-height: 2.55rem; }
    select { background: oklch(98.5% 0.008 286); padding: .4rem .7rem; width: 100%; }
    button { background: oklch(20% 0.075 294); color: oklch(97% 0.012 294); cursor: pointer; font-size: .76rem; font-weight: 750; padding: .5rem 1rem; }
    select:focus-visible, button:focus-visible { outline: 3px solid oklch(55% 0.17 294); outline-offset: 2px; }
    iframe { background: oklch(98.5% 0.008 286); border: 0; display: block; height: 100%; width: 100%; }
    @media (max-width: 540px) {
      .selector { grid-template-columns: 1fr auto; }
      label { grid-column: 1 / -1; }
    }
  </style>
</head>
<body>
  ${controls}
  <iframe id="rendered-document" name="rdfhtml-rendered-document" title="Rendered ${escapeHtml(documents[0].label)}" sandbox referrerpolicy="no-referrer" src="${escapeHtml(firstDocumentUrl)}"></iframe>
  ${selectorScript}
</body>
</html>`;
}

function injectDocumentBase(html, baseIRI) {
  const base = `<base data-rdfhtml-runtime-context href="${escapeHtml(baseIRI)}">`;
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

function documentIndex(value, count) {
  if (value === null) return 0;
  if (!/^\d+$/.test(value)) throw new Error("The selected RDF/HTML document does not exist.");
  const index = Number(value);
  if (!Number.isSafeInteger(index) || index < 0 || index >= count) throw new Error("The selected RDF/HTML document does not exist.");
  return index;
}

function ipv4Parts(hostname) {
  if (!/^\d{1,3}(?:\.\d{1,3}){3}$/.test(hostname)) return null;
  const parts = hostname.split(".").map(Number);
  return parts.every((part) => part >= 0 && part <= 255) ? parts : null;
}

export function assertPublicSourceUrl(input, { allowLocalhost = false } = {}) {
  let url;
  try { url = new URL(input); } catch { throw new Error("The source must be an absolute HTTP or HTTPS URL."); }
  if (url.protocol !== "https:" && url.protocol !== "http:") throw new Error("Only HTTP and HTTPS sources are supported.");
  if (url.username || url.password) throw new Error("Source URLs must not contain credentials.");
  const hostname = url.hostname.toLowerCase().replace(/^\[|\]$/g, "");
  const ipv4 = ipv4Parts(hostname);
  const isLoopback = hostname === "localhost"
    || hostname.endsWith(".localhost")
    || ipv4?.[0] === 127
    || hostname === "::1";
  if (isLoopback) {
    if (allowLocalhost) return url;
    throw new Error("The source must use a public hostname.");
  }
  if (!hostname || hostname.endsWith(".local") || hostname.endsWith(".internal") || hostname.endsWith(".invalid") || hostname.endsWith(".test")) {
    throw new Error("The source must use a public hostname.");
  }
  if (ipv4) {
    const [a, b, c] = ipv4;
    if (a === 0 || a === 10 || a >= 224 || (a === 100 && b >= 64 && b <= 127) || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) || (a === 192 && b === 0 && (c === 0 || c === 2)) || (a === 192 && b === 88 && c === 99) || (a === 198 && (b === 18 || b === 19 || (b === 51 && c === 100))) || (a === 203 && b === 0 && c === 113)) {
      throw new Error("Private, loopback, link-local, shared, and reserved IP sources are blocked.");
    }
  }
  if (hostname.includes(":")) {
    if (hostname === "::" || hostname.startsWith("::ffff:") || /^f[cd]/.test(hostname) || /^fe[89ab]/.test(hostname) || /^ff/.test(hostname) || hostname.startsWith("2001:db8:")) {
      throw new Error("Private, loopback, link-local, and documentation IPv6 sources are blocked.");
    }
  }
  return url;
}

function rdfContentType(response, url) {
  const type = (response.headers.get("content-type") || "").split(";", 1)[0].trim().toLowerCase();
  if (type === "application/trig" || type === "application/x-trig" || url.pathname.toLowerCase().endsWith(".trig")) return "application/trig";
  if (type === "text/turtle" || type === "application/x-turtle" || type === "text/plain" || url.pathname.toLowerCase().endsWith(".ttl")) return "text/turtle";
  throw new Error(`The source returned ${type || "no media type"}; expected Turtle or TriG.`);
}

async function staticAssetResponse(request, env, requestUrl) {
  const response = await env.ASSETS.fetch(request);
  const topLevelTrig = requestUrl.pathname.toLowerCase().endsWith(".trig")
    && request.headers.get("sec-fetch-dest") === "document";
  if (!topLevelTrig) return response;
  const headers = new Headers(response.headers);
  headers.set("content-type", "text/plain; charset=utf-8");
  headers.set("content-disposition", "inline");
  return new Response(response.body, {
    headers,
    status: response.status,
    statusText: response.statusText,
  });
}

async function boundedText(response) {
  const declared = Number(response.headers.get("content-length"));
  if (Number.isFinite(declared) && declared > MAX_SOURCE_BYTES) throw new Error("The RDF source exceeds the 2 MiB limit.");
  if (!response.body) return "";
  const reader = response.body.getReader();
  const chunks = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > MAX_SOURCE_BYTES) {
      await reader.cancel();
      throw new Error("The RDF source exceeds the 2 MiB limit.");
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
}

export async function fetchRdfSource(input, fetcher = fetch, options = {}) {
  let url = assertPublicSourceUrl(input, options);
  for (let redirect = 0; redirect <= MAX_REDIRECTS; redirect += 1) {
    const response = await fetcher(url.href, {
      headers: { accept: "application/trig, text/turtle;q=0.9, application/x-trig;q=0.8, application/x-turtle;q=0.8, text/plain;q=0.2" },
      redirect: "manual",
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    if (REDIRECT_STATUSES.has(response.status)) {
      if (redirect === MAX_REDIRECTS) throw new Error("The source redirected too many times.");
      const location = response.headers.get("location");
      if (!location) throw new Error("The source returned a redirect without a Location header.");
      url = assertPublicSourceUrl(new URL(location, url).href, options);
      continue;
    }
    if (!response.ok) throw new Error(`The source returned HTTP ${response.status}.`);
    const contentType = rdfContentType(response, url);
    return { contentType, source: await boundedText(response), sourceUrl: url.href };
  }
  throw new Error("The source redirected too many times.");
}

export async function handleRequest(request, env, fetcher = fetch) {
  const requestUrl = new URL(request.url);
  const renderer = rendererRequest(requestUrl);
  if (!renderer) return staticAssetResponse(request, env, requestUrl);
  const allowLocalhost = env?.RDF_HTML_ALLOW_LOCALHOST === "true";
  const sourceUrl = renderer.sourceUrl;
  if (!sourceUrl) return acceptsHtml(request)
    ? rendererFormResponse("", "", allowLocalhost)
    : missingUrlResponse();
  try {
    const fetched = await fetchRdfSource(sourceUrl, fetcher, { allowLocalhost });
    const parsed = parseRdfHtml(fetched.source, {
      baseIRI: fetched.sourceUrl,
      contentType: fetched.contentType,
    });
    if (parsed.documents.length === 0) throw new Error("The RDF dataset does not define an rdfhtml:Document.");
    if (renderer.documentIndex !== null) {
      const index = documentIndex(renderer.documentIndex, parsed.documents.length);
      const rendered = renderRdfHtmlDocument(parsed.dataset, parsed.documents[index]);
      return renderedDocumentResponse(injectDocumentBase(rendered.publicationHtml, rendered.baseIRI));
    }
    const scriptNonce = crypto.randomUUID().replaceAll("-", "");
    return htmlResponse(rendererShell(requestUrl, fetched.sourceUrl, parsed.documents, scriptNonce), 200, scriptNonce);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const status = /2 MiB/.test(message) ? 413 : /HTTP|returned|redirect/.test(message) ? 502 : 400;
    if (renderer.documentIndex !== null) {
      return renderedDocumentResponse(`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>RDF/HTML rendering error</title><style>body{font-family:system-ui,sans-serif;line-height:1.5;margin:2rem;max-width:68ch}</style></head><body><h1>Unable to render this document</h1><p>${escapeHtml(message)}</p></body></html>`, status);
    }
    return rendererFormResponse(message, sourceUrl, allowLocalhost, status);
  }
}

export default {
  fetch(request, env) { return handleRequest(request, env); },
};
