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
  try {
    await updateAction(api, tab.id, "unknown");
    await api.scripting.executeScript({
      files: ["content.js"],
      target: { allFrames: false, tabId: tab.id },
      world: "MAIN",
    });
    await api.scripting.executeScript({
      files: ["status.js"],
      target: { allFrames: false, tabId: tab.id },
    });
    return true;
  } catch (error) {
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
    if (message?.type !== "ia2:navigator-status" || !Number.isInteger(sender.tab?.id)) return;
    const state = Number.isInteger(message.statements) && message.statements > 0 ? "available" : "empty";
    void updateAction(api, sender.tab.id, state, message.statements, message.files);
  });
  api.tabs?.onUpdated?.addListener((tabId, changeInfo) => {
    if (changeInfo.status === "loading") void updateAction(api, tabId, "unknown");
  });
}

const extensionApi = globalThis.browser ?? globalThis.chrome;
if (extensionApi?.action?.onClicked && extensionApi?.scripting?.executeScript) {
  registerExtension(extensionApi);
}
