# 0004. styled-components for own markup, Mantine for heavy components

- Status: accepted
- Date: 2026-08-02

## Context and problem

We need a way to write styles and a ready set of UI components. Criteria: functionality matters more, we do not spend resources; I do not want to design it myself, so a headless library (where you draw every pixel yourself) is exactly the opposite choice.

## Considered options

Styles:
1. **styled-components** — the deciding argument: habit and development speed.
2. Tailwind — the performance difference on this data volume is not noticeable; performance was not an argument.
3. Zero-runtime (Linaria / vanilla-extract / Panda CSS) — in case the same ergonomics without a runtime are ever needed.

UI kit:
1. **Mantine** (the current major version is 9.x).
2. Radix — rejected: zero visuals, no Combobox, DatePicker, Rating, NumberInput.
3. Radix Themes — has visuals, but a poorer set of components: the same three expensive components would have to be written by hand.

## Decision

**styled-components** for styles: own screens and markup. **Mantine** for heavy components: Combobox with search, bottom Drawer, DatePicker, Rating, NumberInput, Dropzone, Notifications, Skeleton — the most expensive ones to implement ourselves.

## Consequences

- The risk is accepted: since 2025 styled-components is officially in maintenance mode (compatibility fixes only, no new features). It works with React 19. If zero-runtime with the same ergonomics is ever needed — Linaria / vanilla-extract / Panda CSS (the idea is in [`BACKLOG.md`](../../BACKLOG.md)).
- Mantine does not conflict with styled-components: since version 7 it uses CSS modules and CSS variables.
- Rules of use are in [`conventions/styling.md`](../agents/conventions/styling.md).
