# Pipeline profile — recipe-book

Machine-readable facts the global frontend pipeline (skills `frontend-plan` / `frontend-run` / `brainstorming`, agents `frontend-developer` / `frontend-reviewer`) reads first. Locate via Glob `**/pipeline-profile.md`; the repo root is the parent of this file's `.github/`.

<!-- validation_protocol отсутствует намеренно: матрица нужна только при ≥2 независимых runtime-проверках, а визуального прохода здесь нет. Корень репозитория определяется как родитель папки .github/ — отдельным ключом не задаётся. -->

```yaml
project: recipe-book
conventions: .github/copilot-instructions.md      # generated from .github/instructions/*.md by build-instructions.ps1
pipeline_spec: none                                # no pipeline-spec.md here: status vocabulary and commit protocol come from the skills' defaults
plans_dir: plans/                                  # plans/<slug>/plan.md, baseline/, <phase>/iter-<N>/
commands:
  dev: pnpm dev
  format: pnpm prettier --write <files>
  lint: pnpm lint                                  # full run, never per-file
  build: pnpm build
  test: pnpm test                                  # vitest; the domain module must pass in Node without DOM
design:
  source: none                                     # no Figma: every UI surface is `Free choice`; no figma-extract, no design fidelity
visual_verification:
  enabled: false                                   # no frontend-visual-reviewer; phases write `Visual Verification: N/A`
i18n:
  enabled: true                                    # один словарь ru.json; инфраструктура заложена, чтобы тексты сразу жили в одном месте
  dictionaries: public/dictionaries/
comments_language: ru
commit_policy: owner                               # agents never commit (CLAUDE.md → «Как выполнять фазу»); frontend-run skips its commit step
```
