# 0009. Package manager is pnpm

- Status: accepted
- Date: 2026-08-31

## Context and problem

The choice of pnpm was originally the executor's silent default, with no discussion; it was justified retroactively on 2026-08-31. The owner's work projects (`Carbon-spa`, `ecovion`, `aramco`) use Yarn 4, and by the principle "same as at work, so there is nothing to relearn" Yarn would be the logical choice.

## Considered options

1. **pnpm.**
2. Yarn 4 — as in the work projects. The analysis showed that the original reason for choosing Yarn there — workspaces for a repository with nested git projects — is no longer in use: `workspaces` is not declared in any of the three.
3. Bun — the fastest as a manager, but it is an extra tool with different behaviour in edge cases and unclear support in the Cloudflare Pages builder; not seriously considered.
4. Deno — a runtime, not a manager for a Vite project; not seriously considered.

## Decision

**pnpm.** The owner decided, on the contrary, to move the work projects to pnpm.

## Consequences

- The package manager has no effect on **build** speed at all — that is determined by Vite, esbuild/Rollup and `tsc`. It affects only the dependency installation time and the disk space (a shared store with hardlinks).
