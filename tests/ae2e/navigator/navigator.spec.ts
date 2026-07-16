import { expect, test } from "@playwright/test";

type ContractReport = {
  cases: Array<{ name: string; ok: boolean; error?: string }>;
  failed: number;
  passed: number;
  runtime: string;
  tag: string;
};

test("embedded Navigator satisfies the shared real-browser contract", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await page.goto("/contract?embedded");
  await page.waitForSelector("ia2-rdf-navigator", { state: "attached" });
  const report = await page.evaluate(async () => {
    const { runNavigatorContract } = await import("/navigator-contract.mjs");
    return runNavigatorContract({ expectedTag: "ia2-rdf-navigator" });
  }) as ContractReport;

  expect(report.cases.filter((entry) => !entry.ok), JSON.stringify({ pageErrors, report }, null, 2)).toEqual([]);
  expect(report.failed).toBe(0);
  expect(report.passed).toBe(14);
  expect(pageErrors).toEqual([]);
});

test("drawer remains usable in a narrow mobile viewport", async ({ browserName, page }) => {
  test.skip(browserName !== "chromium", "One engine is enough for responsive geometry; the shared contract runs in every engine.");
  await page.setViewportSize({ width: 360, height: 640 });
  await page.goto("/contract?embedded");
  const bounds = await page.evaluate(async () => {
    const host = document.querySelector("ia2-rdf-navigator") as any;
    host.open();
    await new Promise((resolve) => setTimeout(resolve, 300));
    const panel = host.shadowRoot.querySelector(".panel") as HTMLElement;
    const rect = panel.getBoundingClientRect();
    return { bottom: rect.bottom, height: rect.height, left: rect.left, right: rect.right, top: rect.top, width: rect.width };
  });
  expect(bounds.left).toBeGreaterThanOrEqual(0);
  expect(bounds.top).toBeGreaterThanOrEqual(0);
  expect(bounds.right).toBeLessThanOrEqual(360);
  expect(bounds.bottom).toBeLessThanOrEqual(640);
  expect(bounds.width).toBeGreaterThan(300);
  expect(bounds.height).toBeGreaterThan(300);
});
