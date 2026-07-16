import { ensureNavigator } from "./mount.js";

// The extension owns mounting, so importing the browser bundle must not also
// create the page-embed form of the Navigator.
globalThis.__IA2_RDF_NAVIGATOR_NO_AUTO__ = true;

async function toggleNavigator() {
  const navigator = await ensureNavigator();
  navigator.toggle();
}

function run() {
  void toggleNavigator().catch((error) => {
    console.error("IA² Navigator could not start.", error);
  });
}

if (document.body) run();
else document.addEventListener("DOMContentLoaded", run, { once: true });
