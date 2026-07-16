const DEFAULT_TITLE = "Open IA² Navigator";
const UNAVAILABLE_TITLE = "IA² Navigator is unavailable on this page";

async function updateAction(api, tabId, available) {
  const operations = [
    api.action.setBadgeText?.({ tabId, text: available ? "" : "!" }),
    api.action.setTitle?.({ tabId, title: available ? DEFAULT_TITLE : UNAVAILABLE_TITLE }),
  ];
  if (!available) {
    operations.push(api.action.setBadgeBackgroundColor?.({ color: "#6842c2", tabId }));
  }
  await Promise.all(operations.filter(Boolean));
}

export async function injectNavigator(api, tab) {
  if (!Number.isInteger(tab?.id)) return false;
  try {
    await api.scripting.executeScript({
      files: ["content.js"],
      target: { allFrames: false, tabId: tab.id },
      world: "MAIN",
    });
    await updateAction(api, tab.id, true);
    return true;
  } catch (error) {
    await updateAction(api, tab.id, false);
    console.warn("IA² Navigator could not inspect this page.", error);
    return false;
  }
}

export function registerExtension(api) {
  api.action.onClicked.addListener((tab) => {
    void injectNavigator(api, tab);
  });
}

const extensionApi = globalThis.browser ?? globalThis.chrome;
if (extensionApi?.action?.onClicked && extensionApi?.scripting?.executeScript) {
  registerExtension(extensionApi);
}
