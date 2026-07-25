import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  bindScrollSyncControls,
  scrollSyncControlsMarkup,
  updateScrollSyncControls,
} from "../src/sync.js";

describe("scroll synchronization controls", () => {
  beforeEach(() => {
    document.body.replaceChildren();
  });

  it("renders the shared three-mode icon radiogroup with adaptable labels", () => {
    document.body.innerHTML = scrollSyncControlsMarkup({
      current: "page",
      labels: {
        page: "Follow page viewport in author",
        panel: "Follow author in page",
      },
    });
    const options = Array.from(document.querySelectorAll<HTMLButtonElement>(".ia2-sync-option"));

    expect(options).toHaveLength(3);
    expect(options.map(({ dataset }) => dataset.syncMode)).toEqual(["off", "page", "panel"]);
    expect(options.map((option) => option.getAttribute("aria-label"))).toEqual([
      "Scroll synchronization off",
      "Follow page viewport in author",
      "Follow author in page",
    ]);
    expect(options.map((option) => option.getAttribute("aria-checked"))).toEqual([
      "false",
      "true",
      "false",
    ]);
    expect(options.every((option) => option.querySelector(".sync-icon"))).toBe(true);
  });

  it("shares click and roving-keyboard behavior between components", () => {
    document.body.innerHTML = scrollSyncControlsMarkup({ current: "off" });
    const switcher = document.querySelector<HTMLElement>(".ia2-sync-switch")!;
    const options = Array.from(document.querySelectorAll<HTMLButtonElement>(".ia2-sync-option"));
    const applyMode = vi.fn(() => true);
    const cleanup = bindScrollSyncControls(switcher, applyMode);

    options[1]!.click();
    expect(applyMode).toHaveBeenLastCalledWith("page", false);
    expect(options[1]!.getAttribute("aria-checked")).toBe("true");

    options[1]!.focus();
    options[1]!.dispatchEvent(new KeyboardEvent("keydown", {
      bubbles: true,
      key: "ArrowRight",
    }));
    expect(applyMode).toHaveBeenLastCalledWith("panel", true);
    expect(options[2]!.getAttribute("aria-checked")).toBe("true");
    expect(document.activeElement).toBe(options[2]);

    updateScrollSyncControls(switcher, "off");
    expect(options.map((option) => option.tabIndex)).toEqual([0, -1, -1]);
    cleanup();
  });

  it("escapes host-provided sync labels", () => {
    document.body.innerHTML = scrollSyncControlsMarkup({
      ariaLabel: 'Sync "chooser" <unsafe>',
      current: "off",
      label: "<Sync>",
    });
    expect(document.querySelector(".ia2-sync-label")?.textContent).toBe("<Sync>");
    expect(document.querySelector(".ia2-sync-switch")?.getAttribute("aria-label"))
      .toBe('Sync "chooser" <unsafe>');
  });
});
