import { chromium } from "@playwright/test";
import { createServer } from "node:http";
import { mkdtemp, readFile, rm, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, extname, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const repositoryRoot = resolve(packageRoot, "../..");
const siteRoot = resolve(repositoryRoot, ".site");
const extensionRoot = resolve(packageRoot, "dist-e2e/chrome");
const assetsRoot = resolve(packageRoot, "store/assets");
const contentTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".png", "image/png"],
  [".svg", "image/svg+xml"],
]);

await Promise.all([
  stat(resolve(siteRoot, "index.html")),
  stat(resolve(extensionRoot, "manifest.json")),
]);

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url ?? "/", "http://127.0.0.1");
    const relative = decodeURIComponent(url.pathname).replace(/^\/+/, "");
    let target = resolve(siteRoot, relative || "index.html");
    if (target !== siteRoot && !target.startsWith(`${siteRoot}${sep}`)) throw new Error("Invalid path.");
    if ((await stat(target)).isDirectory()) target = join(target, "index.html");
    const body = await readFile(target);
    response.writeHead(200, { "content-type": contentTypes.get(extname(target)) ?? "application/octet-stream" });
    response.end(body);
  } catch {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("Not found");
  }
});

await new Promise((resolveListen, rejectListen) => {
  server.once("error", rejectListen);
  server.listen(0, "127.0.0.1", resolveListen);
});

const address = server.address();
if (!address || typeof address === "string") throw new Error("Could not start the store asset server.");
const baseUrl = `http://127.0.0.1:${address.port}`;
const profile = await mkdtemp(join(tmpdir(), "ia2-store-assets-"));
let context;

async function runToolbarAction(serviceWorker, pageUrl) {
  const tabId = await serviceWorker.evaluate(async (url) => (
    await chrome.tabs.query({})
  ).find((tab) => tab.url === url)?.id, pageUrl);
  if (!Number.isInteger(tabId)) throw new Error(`Could not find the Chrome tab for ${pageUrl}`);
  await serviceWorker.evaluate(async (id) => {
    await chrome.scripting.executeScript({ target: { tabId: id }, files: ["content.js"], world: "MAIN" });
    await chrome.scripting.executeScript({ target: { tabId: id }, files: ["status.js"] });
  }, tabId);
}

try {
  context = await chromium.launchPersistentContext(profile, {
    args: [
      `--disable-extensions-except=${extensionRoot}`,
      `--load-extension=${extensionRoot}`,
    ],
    channel: "chromium",
    deviceScaleFactor: 1,
    headless: true,
    reducedMotion: "reduce",
    viewport: { height: 800, width: 1280 },
  });
  let [serviceWorker] = context.serviceWorkers();
  serviceWorker ??= await context.waitForEvent("serviceworker");
  const page = context.pages()[0] ?? await context.newPage();

  await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
  await page.bringToFront();
  await runToolbarAction(serviceWorker, page.url());
  const navigator = page.locator("ia2-rdf-navigator, ia2-extension-navigator");
  await navigator.waitFor({ state: "attached" });
  await page.waitForFunction(() => (
    document.querySelector("ia2-rdf-navigator, ia2-extension-navigator")?.shadowRoot?.querySelector(".panel")?.dataset.open === "true"
  ));
  await page.screenshot({ path: resolve(assetsRoot, "screenshot-navigator.png") });

  await page.goto(`${baseUrl}/spec/resource-envelope/examples/decision-handoff.html`, { waitUntil: "networkidle" });
  const viewer = page.locator("ia2-extension-hare-viewer");
  await viewer.waitFor({ state: "attached" });
  await viewer.evaluate((host) => host.shadowRoot.querySelector(".files-tab")?.click());
  await page.waitForFunction(() => document.querySelector("ia2-extension-hare-viewer")?.filesOpen === true);
  await page.screenshot({ path: resolve(assetsRoot, "screenshot-hare.png") });

  await sharp(resolve(assetsRoot, "promo-small.svg"))
    .resize(440, 280)
    .flatten({ background: "#6842c2" })
    .png()
    .toFile(resolve(assetsRoot, "promo-small.png"));
} finally {
  await context?.close();
  await new Promise((resolveClose) => server.close(resolveClose));
  await rm(profile, { force: true, recursive: true });
}

console.log(`Created Chrome Web Store assets in ${assetsRoot}`);
