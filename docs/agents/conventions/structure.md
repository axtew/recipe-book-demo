# Structure — names, placement, exports, component size

## File naming

- Components: PascalCase folder with an `index.ts` barrel export (`RecipeCard/`, `NutritionTable/`); nested parts in `_internal/`.
- Internal files: leading underscore (`_styles.ts`, `_types.ts`, `_helpers.ts`, `_Recipe.tsx`, `_useRecipe.ts`).
- Pages: PascalCase + `Page` suffix (`RecipePage/`, `JournalPage/`).
- Path aliases: `@/` → `src/`.

## Placement — one ladder for everything extracted

Types, helpers, constants, hooks and sub-components all obey the same rule: **an entity lives at the lowest level that covers all of its current consumers, and moves up only when a real second consumer appears.** Never place something shared speculatively.

The ladder, from the bottom:

1. **Inside the file that uses it** — while it stays within the size limits below.
2. **Beside the component, underscore-prefixed** — `_types.ts`, `_helpers.ts`, `_constants.ts`, `_use<Name>.ts`, `_<Sub>.tsx`.
3. **The component's own root** — when a second consumer appears inside its `_internal/`, the shared entity moves up: `SomeComponent/_internal/SomeSub/_types.ts` → `SomeComponent/_types.ts`.
4. **The group root** — when several sibling components of one group share it, it goes to that group's own folder (an icon set, a page's `components/charts/`, a page's `_internal/`).
5. **Global** — `src/types/`, `src/utils/helpers/`, `src/components/` — only once consumers span two or more features or pages.

**Leaving the file (step 1 → 2).** A type stays inline while the file declares at most one `type` / `interface` / `enum` **and** it has fewer than 10 fields. Trigger to move: **≥2 declarations, or one declaration with ≥10 fields.** Once `_types.ts` exists, **all** component-local types live there, the props type included — splitting type blocks between the TSX and `_types.ts` is exactly what this rule forbids.

**Global types** live in `src/types/`, one file per domain or concern: `products.types.ts`, `recipes.types.ts`, `common.types.ts`, `i18n.types.ts`. Group them by **the domain a concept belongs to**, never by where the concept came from. An "API types" folder looks tidy right up until a response shape becomes an entity that a form also needs — then everything drifts into one place anyway to dodge circular imports, because "API vs not-API" is not a property a type keeps. Domain is. A domain that outgrows a single file graduates to a folder: the same ladder, one level up.

**Handlers obey it too.** A handler used by exactly one child is declared **in that child**, not lifted into the feature hook and threaded down through props. A feature hook that resolves "everything the feature touches" looks like a tidy single entry point but pulls in logic whose only consumer is one leaf — the hook grows, the leaf becomes prop-plumbing. The feature hook holds what two or more children share, or what the feature root itself needs.

**Export discipline** applies at every step of the ladder — see the section below.

## Export discipline — an export needs an importer, not a hope

`export` is a claim that something is part of a module's public contract. Add it in the same change that adds the code importing it; never in advance. This applies at all three levels, and the check is the same at each: **grep for an importer — zero importers means no export.**

- **Symbol inside a file** — a type, constant, or function used only within its own file stays unexported. `_types.ts` is not exempt: a shape referenced only by another type in the same file needs no `export`. (A non-exported interface is still reachable structurally through an exported type that references it — reading a nested field off such a value works whether or not the nested shape is exported. It only needs exporting when a consumer must *name* it, e.g. in its own signature.)
- **Barrel (`index.ts`)** — a line goes in when a consumer outside the folder imports it. Symbols used only by siblings inside the folder are imported from `./_module` directly, not routed through the barrel.
- **Module-level** — same rule one level up: a helper shared by two files in a folder is exported from its file, not promoted to a shared location.

"Later phases will probably need it" is not a reason — when a later phase needs it, adding the line is one edit, and it lands with its importer. Deferred cleanup ("we'll strip unused exports at the end") does not happen: by the end nobody remembers which exports were speculative.

Applies to reviewers too: an export with no importer outside its module is a `code` finding, not a note for a future phase.

**The one exception — a symbol that completes the contract the phase itself defines.** When a phase moves an existing behaviour out of a structure (e.g. replaces a function-valued field on an interface with plain data plus a free function next to it), the free function has no importer until the next phase — yet withholding the export would hand over a structure whose meaning is described nowhere. That is a transferred implementation, not a speculative "might be useful". The developer names the symbol and the reason in the report; the reviewer checks the justification rather than only counting importers. An export with neither an importer nor such a justification stays a `code` finding.

## Component size

**Keep components thin.** A component's render body is JSX + trivial glue. Data fetching, derivation, transforms, and non-trivial helper logic belong in the colocated hook (`_use<Name>.ts`) or `_helpers.ts`, never inline in the render body. A `.tsx` whose body carries substantial non-JSX logic — or runs past ~150–200 lines — is a smell: extract it, then place it by the ladder above.

(Project norm: nearly every component is < 200 lines; a new one over that needs justification.)
