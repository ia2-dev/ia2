import assert from "node:assert/strict";
import test from "node:test";
import { injectNavigator, isRdfHtmlRendererUrl, registerExtension, statementBadge } from "../src/background.js";

function mockApi(executeScript) {
  const calls = [];
  let clickListener;
  let messageListener;
  let updatedListener;
  return {
    api: {
      action: {
        onClicked: { addListener(value) { clickListener = value; } },
        setBadgeBackgroundColor(value) { calls.push(["badge-color", value]); return Promise.resolve(); },
        setBadgeText(value) { calls.push(["badge", value]); return Promise.resolve(); },
        setIcon(value) { calls.push(["icon", value]); return Promise.resolve(); },
        setTitle(value) { calls.push(["title", value]); return Promise.resolve(); },
      },
      runtime: {
        onMessage: { addListener(value) { messageListener = value; } },
      },
      scripting: {
        executeScript(value) { calls.push(["execute", value]); return executeScript(value); },
      },
      tabs: {
        onUpdated: { addListener(value) { updatedListener = value; } },
        sendMessage(tabId, message, options) { calls.push(["send", { message, options, tabId }]); return Promise.resolve(); },
      },
    },
    calls,
    click(tab) { clickListener(tab); },
    message(message, sender) { messageListener(message, sender); },
    update(tabId, changeInfo) { updatedListener(tabId, changeInfo); },
  };
}

test("injects the Navigator into only the selected top-level tab", async () => {
  const fixture = mockApi(() => Promise.resolve());
  assert.equal(await injectNavigator(fixture.api, { id: 42 }), true);
  assert.deepEqual(fixture.calls, [
    ["badge", { tabId: 42, text: "" }],
    ["icon", { path: { 16: "icons/ia2-mark-16.png", 32: "icons/ia2-mark-32.png" }, tabId: 42 }],
    ["title", { tabId: 42, title: "Open IA² Navigator" }],
    ["execute", {
      files: ["status.js"],
      target: { allFrames: false, tabId: 42 },
    }],
    ["execute", {
      files: ["content.js"],
      target: { allFrames: false, tabId: 42 },
      world: "MAIN",
    }],
  ]);
});

test("marks browser-restricted pages as unavailable", async () => {
  const fixture = mockApi(() => Promise.reject(new Error("Cannot access this page")));
  const warn = console.warn;
  console.warn = () => {};
  try {
    assert.equal(await injectNavigator(fixture.api, { id: 7 }), false);
  } finally {
    console.warn = warn;
  }
  assert.deepEqual(fixture.calls, [
    ["badge", { tabId: 7, text: "" }],
    ["icon", { path: { 16: "icons/ia2-mark-16.png", 32: "icons/ia2-mark-32.png" }, tabId: 7 }],
    ["title", { tabId: 7, title: "Open IA² Navigator" }],
    ["execute", {
      files: ["status.js"],
      target: { allFrames: false, tabId: 7 },
    }],
    ["badge", { tabId: 7, text: "!" }],
    ["icon", { path: { 16: "icons/ia2-mark-muted-16.png", 32: "icons/ia2-mark-muted-32.png" }, tabId: 7 }],
    ["title", { tabId: 7, title: "IA² Navigator is unavailable on this page" }],
    ["badge-color", { color: "#6842c2", tabId: 7 }],
  ]);
});

test("publishes declaratively collected frames only for the RDF/HTML renderer", async () => {
  const fixture = mockApi(() => Promise.resolve());
  assert.equal(isRdfHtmlRendererUrl("https://ia2.dev/render/https://example.test/doc.ttl"), true);
  assert.equal(isRdfHtmlRendererUrl("http://localhost:8788/render"), true);
  assert.equal(isRdfHtmlRendererUrl("https://example.test/render"), false);
  assert.equal(await injectNavigator(fixture.api, { id: 55, url: "http://localhost:8788/render" }), true);
  assert.equal(fixture.calls.filter(([kind, value]) => kind === "execute" && value.files.includes("collector.js")).length, 0);
  assert.deepEqual(fixture.calls.filter(([kind]) => kind === "send").map(([, value]) => value.message.type), [
    "ia2:collect-frame-source",
    "ia2:navigator-sources",
  ]);
});

test("relays portable child-frame sources and includes them in the badge count", async () => {
  const fixture = mockApi(() => Promise.resolve());
  registerExtension(fixture.api);
  fixture.message({
    source: {
      access: "portable",
      label: "Rendered document",
      origin: "Opaque origin",
      result: { portableVersion: 1, quads: [{ sourceId: "source-1" }] },
      url: "about:srcdoc",
    },
    type: "ia2:frame-source",
  }, { frameId: 4, tab: { id: 56, url: "http://localhost:8788/render" } });
  await new Promise((resolve) => setImmediate(resolve));

  assert.equal(fixture.calls.filter(([kind]) => kind === "send").length, 0);
  await injectNavigator(fixture.api, { id: 56, url: "http://localhost:8788/render" });
  await new Promise((resolve) => setImmediate(resolve));

  const relay = fixture.calls.filter(([kind, value]) => kind === "send" && value.tabId === 56 && value.message.type === "ia2:navigator-sources").at(-1);
  assert.equal(relay[1].message.sources[0].id, "extension-frame-4");
  assert.deepEqual(fixture.calls.filter(([kind]) => kind === "badge").at(-1), ["badge", { tabId: 56, text: "1" }]);

  fixture.message({ statements: 1, type: "ia2:navigator-status" }, { tab: { id: 56 } });
  await new Promise((resolve) => setImmediate(resolve));
  assert.deepEqual(fixture.calls.filter(([kind]) => kind === "badge").at(-1), ["badge", { tabId: 56, text: "1" }]);
});

test("formats statement counts for the browser badge", () => {
  assert.equal(statementBadge(0), "");
  assert.equal(statementBadge(1), "1");
  assert.equal(statementBadge(999), "999");
  assert.equal(statementBadge(1000), "999+");
  assert.equal(statementBadge(Number.NaN), "");
});

test("mutes empty documents, badges RDF documents, and resets on navigation", async () => {
  const fixture = mockApi(() => Promise.resolve());
  registerExtension(fixture.api);

  fixture.message({ statements: 0, type: "ia2:navigator-status" }, { tab: { id: 9 } });
  await new Promise((resolve) => setImmediate(resolve));
  assert.deepEqual(fixture.calls.slice(-3), [
    ["badge", { tabId: 9, text: "" }],
    ["icon", { path: { 16: "icons/ia2-mark-muted-16.png", 32: "icons/ia2-mark-muted-32.png" }, tabId: 9 }],
    ["title", { tabId: 9, title: "No HTML/RDF found on this page" }],
  ]);

  fixture.message({ statements: 3, type: "ia2:navigator-status" }, { tab: { id: 9 } });
  await new Promise((resolve) => setImmediate(resolve));
  assert.deepEqual(fixture.calls.slice(-4), [
    ["badge", { tabId: 9, text: "3" }],
    ["icon", { path: { 16: "icons/ia2-mark-16.png", 32: "icons/ia2-mark-32.png" }, tabId: 9 }],
    ["title", { tabId: 9, title: "Open IA² Navigator (3 RDF statements)" }],
    ["badge-color", { color: "#6842c2", tabId: 9 }],
  ]);

  fixture.message({ files: 2, statements: 14, type: "ia2:navigator-status" }, { tab: { id: 9 } });
  await new Promise((resolve) => setImmediate(resolve));
  assert.deepEqual(fixture.calls.slice(-4), [
    ["badge", { tabId: 9, text: "14" }],
    ["icon", { path: { 16: "icons/ia2-mark-16.png", 32: "icons/ia2-mark-32.png" }, tabId: 9 }],
    ["title", { tabId: 9, title: "Open IA² Navigator (14 RDF statements; HARE: 2 files)" }],
    ["badge-color", { color: "#6842c2", tabId: 9 }],
  ]);

  fixture.update(9, { status: "loading" });
  await new Promise((resolve) => setImmediate(resolve));
  assert.deepEqual(fixture.calls.slice(-3), [
    ["badge", { tabId: 9, text: "" }],
    ["icon", { path: { 16: "icons/ia2-mark-16.png", 32: "icons/ia2-mark-32.png" }, tabId: 9 }],
    ["title", { tabId: 9, title: "Open IA² Navigator" }],
  ]);
});

test("registers the toolbar click without acting on missing tab identifiers", async () => {
  const fixture = mockApi(() => Promise.resolve());
  registerExtension(fixture.api);
  fixture.click({});
  await new Promise((resolve) => setImmediate(resolve));
  assert.deepEqual(fixture.calls, []);
});
