# Components

## Loading states

A section that fetches its data shows an explicit loading state — a `Skeleton` (Mantine) or the project's own placeholder — while the request is in flight. Do **not** render `-` / empty placeholders first and swap real values in once they arrive: that bare-dashes-then-pop-in is a visible jank defect. `-` is for a value that is genuinely absent *after* loading, not for "not loaded yet". (This is the established project behaviour — data renders under preloaders.)

## Compound components — for composable shells only

When several screens (or several variants of one screen) share a layout but differ in **what is placed into it**, express the shared part as a **compound component**: one root plus named sub-components attached as static properties, arranged by the consumer's own JSX. Establish the first precedent deliberately; later ones follow it.

**State stays with the consumer.** Sub-components are dumb markup; the root does not hide shared state in an internal context. `Accordion.Item` takes `isOpened` / `setIsOpened` from outside and `Table` holds no state at all — match that. A hook next to the compound component is the right home for logic the consumers would otherwise duplicate.

**This is the exception, not the default.** Reach for it only when the set of slots genuinely varies **between consumers**. Do **not** convert a component into a compound one when:

- it has a single call site, or all call sites render the same structure — keep it one component;
- the variation is expressible as a value prop (`variant`, `size`, a boolean, an enum) — use the prop;
- the variation is a **uniform internal decision** rather than a per-consumer choice. Loading and empty states are the canonical example: if every consumer would write the same `isPending` / `isEmpty` check, that logic belongs **inside** the root, driven by props — not exposed as `.Preloader` / `.Empty` sub-components for each consumer to re-assemble.

**A small `ReactNode` in a prop is fine and often better.** Passing one element through a named prop is the default for a single injection point. Use a prop for a single well-named injection point; reach for a compound sub-component when the consumer needs to **arrange several** pieces inside the shell, not to smuggle one node in.

**Naming.** A compound root must not collide with an existing symbol of a different nature — in particular, route-level layouts under `src/routes/layouts/` (which provide context providers and `<Outlet />`) are a separate concern from presentational compound shells; do not give both the same name.

## Extend the existing family, don't open a parallel one

Before introducing a new type or config shape, look for an existing family of the same class and add a member to it — a set of sibling string enums folded into a shared union and narrowed by membership-test guards, a registry of similar entries, a set of parallel constants. A new shape placed beside such a family (an object where the siblings are enum members, a second options list where one already exists) makes every consumer handle two forms and edits files the family alone would leave untouched.

Introduce a new shape only when the entity carries fields beyond the identifier the family keys on.

When a plan hands you a parallel shape and a family already exists: follow the family, and name the divergence in the report — do not silently do either one. If the plan's shape is load-bearing (later phases are written against it), stop and ask instead of deciding alone.
