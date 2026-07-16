const semanticTargets = [...document.querySelectorAll("[data-rdf-target]")];

async function revealSemanticSource(trigger) {
  const selector = trigger.dataset.rdfTarget;
  const source = selector ? document.querySelector(selector) : null;
  if (!source) return;

  await customElements.whenDefined("ia2-rdf-navigator");
  const navigator = document.querySelector("ia2-rdf-navigator")
    ?? document.body.appendChild(document.createElement("ia2-rdf-navigator"));
  if (!navigator.revealSource(source, "left")) return;

  semanticTargets.forEach((target) => target.classList.toggle("is-rdf-selected", target === trigger));
}

semanticTargets.forEach((trigger) => {
  trigger.addEventListener("click", (event) => {
    event.preventDefault();
    void revealSemanticSource(trigger);
  });
});
