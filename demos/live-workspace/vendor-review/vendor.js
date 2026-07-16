const options = [...document.querySelectorAll("[data-approval]")];
const selection = document.querySelector("#approval-selection");
const status = document.querySelector("#approval-status");
const posture = document.querySelector("#review-posture");

const labels = {
  "option-pending": "Pending review",
  "option-conditional": "Conditional approval",
  "option-approved": "Approved",
};

const statuses = {
  "option-pending": "https://current.example/security/status/pending-review",
  "option-conditional": "https://current.example/security/status/conditional-approval",
  "option-approved": "https://current.example/security/status/approved",
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
    status.href = statuses[optionId];
    posture.value = labels[optionId];
    posture.lastChild.textContent = ` ${labels[optionId]}`;
    posture.classList.toggle("is-conditional", optionId === "option-conditional");
    posture.classList.toggle("is-approved", optionId === "option-approved");
  });
}
