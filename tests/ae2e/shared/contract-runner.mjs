import { runNavigatorContract } from "/navigator-contract.mjs";

if (new URLSearchParams(location.search).has("autorun")) {
  window.__IA2NavigatorAE2E = { state: "running" };
  runNavigatorContract().then(async (report) => {
    window.__IA2NavigatorAE2E = { state: "complete", report };
    try {
      await fetch("/results", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(report),
      });
    } catch {
      // The in-page result remains authoritative when the reporting endpoint is unavailable.
    }
  }).catch((error) => {
    window.__IA2NavigatorAE2E = {
      state: "error",
      error: error instanceof Error ? `${error.name}: ${error.message}` : String(error),
    };
  });
}
