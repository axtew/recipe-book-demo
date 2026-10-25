# 0017. Nutrition calculation is an isolated pure module, no silent zeros

- Status: accepted
- Date: 2026-08-02

## Context and problem

Nutrition calculation and scaling are the heart of the app. The numbers must be verifiable by tests, the module must be reusable (including by server code and a future LLM service), and wrong numbers must not be masked by zeros. Models hallucinate numbers, and wrong numbers are worse than missing ones.

## Considered options

1. **An isolated module of pure functions without React.**
2. Calculation in components and hooks, in place.
3. Calculation by the LLM — rejected: the LLM does extraction and matching (parse a recipe, match a product to the product list, suggest the nutrition of a new product), while a deterministic TS module does all the arithmetic ([ADR 0028](0028-local-llm-assistant-deferred.md)).

## Decision

- Nutrition calculation and scaling are an **isolated module of pure functions without React**, so that server code (including a future LLM service) can import it. It lives in `src/domain/nutrition/`, does not import React, Supabase or Mantine, and runs in Node without a DOM.
- **Rounding only in the UI** (kcal as integers, protein/fat/carbs to one decimal place); the domain works with raw numbers.
- **There are no silent zeros:** when a product's nutrition is not filled in, there is an explicit warning with the list of problem products, not silent zeros. A product without nutrition produces an entry in `incompleteProducts`.
- Optional ingredients (`is_optional`) are not included in the nutrition calculation.
- The module's internal types stay in `src/domain/nutrition/_types.ts`: outside the module they are hardly needed.

## Consequences

- No component, hook or service calculates nutrition itself — [`conventions/data.md`](../agents/conventions/data.md) → "Purity of the domain module".
- The module is covered by tests before any interface ([`conventions/testing.md`](../agents/conventions/testing.md)).
- What the calculation means for a recipe — [`architecture.md`](../agents/architecture.md).
