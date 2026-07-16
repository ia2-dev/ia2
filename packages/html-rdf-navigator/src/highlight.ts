type Syntax = "turtle" | "json" | "html";

const TURTLE_TOKENS = /(<https?:\/\/[^>]+>)|("(?:\\.|[^"\\])*"(?:@[A-Za-z0-9-]+(?:--(?:ltr|rtl))?|\^\^(?:<[^>]+>|[A-Za-z][\w-]*:[\w.-]+))?)|(^|\s)(@[a-z]+|[A-Za-z][\w-]*:[\w.-]+)|(_:[A-Za-z][\w-]*)|(#[^\n]*)/gim;
const JSON_TOKENS = /("(?:\\.|[^"\\])*")\s*(?=:)|("(?:\\.|[^"\\])*")|\b(true|false|null)\b|\b(-?\d+(?:\.\d+)?)\b/g;

function spanToken(parent: Node, value: string, className: string, document: Document): void {
  const span = document.createElement("span");
  span.className = `tok ${className}`;
  span.textContent = value;
  parent.appendChild(span);
}

function appendToken(parent: Node, value: string, className: string, document: Document): void {
  if (className === "iri") {
    const iri = value.slice(1, -1);
    const anchor = document.createElement("a");
    anchor.className = "tok iri";
    anchor.textContent = value;
    anchor.href = iri;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    parent.appendChild(anchor);
    return;
  }
  spanToken(parent, value, className, document);
}

function turtleClass(match: RegExpExecArray): string {
  if (match[1]) return "iri";
  if (match[2]) return "string";
  if (match[4]) return "keyword";
  if (match[5]) return "blank";
  if (match[6]) return "comment";
  return "name";
}

function jsonClass(match: RegExpExecArray): string {
  if (match[1]) return "key";
  if (match[2]) {
    try {
      const value = JSON.parse(match[2]) as string;
      if (/^https?:\/\//.test(value)) return "json-iri";
    } catch {
      // Rendering still continues with a plain string token.
    }
    return "string";
  }
  if (match[3]) return "keyword";
  return "number";
}

function appendHtmlTag(parent: Node, source: string, document: Document): void {
  if (source.startsWith("<!--")) {
    spanToken(parent, source, "comment", document);
    return;
  }
  if (/^<!doctype/i.test(source)) {
    spanToken(parent, source, "keyword", document);
    return;
  }
  const tag = /^(<\/?)([^\s/>]+)([\s\S]*?)(\/?>)$/.exec(source);
  if (!tag) {
    parent.appendChild(document.createTextNode(source));
    return;
  }
  spanToken(parent, tag[1]!, "punctuation", document);
  spanToken(parent, tag[2]!, "name", document);
  const attributes = tag[3] ?? "";
  const pattern = /(\s+)([^\s=]+)(?:(\s*=\s*)("[^"]*"|'[^']*'|[^\s]+))?/g;
  let cursor = 0;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(attributes))) {
    parent.appendChild(document.createTextNode(attributes.slice(cursor, match.index) + match[1]!));
    spanToken(parent, match[2]!, "key", document);
    if (match[3]) parent.appendChild(document.createTextNode(match[3]));
    if (match[4]) spanToken(parent, match[4], "string", document);
    cursor = pattern.lastIndex;
  }
  parent.appendChild(document.createTextNode(attributes.slice(cursor)));
  spanToken(parent, tag[4]!, "punctuation", document);
}

function highlightHtml(source: string, parent: Node, document: Document): void {
  let cursor = 0;
  while (cursor < source.length) {
    const start = source.indexOf("<", cursor);
    if (start < 0) {
      parent.appendChild(document.createTextNode(source.slice(cursor)));
      return;
    }
    parent.appendChild(document.createTextNode(source.slice(cursor, start)));
    if (source.startsWith("<!--", start)) {
      const commentEnd = source.indexOf("-->", start + 4);
      const end = commentEnd < 0 ? source.length : commentEnd + 3;
      appendHtmlTag(parent, source.slice(start, end), document);
      cursor = end;
      continue;
    }
    let quote = "";
    let end = start + 1;
    for (; end < source.length; end += 1) {
      const character = source[end];
      if (quote) {
        if (character === quote) quote = "";
      } else if (character === '"' || character === "'") {
        quote = character;
      } else if (character === ">") {
        end += 1;
        break;
      }
    }
    appendHtmlTag(parent, source.slice(start, end), document);
    cursor = end;
  }
}

/** Create highlighted, link-safe code without injecting source strings as HTML. */
export function highlightedCode(source: string, syntax: Syntax, document: Document): HTMLElement {
  const pre = document.createElement("pre");
  const code = document.createElement("code");
  pre.append(code);
  if (syntax === "html") {
    highlightHtml(source, code, document);
    return pre;
  }
  const pattern = syntax === "turtle" ? new RegExp(TURTLE_TOKENS) : new RegExp(JSON_TOKENS);
  let cursor = 0;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(source))) {
    code.append(document.createTextNode(source.slice(cursor, match.index)));
    const className = syntax === "turtle" ? turtleClass(match) : jsonClass(match);
    if (className === "json-iri") {
      const anchor = document.createElement("a");
      anchor.className = "tok iri";
      anchor.textContent = match[0];
      anchor.href = JSON.parse(match[0]) as string;
      anchor.target = "_blank";
      anchor.rel = "noopener noreferrer";
      code.append(anchor);
    } else {
      appendToken(code, match[0], className, document);
    }
    cursor = pattern.lastIndex;
  }
  code.append(document.createTextNode(source.slice(cursor)));
  return pre;
}
