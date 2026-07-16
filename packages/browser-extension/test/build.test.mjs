import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { JSDOM } from "jsdom";
import sharp from "sharp";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const repositoryRoot = resolve(packageRoot, "../..");

async function manifest(target) {
  return JSON.parse(await readFile(resolve(packageRoot, "dist", target, "manifest.json"), "utf8"));
}

async function eventually(read, expected) {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    if (read() === expected) return;
    await new Promise((resolve) => setTimeout(resolve, 5));
  }
  assert.equal(read(), expected);
}

test("builds automatic HARE enhancement manifests for each browser", async () => {
  const [chrome, firefox, safari] = await Promise.all([
    manifest("chrome"), manifest("firefox"), manifest("safari"),
  ]);
  for (const value of [chrome, firefox, safari]) {
    assert.equal(value.manifest_version, 3);
    assert.deepEqual(value.permissions, ["activeTab", "scripting"]);
    assert.equal(value.host_permissions, undefined);
    assert.deepEqual(value.content_scripts, [
      {
        js: ["auto.js"],
        matches: ["<all_urls>"],
        run_at: "document_idle",
        world: "MAIN",
      },
      {
        js: ["status.js"],
        matches: ["<all_urls>"],
        run_at: "document_idle",
        world: "ISOLATED",
      },
    ]);
    assert.match(value.description, /HARE resource envelopes/);
  }
  assert.deepEqual(chrome.background, { service_worker: "background.js" });
  assert.deepEqual(firefox.background, { persistent: false, scripts: ["background.js"] });
  assert.equal(firefox.browser_specific_settings.gecko.id, "navigator@ia2.dev");
  assert.deepEqual(firefox.browser_specific_settings.gecko.data_collection_permissions, { required: ["none"] });
  assert.deepEqual(safari.background, { service_worker: "background.js" });
});

test("builds correctly sized PNG artwork for extension surfaces", async () => {
  const chromeManifest = await manifest("chrome");
  for (const [declaredSize, iconPath] of Object.entries(chromeManifest.icons)) {
    const metadata = await sharp(resolve(packageRoot, "dist/chrome", iconPath)).metadata();
    assert.equal(metadata.format, "png");
    assert.equal(metadata.width, Number(declaredSize));
    assert.equal(metadata.height, Number(declaredSize));
    const mutedPath = resolve(packageRoot, "dist/chrome", `icons/ia2-mark-muted-${declaredSize}.png`);
    const mutedMetadata = await sharp(mutedPath).metadata();
    const mutedStats = await sharp(mutedPath).stats();
    assert.equal(mutedMetadata.width, Number(declaredSize));
    assert.equal(mutedMetadata.height, Number(declaredSize));
    assert.equal(Math.round(mutedStats.channels[0].mean), Math.round(mutedStats.channels[1].mean));
    assert.equal(Math.round(mutedStats.channels[1].mean), Math.round(mutedStats.channels[2].mean));
  }
});

test("content bundle mounts and toggles an extension-owned Navigator", async () => {
  const bundle = await readFile(resolve(packageRoot, "dist/chrome/content.js"), "utf8");
  assert.doesNotMatch(bundle, /^\s*(?:import|export)\s/m);
  const dom = new JSDOM(`<!doctype html><html><head>
    <link rel="canonical" href="https://example.test/page">
    </head><body>
    <span rdf-subject="#item" rdf-predicate="https://schema.org/name">Item</span>
    </body></html>`, {
    pretendToBeVisual: true,
    runScripts: "outside-only",
    url: "https://example.test/page",
  });

  dom.window.eval(bundle);
  await eventually(() => dom.window.document.querySelector("ia2-extension-navigator")?.shadowRoot?.querySelector(".panel")?.dataset.open, "true");
  const navigator = dom.window.document.querySelector("ia2-extension-navigator");
  assert.ok(navigator);
  assert.equal(navigator.hasAttribute("data-ia2-extension"), true);
  assert.equal(navigator.shadowRoot.querySelector(".launcher").hidden, true);
  assert.equal(navigator.shadowRoot.querySelector(".count").textContent, "1");

  dom.window.eval(bundle);
  await eventually(() => navigator.shadowRoot.querySelector(".panel")?.dataset.open, "false");
  assert.equal(dom.window.document.querySelectorAll("ia2-extension-navigator").length, 1);
  dom.window.close();
});

test("automatic bundle adds tabs to an authored declarative HARE envelope", async () => {
  const [autoBundle, statusBundle, envelopeHtml] = await Promise.all([
    readFile(resolve(packageRoot, "dist/chrome/auto.js"), "utf8"),
    readFile(resolve(packageRoot, "dist/chrome/status.js"), "utf8"),
    readFile(resolve(repositoryRoot, "specs/resource-envelope/examples/decision-handoff.html"), "utf8"),
  ]);
  assert.doesNotMatch(autoBundle, /^\s*(?:import|export)\s/m);
  const dom = new JSDOM(envelopeHtml, {
    pretendToBeVisual: true,
    runScripts: "outside-only",
    url: "https://example.test/authored-envelope.html",
  });
  Object.defineProperty(dom.window, "crypto", { configurable: true, value: globalThis.crypto });
  dom.window.TextDecoder = globalThis.TextDecoder;
  dom.window.URL.createObjectURL = () => "blob:https://example.test/verified";
  dom.window.URL.revokeObjectURL = () => {};
  const reports = [];
  dom.window.chrome = {
    runtime: {
      sendMessage(message) {
        reports.push(message);
        return Promise.resolve();
      },
    },
  };

  assert.equal(dom.window.document.querySelectorAll('script:not([type="application/octet-stream"])').length, 0);
  dom.window.eval(autoBundle);
  await eventually(() => dom.window.document.querySelector("ia2-extension-hare-viewer")?.dataset.mode, "tabs");
  const viewer = dom.window.document.querySelector("ia2-extension-hare-viewer");
  const navigator = dom.window.document.querySelector("ia2-extension-navigator");
  assert.ok(viewer);
  assert.ok(navigator);
  assert.equal(viewer.filesOpen, false);
  assert.equal(viewer.shadowRoot.querySelector(".bar").hidden, false);
  assert.equal(viewer.shadowRoot.querySelector(".workspace").hidden, true);
  assert.equal(viewer.shadowRoot.querySelectorAll(".file-button").length, 2);
  assert.equal(navigator.shadowRoot.querySelector(".panel").dataset.open, "false");
  assert.equal(dom.window.document.body.style.overflow, "");
  dom.window.eval(statusBundle);
  await eventually(() => reports.at(-1)?.files, 2);
  assert.ok(reports.at(-1)?.statements > 0);
  dom.window.close();
});

test("automatic bundle opens files for a bare declarative HARE envelope", async () => {
  const [autoBundle, sourceHtml] = await Promise.all([
    readFile(resolve(packageRoot, "dist/chrome/auto.js"), "utf8"),
    readFile(resolve(repositoryRoot, "specs/resource-envelope/examples/inspection-evidence.html"), "utf8"),
  ]);
  const envelopeHtml = sourceHtml
    .replace(/\s*<script type="module" src="[^"]+"><\/script>/, "")
    .replace(/\s*<ia2-hare-viewer><\/ia2-hare-viewer>/, "");
  const dom = new JSDOM(envelopeHtml, {
    pretendToBeVisual: true,
    runScripts: "outside-only",
    url: "https://example.test/bare-envelope.html",
  });
  Object.defineProperty(dom.window, "crypto", { configurable: true, value: globalThis.crypto });
  dom.window.TextDecoder = globalThis.TextDecoder;
  dom.window.URL.createObjectURL = () => "blob:https://example.test/verified";
  dom.window.URL.revokeObjectURL = () => {};

  assert.equal(dom.window.document.querySelector("ia2-hare-viewer"), null);
  dom.window.eval(autoBundle);
  await eventually(() => dom.window.document.querySelector("ia2-extension-hare-viewer")?.dataset.mode, "full");
  const viewer = dom.window.document.querySelector("ia2-extension-hare-viewer");
  assert.ok(viewer);
  assert.equal(viewer.filesOpen, true);
  assert.equal(viewer.shadowRoot.querySelector(".document-tab").hidden, true);
  assert.equal(viewer.shadowRoot.querySelector(".workspace").hidden, false);
  assert.equal(viewer.shadowRoot.querySelectorAll(".file-button").length, 3);
  dom.window.close();
});

test("automatic bundle does not duplicate a page-provided HARE viewer", async () => {
  const autoBundle = await readFile(resolve(packageRoot, "dist/chrome/auto.js"), "utf8");
  const dom = new JSDOM(`<!doctype html><html><head>
    <link rel="canonical" href="https://example.test/envelope.html">
    </head><body>
    <ia2-hare-viewer></ia2-hare-viewer>
    <a hidden href="https://ia2.dev/spec/resource-envelope#Envelope" rdf-subject="" rdf-predicate="http://www.w3.org/1999/02/22-rdf-syntax-ns#type"></a>
    </body></html>`, {
    pretendToBeVisual: true,
    runScripts: "outside-only",
    url: "https://example.test/envelope.html",
  });

  dom.window.eval(autoBundle);
  await eventually(() => dom.window.document.querySelectorAll("ia2-extension-navigator").length, 1);
  assert.equal(dom.window.document.querySelectorAll("ia2-hare-viewer").length, 1);
  assert.equal(dom.window.document.querySelector("ia2-extension-hare-viewer"), null);
  dom.window.close();
});

test("toolbar bundle toggles the Navigator without changing the HARE file view", async () => {
  const [autoBundle, bundle, statusBundle, envelopeHtml] = await Promise.all([
    readFile(resolve(packageRoot, "dist/chrome/auto.js"), "utf8"),
    readFile(resolve(packageRoot, "dist/chrome/content.js"), "utf8"),
    readFile(resolve(packageRoot, "dist/chrome/status.js"), "utf8"),
    readFile(resolve(repositoryRoot, "specs/resource-envelope/examples/decision-handoff.html"), "utf8"),
  ]);
  const dom = new JSDOM(envelopeHtml, {
    pretendToBeVisual: true,
    runScripts: "outside-only",
    url: "https://example.test/downloaded-envelope.html",
  });
  Object.defineProperty(dom.window, "crypto", { configurable: true, value: globalThis.crypto });
  dom.window.TextDecoder = globalThis.TextDecoder;
  dom.window.URL.createObjectURL = () => "blob:https://example.test/verified";
  dom.window.URL.revokeObjectURL = () => {};
  const reports = [];
  dom.window.chrome = {
    runtime: {
      sendMessage(message) {
        reports.push(message);
        return Promise.resolve();
      },
    },
  };

  assert.equal(dom.window.document.querySelectorAll('script:not([type="application/octet-stream"])').length, 0);
  assert.equal(dom.window.document.querySelector("ia2-hare-viewer"), null);
  dom.window.eval(autoBundle);
  await eventually(() => dom.window.document.querySelector("ia2-extension-hare-viewer")?.dataset.open, "false");
  const viewer = dom.window.document.querySelector("ia2-extension-hare-viewer");
  const navigator = dom.window.document.querySelector("ia2-extension-navigator");
  assert.ok(viewer);
  assert.ok(navigator);

  dom.window.eval(bundle);
  await eventually(() => navigator.shadowRoot.querySelector(".panel")?.dataset.open, "true");
  assert.equal(viewer.hasAttribute("data-ia2-extension"), true);
  assert.equal(viewer.dataset.mode, "tabs");
  assert.equal(viewer.filesOpen, false);
  assert.equal(viewer.shadowRoot.querySelectorAll(".file-button").length, 2);
  assert.equal(viewer.shadowRoot.querySelector(".workspace").hidden, true);
  assert.equal(dom.window.document.body.style.overflow, "");
  await eventually(() => viewer.shadowRoot.querySelector(".state")?.textContent, "Semantic DOM");
  dom.window.eval(statusBundle);
  await eventually(() => reports.at(-1)?.files, 2);
  assert.ok(reports.at(-1)?.statements > 0);

  dom.window.eval(bundle);
  await eventually(() => navigator.shadowRoot.querySelector(".panel")?.dataset.open, "false");
  assert.equal(viewer.filesOpen, false);
  assert.equal(viewer.shadowRoot.querySelector(".workspace").hidden, true);
  assert.equal(dom.window.document.body.style.overflow, "");
  assert.equal(dom.window.document.querySelectorAll("ia2-extension-hare-viewer").length, 1);
  dom.window.close();
});

test("status bundle reports empty and live HTML/RDF states", async () => {
  const [contentBundle, statusBundle] = await Promise.all([
    readFile(resolve(packageRoot, "dist/chrome/content.js"), "utf8"),
    readFile(resolve(packageRoot, "dist/chrome/status.js"), "utf8"),
  ]);
  assert.doesNotMatch(statusBundle, /^\s*(?:import|export)\s/m);
  const dom = new JSDOM(`<!doctype html><html><body>
    <span rdf-subject="#item" rdf-predicate="https://schema.org/name">Item</span>
    </body></html>`, {
    pretendToBeVisual: true,
    runScripts: "outside-only",
    url: "https://example.test/page",
  });
  const reports = [];
  dom.window.chrome = {
    runtime: {
      sendMessage(message) {
        reports.push(message);
        return Promise.resolve();
      },
    },
  };

  dom.window.eval(contentBundle);
  await eventually(() => dom.window.document.querySelector("ia2-extension-navigator")?.shadowRoot?.querySelector(".count")?.textContent, "1");
  dom.window.eval(statusBundle);
  await eventually(() => reports.at(-1)?.statements, 1);
  assert.equal(reports.at(-1)?.files, 0);

  const carrier = dom.window.document.querySelector("[rdf-predicate]");
  carrier.removeAttribute("rdf-subject");
  carrier.removeAttribute("rdf-predicate");
  await eventually(() => reports.at(-1)?.statements, 0);
  assert.deepEqual(reports.map((report) => report.statements), [1, 0]);
  dom.window.close();
});
