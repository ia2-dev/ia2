---
name: "IA²"
description: "Information architecture for a legible, decentralized agentic web"
colors:
  protocol-violet: "oklch(49% 0.18 294)"
  deep-graph-violet: "oklch(30% 0.12 294)"
  semantic-ink: "oklch(20% 0.075 294)"
  context-violet: "oklch(90% 0.065 294)"
  luminous-paper: "oklch(97% 0.012 294)"
  extractable-signal: "oklch(81% 0.15 135)"
  page-ink: "oklch(23% 0.035 286)"
  muted-ink: "oklch(47% 0.025 286)"
  page-paper: "oklch(98.5% 0.008 286)"
  page-layer: "oklch(94.5% 0.02 286)"
  rule: "oklch(84% 0.025 286)"
  interface-violet: "oklch(55% 0.17 294)"
  interface-violet-soft: "oklch(93% 0.035 294)"
typography:
  display:
    fontFamily: '"Avenir Next", Avenir, "Segoe UI Variable", "Segoe UI", sans-serif'
    fontSize: "clamp(2.9rem, 4.7vw, 5.5rem)"
    fontWeight: 680
    lineHeight: 0.92
    letterSpacing: "-0.06em"
  headline:
    fontFamily: '"Avenir Next", Avenir, "Segoe UI Variable", "Segoe UI", sans-serif'
    fontSize: "clamp(2.25rem, 4.1vw, 4.9rem)"
    fontWeight: 780
    lineHeight: 0.98
    letterSpacing: "-0.015em"
  title:
    fontFamily: '"Avenir Next", Avenir, "Segoe UI Variable", "Segoe UI", sans-serif'
    fontSize: "clamp(1.25rem, 2.5vw, 2rem)"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.035em"
  body:
    fontFamily: '"Avenir Next", Avenir, "Segoe UI Variable", "Segoe UI", sans-serif'
    fontSize: "clamp(1.08rem, 1.6vw, 1.35rem)"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "normal"
  label:
    fontFamily: '"Avenir Next", Avenir, "Segoe UI Variable", "Segoe UI", sans-serif'
    fontSize: "0.72rem"
    fontWeight: 750
    lineHeight: 1.2
    letterSpacing: "0.05em"
  code:
    fontFamily: 'ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace'
    fontSize: "0.83rem"
    fontWeight: 400
    lineHeight: 1.8
    letterSpacing: "normal"
rounded:
  square: "0px"
  compact: "5px"
  control: "8px"
  panel: "10px"
  floating: "14px"
  pill: "999px"
spacing:
  xs: "0.35rem"
  sm: "0.75rem"
  md: "1rem"
  lg: "1.25rem"
  xl: "2rem"
  page-gutter: "clamp(1.25rem, 4vw, 4rem)"
  section: "clamp(6rem, 12vw, 12rem)"
components:
  action-primary:
    backgroundColor: "{colors.luminous-paper}"
    textColor: "{colors.semantic-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.square}"
    padding: "0.75rem 1.15rem"
    height: "3.25rem"
  action-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.luminous-paper}"
    typography: "{typography.label}"
    rounded: "{rounded.square}"
    padding: "0.75rem 1.15rem"
    height: "3.25rem"
  semantic-specimen:
    backgroundColor: "{colors.deep-graph-violet}"
    textColor: "{colors.luminous-paper}"
    typography: "{typography.code}"
    rounded: "{rounded.square}"
    padding: "0px"
  work-row:
    backgroundColor: "transparent"
    textColor: "{colors.page-ink}"
    typography: "{typography.title}"
    rounded: "{rounded.square}"
    padding: "clamp(1.4rem, 3vw, 2.2rem) 0"
  navigator-search:
    backgroundColor: "{colors.page-layer}"
    textColor: "{colors.page-ink}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "6px 10px"
    height: "36px"
  namespace-chip:
    backgroundColor: "{colors.page-paper}"
    textColor: "{colors.muted-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "5px 7px 5px 9px"
  navigator-tab:
    backgroundColor: "transparent"
    textColor: "{colors.muted-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.square}"
    padding: "12px 10px 10px"
  rdf-launcher:
    backgroundColor: "{colors.page-ink}"
    textColor: "{colors.page-paper}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "9px 13px 9px 11px"
    height: "44px"
---

# Design System: IA²

## Overview

**Creative North Star: "The Legible Commons"**

IA² should feel like a shared technical surface whose structure can be inspected
without specialist ceremony. The public site uses a committed violet field,
overscale type, visible rules, and a real semantic specimen to make open
standards feel consequential rather than institutional. Product surfaces turn
the same idea into dense, calm controls where relationships remain easy to
trace.

The system is rigorous, human-readable, and quietly optimistic. It rejects both
machine mysticism and corporate abstraction. Layouts expose hierarchy through
scale, alignment, and meaningful grouping, never through decorative complexity.

**Key Characteristics:**

- One committed violet voice on public surfaces, restrained violet emphasis in tools.
- Strong sans-serif hierarchy with compact labels and generous reading measures.
- Rules, rows, and semantic specimens instead of repetitive feature cards.
- Flat document surfaces, with elevation reserved for movable or temporary layers.
- Motion that confirms state and arrival, never motion that supplies meaning.

## Colors

Protocol violet carries the public identity. Violet-tinted neutrals keep both
documents and tools related to that field, while the green signal identifies
live, extractable, or successful semantic state.

### Primary

- **Protocol Violet:** The dominant public field, major identity color, and active emphasis.
- **Interface Violet:** The slightly brighter product accent for selected controls, terms, and focus.

### Secondary

- **Deep Graph Violet:** Code specimens, secondary hero actions, and high-contrast semantic surfaces.
- **Context Violet:** Quiet links and supportive emphasis on dark surfaces.

### Tertiary

- **Extractable Signal:** Live extraction, success, and keyboard focus. It is a semantic signal, not decoration.

### Neutral

- **Semantic Ink:** The dark text used inside the violet hero and for its strongest thesis line.
- **Page Ink:** Primary text on document and interface surfaces.
- **Muted Ink:** Explanatory text, metadata, labels, and inactive controls.
- **Luminous Paper:** Light text and extraction output placed on saturated or dark fields.
- **Page Paper:** The primary reading surface.
- **Page Layer:** Subtle section and control differentiation without extra containers.
- **Rule:** One-pixel dividers that make document structure inspectable.

### Named Rules

**The Committed Field Rule.** Protocol Violet may own an entire public section;
do not dilute it with gradients or decorative companion colors.

**The Signal Has Meaning Rule.** Extractable Signal appears only for live,
successful, focused, or otherwise actionable state. Never use it as confetti.

## Typography

**Display Font:** Avenir Next, with Avenir and Segoe UI fallbacks  
**Body Font:** Avenir Next, with Avenir and Segoe UI fallbacks  
**Label/Mono Font:** The platform UI monospace stack for code and RDF terms

**Character:** The single sans family is confident and technical without
imitating terminal culture. Weight and scale do the expressive work; monospace
is reserved for source, identifiers, and graph terms.

### Hierarchy

- **Display** (680, fluid 2.9rem to 5.5rem, 0.92): Thesis statements and one dominant idea per fold.
- **Headline** (780, fluid 2.25rem to 4.9rem, 0.98): The real project title and major page identity.
- **Title** (700, fluid 1.25rem to 2rem, 1.2): Linked artifacts and product-level headings.
- **Body** (400, fluid 1.08rem to 1.35rem, 1.55): Public explanation, capped near 62ch. Product body text may step down to 14px at 1.5.
- **Label** (750, 0.72rem, 0.05em): Short contextual labels and statuses. Uppercase is permitted only for compact labels.
- **Code** (400, 0.83rem, 1.8): HTML, Turtle, RDF terms, and inspectable source.

### Named Rules

**The Real Title Rule.** “Information Architecture for Intelligent Agents” is
a readable title, not a tracked-out eyebrow. Give it breathing room and never
let display tracking make letters touch.

**The Monospace Evidence Rule.** Use monospace only when the content is itself
code, syntax, an identifier, or machine-readable evidence.

**The Ordinal Meaning Rule.** Show a number only when its value changes how the
content is understood or used: an instruction step, chronological position,
rank, quantity, version, or stable identifier referenced elsewhere. Do not
number sections, examples, layers, catalogue rows, or navigation items merely
to create rhythm or imply technical rigor. Use headings, group labels,
alignment, spacing, and rules to expose non-sequential structure.

## Elevation

The system is flat by default. Public sections change through color, spacing,
and one-pixel rules. Product containers use borders and tonal layers first.
Shadows are structural: they identify a drawer, floating window, transient
preview, form overlay, or toast that sits above the document.

### Shadow Vocabulary

- **Launcher Lift** (`0 8px 28px oklch(20% 0.03 286 / 22%)`): The compact RDF launcher above page content.
- **Docked Drawer** (`±12px 0 48px oklch(20% 0.03 286 / 18%)`): Separation between the document and a side-mounted navigator.
- **Floating Navigator** (`0 18px 64px oklch(20% 0.03 286 / 24%)`): Movable navigator and definition-preview windows.
- **Workspace Overlay** (`0 18px 50px oklch(28% 0.03 60 / 9%), 0 2px 8px oklch(28% 0.03 60 / 5%)`): Inline forms and toasts in the live workspace.

### Named Rules

**The Structural Shadow Rule.** If a surface does not move above, overlay, or
detach from its document, it does not receive a shadow.

## Components

Components are precise and stateful. Public components remain square and
architectural; product controls use compact 5px to 10px curves, with pills only
for counts, launchers, and namespace toggles.

### Buttons

- **Shape:** Public CTAs are square; product buttons use a compact 8px radius.
- **Primary:** Luminous Paper on Protocol Violet, or the inverse inside the hero, with at least 44px effective target height.
- **Hover / Focus:** Translate at most 2px on hover. Focus uses a visible three-pixel Extractable Signal or Interface Violet ring.
- **Secondary:** Transparent or tonal, with a one-pixel rule. It must not compete with the primary action.

### Chips

- **Style:** Namespace controls are true pills with a one-pixel rule, compact counts, and restrained inactive contrast.
- **State:** Selected chips use Interface Violet with Page Paper text. Hover may use Interface Violet Soft.

### Cards / Containers

- **Corner Style:** Public specimens stay square; application panels use 10px, floating windows use 14px.
- **Background:** Prefer Page Paper or Page Layer. Deep Graph Violet is reserved for semantic code evidence.
- **Shadow Strategy:** Follow the Structural Shadow Rule.
- **Border:** Use a one-pixel Rule divider to expose structure.
- **Internal Padding:** Controls cluster around 10px to 18px; reading surfaces use 18px to 28px; public sections use the fluid page gutter.

### Inputs / Fields

- **Style:** A 36px control height, 8px radius, Page Layer background, and one-pixel Rule border.
- **Focus:** Shift the border to Interface Violet and add a three-pixel low-chroma ring.
- **Error / Disabled:** Retain legible text and communicate state in words or icons as well as color.

### Navigation

Public navigation is compact, text-first, and underlines on hover. Product tabs
use a two-pixel active underline; rails use tonal selection rather than a
colored side stripe. On narrow screens, navigation reduces before content does.

### Semantic Specimen

The signature public component correlates a readable claim, its HTML/RDF source,
and the extracted result. It is evidence, not decorative code wallpaper. The
RDF Navigator continues that pattern with searchable terms, source reveals,
locators, namespace filters, and document synchronization.

## Do's and Don'ts

### Do:

- **Do** make structure visible through hierarchy, one-pixel rules, and source-to-meaning correlation.
- **Do** let Protocol Violet own large public fields and use Interface Violet sparingly inside tools.
- **Do** keep public body copy near 62ch and application reading copy below 70ch.
- **Do** preserve WCAG 2.2 AA contrast, full keyboard navigation, strong focus states, and reduced-motion behavior.
- **Do** keep description, validation, authority, and execution visibly distinct.
- **Do** show real artifacts, code, graphs, and interactive tools instead of visual metaphors for intelligence.
- **Do** reserve ordinals for meaningful sequence, chronology, rank, quantity, versioning, or stable references.

### Don't:

- **Don't** resemble an AI startup sales page.
- **Don't** resemble a crypto or cyberpunk interface.
- **Don't** use a generic developer-tool template.
- **Don't** build an enterprise site filled with abstract claims.
- **Don't** use chatbot imagery, glowing network graphics, feature-card grids, or agentic-web hype.
- **Don't** drift into editorial-magazine affectation.
- **Don't** use gradient text, decorative glassmorphism, or colored side-stripe borders.
- **Don't** use monospace as a costume for technical credibility.
- **Don't** decorate sections, examples, layers, catalogue rows, or navigation with arbitrary ordinals.
- **Don't** animate meaning into existence; every state must remain understandable without motion.
