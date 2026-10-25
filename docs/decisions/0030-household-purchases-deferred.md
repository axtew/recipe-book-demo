# 0030. Household purchases are a reserve for v3

- Status: deferred
- Date: 2026-08-02

## Context and problem

Scenario: build a shopping list for the household in general (not only products for recipes); an assistant looks at the purchase history and says "bought 3 weeks ago, usually lasts a month — check".

## Considered options

1. Extend `Product` — does not fit: washing powder has no nutrition and no active variant.
2. **A neighbouring pair of tables** (`HouseholdItem` + `Purchase` with a date and a quantity).

## Decision

Deferred (v3). When it comes — a neighbouring pair of tables `HouseholdItem` + `Purchase`, `Product` is not extended.

## Consequences

- "Usually lasts a month" is statistics over purchase intervals, ordinary arithmetic. The LLM is needed there at most for wording ([ADR 0028](0028-local-llm-assistant-deferred.md)).
- The bridge between the domains is `ProductCategory.sort_order` (the order of store departments, [ADR 0016](0016-variants-and-active-variant.md)).
- The idea — [`BACKLOG.md`](../../BACKLOG.md) ("Household inventory").
