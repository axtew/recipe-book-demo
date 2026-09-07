# Pipeline profile — recipe-book

Machine-readable facts the global frontend pipeline (skills `frontend-plan` / `frontend-run` / `brainstorming`, agents `frontend-developer` / `frontend-reviewer`) reads first. Locate via Glob `**/pipeline-profile.md`; the repo root is the parent of this file's `.github/`.

<!-- validation_protocol отсутствует намеренно: матрица нужна только при ≥2 независимых runtime-проверках, а визуального прохода здесь нет. -->

**`EXECUTION.md` уже существует** — `plans/recipe-book-v1/EXECUTION.md`, в нём запись по Фазе 1, выполненной владельцем вручную. Оркестратор **дописывает** в него, а не инициализирует заново: перезапись затрёт историю первой фазы.

**`pipeline_spec: none`.** Разделы, на которые ссылается `frontend-run` («Status & routing vocabulary», «Artifact layout», «Review scopes»), скилл описывает у себя по тексту, а «Commit & EXECUTION.md protocol» здесь не нужен — при `commit_policy: owner` в пайплайне никто не коммитит. Если на первом прогоне чего-то не хватит — завести минимальный `pipeline-spec.md` и прописать путь сюда.

```yaml
project: recipe-book
repo_root: C:/Users/stevv/Desktop/recipe-book   # frontend-run читает этот ключ явно; при переносе папки поправить
conventions: .github/copilot-instructions.md      # generated from .github/instructions/*.md by build-instructions.ps1
pipeline_spec: none                                # no pipeline-spec.md here: status vocabulary and commit protocol come from the skills' defaults
plans_dir: plans/                                  # plans/<slug>/plan.md, baseline/, <phase>/iter-<N>/
commands:
  dev: pnpm dev
  format: pnpm format                              # scoped to `src` via package.json script; args ignored
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
