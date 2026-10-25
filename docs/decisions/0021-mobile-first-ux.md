# 0021. Mobile-first UX, the recipe editor is the central screen

- Status: accepted
- Date: 2026-08-02

## Context and problem

The app is used on a phone, often in the kitchen. The UX principles that the screens depend on need to be fixed.

## Considered options

Reordering ingredients and steps on a phone is a separate fork ([ADR 0008](0008-dnd-kit-for-sorting.md)); the other principles had no options.

## Decision

- Mobile-first, everything is designed for the phone: `100dvh`, safe-area insets, tap targets ≥44px, a bottom tab bar, modals as bottom sheets.
- The screen for adding/editing a recipe is critical, the app lives or dies on it. Creating a product and a variant — without leaving the recipe screen.
- Nutrition is recalculated on the fly as the user types.
- Autosave of the recipe draft (in `localStorage`, [ADR 0005](0005-tanstack-query-persisted-cache.md)).

## Consequences

- Layout rules — [`conventions/styling.md`](../agents/conventions/styling.md); iOS priority — [ADR 0001](0001-personal-app-for-two.md).
- An idea instead of dragging on the phone — ↑↓ buttons: [`BACKLOG.md`](../../BACKLOG.md).
