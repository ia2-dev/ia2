import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests/ae2e/extension/chromium",
  fullyParallel: false,
  workers: 1,
  timeout: 60_000,
  expect: { timeout: 15_000 },
  reporter: "line",
  webServer: {
    command: "node tests/ae2e/server.mjs",
    url: "http://127.0.0.1:4187/health",
    reuseExistingServer: !process.env.CI,
  },
});
