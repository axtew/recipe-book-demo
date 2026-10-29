Status: COMPLETED

# Phase L4 — iteration 2

## Phase goal

Agent instructions in English (14 files, no Russian copies), `docs/agents/architecture.md` split into a private tutorial and a public English `docs/architecture.md`, ADR 0035 recorded, references updated (plan amendment of 2026-10-29).

## What was implemented

- 14 files translated, with the content edits of plan step 2: `AGENTS.md`, `plans/README.md`, `docs/agents/{local-environment,pipeline-profile}.md`, `docs/agents/conventions/{code-style,components,data,i18n,routing,stack,structure,styling,testing,typing}.md`. Convention files reuse the pre-split English original (`git show bf2a443^:.github/instructions/30-conventions-generic.md`) where the text still matched; `data.md`, `routing.md`, `stack.md`, `styling.md` were translated from the current Russian. No `-ru.md` copies; the rule «English file changes -> its -ru.md changes» is not in `AGENTS.md`; the language rule points to ADR 0033 and ADR 0035.
- `AGENTS.md`: new title and intro (bilingual UI, ADR 0034), `STATUS.md` / `DEPLOY.md` stay link-less «working repository only», gender-neutral rule says it is about Russian text, the architecture rows point to `docs/architecture.md`.
- `i18n.md` «Project specifics» rewritten for the real state: `en.json` + `ru.json`, `detectLanguage` and `localStorage` storage, `useLanguage`, formats via `src/utils/helpers/locale.ts`, key-parity test, English style note and glossary. The Russian example words and the Russian glossary column are replaced by English descriptions because the verification requires zero Cyrillic in `docs/agents`.
- `pipeline-profile.md`: `comments_language: en`, i18n comment -> two dictionaries, YAML comments in English; a `localization` EXECUTION.md mention added.
- `plans/README.md`: `publication` status -> done, `localization` row added, note that new plans are English and old logs Russian, «Old name -> new» row for `docs/how-it-works.md` -> `docs/architecture.md`. Old section names in the mapping tables are given in English translation (the tables had to be Cyrillic-free) with a note saying so.
- Section names quoted by ADRs reproduced verbatim: «Purity of the domain module» (`data.md`), «Placement — one ladder for everything extracted» (`structure.md`), «Old name -> new» (`plans/README.md`).
- Split of `docs/agents/architecture.md`: the Russian text moved verbatim (`git mv`) to `plans/recipe-book-v1/architecture-tutorial.md`; its literal path added to `scripts/publish-exclude.txt` under «Learning material»; new English `docs/architecture.md` written per the amendment's keeps/drops/corrections; `docs/agents/architecture.md` is gone.
- ADR 0035 created (MADR shape); ADR 0033 status line -> `accepted; partly superseded by ADR 0035` (text otherwise untouched); `docs/decisions/README.md`: 0033 status updated, 0035 row added. ADRs 0003/0005/0012/0017: link target only. `STATUS.md` «Куда смотреть» row updated.

### Facts checked against the code for `docs/architecture.md`

- Five requests: `src/api/services/{categories (2 tables), products, recipes, cookLogs}.service.ts` + queries in `src/api/queries/`.
- Persister chain, `idbStorage`, `PersistQueryClientProvider` in `src/app/_queryClient.ts` / `App.tsx`; demo build uses a no-op persister (mentioned in one sentence).
- `gcTime` and `maxAge` = `CACHE_MAX_AGE` = 7 days, `CACHE_BUSTER` (`src/constants/caching.constants.ts`).
- `vite.config.ts`: `registerType: "autoUpdate"`, `includeAssets: ["favicon.svg", "dictionaries/*.json"]`, `display: "standalone"`.
- `wrangler.jsonc`: Cloudflare Workers Static Assets (not Pages).
- `createProductWithVariant` -> `rpc("create_product_with_variant")`; composite FK per ADR 0016.
- `numeric` arrives as `number` (services map rows; no «repository»).
- Nutrition: pinned variant else active variant, optional ingredients excluded, yield vs raw weight, `incompleteProducts`, snapshot in `cook_logs`.

## Files created

- `docs/architecture.md`
- `docs/decisions/0035-no-russian-copies-of-agent-instructions.md`
- `plans/recipe-book-v1/architecture-tutorial.md` (moved from `docs/agents/architecture.md`, content unchanged; staged as a rename)
- `plans/localization/l4/iter-2/DEV-REPORT.md`

## Files modified

- `AGENTS.md`, `plans/README.md`, `STATUS.md`
- `docs/agents/local-environment.md`, `docs/agents/pipeline-profile.md`
- `docs/agents/conventions/{code-style,components,data,i18n,routing,stack,structure,styling,testing,typing}.md`
- `docs/decisions/0003-spa-pwa-on-vite.md`, `0005-tanstack-query-persisted-cache.md`, `0012-whole-dataset-in-client.md`, `0017-nutrition-module-purity.md` (link target only), `0033-english-repository-language.md` (status line only), `docs/decisions/README.md`
- `scripts/publish-exclude.txt` (one literal path)

Deleted: `docs/agents/architecture.md`. Not touched: `scripts/publish-public.ps1`, `plans/localization/plan.md`, `EXECUTION.md`, `l4/iter-1/`.

## Verification results

- `rg -n "[А-Яа-яЁё]" AGENTS.md plans/README.md docs/agents docs/architecture.md docs/decisions/0035-*.md` -> 0 matches (rg exit 1).
- `rg -n "agents/architecture" --glob "!plans/{recipe-book-v1,publication,localization}/**"` -> 0 matches (rg exit 1).
- Publish dry run: temporary clone of the working repo in the session scratchpad, the phase's working-tree changes copied in and committed there (never in the working repo); `pwsh scripts/publish-public.ps1 -Source <clone> -WorkDir <tmp>` without `-Remote`. First run FAILED on my own link from ADR 0035 to the excluded `scripts/publish-public.ps1`; the link was replaced by plain code text and the second run printed `All checks passed.` (86 commits, nothing pushed). In the filtered tree `plans/recipe-book-v1/architecture-tutorial.md` is absent (also `git log` for it is empty) and `docs/architecture.md` is present; the link check found no link from a public file to an excluded path. Temporary clones deleted.
- `pnpm lint` -> passed (eslint, no output).
- Not run: `pnpm build`/`pnpm test` (the phase touches only Markdown, one `.txt` list; not named in the phase verification).
- Runtime/browser: N/A (Visual Verification N/A).

## Known issues / follow-ups

- The next public push needs `-Force` once (exclude list changed).
- The orchestrator still has to add the `docs/architecture.md` / `docs/architecture.ru.md` row to the L8 table in the plan (not done here, as instructed).
- `plans/recipe-book-v1/architecture-tutorial.md` is verbatim, so its relative links (`../decisions/...`) no longer resolve from its new location; it is excluded from the public copy, so no check is affected.
- Stale in untouched files: the header comment of `.env.demo` still says the project values are placeholders, although real values are set (the `local-environment.md` table was written without the «placeholders» wording). Owner-only file.
- Stale code comments in Russian (e.g. `src/app/_queryClient.ts`) are for L5–L7.
- Planner drift: the plan's step 2 asked `i18n.md` for the glossary and gender examples, which conflicts with the zero-Cyrillic verification; resolved with English descriptions (see above). The L2 glossary table was reproduced as concept -> English term.
