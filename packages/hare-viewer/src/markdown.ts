export interface SafeMarkdownReference {
  destination: string;
  title: string | null;
}

export interface SafeMarkdownOptions {
  document?: Document;
  resolveImage?: (reference: SafeMarkdownReference) => Promise<string | null> | string | null;
  resolveLink?: (reference: SafeMarkdownReference) => Promise<string | null> | string | null;
}

/**
 * CommonMark conformance note
 *
 * This is a practical HARE Safe Markdown renderer, not yet a CommonMark
 * implementation. As of CommonMark 0.31.2, strict conformance means exercising
 * 652 normative examples. The current renderer covers the familiar authoring
 * surface but deliberately does not claim the delimiter, container-block, and
 * precedence behavior required by that corpus.
 *
 * Before claiming conformance, replace the incremental block/inline scanner
 * with a two-phase parser that produces a CommonMark-compatible AST, then keep
 * HARE safety in a separate DOM-rendering phase:
 *
 *   CommonMark source -> block/inline parser -> AST -> HARE safe DOM renderer
 *
 * The safe renderer must continue to display raw HTML as inert text, route
 * links through the envelope's virtual URL space, and materialize images only
 * through consumer-provided verified-resource lookup. Recognizing CommonMark
 * HTML nodes does not require interpreting them as browser HTML.
 *
 * Work still required includes tab expansion; entities and escapes; delimiter
 * stack rules for emphasis; reference links; balanced and multiline link
 * destinations; exact code-span normalization; tight, loose, nested, lazy, and
 * interrupted lists; nested block quotes; HTML block recognition; autolink and
 * hard/soft-break edge cases; and the complete official conformance corpus.
 * Tables, task items, and strikethrough are extensions and should remain
 * explicitly separate from any future CommonMark conformance claim.
 *
 * Corpus: https://spec.commonmark.org/0.31.2/spec.json
 */

const BLOCK_START = /^(?: {0,3}(?:#{1,6}\s|>|(?:[-+*]|\d+[.)])\s|`{3,}|~{3,}|(?:[*_-]\s*){3,}$)| {4}\S)/;
const SAFE_LINK = /^(?:https?:|mailto:|tel:|#|\/|\.\/|\.\.\/)/i;

function splitTableRow(line: string): string[] {
  const value = line.trim().replace(/^\|/, "").replace(/\|$/, "");
  const cells: string[] = [];
  let cell = "";
  let escaped = false;
  for (const character of value) {
    if (escaped) {
      cell += character;
      escaped = false;
    } else if (character === "\\") {
      escaped = true;
      cell += character;
    } else if (character === "|") {
      cells.push(cell.trim());
      cell = "";
    } else {
      cell += character;
    }
  }
  cells.push(cell.trim());
  return cells;
}

function tableDelimiter(line: string): Array<"left" | "center" | "right" | null> | null {
  const cells = splitTableRow(line);
  if (cells.length === 0 || cells.some((cell) => !/^:?-{3,}:?$/.test(cell))) return null;
  return cells.map((cell) => cell.startsWith(":") && cell.endsWith(":")
    ? "center"
    : cell.endsWith(":") ? "right" : cell.startsWith(":") ? "left" : null);
}

function parseDestination(value: string): SafeMarkdownReference | null {
  const trimmed = value.trim();
  const match = trimmed.match(/^<?([^\s>]+)>?(?:\s+["']([^"']*)["'])?$/);
  return match ? { destination: match[1]!, title: match[2] ?? null } : null;
}

async function appendInline(
  parent: Node,
  source: string,
  options: SafeMarkdownOptions,
  document: Document,
): Promise<void> {
  let index = 0;
  let text = "";
  const flush = () => {
    if (text) parent.appendChild(document.createTextNode(text));
    text = "";
  };
  const enclosed = (start: number, marker: string): number => source.indexOf(marker, start + marker.length);

  while (index < source.length) {
    const rest = source.slice(index);
    if (rest.startsWith("\\\n")) {
      flush();
      parent.appendChild(document.createElement("br"));
      index += 2;
      continue;
    }
    if (rest.startsWith("  \n")) {
      flush();
      parent.appendChild(document.createElement("br"));
      index += 3;
      continue;
    }
    if (source[index] === "\n") {
      text += " ";
      index += 1;
      continue;
    }
    if (source[index] === "\\" && /[\\`*{}\[\]()#+.!_>~-]/.test(source[index + 1] ?? "")) {
      text += source[index + 1];
      index += 2;
      continue;
    }
    if (source[index] === "`") {
      const run = rest.match(/^`+/)?.[0] ?? "`";
      const end = source.indexOf(run, index + run.length);
      if (end >= 0) {
        flush();
        const code = document.createElement("code");
        code.textContent = source.slice(index + run.length, end).replace(/\s*\n\s*/g, " ");
        parent.appendChild(code);
        index = end + run.length;
        continue;
      }
    }
    const isImage = rest.startsWith("![");
    if (isImage || rest.startsWith("[")) {
      const labelStart = index + (isImage ? 2 : 1);
      const labelEnd = source.indexOf("](", labelStart);
      const destinationEnd = labelEnd >= 0 ? source.indexOf(")", labelEnd + 2) : -1;
      if (labelEnd >= 0 && destinationEnd >= 0) {
        const reference = parseDestination(source.slice(labelEnd + 2, destinationEnd));
        if (reference) {
          flush();
          const label = source.slice(labelStart, labelEnd);
          if (isImage) {
            const resolved = await options.resolveImage?.(reference);
            if (resolved) {
              const image = document.createElement("img");
              image.alt = label;
              image.src = resolved;
              image.dataset.markdownDestination = reference.destination;
              if (reference.title) image.title = reference.title;
              parent.appendChild(image);
            } else {
              const fallback = document.createElement("span");
              fallback.className = "markdown-image-unavailable";
              fallback.textContent = label || reference.destination;
              fallback.dataset.markdownDestination = reference.destination;
              parent.appendChild(fallback);
            }
          } else {
            const resolved = await options.resolveLink?.(reference);
            if (resolved) {
              const anchor = document.createElement("a");
              anchor.href = resolved;
              anchor.dataset.markdownDestination = reference.destination;
              if (reference.title) anchor.title = reference.title;
              await appendInline(anchor, label, options, document);
              parent.appendChild(anchor);
            } else {
              await appendInline(parent, label, options, document);
            }
          }
          index = destinationEnd + 1;
          continue;
        }
      }
    }
    if (source[index] === "<") {
      const end = source.indexOf(">", index + 1);
      if (end >= 0) {
        const target = source.slice(index + 1, end);
        const destination = /^https?:\/\//i.test(target)
          ? target
          : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(target) ? `mailto:${target}` : null;
        if (destination) {
          flush();
          const resolved = await options.resolveLink?.({ destination, title: null });
          if (resolved) {
            const anchor = document.createElement("a");
            anchor.href = resolved;
            anchor.dataset.markdownDestination = destination;
            anchor.textContent = target;
            parent.appendChild(anchor);
          } else text += target;
          index = end + 1;
          continue;
        }
      }
    }
    const markers: Array<[string, string]> = [["**", "strong"], ["__", "strong"], ["~~", "del"], ["*", "em"], ["_", "em"]];
    let matched = false;
    for (const [marker, tag] of markers) {
      if (!rest.startsWith(marker)) continue;
      const end = enclosed(index, marker);
      if (end <= index + marker.length) continue;
      flush();
      const element = document.createElement(tag);
      await appendInline(element, source.slice(index + marker.length, end), options, document);
      parent.appendChild(element);
      index = end + marker.length;
      matched = true;
      break;
    }
    if (matched) continue;
    text += source[index];
    index += 1;
  }
  flush();
}

async function renderBlocks(
  lines: string[],
  parent: HTMLElement,
  options: SafeMarkdownOptions,
  document: Document,
): Promise<void> {
  let index = 0;
  while (index < lines.length) {
    const line = lines[index]!;
    if (!line.trim()) {
      index += 1;
      continue;
    }

    const fence = line.match(/^ {0,3}(`{3,}|~{3,})\s*([^\s`]*)?.*$/);
    if (fence) {
      const marker = fence[1]!;
      const body: string[] = [];
      index += 1;
      while (index < lines.length && !new RegExp(`^ {0,3}${marker[0]}{${marker.length},}\\s*$`).test(lines[index]!)) {
        body.push(lines[index]!);
        index += 1;
      }
      if (index < lines.length) index += 1;
      const pre = document.createElement("pre");
      const code = document.createElement("code");
      code.textContent = body.join("\n");
      if (fence[2]) code.className = `language-${fence[2].replace(/[^A-Za-z0-9_-]/g, "")}`;
      pre.append(code);
      parent.append(pre);
      continue;
    }

    const heading = line.match(/^ {0,3}(#{1,6})(?:\s+|$)(.*?)(?:\s+#+\s*)?$/);
    if (heading) {
      const element = document.createElement(`h${heading[1]!.length}`);
      await appendInline(element, heading[2]!, options, document);
      parent.append(element);
      index += 1;
      continue;
    }
    if (index + 1 < lines.length && /^ {0,3}(?:=+|-+)\s*$/.test(lines[index + 1]!) && line.trim()) {
      const element = document.createElement(lines[index + 1]!.includes("=") ? "h1" : "h2");
      await appendInline(element, line.trim(), options, document);
      parent.append(element);
      index += 2;
      continue;
    }
    if (/^ {0,3}(?:(?:\*\s*){3,}|(?:-\s*){3,}|(?:_\s*){3,})$/.test(line)) {
      parent.append(document.createElement("hr"));
      index += 1;
      continue;
    }
    if (/^ {0,3}>/.test(line)) {
      const quoteLines: string[] = [];
      while (index < lines.length && (/^ {0,3}>/.test(lines[index]!) || !lines[index]!.trim())) {
        quoteLines.push(lines[index]!.replace(/^ {0,3}> ?/, ""));
        index += 1;
      }
      const quote = document.createElement("blockquote");
      await renderBlocks(quoteLines, quote, options, document);
      parent.append(quote);
      continue;
    }
    const listMatch = line.match(/^ {0,3}([-+*]|\d+[.)])\s+(.*)$/);
    if (listMatch) {
      const ordered = /\d/.test(listMatch[1]!);
      const list = document.createElement(ordered ? "ol" : "ul");
      if (ordered) list.setAttribute("start", listMatch[1]!.match(/^\d+/)![0]);
      while (index < lines.length) {
        const itemMatch = lines[index]!.match(/^ {0,3}([-+*]|\d+[.)])\s+(.*)$/);
        if (!itemMatch || /\d/.test(itemMatch[1]!) !== ordered) break;
        const itemLines = [itemMatch[2]!];
        index += 1;
        while (index < lines.length && (/^ {2,}\S/.test(lines[index]!) || !lines[index]!.trim())) {
          itemLines.push(lines[index]!.replace(/^ {2,4}/, ""));
          index += 1;
        }
        const item = document.createElement("li");
        const task = itemLines[0]!.match(/^\[([ xX])\]\s+(.*)$/);
        if (task) {
          item.classList.add("task-list-item");
          const checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          checkbox.checked = task[1]!.toLowerCase() === "x";
          checkbox.disabled = true;
          checkbox.setAttribute("aria-label", checkbox.checked ? "Completed" : "Not completed");
          item.append(checkbox, " ");
          itemLines[0] = task[2]!;
        }
        await renderBlocks(itemLines, item, options, document);
        list.append(item);
      }
      parent.append(list);
      continue;
    }
    if (index + 1 < lines.length && line.includes("|") && tableDelimiter(lines[index + 1]!)) {
      const alignments = tableDelimiter(lines[index + 1]!)!;
      const table = document.createElement("table");
      const head = document.createElement("thead");
      const headerRow = document.createElement("tr");
      for (const [cellIndex, value] of splitTableRow(line).entries()) {
        const cell = document.createElement("th");
        if (alignments[cellIndex]) cell.style.textAlign = alignments[cellIndex]!;
        await appendInline(cell, value, options, document);
        headerRow.append(cell);
      }
      head.append(headerRow);
      table.append(head);
      index += 2;
      const body = document.createElement("tbody");
      while (index < lines.length && lines[index]!.includes("|") && lines[index]!.trim()) {
        const row = document.createElement("tr");
        for (const [cellIndex, value] of splitTableRow(lines[index]!).entries()) {
          const cell = document.createElement("td");
          if (alignments[cellIndex]) cell.style.textAlign = alignments[cellIndex]!;
          await appendInline(cell, value, options, document);
          row.append(cell);
        }
        body.append(row);
        index += 1;
      }
      table.append(body);
      parent.append(table);
      continue;
    }
    if (/^ {4}/.test(line)) {
      const body: string[] = [];
      while (index < lines.length && (/^ {4}/.test(lines[index]!) || !lines[index]!.trim())) {
        body.push(lines[index]!.replace(/^ {4}/, ""));
        index += 1;
      }
      const pre = document.createElement("pre");
      const code = document.createElement("code");
      code.textContent = body.join("\n").replace(/\n+$/, "");
      pre.append(code);
      parent.append(pre);
      continue;
    }

    const paragraph: string[] = [line];
    index += 1;
    while (index < lines.length && lines[index]!.trim() && !BLOCK_START.test(lines[index]!)) {
      if (index + 1 < lines.length && tableDelimiter(lines[index + 1]!)) break;
      paragraph.push(lines[index]!);
      index += 1;
    }
    const element = document.createElement("p");
    await appendInline(element, paragraph.join("\n"), options, document);
    parent.append(element);
  }
}

/**
 * Render conventional Markdown without interpreting raw HTML.
 * Resource resolution is delegated so HARE consumers can enforce verification and
 * offline routing rather than allowing Markdown to fetch from the network.
 */
export async function renderSafeMarkdown(markdown: string, options: SafeMarkdownOptions = {}): Promise<HTMLElement> {
  const document = options.document ?? globalThis.document;
  const section = document.createElement("section");
  section.className = "markdown";
  const normalized = markdown.replace(/\r\n?/g, "\n").replace(/^\uFEFF/, "");
  await renderBlocks(normalized.split("\n"), section, {
    ...options,
    resolveLink: options.resolveLink ?? ((reference) => SAFE_LINK.test(reference.destination) ? reference.destination : null),
  }, document);
  return section;
}
