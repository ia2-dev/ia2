import { escapeMarkup } from "./markup.js";

export type WindowPosition =
  | "right"
  | "right-top"
  | "right-bottom"
  | "bottom"
  | "floating"
  | "top"
  | "left"
  | "left-bottom"
  | "left-top";

export interface WindowPositionDefinition {
  icon: string;
  label: string;
  position: WindowPosition;
}

export type WindowResizeDirection = "n" | "ne" | "e" | "se" | "s" | "sw" | "w" | "nw";

export interface FloatingWindowRect {
  height: number;
  width: number;
  x: number;
  y: number;
}

const WINDOW_RESIZE_DIRECTIONS: readonly WindowResizeDirection[] = [
  "n", "ne", "e", "se", "s", "sw", "w", "nw",
];

export const WINDOW_POSITIONS: ReadonlyArray<WindowPositionDefinition> = [
  { position: "right", label: "Right, full height", icon: '<svg class="position-icon" viewBox="0 0 20 16" aria-hidden="true" focusable="false"><rect x=".75" y=".75" width="18.5" height="14.5" rx="2"/><path class="position-region" d="M13 2h5v12h-5z"/></svg>' },
  { position: "right-top", label: "Right, top half", icon: '<svg class="position-icon" viewBox="0 0 20 16" aria-hidden="true" focusable="false"><rect x=".75" y=".75" width="18.5" height="14.5" rx="2"/><path class="position-region" d="M13 2h5v5.5h-5z"/></svg>' },
  { position: "right-bottom", label: "Right, bottom half", icon: '<svg class="position-icon" viewBox="0 0 20 16" aria-hidden="true" focusable="false"><rect x=".75" y=".75" width="18.5" height="14.5" rx="2"/><path class="position-region" d="M13 8.5h5V14h-5z"/></svg>' },
  { position: "bottom", label: "Bottom, full width", icon: '<svg class="position-icon" viewBox="0 0 20 16" aria-hidden="true" focusable="false"><rect x=".75" y=".75" width="18.5" height="14.5" rx="2"/><path class="position-region" d="M2 9h16v5H2z"/></svg>' },
  { position: "floating", label: "Floating, centered", icon: '<svg class="position-icon" viewBox="0 0 20 16" aria-hidden="true" focusable="false"><rect x=".75" y=".75" width="18.5" height="14.5" rx="2"/><rect class="position-region" x="5" y="4.5" width="10" height="7" rx="1"/></svg>' },
  { position: "top", label: "Top, full width", icon: '<svg class="position-icon" viewBox="0 0 20 16" aria-hidden="true" focusable="false"><rect x=".75" y=".75" width="18.5" height="14.5" rx="2"/><path class="position-region" d="M2 2h16v5H2z"/></svg>' },
  { position: "left", label: "Left, full height", icon: '<svg class="position-icon" viewBox="0 0 20 16" aria-hidden="true" focusable="false"><rect x=".75" y=".75" width="18.5" height="14.5" rx="2"/><path class="position-region" d="M2 2h5v12H2z"/></svg>' },
  { position: "left-bottom", label: "Left, bottom half", icon: '<svg class="position-icon" viewBox="0 0 20 16" aria-hidden="true" focusable="false"><rect x=".75" y=".75" width="18.5" height="14.5" rx="2"/><path class="position-region" d="M2 8.5h5V14H2z"/></svg>' },
  { position: "left-top", label: "Left, top half", icon: '<svg class="position-icon" viewBox="0 0 20 16" aria-hidden="true" focusable="false"><rect x=".75" y=".75" width="18.5" height="14.5" rx="2"/><path class="position-region" d="M2 2h5v5.5H2z"/></svg>' },
];

/**
 * Shared geometry for IA² movable windows. Consumers supply surface colors,
 * dimensions, and component layout through CSS custom properties.
 */
export const WINDOW_PLACEMENT_CSS = `
  .ia2-window-surface {
    border-left: 1px solid var(--ia2-window-rule, currentColor);
    bottom: 0;
    box-shadow: -12px 0 48px oklch(20% 0.03 286 / 18%);
    max-width: 100vw;
    position: fixed;
    right: 0;
    top: 0;
    transform: translateX(105%);
    transition:
      opacity 180ms ease,
      transform var(--ia2-window-transition-duration, 220ms) cubic-bezier(.22, 1, .36, 1),
      visibility var(--ia2-window-transition-duration, 220ms);
    visibility: hidden;
    width: var(--ia2-window-width, min(760px, 72vw));
  }
  .ia2-window-surface[data-open=""],
  .ia2-window-surface[data-open="true"] {
    transform: translateX(0);
    visibility: visible;
  }
  .ia2-window-surface[data-position^="left"] {
    border-left: 0;
    border-right: 1px solid var(--ia2-window-rule, currentColor);
    box-shadow: 12px 0 48px oklch(20% 0.03 286 / 18%);
    left: 0;
    right: auto;
    transform: translateX(-105%);
  }
  .ia2-window-surface[data-position^="left"][data-open=""],
  .ia2-window-surface[data-position^="left"][data-open="true"] {
    transform: translateX(0);
  }
  .ia2-window-surface[data-position$="-top"] {
    bottom: auto;
    border-bottom: 1px solid var(--ia2-window-rule, currentColor);
    height: var(--ia2-window-half-height, 50vh);
    top: 0;
  }
  .ia2-window-surface[data-position$="-bottom"] {
    border-top: 1px solid var(--ia2-window-rule, currentColor);
    bottom: 0;
    height: var(--ia2-window-half-height, 50vh);
    top: auto;
  }
  .ia2-window-surface[data-position="top"],
  .ia2-window-surface[data-position="bottom"] {
    border: 0;
    height: var(--ia2-window-horizontal-height, 50vh);
    left: 0;
    max-width: none;
    right: 0;
    width: 100vw;
  }
  .ia2-window-surface[data-position="top"] {
    border-bottom: 1px solid var(--ia2-window-rule, currentColor);
    bottom: auto;
    box-shadow: 0 12px 48px oklch(20% 0.03 286 / 18%);
    top: 0;
    transform: translateY(-105%);
  }
  .ia2-window-surface[data-position="bottom"] {
    border-top: 1px solid var(--ia2-window-rule, currentColor);
    bottom: 0;
    box-shadow: 0 -12px 48px oklch(20% 0.03 286 / 18%);
    top: auto;
    transform: translateY(105%);
  }
  .ia2-window-surface[data-position="top"][data-open=""],
  .ia2-window-surface[data-position="top"][data-open="true"],
  .ia2-window-surface[data-position="bottom"][data-open=""],
  .ia2-window-surface[data-position="bottom"][data-open="true"] {
    transform: translateY(0);
  }
  .ia2-window-surface[data-position="floating"] {
    border: 1px solid var(--ia2-window-rule, currentColor);
    border-radius: var(--ia2-window-floating-radius, 14px);
    bottom: auto;
    box-shadow: 0 18px 64px oklch(20% 0.03 286 / 24%);
    height: var(--ia2-window-floating-height, min(860px, calc(100vh - 48px)));
    left: var(--ia2-window-floating-left, 50%);
    opacity: 0;
    overflow: hidden;
    right: auto;
    top: var(--ia2-window-floating-top, 50%);
    transform: var(--ia2-window-floating-closed-transform, translate(-50%, -48%) scale(.985));
    width: var(--ia2-window-floating-width, min(760px, calc(100vw - 48px)));
  }
  .ia2-window-surface[data-position="floating"][data-open=""],
  .ia2-window-surface[data-position="floating"][data-open="true"] {
    opacity: 1;
    transform: var(--ia2-window-floating-open-transform, translate(-50%, -50%) scale(1));
  }
  .ia2-window-surface[data-position="floating"][data-dragged="true"] {
    transform: none;
  }
  .ia2-window-resize-handles {
    display: none;
  }
  .ia2-window-surface[data-position="floating"] .ia2-window-resize-handles {
    display: contents;
  }
  .ia2-window-resize-handle {
    position: absolute;
    touch-action: none;
    z-index: 12;
  }
  .ia2-window-resize-handle[data-resize="n"],
  .ia2-window-resize-handle[data-resize="s"] {
    height: 10px;
    left: 18px;
    right: 18px;
  }
  .ia2-window-resize-handle[data-resize="n"] {
    cursor: ns-resize;
    top: 0;
  }
  .ia2-window-resize-handle[data-resize="s"] {
    bottom: 0;
    cursor: ns-resize;
  }
  .ia2-window-resize-handle[data-resize="e"],
  .ia2-window-resize-handle[data-resize="w"] {
    bottom: 18px;
    top: 18px;
    width: 10px;
  }
  .ia2-window-resize-handle[data-resize="e"] {
    cursor: ew-resize;
    right: 0;
  }
  .ia2-window-resize-handle[data-resize="w"] {
    cursor: ew-resize;
    left: 0;
  }
  .ia2-window-resize-handle[data-resize="ne"],
  .ia2-window-resize-handle[data-resize="nw"],
  .ia2-window-resize-handle[data-resize="se"],
  .ia2-window-resize-handle[data-resize="sw"] {
    height: 20px;
    width: 20px;
  }
  .ia2-window-resize-handle[data-resize="ne"] {
    cursor: nesw-resize;
    right: 0;
    top: 0;
  }
  .ia2-window-resize-handle[data-resize="nw"] {
    cursor: nwse-resize;
    left: 0;
    top: 0;
  }
  .ia2-window-resize-handle[data-resize="se"] {
    bottom: 0;
    cursor: nwse-resize;
    right: 0;
  }
  .ia2-window-resize-handle[data-resize="sw"] {
    bottom: 0;
    cursor: nesw-resize;
    left: 0;
  }
  .ia2-window-resize-handle[data-resize="se"]::after {
    border-bottom: 2px solid color-mix(in oklch, currentColor, transparent 68%);
    border-right: 2px solid color-mix(in oklch, currentColor, transparent 68%);
    bottom: 5px;
    content: "";
    height: 6px;
    position: absolute;
    right: 5px;
    width: 6px;
  }
  .ia2-window-surface.is-resizing {
    transition: none;
    user-select: none;
  }
  @media (max-width: 760px) {
    .ia2-window-surface,
    .ia2-window-surface[data-position] {
      border: 0;
      border-radius: 0;
      bottom: 0;
      height: 100vh;
      left: auto;
      max-width: none;
      opacity: 1;
      right: 0;
      top: 0;
      transform: translateX(105%);
      width: 100%;
    }
    .ia2-window-surface[data-position][data-open=""],
    .ia2-window-surface[data-position][data-open="true"] {
      transform: translateX(0);
    }
    .ia2-window-surface[data-position^="left"] {
      left: 0;
      right: auto;
      transform: translateX(-105%);
    }
    .ia2-window-surface[data-position="floating"] .ia2-window-resize-handles {
      display: none;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .ia2-window-surface { transition: none; }
  }
`;

export function isWindowPosition(value: unknown): value is WindowPosition {
  return typeof value === "string"
    && WINDOW_POSITIONS.some(({ position }) => position === value);
}

export function parseWindowPositions(
  value: string | null,
  fallback: WindowPosition = "right",
): WindowPosition[] {
  if (!value) return WINDOW_POSITIONS.map(({ position }) => position);
  const positions = value.split(/\s+/).filter(isWindowPosition);
  return positions.length > 0 ? Array.from(new Set(positions)) : [fallback];
}

export function floatingWindowResizeHandlesMarkup(): string {
  return `<div class="ia2-window-resize-handles" aria-hidden="true">${
    WINDOW_RESIZE_DIRECTIONS
      .map((direction) => (
        `<span class="ia2-window-resize-handle" data-resize="${direction}"></span>`
      ))
      .join("")
  }</div>`;
}

export interface PositionControlsMarkupOptions {
  allowed?: readonly WindowPosition[];
  ariaLabel: string;
  current: WindowPosition;
  groupClass?: string;
  optionClass?: string;
}

export function positionControlsMarkup({
  allowed = WINDOW_POSITIONS.map(({ position }) => position),
  ariaLabel,
  current,
  groupClass = "",
  optionClass = "",
}: PositionControlsMarkupOptions): string {
  const safeGroupClass = escapeMarkup(groupClass);
  const safeOptionClass = escapeMarkup(optionClass);
  const allowedSet = new Set(allowed);
  const options = WINDOW_POSITIONS
    .filter(({ position }) => allowedSet.has(position))
    .map(({ icon, label, position }) => (
      `<button class="ia2-position-option ${safeOptionClass}" type="button" role="radio" data-position="${position}" aria-checked="${current === position}" aria-label="${escapeMarkup(label)}" title="${escapeMarkup(label)}" tabindex="${current === position ? "0" : "-1"}">${icon}</button>`
    ))
    .join("");
  return `<div class="ia2-position-switch ${safeGroupClass}" role="radiogroup" aria-label="${escapeMarkup(ariaLabel)}">${options}</div>`;
}

export function updateWindowPositionControls(
  root: ParentNode,
  position: WindowPosition,
  focus = false,
): void {
  const options = Array.from(root.querySelectorAll<HTMLButtonElement>(".ia2-position-option"));
  for (const option of options) {
    const selected = option.dataset.position === position;
    option.setAttribute("aria-checked", String(selected));
    option.tabIndex = selected ? 0 : -1;
    if (selected && focus) option.focus();
  }
}

export function bindWindowPositionControls(
  root: ParentNode,
  applyPosition: (position: WindowPosition, focus: boolean) => boolean | void,
): () => void {
  const group = root instanceof HTMLElement && root.matches(".ia2-position-switch")
    ? root
    : root.querySelector<HTMLElement>(".ia2-position-switch");
  const options = Array.from(root.querySelectorAll<HTMLButtonElement>(".ia2-position-option"));
  const cleanups: Array<() => void> = [];

  for (const option of options) {
    const click = (): void => {
      if (!isWindowPosition(option.dataset.position)) return;
      if (applyPosition(option.dataset.position, false) !== false) {
        updateWindowPositionControls(root, option.dataset.position);
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
    const nextPosition = options[next]?.dataset.position;
    if (!isWindowPosition(nextPosition)) return;
    if (applyPosition(nextPosition, true) !== false) {
      updateWindowPositionControls(root, nextPosition, true);
    }
  };
  group?.addEventListener("keydown", keydown);
  cleanups.push(() => group?.removeEventListener("keydown", keydown));

  return () => {
    for (const cleanup of cleanups) cleanup();
  };
}

export interface FloatingWindowDragOptions {
  disabled?: boolean;
  margin?: number;
}

export function startFloatingWindowDrag(
  event: PointerEvent,
  element: HTMLElement,
  { disabled = false, margin = 8 }: FloatingWindowDragOptions = {},
): void {
  if (
    disabled
    || event.button !== 0
    || (event.target instanceof Element && event.target.closest("button"))
  ) return;
  const start = element.getBoundingClientRect();
  const view = element.ownerDocument.defaultView;
  if (!view) return;
  const startX = event.clientX;
  const startY = event.clientY;
  const move = (moveEvent: PointerEvent): void => {
    const maxX = Math.max(margin, view.innerWidth - start.width - margin);
    const maxY = Math.max(margin, view.innerHeight - start.height - margin);
    const left = Math.min(maxX, Math.max(margin, start.left + moveEvent.clientX - startX));
    const top = Math.min(maxY, Math.max(margin, start.top + moveEvent.clientY - startY));
    element.style.left = `${left}px`;
    element.style.top = `${top}px`;
    element.dataset.dragged = "true";
  };
  const stop = (): void => {
    view.removeEventListener("pointermove", move);
    view.removeEventListener("pointerup", stop);
    view.removeEventListener("pointercancel", stop);
    element.classList.remove("is-dragging");
  };
  element.classList.add("is-dragging");
  view.addEventListener("pointermove", move);
  view.addEventListener("pointerup", stop, { once: true });
  view.addEventListener("pointercancel", stop, { once: true });
  event.preventDefault();
}

export interface FloatingWindowResizeOptions {
  disabled?: boolean;
  margin?: number;
  minHeight?: number;
  minWidth?: number;
  onChange?: (rect: FloatingWindowRect) => void;
}

export function startFloatingWindowResize(
  event: PointerEvent,
  element: HTMLElement,
  direction: WindowResizeDirection,
  {
    disabled = false,
    margin = 8,
    minHeight = 280,
    minWidth = 320,
    onChange,
  }: FloatingWindowResizeOptions = {},
): void {
  if (disabled || event.button !== 0) return;
  const view = element.ownerDocument.defaultView;
  if (!view || view.innerWidth <= 760) return;

  const start = element.getBoundingClientRect();
  const startX = event.clientX;
  const startY = event.clientY;
  const availableWidth = Math.max(view.innerWidth - margin * 2, 1);
  const availableHeight = Math.max(view.innerHeight - margin * 2, 1);
  const minimumWidth = Math.min(minWidth, availableWidth);
  const minimumHeight = Math.min(minHeight, availableHeight);

  const apply = (moveEvent: PointerEvent): void => {
    const deltaX = moveEvent.clientX - startX;
    const deltaY = moveEvent.clientY - startY;
    let left = start.left;
    let top = start.top;
    let right = start.right;
    let bottom = start.bottom;

    if (direction.includes("e")) {
      right = Math.min(view.innerWidth - margin, Math.max(start.left + minimumWidth, start.right + deltaX));
    }
    if (direction.includes("s")) {
      bottom = Math.min(view.innerHeight - margin, Math.max(start.top + minimumHeight, start.bottom + deltaY));
    }
    if (direction.includes("w")) {
      left = Math.max(margin, Math.min(start.right - minimumWidth, start.left + deltaX));
    }
    if (direction.includes("n")) {
      top = Math.max(margin, Math.min(start.bottom - minimumHeight, start.top + deltaY));
    }

    const rect = {
      height: bottom - top,
      width: right - left,
      x: left,
      y: top,
    };
    element.style.height = `${rect.height}px`;
    element.style.left = `${rect.x}px`;
    element.style.top = `${rect.y}px`;
    element.style.width = `${rect.width}px`;
    element.dataset.dragged = "true";
    onChange?.(rect);
  };
  const stop = (): void => {
    view.removeEventListener("pointermove", apply);
    view.removeEventListener("pointerup", stop);
    view.removeEventListener("pointercancel", stop);
    element.classList.remove("is-resizing");
  };

  element.classList.add("is-resizing");
  view.addEventListener("pointermove", apply);
  view.addEventListener("pointerup", stop, { once: true });
  view.addEventListener("pointercancel", stop, { once: true });
  event.preventDefault();
}
