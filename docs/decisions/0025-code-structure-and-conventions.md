# 0025. Repository structure and code conventions come from `Carbon-spa`, with changes

- Status: accepted
- Date: 2026-08-30

## Context and problem

The project conventions and structure are ported from the work project `Carbon-spa` (instruction port — 2026-08-29/30). We need to decide what is taken as is, what is changed and what is dropped.

## Considered options

1. **Take the structure and conventions whole, with targeted corrections.**
2. Write our own from scratch.

Targeted forks:
- "only `_internal/`" or `_internal/` + `fragments/`;
- the "no `&&` hacks" rule;
- the "border-width ≥ 2px and a multiple of 2" rule;
- a separate file `50-code-style.md` for the placement rules.

## Decision

- **The structure and conventions are taken from `Carbon-spa` whole.** (Originally the instructions were assembled by a script from parts; the layout was changed on 2026-10-21, see "Consequences".)
- **Only `_internal/`, no `fragments/`.** In `Carbon-spa`, `fragments/` is legacy from old projects that nobody cleaned out; here we fix a single term right away.
- **The placement rules are collected in one section** — "Placement — one ladder for everything extracted" ([`conventions/structure.md`](../agents/conventions/structure.md)). The ladder is stated once and applied to types, helpers, constants, hooks and subcomponents. Before that it was described twice and partially: the steps "lift to the component level" and "lift to the group level" were not described at all. We did not create a separate file `50-code-style.md`: the generic part already held the whole code style, so there was nothing to move there.
- **Pages and routes are separated:** `src/routes/` holds only the tree, a screen lives in `src/pages/<Name>Page/` ([ADR 0006](0006-tanstack-router-code-based.md)).
- **The "no `&&` hacks" rule is not introduced** until the first real case. It is a reserve for future shared components, which do not exist yet; the only current use of `&&` is raising specificity over Mantine, and it is explicitly sanctioned.
- **The "border-width ≥ 2px and a multiple of 2" rule is removed** from the ported generic core. It solved the problem of disappearing and blurry hairline borders at fractional device pixel ratios and inside transformed containers; on modern iOS Safari at DPR 2–3 a 1px border lands on exactly 2–3 physical pixels and is drawn crisply. There is no design source here, and Mantine draws borders at 1px — the rule would force overriding the kit on every component to match a non-existent mockup. If some border looks bad on a real iPhone, we fix it point by point. In `Carbon-spa` the rule was not touched: there it concerns their design system and their set of devices, a separate decision.

## Consequences

- The original layout: conventions were separate parts that a generator assembled into one file, plus a pipeline profile for the global agents (the former names are in the "Old name → new" table in [`plans/README.md`](../../plans/README.md)). Since 2026-10-21 the layout is different: [`AGENTS.md`](../../AGENTS.md) is the map, conventions by topic are in [`docs/agents/conventions/`](../agents/conventions/), the pipeline profile is [`docs/agents/pipeline-profile.md`](../agents/pipeline-profile.md); generation is cancelled.
- The language of conventions and documentation — [ADR 0031](0031-russian-language-of-repository.md).
