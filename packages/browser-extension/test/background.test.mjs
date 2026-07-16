import assert from "node:assert/strict";
import test from "node:test";
import { injectNavigator, registerExtension } from "../src/background.js";

function mockApi(executeScript) {
  const calls = [];
  let listener;
  return {
    api: {
      action: {
        onClicked: { addListener(value) { listener = value; } },
        setBadgeBackgroundColor(value) { calls.push(["badge-color", value]); return Promise.resolve(); },
        setBadgeText(value) { calls.push(["badge", value]); return Promise.resolve(); },
        setTitle(value) { calls.push(["title", value]); return Promise.resolve(); },
      },
      scripting: {
        executeScript(value) { calls.push(["execute", value]); return executeScript(value); },
      },
    },
    calls,
    click(tab) { listener(tab); },
  };
}

test("injects the Navigator into only the selected top-level tab", async () => {
  const fixture = mockApi(() => Promise.resolve());
  assert.equal(await injectNavigator(fixture.api, { id: 42 }), true);
  assert.deepEqual(fixture.calls[0], ["execute", {
    files: ["content.js"],
    target: { allFrames: false, tabId: 42 },
    world: "MAIN",
  }]);
  assert.deepEqual(fixture.calls.slice(1), [
    ["badge", { tabId: 42, text: "" }],
    ["title", { tabId: 42, title: "Open IA² Navigator" }],
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
  assert.deepEqual(fixture.calls.slice(1), [
    ["badge", { tabId: 7, text: "!" }],
    ["title", { tabId: 7, title: "IA² Navigator is unavailable on this page" }],
    ["badge-color", { color: "#6842c2", tabId: 7 }],
  ]);
});

test("registers the toolbar click without acting on missing tab identifiers", async () => {
  const fixture = mockApi(() => Promise.resolve());
  registerExtension(fixture.api);
  fixture.click({});
  await new Promise((resolve) => setImmediate(resolve));
  assert.deepEqual(fixture.calls, []);
});
