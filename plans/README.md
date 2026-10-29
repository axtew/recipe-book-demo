# Plans

The project is developed through an agent pipeline: plan → phase (developer) → static review → owner review → commit.
All its artifacts are here, so the process can be traced.

New plans, reports and reviews are written in English ([ADR 0033](../docs/decisions/0033-english-repository-language.md)). The existing working logs are not translated and stay in Russian; sections appended to them stay Russian too.

| Task | Status | Discussion | Plan | Log |
|---|---|---|---|---|
| `recipe-book-v1` — the first version of the app | done: mandatory phases 1–12; phase 13 (nutrition from a label photo) is conditional, after v1 | — | [plan.md](recipe-book-v1/plan.md) (DB schema, domain types, the nutrition module contract, the screen map, the phases) | [EXECUTION.md](recipe-book-v1/EXECUTION.md) |
| `publication` — the public version and the demo | done: phases P1–P5 | `publication/brainstorm.md` (working repository only) | `publication/plan.md` (working repository only) | `publication/EXECUTION.md` (working repository only) |
| `localization` — English as the main language, Russian second | in progress: phases L1–L8 | — | [plan.md](localization/plan.md) | [EXECUTION.md](localization/EXECUTION.md) |

Ideas beyond the plans are in [BACKLOG.md](../BACKLOG.md). Accepted decisions are in [docs/decisions/](../docs/decisions/README.md).

## How development works

1. **Plan.** The owner and the orchestrator discuss the approach (`brainstorm.md`), then `plan.md` is written, with phases and acceptance criteria (the «Verification» of each phase).
   Decisions made along the way are appended to the plan's «Amendments» section.
2. **Phase.** The executor (a developer agent) carries out one phase of the plan, captures the `lint`/`build` baseline, writes the code and the report `DEV-REPORT.md`.
3. **Static review.** A reviewer agent reads the diff and the report and writes `REVIEW.md` with a status (`APPROVED` / `NEEDS_CHANGES`) and the source of the findings (`code` / `plan` / `both`).
   On `NEEDS_CHANGES` the owner chooses: amend the plan, redo the plan, or skip the finding; the executor goes to the next iteration.
4. **Owner review.** The owner looks at the changes in the working tree.
5. **Commit.** The owner commits, not the agents. The message format follows the existing convention of the repository; there are no traces of tools in git.

### Phase protocol

By default one session is one phase.

**In an ordinary session** the owner may explicitly ask for several phases in a row («do phases 2–3») — they then run one after another, but the rules below apply to **each** separately: its own list of files, its own pass through the «Verification» section, its own entry in `EXECUTION.md`. The result for each phase is a separate block, not one common «done».

**Through the `frontend-run` skill** — strictly one phase per call; this is built into the skill itself. Several phases = several calls.

**The first failed check stops the whole chain.** Do not move to the next phase to «fix it later»: the next one would be built on a broken foundation, and two layers would have to be sorted out instead of one.

1. Read the [decisions](../docs/decisions/README.md) and the section of the needed phase in the plan, in full.
2. Do **only this phase**. Do not touch files that are not in its list. If you notice a needed change outside the phase, say so instead of silently making it.
3. At the end go through the items of this phase's **«Verification»** section and report on each: done or not, with the actual command output. Do not report success where you did not check.
4. **Do not commit.** The changes stay in the working tree — the project owner reviews and commits them.

If the plan diverges from reality (what it refers to does not exist; a step contradicts another decision; it turns out the idea does not work) — **stop and ask**. Do not invent a workaround silently: the plan is fixed deliberately, through an addition in the «Amendments» section.

The pipeline profile for the agents is [`docs/agents/pipeline-profile.md`](../docs/agents/pipeline-profile.md).

## Artifact layout

```
plans/<task>/
  plan.md                         phases, acceptance criteria, the «Amendments» section
  brainstorm.md                   the approach discussion (if there was one)
  EXECUTION.md                    the run log: one entry per phase
  baseline/                       lint and build logs before the changes (README.md — what was already red)
  <phase>/iter-<N>/               iteration reports: DEV-REPORT.md, REVIEW.md
```

## Old name → new

The artifacts of `recipe-book-v1/` are records of how things were and are not edited; their references to former files are read by the tables below. The old files were in Russian: the section names in the tables are given in English translation.

| Was | Now |
|---|---|
| `CLAUDE.md` | [`AGENTS.md`](../AGENTS.md); `CLAUDE.md` is now a single line `@AGENTS.md` |
| `.github/copilot-instructions.md` (assembled from `.github/instructions/`) | [`docs/agents/conventions/`](../docs/agents/conventions/) by topic; the generation is cancelled |
| `.github/instructions/00-project.md`, `30-conventions-generic.md`, `40-conventions-project.md` | the same (sections — in the table below) |
| `.github/pipeline-profile.md` | [`docs/agents/pipeline-profile.md`](../docs/agents/pipeline-profile.md) |
| `.github/upstream-conventions-inbox.md` | deleted: an inbox of rules from a shared source, nothing was waiting in it (`Pending: none`) |
| `decisions.md` | [`docs/decisions/`](../docs/decisions/README.md) — ADRs (sections — in the table below) |
| `recipe-app-v1-prompt.md` | [`docs/task.md`](../docs/task.md) |
| `docs/how-it-works.md` | [`docs/architecture.md`](../docs/architecture.md) |

### `CLAUDE.md` and `.github/copilot-instructions.md` — sections

| Section | Where it went |
|---|---|
| CLAUDE.md → «Required reading before any work» and «For reference» | [`AGENTS.md`](../AGENTS.md) → «Before work» |
| CLAUDE.md → «Work split» | [`AGENTS.md`](../AGENTS.md) → «Working rules»; the full text — [`conventions/data.md`](../docs/agents/conventions/data.md) → «Migrations and the work split»; the decision — [ADR 0026](../docs/decisions/0026-work-split-lifted.md) |
| CLAUDE.md → «Local environment» | [`docs/agents/local-environment.md`](../docs/agents/local-environment.md) |
| CLAUDE.md → «How to carry out a phase» | «Phase protocol» above; in short — [`AGENTS.md`](../AGENTS.md) → «Working rules» |
| CLAUDE.md → «Hard invariants» | [`AGENTS.md`](../AGENTS.md) → «Hard invariants» |
| CLAUDE.md → «Code conventions» | replaced by the «What to read for a task» table in [`AGENTS.md`](../AGENTS.md) |
| CLAUDE.md → «Commands», «What the project does not have» | [`AGENTS.md`](../AGENTS.md) → «Commands», «What the project does not have» |
| copilot-instructions → «Project Overview» | [`AGENTS.md`](../AGENTS.md) (the header) |
| copilot-instructions → «Build & environment» | [`AGENTS.md`](../AGENTS.md) → «Commands»; [`conventions/testing.md`](../docs/agents/conventions/testing.md) |
| copilot-instructions → «Hard invariants» | [`AGENTS.md`](../AGENTS.md) → «Hard invariants» |
| «File naming», «Placement», «Export discipline», «Component size» | [`conventions/structure.md`](../docs/agents/conventions/structure.md) |
| «Equality», «Comments & docs language», «Comments — when, and what goes first» | [`conventions/code-style.md`](../docs/agents/conventions/code-style.md) |
| «Strong typing» | [`conventions/typing.md`](../docs/agents/conventions/typing.md) |
| «Loading states», «Compound components», «Extend the existing family» | [`conventions/components.md`](../docs/agents/conventions/components.md) |
| «Styling», «Styling — project specifics» | [`conventions/styling.md`](../docs/agents/conventions/styling.md) |
| «i18n — every locale always», «i18n — project specifics» | [`conventions/i18n.md`](../docs/agents/conventions/i18n.md) |
| «Data access — the only path to the backend», «Domain module purity» | [`conventions/data.md`](../docs/agents/conventions/data.md) |
| «Stack is fixed» | [`conventions/stack.md`](../docs/agents/conventions/stack.md) |
| «Routes and pages are different layers» | [`conventions/routing.md`](../docs/agents/conventions/routing.md) |

### `decisions.md` — sections

References of the form `decisions.md §N` in old reports are read like this:

| Section | ADR |
|---|---|
| §1 Product and boundaries | [0001](../docs/decisions/0001-personal-app-for-two.md), [0002](../docs/decisions/0002-russian-ui-with-i18n.md) |
| §2 Stack — frontend | [0003](../docs/decisions/0003-spa-pwa-on-vite.md), [0004](../docs/decisions/0004-styled-components-and-mantine.md), [0005](../docs/decisions/0005-tanstack-query-persisted-cache.md), [0006](../docs/decisions/0006-tanstack-router-code-based.md), [0007](../docs/decisions/0007-zod-and-own-form-hook.md), [0008](../docs/decisions/0008-dnd-kit-for-sorting.md), [0009](../docs/decisions/0009-pnpm-package-manager.md) |
| §3 Stack — backend and hosting | [0010](../docs/decisions/0010-supabase-without-own-backend.md), [0011](../docs/decisions/0011-manual-accounts-signup-off.md), [0012](../docs/decisions/0012-whole-dataset-in-client.md), [0005](../docs/decisions/0005-tanstack-query-persisted-cache.md) (offline), [0013](../docs/decisions/0013-cloudflare-hosting.md) |
| §4 Data model | [0014](../docs/decisions/0014-archiving-instead-of-deletes.md), [0015](../docs/decisions/0015-grant-plus-rls.md), [0016](../docs/decisions/0016-variants-and-active-variant.md), [0017](../docs/decisions/0017-nutrition-module-purity.md), [0018](../docs/decisions/0018-cook-log-snapshot-and-dates.md), [0019](../docs/decisions/0019-dish-categories-many-to-many.md), [0020](../docs/decisions/0020-recipe-content-and-backup.md), [0025](../docs/decisions/0025-code-structure-and-conventions.md) (moving the conventions) |
| §5 UX | [0021](../docs/decisions/0021-mobile-first-ux.md) |
| §6 Local LLM — a reserve | [0028](../docs/decisions/0028-local-llm-assistant-deferred.md) |
| §6.5 External nutrition sources | [0027](../docs/decisions/0027-external-nutrition-sources.md) |
| §6.7 Dish weight | [0020](../docs/decisions/0020-recipe-content-and-backup.md) |
| §6.8 Multi-tenancy and open sign-up | [0029](../docs/decisions/0029-multi-tenancy-deferred.md) |
| §7 Household purchases | [0030](../docs/decisions/0030-household-purchases-deferred.md) |
| §7.5 Repository architecture | [0022](../docs/decisions/0022-data-access-path-and-services.md), [0025](../docs/decisions/0025-code-structure-and-conventions.md), [0006](../docs/decisions/0006-tanstack-router-code-based.md) |
| §7.6 The data layer | [0022](../docs/decisions/0022-data-access-path-and-services.md), [0023](../docs/decisions/0023-rpc-for-multi-step-writes.md), [0024](../docs/decisions/0024-no-external-state-store.md), [0012](../docs/decisions/0012-whole-dataset-in-client.md), [0007](../docs/decisions/0007-zod-and-own-form-hook.md), [0026](../docs/decisions/0026-work-split-lifted.md) |
| §7.7 The work split is lifted | [0026](../docs/decisions/0026-work-split-lifted.md) |
| §8 R-1 / R-2 / R-3 / R-4 / R-5 | [0004](../docs/decisions/0004-styled-components-and-mantine.md) / [0008](../docs/decisions/0008-dnd-kit-for-sorting.md) / [0010](../docs/decisions/0010-supabase-without-own-backend.md) / [0001](../docs/decisions/0001-personal-app-for-two.md) / [0019](../docs/decisions/0019-dish-categories-many-to-many.md) |
| §9 Change log | not carried over: the dates and content of the entries are in the ADRs themselves, the rest is git history |
