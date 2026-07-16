import { describe, expect, it, vi } from "vitest";
import { renderSafeMarkdown } from "../src/markdown.js";

describe("safe Markdown renderer", () => {
  it("renders conventional block and inline Markdown without interpreting HTML", async () => {
    const rendered = await renderSafeMarkdown(`# Review **complete**

Conditions
----------

> Keep the evidence with the decision.

- [x] Security review
- [ ] Contract update

| Check | Result |
| :--- | ---: |
| Policy | \`pass\` |

~~~json
{"approved": true}
~~~

Raw <script>window.bad = true</script> stays text.`);

    expect(rendered.querySelector("h1 strong")?.textContent).toBe("complete");
    expect(rendered.querySelector("h2")?.textContent).toBe("Conditions");
    expect(rendered.querySelector("blockquote")?.textContent).toContain("evidence");
    expect(rendered.querySelectorAll("li")).toHaveLength(2);
    expect(rendered.querySelectorAll("input[type='checkbox']")).toHaveLength(2);
    expect(rendered.querySelector("tbody td:last-child code")?.textContent).toBe("pass");
    expect(rendered.querySelector("pre code")?.className).toBe("language-json");
    expect(rendered.querySelector("script")).toBeNull();
    expect(rendered.textContent).toContain("<script>window.bad = true</script>");
  });

  it("delegates links and images to the embedding consumer", async () => {
    const resolveLink = vi.fn(() => "#hare-navigation");
    const resolveImage = vi.fn(() => "blob:verified-image");
    const rendered = await renderSafeMarkdown(
      "See [status](../data/status.json) and ![verified](../assets/verified.svg \"Badge\").",
      { resolveLink, resolveImage },
    );

    const link = rendered.querySelector<HTMLAnchorElement>("a");
    const image = rendered.querySelector<HTMLImageElement>("img");
    expect(link?.href).toContain("#hare-navigation");
    expect(link?.dataset.markdownDestination).toBe("../data/status.json");
    expect(image?.src).toBe("blob:verified-image");
    expect(image?.dataset.markdownDestination).toBe("../assets/verified.svg");
    expect(image?.title).toBe("Badge");
    expect(resolveLink).toHaveBeenCalledOnce();
    expect(resolveImage).toHaveBeenCalledOnce();
  });

  it("does not create active images or unsafe links by default", async () => {
    const rendered = await renderSafeMarkdown(
      "![remote](https://example.org/tracker.png) [unsafe](javascript:alert(1)) [local](./note.md)",
    );

    expect(rendered.querySelector("img")).toBeNull();
    expect(rendered.querySelector("a[href^='javascript:']")).toBeNull();
    expect(rendered.querySelector<HTMLAnchorElement>("a")?.getAttribute("href")).toBe("./note.md");
    expect(rendered.querySelector(".markdown-image-unavailable")?.textContent).toBe("remote");
  });
});
