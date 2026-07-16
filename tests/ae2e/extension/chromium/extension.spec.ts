import { expect, test } from "./fixtures";

async function runActionScript(serviceWorker: import("@playwright/test").Worker, pageUrl: string) {
  const tabId = await serviceWorker.evaluate(async (url) => (await chrome.tabs.query({})).find((tab) => tab.url === url)?.id, pageUrl);
  expect(tabId).toBeTruthy();
  await serviceWorker.evaluate(async (id) => {
    await chrome.scripting.executeScript({ target: { tabId: id! }, files: ["content.js"], world: "MAIN" });
    await chrome.scripting.executeScript({ target: { tabId: id! }, files: ["status.js"] });
  }, tabId);
}

test("real Chrome extension satisfies the shared Navigator contract", async ({ page, serviceWorker }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await page.goto("http://127.0.0.1:4187/contract?autorun");
  await runActionScript(serviceWorker, page.url());
  await page.waitForFunction(() => (window as any).__IA2NavigatorAE2E?.state === "complete", null, { timeout: 45_000 });
  const result = await page.evaluate(() => (window as any).__IA2NavigatorAE2E.report);
  expect(result.cases.filter((entry: { ok: boolean }) => !entry.ok), JSON.stringify({ pageErrors, result }, null, 2)).toEqual([]);
  expect(result).toMatchObject({ failed: 0, passed: 14, tag: "ia2-extension-navigator" });
  expect(pageErrors).toEqual([]);
});

test("Chrome MV3 worker and scripting entry point own one host", async ({ context, extensionId, serviceWorker }) => {
  const manifest = await serviceWorker.evaluate(() => chrome.runtime.getManifest());
  expect(manifest).toMatchObject({
    manifest_version: 3,
    background: { service_worker: "background.js" },
    permissions: ["activeTab", "scripting"],
    content_scripts: [
      { js: ["auto.js"], matches: ["http://127.0.0.1/*"], world: "MAIN" },
      { js: ["status.js"], matches: ["http://127.0.0.1/*"], world: "ISOLATED" },
    ],
  });
  expect(extensionId).toMatch(/^[a-p]{32}$/);

  const page = await context.newPage();
  await page.goto("http://127.0.0.1:4187/contract");
  await runActionScript(serviceWorker, page.url());
  await expect.poll(() => page.locator("ia2-extension-navigator").count()).toBe(1);
  await runActionScript(serviceWorker, page.url());
  await expect.poll(async () => page.locator("ia2-extension-navigator").evaluate((host: any) => host.shadowRoot.querySelector(".panel").dataset.open)).toBe("false");
  await expect.poll(() => page.locator("ia2-rdf-navigator").count()).toBe(0);
});

test("Chrome automatically adds tabs to an authored HARE envelope", async ({ context, serviceWorker }) => {
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:4187/hare");
  await expect(page.locator('script:not([type="application/octet-stream"])')).toHaveCount(0);
  await expect(page.locator("ia2-hare-viewer")).toHaveCount(0);

  const viewer = page.locator("ia2-extension-hare-viewer");
  await expect(viewer).toHaveCount(1);
  await expect.poll(() => viewer.evaluate((host: any) => host.mode)).toBe("tabs");
  await expect.poll(() => viewer.evaluate((host: any) => host.filesOpen)).toBe(false);
  await expect.poll(() => viewer.evaluate((host: any) => host.shadowRoot.querySelectorAll(".file-button").length)).toBe(2);
  await expect.poll(() => viewer.evaluate((host: any) => host.shadowRoot.querySelector(".state")?.textContent)).toBe("Semantic DOM");
  await expect.poll(() => viewer.evaluate((host: any) => host.shadowRoot.querySelector(".workspace").hidden)).toBe(true);
  const navigator = page.locator("ia2-extension-navigator");
  await expect(navigator).toHaveCount(1);

  const tabId = await serviceWorker.evaluate(async (url) => (await chrome.tabs.query({})).find((tab) => tab.url === url)?.id, page.url());
  await expect.poll(() => serviceWorker.evaluate((id) => chrome.action.getTitle({ tabId: id! }), tabId)).toContain("Open IA² Navigator (");
  await expect.poll(() => serviceWorker.evaluate((id) => chrome.action.getTitle({ tabId: id! }), tabId)).toContain("HARE: 2 files");
  await runActionScript(serviceWorker, page.url());
  await expect.poll(() => navigator.evaluate((host: any) => host.shadowRoot.querySelector(".panel").dataset.open)).toBe("true");
  await expect.poll(() => viewer.evaluate((host: any) => host.filesOpen)).toBe(false);
  await runActionScript(serviceWorker, page.url());
  await expect.poll(() => navigator.evaluate((host: any) => host.shadowRoot.querySelector(".panel").dataset.open)).toBe("false");
  await expect.poll(() => viewer.evaluate((host: any) => host.filesOpen)).toBe(false);

  await viewer.evaluate((host: any) => host.shadowRoot.querySelector(".files-tab").click());
  await expect.poll(() => viewer.evaluate((host: any) => host.filesOpen)).toBe(true);
  await page.setViewportSize({ width: 390, height: 844 });
  await expect.poll(() => viewer.evaluate((host: any) => getComputedStyle(host.shadowRoot.querySelector(".workspace")).gridTemplateColumns.split(" ").length)).toBe(1);
  await expect.poll(() => viewer.evaluate((host: any) => getComputedStyle(host.shadowRoot.querySelector(".browser")).borderRightWidth)).toBe("0px");

  await runActionScript(serviceWorker, page.url());
  await expect.poll(() => navigator.evaluate((host: any) => host.shadowRoot.querySelector(".panel").dataset.open)).toBe("true");
  await expect.poll(() => viewer.evaluate((host: any) => host.filesOpen)).toBe(true);
  await expect.poll(() => page.evaluate(() => (
    Number(getComputedStyle(document.querySelector("ia2-extension-navigator")!).zIndex)
    > Number(getComputedStyle(document.querySelector("ia2-extension-hare-viewer")!).zIndex)
  ))).toBe(true);
  await runActionScript(serviceWorker, page.url());
  await expect.poll(() => navigator.evaluate((host: any) => host.shadowRoot.querySelector(".panel").dataset.open)).toBe("false");
  await expect.poll(() => viewer.evaluate((host: any) => host.filesOpen)).toBe(true);
  await viewer.evaluate((host: any) => host.shadowRoot.querySelector(".document-tab").click());
  await expect.poll(() => viewer.evaluate((host: any) => host.filesOpen)).toBe(false);
  await expect.poll(() => viewer.evaluate((host: any) => getComputedStyle(host).display)).not.toBe("none");
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe("");
  await expect(viewer).toHaveCount(1);
});

test("Chrome automatically opens files for a bare HARE envelope", async ({ context, serviceWorker }) => {
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:4187/hare-bare");
  await expect(page.locator('script:not([type="application/octet-stream"])')).toHaveCount(0);
  const viewer = page.locator("ia2-extension-hare-viewer");
  await expect(viewer).toHaveCount(1);
  await expect.poll(() => viewer.evaluate((host: any) => host.mode)).toBe("full");
  await expect.poll(() => viewer.evaluate((host: any) => host.filesOpen)).toBe(true);
  await expect.poll(() => viewer.evaluate((host: any) => host.shadowRoot.querySelector(".document-tab").hidden)).toBe(true);
  await expect.poll(() => viewer.evaluate((host: any) => host.shadowRoot.querySelectorAll(".file-button").length)).toBe(3);
  await expect.poll(() => viewer.evaluate((host: any) => host.shadowRoot.querySelector(".state")?.textContent)).toBe("Verified");
  const navigator = page.locator("ia2-extension-navigator");
  await expect(navigator).toHaveCount(1);
  await runActionScript(serviceWorker, page.url());
  await expect.poll(() => navigator.evaluate((host: any) => host.shadowRoot.querySelector(".panel").dataset.open)).toBe("true");
  await expect.poll(() => viewer.evaluate((host: any) => host.filesOpen)).toBe(true);
  await runActionScript(serviceWorker, page.url());
  await expect.poll(() => navigator.evaluate((host: any) => host.shadowRoot.querySelector(".panel").dataset.open)).toBe("false");
  await expect.poll(() => viewer.evaluate((host: any) => host.filesOpen)).toBe(true);
});

test("Chrome loads an authored HARE preview without attempting scripts", async ({ context }) => {
  const page = await context.newPage();
  const blockedScripts: string[] = [];
  page.on("console", (message) => {
    if (/blocked script execution/i.test(message.text())) blockedScripts.push(message.text());
  });
  await page.goto("http://127.0.0.1:4187/hare-authored");
  const viewer = page.locator("ia2-extension-hare-viewer");
  await expect(viewer).toHaveCount(1);
  await expect.poll(() => viewer.locator(".state").textContent()).toBe("Semantic DOM");
  const frame = viewer.locator("iframe");
  await expect(frame).toHaveCount(1);
  await frame.evaluate((element: HTMLIFrameElement) => {
    if (element.contentDocument?.readyState === "complete") return;
    return new Promise<void>((resolve) => element.addEventListener("load", () => resolve(), { once: true }));
  });
  expect(blockedScripts).toEqual([]);
});

test("Chrome embeds a semantic HARE document and follows its byte and host links", async ({ context }) => {
  const page = await context.newPage();
  const blocked: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error" && /content security policy|refused to (?:frame|load)|violates.+directive/i.test(message.text())) {
      blocked.push(message.text());
    }
  });
  await page.goto("http://127.0.0.1:4187/hare");

  const viewer = page.locator("ia2-extension-hare-viewer");
  await expect(viewer).toHaveCount(1);
  await viewer.locator(".files-tab").click();
  await viewer.locator('.file-button[data-path="/brief.html"]').click();

  let documentFrame = viewer.locator("iframe").contentFrame();
  await expect(documentFrame.getByRole("heading", { name: "Atlas account-index migration" })).toBeVisible();
  await expect(documentFrame.getByText("Approve a 10% initial stage.", { exact: false })).toBeVisible();

  const decisionLink = documentFrame.getByRole("link", { name: "Inspect the decision data" });
  await expect(decisionLink).toHaveAttribute("data-hare-href", "/decision.json");
  await expect(decisionLink).toHaveAttribute("href", "#hare-navigation");
  await decisionLink.click();
  await expect.poll(() => viewer.locator(".preview-title").textContent()).toBe("Decision record");
  await expect.poll(() => viewer.locator(".state").textContent()).toBe("Verified");
  await expect(viewer.locator("pre.source")).toContainText('"decision": "approve-with-conditions"');
  await expect(viewer.locator("iframe")).toHaveCount(0);

  await viewer.locator('.file-button[data-path="/brief.html"]').click();
  documentFrame = viewer.locator("iframe").contentFrame();
  await expect(documentFrame.getByRole("heading", { name: "Atlas account-index migration" })).toBeVisible();
  const returnLink = documentFrame.getByRole("link", { name: "Return to the envelope" });
  await expect(returnLink).toHaveAttribute("data-hare-href", "/");
  await expect(returnLink).toHaveAttribute("href", "#hare-navigation");
  await returnLink.click();
  await expect.poll(() => viewer.evaluate((host: any) => host.filesOpen)).toBe(false);
  await expect(page.getByRole("heading", { name: "Atlas migration handoff" })).toBeVisible();
  expect(blocked).toEqual([]);
});

test("Chrome materializes nested resources and links between HARE documents", async ({ context }) => {
  const page = await context.newPage();
  const blocked: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error" && /content security policy|refused to (?:frame|load)|violates.+directive/i.test(message.text())) {
      blocked.push(message.text());
    }
  });
  await page.goto("http://127.0.0.1:4187/hare-authored");

  const hostImage = page.getByRole("img", { name: "Orion release path from web through API to data" });
  await expect.poll(() => hostImage.evaluate((node: HTMLImageElement) => node.naturalWidth)).toBeGreaterThan(0);
  await expect.poll(() => hostImage.getAttribute("src")).toMatch(/^blob:/);
  await expect(hostImage).toHaveAttribute(
    "data-hare-src",
    "https://orion-release.hare.invalid/assets/orion-release-map.svg",
  );

  const viewer = page.locator("ia2-extension-hare-viewer");
  await expect(viewer).toHaveCount(1);
  await viewer.locator(".files-tab").click();
  await viewer.locator('.file-button[data-path="/release-notes.html"]').click();

  let documentFrame = viewer.locator("iframe").contentFrame();
  await expect(documentFrame.getByRole("heading", { name: "Orion 4.2 release notes" })).toBeVisible();
  const image = documentFrame.getByRole("img", { name: "Orion release path from web through API to data" });
  await expect.poll(() => image.evaluate((node: HTMLImageElement) => node.naturalWidth)).toBeGreaterThan(0);
  await expect.poll(() => image.getAttribute("src")).toMatch(/^blob:/);
  const article = documentFrame.locator("article");
  await expect.poll(() => article.evaluate((node) => getComputedStyle(node).color)).toBe("rgb(41, 36, 59)");

  await documentFrame.getByRole("link", { name: "Open the rollback plan" }).click();
  documentFrame = viewer.locator("iframe").contentFrame();
  await expect(documentFrame.getByRole("heading", { name: "Rollback plan" })).toBeVisible();
  await documentFrame.getByRole("link", { name: "Back to the release notes" }).click();
  documentFrame = viewer.locator("iframe").contentFrame();
  await expect(documentFrame.getByRole("heading", { name: "Orion 4.2 release notes" })).toBeVisible();
  await documentFrame.getByRole("link", { name: "Return to the handoff" }).click();
  await expect.poll(() => viewer.evaluate((host: any) => host.filesOpen)).toBe(false);
  await expect(page.getByRole("heading", { name: "Orion 4.2 release handoff" })).toBeVisible();
  expect(blocked).toEqual([]);
});

test("Chrome action mutes empty documents and colors HTML/RDF documents", async ({ context, serviceWorker }) => {
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:4187/empty");
  await runActionScript(serviceWorker, page.url());
  const emptyTabId = await serviceWorker.evaluate(async (url) => (await chrome.tabs.query({})).find((tab) => tab.url === url)?.id, page.url());
  await expect.poll(() => serviceWorker.evaluate((tabId) => chrome.action.getTitle({ tabId: tabId! }), emptyTabId)).toBe("No HTML/RDF found on this page");
  await expect.poll(() => serviceWorker.evaluate((tabId) => chrome.action.getBadgeText({ tabId: tabId! }), emptyTabId)).toBe("");

  await page.evaluate(() => {
    const carrier = document.createElement("span");
    carrier.setAttribute("rdf-subject", "#item");
    carrier.setAttribute("rdf-predicate", "https://schema.org/name");
    carrier.textContent = "Item";
    document.body.append(carrier);
  });
  await expect.poll(() => serviceWorker.evaluate((tabId) => chrome.action.getBadgeText({ tabId: tabId! }), emptyTabId)).toBe("1");
  await expect.poll(() => serviceWorker.evaluate((tabId) => chrome.action.getTitle({ tabId: tabId! }), emptyTabId)).toBe("Open IA² Navigator (1 RDF statement)");

  await page.goto("http://127.0.0.1:4187/contract");
  await runActionScript(serviceWorker, page.url());
  const rdfTabId = await serviceWorker.evaluate(async (url) => (await chrome.tabs.query({})).find((tab) => tab.url === url)?.id, page.url());
  await expect.poll(() => serviceWorker.evaluate((tabId) => chrome.action.getBadgeText({ tabId: tabId! }), rdfTabId)).toBe("18");
  await expect.poll(() => serviceWorker.evaluate((tabId) => chrome.action.getTitle({ tabId: tabId! }), rdfTabId)).toBe("Open IA² Navigator (18 RDF statements)");
});
