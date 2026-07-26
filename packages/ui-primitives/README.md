# IA² UI Primitives

`@ia2-dev/ui-primitives` contains the small, shared interaction vocabulary used
by IA² Web Components. It keeps window positions, position icons, ARIA
radiogroup behavior, keyboard navigation, and floating-window dragging
consistent without coupling component content or visual themes.

```ts
import {
  WINDOW_POSITIONS,
  applyDockedWindowDimensions,
  bindWindowPositionControls,
  positionControlsMarkup,
  startFloatingWindowDrag,
  startWindowResize,
  windowResizeHandlesMarkup,
  type WindowPosition,
} from "@ia2-dev/ui-primitives";
```

The shared position vocabulary is `right`, `right-top`, `right-bottom`,
`bottom`, `floating`, `top`, `left`, `left-bottom`, and `left-top`.
Position-control markup includes both the accessible radiogroup and a disclosure
trigger showing the current position. A consumer can keep the radiogroup inline
on roomy surfaces, then reveal the trigger and present the same options as a
vertical list when its toolbar is horizontally constrained. The shared binding
keeps both forms synchronized and handles disclosure focus, Escape, and outside
dismissal.
`WINDOW_PLACEMENT_CSS` supplies the shared geometry for an
`.ia2-window-surface`; components retain their theme, internal layout,
persistence, and content. Shared drag and eight-direction resize helpers keep
floating geometry inside the viewport and expose only browser-detached edges
for docked positions. Docked dimensions use the shared window custom properties
and can be constrained and restored with `applyDockedWindowDimensions`.
Resizing is intentionally suppressed at the mobile full-screen breakpoint.

The package also provides the shared three-state scroll-sync control used by
Navigator and RDF Value Editor. Its component-neutral modes are `off`, `page`, and
`panel`: follow neither surface, follow the page inside the panel, or follow the
panel inside the page.
Consumers may adapt the directional accessible labels while retaining the same
icons, radiogroup semantics, and keyboard behavior.
