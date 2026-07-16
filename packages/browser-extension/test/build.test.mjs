import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { JSDOM } from "jsdom";
import sharp from "sharp";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

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

test("builds least-permission manifests for each browser", async () => {
  const [chrome, firefox, safari] = await Promise.all([
    manifest("chrome"), manifest("firefox"), manifest("safari"),
  ]);
  for (const value of [chrome, firefox, safari]) {
    assert.equal(value.manifest_version, 3);
    assert.deepEqual(value.permissions, ["activeTab", "scripting"]);
    assert.equal(value.host_permissions, undefined);
    assert.equal(value.content_scripts, undefined);
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

  const carrier = dom.window.document.querySelector("[rdf-predicate]");
  carrier.removeAttribute("rdf-subject");
  carrier.removeAttribute("rdf-predicate");
  await eventually(() => reports.at(-1)?.statements, 0);
  assert.deepEqual(reports.map((report) => report.statements), [1, 0]);
  dom.window.close();
});
