const options = [...document.querySelectorAll("[data-approval]")];
const selection = document.querySelector("#approval-selection");
const posture = document.querySelector("#review-posture");

const labels = {
  "option-pending": "Pending review",
  "option-conditional": "Conditional approval",
  "option-approved": "Approved",
};

for (const option of options) {
  option.addEventListener("click", () => {
    const optionId = option.dataset.approval;
    for (const candidate of options) {
      const selected = candidate === option;
      candidate.classList.toggle("is-selected", selected);
      candidate.setAttribute("aria-pressed", String(selected));
    }
    selection.href = `#${optionId}`;
    posture.value = labels[optionId];
    posture.lastChild.textContent = ` ${labels[optionId]}`;
    posture.classList.toggle("is-conditional", optionId === "option-conditional");
    posture.classList.toggle("is-approved", optionId === "option-approved");
  });
}
