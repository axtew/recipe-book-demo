# 0028. Local LLM is a reserve for v2+, not doing now

- Status: deferred
- Date: 2026-08-02

## Context and problem

A possible assistant (recipe parsing, product matching, menu planning) needs a model. The boundaries must be laid down so that this is cheap later, and nothing is done in v1.

Hardware: RTX 3070 with 8 GB VRAM, 16 GB RAM, Windows. Realistically: 7–9B models quantised to Q4 (~5 GB) with a context of 8–16k, the speed is brisk. 12–14B no longer fit entirely, and partial offloading to RAM slows things down sharply. Run through Ollama or LM Studio.

## Considered options

1. **Do not do it in v1, lay down the structure.**
2. A cloud API — as a fallback for heavy conversational tasks (menu planning): a local 8B may not be enough; it costs pennies at this volume.
3. RAG and a vector database — **not needed**: two hundred recipes fit into the context entirely. `pgvector` exists in Supabase if it is ever needed.

## Decision

- **The LLM does not calculate nutrition** ([ADR 0017](0017-nutrition-module-purity.md)). Models hallucinate numbers, and wrong numbers are worse than missing ones. The LLM does extraction and matching, a deterministic TS module does all the arithmetic.
- **The assistant is an accelerator, not a dependency.** The laptop sleeps → the app works fully, just without "fill it in for me". No main screen must require an LLM.
- Everything the model suggested is marked `source: 'llm'` + `is_approximate` and requires confirmation by a human.
- The boundaries that must be kept in v1 so that it is cheap later: zod schemas for all entities, a pure calculation module, a data access layer separate from components.

## Consequences

- A 7B vision model (of the Qwen-VL class) fits in 8 GB — a direct path to "import a recipe from a screenshot", the most valuable v2 feature. But label recognition was decided through a cloud API ([ADR 0027](0027-external-nutrition-sources.md)).
- If a local LLM appears, exposing it to the outside without a public IP will be needed ([ADR 0013](0013-cloudflare-hosting.md)).
- Ideas — [`BACKLOG.md`](../../BACKLOG.md) ("Planning assistant", "Recipe import from a screenshot or a link").
