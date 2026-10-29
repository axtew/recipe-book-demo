# Code style

## Equality

Strict `===` / `!==` only. `==` / `!=` are forbidden (enforced by eslint `eqeqeq: always`), **including against `null`** — write `x === null` / `x !== null` / `x === undefined`, never the loose `x == null`.

## Language

Code comments (inline `//`, block `/* */`, JSDoc `/** */`) and the documentation that lives in the repository (`README.md` files inside `src/`, `docs/`, per-module READMEs and the like) are written in **English**. So are developer-facing messages (`throw new Error(...)`, `console.*`) and test names. Technical terms stay as they are: type, function, file, API and library names, enum members and identifiers in code are written verbatim.

Two things stay as they are: strings that the code compares with the database stay byte-identical to the database side, and test data stays Russian where the test checks Russian text (search, sorting, Russian formatting, dictionary content).

The rest of the repository prose (instructions for agents, ADRs, new files in `plans/`) is English too: [ADR 0033](../../decisions/0033-english-repository-language.md). Commit messages are English from now on.

## Comments — when, and what goes first

A comment is written only where the code is genuinely non-obvious, and it describes a **durable fact about the code or the system** — never how the code came to be. Apply two filters in order:

1. **Is a comment needed at all?** Not if it restates the name, type or signature; not if it retells the task, the plan, the review, or the investigation. A small component with a descriptive name needs none. Product code never contains references to design nodes, `plan.md` / `figma*.md` / `PROBLEMS.md`, phase or round numbers, or "as of this task" narration — these are pipeline artifacts, and a comment that survives its context is a comment that misleads the next reader.
2. **If needed — purpose first, mechanism after.** The opening sentence says *what this is / what it does*, without "how" and without "why this way". Mechanism, rationale, constraints and gotchas follow in a separate paragraph — and **only** the parts that pass filter 1 on their own (a non-obvious decision, an external constraint). If nothing survives, the comment ends after the purpose line; that is a complete comment, not an unfinished one. Reviewer's test: covering everything but the first line, do I know why this entity exists?

A comment states what the code **does**, not what was intended. A comment that claims a property the code lacks is worse than the defect: it outlives both the bug and the next refactor. When a requirement could not be met, document the residual gap honestly instead of the wished-for behaviour.
