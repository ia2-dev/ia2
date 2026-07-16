const switchers = Array.from(document.querySelectorAll("[data-spec-switcher]"));

function closeSwitcher(switcher, restoreFocus = false) {
  const toggle = switcher.querySelector(".spec-switcher__toggle");
  switcher.removeAttribute("data-open");
  toggle?.setAttribute("aria-expanded", "false");
  if (restoreFocus) toggle?.focus();
}

function closeOtherSwitchers(active) {
  for (const switcher of switchers) {
    if (switcher !== active) closeSwitcher(switcher);
  }
}

function openSwitcher(switcher, focusOption = false) {
  const toggle = switcher.querySelector(".spec-switcher__toggle");
  closeOtherSwitchers(switcher);
  switcher.setAttribute("data-open", "");
  toggle?.setAttribute("aria-expanded", "true");
  if (focusOption) {
    const selected = switcher.querySelector('.spec-switcher__option[aria-current="true"]');
    const first = switcher.querySelector(".spec-switcher__option");
    (selected ?? first)?.focus();
  }
}

for (const switcher of switchers) {
  const toggle = switcher.querySelector(".spec-switcher__toggle");
  const menu = switcher.querySelector(".spec-switcher__menu");
  const options = Array.from(switcher.querySelectorAll(".spec-switcher__option"));
  if (!(toggle instanceof HTMLButtonElement) || !(menu instanceof HTMLElement)) continue;

  switcher.setAttribute("data-enhanced", "");
  toggle.addEventListener("click", () => {
    if (switcher.hasAttribute("data-open")) closeSwitcher(switcher);
    else openSwitcher(switcher);
  });

  toggle.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      openSwitcher(switcher, true);
      if (event.key === "ArrowUp") options.at(-1)?.focus();
    }
  });

  menu.addEventListener("keydown", (event) => {
    const current = options.indexOf(document.activeElement);
    if (event.key === "Escape") {
      event.preventDefault();
      closeSwitcher(switcher, true);
      return;
    }
    if (event.key === "Tab") {
      closeSwitcher(switcher);
      return;
    }
    let next = null;
    if (event.key === "ArrowDown") next = options[(current + 1) % options.length];
    if (event.key === "ArrowUp") next = options[(current - 1 + options.length) % options.length];
    if (event.key === "Home") next = options[0];
    if (event.key === "End") next = options.at(-1);
    if (next) {
      event.preventDefault();
      next.focus();
    }
  });
}

document.addEventListener("pointerdown", (event) => {
  for (const switcher of switchers) {
    if (!switcher.contains(event.target)) closeSwitcher(switcher);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  for (const switcher of switchers) {
    if (switcher.hasAttribute("data-open")) closeSwitcher(switcher, true);
  }
});
