MODE: review
STATUS: NEEDS_CHANGES
Issue source: code

## Summary

Phase L4 (iteration 2, amended 2026-10-29) reviewed: 14 translated agent-instruction files, the new public `docs/architecture.md`, the verbatim move of the old architecture file to `plans/recipe-book-v1/architecture-tutorial.md`, ADR 0035, and the reference fixes. The translations are faithful: I compared AGENTS.md, data.md, structure.md, components.md, i18n.md, testing.md, code-style.md, routing.md, stack.md, styling.md, typing.md, local-environment.md and plans/README.md against `git show HEAD:<path>` and found no dropped, softened or invented rule. One concrete claim in `docs/architecture.md` is false against the code (the plan demanded that every claim be verified), so the verdict is NEEDS_CHANGES with a single small code fix.

## Checks run

- Cyrillic search over AGENTS.md, plans/README.md, docs/agents, docs/architecture.md, docs/decisions/0035-*.md, docs/decisions/README.md: 0 matches.
- `rg "agents/architecture"` outside `plans/{recipe-book-v1,publication,localization}`: 0 matches.
- ADR-quoted section names present verbatim: "Purity of the domain module" (data.md:47), "Placement — one ladder for everything extracted" (structure.md:10), "Old name → new" (plans/README.md:56).
- The `git mv` is a 100% rename (`architecture-tutorial.md`, 262 lines), so it is verbatim. The literal path is in `scripts/publish-exclude.txt` under "Learning material". `publish-public.ps1` and the exclude file's pattern rules are untouched.
- ADR 0033: only the status line changed. ADRs 0003/0005/0012/0017: only the link target changed. The README index rows follow the 0002/0034 precedent ("accepted; partly superseded by ADR 00NN"). ADR 0035 has the same MADR sections and header lines as 0033/0034.
- `pnpm lint`: passes (re-run). I did not repeat the publish dry run, and the report does not claim it was skipped. The `architecture.md` links all point to files that are in the public copy.
- Facts in `docs/architecture.md` checked against the code:
  - `src/app/_queryClient.ts`: the idb-keyval, async-storage-persister and `PersistQueryClientProvider` chain, `gcTime` and `maxAge` = `CACHE_MAX_AGE` = 7 days, `CACHE_BUSTER`, and the no-op persister for the demo build.
  - `vite.config.ts`: `registerType: "autoUpdate"`, `includeAssets` containing `dictionaries/*.json`, `display: "standalone"`.
  - `wrangler.jsonc`: Workers Static Assets.
  - Services: five requests (two category tables, products with variants, recipes, cook_logs).
  - `createProductWithVariant` calls the `create_product_with_variant` rpc. The composite FK `(active_variant_id, id)` and its insert order match the migration.
  - Pinned variant else active variant, optional ingredients excluded, `incompleteProducts`, yield vs raw weight.
  - Query hook `useRecipesQuery` and the `products` key invalidation exist.

## Issues

### Code issues

#### Factual accuracy of docs/architecture.md
- [code] `docs/architecture.md:130` — "The app works with `activeVariantId` and `kcal100`, and does not know `created_at` at all" is false. `src/api/services/products.service.ts:32` maps `created_at` to `createdAt` on every variant. The sentence was carried over from the old Russian text and survived the "verify every other concrete claim" instruction. Fix: use an example the services really drop. `updated_at` is not mapped in the product, variant, or any other entity mapper (it is used only to build the photo URL in `recipes.service.ts`). Alternatively reword it to "does not need most of the row's columns".

## Notes (non-blocking)

- `docs/architecture.md:15` — the ASCII diagram line `│ Cache Storage — the code│` is one space short, so the right border is misaligned. Cosmetic.
- `docs/architecture.md:32` — "Both are visible in DevTools → Application" is a one-line remnant of the dropped "What to look at in DevTools" section. It is harmless next to the kept offline-symptom line, so the owner can keep or drop it.
- ADR 0035, Decision bullet 3 and Consequences, say `BACKLOG-ru.md` "is excluded ... by its literal path in `scripts/publish-exclude.txt`" in the present tense. Today the file does not exist and the path is not in the list. The plan assigns both to L8 (amendment "Phase L8 — added 2026-10-29"). Until L8 lands the ADR describes a future state. Acceptable because the plan fixes the order, but L8 should not forget it. Also, the L8 table row for `docs/architecture.ru.md` was added by the orchestrator, so the developer did not own it.
- `docs/agents/conventions/i18n.md`, "Project specifics": it names `_language.ts`, `LANGUAGE_STORAGE_KEY`, the test path `src/context/I18nContext/__tests__/dictionaries.test.ts`, and `nutrients.ts` / `dates.ts`. The plan asked only for `locale.ts`, `useLanguage`, detection and storage, and the key-parity test. The extra file-level anchors are the kind that rot first (global instruction: prefer the stablest anchor). Consider keeping the symbol names (`detectLanguage`, `useLanguage`, `getDisplayLanguage`) and dropping the file names. The sentence "A new formatter reads the language from `locale.ts` and does not take it as an argument" is a new normative rule. It does follow plan decision line 50, but it is a rule, not a translation, so the owner should confirm it.
- `i18n.md`: the Cyrillic-0 constraint forced the gender-neutral examples and the glossary's Russian column into English descriptions ("the impersonal and passive wordings already in `ru.json`"). The rule stays intact, but an agent no longer sees the concrete forms; it must open `ru.json`, and the text says so. The line "Russian quotes are written as plain English quotes" is ambiguous. It means the guillemets «…» become plain quotes. Reword it.
- `docs/agents/local-environment.md`: the table row for `.env.demo` lost "placeholders until the owner fills in the values". That is correct for the current state (the demo is deployed, per the git log). It is an unannounced content edit, though, and `data.md` still says "the owner fills the values in when the project is created" (a pre-existing stale statement from the original). A follow-up should align the two.
- `plans/README.md`: the moved tutorial and the old `docs/agents/architecture.md` path have no row in "Old name → new". Old `recipe-book-v1` artifacts that cite that path will not resolve. The plan did not ask for it, so this is only a hint for the owner.
- Page-specific exports: not applicable (docs-only phase).
