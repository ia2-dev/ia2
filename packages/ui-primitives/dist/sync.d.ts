export type ScrollSyncMode = "off" | "page" | "panel";
export interface ScrollSyncDefinition {
    icon: string;
    label: string;
    mode: ScrollSyncMode;
}
export declare const SCROLL_SYNC_MODES: ReadonlyArray<ScrollSyncDefinition>;
export declare function isScrollSyncMode(value: unknown): value is ScrollSyncMode;
export interface ScrollSyncControlsMarkupOptions {
    ariaLabel?: string;
    controlClass?: string;
    current: ScrollSyncMode;
    label?: string;
    labels?: Partial<Record<ScrollSyncMode, string>>;
    optionClass?: string;
    switchClass?: string;
}
export declare function scrollSyncControlsMarkup({ ariaLabel, controlClass, current, label, labels, optionClass, switchClass, }: ScrollSyncControlsMarkupOptions): string;
export declare function updateScrollSyncControls(root: ParentNode, mode: ScrollSyncMode, focus?: boolean): void;
export declare function bindScrollSyncControls(root: ParentNode, applyMode: (mode: ScrollSyncMode, focus: boolean) => boolean | void): () => void;
