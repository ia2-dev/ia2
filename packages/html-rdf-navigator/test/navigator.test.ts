import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mountRdfNavigator as mountClosedRdfNavigator } from "../src/index.js";

const SESSION_STATE_KEY = "ia2:rdf-navigator:state:v1";

function mountRdfNavigator() {
  const drawer = mountClosedRdfNavigator();
  drawer.open();
  return drawer;
}

beforeEach(() => {
  sessionStorage.removeItem(SESSION_STATE_KEY);
  document.documentElement.setAttribute("rdf-version", "1.2");
  document.head.querySelectorAll('[rdf-predicate], link[rel~="canonical"]')
    .forEach((element) => element.remove());
  document.body.innerHTML = '<span rdf-subject="https://example.com/alice" rdf-predicate="https://schema.org/name">Alice</span>';
});

afterEach(() => {
  document.querySelector("ia2-rdf-navigator")?.remove();
  sessionStorage.removeItem(SESSION_STATE_KEY);
});

describe("Ia2RdfNavigator", () => {
  it("opens with Navigator first and links vocabulary terms in new tabs", () => {
    const drawer = mountRdfNavigator();
    const tabs = Array.from(drawer.shadowRoot?.querySelectorAll<HTMLButtonElement>('[role="tab"]') ?? []);
    expect(tabs.map((tab) => tab.textContent)).toEqual(["Navigator", "SPARQL", "Turtle", "JSON-LD"]);
    expect(tabs[0]?.getAttribute("aria-selected")).toBe("true");
    const toolbar = drawer.shadowRoot?.querySelector<HTMLElement>(".toolbar");
    const tools = drawer.shadowRoot?.querySelector<HTMLElement>(".navigator-tools");
    expect(toolbar?.querySelector(".tabs")).not.toBeNull();
    expect(toolbar?.querySelector(".header-actions")).not.toBeNull();
    expect(drawer.shadowRoot?.querySelector(".heading")).toBeNull();
    expect(tools?.contains(drawer.shadowRoot?.querySelector(".navigator-search") ?? null)).toBe(true);
    expect(tools?.contains(drawer.shadowRoot?.querySelector(".sync-control") ?? null)).toBe(true);
    expect(tools?.contains(drawer.shadowRoot?.querySelector(".vocabularies") ?? null)).toBe(true);

    const predicate = drawer.shadowRoot?.querySelector<HTMLAnchorElement>('.navigator .predicate a[href="https://schema.org/name"]');
    expect(predicate?.target).toBe("_blank");
    expect(predicate?.rel).toBe("noopener noreferrer");

    const vocabulary = drawer.shadowRoot?.querySelector<HTMLAnchorElement>('.vocabulary-link[href="https://schema.org/"]');
    expect(vocabulary?.target).toBe("_blank");
  });

  it("shows Diagnostics only while extraction diagnostics exist", async () => {
    document.body.innerHTML = '<a href="https://example.com/bob" rdf-object-key="bob" rdf-subject="https://example.com/alice" rdf-predicate="https://schema.org/knows">Bob</a>';
    const drawer = mountRdfNavigator();
    const diagnostics = drawer.shadowRoot?.querySelector<HTMLButtonElement>('[data-view="diagnostics"]')!;
    expect(diagnostics.textContent).toBe("Diagnostics (1)");

    diagnostics.click();
    expect(drawer.shadowRoot?.querySelector('[data-view="diagnostics"]')?.getAttribute("aria-selected")).toBe("true");
    document.body.querySelector("a")?.removeAttribute("rdf-object-key");
    await new Promise((resolve) => window.setTimeout(resolve, 180));

    expect(drawer.shadowRoot?.querySelector('[data-view="diagnostics"]')).toBeNull();
    expect(drawer.shadowRoot?.querySelector('[data-view="navigator"]')?.getAttribute("aria-selected")).toBe("true");
  });

  it("browses SHACL shapes without presenting inspection as validation", () => {
    document.body.innerHTML = `
      <span id="legal-name-field">[Legal name]</span>
      <a hidden href="http://www.w3.org/ns/shacl#PropertyGroup" rdf-subject="#parties-group" rdf-predicate="http://www.w3.org/1999/02/22-rdf-syntax-ns#type"></a>
      <span hidden rdf-subject="#parties-group" rdf-predicate="http://www.w3.org/ns/shacl#name">Agreement and parties</span>
      <a hidden href="http://www.w3.org/ns/shacl#PropertyShape" rdf-subject="#legal-name-shape" rdf-predicate="http://www.w3.org/1999/02/22-rdf-syntax-ns#type"></a>
      <span hidden rdf-subject="#legal-name-shape" rdf-predicate="http://www.w3.org/ns/shacl#name">Assignor legal name</span>
      <a hidden href="#parties-group" rdf-subject="#legal-name-shape" rdf-predicate="http://www.w3.org/ns/shacl#group"></a>
      <a hidden href="#assignor" rdf-subject="#legal-name-shape" rdf-predicate="http://www.w3.org/ns/shacl#targetNode"></a>
      <a hidden href="https://schema.org/legalName" rdf-subject="#legal-name-shape" rdf-predicate="http://www.w3.org/ns/shacl#path"></a>
      <data hidden value="1" rdf-subject="#legal-name-shape" rdf-predicate="http://www.w3.org/ns/shacl#minCount" rdf-datatype="http://www.w3.org/2001/XMLSchema#integer"></data>
      <a hidden href="http://www.w3.org/ns/oa#Annotation" rdf-subject="#legal-name-presentation" rdf-predicate="http://www.w3.org/1999/02/22-rdf-syntax-ns#type"></a>
      <a hidden href="#legal-name-shape" rdf-subject="#legal-name-presentation" rdf-predicate="http://www.w3.org/ns/oa#hasBody"></a>
      <a hidden href="#legal-name-field" rdf-subject="#legal-name-presentation" rdf-predicate="http://www.w3.org/ns/oa#hasTarget"></a>
    `;
    const field = document.getElementById("legal-name-field")!;
    field.scrollIntoView = vi.fn();
    field.animate = vi.fn(() => ({ cancel: vi.fn() } as unknown as Animation));

    const drawer = mountRdfNavigator();
    const tabs = Array.from(drawer.shadowRoot?.querySelectorAll<HTMLButtonElement>('[role="tab"]') ?? []);
    expect(tabs.map((tab) => tab.textContent)).toEqual([
      "Navigator",
      "Shapes (1)",
      "SPARQL",
      "Turtle",
      "JSON-LD",
    ]);

    drawer.shadowRoot?.querySelector<HTMLButtonElement>('[data-view="shapes"]')?.click();
    const root = drawer.shadowRoot!;
    expect(root.querySelector(".shapes-intro")?.textContent).toContain("does not run SHACL validation");
    expect(root.querySelector(".shape-group-heading h3")?.textContent).toBe("Agreement and parties");
    expect(root.querySelector(".shape-name")?.textContent).toBe("Assignor legal name");
    expect(root.querySelector(".shape-summary-meta")?.textContent).toContain("Property shape");

    root.querySelector<HTMLDetailsElement>(".shape-row")!.open = true;
    expect(root.querySelector(".shape-detail")?.textContent).toContain("schema:legalName");
    expect(root.querySelector(".shape-detail")?.textContent).toContain("Min Count");
    root.querySelector<HTMLButtonElement>(".shape-locate")?.click();
    expect(field.scrollIntoView).toHaveBeenCalledWith({ behavior: "smooth", block: "center" });

    const search = root.querySelector<HTMLInputElement>(".shapes-search")!;
    search.value = "nonexistent constraint";
    search.dispatchEvent(new Event("input", { bubbles: true }));
    expect(root.querySelector(".shapes-empty")?.textContent).toBe("No shapes match this filter.");
    expect(root.querySelector<HTMLElement>(".shapes-empty")?.hidden).toBe(false);
  });

  it("compacts ODRL authority terms", () => {
    document.body.innerHTML = '<a href="https://example.com/draft-permission" rdf-subject="https://example.com/policy" rdf-predicate="http://www.w3.org/ns/odrl/2/permission">Draft amendment</a>';
    const drawer = mountRdfNavigator();
    const predicate = drawer.shadowRoot?.querySelector<HTMLAnchorElement>('.navigator .predicate a[href="http://www.w3.org/ns/odrl/2/permission"]');
    const vocabulary = drawer.shadowRoot?.querySelector<HTMLAnchorElement>('.vocabulary-link[href="http://www.w3.org/ns/odrl/2/"]');

    expect(predicate?.textContent).toBe("odrl:permission");
    expect(vocabulary?.previousElementSibling?.textContent).toContain("odrl");
  });

  it("runs editable SPARQL locally against the extracted dataset", async () => {
    const drawer = mountRdfNavigator();
    drawer.shadowRoot?.querySelector<HTMLButtonElement>('[data-view="sparql"]')?.click();
    const editor = drawer.shadowRoot?.querySelector<HTMLTextAreaElement>(".sparql-editor")!;
    expect(editor.value).toContain("SELECT ?subject ?predicate ?object ?graph");
    expect(drawer.shadowRoot?.querySelector(".sparql-safety")?.textContent).toContain("Read-only");

    editor.value = "SELECT ?person ?name WHERE { ?person <https://schema.org/name> ?name }";
    editor.dispatchEvent(new Event("input", { bubbles: true }));
    drawer.shadowRoot?.querySelector<HTMLButtonElement>(".sparql-run")?.click();

    await vi.waitFor(() => {
      expect(drawer.shadowRoot?.querySelector(".sparql-output")?.textContent).toContain("Alice");
    }, { timeout: 10_000 });
    expect(drawer.shadowRoot?.querySelectorAll(".sparql-table tbody tr")).toHaveLength(1);
  });

  it("presents labeled SPARQL resources readably while retaining their linked IRIs", async () => {
    document.body.innerHTML = `
      <span rdf-subject="https://example.com/right" rdf-predicate="http://www.w3.org/2000/01/rdf-schema#label">Readable contractual right</span>
    `;
    const drawer = mountRdfNavigator();
    drawer.shadowRoot?.querySelector<HTMLButtonElement>('[data-view="sparql"]')?.click();
    const editor = drawer.shadowRoot?.querySelector<HTMLTextAreaElement>(".sparql-editor")!;
    editor.value = "SELECT ?right ?label WHERE { ?right <http://www.w3.org/2000/01/rdf-schema#label> ?label }";
    editor.dispatchEvent(new Event("input", { bubbles: true }));
    drawer.shadowRoot?.querySelector<HTMLButtonElement>(".sparql-run")?.click();

    await vi.waitFor(() => {
      expect(drawer.shadowRoot?.querySelector(".sparql-resource-label")?.textContent)
        .toBe("Readable contractual right");
    }, { timeout: 10_000 });
    const root = drawer.shadowRoot!;
    const resourceLink = root.querySelector<HTMLAnchorElement>(".sparql-resource-label");
    expect(resourceLink?.href).toBe("https://example.com/right");
    expect(resourceLink?.title).toBe("https://example.com/right");
    expect(resourceLink?.getAttribute("aria-label")).toContain("Readable contractual right");
    expect(root.querySelectorAll(".sparql-table tbody td")[1]?.textContent)
      .toBe("Readable contractual right");
    expect(root.querySelector(".sparql-table")?.textContent).not.toContain("https://example.com/right");
    expect(root.querySelector(".sparql-table")?.textContent).not.toContain("XMLSchema#string");
  });

  it("routes canonical document SPARQL links through the current retrieval URL", async () => {
    const canonicalIri = "https://ia2.dev/example/assignment.html";
    const canonical = document.createElement("link");
    canonical.rel = "canonical";
    canonical.href = canonicalIri;
    document.head.append(canonical);
    document.body.innerHTML = `
      <span rdf-subject="" rdf-predicate="http://www.w3.org/2000/01/rdf-schema#label">Assignment agreement</span>
      <span id="parties" rdf-predicate="http://www.w3.org/2000/01/rdf-schema#label">Parties</span>
    `;
    const drawer = mountRdfNavigator();
    drawer.shadowRoot?.querySelector<HTMLButtonElement>('[data-view="sparql"]')?.click();
    const editor = drawer.shadowRoot?.querySelector<HTMLTextAreaElement>(".sparql-editor")!;
    editor.value = "SELECT ?resource WHERE { ?resource <http://www.w3.org/2000/01/rdf-schema#label> ?label } ORDER BY ?resource";
    editor.dispatchEvent(new Event("input", { bubbles: true }));
    drawer.shadowRoot?.querySelector<HTMLButtonElement>(".sparql-run")?.click();

    await vi.waitFor(() => {
      expect(drawer.shadowRoot?.querySelectorAll(".sparql-resource-label")).toHaveLength(2);
    }, { timeout: 10_000 });
    const links = Array.from(
      drawer.shadowRoot?.querySelectorAll<HTMLAnchorElement>(".sparql-resource-label") ?? [],
    );
    const parties = document.getElementById("parties")!;
    parties.scrollIntoView = vi.fn();
    const retrievalIri = new URL(document.URL);
    retrievalIri.hash = "";
    expect(links.map((link) => link.href)).toEqual([
      retrievalIri.href,
      `${retrievalIri.href}#parties`,
    ]);
    expect(links.map((link) => link.title)).toEqual([
      canonicalIri,
      `${canonicalIri}#parties`,
    ]);
    expect(links.every((link) => link.dataset.semanticIri?.startsWith(canonicalIri))).toBe(true);

    links[1]?.click();
    expect(parties.scrollIntoView).toHaveBeenCalledWith({ behavior: "smooth", block: "center" });
    expect(window.location.hash).toBe("#parties");
    expect(drawer.shadowRoot?.querySelector(".resource-preview")).toBeNull();
    window.history.replaceState(null, "", retrievalIri.href);
  });

  it("reuses one embedded resource window for external SPARQL links", async () => {
    document.body.innerHTML = `
      <span rdf-subject="https://example.com/alice" rdf-predicate="https://schema.org/name">Alice</span>
      <span rdf-subject="https://example.com/bob" rdf-predicate="https://schema.org/name">Bob</span>
    `;
    const drawer = mountRdfNavigator();
    drawer.shadowRoot?.querySelector<HTMLButtonElement>('[data-view="sparql"]')?.click();
    const editor = drawer.shadowRoot?.querySelector<HTMLTextAreaElement>(".sparql-editor")!;
    editor.value = "SELECT ?person WHERE { ?person <https://schema.org/name> ?name } ORDER BY ?person";
    editor.dispatchEvent(new Event("input", { bubbles: true }));
    drawer.shadowRoot?.querySelector<HTMLButtonElement>(".sparql-run")?.click();

    await vi.waitFor(() => {
      expect(drawer.shadowRoot?.querySelectorAll(".sparql-resource-label")).toHaveLength(2);
    }, { timeout: 10_000 });
    const links = Array.from(
      drawer.shadowRoot?.querySelectorAll<HTMLAnchorElement>(".sparql-resource-label") ?? [],
    );
    links[0]?.click();
    const firstPreview = drawer.shadowRoot?.querySelector<HTMLElement>(".resource-preview");
    expect(firstPreview).not.toBeNull();
    expect(firstPreview?.querySelector<HTMLAnchorElement>(".resource-preview-open")?.href)
      .toBe("https://example.com/alice");

    links[1]?.click();
    const previews = drawer.shadowRoot?.querySelectorAll<HTMLElement>(".resource-preview");
    expect(previews).toHaveLength(1);
    expect(previews?.[0]).toBe(firstPreview);
    expect(firstPreview?.querySelector<HTMLAnchorElement>(".resource-preview-open")?.href)
      .toBe("https://example.com/bob");
    expect(firstPreview?.querySelector(".resource-preview-url")?.textContent)
      .toBe("https://example.com/bob");
  });

  it("derives linked labels for unlabeled IRIs and renders plain strings without RDF punctuation", async () => {
    document.body.innerHTML = `
      <h1 rdf-subject="https://example.com/agreement" rdf-predicate="http://purl.org/dc/terms/title">Assignment agreement</h1>
      <p rdf-subject="https://example.com/agreement" rdf-predicate="http://purl.org/dc/terms/description">A customer-distributable contract.</p>
    `;
    const drawer = mountRdfNavigator();
    drawer.shadowRoot?.querySelector<HTMLButtonElement>('[data-view="sparql"]')?.click();
    const editor = drawer.shadowRoot?.querySelector<HTMLTextAreaElement>(".sparql-editor")!;
    editor.value = `SELECT ?subject ?predicate ?object WHERE {
      ?subject ?predicate ?object
      VALUES ?predicate { <http://purl.org/dc/terms/description> }
    }`;
    editor.dispatchEvent(new Event("input", { bubbles: true }));
    drawer.shadowRoot?.querySelector<HTMLButtonElement>(".sparql-run")?.click();

    await vi.waitFor(() => {
      expect(drawer.shadowRoot?.querySelector(".sparql-summary")?.textContent).toBe("1 result");
    }, { timeout: 10_000 });
    const cells = drawer.shadowRoot?.querySelectorAll<HTMLTableCellElement>(".sparql-table tbody td")!;
    const subject = cells[0]?.querySelector<HTMLAnchorElement>(".sparql-resource-label");
    const predicate = cells[1]?.querySelector<HTMLAnchorElement>(".sparql-resource-label");
    expect(subject?.textContent).toBe("Assignment agreement");
    expect(subject?.href).toBe("https://example.com/agreement");
    expect(predicate?.textContent).toBe("Description");
    expect(predicate?.href).toBe("http://purl.org/dc/terms/description");
    expect(cells[2]?.querySelector(".sparql-literal-value")?.textContent)
      .toBe("A customer-distributable contract.");
    expect(cells[2]?.textContent).toBe("A customer-distributable contract.");
    expect(cells[2]?.textContent).not.toContain('"');
    expect(cells[2]?.textContent).not.toContain("XMLSchema#string");
  });

  it("paginates SPARQL binding results and lets the reader choose a page size", async () => {
    document.body.innerHTML = Array.from({ length: 30 }, (_, index) => {
      const ordinal = String(index + 1).padStart(2, "0");
      return `<span rdf-subject="https://example.com/person-${ordinal}" rdf-predicate="https://schema.org/name">Person ${ordinal}</span>`;
    }).join("");
    const drawer = mountRdfNavigator();
    drawer.shadowRoot?.querySelector<HTMLButtonElement>('[data-view="sparql"]')?.click();
    const editor = drawer.shadowRoot?.querySelector<HTMLTextAreaElement>(".sparql-editor")!;
    editor.value = "SELECT ?person ?name WHERE { ?person <https://schema.org/name> ?name } ORDER BY ?name";
    editor.dispatchEvent(new Event("input", { bubbles: true }));
    drawer.shadowRoot?.querySelector<HTMLButtonElement>(".sparql-run")?.click();

    await vi.waitFor(() => {
      expect(drawer.shadowRoot?.querySelector(".sparql-summary")?.textContent)
        .toBe("Showing 1 to 25 of 30 results");
    }, { timeout: 10_000 });
    const root = drawer.shadowRoot!;
    expect(root.querySelector(".sparql-safety")?.textContent).toBe("Local dataset · Read-only");
    expect(root.querySelectorAll(".sparql-table tbody tr")).toHaveLength(25);
    expect(root.querySelector(".sparql-page-status")?.textContent).toBe("Page 1 of 2");
    expect(root.querySelector<HTMLButtonElement>(".sparql-page-button:first-of-type")?.disabled).toBe(true);

    const buttons = root.querySelectorAll<HTMLButtonElement>(".sparql-page-button");
    buttons[1]?.click();
    expect(root.querySelector(".sparql-summary")?.textContent).toBe("Showing 26 to 30 of 30 results");
    expect(root.querySelectorAll(".sparql-table tbody tr")).toHaveLength(5);
    expect(root.querySelector(".sparql-page-status")?.textContent).toBe("Page 2 of 2");
    expect(buttons[1]?.disabled).toBe(true);

    const pageSize = root.querySelector<HTMLSelectElement>(".sparql-page-size")!;
    pageSize.value = "10";
    pageSize.dispatchEvent(new Event("change", { bubbles: true }));
    expect(root.querySelector(".sparql-summary")?.textContent).toBe("Showing 21 to 30 of 30 results");
    expect(root.querySelectorAll(".sparql-table tbody tr")).toHaveLength(10);
    expect(root.querySelector(".sparql-page-status")?.textContent).toBe("Page 3 of 3");
  });

  it("observes semantic document changes and replaces only changed query results by default", async () => {
    const drawer = mountRdfNavigator();
    drawer.shadowRoot?.querySelector<HTMLButtonElement>('[data-view="sparql"]')?.click();
    const editor = drawer.shadowRoot?.querySelector<HTMLTextAreaElement>(".sparql-editor")!;
    editor.value = "SELECT ?person ?name WHERE { ?person <https://schema.org/name> ?name }";
    editor.dispatchEvent(new Event("input", { bubbles: true }));
    drawer.shadowRoot?.querySelector<HTMLButtonElement>(".sparql-run")?.click();

    await vi.waitFor(() => {
      expect(drawer.shadowRoot?.querySelector(".sparql-output")?.textContent).toContain("Alice");
    }, { timeout: 10_000 });
    const root = drawer.shadowRoot!;
    const observe = root.querySelector<HTMLInputElement>(".sparql-observe-input")!;
    const output = root.querySelector<HTMLElement>(".sparql-output")!;
    const initialTable = output.querySelector("table");
    expect(observe.checked).toBe(true);

    const unrelated = document.createElement("data");
    unrelated.value = "42";
    unrelated.setAttribute("rdf-subject", "https://example.com/bob");
    unrelated.setAttribute("rdf-predicate", "https://schema.org/age");
    unrelated.setAttribute("rdf-datatype", "http://www.w3.org/2001/XMLSchema#integer");
    document.body.append(unrelated);
    await vi.waitFor(() => {
      expect(root.querySelector(".launcher .count")?.textContent).toBe("2");
    });
    expect(root.querySelector(".sparql-output")).toBe(output);
    expect(output.querySelector("table")).toBe(initialTable);

    document.body.querySelector("span")!.textContent = "Alicia";
    await vi.waitFor(() => {
      expect(output.textContent).toContain("Alicia");
    }, { timeout: 10_000 });
    expect(root.querySelector(".sparql-output")).toBe(output);
    expect(output.querySelector("table")).not.toBe(initialTable);

    observe.checked = false;
    observe.dispatchEvent(new Event("change", { bubbles: true }));
    document.body.querySelector("span")!.textContent = "Alina";
    const anotherUnrelated = document.createElement("data");
    anotherUnrelated.value = "true";
    anotherUnrelated.setAttribute("rdf-subject", "https://example.com/bob");
    anotherUnrelated.setAttribute("rdf-predicate", "https://schema.org/active");
    anotherUnrelated.setAttribute("rdf-datatype", "http://www.w3.org/2001/XMLSchema#boolean");
    document.body.append(anotherUnrelated);
    await vi.waitFor(() => {
      expect(root.querySelector(".launcher .count")?.textContent).toBe("3");
    });
    expect(output.textContent).toContain("Alicia");
    expect(output.textContent).not.toContain("Alina");

    observe.checked = true;
    observe.dispatchEvent(new Event("change", { bubbles: true }));
    await vi.waitFor(() => {
      expect(output.textContent).toContain("Alina");
    }, { timeout: 10_000 });
  }, 15_000);

  it("syntax-highlights SPARQL while keeping the native editor softly wrapped", () => {
    const drawer = mountRdfNavigator();
    drawer.shadowRoot?.querySelector<HTMLButtonElement>('[data-view="sparql"]')?.click();
    const root = drawer.shadowRoot!;
    const editor = root.querySelector<HTMLTextAreaElement>(".sparql-editor")!;
    const highlight = root.querySelector<HTMLElement>(".sparql-highlight")!;

    expect(root.querySelector(".sparql-editor-shell")).not.toBeNull();
    expect(editor.wrap).toBe("soft");
    expect(highlight.getAttribute("aria-hidden")).toBe("true");
    expect(highlight.querySelector(".tok.keyword")?.textContent).toBe("SELECT");
    expect(highlight.querySelector(".tok.variable")?.textContent).toBe("?subject");
    expect(highlight.querySelector("a")).toBeNull();

    editor.value = [
      "PREFIX schema: <https://schema.org/>",
      "SELECT ?person WHERE {",
      "  ?person schema:name \"A deliberately long value that must remain inside the editor surface\" .",
      "  # A query comment",
      "}",
    ].join("\n");
    editor.dispatchEvent(new Event("input", { bubbles: true }));

    expect(highlight.textContent).toBe(editor.value);
    expect(highlight.querySelector(".tok.name")?.textContent).toBe("schema:");
    expect(highlight.querySelector(".tok.iri")?.textContent).toBe("<https://schema.org/>");
    expect(highlight.querySelector(".tok.string")?.textContent).toContain("deliberately long value");
    expect(highlight.querySelector(".tok.comment")?.textContent).toBe("# A query comment");

    editor.scrollTop = 24;
    editor.scrollLeft = 18;
    editor.dispatchEvent(new Event("scroll"));
    expect(highlight.scrollTop).toBe(24);
    expect(editor.scrollLeft).toBe(0);

    const css = root.querySelector("style")?.textContent ?? "";
    expect(css).toContain("caret-color: var(--ink)");
    expect(css).toContain(".sparql-highlight code { font: inherit; }");
    expect(css).toContain("overflow-x: hidden");
    expect(css).toContain("position: relative");
    expect(css).toContain("white-space: pre-wrap");
    expect(css).toContain("z-index: 1");
  });

  it("discovers SHACL-described suggested queries without document-specific configuration", async () => {
    document.body.insertAdjacentHTML("beforeend", `
      <div hidden>
        <a rdf-subject="#people-query" rdf-predicate="http://www.w3.org/1999/02/22-rdf-syntax-ns#type" href="http://www.w3.org/ns/shacl#SPARQLExecutable"></a>
        <a rdf-subject="#people-query" rdf-predicate="http://www.w3.org/1999/02/22-rdf-syntax-ns#type" href="http://www.w3.org/ns/shacl#SPARQLSelectExecutable"></a>
        <span rdf-subject="#people-query" rdf-predicate="http://www.w3.org/2000/01/rdf-schema#label">People and names</span>
        <span rdf-subject="#people-query" rdf-predicate="http://purl.org/dc/terms/description">Find named people in the current dataset.</span>
        <code rdf-subject="#people-query" rdf-predicate="http://www.w3.org/ns/shacl#select">SELECT ?person ?name WHERE { ?person &lt;https://schema.org/name&gt; ?name }</code>
      </div>`);
    const drawer = mountRdfNavigator();
    expect(drawer.shadowRoot?.querySelector('[data-view="sparql"]')?.textContent).toBe("SPARQL (1)");
    drawer.shadowRoot?.querySelector<HTMLButtonElement>('[data-view="sparql"]')?.click();

    const select = drawer.shadowRoot?.querySelector<HTMLSelectElement>(".sparql-suggestion")!;
    expect(Array.from(select.options).map(({ textContent }) => textContent)).toEqual(["Custom query", "People and names"]);
    expect(select.labels?.[0]?.textContent).toBe("Suggested query");
    expect(select.labels?.[0]?.contains(drawer.shadowRoot?.querySelector(".sparql-description") ?? null)).toBe(false);
    select.value = Array.from(select.options).find(({ textContent }) => textContent === "People and names")!.value;
    select.dispatchEvent(new Event("change", { bubbles: true }));
    expect(drawer.shadowRoot?.querySelector<HTMLTextAreaElement>(".sparql-editor")?.value).toContain("SELECT ?person ?name");
    expect(drawer.shadowRoot?.querySelector(".sparql-description")?.textContent).toContain("current dataset");

    drawer.shadowRoot?.querySelector<HTMLButtonElement>(".sparql-run")?.click();
    await vi.waitFor(() => {
      expect(drawer.shadowRoot?.querySelector(".sparql-output")?.textContent).toContain("Alice");
    }, { timeout: 10_000 });
  });

  it("refuses SPARQL Update before it can mutate the document dataset", async () => {
    const drawer = mountRdfNavigator();
    drawer.shadowRoot?.querySelector<HTMLButtonElement>('[data-view="sparql"]')?.click();
    const editor = drawer.shadowRoot?.querySelector<HTMLTextAreaElement>(".sparql-editor")!;
    editor.value = 'INSERT DATA { <https://example.com/alice> <https://schema.org/name> "Changed" }';
    editor.dispatchEvent(new Event("input", { bubbles: true }));
    drawer.shadowRoot?.querySelector<HTMLButtonElement>(".sparql-run")?.click();

    await vi.waitFor(() => {
      expect(drawer.shadowRoot?.querySelector(".sparql-status")?.textContent).toContain("SPARQL Update is disabled");
    }, { timeout: 10_000 });
    expect(document.body.textContent).toContain("Alice");
    expect(document.body.textContent).not.toContain("Changed");
  });

  it("shows Discovery only when candidates exist and explicitly loads HTML/RDF contributions", async () => {
    const canonical = document.createElement("link");
    canonical.rel = "canonical";
    canonical.href = "https://example.com/report";
    document.head.append(canonical);
    document.body.innerHTML = '<a href="https://example.com/evidence" rdf-subject="#claim" rdf-predicate="http://www.w3.org/2000/01/rdf-schema#seeAlso">Evidence</a>';
    const originalFetch = window.fetch;
    const fetchMock = vi.fn().mockResolvedValue({
      headers: { get: (name: string) => name.toLowerCase() === "content-type" ? "text/html; charset=utf-8" : null },
      ok: true,
      status: 200,
      text: () => Promise.resolve(`<!doctype html><html rdf-version="1.2"><head><link rel="canonical" href="https://example.com/evidence"></head><body><span id="fact" rdf-predicate="https://schema.org/name">Evidence set</span></body></html>`),
      url: "http://localhost:3000/evidence",
    } as unknown as Response);
    Object.defineProperty(window, "fetch", { configurable: true, value: fetchMock });
    try {
      const drawer = mountRdfNavigator();
      const tabs = Array.from(drawer.shadowRoot?.querySelectorAll<HTMLButtonElement>('[role="tab"]') ?? []);
      expect(tabs.map((tab) => tab.textContent)).toEqual(["Navigator", "Discovery (1)", "SPARQL", "Turtle", "JSON-LD"]);

      drawer.shadowRoot?.querySelector<HTMLButtonElement>('[data-view="discovery"]')?.click();
      const target = drawer.shadowRoot?.querySelector<HTMLAnchorElement>('.discovery-target');
      expect(target?.href).toBe("https://example.com/evidence");
      expect(target?.target).toBe("_blank");
      drawer.shadowRoot?.querySelector<HTMLButtonElement>('.discovery-action')?.click();

      await vi.waitFor(() => {
        expect(drawer.shadowRoot?.querySelector('.discovery-status')?.textContent).toBe("1 statement loaded");
      });
      expect(fetchMock).toHaveBeenCalledWith(
        "http://localhost:3000/evidence",
        expect.objectContaining({ credentials: "omit", redirect: "follow", referrerPolicy: "no-referrer" }),
      );
      expect(drawer.shadowRoot?.querySelector('.launcher .count')?.textContent).toBe("2");

      drawer.shadowRoot?.querySelector<HTMLButtonElement>('[data-view="turtle"]')?.click();
      expect(drawer.shadowRoot?.querySelector("pre")?.textContent).toContain("<https://example.com/evidence> {");
      expect(drawer.shadowRoot?.querySelector("pre")?.textContent).toContain('schema:name "Evidence set"');

      drawer.shadowRoot?.querySelector<HTMLButtonElement>('[data-view="discovery"]')?.click();
      drawer.shadowRoot?.querySelector<HTMLButtonElement>('.discovery-action')?.click();
      expect(drawer.shadowRoot?.querySelector('.launcher .count')?.textContent).toBe("1");
    } finally {
      Object.defineProperty(window, "fetch", { configurable: true, value: originalFetch });
    }
  });

  it("shows a document vocabulary tree and correlates local definitions", () => {
    const canonical = document.createElement("link");
    canonical.rel = "canonical";
    canonical.href = "https://example.com/vocabulary";
    document.head.append(canonical);
    document.body.innerHTML = [
      '<section id="Entity"><a href="http://www.w3.org/2002/07/owl#Class" rdf-subject="#Entity" rdf-predicate="http://www.w3.org/1999/02/22-rdf-syntax-ns#type">Class</a><span rdf-subject="#Entity" rdf-predicate="http://www.w3.org/2000/01/rdf-schema#label">Entity</span></section>',
      '<section id="Agent"><a href="http://www.w3.org/2002/07/owl#Class" rdf-subject="#Agent" rdf-predicate="http://www.w3.org/1999/02/22-rdf-syntax-ns#type">Class</a><a href="#Entity" rdf-subject="#Agent" rdf-predicate="http://www.w3.org/2000/01/rdf-schema#subClassOf">Entity</a><span rdf-subject="#Agent" rdf-predicate="http://www.w3.org/2000/01/rdf-schema#label">Agent</span></section>',
      '<section id="knows"><a href="http://www.w3.org/2002/07/owl#ObjectProperty" rdf-subject="#knows" rdf-predicate="http://www.w3.org/1999/02/22-rdf-syntax-ns#type">Object property</a><span rdf-subject="#knows" rdf-predicate="http://www.w3.org/2000/01/rdf-schema#label">knows</span></section>',
    ].join("");
    const agent = document.getElementById("Agent")!;
    const cancel = vi.fn();
    agent.scrollIntoView = vi.fn();
    agent.animate = vi.fn(() => ({ cancel } as unknown as Animation));

    const drawer = mountRdfNavigator();
    const tabs = Array.from(drawer.shadowRoot?.querySelectorAll<HTMLButtonElement>('[role="tab"]') ?? []);
    expect(tabs.map((tab) => tab.textContent)).toEqual(["Navigator", "Vocabulary (3)", "SPARQL", "Turtle", "JSON-LD"]);
    drawer.shadowRoot?.querySelector<HTMLButtonElement>('[data-view="vocabulary"]')?.click();

    const sections = Array.from(drawer.shadowRoot?.querySelectorAll<HTMLElement>(".ontology-section") ?? []);
    expect(sections.map((section) => section.querySelector("h3")?.textContent)).toEqual(["Classes", "Properties"]);
    expect(sections.map((section) => section.querySelector(".ontology-count")?.textContent)).toEqual(["2 defined", "1 defined"]);
    const agentRow = drawer.shadowRoot?.querySelector<HTMLElement>('.ontology-term-row[data-term="https://example.com/vocabulary#Agent"]')!;
    expect(agentRow.querySelector(".ontology-label")?.textContent).toBe("Agent");
    expect(agentRow.closest(".ontology-children")).not.toBeNull();
    expect(agentRow.querySelector<HTMLAnchorElement>(".term-link")?.classList.contains("local-term")).toBe(true);

    agentRow.dispatchEvent(new Event("pointerenter"));
    expect(agent.animate).toHaveBeenCalledOnce();
    agentRow.dispatchEvent(new Event("pointerleave"));
    expect(cancel).toHaveBeenCalledOnce();
    agent.dispatchEvent(new Event("pointerenter"));
    expect(agentRow.classList.contains("is-corresponding")).toBe(true);
    agent.dispatchEvent(new Event("pointerleave"));
    expect(agentRow.classList.contains("is-corresponding")).toBe(false);

    agentRow.querySelector<HTMLButtonElement>(".ontology-locate-button")?.click();
    expect(agent.scrollIntoView).toHaveBeenCalledOnce();
    expect(agent.animate).toHaveBeenCalledTimes(2);
  });

  it("compacts tabs progressively without exposing a horizontal scroller", () => {
    const originalClientWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "clientWidth");
    const originalScrollWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "scrollWidth");
    let availableWidth = 300;
    Object.defineProperty(HTMLElement.prototype, "clientWidth", {
      configurable: true,
      get() {
        if (this.classList.contains("tabs")) return availableWidth;
        return originalClientWidth?.get?.call(this) ?? 0;
      },
    });
    Object.defineProperty(HTMLElement.prototype, "scrollWidth", {
      configurable: true,
      get() {
        if (this.classList.contains("tabs")) return [500, 380, 280, 120][Number(this.dataset.compact ?? 0)] ?? 500;
        return originalScrollWidth?.get?.call(this) ?? 0;
      },
    });
    try {
      const canonical = document.createElement("link");
      canonical.rel = "canonical";
      canonical.href = "https://example.com/vocabulary";
      document.head.append(canonical);
      document.body.innerHTML = [
        '<a href="http://www.w3.org/2002/07/owl#Class" rdf-subject="#Entity" rdf-predicate="http://www.w3.org/1999/02/22-rdf-syntax-ns#type">Class</a>',
        '<a href="https://example.com/more" rdf-subject="" rdf-predicate="http://www.w3.org/2000/01/rdf-schema#seeAlso">More</a>',
      ].join("");
      const drawer = mountRdfNavigator();
      let tabs = drawer.shadowRoot?.querySelector<HTMLElement>(".tabs")!;
      expect(tabs.dataset.compact).toBe("2");
      expect(drawer.shadowRoot?.querySelector("style")?.textContent).toMatch(/\.tabs \{[^}]*overflow: hidden/);
      expect(tabs.querySelector('[data-view="vocabulary"]')?.getAttribute("aria-label")).toBe("Vocabulary (1)");
      expect(tabs.querySelector('[data-view="vocabulary"]')?.getAttribute("title")).toBe("Vocabulary, 1 definition");

      availableWidth = 150;
      drawer.refresh();
      tabs = drawer.shadowRoot?.querySelector<HTMLElement>(".tabs")!;
      expect(tabs.dataset.compact).toBe("3");
      expect(tabs.querySelector<HTMLElement>(".tab-icon svg")).not.toBeNull();

      availableWidth = 600;
      drawer.refresh();
      tabs = drawer.shadowRoot?.querySelector<HTMLElement>(".tabs")!;
      expect(tabs.dataset.compact).toBe("0");
    } finally {
      if (originalClientWidth) Object.defineProperty(HTMLElement.prototype, "clientWidth", originalClientWidth);
      else delete (HTMLElement.prototype as unknown as { clientWidth?: number }).clientWidth;
      if (originalScrollWidth) Object.defineProperty(HTMLElement.prototype, "scrollWidth", originalScrollWidth);
      else delete (HTMLElement.prototype as unknown as { scrollWidth?: number }).scrollWidth;
    }
  });

  it("does not fail when a tab container is unavailable during a redraw", () => {
    const drawer = mountRdfNavigator();
    const root = drawer.shadowRoot!;
    const querySelector = root.querySelector.bind(root);
    root.querySelector = ((selectors: string) => (
      selectors === ".tabs" ? null : querySelector(selectors)
    )) as typeof root.querySelector;

    expect(() => drawer.refresh()).not.toThrow();
  });

  it("distinguishes pointer and keyboard focus when opening the drawer", async () => {
    const drawer = mountClosedRdfNavigator();
    drawer.shadowRoot?.querySelector<HTMLButtonElement>(".launcher")
      ?.dispatchEvent(new MouseEvent("click", { bubbles: true, detail: 1 }));
    await Promise.resolve();
    expect(drawer.shadowRoot?.activeElement).toBe(drawer.shadowRoot?.querySelector(".panel"));

    drawer.close();
    await Promise.resolve();
    drawer.shadowRoot?.querySelector<HTMLButtonElement>(".launcher")
      ?.dispatchEvent(new MouseEvent("click", { bubbles: true, detail: 0 }));
    await Promise.resolve();
    expect(drawer.shadowRoot?.activeElement).toBe(drawer.shadowRoot?.querySelector('.tab[aria-selected="true"]'));
  });

  it("defers the extracted view until first open, then reuses it", () => {
    const drawer = mountClosedRdfNavigator();

    expect(drawer.shadowRoot?.querySelector(".quad")).toBeNull();
    drawer.open();
    const row = drawer.shadowRoot?.querySelector(".quad");
    const openedPanel = drawer.shadowRoot?.querySelector<HTMLElement>(".panel");
    const openedLauncher = drawer.shadowRoot?.querySelector(".launcher");
    expect(row).not.toBeNull();
    expect(openedPanel?.dataset.open).toBe("true");
    expect(openedLauncher?.getAttribute("aria-expanded")).toBe("true");

    drawer.close();
    expect(drawer.shadowRoot?.querySelector(".quad")).toBe(row);
    expect(drawer.shadowRoot?.querySelector<HTMLElement>(".panel")?.dataset.open).toBe("false");
    expect(drawer.shadowRoot?.querySelector(".launcher")?.getAttribute("aria-expanded")).toBe("false");
  });

  it("prepares contextual analysis during idle time without rendering the closed view", () => {
    let idleCallback: IdleRequestCallback | undefined;
    const originalRequestIdleCallback = window.requestIdleCallback;
    const originalCancelIdleCallback = window.cancelIdleCallback;
    window.requestIdleCallback = vi.fn((callback: IdleRequestCallback) => {
      idleCallback = callback;
      return 17;
    });
    window.cancelIdleCallback = vi.fn();

    try {
      const drawer = mountClosedRdfNavigator();
      expect(window.requestIdleCallback).toHaveBeenCalledWith(expect.any(Function), { timeout: 1_000 });
      expect(drawer.shadowRoot?.querySelector(".quad")).toBeNull();

      idleCallback?.({
        didTimeout: false,
        timeRemaining: () => 12,
      });
      expect(drawer.shadowRoot?.querySelector(".quad")).toBeNull();

      drawer.open();
      expect(drawer.shadowRoot?.querySelector(".quad")).not.toBeNull();
      expect(window.cancelIdleCallback).not.toHaveBeenCalledWith(17);
    } finally {
      window.requestIdleCallback = originalRequestIdleCallback;
      window.cancelIdleCallback = originalCancelIdleCallback;
    }
  });

  it("moves the RDF launcher freely, snaps near viewport edges, and preserves its position", async () => {
    const drawer = mountClosedRdfNavigator();
    const launcher = drawer.shadowRoot?.querySelector<HTMLElement>(".launcher")!;
    launcher.getBoundingClientRect = () => {
      const left = Number.parseFloat(launcher.style.left) || 920;
      const top = Number.parseFloat(launcher.style.top) || 700;
      const width = 84;
      const height = 44;
      return { bottom: top + height, height, left, right: left + width, top, width, x: left, y: top, toJSON: () => ({}) } as DOMRect;
    };

    launcher.dispatchEvent(new MouseEvent("pointerdown", { bubbles: true, button: 0, clientX: 940, clientY: 720 }));
    window.dispatchEvent(new MouseEvent("pointermove", { clientX: 540, clientY: 420 }));
    window.dispatchEvent(new MouseEvent("pointerup"));
    launcher.click();

    expect(Number.parseFloat(launcher.style.left)).toBe(520);
    expect(Number.parseFloat(launcher.style.top)).toBe(400);
    expect(drawer.shadowRoot?.querySelector<HTMLElement>(".panel")?.dataset.open).toBe("false");

    launcher.dispatchEvent(new MouseEvent("pointerdown", { bubbles: true, button: 0, clientX: 540, clientY: 420 }));
    window.dispatchEvent(new MouseEvent("pointermove", { clientX: 30, clientY: 420 }));
    window.dispatchEvent(new MouseEvent("pointerup"));
    expect(Number.parseFloat(launcher.style.left)).toBe(20);
    expect(Number.parseFloat(launcher.style.top)).toBe(400);

    launcher.dispatchEvent(new MouseEvent("pointerdown", { bubbles: true, button: 0, clientX: 40, clientY: 420 }));
    window.dispatchEvent(new MouseEvent("pointermove", { clientX: 930, clientY: 730 }));
    window.dispatchEvent(new MouseEvent("pointerup"));
    expect(Number.parseFloat(launcher.style.left)).toBe(920);
    expect(Number.parseFloat(launcher.style.top)).toBe(704);

    launcher.dispatchEvent(new MouseEvent("pointerdown", { bubbles: true, button: 0, clientX: 940, clientY: 724 }));
    window.dispatchEvent(new MouseEvent("pointermove", { clientX: 940, clientY: 40 }));
    window.dispatchEvent(new MouseEvent("pointerup"));
    expect(Number.parseFloat(launcher.style.left)).toBe(920);
    expect(Number.parseFloat(launcher.style.top)).toBe(20);

    const stored = JSON.parse(sessionStorage.getItem(SESSION_STATE_KEY)!) as {
      launcherPosition: { x: number; y: number };
    };
    expect(stored.launcherPosition).toEqual({ x: 920, y: 20 });

    drawer.refresh();
    const restoredLauncher = drawer.shadowRoot?.querySelector<HTMLElement>(".launcher")!;
    expect(Number.parseFloat(restoredLauncher.style.left)).toBe(920);
    expect(Number.parseFloat(restoredLauncher.style.top)).toBe(20);

    await new Promise((resolve) => window.setTimeout(resolve, 0));
    restoredLauncher.click();
    expect(drawer.shadowRoot?.querySelector<HTMLElement>(".panel")?.dataset.open).toBe("true");
  });

  it("derives mirrored or floating placement when a side-attached launcher is moved", () => {
    const cases = [
      { from: "right", targetLeft: 20, to: "left" },
      { from: "right-top", targetLeft: 20, to: "left-top" },
      { from: "right-bottom", targetLeft: 20, to: "left-bottom" },
      { from: "left", targetLeft: 920, to: "right" },
      { from: "left-top", targetLeft: 920, to: "right-top" },
      { from: "left-bottom", targetLeft: 920, to: "right-bottom" },
      { from: "right-top", targetLeft: 470, to: "floating" },
      { from: "left-bottom", targetLeft: 470, to: "floating" },
    ] as const;

    for (const { from, targetLeft, to } of cases) {
      sessionStorage.removeItem(SESSION_STATE_KEY);
      const drawer = mountClosedRdfNavigator();
      drawer.shadowRoot?.querySelector<HTMLButtonElement>(`.position-option[data-position="${from}"]`)?.click();
      const launcher = drawer.shadowRoot?.querySelector<HTMLElement>(".launcher")!;
      const startLeft = from.startsWith("left") ? 20 : 920;
      launcher.getBoundingClientRect = () => {
        const left = Number.parseFloat(launcher.style.left) || startLeft;
        const top = Number.parseFloat(launcher.style.top) || 700;
        const width = 84;
        const height = 44;
        return { bottom: top + height, height, left, right: left + width, top, width, x: left, y: top, toJSON: () => ({}) } as DOMRect;
      };

      launcher.dispatchEvent(new MouseEvent("pointerdown", {
        bubbles: true,
        button: 0,
        clientX: startLeft + 20,
        clientY: 720,
      }));
      window.dispatchEvent(new MouseEvent("pointermove", {
        clientX: targetLeft + 20,
        clientY: 720,
      }));
      window.dispatchEvent(new MouseEvent("pointerup"));

      expect(drawer.shadowRoot?.querySelector<HTMLElement>(".panel")?.dataset.position, `${from} → ${to}`).toBe(to);
      expect(drawer.shadowRoot?.querySelector<HTMLElement>(".launcher")?.dataset.position, `${from} → ${to}`).toBe(to);
      expect(drawer.shadowRoot?.querySelector<HTMLButtonElement>('.position-option[aria-checked="true"]')?.dataset.position, `${from} → ${to}`).toBe(to);
      expect(JSON.parse(sessionStorage.getItem(SESSION_STATE_KEY)!).position, `${from} → ${to}`).toBe(to);
      drawer.remove();
    }
  });

  it("reattaches a floating navigator at an edge while preserving its last side layout", () => {
    const drawer = mountClosedRdfNavigator();
    drawer.shadowRoot?.querySelector<HTMLButtonElement>('.position-option[data-position="right-top"]')?.click();
    const launcher = drawer.shadowRoot?.querySelector<HTMLElement>(".launcher")!;
    launcher.getBoundingClientRect = () => {
      const left = Number.parseFloat(launcher.style.left) || 920;
      const top = Number.parseFloat(launcher.style.top) || 700;
      const width = 84;
      const height = 44;
      return { bottom: top + height, height, left, right: left + width, top, width, x: left, y: top, toJSON: () => ({}) } as DOMRect;
    };
    const dragTo = (targetLeft: number): void => {
      const startLeft = launcher.getBoundingClientRect().left;
      launcher.dispatchEvent(new MouseEvent("pointerdown", {
        bubbles: true,
        button: 0,
        clientX: startLeft + 20,
        clientY: 720,
      }));
      window.dispatchEvent(new MouseEvent("pointermove", {
        clientX: targetLeft + 20,
        clientY: 720,
      }));
      window.dispatchEvent(new MouseEvent("pointerup"));
    };
    const currentPosition = (): string | undefined =>
      drawer.shadowRoot?.querySelector<HTMLElement>(".panel")?.dataset.position;

    dragTo(470);
    expect(currentPosition()).toBe("floating");
    expect(JSON.parse(sessionStorage.getItem(SESSION_STATE_KEY)!).lastSidePosition).toBe("right-top");

    dragTo(20);
    expect(currentPosition()).toBe("left-top");

    dragTo(470);
    expect(currentPosition()).toBe("floating");

    dragTo(920);
    expect(currentPosition()).toBe("right-top");
  });

  it("opens on a requested side and reveals one carrier in the Navigator", async () => {
    document.body.innerHTML = [
      '<span id="alice" rdf-subject="https://example.com/alice" rdf-predicate="https://schema.org/name">Alice</span>',
      '<span rdf-subject="https://example.com/bob" rdf-predicate="https://schema.org/name">Bob</span>',
    ].join("");
    const alice = document.querySelector("#alice")!;
    const originalScrollIntoView = HTMLElement.prototype.scrollIntoView;
    const scrollIntoView = vi.fn();
    Object.defineProperty(HTMLElement.prototype, "scrollIntoView", { configurable: true, value: scrollIntoView });
    try {
      const drawer = mountClosedRdfNavigator();
      expect(drawer.revealSource(alice, "left")).toBe(true);
      await Promise.resolve();

      const panel = drawer.shadowRoot?.querySelector<HTMLElement>(".panel");
      const launcher = drawer.shadowRoot?.querySelector<HTMLElement>(".launcher");
      const rows = Array.from(drawer.shadowRoot?.querySelectorAll<HTMLElement>(".quad") ?? []);
      const selectedRows = rows.filter((row) => row.classList.contains("is-corresponding"));
      expect(panel?.dataset.open).toBe("true");
      expect(panel?.dataset.position).toBe("left");
      expect(launcher?.dataset.position).toBe("left");
      expect(drawer.shadowRoot?.querySelector('.position-option[data-position="left"]')?.getAttribute("aria-checked")).toBe("true");
      expect(selectedRows).toHaveLength(1);
      expect(selectedRows[0]?.textContent).toContain("Alice");
      expect(drawer.shadowRoot?.activeElement).toBe(selectedRows[0]);
      expect(scrollIntoView).toHaveBeenCalledWith({ block: "center" });
      expect(drawer.revealSource(document.body, "left")).toBe(false);
    } finally {
      if (originalScrollIntoView) {
        Object.defineProperty(HTMLElement.prototype, "scrollIntoView", { configurable: true, value: originalScrollIntoView });
      } else {
        delete (HTMLElement.prototype as unknown as { scrollIntoView?: typeof HTMLElement.prototype.scrollIntoView }).scrollIntoView;
      }
    }
  });

  it("keeps resource links inert on hover", () => {
    vi.useFakeTimers();
    try {
      const drawer = mountRdfNavigator();
      const predicate = drawer.shadowRoot?.querySelector<HTMLAnchorElement>('.navigator .predicate a[href="https://schema.org/name"]')!;
      predicate.dispatchEvent(new MouseEvent("pointerenter", { bubbles: true, clientX: 180, clientY: 220 }));
      predicate.dispatchEvent(new MouseEvent("pointermove", { bubbles: true, clientX: 220, clientY: 240 }));
      predicate.dispatchEvent(new Event("pointerleave"));
      vi.advanceTimersByTime(30_000);
      expect(drawer.shadowRoot?.querySelector(".resource-preview")).toBeNull();
    } finally {
      vi.useRealTimers();
    }
  });

  it("does not intercept local or canonical document links", () => {
    document.body.innerHTML = '<span id="alice" rdf-predicate="https://schema.org/name">Alice</span>';
    const alice = document.getElementById("alice")!;
    alice.scrollIntoView = vi.fn();
    const canonical = document.createElement("link");
    canonical.rel = "canonical";
    canonical.href = "https://ia2.dev/spec/html-rdf";
    document.head.append(canonical);
    const drawer = mountRdfNavigator();
    const localTerms = Array.from(
      drawer.shadowRoot?.querySelectorAll<HTMLAnchorElement>("a.term-link.local-term") ?? []
    );

    expect(localTerms.length).toBeGreaterThan(0);
    for (const term of localTerms) {
      term.dispatchEvent(new MouseEvent("click", { bubbles: true, button: 0, cancelable: true }));
      expect(drawer.shadowRoot?.querySelector(".resource-preview")).toBeNull();
    }

    drawer.shadowRoot?.querySelector<HTMLButtonElement>('[data-view="turtle"]')?.click();
    const canonicalIri = drawer.shadowRoot?.querySelector<HTMLAnchorElement>(
      'a.tok.iri[href^="https://ia2.dev/spec/html-rdf"]'
    );
    expect(canonicalIri).not.toBeNull();
    canonicalIri?.dispatchEvent(new MouseEvent("click", { bubbles: true, button: 0, cancelable: true }));
    expect(drawer.shadowRoot?.querySelector(".resource-preview")).toBeNull();
  });

  it("opens predicates in a movable, eight-way resizable definition window", () => {
    const drawer = mountRdfNavigator();
    const predicate = drawer.shadowRoot?.querySelector<HTMLAnchorElement>('.navigator .predicate a[href="https://schema.org/name"]')!;
    predicate.click();
    const preview = drawer.shadowRoot?.querySelector<HTMLElement>(".resource-preview")!;
    const frame = preview.querySelector<HTMLIFrameElement>(".resource-preview-frame")!;
    const bar = preview.querySelector<HTMLElement>(".resource-preview-bar")!;
    const resizeHandles = Array.from(preview.querySelectorAll<HTMLElement>(".resize-handle"));
    const southeastResize = preview.querySelector<HTMLElement>('[data-resize="se"]')!;
    const northwestResize = preview.querySelector<HTMLElement>('[data-resize="nw"]')!;
    const close = preview.querySelector<HTMLButtonElement>(".resource-preview-close")!;
    expect(preview.getAttribute("role")).toBe("dialog");
    expect(preview.dataset.previewKind).toBe("definition");
    expect(Number.parseFloat(preview.style.width)).toBe(620);
    expect(Number.parseFloat(preview.style.height)).toBe(520);
    expect(frame.tabIndex).toBe(0);
    expect(resizeHandles.map((handle) => handle.dataset.resize)).toEqual(["n", "ne", "e", "se", "s", "sw", "w", "nw"]);

    preview.getBoundingClientRect = () => {
      const left = Number.parseFloat(preview.style.left);
      const top = Number.parseFloat(preview.style.top);
      const width = Number.parseFloat(preview.style.width);
      const height = Number.parseFloat(preview.style.height);
      return { bottom: top + height, height, left, right: left + width, top, width, x: left, y: top, toJSON: () => ({}) } as DOMRect;
    };
    const startLeft = Number.parseFloat(preview.style.left);
    const startTop = Number.parseFloat(preview.style.top);
    bar.dispatchEvent(new MouseEvent("pointerdown", { bubbles: true, button: 0, clientX: 100, clientY: 100 }));
    window.dispatchEvent(new MouseEvent("pointermove", { clientX: 130, clientY: 125 }));
    window.dispatchEvent(new MouseEvent("pointerup"));
    expect(Number.parseFloat(preview.style.left)).toBe(startLeft + 30);
    expect(Number.parseFloat(preview.style.top)).toBe(startTop + 25);

    const startWidth = Number.parseFloat(preview.style.width);
    const startHeight = Number.parseFloat(preview.style.height);
    southeastResize.dispatchEvent(new MouseEvent("pointerdown", { bubbles: true, button: 0, clientX: 300, clientY: 300 }));
    window.dispatchEvent(new MouseEvent("pointermove", { clientX: 340, clientY: 325 }));
    window.dispatchEvent(new MouseEvent("pointerup"));
    expect(Number.parseFloat(preview.style.width)).toBe(startWidth + 40);
    expect(Number.parseFloat(preview.style.height)).toBe(startHeight + 25);

    const resizedLeft = Number.parseFloat(preview.style.left);
    const resizedTop = Number.parseFloat(preview.style.top);
    const resizedWidth = Number.parseFloat(preview.style.width);
    const resizedHeight = Number.parseFloat(preview.style.height);
    northwestResize.dispatchEvent(new MouseEvent("pointerdown", { bubbles: true, button: 0, clientX: 300, clientY: 300 }));
    window.dispatchEvent(new MouseEvent("pointermove", { clientX: 320, clientY: 315 }));
    window.dispatchEvent(new MouseEvent("pointerup"));
    expect(Number.parseFloat(preview.style.left)).toBe(resizedLeft + 20);
    expect(Number.parseFloat(preview.style.top)).toBe(resizedTop + 15);
    expect(Number.parseFloat(preview.style.width)).toBe(resizedWidth - 20);
    expect(Number.parseFloat(preview.style.height)).toBe(resizedHeight - 15);

    preview.dispatchEvent(new Event("pointerleave"));
    expect(drawer.shadowRoot?.querySelector(".resource-preview")).toBe(preview);
    close.click();
    expect(drawer.shadowRoot?.querySelector(".resource-preview")).toBeNull();
  });

  it("opens non-predicate terms in a larger centered resource window", () => {
    const drawer = mountRdfNavigator();
    const subject = drawer.shadowRoot?.querySelector<HTMLAnchorElement>('.navigator .subject a[href="https://example.com/alice"]')!;
    subject.click();
    const preview = drawer.shadowRoot?.querySelector<HTMLElement>(".resource-preview")!;
    const width = Number.parseFloat(preview.style.width);
    const height = Number.parseFloat(preview.style.height);
    expect(preview.dataset.previewKind).toBe("resource");
    expect(width).toBeGreaterThan(620);
    expect(height).toBeGreaterThan(520);
    expect(Number.parseFloat(preview.style.left)).toBe(Math.round((window.innerWidth - width) / 2));
    expect(Number.parseFloat(preview.style.top)).toBe(Math.round((window.innerHeight - height) / 2));
  });

  it("keeps multiple resource previews open and independently closable", () => {
    const drawer = mountRdfNavigator();
    const predicate = drawer.shadowRoot?.querySelector<HTMLAnchorElement>('.navigator .predicate a[href="https://schema.org/name"]')!;
    predicate.click();
    predicate.click();

    const previews = Array.from(drawer.shadowRoot?.querySelectorAll<HTMLElement>(".resource-preview") ?? []);
    expect(previews).toHaveLength(2);
    expect(Number.parseFloat(previews[1]!.style.left)).toBe(Number.parseFloat(previews[0]!.style.left) + 24);
    expect(Number.parseFloat(previews[1]!.style.top)).toBe(Number.parseFloat(previews[0]!.style.top) + 24);
    expect(Number.parseInt(previews[1]!.style.zIndex, 10)).toBeGreaterThan(Number.parseInt(previews[0]!.style.zIndex, 10));

    previews[1]!.querySelector<HTMLButtonElement>(".resource-preview-close")?.click();
    expect(drawer.shadowRoot?.querySelectorAll(".resource-preview")).toHaveLength(1);
    expect(previews[0]!.isConnected).toBe(true);
    expect(previews[1]!.isConnected).toBe(false);

    previews[0]!.querySelector<HTMLButtonElement>(".resource-preview-close")?.click();
    expect(drawer.shadowRoot?.querySelector(".resource-preview")).toBeNull();
  });

  it("uses a CORS-readable sandbox fallback for DCMI PURLs that reject framing", async () => {
    document.body.innerHTML = '<span rdf-subject="https://example.com/alice" rdf-predicate="http://purl.org/dc/terms/description">Alice</span>';
    const originalFetch = window.fetch;
    const fetchMock = vi.fn().mockResolvedValue({
      headers: { get: () => "text/html; charset=utf-8" },
      ok: true,
      text: () => Promise.resolve('<html><head><title>DCMI</title></head><body><article id="description">Description</article></body></html>'),
      url: "https://www.dublincore.org/specifications/dublin-core/dcmi-terms/",
    } as unknown as Response);
    Object.defineProperty(window, "fetch", { configurable: true, value: fetchMock });
    try {
      const drawer = mountRdfNavigator();
      const predicate = drawer.shadowRoot?.querySelector<HTMLAnchorElement>('.navigator .predicate a[href="http://purl.org/dc/terms/description"]')!;
      predicate.click();
      const loadingFrame = drawer.shadowRoot?.querySelector<HTMLIFrameElement>(".resource-preview-frame")!;
      expect(loadingFrame.getAttribute("src")).toBeNull();
      expect(loadingFrame.srcdoc).toContain("Loading definition…");
      await Promise.resolve();
      await Promise.resolve();
      const frame = drawer.shadowRoot?.querySelector<HTMLIFrameElement>(".resource-preview-frame")!;
      expect(frame.getAttribute("src")).toBeNull();
      expect(fetchMock).toHaveBeenCalledWith(
        "https://www.dublincore.org/specifications/dublin-core/dcmi-terms/#description",
        expect.objectContaining({ credentials: "omit", redirect: "follow", referrerPolicy: "no-referrer" }),
      );
      expect(frame.getAttribute("sandbox")).toBe("allow-forms allow-popups allow-popups-to-escape-sandbox allow-scripts");
      await vi.waitFor(() => expect(frame.srcdoc).toContain('<base href="https://www.dublincore.org/specifications/dublin-core/dcmi-terms/">'));
      expect(frame.srcdoc).toContain("data-ia2-preview-bridge");
      expect(frame.srcdoc).toContain("ia2-rdf-preview-navigate");
      expect(frame.srcdoc).toContain('id="description"');

      drawer.shadowRoot?.querySelector<HTMLButtonElement>(".resource-preview-close")?.click();
      predicate.click();
      const cachedFrame = drawer.shadowRoot?.querySelector<HTMLIFrameElement>(".resource-preview-frame")!;
      expect(cachedFrame.srcdoc).toContain('id="description"');
      expect(fetchMock).toHaveBeenCalledTimes(1);
    } finally {
      Object.defineProperty(window, "fetch", { configurable: true, value: originalFetch });
    }
  });

  it("times out and retries fetch-first previews instead of loading forever", async () => {
    vi.useFakeTimers();
    document.body.innerHTML = '<span rdf-subject="https://example.com/alice" rdf-predicate="https://www.dublincore.org/specifications/dublin-core/dcmi-terms/?ia2-timeout=1#description">Alice</span>';
    const originalFetch = window.fetch;
    const fetchMock = vi.fn(() => new Promise<Response>(() => undefined));
    Object.defineProperty(window, "fetch", { configurable: true, value: fetchMock });
    try {
      const drawer = mountRdfNavigator();
      const predicate = drawer.shadowRoot?.querySelector<HTMLAnchorElement>('.navigator .predicate a[href*="ia2-timeout=1"]')!;
      predicate.click();
      const frame = drawer.shadowRoot?.querySelector<HTMLIFrameElement>(".resource-preview-frame")!;
      expect(frame.srcdoc).toContain("Loading definition…");

      await vi.advanceTimersByTimeAsync(3_000);
      expect(fetchMock).toHaveBeenCalledTimes(2);
      expect(frame.srcdoc).toContain("Still loading; retrying…");

      await vi.advanceTimersByTimeAsync(3_000);
      expect(frame.srcdoc).toContain("Preview unavailable.");
      expect(frame.srcdoc).not.toContain("Loading definition…");
    } finally {
      Object.defineProperty(window, "fetch", { configurable: true, value: originalFetch });
      vi.useRealTimers();
    }
  });

  it("recovers automatically when a fetch-first preview retry succeeds", async () => {
    vi.useFakeTimers();
    document.body.innerHTML = '<span rdf-subject="https://example.com/alice" rdf-predicate="https://www.dublincore.org/specifications/dublin-core/dcmi-terms/?ia2-retry=1#description">Alice</span>';
    const originalFetch = window.fetch;
    const fetchMock = vi.fn()
      .mockImplementationOnce(() => new Promise<Response>(() => undefined))
      .mockResolvedValueOnce({
        headers: { get: () => "text/html; charset=utf-8" },
        ok: true,
        text: () => Promise.resolve('<html><body><article id="description">Description</article></body></html>'),
        url: "https://www.dublincore.org/specifications/dublin-core/dcmi-terms/?ia2-retry=1",
      } as unknown as Response);
    Object.defineProperty(window, "fetch", { configurable: true, value: fetchMock });
    try {
      const drawer = mountRdfNavigator();
      const predicate = drawer.shadowRoot?.querySelector<HTMLAnchorElement>('.navigator .predicate a[href*="ia2-retry=1"]')!;
      predicate.click();
      const frame = drawer.shadowRoot?.querySelector<HTMLIFrameElement>(".resource-preview-frame")!;

      await vi.advanceTimersByTimeAsync(3_000);
      await Promise.resolve();
      expect(fetchMock).toHaveBeenCalledTimes(2);
      expect(frame.srcdoc).toContain('id="description"');
      expect(frame.srcdoc).not.toContain("Still loading; retrying…");
    } finally {
      Object.defineProperty(window, "fetch", { configurable: true, value: originalFetch });
      vi.useRealTimers();
    }
  });

  it("resolves rdf:type to its human-readable RDF 1.2 definition", () => {
    document.body.innerHTML = '<span rdf-subject="https://example.com/alice" rdf-predicate="http://www.w3.org/1999/02/22-rdf-syntax-ns#type" rdf-object="https://schema.org/Person">Alice</span>';
    const originalFetch = window.fetch;
    const fetchMock = vi.fn(() => new Promise<Response>(() => undefined));
    Object.defineProperty(window, "fetch", { configurable: true, value: fetchMock });
    try {
      const drawer = mountRdfNavigator();
      const predicate = drawer.shadowRoot?.querySelector<HTMLAnchorElement>('.navigator .predicate a[href="http://www.w3.org/1999/02/22-rdf-syntax-ns#type"]')!;
      predicate.click();
      const frame = drawer.shadowRoot?.querySelector<HTMLIFrameElement>(".resource-preview-frame")!;
      const open = drawer.shadowRoot?.querySelector<HTMLAnchorElement>(".resource-preview-open")!;
      expect(frame.getAttribute("src")).toBeNull();
      expect(frame.srcdoc).toContain("Loading definition…");
      expect(fetchMock).toHaveBeenCalledWith("https://www.w3.org/TR/rdf12-schema/#ch_type", expect.any(Object));
      expect(open.href).toBe("http://www.w3.org/1999/02/22-rdf-syntax-ns#type");
    } finally {
      Object.defineProperty(window, "fetch", { configurable: true, value: originalFetch });
    }
  });

  it("keeps same-window links navigable inside a fetched preview", () => {
    const originalFetch = window.fetch;
    const fetchMock = vi.fn(() => new Promise<Response>(() => undefined));
    Object.defineProperty(window, "fetch", { configurable: true, value: fetchMock });
    try {
      const drawer = mountRdfNavigator();
      const predicate = drawer.shadowRoot?.querySelector<HTMLAnchorElement>('.navigator .predicate a[href="https://schema.org/name"]')!;
      predicate.click();
      const frame = drawer.shadowRoot?.querySelector<HTMLIFrameElement>(".resource-preview-frame")!;
      const url = drawer.shadowRoot?.querySelector<HTMLElement>(".resource-preview-url")!;
      const open = drawer.shadowRoot?.querySelector<HTMLAnchorElement>(".resource-preview-open")!;
      window.dispatchEvent(new MessageEvent("message", {
        data: { type: "ia2-rdf-preview-navigate", href: "https://schema.org/Person" },
        source: frame.contentWindow,
      }));
      expect(frame.src).toBe("https://schema.org/Person");
      expect(url.textContent).toBe("https://schema.org/Person");
      expect(open.href).toBe("https://schema.org/Person");
      expect(fetchMock).toHaveBeenLastCalledWith("https://schema.org/Person", expect.any(Object));
    } finally {
      Object.defineProperty(window, "fetch", { configurable: true, value: originalFetch });
    }
  });

  it("changes drawer position in place and preserves the selected layout", () => {
    const drawer = mountRdfNavigator();
    const positionSwitch = drawer.shadowRoot?.querySelector<HTMLElement>(".position-switch")!;
    const options = Array.from(drawer.shadowRoot?.querySelectorAll<HTMLButtonElement>(".position-option") ?? []);
    const viewport = drawer.shadowRoot?.querySelector<HTMLElement>(".viewport")!;
    viewport.scrollTop = 84;
    expect(options.every((option) => option.querySelector(".position-icon"))).toBe(true);
    expect(options.map((option) => option.textContent?.trim())).toEqual(["", "", "", "", "", "", "", "", ""]);
    expect(options.map((option) => option.getAttribute("aria-label"))).toEqual([
      "Right, full height",
      "Right, top half",
      "Right, bottom half",
      "Bottom, full width",
      "Floating, centered",
      "Top, full width",
      "Left, full height",
      "Left, bottom half",
      "Left, top half",
    ]);
    expect(options.map((option) => option.getAttribute("aria-checked"))).toEqual(["true", "false", "false", "false", "false", "false", "false", "false", "false"]);
    expect(options.map((option) => option.tabIndex)).toEqual([0, -1, -1, -1, -1, -1, -1, -1, -1]);
    expect(drawer.shadowRoot?.querySelector<HTMLElement>(".panel")?.dataset.position).toBe("right");

    options[0]!.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "ArrowRight" }));
    expect(drawer.shadowRoot?.querySelector<HTMLElement>(".panel")?.dataset.position).toBe("right-top");
    expect(options[1]!.getAttribute("aria-checked")).toBe("true");
    expect(options[1]!.tabIndex).toBe(0);
    expect(drawer.shadowRoot?.querySelector(".viewport")).toBe(viewport);
    expect(viewport.scrollTop).toBe(84);

    options[4]!.click();
    const panel = drawer.shadowRoot?.querySelector<HTMLElement>(".panel")!;
    expect(panel.dataset.position).toBe("floating");
    expect(drawer.shadowRoot?.querySelector<HTMLElement>(".launcher")?.dataset.position).toBe("floating");
    expect(panel.style.left).not.toBe("");
    expect(panel.style.top).not.toBe("");
    expect(panel.style.width).not.toBe("");
    expect(panel.style.height).not.toBe("");
    expect(drawer.shadowRoot?.querySelectorAll(".ia2-window-resize-handle")).toHaveLength(8);

    const startingLeft = Number.parseFloat(panel.style.left);
    const startingTop = Number.parseFloat(panel.style.top);
    panel.querySelector<HTMLElement>(".tabs")!.dispatchEvent(new MouseEvent("pointerdown", { bubbles: true, button: 0, clientX: 100, clientY: 100 }));
    window.dispatchEvent(new MouseEvent("pointermove", { clientX: 130, clientY: 120 }));
    window.dispatchEvent(new MouseEvent("pointerup"));
    expect(Number.parseFloat(panel.style.left)).toBe(startingLeft + 30);
    expect(Number.parseFloat(panel.style.top)).toBe(startingTop + 20);

    const draggedLeft = Number.parseFloat(panel.style.left);
    const draggedTop = Number.parseFloat(panel.style.top);
    panel.querySelector<HTMLElement>(".tab")!.dispatchEvent(new MouseEvent("pointerdown", { bubbles: true, button: 0, clientX: 100, clientY: 100 }));
    window.dispatchEvent(new MouseEvent("pointermove", { clientX: 150, clientY: 150 }));
    window.dispatchEvent(new MouseEvent("pointerup"));
    expect(Number.parseFloat(panel.style.left)).toBe(draggedLeft);
    expect(Number.parseFloat(panel.style.top)).toBe(draggedTop);

    const draggedWidth = Number.parseFloat(panel.style.width);
    const draggedHeight = Number.parseFloat(panel.style.height);
    panel.querySelector<HTMLElement>('[data-resize="se"]')!.dispatchEvent(new MouseEvent("pointerdown", { bubbles: true, button: 0, clientX: 200, clientY: 200 }));
    window.dispatchEvent(new MouseEvent("pointermove", { clientX: 240, clientY: 225 }));
    window.dispatchEvent(new MouseEvent("pointerup"));
    expect(Number.parseFloat(panel.style.width)).toBeGreaterThan(draggedWidth);
    expect(Number.parseFloat(panel.style.height)).toBeGreaterThan(draggedHeight);

    options[7]!.click();
    expect(drawer.shadowRoot?.querySelector<HTMLElement>(".launcher")?.dataset.position).toBe("left-bottom");
    positionSwitch.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "End" }));
    expect(drawer.shadowRoot?.querySelector<HTMLElement>(".panel")?.dataset.position).toBe("left-top");
    options[7]!.click();
    drawer.refresh();
    expect(drawer.shadowRoot?.querySelector<HTMLButtonElement>('.position-option[aria-checked="true"]')?.dataset.position).toBe("left-bottom");
  });

  it("resizes docked layouts only from browser-detached edges and restores their dimensions", () => {
    const drawer = mountRdfNavigator();
    const panel = drawer.shadowRoot?.querySelector<HTMLElement>(".panel")!;
    const options = Array.from(drawer.shadowRoot?.querySelectorAll<HTMLButtonElement>(".position-option") ?? []);
    panel.getBoundingClientRect = () => {
      const sideWidth = Number.parseFloat(panel.style.getPropertyValue("--ia2-window-width")) || 760;
      const halfHeight = Number.parseFloat(panel.style.getPropertyValue("--ia2-window-half-height")) || window.innerHeight / 2;
      const horizontalHeight = Number.parseFloat(panel.style.getPropertyValue("--ia2-window-horizontal-height")) || window.innerHeight / 2;
      const position = panel.dataset.position;
      const width = position === "top" || position === "bottom" ? window.innerWidth : sideWidth;
      const height = position === "top" || position === "bottom"
        ? horizontalHeight
        : position?.endsWith("-top") || position?.endsWith("-bottom")
          ? halfHeight
          : window.innerHeight;
      const left = position?.startsWith("right") ? window.innerWidth - width : 0;
      const top = position === "bottom" || position?.endsWith("-bottom") ? window.innerHeight - height : 0;
      return {
        bottom: top + height,
        height,
        left,
        right: left + width,
        top,
        width,
        x: left,
        y: top,
        toJSON: () => ({}),
      } as DOMRect;
    };

    panel.querySelector<HTMLElement>('[data-resize="w"]')!.dispatchEvent(new MouseEvent("pointerdown", {
      bubbles: true,
      button: 0,
      clientX: 264,
      clientY: 200,
    }));
    window.dispatchEvent(new MouseEvent("pointermove", { clientX: 224, clientY: 200 }));
    window.dispatchEvent(new MouseEvent("pointerup"));
    expect(panel.style.getPropertyValue("--ia2-window-width")).toBe("800px");

    panel.querySelector<HTMLElement>('[data-resize="e"]')!.dispatchEvent(new MouseEvent("pointerdown", {
      bubbles: true,
      button: 0,
      clientX: 1024,
      clientY: 200,
    }));
    window.dispatchEvent(new MouseEvent("pointermove", { clientX: 964, clientY: 200 }));
    window.dispatchEvent(new MouseEvent("pointerup"));
    expect(panel.style.getPropertyValue("--ia2-window-width")).toBe("800px");

    options[1]!.click();
    panel.querySelector<HTMLElement>('[data-resize="sw"]')!.dispatchEvent(new MouseEvent("pointerdown", {
      bubbles: true,
      button: 0,
      clientX: 224,
      clientY: window.innerHeight / 2,
    }));
    window.dispatchEvent(new MouseEvent("pointermove", { clientX: 204, clientY: window.innerHeight / 2 + 30 }));
    window.dispatchEvent(new MouseEvent("pointerup"));
    expect(panel.style.getPropertyValue("--ia2-window-width")).toBe("820px");
    expect(panel.style.getPropertyValue("--ia2-window-half-height")).toBe(`${window.innerHeight / 2 + 30}px`);

    options[5]!.click();
    panel.querySelector<HTMLElement>('[data-resize="s"]')!.dispatchEvent(new MouseEvent("pointerdown", {
      bubbles: true,
      button: 0,
      clientX: 500,
      clientY: window.innerHeight / 2,
    }));
    window.dispatchEvent(new MouseEvent("pointermove", { clientX: 500, clientY: window.innerHeight / 2 + 50 }));
    window.dispatchEvent(new MouseEvent("pointerup"));
    expect(panel.style.getPropertyValue("--ia2-window-horizontal-height")).toBe(`${window.innerHeight / 2 + 50}px`);

    const stored = JSON.parse(sessionStorage.getItem(SESSION_STATE_KEY)!) as {
      dockedDimensions: { halfHeight: number; horizontalHeight: number; width: number };
    };
    expect(stored.dockedDimensions).toEqual({
      halfHeight: window.innerHeight / 2 + 30,
      horizontalHeight: window.innerHeight / 2 + 50,
      width: 820,
    });

    drawer.remove();
    const restored = mountRdfNavigator();
    const restoredPanel = restored.shadowRoot?.querySelector<HTMLElement>(".panel")!;
    expect(restoredPanel.style.getPropertyValue("--ia2-window-width")).toBe("820px");
    expect(restoredPanel.style.getPropertyValue("--ia2-window-half-height")).toBe(`${window.innerHeight / 2 + 30}px`);
    expect(restoredPanel.style.getPropertyValue("--ia2-window-horizontal-height")).toBe(`${window.innerHeight / 2 + 50}px`);
  });

  it("restores the position mode and floating geometry from session storage", () => {
    const drawer = mountRdfNavigator();
    drawer.shadowRoot?.querySelector<HTMLButtonElement>('[data-position="floating"]')!.click();
    const panel = drawer.shadowRoot?.querySelector<HTMLElement>(".panel")!;
    panel.querySelector<HTMLElement>(".drag-grip")!.dispatchEvent(new MouseEvent("pointerdown", { bubbles: true, button: 0, clientX: 100, clientY: 100 }));
    window.dispatchEvent(new MouseEvent("pointermove", { clientX: 130, clientY: 120 }));
    window.dispatchEvent(new MouseEvent("pointerup"));
    panel.querySelector<HTMLElement>('[data-resize="se"]')!.dispatchEvent(new MouseEvent("pointerdown", { bubbles: true, button: 0, clientX: 200, clientY: 200 }));
    window.dispatchEvent(new MouseEvent("pointermove", { clientX: 240, clientY: 225 }));
    window.dispatchEvent(new MouseEvent("pointerup"));

    const stored = JSON.parse(sessionStorage.getItem(SESSION_STATE_KEY)!) as {
      floatingRect: { height: number; width: number; x: number; y: number };
      position: string;
    };
    expect(stored.position).toBe("floating");
    expect(stored.floatingRect).toEqual({
      height: Number.parseFloat(panel.style.height),
      width: Number.parseFloat(panel.style.width),
      x: Number.parseFloat(panel.style.left),
      y: Number.parseFloat(panel.style.top),
    });

    drawer.remove();
    const restored = mountRdfNavigator();
    const restoredPanel = restored.shadowRoot?.querySelector<HTMLElement>(".panel")!;
    expect(restoredPanel.dataset.position).toBe("floating");
    expect(restored.shadowRoot?.querySelector<HTMLButtonElement>('.position-option[aria-checked="true"]')?.dataset.position).toBe("floating");
    expect({
      height: Number.parseFloat(restoredPanel.style.height),
      width: Number.parseFloat(restoredPanel.style.width),
      x: Number.parseFloat(restoredPanel.style.left),
      y: Number.parseFloat(restoredPanel.style.top),
    }).toEqual(stored.floatingRect);
  });

  it("recognizes and locates visible elements represented by local terms", () => {
    const documentUrl = new URL(document.URL);
    documentUrl.hash = "";
    document.body.innerHTML = [
      `<span rdf-subject="" rdf-predicate="https://schema.org/name">Document</span>`,
      `<span id="decision" rdf-predicate="https://schema.org/name">Decision</span>`,
      `<a href="#decision" rdf-subject="https://example.com/claim" rdf-predicate="https://schema.org/about">Decision reference</a>`,
    ].join("");
    const documentScroll = vi.fn();
    document.documentElement.scrollIntoView = documentScroll;
    document.documentElement.animate = vi.fn() as unknown as typeof document.documentElement.animate;
    const decision = document.getElementById("decision")!;
    decision.scrollIntoView = vi.fn();
    decision.animate = vi.fn() as unknown as typeof decision.animate;

    const drawer = mountRdfNavigator();
    const localLinks = Array.from(drawer.shadowRoot?.querySelectorAll<HTMLAnchorElement>(".local-term") ?? []);
    const documentLink = localLinks.find((link) => link.href === documentUrl.href);
    const fragmentLink = localLinks.find((link) => link.href === `${documentUrl.href}#decision`);
    expect(documentLink?.target).toBe("");
    expect(fragmentLink?.target).toBe("");

    expect(fragmentLink?.href).toBe(`${documentUrl.href}#decision`);
    document.defaultView?.history.replaceState(null, "", `${documentUrl.href}#decision`);
    documentLink?.click();
    expect(document.location.hash).toBe("");
    expect(documentScroll).toHaveBeenCalledOnce();

    const termLocates = Array.from(drawer.shadowRoot?.querySelectorAll<HTMLButtonElement>(".term-locate-button") ?? []);
    const carrierLocates = Array.from(drawer.shadowRoot?.querySelectorAll<HTMLButtonElement>(".carrier-locate-button") ?? []);
    expect(termLocates.map((button) => button.getAttribute("aria-label"))).toEqual([
      "Locate <html>",
      "Locate <span#decision>",
      "Locate <span#decision>",
    ]);
    expect(carrierLocates).toHaveLength(2);
    expect(fragmentLink?.closest(".quad")?.querySelector(".carrier-locate-button")).toBeNull();
    termLocates[2]!.click();
    expect(decision.scrollIntoView).toHaveBeenCalledOnce();
    expect(decision.animate).toHaveBeenCalledOnce();
  });

  it("filters Navigator statements by terms and reports an empty result", () => {
    document.body.innerHTML = [
      '<span rdf-subject="https://example.com/alice" rdf-predicate="https://schema.org/name">Alice</span>',
      '<a href="https://example.com/charlie" rdf-subject="https://example.com/bob" rdf-predicate="https://schema.org/knows">Charlie</a>',
    ].join("");
    const drawer = mountRdfNavigator();
    const search = drawer.shadowRoot?.querySelector<HTMLInputElement>(".navigator-search");
    const rows = Array.from(drawer.shadowRoot?.querySelectorAll<HTMLLIElement>(".quad") ?? []);
    const count = drawer.shadowRoot?.querySelector<HTMLOutputElement>(".filter-count");
    const empty = drawer.shadowRoot?.querySelector<HTMLElement>(".filter-empty");

    expect(search?.getAttribute("aria-label")).toBeNull();
    expect(search?.labels?.[0]?.textContent).toBe("Filter RDF statements");
    expect(count?.parentElement?.classList.contains("navigator-search-group")).toBe(true);
    expect(count?.textContent).toBe("");
    search!.value = "example.com";
    search?.dispatchEvent(new Event("input"));
    expect(rows.map((row) => row.hidden)).toEqual([false, false]);
    expect(count?.textContent).toBe("");

    search!.value = "ALICE";
    search?.dispatchEvent(new Event("input"));
    expect(rows.map((row) => row.hidden)).toEqual([false, true]);
    expect(getComputedStyle(rows[0]!).display).not.toBe("none");
    expect(getComputedStyle(rows[1]!).display).toBe("none");
    expect(count?.textContent).toBe("1 of 2");

    search!.value = "schema.org/knows";
    search?.dispatchEvent(new Event("input"));
    expect(rows.map((row) => row.hidden)).toEqual([true, false]);

    search!.value = "missing term";
    search?.dispatchEvent(new Event("input"));
    expect(empty?.hidden).toBe(false);
    expect(count?.textContent).toBe("0 of 2");
  });

  it("suggests ontology terms by labels, OWL kinds, domains, and ranges", () => {
    document.body.innerHTML = [
      '<a href="http://www.w3.org/2002/07/owl#Class" rdf-subject="https://example.com/Person" rdf-predicate="http://www.w3.org/1999/02/22-rdf-syntax-ns#type">Class</a>',
      '<span rdf-subject="https://example.com/Person" rdf-predicate="http://www.w3.org/2000/01/rdf-schema#label">Person</span>',
      '<a href="https://example.com/Person" rdf-subject="https://schema.org/name" rdf-predicate="http://www.w3.org/2000/01/rdf-schema#domain">Person domain</a>',
      '<a href="http://www.w3.org/2001/XMLSchema#string" rdf-subject="https://schema.org/name" rdf-predicate="http://www.w3.org/2000/01/rdf-schema#range">String range</a>',
    ].join("");
    const drawer = mountRdfNavigator();
    drawer.open();
    const search = drawer.shadowRoot?.querySelector<HTMLInputElement>(".navigator-search")!;
    const suggestions = drawer.shadowRoot?.querySelector<HTMLElement>(".typeahead")!;

    expect(search.getAttribute("role")).toBe("combobox");
    expect(search.getAttribute("aria-autocomplete")).toBe("list");
    expect(search.getAttribute("aria-controls")).toBe(suggestions.id);

    search.focus();
    search.value = "Person";
    search.dispatchEvent(new Event("input"));
    const person = Array.from(suggestions.querySelectorAll<HTMLElement>('[role="option"]'))
      .find((option) => option.querySelector(".typeahead-term")?.textContent === "<https://example.com/Person>");
    expect(person?.querySelector(".typeahead-label")?.textContent).toBe("Person");
    expect(person?.querySelector(".typeahead-meta")?.textContent).toContain("OWL class");
    expect(search.getAttribute("aria-expanded")).toBe("true");

    search.value = "range string";
    search.dispatchEvent(new Event("input"));
    const rangeOptions = Array.from(suggestions.querySelectorAll<HTMLElement>('[role="option"]'));
    expect(rangeOptions).toHaveLength(1);
    expect(rangeOptions[0]?.querySelector(".typeahead-term")?.textContent).toBe("schema:name");
    expect(rangeOptions[0]?.querySelector(".typeahead-meta")?.textContent).toContain("range xsd:string");

    search.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, cancelable: true, key: "ArrowDown" }));
    expect(search.getAttribute("aria-activedescendant")).toBe(rangeOptions[0]?.id);
    search.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, cancelable: true, key: "Enter" }));
    expect(search.value).toBe("schema:name");
    expect(suggestions.hidden).toBe(true);
    expect(Array.from(drawer.shadowRoot?.querySelectorAll<HTMLLIElement>(".quad") ?? []).map((row) => row.hidden))
      .toEqual([true, true, false, false]);

    search.value = "Person";
    search.dispatchEvent(new Event("input"));
    search.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, cancelable: true, key: "Escape" }));
    expect(search.getAttribute("aria-expanded")).toBe("false");
    expect(drawer.shadowRoot?.querySelector<HTMLElement>(".panel")?.dataset.open).toBe("true");
  });

  it("keeps the active filter and caret through live document refreshes", async () => {
    document.body.innerHTML = [
      '<span rdf-subject="https://example.com/alice" rdf-predicate="https://schema.org/name">Alice</span>',
      '<span rdf-subject="https://example.com/bob" rdf-predicate="https://schema.org/name">Bob</span>',
    ].join("");
    const drawer = mountRdfNavigator();
    drawer.open();
    await Promise.resolve();
    const search = drawer.shadowRoot?.querySelector<HTMLInputElement>(".navigator-search")!;
    search.value = "Alice";
    search.dispatchEvent(new Event("input"));
    search.focus();
    search.setSelectionRange(1, 4);

    document.body.querySelector("span")!.textContent = "Alice updated";
    await new Promise((resolve) => window.setTimeout(resolve, 180));

    const replacement = drawer.shadowRoot?.querySelector<HTMLInputElement>(".navigator-search")!;
    const rows = Array.from(drawer.shadowRoot?.querySelectorAll<HTMLLIElement>(".quad") ?? []);
    expect(replacement).not.toBe(search);
    expect(replacement.value).toBe("Alice");
    expect(rows.map((row) => row.hidden)).toEqual([false, true]);
    expect(drawer.shadowRoot?.activeElement).toBe(replacement);
    expect([replacement.selectionStart, replacement.selectionEnd]).toEqual([1, 4]);
  });

  it("contains keyboard focus and key events while the Navigator is open", async () => {
    const drawer = mountRdfNavigator();
    drawer.open();
    await Promise.resolve();
    const pageKeydown = vi.fn();
    const pageKeyup = vi.fn();
    document.addEventListener("keydown", pageKeydown);
    document.addEventListener("keyup", pageKeyup);
    try {
      const panel = drawer.shadowRoot?.querySelector<HTMLElement>(".panel")!;
      const focusables = Array.from(panel.querySelectorAll<HTMLElement>('a[href], button, input, select, textarea, [tabindex]'))
        .filter((element) => element.tabIndex >= 0 && !element.hasAttribute("disabled") && !element.closest("[hidden]") && element.getAttribute("aria-hidden") !== "true");
      const first = focusables[0]!;
      const last = focusables.at(-1)!;
      last.focus();
      const tab = new KeyboardEvent("keydown", { bubbles: true, cancelable: true, composed: true, key: "Tab" });
      last.dispatchEvent(tab);
      expect(tab.defaultPrevented).toBe(true);
      expect(drawer.shadowRoot?.activeElement).toBe(first);
      expect(pageKeydown).not.toHaveBeenCalled();

      const search = drawer.shadowRoot?.querySelector<HTMLInputElement>(".navigator-search")!;
      search.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, composed: true, key: "a" }));
      search.dispatchEvent(new KeyboardEvent("keyup", { bubbles: true, composed: true, key: "a" }));
      expect(pageKeydown).not.toHaveBeenCalled();
      expect(pageKeyup).not.toHaveBeenCalled();
    } finally {
      document.removeEventListener("keydown", pageKeydown);
      document.removeEventListener("keyup", pageKeyup);
    }
  });

  it("toggles counted namespaces without losing focus during live refresh", async () => {
    document.body.innerHTML = [
      '<span rdf-subject="https://example.com/items/alice" rdf-predicate="https://schema.org/name">Alice</span>',
      '<a href="https://people.example/id/charlie" rdf-subject="https://example.com/items/bob" rdf-predicate="https://terms.example/vocab/knows">Charlie</a>',
    ].join("");
    const drawer = mountRdfNavigator();
    const rows = Array.from(drawer.shadowRoot?.querySelectorAll<HTMLLIElement>(".quad") ?? []);
    const schema = drawer.shadowRoot?.querySelector<HTMLButtonElement>('.vocabulary-toggle[data-namespace="https://schema.org/"]');
    const undeclared = drawer.shadowRoot?.querySelector<HTMLButtonElement>('.vocabulary-toggle[data-namespace="https://terms.example/vocab/"]');
    const definition = drawer.shadowRoot?.querySelector<HTMLAnchorElement>('.vocabulary-link[href="https://terms.example/vocab/"]');
    const navigation = drawer.shadowRoot?.querySelector<HTMLElement>(".vocabularies")!;
    const links = drawer.shadowRoot?.querySelector<HTMLElement>(".vocabulary-links")!;

    expect(schema?.getAttribute("aria-pressed")).toBe("true");
    expect(schema?.querySelector(".vocabulary-count")?.textContent).toBe("1");
    expect(undeclared?.textContent).toBe("terms.example/vocab1");
    expect(undeclared?.querySelector(".vocabulary-name")?.textContent).toBe("terms.example/vocab");
    expect(undeclared?.getAttribute("aria-label")).toBe("Hide 1 statement using https://terms.example/vocab/");
    expect(definition?.target).toBe("_blank");
    Object.defineProperty(links, "clientWidth", { configurable: true, value: 100 });
    Object.defineProperty(links, "scrollWidth", { configurable: true, value: 300 });
    links.scrollLeft = 0;
    links.dispatchEvent(new Event("scroll"));
    expect(navigation.dataset.overflowLeft).toBe("false");
    expect(navigation.dataset.overflowRight).toBe("true");
    links.scrollLeft = 200;
    links.dispatchEvent(new Event("scroll"));
    expect(navigation.dataset.overflowLeft).toBe("true");
    expect(navigation.dataset.overflowRight).toBe("false");
    schema?.focus();
    schema?.click();
    expect(schema?.getAttribute("aria-pressed")).toBe("false");
    expect(rows.map((row) => row.hidden)).toEqual([true, false]);
    expect(drawer.shadowRoot?.activeElement).toBe(schema);

    document.body.setAttribute("data-ui-state", "busy");
    await new Promise((resolve) => window.setTimeout(resolve, 180));
    expect(drawer.shadowRoot?.querySelector('.vocabulary-toggle[data-namespace="https://schema.org/"]')).toBe(schema);
    expect(drawer.shadowRoot?.activeElement).toBe(schema);

    document.body.querySelector("span")!.textContent = "Alice updated";
    await new Promise((resolve) => window.setTimeout(resolve, 180));
    const refreshedSchema = drawer.shadowRoot?.querySelector<HTMLButtonElement>('.vocabulary-toggle[data-namespace="https://schema.org/"]');
    expect(refreshedSchema).not.toBe(schema);
    expect(refreshedSchema?.getAttribute("aria-pressed")).toBe("false");
    expect(drawer.shadowRoot?.activeElement).toBe(refreshedSchema);

    refreshedSchema?.click();
    const refreshedRows = Array.from(drawer.shadowRoot?.querySelectorAll<HTMLLIElement>(".quad") ?? []);
    const refreshedUndeclared = drawer.shadowRoot?.querySelector<HTMLButtonElement>('.vocabulary-toggle[data-namespace="https://terms.example/vocab/"]');
    refreshedUndeclared?.click();
    expect(refreshedRows.map((row) => row.hidden)).toEqual([false, true]);
  });

  it("synchronizes page and Navigator focus through one mode control", async () => {
    document.body.innerHTML = [
      '<span rdf-subject="https://example.com/alice" rdf-predicate="https://schema.org/name">Alice</span>',
      '<span rdf-subject="https://example.com/bob" rdf-predicate="https://schema.org/name">Bob</span>',
    ].join("");
    const sources = Array.from(document.body.querySelectorAll<HTMLElement>("[rdf-predicate]"));
    const makeRect = (top: number, height = 30): DOMRect => ({
      bottom: top + height,
      height,
      left: 10,
      right: 210,
      top,
      width: 200,
      x: 10,
      y: top,
      toJSON: () => ({}),
    });
    sources[0]!.getBoundingClientRect = () => makeRect(20);
    sources[1]!.getBoundingClientRect = () => makeRect(window.innerHeight + 100);
    sources.forEach((source) => {
      source.scrollIntoView = vi.fn();
      source.animate = vi.fn(() => ({ cancel: vi.fn() }) as unknown as Animation);
    });

    const drawer = mountRdfNavigator();
    const syncSwitch = drawer.shadowRoot?.querySelector<HTMLElement>(".sync-switch")!;
    const syncOptions = Array.from(drawer.shadowRoot?.querySelectorAll<HTMLButtonElement>(".sync-option") ?? []);
    const viewport = drawer.shadowRoot?.querySelector<HTMLElement>(".viewport")!;
    const rows = Array.from(drawer.shadowRoot?.querySelectorAll<HTMLLIElement>(".quad") ?? []);
    rows.forEach((row) => { row.scrollIntoView = vi.fn(); });
    expect(syncSwitch.getAttribute("role")).toBe("radiogroup");
    expect(syncOptions.every((option) => option.querySelector(".sync-icon"))).toBe(true);
    expect(syncOptions.map((option) => option.textContent?.trim())).toEqual(["", "", ""]);
    expect(syncOptions.map((option) => option.getAttribute("aria-label"))).toEqual([
      "Scroll synchronization off",
      "Follow page viewport in Navigator",
      "Follow Navigator in page",
    ]);
    expect(syncOptions.map((option) => option.getAttribute("aria-checked"))).toEqual(["true", "false", "false"]);
    expect(syncOptions.map((option) => option.tabIndex)).toEqual([0, -1, -1]);

    syncOptions[1]!.click();
    expect(rows.map((row) => row.hidden)).toEqual([false, true]);
    expect(drawer.shadowRoot?.querySelector(".filter-count")?.textContent).toBe("1 of 2");
    expect(syncOptions[1]!.getAttribute("aria-checked")).toBe("true");
    sources[1]!.dispatchEvent(new MouseEvent("pointerover", { bubbles: true }));
    expect(rows[1]?.hidden).toBe(false);
    expect(rows[1]?.classList.contains("is-corresponding")).toBe(true);
    expect(rows[1]?.scrollIntoView).toHaveBeenCalledOnce();
    sources[1]!.dispatchEvent(new MouseEvent("pointerout", { bubbles: true, relatedTarget: document.body }));
    expect(rows[1]?.hidden).toBe(true);

    viewport.getBoundingClientRect = () => makeRect(0, 300);
    rows[0]!.getBoundingClientRect = () => makeRect(8, 40);
    rows[1]!.getBoundingClientRect = () => makeRect(105, 40);
    syncOptions[1]!.focus();
    syncOptions[1]!.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "ArrowRight" }));
    expect(syncOptions[2]!.getAttribute("aria-checked")).toBe("true");
    expect(drawer.shadowRoot?.activeElement).toBe(syncOptions[2]);
    await new Promise((resolve) => window.setTimeout(resolve, 60));
    expect(sources[1]?.scrollIntoView).toHaveBeenCalled();
    rows[0]!.dispatchEvent(new MouseEvent("pointerover", { bubbles: true }));
    expect(sources[0]?.scrollIntoView).toHaveBeenCalled();
    expect(sources[0]?.animate).toHaveBeenCalled();
  });

  it("synchronizes visible exact-value data carriers with their rendered summaries", async () => {
    document.body.innerHTML = `
      <details open>
        <summary>
          <data
            value="a"
            rdf-subject="https://example.com/rdf-html#A"
            rdf-predicate="https://example.com/rdf-html#tagName"
          >
            <strong>rdfhtml:A</strong>
          </data>
        </summary>
      </details>
    `;
    const source = document.body.querySelector<HTMLDataElement>("data")!;
    const makeRect = (top: number, height = 30): DOMRect => ({
      bottom: top + height,
      height,
      left: 10,
      right: 210,
      top,
      width: 200,
      x: 10,
      y: top,
      toJSON: () => ({}),
    });
    source.getBoundingClientRect = () => makeRect(20);
    source.scrollIntoView = vi.fn();
    source.animate = vi.fn(() => ({ cancel: vi.fn() }) as unknown as Animation);

    const drawer = mountRdfNavigator();
    const viewport = drawer.shadowRoot?.querySelector<HTMLElement>(".viewport")!;
    const row = drawer.shadowRoot?.querySelector<HTMLLIElement>(".quad")!;
    const syncOptions = Array.from(drawer.shadowRoot?.querySelectorAll<HTMLButtonElement>(".sync-option") ?? []);
    viewport.getBoundingClientRect = () => makeRect(0, 300);
    row.getBoundingClientRect = () => makeRect(8, 40);

    expect(row.textContent).toContain('"a"');
    expect(row.textContent).not.toContain("rdfhtml:A");

    syncOptions[1]!.click();
    expect(row.hidden).toBe(false);

    syncOptions[2]!.click();
    await new Promise((resolve) => window.setTimeout(resolve, 60));
    expect(source.scrollIntoView).toHaveBeenCalledWith({ behavior: "auto", block: "center" });
  });

  it("shows only rendered carriers while the Navigator drives page scrolling", () => {
    document.head.insertAdjacentHTML(
      "beforeend",
      '<meta content="Hidden metadata" rdf-subject="https://example.com/page" rdf-predicate="https://schema.org/description">',
    );
    const drawer = mountRdfNavigator();
    const rows = Array.from(drawer.shadowRoot?.querySelectorAll<HTMLLIElement>(".quad") ?? []);
    const hiddenMetadata = rows.find((row) => row.textContent?.includes("Hidden metadata"))!;
    const visibleStatement = rows.find((row) => row.textContent?.includes("Alice"))!;
    const syncOptions = Array.from(drawer.shadowRoot?.querySelectorAll<HTMLButtonElement>(".sync-option") ?? []);

    expect(hiddenMetadata.hidden).toBe(false);
    expect(visibleStatement.hidden).toBe(false);

    syncOptions[2]!.click();

    expect(hiddenMetadata.hidden).toBe(true);
    expect(visibleStatement.hidden).toBe(false);
    expect(drawer.shadowRoot?.querySelector(".filter-count")?.textContent).toBe("1 of 2");
  });

  it("turns off scroll synchronization when the Navigator is closed", async () => {
    document.body.innerHTML = [
      '<span rdf-subject="https://example.com/alice" rdf-predicate="https://schema.org/name">Alice</span>',
      '<span rdf-subject="https://example.com/bob" rdf-predicate="https://schema.org/name">Bob</span>',
    ].join("");
    const sources = Array.from(document.body.querySelectorAll<HTMLElement>("[rdf-predicate]"));
    const makeRect = (top: number, height = 30): DOMRect => ({
      bottom: top + height,
      height,
      left: 10,
      right: 210,
      top,
      width: 200,
      x: 10,
      y: top,
      toJSON: () => ({}),
    });
    sources[0]!.getBoundingClientRect = () => makeRect(20);
    sources[1]!.getBoundingClientRect = () => makeRect(window.innerHeight + 100);
    sources.forEach((source) => {
      source.scrollIntoView = vi.fn();
      source.animate = vi.fn(() => ({ cancel: vi.fn() }) as unknown as Animation);
    });

    const drawer = mountRdfNavigator();
    const viewport = drawer.shadowRoot?.querySelector<HTMLElement>(".viewport")!;
    viewport.getBoundingClientRect = () => makeRect(0, 300);
    const rows = Array.from(drawer.shadowRoot?.querySelectorAll<HTMLLIElement>(".quad") ?? []);
    rows[0]!.getBoundingClientRect = () => makeRect(8, 40);
    rows[1]!.getBoundingClientRect = () => makeRect(105, 40);
    const syncOptions = Array.from(drawer.shadowRoot?.querySelectorAll<HTMLButtonElement>(".sync-option") ?? []);

    syncOptions[1]!.click();
    expect(rows.map((row) => row.hidden)).toEqual([false, true]);
    drawer.shadowRoot?.querySelector<HTMLButtonElement>(".close")?.click();
    expect(drawer.shadowRoot?.querySelector<HTMLElement>(".panel")?.dataset.open).toBe("false");
    expect(syncOptions.map((option) => option.getAttribute("aria-checked"))).toEqual(["true", "false", "false"]);
    expect(syncOptions.map((option) => option.tabIndex)).toEqual([0, -1, -1]);
    expect(rows.map((row) => row.hidden)).toEqual([false, false]);

    drawer.open();
    syncOptions[2]!.click();
    await new Promise((resolve) => window.setTimeout(resolve, 60));
    sources.forEach((source) => vi.mocked(source.scrollIntoView).mockClear());
    drawer.shadowRoot?.querySelector<HTMLButtonElement>(".close")?.click();
    viewport.dispatchEvent(new Event("scroll"));
    sources[0]!.dispatchEvent(new MouseEvent("pointerover", { bubbles: true }));
    await new Promise((resolve) => window.setTimeout(resolve, 60));
    expect(sources.every((source) => vi.mocked(source.scrollIntoView).mock.calls.length === 0)).toBe(true);
    expect(rows.every((row) => !row.classList.contains("is-corresponding"))).toBe(true);
  });

  it("indents nested RDF carriers while ignoring unannotated wrappers", () => {
    document.body.innerHTML = `
      <a id="parent" href="https://example.com/bob" rdf-predicate="https://schema.org/knows">
        <div><span id="child" rdf-predicate="https://schema.org/name">Bob</span></div>
      </a>
      <span id="sibling" rdf-predicate="https://schema.org/name">Alice</span>
    `;
    const drawer = mountRdfNavigator();
    const rows = Array.from(drawer.shadowRoot?.querySelectorAll<HTMLElement>(".quad") ?? []);
    expect(rows.map((row) => row.dataset.depth)).toEqual(["0", "1", "0"]);
    expect(rows[0]?.querySelector(".quad-terms code")?.textContent).not.toMatch(/^\d+\.\s/);
    expect(rows[1]?.style.getPropertyValue("--rdf-indent")).toBe("16px");
    expect(rows[1]?.querySelector(".structure-marker")?.textContent).toBe("↳");
    expect(rows[0]?.querySelector(".structure-marker")).toBeNull();
  });

  it("only offers Locate for rendered statement carriers", () => {
    document.head.insertAdjacentHTML(
      "beforeend",
      '<meta content="Hidden metadata" rdf-subject="https://example.com/page" rdf-predicate="https://schema.org/description">',
    );
    const drawer = mountRdfNavigator();
    const locateButtons = Array.from(drawer.shadowRoot?.querySelectorAll<HTMLButtonElement>(".carrier-locate-button") ?? []);
    expect(locateButtons.map((button) => button.getAttribute("aria-label"))).toEqual(["Locate <span>"]);
    expect(locateButtons[0]?.textContent).toBe("⌖");
    expect(locateButtons[0]?.closest(".preview-actions")).not.toBeNull();
    expect(drawer.shadowRoot?.querySelectorAll(".source-toggle")).toHaveLength(3);
    const metaRow = Array.from(drawer.shadowRoot?.querySelectorAll<HTMLElement>(".quad") ?? []).find((row) => row.textContent?.includes("Hidden metadata"));
    const metaToggles = Array.from(metaRow?.querySelectorAll<HTMLButtonElement>(".source-toggle") ?? []);
    expect(metaToggles).toHaveLength(1);
    expect(metaToggles[0]?.getAttribute("aria-label")).toBe("Show HTML for <meta>");
  });

  it("keeps Navigator state when locating a statement", async () => {
    const source = document.body.querySelector<HTMLElement>("[rdf-predicate]")!;
    const cancelLocate = vi.fn();
    source.scrollIntoView = vi.fn();
    source.animate = vi.fn(() => ({ cancel: cancelLocate }) as unknown as Animation);
    const drawer = mountRdfNavigator();
    const viewport = drawer.shadowRoot?.querySelector<HTMLElement>(".viewport")!;
    const row = drawer.shadowRoot?.querySelector<HTMLElement>(".quad")!;
    const search = drawer.shadowRoot?.querySelector<HTMLInputElement>(".navigator-search")!;
    const locate = drawer.shadowRoot?.querySelector<HTMLButtonElement>(".carrier-locate-button")!;
    search.value = "alice";
    search.dispatchEvent(new Event("input"));
    viewport.scrollTop = 96;

    locate.click();
    await new Promise((resolve) => window.setTimeout(resolve, 180));

    expect(source.scrollIntoView).toHaveBeenCalledOnce();
    expect(source.animate).toHaveBeenCalledOnce();
    expect(drawer.shadowRoot?.querySelector(".navigator-search")).toBe(search);
    expect(search.value).toBe("alice");
    expect(viewport.scrollTop).toBe(96);

    row.dispatchEvent(new MouseEvent("pointerout", { bubbles: true, relatedTarget: document.body }));
    expect(cancelLocate).toHaveBeenCalledOnce();
  });

  it("reveals highlighted carrier HTML with or without child content", () => {
    document.body.innerHTML = '<article id="profile" rdf-subject="https://example.com/alice" rdf-predicate="https://schema.org/name"><strong>Alice</strong></article>';
    const drawer = mountRdfNavigator();
    const elementButton = drawer.shadowRoot?.querySelector<HTMLButtonElement>('.source-toggle[data-children="false"]');
    const childrenButton = drawer.shadowRoot?.querySelector<HTMLButtonElement>('.source-toggle[data-children="true"]');
    expect(drawer.shadowRoot?.querySelector(".quad-actions.preview-actions")).not.toBeNull();
    expect(elementButton?.textContent).toBe("</>");
    expect(childrenButton?.textContent).toBe("</>+");

    elementButton?.click();
    const elementCode = drawer.shadowRoot?.querySelector<HTMLElement>(".source-code code");
    expect(elementButton?.getAttribute("aria-expanded")).toBe("true");
    expect(elementButton?.getAttribute("aria-label")).toBe("Hide HTML for <article#profile> without child content");
    expect(elementButton?.closest(".quad")?.classList.contains("source-open")).toBe(true);
    expect(elementCode?.textContent).toContain('<article id="profile"');
    expect(elementCode?.textContent).not.toContain("<strong>");
    expect(drawer.shadowRoot?.querySelector('.source-code .tok.name')?.textContent).toBe("article");

    elementButton?.click();
    expect(elementButton?.getAttribute("aria-expanded")).toBe("false");
    expect(elementButton?.getAttribute("aria-label")).toBe("Show HTML for <article#profile> without child content");
    expect(elementButton?.closest(".quad")?.classList.contains("source-open")).toBe(false);
    expect(drawer.shadowRoot?.querySelector(".source-code")).toBeNull();

    childrenButton?.click();
    const childrenCode = drawer.shadowRoot?.querySelector<HTMLElement>(".source-code code");
    expect(elementButton?.getAttribute("aria-expanded")).toBe("false");
    expect(childrenButton?.getAttribute("aria-expanded")).toBe("true");
    expect(childrenCode?.textContent).toContain("<strong>Alice</strong>");

    childrenButton?.setAttribute("aria-expanded", "false");
    childrenButton?.click();
    expect(childrenButton?.getAttribute("aria-expanded")).toBe("false");
    expect(drawer.shadowRoot?.querySelector(".source-code")).toBeNull();
  });

  it("automatically reflects semantic mutations in the live DOM", async () => {
    const drawer = mountRdfNavigator();
    expect(drawer.shadowRoot?.querySelector(".count")?.textContent).toBe("1");

    const statement = document.createElement("a");
    statement.href = "https://example.com/bob";
    statement.setAttribute("rdf-subject", "https://example.com/alice");
    statement.setAttribute("rdf-predicate", "https://schema.org/knows");
    document.body.prepend(statement);

    await new Promise((resolve) => window.setTimeout(resolve, 180));
    expect(drawer.shadowRoot?.querySelector(".count")?.textContent).toBe("2");
  });

  it("updates local document terms when the canonical link changes", async () => {
    document.body.innerHTML = '<span id="alice" rdf-predicate="https://schema.org/name">Alice</span>';
    const alice = document.getElementById("alice")!;
    alice.scrollIntoView = vi.fn();
    const canonical = document.createElement("link");
    canonical.rel = "canonical";
    canonical.href = "https://ia2.dev/spec/html-rdf";
    document.head.append(canonical);
    const drawer = mountRdfNavigator();
    const subject = (): HTMLAnchorElement | null => drawer.shadowRoot?.querySelector('.quad-terms > code:first-child a') ?? null;

    expect(subject()?.href).toBe("https://ia2.dev/spec/html-rdf#alice");
    expect(subject()?.classList.contains("local-term")).toBe(true);
    expect(subject()?.target).toBe("");
    subject()?.click();
    expect(document.location.hash).toBe("#alice");
    expect(alice.scrollIntoView).toHaveBeenCalledOnce();

    canonical.href = "https://ia2.dev/spec/html-rdf-next";
    await new Promise((resolve) => window.setTimeout(resolve, 180));
    expect(subject()?.href).toBe("https://ia2.dev/spec/html-rdf-next#alice");
    expect(subject()?.classList.contains("local-term")).toBe(true);
  });
});
