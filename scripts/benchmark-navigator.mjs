import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, resolve, sep } from "node:path";
import { chromium } from "playwright";

const root = resolve(import.meta.dirname, "..");
const siteRoot = resolve(root, ".site");
const port = Number(process.env.IA2_NAVIGATOR_BENCH_PORT ?? 4192);
const samples = Number(process.env.IA2_NAVIGATOR_BENCH_SAMPLES ?? 3);
const cpuSlowdown = Number(process.env.IA2_NAVIGATOR_BENCH_CPU ?? 4);
const includeReSpec = process.argv.includes("--include-respec");
const targetPath = "/spec/rdf-html/";

const contentTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".map", "application/json; charset=utf-8"],
  [".png", "image/png"],
  [".svg", "image/svg+xml"],
  [".ttl", "text/turtle; charset=utf-8"],
  [".trig", "application/trig; charset=utf-8"],
  [".txt", "text/plain; charset=utf-8"],
]);

function percentile(values, fraction) {
  const sorted = [...values].sort((left, right) => left - right);
  return sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * fraction))] ?? 0;
}

function summarize(samplesForMetric) {
  return {
    median: percentile(samplesForMetric, 0.5),
    min: Math.min(...samplesForMetric),
    max: Math.max(...samplesForMetric),
  };
}

function summarizeRecords(records) {
  const keys = Object.keys(records[0] ?? {});
  return Object.fromEntries(
    keys.flatMap((key) => {
      const values = records.map((record) => record[key]).filter((value) => typeof value === "number");
      return values.length ? [[key, summarize(values)]] : [];
    }),
  );
}

async function resolveRequestFile(pathname) {
  let relative = decodeURIComponent(pathname).replace(/^\/+/, "");
  if (!relative || relative.endsWith("/")) relative += "index.html";
  const candidate = resolve(siteRoot, relative);
  if (candidate !== siteRoot && !candidate.startsWith(`${siteRoot}${sep}`)) return null;
  try {
    const metadata = await stat(candidate);
    return metadata.isFile() ? candidate : null;
  } catch {
    return null;
  }
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url ?? "/", `http://127.0.0.1:${port}`);
  const file = await resolveRequestFile(url.pathname);
  if (!file) {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }
  response.writeHead(200, {
    "cache-control": "no-store",
    "content-type": contentTypes.get(extname(file)) ?? "application/octet-stream",
  });
  createReadStream(file).pipe(response);
});

async function listen() {
  await new Promise((resolvePromise, reject) => {
    server.once("error", reject);
    server.listen(port, "127.0.0.1", resolvePromise);
  });
}

async function nextPaint(page) {
  await page.evaluate(() => new Promise((resolvePromise) => {
    requestAnimationFrame(() => requestAnimationFrame(resolvePromise));
  }));
}

async function configurePage(context, withNavigator) {
  const page = await context.newPage();
  await page.addInitScript(() => {
    globalThis.__ia2LongTasks = [];
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        globalThis.__ia2LongTasks.push({ duration: entry.duration, startTime: entry.startTime });
      }
    }).observe({ entryTypes: ["longtask"] });
  });
  if (!includeReSpec) {
    await page.route("https://www.w3.org/Tools/respec/**", (route) => route.abort());
  }
  if (!withNavigator) {
    await page.route("**/html-rdf-navigator.js", (route) => route.abort());
  }
  const cdp = await context.newCDPSession(page);
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: cpuSlowdown });
  return { cdp, page };
}

async function loadSample(browser, withNavigator) {
  const context = await browser.newContext();
  const { cdp, page } = await configurePage(context, withNavigator);
  const started = performance.now();
  await page.goto(`http://127.0.0.1:${port}${targetPath}`, {
    timeout: 120_000,
    waitUntil: "domcontentloaded",
  });
  const domContentLoadedWall = performance.now() - started;
  if (withNavigator) {
    await page.waitForSelector("ia2-rdf-navigator", { state: "attached", timeout: 120_000 });
  }
  if (includeReSpec) {
    await page.waitForFunction(
      () => document.documentElement.dataset.respecReady === "true",
      null,
      { timeout: 120_000 },
    );
  }
  await nextPaint(page);
  const browserMetrics = await page.evaluate((navigatorEnabled) => {
    const navigation = performance.getEntriesByType("navigation")[0];
    const host = document.querySelector("ia2-rdf-navigator");
    const shadowRoot = host?.shadowRoot;
    const longTasks = globalThis.__ia2LongTasks ?? [];
    return {
      domContentLoaded: navigation?.domContentLoadedEventEnd ?? 0,
      duration: performance.now(),
      heap: performance.memory?.usedJSHeapSize ?? 0,
      longTaskCount: longTasks.length,
      longTaskDuration: longTasks.reduce((total, entry) => total + entry.duration, 0),
      navigatorNodes: navigatorEnabled ? shadowRoot?.querySelectorAll("*").length ?? 0 : 0,
      navigatorRows: navigatorEnabled ? shadowRoot?.querySelectorAll(".quad").length ?? 0 : 0,
      statementCount: navigatorEnabled ? Number(shadowRoot?.querySelector(".count")?.textContent ?? 0) : 0,
    };
  }, withNavigator);
  await cdp.send("HeapProfiler.collectGarbage");
  const domCounters = await cdp.send("Memory.getDOMCounters");
  await context.close();
  return {
    ...browserMetrics,
    documents: domCounters.documents,
    domContentLoadedWall,
    jsEventListeners: domCounters.jsEventListeners,
    nodes: domCounters.nodes,
  };
}

async function operationSample(browser) {
  const context = await browser.newContext();
  const { cdp, page } = await configurePage(context, true);
  await page.goto(`http://127.0.0.1:${port}${targetPath}`, {
    timeout: 120_000,
    waitUntil: "domcontentloaded",
  });
  await page.waitForSelector("ia2-rdf-navigator", { state: "attached", timeout: 120_000 });
  if (includeReSpec) {
    await page.waitForFunction(
      () => document.documentElement.dataset.respecReady === "true",
      null,
      { timeout: 120_000 },
    );
  }

  const durations = await page.evaluate(async () => {
    const host = document.querySelector("ia2-rdf-navigator");
    const root = host.shadowRoot;
    const paint = () => new Promise((resolvePromise) => {
      requestAnimationFrame(() => requestAnimationFrame(resolvePromise));
    });
    const measure = async (action) => {
      const started = performance.now();
      await action();
      await paint();
      return performance.now() - started;
    };
    const click = (selector) => {
      const target = root.querySelector(selector);
      if (!target) throw new Error(`Missing benchmark target: ${selector}`);
      target.click();
    };

    const result = {};
    result.open = await measure(() => host.open());
    result.syncPage = await measure(() => click('.sync-option[data-sync-mode="page"]'));
    result.pageScroll = await measure(async () => {
      window.scrollTo(0, Math.min(window.scrollY + 2_000, document.documentElement.scrollHeight));
      await new Promise((resolvePromise) => setTimeout(resolvePromise, 80));
    });
    result.syncOffFromPage = await measure(() => click('.sync-option[data-sync-mode="off"]'));
    result.syncPanel = await measure(() => click('.sync-option[data-sync-mode="panel"]'));
    result.syncOffFromPanel = await measure(() => click('.sync-option[data-sync-mode="off"]'));

    const search = root.querySelector(".navigator-search");
    result.search = await measure(() => {
      search.value = "rdfhtml";
      search.dispatchEvent(new InputEvent("input", { bubbles: true, inputType: "insertText" }));
    });
    result.clearSearch = await measure(() => {
      search.value = "";
      search.dispatchEvent(new InputEvent("input", { bubbles: true, inputType: "deleteContentBackward" }));
    });
    result.namespaceFilter = await measure(() => click(".vocabulary-toggle"));
    result.namespaceRestore = await measure(() => click(".vocabulary-toggle"));
    result.turtleView = await measure(() => click('[data-view="turtle"]'));
    result.navigatorView = await measure(() => click('[data-view="navigator"]'));
    result.refresh = await measure(() => host.refresh());

    const mutationTarget = document.querySelector("[rdf-predicate]");
    const previousValue = mutationTarget?.textContent ?? "";
    const oldViewport = root.querySelector(".viewport");
    const mutationStarted = performance.now();
    if (mutationTarget) mutationTarget.textContent = `${previousValue} `;
    while (oldViewport?.isConnected) {
      await new Promise((resolvePromise) => requestAnimationFrame(resolvePromise));
    }
    await paint();
    result.mutationRefresh = performance.now() - mutationStarted;
    if (mutationTarget) mutationTarget.textContent = previousValue;
    return result;
  });

  await cdp.send("HeapProfiler.collectGarbage");
  const domCounters = await cdp.send("Memory.getDOMCounters");
  const extra = await page.evaluate(() => ({
    heap: performance.memory?.usedJSHeapSize ?? 0,
    navigatorButtons: document.querySelector("ia2-rdf-navigator")?.shadowRoot?.querySelectorAll("button").length ?? 0,
    navigatorNodes: document.querySelector("ia2-rdf-navigator")?.shadowRoot?.querySelectorAll("*").length ?? 0,
    sourceToggles: document.querySelector("ia2-rdf-navigator")?.shadowRoot?.querySelectorAll(".source-toggle").length ?? 0,
    termLinks: document.querySelector("ia2-rdf-navigator")?.shadowRoot?.querySelectorAll(".term-link").length ?? 0,
    termLocateButtons: document.querySelector("ia2-rdf-navigator")?.shadowRoot?.querySelectorAll(".term-locate-button").length ?? 0,
  }));
  await context.close();
  return { ...durations, ...extra, jsEventListeners: domCounters.jsEventListeners, nodes: domCounters.nodes };
}

await listen();
const browser = await chromium.launch({ headless: true });

try {
  const withoutNavigator = [];
  const withNavigator = [];
  const operations = [];
  for (let index = 0; index < samples; index += 1) {
    withoutNavigator.push(await loadSample(browser, false));
    withNavigator.push(await loadSample(browser, true));
    operations.push(await operationSample(browser));
  }
  process.stdout.write(`${JSON.stringify({
    configuration: {
      cpuSlowdown,
      includeReSpec,
      samples,
      target: targetPath,
    },
    load: {
      navigatorDisabled: summarizeRecords(withoutNavigator),
      navigatorEnabled: summarizeRecords(withNavigator),
      raw: { navigatorDisabled: withoutNavigator, navigatorEnabled: withNavigator },
    },
    operations: {
      raw: operations,
      summary: summarizeRecords(operations),
    },
  }, null, 2)}\n`);
} finally {
  await browser.close();
  await new Promise((resolvePromise) => server.close(resolvePromise));
}
