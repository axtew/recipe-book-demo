# Styling

Styled Components. Component-local styles live in `_styles.ts` next to the component. Prefix styled components with `S` (`SContainer`, `SHeader`).

## CSS rules

- **Colours via theme.** Use theme palette tokens, not literal hex. A literal hex is allowed only when the colour genuinely isn't in the theme **and** the plan explicitly marks it a design-specific exception. Don't copy a raw hex out of a design inspector — map it to a token first.
- **Normal flow over `position: sticky` / `fixed`.** Follow the nearest existing layout. Reach for `sticky` / `fixed` only when the task explicitly requires pinning on scroll, or a layout constraint genuinely needs it — not as a default reaction to "a top bar".
- **Decorative-only nodes via pseudo-element.** For a purely decorative element with no semantics or accessibility role, fully determined by its parent's state (e.g. a tab underline), prefer a CSS `::before` / `::after` over a separate React/DOM node. A separate node is justified only when it has its own behaviour, must be measured independently, or is a real structural element.

## Typography

Typography is a set of project components in `src/components/Typography/` — `H1`–`H3`, `B1`–`B3`, `Caption1`–`Caption2`, `Numbers`. **A screen never sets `font-size` itself** — with exactly one exception: a form input carries `font-size: 16px`, because Safari on iOS zooms the page when a focused field's font is smaller than that. It is a platform constraint, not a size from the scale, and it stays with a comment saying so. Do not "fix" it by routing it through a typography component. A new size means: first a token in `src/theme/_typography.ts`, then a component, then usage — in that order. This is what keeps screens looking like one application instead of each one inventing its own headings.

## Mantine and project components

Styled Components for layout, cards, headings, spacing — the project's own. **Mantine only for heavy components**: `Combobox`, `Drawer`, `DatePicker`, `Rating`, `NumberInput`, `Dropzone`, `Notifications`, `Skeleton`. Raising specificity over a Mantine component goes through `&&` in the styled wrapper — never `!important`. There is no in-repo UI kit: a primitive is either Mantine (for the list above) or a project component under `src/components/`.

## Mobile layout, iOS

Mobile-first, single column `max-width: 600px`; **iOS Safari is the reference platform** — `100dvh` (never `100vh`), `env(safe-area-inset-*)`, tap targets ≥ 44px. Where platforms disagree, iOS wins: the primary user is on an iPhone.
