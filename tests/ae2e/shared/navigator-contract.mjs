const delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function eventually(read, message, timeout = 10_000) {
  const deadline = performance.now() + timeout;
  let value;
  while (performance.now() < deadline) {
    value = read();
    if (value) return value;
    await delay(40);
  }
  throw new Error(`${message}${value === undefined ? "" : ` (last value: ${String(value)})`}`);
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function dispatchPointer(target, type, init = {}) {
  target.dispatchEvent(new PointerEvent(type, { bubbles: true, button: 0, pointerId: 1, ...init }));
}

function dispatchInput(input, value) {
  input.value = value;
  input.dispatchEvent(new InputEvent("input", { bubbles: true, inputType: "insertText", data: value }));
}

function reportValue(error) {
  return error instanceof Error ? `${error.name}: ${error.message}` : String(error);
}

export async function runNavigatorContract({ expectedTag } = {}) {
  const host = await eventually(
    () => document.querySelector("[data-ia2-extension], ia2-rdf-navigator"),
    "Navigator host did not mount",
  );
  if (expectedTag) assert(host.localName === expectedTag, `expected ${expectedTag}, got ${host.localName}`);
  const root = await eventually(() => host.shadowRoot, "Navigator shadow root did not attach");
  const extensionOwned = host.hasAttribute("data-ia2-extension");
  const one = (selector) => root.querySelector(selector);
  const all = (selector) => Array.from(root.querySelectorAll(selector));
  const tab = (view) => {
    const button = one(`[data-view="${view}"]`);
    assert(button, `missing ${view} tab`);
    button.click();
    return button;
  };
  const cases = [];
  const run = async (name, test) => {
    const started = performance.now();
    try {
      await test();
      cases.push({ name, ok: true, duration: Math.round(performance.now() - started) });
    } catch (error) {
      cases.push({ name, ok: false, error: reportValue(error), duration: Math.round(performance.now() - started) });
    }
  };

  host.open();
  await delay(0);

  await run("mounts an isolated, contextual navigator surface", async () => {
    assert(root instanceof ShadowRoot, "Navigator is not isolated in a shadow root");
    assert(one(".panel")?.dataset.open === "true", "Navigator did not open");
    assert(one(".launcher")?.hidden === extensionOwned, "launcher visibility does not match the Navigator surface");
    assert(one(".launcher .count")?.textContent === "18", `expected 18 source statements, got ${one(".launcher .count")?.textContent}`);
    const labels = all('[role="tab"]').map((item) => item.textContent.trim());
    for (const label of ["Navigator", "Vocabulary (4)", "Discovery (1)", "Turtle", "JSON-LD", "Diagnostics (1)"]) {
      assert(labels.includes(label), `missing contextual tab ${label}: ${labels.join(", ")}`);
    }
    assert(one('.vocabulary-link[href="http://127.0.0.1:4187/contract#"]'), "document namespace link is missing");
  });

  await run("filters statements, suggests terms, and toggles namespaces", async () => {
    tab("navigator");
    const search = one(".navigator-search");
    dispatchInput(search, "Alice");
    assert(all(".quad:not([hidden])").length > 0, "text filter hid every matching statement");
    assert(one(".filter-count")?.textContent.includes("of 18"), "filter count did not describe the narrowed result");
    dispatchInput(search, "no statement matches this");
    assert(one(".filter-empty")?.hidden === false, "empty filter result was not announced");
    assert(one(".filter-count")?.textContent === "0 of 18", "empty filter count is wrong");
    dispatchInput(search, "Agent");
    search.focus();
    await eventually(() => all('.typeahead [role="option"]').length >= 1, "semantic typeahead did not open");
    search.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "ArrowDown" }));
    search.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "Enter" }));
    assert(search.value.length > 0, "typeahead did not select a semantic term");
    dispatchInput(search, "");
    const namespace = all(".vocabulary-toggle").find((button) => button.dataset.namespace === "http://www.w3.org/2000/01/rdf-schema#");
    assert(namespace, "RDFS namespace control is missing");
    namespace.click();
    assert(namespace.getAttribute("aria-pressed") === "false", "namespace did not deactivate");
    assert(all(".quad[hidden]").length > 0, "namespace filter did not hide statements");
    namespace.click();
    assert(namespace.getAttribute("aria-pressed") === "true", "namespace did not reactivate");
  });

  await run("renders the local vocabulary hierarchy and page correlation", async () => {
    tab("vocabulary");
    const sections = all(".ontology-section");
    assert(sections.map((section) => section.querySelector("h3")?.textContent).join(",") === "Classes,Properties", "vocabulary groups are wrong");
    const agent = one('.ontology-term-row[data-term="http://127.0.0.1:4187/contract#Agent"]');
    assert(agent?.closest(".ontology-children"), "Agent is not nested beneath Entity");
    assert(agent.querySelector(".local-term"), "Agent is not marked as a local definition");
    document.querySelector("#Agent").dispatchEvent(new PointerEvent("pointerenter", { bubbles: true }));
    assert(agent.classList.contains("is-corresponding"), "page-to-vocabulary correlation did not activate");
    document.querySelector("#Agent").dispatchEvent(new PointerEvent("pointerleave", { bubbles: true }));
    agent.querySelector(".ontology-locate-button")?.click();
    assert(location.hash === "" || location.hash === "#Agent", "locating a definition caused unrelated navigation");
  });

  await run("serializes Turtle and JSON-LD including the named graph", async () => {
    tab("turtle");
    const turtle = one("pre")?.textContent ?? "";
    assert(turtle.includes("<http://127.0.0.1:4187/contract#runtime> {"), "Turtle omitted the runtime named graph");
    assert(turtle.includes("<http://127.0.0.1:4187/contract#Alice>"), "Turtle omitted Alice");
    tab("json");
    const jsonText = one("pre")?.textContent ?? "";
    const parsed = JSON.parse(jsonText);
    assert(parsed && typeof parsed === "object", "JSON-LD is not valid JSON");
    assert(jsonText.includes("#runtime") && jsonText.includes("#Alice"), "JSON-LD omitted graph or subject identity");
  });

  await run("previews, moves, resizes, navigates, and closes linked resources", async () => {
    tab("navigator");
    const link = one('.term-link[href="http://127.0.0.1:4187/evidence"]');
    assert(link, "external evidence term is missing");
    link.click();
    const preview = await eventually(() => one(".resource-preview"), "resource preview did not open");
    const frame = preview.querySelector(".resource-preview-frame");
    const open = preview.querySelector(".resource-preview-open");
    assert(preview.getAttribute("role") === "dialog", "resource preview is not exposed as a dialog");
    assert(frame?.tabIndex === 0, "resource preview frame is not keyboard reachable");
    assert(open?.target === "_blank" && open.rel.includes("noopener"), "preview open action is not safely isolated");
    const before = preview.getBoundingClientRect();
    const bar = preview.querySelector(".resource-preview-bar");
    dispatchPointer(bar, "pointerdown", { clientX: before.left + 40, clientY: before.top + 10 });
    dispatchPointer(window, "pointermove", { clientX: before.left + 70, clientY: before.top + 30 });
    dispatchPointer(window, "pointerup", { clientX: before.left + 70, clientY: before.top + 30 });
    const moved = preview.getBoundingClientRect();
    assert(moved.left !== before.left || moved.top !== before.top, "resource preview did not move");
    const resize = preview.querySelector('.resize-handle[data-resize="se"]');
    assert(resize, "resource preview southeast resize handle is missing");
    dispatchPointer(resize, "pointerdown", { clientX: moved.right, clientY: moved.bottom });
    dispatchPointer(window, "pointermove", { clientX: moved.right + 30, clientY: moved.bottom + 20 });
    dispatchPointer(window, "pointerup", { clientX: moved.right + 30, clientY: moved.bottom + 20 });
    const resized = preview.getBoundingClientRect();
    assert(resized.width !== moved.width || resized.height !== moved.height, "resource preview did not resize");
    window.dispatchEvent(new MessageEvent("message", {
      data: { type: "ia2-rdf-preview-navigate", href: "http://127.0.0.1:4187/evidence#evidence-name" },
      source: frame.contentWindow,
    }));
    assert(preview.querySelector(".resource-preview-url")?.textContent.endsWith("#evidence-name"), "preview navigation did not update its URL");
    preview.querySelector(".resource-preview-close").click();
    assert(!one(".resource-preview"), "resource preview did not close");
  });

  await run("shows carrier HTML without losing view state", async () => {
    tab("navigator");
    const search = one(".navigator-search");
    dispatchInput(search, "Alice");
    const row = all(".quad:not([hidden])").find((item) => item.textContent.includes("Alice"));
    assert(row, "Alice carrier row is missing");
    const toggles = all(".source-toggle").filter((button) => row.contains(button));
    assert(toggles.length >= 1, "carrier HTML controls are missing");
    toggles.at(-1).click();
    assert(row.querySelector(".source-code pre")?.textContent.includes("alice-name"), "deep carrier HTML omitted child content");
    assert(one(".navigator-search")?.value === "Alice", "opening source lost the active query");
    toggles.at(-1).click();
    dispatchInput(one(".navigator-search"), "");
  });

  await run("loads and removes an explicit discovery contribution", async () => {
    tab("discovery");
    const action = one(".discovery-action");
    assert(action?.textContent === "Load", "discovery did not begin available");
    action.click();
    await eventually(() => one(".discovery-status")?.textContent === "2 statements loaded", "discovery contribution did not load");
    assert(one(".launcher .count")?.textContent === "20", "loaded contribution did not join the dataset");
    tab("turtle");
    assert((one("pre")?.textContent ?? "").includes("<http://127.0.0.1:4187/evidence> {"), "contribution was not scoped to its named graph");
    tab("discovery");
    one(".discovery-action").click();
    assert(one(".launcher .count")?.textContent === "18", "removed contribution remained in the dataset");
  });

  await run("updates diagnostics and statements after live DOM mutations", async () => {
    tab("diagnostics");
    assert(all(".diagnostic").length === 1, "initial diagnostic is missing");
    document.querySelector("#invalid").removeAttribute("rdf-object-key");
    const late = document.querySelector("#late-carrier");
    late.setAttribute("rdf-subject", "#Alice");
    late.setAttribute("rdf-predicate", "https://schema.org/description");
    late.textContent = "Added live";
    await eventually(() => !one('[data-view="diagnostics"]') && one(".launcher .count")?.textContent === "20", "live extraction did not settle");
    assert(one('[data-view="navigator"]')?.getAttribute("aria-selected") === "true", "removed diagnostics view did not fall back to Navigator");
    const search = one(".navigator-search");
    search.focus();
    dispatchInput(search, "Added live");
    const caret = search.selectionStart;
    late.textContent = "Added live again";
    await eventually(() => one(".launcher .count")?.textContent === "20", "character-data mutation did not refresh");
    assert(one(".navigator-search") === root.activeElement, "live refresh lost search focus");
    assert(one(".navigator-search").selectionStart === caret, "live refresh lost the search caret");
    dispatchInput(one(".navigator-search"), "");
  });

  await run("switches drawer positions and persists the selection", async () => {
    const floating = one('.position-option[data-position="floating"]');
    floating.click();
    const panel = one(".panel");
    assert(panel.dataset.position === "floating", "floating position did not apply");
    assert(Number.parseFloat(panel.style.width) > 0 && Number.parseFloat(panel.style.height) > 0, "floating geometry was not calculated");
    const right = one('.position-option[data-position="right"]');
    right.click();
    assert(panel.dataset.position === "right", "right drawer position did not restore");
    const saved = JSON.parse(sessionStorage.getItem("ia2:rdf-navigator:state:v1"));
    assert(saved.position === "right", "drawer position was not persisted");
  });

  await run("contains keyboard focus and closes with Escape", async () => {
    host.open();
    const panel = one(".panel");
    panel.focus();
    host.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "Tab", shiftKey: true }));
    assert(root.activeElement && panel.contains(root.activeElement), "Shift+Tab escaped the panel");
    host.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "Escape" }));
    await delay(0);
    assert(panel.dataset.open === "false", "Escape did not close the Navigator");
    if (extensionOwned) {
      assert(root.activeElement === null, "close retained focus inside the hidden extension surface");
    } else {
      assert(root.activeElement === one(".launcher"), "close did not return focus to the launcher");
    }
    host.open();
  });

  await run("keeps local links in-page and observes canonical changes", async () => {
    document.querySelector("#local-link").click();
    await eventually(() => location.hash === "#Agent", "ordinary local link navigation was intercepted");
    const canonical = document.querySelector('link[rel~="canonical"]');
    canonical.href = "http://127.0.0.1:4187/rebased";
    await eventually(() => {
      tab("turtle");
      return (one("pre")?.textContent ?? "").includes("<http://127.0.0.1:4187/rebased#Alice>");
    }, "canonical change did not rebase semantic IRIs");
    canonical.href = "http://127.0.0.1:4187/contract";
    await delay(180);
  });

  await run("supports page and navigator scroll synchronization modes", async () => {
    tab("navigator");
    const pageMode = one('.sync-option[data-sync-mode="page"]');
    const navigatorMode = one('.sync-option[data-sync-mode="navigator"]');
    pageMode.click();
    assert(pageMode.getAttribute("aria-checked") === "true", "page sync mode did not activate");
    navigatorMode.click();
    assert(navigatorMode.getAttribute("aria-checked") === "true", "navigator sync mode did not activate");
    one('.sync-option[data-sync-mode="off"]').click();
  });

  await run("moves and resizes floating geometry with pointer input", async () => {
    one('.position-option[data-position="floating"]').click();
    const panel = one(".panel");
    const before = panel.getBoundingClientRect();
    const grip = one(".drag-grip");
    dispatchPointer(grip, "pointerdown", { clientX: before.left + 10, clientY: before.top + 10 });
    dispatchPointer(window, "pointermove", { clientX: before.left + 34, clientY: before.top + 26 });
    dispatchPointer(window, "pointerup", { clientX: before.left + 34, clientY: before.top + 26 });
    const moved = panel.getBoundingClientRect();
    assert(moved.left !== before.left || moved.top !== before.top, "pointer drag did not move the panel");
    const handle = one('.resize-handle[data-resize="se"]');
    dispatchPointer(handle, "pointerdown", { clientX: moved.right, clientY: moved.bottom });
    dispatchPointer(window, "pointermove", { clientX: moved.right - 30, clientY: moved.bottom - 30 });
    dispatchPointer(window, "pointerup", { clientX: moved.right - 30, clientY: moved.bottom - 30 });
    assert(panel.getBoundingClientRect().width !== moved.width || panel.getBoundingClientRect().height !== moved.height, "pointer resize did not change geometry");
    one('.position-option[data-position="right"]').click();
  });

  await run("restores persisted floating geometry on a fresh Navigator host", async () => {
    one('.position-option[data-position="floating"]').click();
    const panel = one(".panel");
    const stored = JSON.parse(sessionStorage.getItem("ia2:rdf-navigator:state:v1"));
    assert(stored.position === "floating" && stored.floatingRect, "floating state was not stored");
    const tag = host.localName;
    const extensionOwned = host.hasAttribute("data-ia2-extension");
    host.remove();
    const restored = document.createElement(tag);
    if (extensionOwned) restored.setAttribute("data-ia2-extension", "");
    document.body.append(restored);
    const restoredPanel = await eventually(() => restored.shadowRoot?.querySelector(".panel"), "fresh Navigator did not render");
    assert(restoredPanel.dataset.position === "floating", "fresh Navigator did not restore floating mode");
    assert(Number.parseFloat(restoredPanel.style.left) === stored.floatingRect.x, "fresh Navigator did not restore horizontal position");
    assert(Number.parseFloat(restoredPanel.style.top) === stored.floatingRect.y, "fresh Navigator did not restore vertical position");
    assert(Number.parseFloat(restoredPanel.style.width) === stored.floatingRect.width, "fresh Navigator did not restore width");
    assert(Number.parseFloat(restoredPanel.style.height) === stored.floatingRect.height, "fresh Navigator did not restore height");
  });

  const failed = cases.filter((entry) => !entry.ok);
  return {
    cases,
    failed: failed.length,
    passed: cases.length - failed.length,
    runtime: navigator.userAgent,
    tag: host.localName,
  };
}
