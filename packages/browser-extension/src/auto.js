import { ensureHareViewer, ensureNavigator } from "./mount.js";

// The extension owns mounting, so importing the browser bundle must not also
// create the page-embed form of the Navigator.
globalThis.__IA2_RDF_NAVIGATOR_NO_AUTO__ = true;

async function mountAutomaticHareView() {
  // Mount the viewer before the hidden Navigator so bare-envelope detection
  // considers only content authored by the envelope.
  const viewer = await ensureHareViewer();
  if (!viewer) return;
  const navigator = await ensureNavigator();
  navigator.close();
}

function run() {
  void mountAutomaticHareView().catch((error) => {
    console.error("IA² HARE file view could not start.", error);
  });
}

if (document.body) run();
else document.addEventListener("DOMContentLoaded", run, { once: true });
