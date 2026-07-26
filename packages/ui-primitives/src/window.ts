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

export const IA2_WINDOW_ACTIVATE_EVENT = "ia2:window-activate";

export interface CoordinatedWindow {
  allowedPositions: readonly WindowPosition[];
  close: () => void;
  position: WindowPosition;
  preferredPositions: readonly WindowPosition[];
  preferredWidth: number;
  priority: number;
  setPosition: (position: WindowPosition) => void;
  source: HTMLElement;
  surface: HTMLElement;
}

export interface WindowActivationDetail {
  source: HTMLElement;
  windows: CoordinatedWindow[];
}

/**
 * Announces that one IA² window is becoming active. Other IA² window
 * components contribute their placement preferences without coupling
 * themselves to a particular sibling component. Desktop windows are arranged
 * into non-overlapping docks when possible and otherwise use a movable
 * floating surface. Mobile windows remain exclusive because every placement
 * becomes full-screen at that breakpoint.
 */
export function activateWindow(activeWindow: CoordinatedWindow): void {
  const { source } = activeWindow;
  const EventConstructor = source.ownerDocument.defaultView?.CustomEvent
    ?? globalThis.CustomEvent;
  const detail: WindowActivationDetail = {
    source,
    windows: [activeWindow],
  };
  source.ownerDocument.dispatchEvent(new EventConstructor<WindowActivationDetail>(
    IA2_WINDOW_ACTIVATE_EVENT,
    { detail },
  ));

  const view = source.ownerDocument.defaultView;
  if (!view || view.innerWidth <= 760) {
    for (const window of detail.windows) {
      if (window.source !== source) window.close();
    }
    return;
  }
  if (windowPositionsAreCompatible(detail.windows, view.innerWidth, view.innerHeight)) return;

  const arranged = arrangeWindowPositions(detail.windows, view.innerWidth, view.innerHeight);
  for (const window of detail.windows) {
    const position = arranged.get(window.source);
    if (position && position !== window.position) window.setPosition(position);
  }
}

const WINDOW_RESIZE_DIRECTIONS: readonly WindowResizeDirection[] = [
  "n", "ne", "e", "se", "s", "sw", "w", "nw",
];

const WINDOW_RESIZE_DIRECTIONS_BY_POSITION: Readonly<Record<WindowPosition, readonly WindowResizeDirection[]>> = {
  right: ["w"],
  "right-top": ["w", "s", "sw"],
  "right-bottom": ["n", "w", "nw"],
  bottom: ["n"],
  floating: WINDOW_RESIZE_DIRECTIONS,
  top: ["s"],
  left: ["e"],
  "left-bottom": ["n", "e", "ne"],
  "left-top": ["e", "s", "se"],
};

interface WindowRect {
  bottom: number;
  left: number;
  right: number;
  top: number;
}

function windowRect(
  window: CoordinatedWindow,
  position: WindowPosition,
  viewportWidth: number,
  viewportHeight: number,
): WindowRect | null {
  if (position === "floating") return null;
  const measuredWidth = window.surface.getBoundingClientRect().width;
  const width = Math.min(measuredWidth || window.preferredWidth, viewportWidth);
  const halfHeight = viewportHeight / 2;
  if (position === "top") {
    return { bottom: halfHeight, left: 0, right: viewportWidth, top: 0 };
  }
  if (position === "bottom") {
    return { bottom: viewportHeight, left: 0, right: viewportWidth, top: halfHeight };
  }
  const left = position.startsWith("left") ? 0 : viewportWidth - width;
  const right = left + width;
  if (position.endsWith("-top")) {
    return { bottom: halfHeight, left, right, top: 0 };
  }
  if (position.endsWith("-bottom")) {
    return { bottom: viewportHeight, left, right, top: halfHeight };
  }
  return { bottom: viewportHeight, left, right, top: 0 };
}

function rectanglesOverlap(left: WindowRect | null, right: WindowRect | null): boolean {
  if (!left || !right) return false;
  return left.left < right.right
    && left.right > right.left
    && left.top < right.bottom
    && left.bottom > right.top;
}

function positionsAreCompatible(
  windows: readonly CoordinatedWindow[],
  positions: ReadonlyMap<HTMLElement, WindowPosition>,
  viewportWidth: number,
  viewportHeight: number,
): boolean {
  for (let leftIndex = 0; leftIndex < windows.length; leftIndex += 1) {
    const leftWindow = windows[leftIndex]!;
    const leftPosition = positions.get(leftWindow.source) ?? leftWindow.position;
    const leftRect = windowRect(leftWindow, leftPosition, viewportWidth, viewportHeight);
    for (let rightIndex = leftIndex + 1; rightIndex < windows.length; rightIndex += 1) {
      const rightWindow = windows[rightIndex]!;
      const rightPosition = positions.get(rightWindow.source) ?? rightWindow.position;
      if (rectanglesOverlap(
        leftRect,
        windowRect(rightWindow, rightPosition, viewportWidth, viewportHeight),
      )) return false;
    }
  }
  return true;
}

function windowPositionsAreCompatible(
  windows: readonly CoordinatedWindow[],
  viewportWidth: number,
  viewportHeight: number,
): boolean {
  return positionsAreCompatible(
    windows,
    new Map(windows.map((window) => [window.source, window.position])),
    viewportWidth,
    viewportHeight,
  );
}

function positionCandidates(window: CoordinatedWindow): WindowPosition[] {
  const allowed = new Set(window.allowedPositions);
  return Array.from(new Set([...window.preferredPositions, window.position, ...window.allowedPositions]))
    .filter((position) => allowed.has(position));
}

function arrangeWindowPositions(
  windows: readonly CoordinatedWindow[],
  viewportWidth: number,
  viewportHeight: number,
): Map<HTMLElement, WindowPosition> {
  const ordered = [...windows].sort((left, right) => right.priority - left.priority);
  const selected = new Map<HTMLElement, WindowPosition>();
  const choose = (index: number): boolean => {
    if (index >= ordered.length) return true;
    const window = ordered[index]!;
    for (const position of positionCandidates(window)) {
      selected.set(window.source, position);
      if (
        positionsAreCompatible(ordered.slice(0, index + 1), selected, viewportWidth, viewportHeight)
        && choose(index + 1)
      ) return true;
    }
    selected.delete(window.source);
    return false;
  };
  if (choose(0)) return selected;
  return new Map(windows.map((window) => [window.source, window.position]));
}

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
  .ia2-window-launcher {
    z-index: var(--ia2-window-launcher-layer, 2147483020);
  }
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
    z-index: var(--ia2-window-surface-layer, 2147483000);
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
  .ia2-window-resize-handles { display: contents; }
  .ia2-window-resize-handle {
    display: none;
    position: absolute;
    touch-action: none;
    z-index: 12;
  }
  .ia2-window-surface[data-position="floating"] .ia2-window-resize-handle,
  .ia2-window-surface[data-position="right"] .ia2-window-resize-handle[data-resize="w"],
  .ia2-window-surface[data-position="right-top"] .ia2-window-resize-handle[data-resize="w"],
  .ia2-window-surface[data-position="right-top"] .ia2-window-resize-handle[data-resize="s"],
  .ia2-window-surface[data-position="right-top"] .ia2-window-resize-handle[data-resize="sw"],
  .ia2-window-surface[data-position="right-bottom"] .ia2-window-resize-handle[data-resize="n"],
  .ia2-window-surface[data-position="right-bottom"] .ia2-window-resize-handle[data-resize="w"],
  .ia2-window-surface[data-position="right-bottom"] .ia2-window-resize-handle[data-resize="nw"],
  .ia2-window-surface[data-position="bottom"] .ia2-window-resize-handle[data-resize="n"],
  .ia2-window-surface[data-position="top"] .ia2-window-resize-handle[data-resize="s"],
  .ia2-window-surface[data-position="left"] .ia2-window-resize-handle[data-resize="e"],
  .ia2-window-surface[data-position="left-bottom"] .ia2-window-resize-handle[data-resize="n"],
  .ia2-window-surface[data-position="left-bottom"] .ia2-window-resize-handle[data-resize="e"],
  .ia2-window-surface[data-position="left-bottom"] .ia2-window-resize-handle[data-resize="ne"],
  .ia2-window-surface[data-position="left-top"] .ia2-window-resize-handle[data-resize="e"],
  .ia2-window-surface[data-position="left-top"] .ia2-window-resize-handle[data-resize="s"],
  .ia2-window-surface[data-position="left-top"] .ia2-window-resize-handle[data-resize="se"] {
    display: block;
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
    .ia2-window-surface[data-position] .ia2-window-resize-handles { display: none; }
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

export function windowResizeDirections(
  position: WindowPosition,
): readonly WindowResizeDirection[] {
  return WINDOW_RESIZE_DIRECTIONS_BY_POSITION[position];
}

export function windowResizeHandlesMarkup(): string {
  return `<div class="ia2-window-resize-handles" aria-hidden="true">${
    WINDOW_RESIZE_DIRECTIONS
      .map((direction) => (
        `<span class="ia2-window-resize-handle" data-resize="${direction}"></span>`
      ))
      .join("")
  }</div>`;
}

export function floatingWindowResizeHandlesMarkup(): string {
  return windowResizeHandlesMarkup();
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

export interface DockedWindowDimensions {
  halfHeight?: number;
  horizontalHeight?: number;
  width?: number;
}

export interface DockedWindowDimensionsOptions {
  minHeight?: number;
  minWidth?: number;
  mobileBreakpoint?: number;
}

function windowViewport(document: Document): { height: number; width: number } {
  const view = document.defaultView;
  return {
    height: Math.max(document.documentElement?.clientHeight || view?.innerHeight || 768, 1),
    width: Math.max(document.documentElement?.clientWidth || view?.innerWidth || 1024, 1),
  };
}

export function constrainDockedWindowDimensions(
  document: Document,
  dimensions: DockedWindowDimensions,
  {
    minHeight = 280,
    minWidth = 320,
    mobileBreakpoint = 760,
  }: DockedWindowDimensionsOptions = {},
): DockedWindowDimensions {
  const viewport = windowViewport(document);
  if (viewport.width <= mobileBreakpoint) return { ...dimensions };
  const minimumWidth = Math.min(minWidth, viewport.width);
  const minimumHeight = Math.min(minHeight, viewport.height);
  const constrained: DockedWindowDimensions = {};
  if (dimensions.halfHeight !== undefined) {
    constrained.halfHeight = Math.min(Math.max(dimensions.halfHeight, minimumHeight), viewport.height);
  }
  if (dimensions.horizontalHeight !== undefined) {
    constrained.horizontalHeight = Math.min(Math.max(dimensions.horizontalHeight, minimumHeight), viewport.height);
  }
  if (dimensions.width !== undefined) {
    constrained.width = Math.min(Math.max(dimensions.width, minimumWidth), viewport.width);
  }
  return constrained;
}

export function applyDockedWindowDimensions(
  element: HTMLElement,
  dimensions: DockedWindowDimensions,
  options: DockedWindowDimensionsOptions = {},
): DockedWindowDimensions {
  const constrained = constrainDockedWindowDimensions(
    element.ownerDocument,
    dimensions,
    options,
  );
  const properties: Array<[keyof DockedWindowDimensions, string]> = [
    ["width", "--ia2-window-width"],
    ["halfHeight", "--ia2-window-half-height"],
    ["horizontalHeight", "--ia2-window-horizontal-height"],
  ];
  for (const [key, property] of properties) {
    const value = constrained[key];
    if (value === undefined) element.style.removeProperty(property);
    else element.style.setProperty(property, `${value}px`);
  }
  return constrained;
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

export interface WindowResizeOptions extends DockedWindowDimensionsOptions {
  disabled?: boolean;
  initialRect?: FloatingWindowRect;
  margin?: number;
  onChange?: (rect: FloatingWindowRect) => void;
  onEnd?: (rect: FloatingWindowRect) => void;
}

export interface FloatingWindowResizeOptions extends WindowResizeOptions {}

export function startWindowResize(
  event: PointerEvent,
  element: HTMLElement,
  position: WindowPosition,
  direction: WindowResizeDirection,
  {
    disabled = false,
    initialRect,
    margin = 8,
    minHeight = 280,
    minWidth = 320,
    mobileBreakpoint = 760,
    onChange,
    onEnd,
  }: WindowResizeOptions = {},
): (() => void) | null {
  if (
    disabled
    || event.button !== 0
    || !windowResizeDirections(position).includes(direction)
  ) return null;
  const view = element.ownerDocument.defaultView;
  const viewport = windowViewport(element.ownerDocument);
  if (!view || viewport.width <= mobileBreakpoint) return null;

  const measured = element.getBoundingClientRect();
  const start = initialRect
    ? {
        bottom: initialRect.y + initialRect.height,
        height: initialRect.height,
        left: initialRect.x,
        right: initialRect.x + initialRect.width,
        top: initialRect.y,
        width: initialRect.width,
      }
    : measured;
  const startX = event.clientX;
  const startY = event.clientY;
  const availableWidth = Math.max(viewport.width - margin * 2, 1);
  const availableHeight = Math.max(viewport.height - margin * 2, 1);
  const minimumWidth = Math.min(minWidth, availableWidth);
  const minimumHeight = Math.min(minHeight, availableHeight);
  let currentRect: FloatingWindowRect = {
    height: start.height,
    width: start.width,
    x: start.left,
    y: start.top,
  };

  const apply = (moveEvent: PointerEvent): void => {
    const deltaX = moveEvent.clientX - startX;
    const deltaY = moveEvent.clientY - startY;
    if (position !== "floating") {
      const dimensions: DockedWindowDimensions = {};
      if (direction.includes("e")) dimensions.width = start.width + deltaX;
      if (direction.includes("w")) dimensions.width = start.width - deltaX;
      if (direction.includes("n") || direction.includes("s")) {
        const height = direction.includes("s") ? start.height + deltaY : start.height - deltaY;
        if (position === "top" || position === "bottom") dimensions.horizontalHeight = height;
        else dimensions.halfHeight = height;
      }
      const constrained = constrainDockedWindowDimensions(
        element.ownerDocument,
        dimensions,
        { minHeight, minWidth, mobileBreakpoint },
      );
      const width = constrained.width ?? start.width;
      const height = position === "top" || position === "bottom"
        ? constrained.horizontalHeight ?? start.height
        : constrained.halfHeight ?? start.height;
      if (constrained.width !== undefined) {
        element.style.setProperty("--ia2-window-width", `${constrained.width}px`);
      }
      if (constrained.halfHeight !== undefined) {
        element.style.setProperty("--ia2-window-half-height", `${constrained.halfHeight}px`);
      }
      if (constrained.horizontalHeight !== undefined) {
        element.style.setProperty("--ia2-window-horizontal-height", `${constrained.horizontalHeight}px`);
      }
      currentRect = {
        height,
        width,
        x: position.startsWith("right") ? viewport.width - width : 0,
        y: position === "bottom" || position.endsWith("-bottom")
          ? viewport.height - height
          : 0,
      };
      onChange?.(currentRect);
      return;
    }

    let left = start.left;
    let top = start.top;
    let right = start.right;
    let bottom = start.bottom;

    if (direction.includes("e")) {
      right = Math.min(viewport.width - margin, Math.max(start.left + minimumWidth, start.right + deltaX));
    }
    if (direction.includes("s")) {
      bottom = Math.min(viewport.height - margin, Math.max(start.top + minimumHeight, start.bottom + deltaY));
    }
    if (direction.includes("w")) {
      left = Math.max(margin, Math.min(start.right - minimumWidth, start.left + deltaX));
    }
    if (direction.includes("n")) {
      top = Math.max(margin, Math.min(start.bottom - minimumHeight, start.top + deltaY));
    }

    currentRect = {
      height: bottom - top,
      width: right - left,
      x: left,
      y: top,
    };
    element.style.height = `${currentRect.height}px`;
    element.style.left = `${currentRect.x}px`;
    element.style.top = `${currentRect.y}px`;
    element.style.width = `${currentRect.width}px`;
    element.dataset.dragged = "true";
    onChange?.(currentRect);
  };
  const stop = (): void => {
    view.removeEventListener("pointermove", apply);
    view.removeEventListener("pointerup", stop);
    view.removeEventListener("pointercancel", stop);
    element.classList.remove("is-resizing");
    onEnd?.(currentRect);
  };

  element.classList.add("is-resizing");
  view.addEventListener("pointermove", apply);
  view.addEventListener("pointerup", stop);
  view.addEventListener("pointercancel", stop);
  event.preventDefault();
  return stop;
}

export function startFloatingWindowResize(
  event: PointerEvent,
  element: HTMLElement,
  direction: WindowResizeDirection,
  options: FloatingWindowResizeOptions = {},
): void {
  startWindowResize(event, element, "floating", direction, options);
}
