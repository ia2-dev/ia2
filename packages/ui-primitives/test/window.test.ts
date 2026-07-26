import { describe, expect, it } from "vitest";
import {
  IA2_WINDOW_ACTIVATE_EVENT,
  activateWindow,
  applyDockedWindowDimensions,
  bindWindowPositionControls,
  floatingWindowResizeHandlesMarkup,
  isWindowPosition,
  parseWindowPositions,
  positionControlsMarkup,
  startFloatingWindowResize,
  startWindowResize,
  windowResizeDirections,
  windowResizeHandlesMarkup,
  WINDOW_PLACEMENT_CSS,
  type CoordinatedWindow,
} from "../src/window.js";

describe("shared IA² window primitives", () => {
  it("arranges contributed desktop windows by their independent placement preferences", () => {
    const editorSource = document.createElement("aside");
    const editorSurface = document.createElement("section");
    const navigatorSource = document.createElement("aside");
    const navigatorSurface = document.createElement("section");
    document.body.append(editorSource, navigatorSource);
    let editorPosition: CoordinatedWindow["position"] = "right";
    let navigatorPosition: CoordinatedWindow["position"] = "right";
    let navigatorClosed = false;
    const editor: CoordinatedWindow = {
      allowedPositions: ["right", "floating"],
      close: () => undefined,
      position: editorPosition,
      preferredPositions: ["right", "floating"],
      preferredWidth: 416,
      priority: 20,
      setPosition: (position) => {
        editorPosition = position;
      },
      source: editorSource,
      surface: editorSurface,
    };
    const navigator: CoordinatedWindow = {
      allowedPositions: ["right", "left", "floating"],
      close: () => {
        navigatorClosed = true;
      },
      position: navigatorPosition,
      preferredPositions: ["left", "floating"],
      preferredWidth: 760,
      priority: 10,
      setPosition: (position) => {
        navigatorPosition = position;
      },
      source: navigatorSource,
      surface: navigatorSurface,
    };
    const originalInnerWidth = window.innerWidth;
    Object.defineProperty(window, "innerWidth", { configurable: true, value: 1400 });
    document.addEventListener(IA2_WINDOW_ACTIVATE_EVENT, (event) => {
      (event as CustomEvent<{ windows: CoordinatedWindow[] }>).detail.windows.push(navigator);
    }, { once: true });

    activateWindow(editor);

    expect(editorPosition).toBe("right");
    expect(navigatorPosition).toBe("left");

    navigatorPosition = "right";
    Object.defineProperty(window, "innerWidth", { configurable: true, value: 1000 });
    document.addEventListener(IA2_WINDOW_ACTIVATE_EVENT, (event) => {
      (event as CustomEvent<{ windows: CoordinatedWindow[] }>).detail.windows.push(navigator);
    }, { once: true });
    activateWindow(editor);
    expect(navigatorPosition).toBe("floating");

    navigatorPosition = "right";
    Object.defineProperty(window, "innerWidth", { configurable: true, value: 390 });
    document.addEventListener(IA2_WINDOW_ACTIVATE_EVENT, (event) => {
      (event as CustomEvent<{ windows: CoordinatedWindow[] }>).detail.windows.push(navigator);
    }, { once: true });
    activateWindow(editor);
    expect(navigatorClosed).toBe(true);

    Object.defineProperty(window, "innerWidth", { configurable: true, value: originalInnerWidth });
  });

  it("parses the shared position vocabulary with stable de-duplication", () => {
    expect(isWindowPosition("floating")).toBe(true);
    expect(isWindowPosition("bottom")).toBe(true);
    expect(isWindowPosition("center")).toBe(false);
    expect(parseWindowPositions("floating right floating invalid")).toEqual(["floating", "right"]);
    expect(parseWindowPositions("invalid", "left")).toEqual(["left"]);
  });

  it("provides shared side, horizontal, floating, mobile, and reduced-motion geometry", () => {
    expect(WINDOW_PLACEMENT_CSS).toContain(".ia2-window-launcher");
    expect(WINDOW_PLACEMENT_CSS).toContain("--ia2-window-launcher-layer");
    expect(WINDOW_PLACEMENT_CSS).toContain("--ia2-window-surface-layer");
    expect(WINDOW_PLACEMENT_CSS).toContain('[data-position="bottom"]');
    expect(WINDOW_PLACEMENT_CSS).toContain('[data-position="floating"]');
    expect(WINDOW_PLACEMENT_CSS).toContain('[data-position="right-top"] .ia2-window-resize-handle[data-resize="sw"]');
    expect(WINDOW_PLACEMENT_CSS).toContain("@media (max-width: 760px)");
    expect(WINDOW_PLACEMENT_CSS).toContain("width: 100%;");
    expect(WINDOW_PLACEMENT_CSS).toContain("@media (prefers-reduced-motion: reduce)");
  });

  it("renders and operates an accessible position radiogroup", () => {
    document.body.innerHTML = positionControlsMarkup({
      allowed: ["right", "floating", "left"],
      ariaLabel: "Window position",
      current: "right",
    });
    const applied: string[] = [];
    bindWindowPositionControls(document.body, (position) => {
      applied.push(position);
    });

    const right = document.querySelector<HTMLButtonElement>('[data-position="right"]')!;
    const floating = document.querySelector<HTMLButtonElement>('[data-position="floating"]')!;
    expect(document.querySelectorAll('[role="radio"]')).toHaveLength(3);
    expect(right.getAttribute("aria-checked")).toBe("true");

    right.focus();
    right.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "ArrowRight" }));
    expect(applied).toEqual(["floating"]);
    expect(floating.getAttribute("aria-checked")).toBe("true");
    expect(document.activeElement).toBe(floating);
  });

  it("renders and applies bounded floating resize handles", () => {
    document.body.innerHTML = floatingWindowResizeHandlesMarkup();
    const directions = Array.from(
      document.querySelectorAll<HTMLElement>(".ia2-window-resize-handle"),
      ({ dataset }) => dataset.resize,
    );
    expect(directions).toEqual(["n", "ne", "e", "se", "s", "sw", "w", "nw"]);

    const surface = document.createElement("section");
    surface.getBoundingClientRect = () => ({
      bottom: 400,
      height: 300,
      left: 100,
      right: 500,
      top: 100,
      width: 400,
      x: 100,
      y: 100,
      toJSON: () => ({}),
    });
    document.body.append(surface);
    const originalInnerWidth = window.innerWidth;
    const originalInnerHeight = window.innerHeight;
    Object.defineProperty(window, "innerWidth", { configurable: true, value: 1200 });
    Object.defineProperty(window, "innerHeight", { configurable: true, value: 800 });

    startFloatingWindowResize(
      new MouseEvent("pointerdown", {
        button: 0,
        cancelable: true,
        clientX: 500,
        clientY: 400,
      }) as unknown as PointerEvent,
      surface,
      "se",
    );
    window.dispatchEvent(new MouseEvent("pointermove", {
      clientX: 650,
      clientY: 500,
    }));

    expect(surface.style.left).toBe("100px");
    expect(surface.style.top).toBe("100px");
    expect(surface.style.width).toBe("550px");
    expect(surface.style.height).toBe("400px");
    expect(surface.dataset.dragged).toBe("true");
    expect(surface.classList.contains("is-resizing")).toBe(true);

    window.dispatchEvent(new MouseEvent("pointerup"));
    expect(surface.classList.contains("is-resizing")).toBe(false);
    Object.defineProperty(window, "innerWidth", { configurable: true, value: originalInnerWidth });
    Object.defineProperty(window, "innerHeight", { configurable: true, value: originalInnerHeight });
  });

  it("maps and resizes only browser-detached dock edges", () => {
    document.body.innerHTML = windowResizeHandlesMarkup();
    expect(windowResizeDirections("right")).toEqual(["w"]);
    expect(windowResizeDirections("right-top")).toEqual(["w", "s", "sw"]);
    expect(windowResizeDirections("bottom")).toEqual(["n"]);
    expect(windowResizeDirections("floating")).toEqual(["n", "ne", "e", "se", "s", "sw", "w", "nw"]);

    const surface = document.createElement("section");
    surface.dataset.position = "right-top";
    surface.getBoundingClientRect = () => ({
      bottom: 400,
      height: 300,
      left: 800,
      right: 1200,
      top: 100,
      width: 400,
      x: 800,
      y: 100,
      toJSON: () => ({}),
    });
    document.body.append(surface);
    const originalInnerWidth = window.innerWidth;
    const originalInnerHeight = window.innerHeight;
    Object.defineProperty(window, "innerWidth", { configurable: true, value: 1200 });
    Object.defineProperty(window, "innerHeight", { configurable: true, value: 800 });

    const disallowed = startWindowResize(
      new MouseEvent("pointerdown", {
        button: 0,
        cancelable: true,
        clientX: 1200,
        clientY: 200,
      }) as unknown as PointerEvent,
      surface,
      "right-top",
      "e",
    );
    expect(disallowed).toBeNull();

    let resized: { height: number; width: number } | null = null;
    startWindowResize(
      new MouseEvent("pointerdown", {
        button: 0,
        cancelable: true,
        clientX: 800,
        clientY: 400,
      }) as unknown as PointerEvent,
      surface,
      "right-top",
      "sw",
      {
        onChange: ({ height, width }) => {
          resized = { height, width };
        },
      },
    );
    window.dispatchEvent(new MouseEvent("pointermove", {
      clientX: 750,
      clientY: 440,
    }));
    expect(surface.style.getPropertyValue("--ia2-window-width")).toBe("450px");
    expect(surface.style.getPropertyValue("--ia2-window-half-height")).toBe("340px");
    expect(resized).toEqual({ height: 340, width: 450 });
    window.dispatchEvent(new MouseEvent("pointerup"));

    expect(applyDockedWindowDimensions(surface, {
      halfHeight: 120,
      horizontalHeight: 900,
      width: 200,
    })).toEqual({
      halfHeight: 280,
      horizontalHeight: 800,
      width: 320,
    });
    Object.defineProperty(window, "innerWidth", { configurable: true, value: originalInnerWidth });
    Object.defineProperty(window, "innerHeight", { configurable: true, value: originalInnerHeight });
  });

  it("escapes host-provided accessible labels and class fragments", () => {
    document.body.innerHTML = positionControlsMarkup({
      ariaLabel: 'Position "chooser" <unsafe>',
      current: "right",
      groupClass: 'group" data-injected="true',
    });
    const group = document.querySelector<HTMLElement>(".ia2-position-switch")!;
    expect(group.getAttribute("aria-label")).toBe('Position "chooser" <unsafe>');
    expect(group.hasAttribute("data-injected")).toBe(false);
  });
});
