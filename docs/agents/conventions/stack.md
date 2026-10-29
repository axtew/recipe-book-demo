# The stack is fixed — reach for what is already here

The stack and the scripts are in `package.json`; the list is not duplicated here. The stack decisions and their reasons are in [`docs/decisions/`](../../decisions/README.md) (ADR 0003–0009).

Adding a dependency requires the owner's permission ([`AGENTS.md`](../../../AGENTS.md)). These are the cases where reaching for a library is the tempting-but-wrong move:

- **Forms** — the project's own hook. Do not add `react-hook-form`, `formik` or similar.
- **Sortable lists** — `@dnd-kit/core` + `@dnd-kit/sortable`. Do not hand-roll pointer-event dragging, and do not use the HTML5 drag-and-drop API — it does not work on touch devices at all.
- **Validation** — `zod`. Schemas live in `src/domain/schemas/`, one module per entity, and are reused for form validation, for validating an imported JSON backup, and later as structured-output schemas. They are **not** applied to PostgREST responses: that shape is fixed by our own schema and already typed by the generated file. The one exception is a `jsonb` column, whose generated type is the field-less `Json` union.
- **Heavy UI** — Mantine, for the components listed in [`styling.md`](styling.md). Everything else is a project component.
