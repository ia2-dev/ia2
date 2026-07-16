const layerButtons = [...document.querySelectorAll("[data-layer]")];
const decisionButtons = [...document.querySelectorAll("[data-option]")];
const selection = document.querySelector("#latency-selection");
const driftAction = document.querySelector("#drift-action");
const health = document.querySelector("#knowledge-health");
const mappingState = document.querySelector("#mapping-state");
const modelHash = document.querySelector("#model-hash");
const toast = document.querySelector("#toast");

let synchronized = false;
let toastTimer;

function notify(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2200);
}

for (const button of layerButtons) {
  button.addEventListener("click", () => {
    const active = button.getAttribute("aria-pressed") !== "true";
    button.setAttribute("aria-pressed", String(active));
    button.classList.toggle("is-active", active);
    for (const panel of document.querySelectorAll(`[data-layer-panel="${button.dataset.layer}"]`)) {
      panel.classList.toggle("is-layer-hidden", !active);
    }
  });
}

for (const button of decisionButtons) {
  button.addEventListener("click", () => {
    for (const candidate of decisionButtons) {
      const selected = candidate === button;
      candidate.classList.toggle("is-selected", selected);
      candidate.setAttribute("aria-pressed", String(selected));
    }
    selection.href = `#${button.dataset.option}`;
    notify(`Decision changed to ${button.querySelector("strong").textContent}. RDF selectedOption updated.`);
  });
}

driftAction.addEventListener("click", () => {
  synchronized = !synchronized;
  const value = synchronized ? "synchronized" : "drifted";
  const label = synchronized ? "Model synchronized" : "Model drifted";
  health.value = value;
  health.querySelector("span").textContent = label;
  health.classList.toggle("is-drifted", !synchronized);
  health.classList.toggle("is-synced", synchronized);
  mappingState.value = value;
  mappingState.textContent = label;
  mappingState.classList.toggle("is-drifted", !synchronized);
  mappingState.classList.toggle("is-synced", synchronized);
  modelHash.textContent = synchronized ? "sha256:b17e6f09" : "sha256:9d4c2a71";
  driftAction.textContent = synchronized ? "Simulate implementation change" : "Accept current implementation";
  notify(synchronized ? "Mapping synchronized. RDF quality value and model hash updated." : "Code changed. RDF quality value and model hash now diverge.");
});
