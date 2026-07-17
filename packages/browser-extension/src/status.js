const STATUS_OBSERVER = Symbol.for("ia2.navigator.extension.status-observer");
const EXTENSION_TAG = "ia2-extension-navigator";
const PAGE_TAG = "ia2-rdf-navigator";
const EXTENSION_HARE_TAG = "ia2-extension-hare-viewer";
const PAGE_HARE_TAG = "ia2-hare-viewer";
const extensionApi = globalThis.browser ?? globalThis.chrome;
let lastStatements = null;
let lastFiles = null;

async function findNavigator() {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    const navigator = document.querySelector(PAGE_TAG) ?? document.querySelector(EXTENSION_TAG);
    if (navigator?.shadowRoot?.querySelector(".launcher .count")) return navigator;
    await new Promise((resolve) => setTimeout(resolve, 20));
  }
  return null;
}

function statementCount(navigator) {
  const value = navigator.shadowRoot?.querySelector(".launcher .count")?.textContent;
  const count = Number.parseInt(value ?? "", 10);
  return Number.isInteger(count) ? count : 0;
}

function fileCount() {
  const value = document.querySelector(`${PAGE_HARE_TAG}, ${EXTENSION_HARE_TAG}`)?.shadowRoot?.querySelector(".files-tab .count")?.textContent;
  const count = Number.parseInt(value ?? "", 10);
  return Number.isInteger(count) ? count : 0;
}

async function report(navigator) {
  const statements = statementCount(navigator);
  const files = fileCount();
  if (statements === lastStatements && files === lastFiles) return;
  lastStatements = statements;
  lastFiles = files;
  try {
    await extensionApi.runtime.sendMessage({
      files,
      statements,
      type: "ia2:navigator-status",
    });
  } catch {
    // Navigation may invalidate the extension context while a report is pending.
  }
}

async function observeStatus() {
  globalThis[STATUS_OBSERVER]?.disconnect();
  const navigator = await findNavigator();
  if (!navigator) return;
  const observer = new MutationObserver(() => void report(navigator));
  observer.observe(navigator.shadowRoot, { characterData: true, childList: true, subtree: true });
  const viewerRoot = document.querySelector(`${PAGE_HARE_TAG}, ${EXTENSION_HARE_TAG}`)?.shadowRoot;
  if (viewerRoot) observer.observe(viewerRoot, { characterData: true, childList: true, subtree: true });
  globalThis[STATUS_OBSERVER] = observer;
  await report(navigator);
}

void observeStatus();
