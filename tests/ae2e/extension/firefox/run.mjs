import { spawn } from "node:child_process";
import { resolve } from "node:path";
import { firefox } from "playwright";

const root = process.cwd();
const port = 4187;
const webExt = resolve(root, "node_modules/.bin/web-ext");
const extensionPath = resolve(root, "packages/browser-extension/dist-e2e/firefox");
let output = "";

const server = spawn(process.execPath, ["tests/ae2e/server.mjs"], { cwd: root, stdio: ["ignore", "pipe", "pipe"] });
for (const stream of [server.stdout, server.stderr]) {
  stream.setEncoding("utf8");
  stream.on("data", (chunk) => { output += chunk; });
}

async function eventually(read, timeout, label) {
  const deadline = Date.now() + timeout;
  let lastError;
  while (Date.now() < deadline) {
    try {
      const value = await read();
      if (value) return value;
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolveDelay) => setTimeout(resolveDelay, 150));
  }
  throw new Error(`${label} timed out${lastError ? `: ${lastError}` : ""}\n${output}`);
}

async function stop(child) {
  if (child?.exitCode !== null) return;
  child.kill("SIGINT");
  await Promise.race([
    new Promise((resolveExit) => child.once("exit", resolveExit)),
    new Promise((resolveDelay) => setTimeout(resolveDelay, 2_000)),
  ]);
  if (child.exitCode === null) child.kill("SIGKILL");
}

let browser;
try {
  await eventually(async () => (await fetch(`http://127.0.0.1:${port}/health`)).ok, 10_000, "AE2E server");
  browser = spawn(webExt, [
    "run",
    `--source-dir=${extensionPath}`,
    `--firefox=${process.env.FIREFOX_BINARY || firefox.executablePath()}`,
    `--start-url=http://127.0.0.1:${port}/contract?autorun`,
    "--no-reload",
    "--no-input",
    "--args=-headless",
  ], {
    cwd: root,
    detached: true,
    env: { ...process.env, MOZ_HEADLESS: "1", NO_COLOR: "1" },
    stdio: ["ignore", "pipe", "pipe"],
  });
  for (const stream of [browser.stdout, browser.stderr]) {
    stream.setEncoding("utf8");
    stream.on("data", (chunk) => { output += chunk; });
  }
  const report = await eventually(async () => {
    const response = await fetch(`http://127.0.0.1:${port}/results`);
    return response.json();
  }, 60_000, "Firefox extension contract");
  const failures = report.cases.filter((entry) => !entry.ok);
  if (!report.runtime.includes("Firefox/")) throw new Error(`Expected Firefox runtime, got ${report.runtime}`);
  if (report.tag !== "ia2-extension-navigator") throw new Error(`Unexpected extension host ${report.tag}`);
  if (report.passed !== 14 || report.failed !== 0 || failures.length) {
    throw new Error(`Firefox extension contract failures:\n${JSON.stringify(failures, null, 2)}`);
  }
  for (const entry of report.cases) console.log(`  PASS ${entry.name}`);
  console.log(`[firefox-extension] ${report.passed} passed`);
} finally {
  if (browser?.pid) {
    try { process.kill(-browser.pid, "SIGINT"); } catch {}
  }
  await stop(browser);
  await stop(server);
}
