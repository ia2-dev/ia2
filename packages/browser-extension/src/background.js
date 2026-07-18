const DEFAULT_TITLE = "Open IA² Navigator";
const EMPTY_TITLE = "No HTML/RDF found on this page";
const UNAVAILABLE_TITLE = "IA² Navigator is unavailable on this page";
const DEFAULT_ICONS = {
  16: "icons/ia2-mark-16.png",
  32: "icons/ia2-mark-32.png",
};
const MUTED_ICONS = {
  16: "icons/ia2-mark-muted-16.png",
  32: "icons/ia2-mark-muted-32.png",
};
const BADGE_COLOR = "#6842c2";
const frameSourcesByTab = new Map();
const navigatorStatementsByTab = new Map();
const rendererTabs = new Set();

export function isRdfHtmlRendererUrl(value) {
  try {
    const url = new URL(value);
    const local = url.hostname === "localhost" || url.hostname === "127.0.0.1" || url.hostname === "[::1]";
    const publicRenderer = url.protocol === "https:" && (url.hostname === "ia2.dev" || url.hostname === "www.ia2.dev");
    return (url.pathname === "/render" || url.pathname.startsWith("/render/")) && (local || publicRenderer);
  } catch {
    return false;
  }
}

function sourceStatements(source) {
  const count = source?.result?.quads?.length;
  return Number.isInteger(count) && count > 0 ? count : 0;
}

function totalStatements(tabId) {
  const reported = navigatorStatementsByTab.get(tabId) ?? 0;
  const frames = frameSourcesByTab.get(tabId);
  if (!frames) return reported;
  const collected = Array.from(frames.values()).reduce((sum, source) => sum + sourceStatements(source), 0);
  return Math.max(reported, collected);
}

async function publishFrameSources(api, tabId) {
  if (!api.tabs?.sendMessage) return;
  const sources = Array.from(frameSourcesByTab.get(tabId)?.values() ?? []);
  try {
    await api.tabs.sendMessage(tabId, { sources, type: "ia2:navigator-sources" }, { frameId: 0 });
  } catch {
    // The top frame may be navigating or may not have installed its relay yet.
  }
}

export function statementBadge(statements) {
  if (!Number.isInteger(statements) || statements <= 0) return "";
  return statements > 999 ? "999+" : String(statements);
}

export async function updateAction(api, tabId, state, statements = 0, files = 0) {
  const unavailable = state === "unavailable";
  const empty = state === "empty";
  const available = state === "available";
  const badge = unavailable ? "!" : available ? statementBadge(statements) : "";
  const fileCount = Number.isInteger(files) && files > 0 ? files : 0;
  const rdfSummary = `${statements} RDF statement${statements === 1 ? "" : "s"}`;
  const availableTitle = fileCount > 0
    ? `Open IA² Navigator (${rdfSummary}; HARE: ${fileCount} file${fileCount === 1 ? "" : "s"})`
    : `Open IA² Navigator (${rdfSummary})`;
  const operations = [
    api.action.setBadgeText?.({ tabId, text: badge }),
    api.action.setIcon?.({ path: empty || unavailable ? MUTED_ICONS : DEFAULT_ICONS, tabId }),
    api.action.setTitle?.({ tabId, title: unavailable ? UNAVAILABLE_TITLE : empty ? EMPTY_TITLE : available ? availableTitle : DEFAULT_TITLE }),
  ];
  if (badge) {
    operations.push(api.action.setBadgeBackgroundColor?.({ color: BADGE_COLOR, tabId }));
  }
  await Promise.all(operations.filter(Boolean));
}

export async function injectNavigator(api, tab) {
  if (!Number.isInteger(tab?.id)) return false;
  const renderer = isRdfHtmlRendererUrl(tab.url);
  if (renderer) rendererTabs.add(tab.id);
  try {
    await updateAction(api, tab.id, "unknown");
    await api.scripting.executeScript({
      files: ["status.js"],
      target: { allFrames: false, tabId: tab.id },
    });
    await api.scripting.executeScript({
      files: ["content.js"],
      target: { allFrames: false, tabId: tab.id },
      world: "MAIN",
    });
    if (renderer) {
      try {
        await api.tabs.sendMessage(tab.id, { type: "ia2:collect-frame-source" });
      } catch {
        // The declarative child-frame collector may still be starting.
      }
      await publishFrameSources(api, tab.id);
      const statements = totalStatements(tab.id);
      await updateAction(api, tab.id, statements > 0 ? "available" : "empty", statements);
    }
    return true;
  } catch (error) {
    if (renderer) rendererTabs.delete(tab.id);
    await updateAction(api, tab.id, "unavailable");
    console.warn("IA² Navigator could not inspect this page.", error);
    return false;
  }
}

export function registerExtension(api) {
  api.action.onClicked.addListener((tab) => {
    void injectNavigator(api, tab);
  });
  api.runtime?.onMessage?.addListener((message, sender) => {
    const tabId = sender.tab?.id;
    if (!Number.isInteger(tabId)) return;
    if (message?.type === "ia2:request-frame-sources") {
      if (rendererTabs.has(tabId)) void publishFrameSources(api, tabId);
      return;
    }
    if (message?.type === "ia2:frame-source") {
      if (!isRdfHtmlRendererUrl(sender.tab?.url) || !Number.isInteger(sender.frameId) || sender.frameId === 0) return;
      const source = message.source;
      if (source?.access !== "portable" || source.result?.portableVersion !== 1) return;
      let frames = frameSourcesByTab.get(tabId);
      if (!frames) {
        frames = new Map();
        frameSourcesByTab.set(tabId, frames);
      }
      frames.set(sender.frameId, { ...source, id: `extension-frame-${sender.frameId}` });
      const statements = totalStatements(tabId);
      void updateAction(api, tabId, statements > 0 ? "available" : "empty", statements);
      if (rendererTabs.has(tabId)) void publishFrameSources(api, tabId);
      return;
    }
    if (message?.type !== "ia2:navigator-status") return;
    const statements = Number.isInteger(message.statements) && message.statements > 0 ? message.statements : 0;
    navigatorStatementsByTab.set(tabId, statements);
    const state = statements > 0 ? "available" : "empty";
    void updateAction(api, tabId, state, statements, message.files);
  });
  api.tabs?.onUpdated?.addListener((tabId, changeInfo) => {
    if (changeInfo.status === "loading") {
      frameSourcesByTab.delete(tabId);
      navigatorStatementsByTab.delete(tabId);
      rendererTabs.delete(tabId);
      void updateAction(api, tabId, "unknown");
    }
  });
}

const extensionApi = globalThis.browser ?? globalThis.chrome;
if (extensionApi?.action?.onClicked && extensionApi?.scripting?.executeScript) {
  registerExtension(extensionApi);
}
