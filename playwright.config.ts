import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "tests/ae2e/navigator",
  fullyParallel: false,
  workers: 1,
  timeout: 45_000,
  expect: { timeout: 10_000 },
  use: {
    baseURL: "http://127.0.0.1:4187",
    trace: "retain-on-failure",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
  webServer: {
    command: "node tests/ae2e/server.mjs",
    url: "http://127.0.0.1:4187/health",
    reuseExistingServer: !process.env.CI,
  },
});
