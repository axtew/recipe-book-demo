# Книга рецептов — Copilot Instructions

<!-- Черновик, перенесён из Carbon-spa 2026-08-29. Проверить против CLAUDE.md и decisions.md; всё, что дублирует их, — убрать отсюда и оставить ссылку. -->

## Project Overview

Personal mobile-first app for two people: product reference, recipes with nutrition (КБЖУ) calculation, search, cooking journal. Russian UI. The product boundaries, data model and stack decisions live in `decisions.md` (source of truth), the implementation plan in `plans/recipe-book-v1/plan.md`, the working-split rules (what the owner does by hand: `supabase/**`, `.env`, `src/types/database.types.ts`, all of `src/api/**`) in `CLAUDE.md`. This file holds only code conventions.

## Build & environment

Stack and scripts are in `package.json` — read it rather than a list here. The pipeline verifies against `pnpm lint` and `pnpm build`; `pnpm test` runs vitest. After any schema change the owner regenerates `src/types/database.types.ts` — never edit it by hand.

## Hard invariants

Defined in `CLAUDE.md` → «Жёсткие инварианты» (nutrition arithmetic only in `src/domain/nutrition/`; no deletes, only `archived_at`; no silent zeros; rounding only at display; the generated row shape never leaves the service layer; dates as `YYYY-MM-DD` strings; iOS first; new dependencies only with permission; data loaded whole into the client). A violation is a defect even when the code works — the reviewer treats each as `Issue source: code`.
