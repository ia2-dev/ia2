import { expect, test } from "@playwright/test";

test("self-viewing HARE renders Markdown with verified links and images", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });

  await page.goto("/hare-self-viewing");
  await expect(page.locator("#preview .rendered-markdown h1")).toHaveText("Vendor review");
  await expect(page.locator("#preview .rendered-markdown strong")).toHaveText("security baseline");
  await expect(page.locator("#preview .rendered-markdown li")).toHaveCount(2);
  await expect(page.locator("#preview .rendered-markdown table tbody td").last()).toHaveText("verified");
  const image = page.locator("#preview .rendered-markdown img");
  await expect(image).toHaveAttribute("data-hare-src", "../assets/verified.svg");
  await expect(image).toHaveAttribute("alt", "Verified review result");
  await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.naturalWidth)).toBeGreaterThan(0);
  await expect.poll(() => image.getAttribute("src")).toMatch(/^blob:/);
  await page.locator("#preview .rendered-markdown a", { hasText: "Open structured status" }).click();
  await expect(page.locator("#preview pre")).toContainText('\"vendor\": \"Northstar\"');
  await expect(page.locator("#preview .verification")).toHaveText("Verified");
  expect(errors).toEqual([]);
});
