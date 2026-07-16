const toc = document.querySelector("#guide-toc-list");
const tocLinks = Array.from(toc?.querySelectorAll("a") ?? []);
const sectionById = new Map(
  tocLinks
    .map((link) => {
      const id = link.getAttribute("href")?.slice(1);
      return id ? [id, document.getElementById(id)] : null;
    })
    .filter((entry) => entry?.[1]),
);

function selectSection(id) {
  for (const link of tocLinks) {
    const selected = link.getAttribute("href") === `#${id}`;
    link.classList.toggle("is-active", selected);
    if (selected) {
      link.setAttribute("aria-current", "location");
      if (window.matchMedia("(max-width: 920px)").matches) {
        link.scrollIntoView({
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    } else {
      link.removeAttribute("aria-current");
    }
  }
}

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((left, right) => left.boundingClientRect.top - right.boundingClientRect.top);
      if (visible[0]) selectSection(visible[0].target.id);
    },
    { rootMargin: "-32% 0px -58% 0px", threshold: 0 },
  );
  for (const section of sectionById.values()) observer.observe(section);
}

async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    try {
      await Promise.race([
        navigator.clipboard.writeText(text),
        new Promise((_, reject) => {
          window.setTimeout(() => reject(new Error("Clipboard write timed out")), 800);
        }),
      ]);
      return;
    } catch {
      // Fall through for browsers or contexts that expose the API but deny it.
    }
  }
  const field = document.createElement("textarea");
  field.value = text;
  field.setAttribute("readonly", "");
  field.style.position = "fixed";
  field.style.opacity = "0";
  document.body.append(field);
  field.select();
  const copied = document.execCommand("copy");
  field.remove();
  if (!copied) throw new Error("Copy command was rejected");
}

const copyStatus = document.querySelector("#copy-status");
for (const button of document.querySelectorAll("[data-copy]")) {
  button.addEventListener("click", async () => {
    const code = button.closest("figure")?.querySelector("pre code");
    if (!code) return;
    const original = button.textContent;
    button.textContent = "Copying";
    try {
      await copyText(code.textContent ?? "");
      button.textContent = "Copied";
      button.dataset.copied = "true";
      if (copyStatus) copyStatus.textContent = "Code copied to the clipboard.";
    } catch {
      button.textContent = "Copy failed";
      if (copyStatus) copyStatus.textContent = "The code could not be copied.";
    }
    window.setTimeout(() => {
      button.textContent = original;
      delete button.dataset.copied;
    }, 1600);
  });
}

if (tocLinks[0]) selectSection(tocLinks[0].getAttribute("href").slice(1));
