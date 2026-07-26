export type WindowPosition = "right" | "right-top" | "right-bottom" | "bottom" | "floating" | "top" | "left" | "left-bottom" | "left-top";
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
export declare const IA2_WINDOW_ACTIVATE_EVENT = "ia2:window-activate";
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
export declare function activateWindow(activeWindow: CoordinatedWindow): void;
export declare const WINDOW_POSITIONS: ReadonlyArray<WindowPositionDefinition>;
/**
 * Shared geometry for IA² movable windows. Consumers supply surface colors,
 * dimensions, and component layout through CSS custom properties.
 */
export declare const WINDOW_PLACEMENT_CSS = "\n  .ia2-window-launcher {\n    z-index: var(--ia2-window-launcher-layer, 2147483020);\n  }\n  .ia2-window-surface {\n    border-left: 1px solid var(--ia2-window-rule, currentColor);\n    bottom: 0;\n    box-shadow: -12px 0 48px oklch(20% 0.03 286 / 18%);\n    max-width: 100vw;\n    position: fixed;\n    right: 0;\n    top: 0;\n    transform: translateX(105%);\n    transition:\n      opacity 180ms ease,\n      transform var(--ia2-window-transition-duration, 220ms) cubic-bezier(.22, 1, .36, 1),\n      visibility var(--ia2-window-transition-duration, 220ms);\n    visibility: hidden;\n    width: var(--ia2-window-width, min(760px, 72vw));\n    z-index: var(--ia2-window-surface-layer, 2147483000);\n  }\n  .ia2-window-surface[data-open=\"\"],\n  .ia2-window-surface[data-open=\"true\"] {\n    transform: translateX(0);\n    visibility: visible;\n  }\n  .ia2-window-surface[data-position^=\"left\"] {\n    border-left: 0;\n    border-right: 1px solid var(--ia2-window-rule, currentColor);\n    box-shadow: 12px 0 48px oklch(20% 0.03 286 / 18%);\n    left: 0;\n    right: auto;\n    transform: translateX(-105%);\n  }\n  .ia2-window-surface[data-position^=\"left\"][data-open=\"\"],\n  .ia2-window-surface[data-position^=\"left\"][data-open=\"true\"] {\n    transform: translateX(0);\n  }\n  .ia2-window-surface[data-position$=\"-top\"] {\n    bottom: auto;\n    border-bottom: 1px solid var(--ia2-window-rule, currentColor);\n    height: var(--ia2-window-half-height, 50vh);\n    top: 0;\n  }\n  .ia2-window-surface[data-position$=\"-bottom\"] {\n    border-top: 1px solid var(--ia2-window-rule, currentColor);\n    bottom: 0;\n    height: var(--ia2-window-half-height, 50vh);\n    top: auto;\n  }\n  .ia2-window-surface[data-position=\"top\"],\n  .ia2-window-surface[data-position=\"bottom\"] {\n    border: 0;\n    height: var(--ia2-window-horizontal-height, 50vh);\n    left: 0;\n    max-width: none;\n    right: 0;\n    width: 100vw;\n  }\n  .ia2-window-surface[data-position=\"top\"] {\n    border-bottom: 1px solid var(--ia2-window-rule, currentColor);\n    bottom: auto;\n    box-shadow: 0 12px 48px oklch(20% 0.03 286 / 18%);\n    top: 0;\n    transform: translateY(-105%);\n  }\n  .ia2-window-surface[data-position=\"bottom\"] {\n    border-top: 1px solid var(--ia2-window-rule, currentColor);\n    bottom: 0;\n    box-shadow: 0 -12px 48px oklch(20% 0.03 286 / 18%);\n    top: auto;\n    transform: translateY(105%);\n  }\n  .ia2-window-surface[data-position=\"top\"][data-open=\"\"],\n  .ia2-window-surface[data-position=\"top\"][data-open=\"true\"],\n  .ia2-window-surface[data-position=\"bottom\"][data-open=\"\"],\n  .ia2-window-surface[data-position=\"bottom\"][data-open=\"true\"] {\n    transform: translateY(0);\n  }\n  .ia2-window-surface[data-position=\"floating\"] {\n    border: 1px solid var(--ia2-window-rule, currentColor);\n    border-radius: var(--ia2-window-floating-radius, 14px);\n    bottom: auto;\n    box-shadow: 0 18px 64px oklch(20% 0.03 286 / 24%);\n    height: var(--ia2-window-floating-height, min(860px, calc(100vh - 48px)));\n    left: var(--ia2-window-floating-left, 50%);\n    opacity: 0;\n    overflow: hidden;\n    right: auto;\n    top: var(--ia2-window-floating-top, 50%);\n    transform: var(--ia2-window-floating-closed-transform, translate(-50%, -48%) scale(.985));\n    width: var(--ia2-window-floating-width, min(760px, calc(100vw - 48px)));\n  }\n  .ia2-window-surface[data-position=\"floating\"][data-open=\"\"],\n  .ia2-window-surface[data-position=\"floating\"][data-open=\"true\"] {\n    opacity: 1;\n    transform: var(--ia2-window-floating-open-transform, translate(-50%, -50%) scale(1));\n  }\n  .ia2-window-surface[data-position=\"floating\"][data-dragged=\"true\"] {\n    transform: none;\n  }\n  .ia2-window-resize-handles { display: contents; }\n  .ia2-window-resize-handle {\n    display: none;\n    position: absolute;\n    touch-action: none;\n    z-index: 12;\n  }\n  .ia2-window-surface[data-position=\"floating\"] .ia2-window-resize-handle,\n  .ia2-window-surface[data-position=\"right\"] .ia2-window-resize-handle[data-resize=\"w\"],\n  .ia2-window-surface[data-position=\"right-top\"] .ia2-window-resize-handle[data-resize=\"w\"],\n  .ia2-window-surface[data-position=\"right-top\"] .ia2-window-resize-handle[data-resize=\"s\"],\n  .ia2-window-surface[data-position=\"right-top\"] .ia2-window-resize-handle[data-resize=\"sw\"],\n  .ia2-window-surface[data-position=\"right-bottom\"] .ia2-window-resize-handle[data-resize=\"n\"],\n  .ia2-window-surface[data-position=\"right-bottom\"] .ia2-window-resize-handle[data-resize=\"w\"],\n  .ia2-window-surface[data-position=\"right-bottom\"] .ia2-window-resize-handle[data-resize=\"nw\"],\n  .ia2-window-surface[data-position=\"bottom\"] .ia2-window-resize-handle[data-resize=\"n\"],\n  .ia2-window-surface[data-position=\"top\"] .ia2-window-resize-handle[data-resize=\"s\"],\n  .ia2-window-surface[data-position=\"left\"] .ia2-window-resize-handle[data-resize=\"e\"],\n  .ia2-window-surface[data-position=\"left-bottom\"] .ia2-window-resize-handle[data-resize=\"n\"],\n  .ia2-window-surface[data-position=\"left-bottom\"] .ia2-window-resize-handle[data-resize=\"e\"],\n  .ia2-window-surface[data-position=\"left-bottom\"] .ia2-window-resize-handle[data-resize=\"ne\"],\n  .ia2-window-surface[data-position=\"left-top\"] .ia2-window-resize-handle[data-resize=\"e\"],\n  .ia2-window-surface[data-position=\"left-top\"] .ia2-window-resize-handle[data-resize=\"s\"],\n  .ia2-window-surface[data-position=\"left-top\"] .ia2-window-resize-handle[data-resize=\"se\"] {\n    display: block;\n  }\n  .ia2-window-resize-handle[data-resize=\"n\"],\n  .ia2-window-resize-handle[data-resize=\"s\"] {\n    height: 10px;\n    left: 18px;\n    right: 18px;\n  }\n  .ia2-window-resize-handle[data-resize=\"n\"] {\n    cursor: ns-resize;\n    top: 0;\n  }\n  .ia2-window-resize-handle[data-resize=\"s\"] {\n    bottom: 0;\n    cursor: ns-resize;\n  }\n  .ia2-window-resize-handle[data-resize=\"e\"],\n  .ia2-window-resize-handle[data-resize=\"w\"] {\n    bottom: 18px;\n    top: 18px;\n    width: 10px;\n  }\n  .ia2-window-resize-handle[data-resize=\"e\"] {\n    cursor: ew-resize;\n    right: 0;\n  }\n  .ia2-window-resize-handle[data-resize=\"w\"] {\n    cursor: ew-resize;\n    left: 0;\n  }\n  .ia2-window-resize-handle[data-resize=\"ne\"],\n  .ia2-window-resize-handle[data-resize=\"nw\"],\n  .ia2-window-resize-handle[data-resize=\"se\"],\n  .ia2-window-resize-handle[data-resize=\"sw\"] {\n    height: 20px;\n    width: 20px;\n  }\n  .ia2-window-resize-handle[data-resize=\"ne\"] {\n    cursor: nesw-resize;\n    right: 0;\n    top: 0;\n  }\n  .ia2-window-resize-handle[data-resize=\"nw\"] {\n    cursor: nwse-resize;\n    left: 0;\n    top: 0;\n  }\n  .ia2-window-resize-handle[data-resize=\"se\"] {\n    bottom: 0;\n    cursor: nwse-resize;\n    right: 0;\n  }\n  .ia2-window-resize-handle[data-resize=\"sw\"] {\n    bottom: 0;\n    cursor: nesw-resize;\n    left: 0;\n  }\n  .ia2-window-resize-handle[data-resize=\"se\"]::after {\n    border-bottom: 2px solid color-mix(in oklch, currentColor, transparent 68%);\n    border-right: 2px solid color-mix(in oklch, currentColor, transparent 68%);\n    bottom: 5px;\n    content: \"\";\n    height: 6px;\n    position: absolute;\n    right: 5px;\n    width: 6px;\n  }\n  .ia2-window-surface.is-resizing {\n    transition: none;\n    user-select: none;\n  }\n  @media (max-width: 760px) {\n    .ia2-window-surface,\n    .ia2-window-surface[data-position] {\n      border: 0;\n      border-radius: 0;\n      bottom: 0;\n      height: 100vh;\n      left: auto;\n      max-width: none;\n      opacity: 1;\n      right: 0;\n      top: 0;\n      transform: translateX(105%);\n      width: 100%;\n    }\n    .ia2-window-surface[data-position][data-open=\"\"],\n    .ia2-window-surface[data-position][data-open=\"true\"] {\n      transform: translateX(0);\n    }\n    .ia2-window-surface[data-position^=\"left\"] {\n      left: 0;\n      right: auto;\n      transform: translateX(-105%);\n    }\n    .ia2-window-surface[data-position] .ia2-window-resize-handles { display: none; }\n  }\n  @media (prefers-reduced-motion: reduce) {\n    .ia2-window-surface { transition: none; }\n  }\n";
export declare function isWindowPosition(value: unknown): value is WindowPosition;
export declare function parseWindowPositions(value: string | null, fallback?: WindowPosition): WindowPosition[];
export declare function windowResizeDirections(position: WindowPosition): readonly WindowResizeDirection[];
export declare function windowResizeHandlesMarkup(): string;
export declare function floatingWindowResizeHandlesMarkup(): string;
export interface PositionControlsMarkupOptions {
    allowed?: readonly WindowPosition[];
    ariaLabel: string;
    current: WindowPosition;
    groupClass?: string;
    optionClass?: string;
}
export declare function positionControlsMarkup({ allowed, ariaLabel, current, groupClass, optionClass, }: PositionControlsMarkupOptions): string;
export declare function updateWindowPositionControls(root: ParentNode, position: WindowPosition, focus?: boolean): void;
export declare function bindWindowPositionControls(root: ParentNode, applyPosition: (position: WindowPosition, focus: boolean) => boolean | void): () => void;
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
export declare function constrainDockedWindowDimensions(document: Document, dimensions: DockedWindowDimensions, { minHeight, minWidth, mobileBreakpoint, }?: DockedWindowDimensionsOptions): DockedWindowDimensions;
export declare function applyDockedWindowDimensions(element: HTMLElement, dimensions: DockedWindowDimensions, options?: DockedWindowDimensionsOptions): DockedWindowDimensions;
export interface FloatingWindowDragOptions {
    disabled?: boolean;
    margin?: number;
}
export declare function startFloatingWindowDrag(event: PointerEvent, element: HTMLElement, { disabled, margin }?: FloatingWindowDragOptions): void;
export interface WindowResizeOptions extends DockedWindowDimensionsOptions {
    disabled?: boolean;
    initialRect?: FloatingWindowRect;
    margin?: number;
    onChange?: (rect: FloatingWindowRect) => void;
    onEnd?: (rect: FloatingWindowRect) => void;
}
export interface FloatingWindowResizeOptions extends WindowResizeOptions {
}
export declare function startWindowResize(event: PointerEvent, element: HTMLElement, position: WindowPosition, direction: WindowResizeDirection, { disabled, initialRect, margin, minHeight, minWidth, mobileBreakpoint, onChange, onEnd, }?: WindowResizeOptions): (() => void) | null;
export declare function startFloatingWindowResize(event: PointerEvent, element: HTMLElement, direction: WindowResizeDirection, options?: FloatingWindowResizeOptions): void;
