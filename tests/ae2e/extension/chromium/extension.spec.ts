import { expect, test } from "./fixtures";

async function runActionScript(serviceWorker: import("@playwright/test").Worker, pageUrl: string) {
  const tabId = await serviceWorker.evaluate(async (url) => (await chrome.tabs.query({})).find((tab) => tab.url === url)?.id, pageUrl);
  expect(tabId).toBeTruthy();
  await serviceWorker.evaluate(async (id) => {
    await chrome.scripting.executeScript({ target: { tabId: id! }, files: ["content.js"], world: "MAIN" });
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
