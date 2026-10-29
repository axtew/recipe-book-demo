# Pipeline profile — recipe-book

Machine-readable facts that the global frontend pipeline (the skills `frontend-plan` / `frontend-run` / `brainstorming`, the agents `frontend-developer` / `frontend-reviewer`) reads first. It is found with Glob `**/pipeline-profile.md`; the repository root is `repo_root` below (not the parent of this file).

<!-- validation_protocol is absent on purpose: the matrix is needed only for ≥2 independent runtime checks, and there is no visual pass here. -->

**`EXECUTION.md` already exists** — `plans/recipe-book-v1/EXECUTION.md` has the entry for Phase 1, done by the owner by hand; for the `publication` task the log is `plans/publication/EXECUTION.md`, for `localization` — `plans/localization/EXECUTION.md`. The orchestrator **appends** to the task's log and does not initialize it anew: overwriting would erase the history.

**`pipeline_spec: none`.** The sections that `frontend-run` refers to («Status & routing vocabulary», «Artifact layout», «Review scopes») are described by the skill in its own text, and «Commit & EXECUTION.md protocol» is not needed here — with `commit_policy: owner` nobody commits in the pipeline. If something is missing on the first run, create a minimal `pipeline-spec.md` and put its path here.

**Live checks run only on the local Supabase stack.** `pnpm dev` points at it by itself (`.env.development`); the cloud is a working database and must not be written to. If Docker or the stack is not running, bring it up yourself; the order and the dev user credentials are in [`local-environment.md`](local-environment.md).

```yaml
project: recipe-book
repo_root: C:/Users/stevv/Desktop/recipe-book   # frontend-run reads this key explicitly; fix it if the folder is moved
conventions: AGENTS.md                             # a short map; agents follow its «The task touches → read» table into docs/agents/
pipeline_spec: none                                # no pipeline-spec.md here: status vocabulary and commit protocol come from the skills' defaults
plans_dir: plans/                                  # plans/<slug>/plan.md, baseline/, <phase>/iter-<N>/
commands:
  dev: pnpm dev                                    # local Supabase via .env.development; bring Docker + `npx supabase start` up first (docs/agents/local-environment.md)
  format: pnpm format                              # scoped to `src` via package.json script; args ignored
  lint: pnpm lint                                  # full run, never per-file
  build: pnpm build
  test: pnpm test                                  # vitest; the domain module must pass in Node without DOM
design:
  source: none                                     # no Figma: every UI surface is `Free choice`; no figma-extract, no design fidelity
visual_verification:
  enabled: false                                   # no frontend-visual-reviewer; phases write `Visual Verification: N/A`
i18n:
  enabled: true                                    # two dictionaries, en.json and ru.json; every key lives in both
  dictionaries: public/dictionaries/
comments_language: en
commit_policy: owner                               # agents never commit (AGENTS.md → «Working rules»); frontend-run skips its commit step
```
