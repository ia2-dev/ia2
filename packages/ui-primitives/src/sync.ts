import { escapeMarkup } from "./markup.js";

export type ScrollSyncMode = "off" | "page" | "panel";

export interface ScrollSyncDefinition {
  icon: string;
  label: string;
  mode: ScrollSyncMode;
}

export const SCROLL_SYNC_MODES: ReadonlyArray<ScrollSyncDefinition> = [
  {
    mode: "off",
    label: "Scroll synchronization off",
    icon: `<svg class="sync-icon" viewBox="0 0 32 16" aria-hidden="true" focusable="false">
      <path d="M16 2v5" />
      <path d="M11.7 4.4a6 6 0 1 0 8.6 0" />
    </svg>`,
  },
  {
    mode: "page",
    label: "Follow page viewport in panel",
    icon: `<svg class="sync-icon" viewBox="0 0 34 16" aria-hidden="true" focusable="false">
      <rect x="1" y="2" width="8" height="12" rx="1.5" />
      <path d="M3.5 5h3M3.5 8h3M3.5 11h3M11.5 8h9m-3-3 3 3-3 3" />
      <circle cx="24" cy="4" r=".8" fill="currentColor" stroke="none" />
      <circle cx="24" cy="8" r=".8" fill="currentColor" stroke="none" />
      <circle cx="24" cy="12" r=".8" fill="currentColor" stroke="none" />
      <path d="M27 4h6M27 8h6M27 12h6" />
    </svg>`,
  },
  {
    mode: "panel",
    label: "Follow panel in page",
    icon: `<svg class="sync-icon" viewBox="0 0 34 16" aria-hidden="true" focusable="false">
      <circle cx="2" cy="4" r=".8" fill="currentColor" stroke="none" />
      <circle cx="2" cy="8" r=".8" fill="currentColor" stroke="none" />
      <circle cx="2" cy="12" r=".8" fill="currentColor" stroke="none" />
      <path d="M5 4h6M5 8h6M5 12h6M22.5 8h-9m3-3-3 3 3 3" />
      <rect x="25" y="2" width="8" height="12" rx="1.5" />
      <path d="M27.5 5h3M27.5 8h3M27.5 11h3" />
    </svg>`,
  },
];

export function isScrollSyncMode(value: unknown): value is ScrollSyncMode {
  return typeof value === "string"
    && SCROLL_SYNC_MODES.some(({ mode }) => mode === value);
}

export interface ScrollSyncControlsMarkupOptions {
  ariaLabel?: string;
  controlClass?: string;
  current: ScrollSyncMode;
  label?: string;
  labels?: Partial<Record<ScrollSyncMode, string>>;
  optionClass?: string;
  switchClass?: string;
}

export function scrollSyncControlsMarkup({
  ariaLabel = "Scroll synchronization",
  controlClass = "",
  current,
  label = "Sync",
  labels = {},
  optionClass = "",
  switchClass = "",
}: ScrollSyncControlsMarkupOptions): string {
  const safeControlClass = escapeMarkup(controlClass);
  const safeOptionClass = escapeMarkup(optionClass);
  const safeSwitchClass = escapeMarkup(switchClass);
  const options = SCROLL_SYNC_MODES.map(({ icon, label: defaultLabel, mode }) => {
    const accessibleLabel = labels[mode] ?? defaultLabel;
    return `<button class="ia2-sync-option ${safeOptionClass}" type="button" role="radio" data-sync-mode="${mode}" aria-checked="${current === mode}" aria-label="${escapeMarkup(accessibleLabel)}" title="${escapeMarkup(accessibleLabel)}" tabindex="${current === mode ? "0" : "-1"}">${icon}</button>`;
  }).join("");
  return `<div class="ia2-sync-control ${safeControlClass}"><span class="ia2-sync-label sync-label">${escapeMarkup(label)}</span><div class="ia2-sync-switch ${safeSwitchClass}" role="radiogroup" aria-label="${escapeMarkup(ariaLabel)}">${options}</div></div>`;
}

export function updateScrollSyncControls(
  root: ParentNode,
  mode: ScrollSyncMode,
  focus = false,
): void {
  const options = Array.from(root.querySelectorAll<HTMLButtonElement>(".ia2-sync-option"));
  for (const option of options) {
    const selected = option.dataset.syncMode === mode;
    option.setAttribute("aria-checked", String(selected));
    option.tabIndex = selected ? 0 : -1;
    if (selected && focus) option.focus();
  }
}

export function bindScrollSyncControls(
  root: ParentNode,
  applyMode: (mode: ScrollSyncMode, focus: boolean) => boolean | void,
): () => void {
  const group = root instanceof HTMLElement && root.matches(".ia2-sync-switch")
    ? root
    : root.querySelector<HTMLElement>(".ia2-sync-switch");
  const options = Array.from(root.querySelectorAll<HTMLButtonElement>(".ia2-sync-option"));
  const cleanups: Array<() => void> = [];

  for (const option of options) {
    const click = (): void => {
      if (!isScrollSyncMode(option.dataset.syncMode)) return;
      if (applyMode(option.dataset.syncMode, false) !== false) {
        updateScrollSyncControls(root, option.dataset.syncMode);
      }
    };
    option.addEventListener("click", click);
    cleanups.push(() => option.removeEventListener("click", click));
  }

  const keydown = (event: KeyboardEvent): void => {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const current = event.target instanceof HTMLButtonElement
      ? options.indexOf(event.target)
      : options.findIndex((option) => option.getAttribute("aria-checked") === "true");
    let next = current;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = options.length - 1;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (current + 1) % options.length;
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      next = (current - 1 + options.length) % options.length;
    }
    const nextMode = options[next]?.dataset.syncMode;
    if (!isScrollSyncMode(nextMode)) return;
    if (applyMode(nextMode, true) !== false) {
      updateScrollSyncControls(root, nextMode, true);
    }
  };
  group?.addEventListener("keydown", keydown);
  cleanups.push(() => group?.removeEventListener("keydown", keydown));

  return () => {
    for (const cleanup of cleanups) cleanup();
  };
}
