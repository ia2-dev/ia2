import { describe, expect, it } from "vitest";
import {
  bindWindowPositionControls,
  floatingWindowResizeHandlesMarkup,
  isWindowPosition,
  parseWindowPositions,
  positionControlsMarkup,
  startFloatingWindowResize,
  WINDOW_PLACEMENT_CSS,
} from "../src/window.js";

describe("shared IA² window primitives", () => {
  it("parses the shared position vocabulary with stable de-duplication", () => {
    expect(isWindowPosition("floating")).toBe(true);
    expect(isWindowPosition("bottom")).toBe(true);
    expect(isWindowPosition("center")).toBe(false);
    expect(parseWindowPositions("floating right floating invalid")).toEqual(["floating", "right"]);
    expect(parseWindowPositions("invalid", "left")).toEqual(["left"]);
  });

  it("provides shared side, horizontal, floating, mobile, and reduced-motion geometry", () => {
    expect(WINDOW_PLACEMENT_CSS).toContain('[data-position="bottom"]');
    expect(WINDOW_PLACEMENT_CSS).toContain('[data-position="floating"]');
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
