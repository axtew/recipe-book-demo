# 0008. dnd-kit for sortable lists

- Status: accepted
- Date: 2026-08-02

## Context and problem

Recipe ingredients and steps must be reordered on a phone. Mantine has no DnD package of its own; its official recipe for sortable lists uses dnd-kit.

What was checked before the decision:

- `ecovion` — has only `src/components/FileDrop/` (an HTML5 drop zone for uploading files from the OS), no sorting component. `Carbon` has no DnD dependencies.
- `aramco/src/components/DragAndDropList/` (~350 lines) — a real sortable list on mouse/touch events (not HTML5 DnD, so it works on a phone in principle), with a drag handle, autoscroll and a placeholder.

## Considered options

1. **`@dnd-kit/core` + `@dnd-kit/sortable`.**
2. A port of `aramco/DragAndDropList` — cannot be taken as is:
   - equal item height is hardcoded (`ITEM_HEIGHT = {m:53, s:50}`, index = `relativeY / containerHeight * items.length`) — recipe steps are multi-line and of variable height, so the index would be computed wrongly;
   - `touchmove` is attached without `{ passive: false }` → `preventDefault` does not work → the page scrolls during dragging on a phone;
   - it is tied to the uikit and the Aramco design (its own column of numbers `01, 02...`, `Row`/`Column`/`Caption2`/`BurgerIcon`);
   - no keyboard accessibility.
3. The HTML5 drag-and-drop API — does not work on touch devices at all.

## Decision

**dnd-kit.** A port would mean rewriting the index math, fixing the listener and detaching from the uikit, that is, more than half of the component, and then maintaining our own code. With dnd-kit the same list is ~40 lines with variable heights, an activation constraint, autoscroll and keyboard support out of the box.

## Consequences

- Do not write dragging by hand on pointer events — [`conventions/stack.md`](../agents/conventions/stack.md).
- An alternative for the phone is ↑↓ buttons instead of dragging: the idea is in [`BACKLOG.md`](../../BACKLOG.md).
