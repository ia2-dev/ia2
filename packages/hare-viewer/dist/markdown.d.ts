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
 * Render conventional Markdown without interpreting raw HTML.
 * Resource resolution is delegated so HARE consumers can enforce verification and
 * offline routing rather than allowing Markdown to fetch from the network.
 */
export declare function renderSafeMarkdown(markdown: string, options?: SafeMarkdownOptions): Promise<HTMLElement>;
