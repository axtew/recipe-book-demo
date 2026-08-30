## Conventions

### File naming

- Components: PascalCase folder with an `index.ts` barrel export (`RecipeCard/`, `NutritionTable/`); nested parts in `_internal/`.
- Internal files: leading underscore (`_styles.ts`, `_types.ts`, `_helpers.ts`, `_Recipe.tsx`, `_useRecipe.ts`).
- Pages: PascalCase + `Page` suffix (`RecipePage/`, `JournalPage/`).
- Path aliases: `@/` → `src/`.

### Equality

Strict `===` / `!==` only. `==` / `!=` are forbidden (enforced by eslint `eqeqeq: always`), **including against `null`** — write `x === null` / `x !== null` / `x === undefined`, never the loose `x == null`.

### Loading states

A section that fetches its data shows an explicit loading state — a `Skeleton` (Mantine) or the project's own placeholder — while the request is in flight. Do **not** render `-` / empty placeholders first and swap real values in once they arrive: that bare-dashes-then-pop-in is a visible jank defect. `-` is for a value that is genuinely absent *after* loading, not for "not loaded yet". (This is the established project behaviour — data renders under preloaders.)

### Comments & docs language — Russian

Code comments (inline `//`, block `/* */`, JSDoc `/** */`) and repository documentation that ships in the codebase (`README.md` files inside `src/`, `docs/`, per-module READMEs, etc.) are written in **Russian**. Keep technical terms in English — type/function/file names, APIs, libraries, enum members, and inline code identifiers stay verbatim.

Not covered by this rule (stay as-is): `plans/<slug>/` pipeline artifacts and downstream-agent prompts may be English; this project file (`copilot-instructions.md`) and the other `.github/` instruction docs stay English; commit messages follow the existing convention.

### Comments — when, and what goes first

A comment is written only where the code is genuinely non-obvious, and it describes a **durable fact about the code or the system** — never how the code came to be. Apply two filters in order:

1. **Is a comment needed at all?** Not if it restates the name, type or signature; not if it retells the task, the plan, the review, or the investigation. A small component with a descriptive name needs none. Product code never contains references to design nodes, `plan.md` / `figma*.md` / `PROBLEMS.md`, phase or round numbers, or "as of this task" narration — these are pipeline artifacts, and a comment that survives its context is a comment that misleads the next reader.
2. **If needed — purpose first, mechanism after.** The opening sentence says *what this is / what it does*, without "how" and without "why this way". Mechanism, rationale, constraints and gotchas follow in a separate paragraph — and **only** the parts that pass filter 1 on their own (a non-obvious decision, an external constraint). If nothing survives, the comment ends after the purpose line; that is a complete comment, not an unfinished one. Reviewer's test: covering everything but the first line, do I know why this entity exists?

A comment states what the code **does**, not what was intended. A comment that claims a property the code lacks is worse than the defect: it outlives both the bug and the next refactor. When a requirement could not be met, document the residual gap honestly instead of the wished-for behaviour.

### Placement — one ladder for everything extracted

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

**Export discipline** applies at every step of the ladder — see the next section.

### Export discipline — an export needs an importer, not a hope

`export` is a claim that something is part of a module's public contract. Add it in the same change that adds the code importing it; never in advance. This applies at all three levels, and the check is the same at each: **grep for an importer — zero importers means no export.**

- **Symbol inside a file** — a type, constant, or function used only within its own file stays unexported. `_types.ts` is not exempt: a shape referenced only by another type in the same file needs no `export`. (A non-exported interface is still reachable structurally through an exported type that references it — reading a nested field off such a value works whether or not the nested shape is exported. It only needs exporting when a consumer must *name* it, e.g. in its own signature.)
- **Barrel (`index.ts`)** — a line goes in when a consumer outside the folder imports it. Symbols used only by siblings inside the folder are imported from `./_module` directly, not routed through the barrel.
- **Module-level** — same rule one level up: a helper shared by two files in a folder is exported from its file, not promoted to a shared location.

"Later phases will probably need it" is not a reason — when a later phase needs it, adding the line is one edit, and it lands with its importer. Deferred cleanup ("we'll strip unused exports at the end") does not happen: by the end nobody remembers which exports were speculative.

Applies to reviewers too: an export with no importer outside its module is a `code` finding, not a note for a future phase.

**The one exception — a symbol that completes the contract the phase itself defines.** When a phase moves an existing behaviour out of a structure (e.g. replaces a function-valued field on an interface with plain data plus a free function next to it), the free function has no importer until the next phase — yet withholding the export would hand over a structure whose meaning is described nowhere. That is a transferred implementation, not a speculative "might be useful". The developer names the symbol and the reason in the report; the reviewer checks the justification rather than only counting importers. An export with neither an importer nor such a justification stays a `code` finding.

### Component size

**Keep components thin.** A component's render body is JSX + trivial glue. Data fetching, derivation, transforms, and non-trivial helper logic belong in the colocated hook (`_use<Name>.ts`) or `_helpers.ts`, never inline in the render body. A `.tsx` whose body carries substantial non-JSX logic — or runs past ~150–200 lines — is a smell: extract it, then place it by the ladder above.

(Project norm: nearly every component is < 200 lines; a new one over that needs justification.)

### Compound components — for composable shells only

When several screens (or several variants of one screen) share a layout but differ in **what is placed into it**, express the shared part as a **compound component**: one root plus named sub-components attached as static properties, arranged by the consumer's own JSX. Establish the first precedent deliberately; later ones follow it.

**State stays with the consumer.** Sub-components are dumb markup; the root does not hide shared state in an internal context. `Accordion.Item` takes `isOpened` / `setIsOpened` from outside and `Table` holds no state at all — match that. A hook next to the compound component is the right home for logic the consumers would otherwise duplicate.

**This is the exception, not the default.** Reach for it only when the set of slots genuinely varies **between consumers**. Do **not** convert a component into a compound one when:

- it has a single call site, or all call sites render the same structure — keep it one component;
- the variation is expressible as a value prop (`variant`, `size`, a boolean, an enum) — use the prop;
- the variation is a **uniform internal decision** rather than a per-consumer choice. Loading and empty states are the canonical example: if every consumer would write the same `isPending` / `isEmpty` check, that logic belongs **inside** the root, driven by props — not exposed as `.Preloader` / `.Empty` sub-components for each consumer to re-assemble.

**A small `ReactNode` in a prop is fine and often better.** Passing one element through a named prop is the default for a single injection point. Use a prop for a single well-named injection point; reach for a compound sub-component when the consumer needs to **arrange several** pieces inside the shell, not to smuggle one node in.

**Naming.** A compound root must not collide with an existing symbol of a different nature — in particular, route-level layouts under `src/routes/layouts/` (which provide context providers and `<Outlet />`) are a separate concern from presentational compound shells; do not give both the same name.

### Strong typing for record-shaped maps

When the keys of a map are bounded by an enum, type the map as `Record<EEnumName, ValueType>` (or `Partial<Record<EEnumName, ValueType>>` if not all enum members are present). Default to enum-typed records over `Record<string, X>` whenever an enum exists. Match this style for any new colour / category / lookup map.

### Styling

Styled Components. Component-local styles live in `_styles.ts` next to the component. Prefix styled components with `S` (`SContainer`, `SHeader`).

**CSS conventions:**

- **Colours via theme.** Use theme palette tokens, not literal hex. A literal hex is allowed only when the colour genuinely isn't in the theme **and** the plan explicitly marks it a design-specific exception. Don't copy a raw hex out of a design inspector — map it to a token first.
- **Normal flow over `position: sticky` / `fixed`.** Follow the nearest existing layout. Reach for `sticky` / `fixed` only when the task explicitly requires pinning on scroll, or a layout constraint genuinely needs it — not as a default reaction to "a top bar".
- **Decorative-only nodes via pseudo-element.** For a purely decorative element with no semantics or accessibility role, fully determined by its parent's state (e.g. a tab underline), prefer a CSS `::before` / `::after` over a separate React/DOM node. A separate node is justified only when it has its own behaviour, must be measured independently, or is a real structural element.

### i18n — every locale always

All user-visible text (labels, placeholders, hints, error messages, empty states) goes through the i18n system, never hardcoded in JSX. Any user-visible key you add goes into **every** dictionary in the dictionaries folder simultaneously — every locale present now and any added later (don't hardcode the list — enumerate the folder). Each file gets the value translated into **the language that file represents** (`en.json` → English, `kg.json` → Kyrgyz, `ru.json` → Russian, etc.). Adding a key to only some dictionaries breaks the locale switch and is a defect.

**Dictionary keys are identifiers, not data.** A key must match `^[A-Za-z0-9_]+$` — Latin letters, digits and `_` only. No Cyrillic, no spaces, no punctuation, no separators like `;` or `/`. Ordinary keys stay `camelCase` like the rest of the dictionary; keys that stand for enum values are `UPPER_SNAKE_CASE` and identical to the enum member they map to.

The failure mode this rule prevents: a raw supplier value gets pasted in as a key, producing entries like `"GSM; microwave; television"` or `"муниципальная"`. That key is now part of the public `I18n` type, it is unreachable via dot access, and it silently breaks the moment the data source rewords the value. If a value looks unfit to be a key, that is a signal the **data** needs a code — fix it upstream instead of encoding the raw string here. A value carrying several entities separated by `;` is a list, and belongs in the data as an array of codes, not as one composite key.

**Type a value dictionary through its enum.** When a bounded set of values has an enum, the dictionary is typed `Record<EEnumName, string>`. When there is no enum, declare a plain object type with explicit keys. Never type it as `Record<"literal" | "another", string>` — a union of string literals looks like a checked type but actually pins the source's exact spelling, so a reworded value fails at runtime instead of at compile time. This mirrors the record-shaped-map rule above: an enum-keyed `Record` is the default whenever an enum exists.

**`useI18nSelector` selects a narrow slice.** The selector returns the specific branch (or an object composed of a few specific branches) that the component actually needs — never the root `l`. Returning the whole dictionary subscribes the component to every translation change and hides which part of the dictionary it truly depends on. Reaching into `l` and then narrowing in the component body is the same mistake written differently.

**One `l` per component, and the selector argument is always `({ l })`.** The selector's result is bound to a single `const l`; reads look like `l.caloriesLabel`, never `card.caloriesLabel`. Build it by spreading the component's own primary branch and attaching the extra branches it needs as named keys:

```ts
const l = useI18nSelector(({ l }) => ({
  ...l.recipePage.card,
  units: l.common.units,
}));
```

A component with no primary branch (a shared fragment) skips the spread and keeps only named keys. Two shapes are defects: renaming the selector argument (`({ l: localization }) => …`) and destructuring the result into several names (`const { l, units } = …`). Both break the one convention that makes i18n reads greppable — `l` is the dictionary slice, everywhere.

**`src/types/i18n.types.ts` exports exactly one thing — the `I18n` interface.** That file is the shape of the dictionaries and nothing else. Helper types that happen to be used *inside* it — key unions, enum aliases, anything a dictionary branch is keyed by — are declared in the domain file that owns the concept (entity types in `src/types/<domain>.types.ts`) and imported here. Declaring them in `i18n.types.ts` inverts the dependency: consumers start importing domain vocabulary from the translations file, and the concept ends up owned by whichever layer first needed a dictionary key. Type placement rules from the section above apply unchanged; this is only the reminder that the dictionary file is never a shortcut home for a type.

