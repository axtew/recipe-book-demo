# 0027. External nutrition sources rejected; replacement is a label photo through a cloud vision API

- Status: accepted (implementation — Phase 13 of the plan, deferred, low priority)
- Date: 2026-08-02

## Context and problem

The wish was not to enter the nutrition of new products by hand, but to take it from an external database by barcode. The topic was closed by the check of 2026-08-02; it is recorded as the negative result of an experiment so that we do not return to it.

## Considered options

1. **Open Food Facts** — rejected after the check. Real packages from home in Da Nang were scanned: more than half were not found at all, and almost all of those found have `nutriments` unfilled. Full data turned out to exist for exactly two items — Choco Pie and one cookie, that is, international brands. For a Vietnamese grocery basket the database is empty. It makes sense to reconsider only if OFF noticeably grows its coverage in Southeast Asia — that will not happen by itself.
2. **FatSecret** — rejected even before the check: OAuth 2.0 client credentials → the secret cannot be kept in the browser; the free tier requires an IP whitelist, and the outgoing IP of serverless functions floats, so "free tier + Edge Function" does not work; plus restrictions on commercial use.
3. **USDA FoodData Central** — rejected: English only and American products only. Matching "sour cream 20%" → `Sour cream` is unreliable without a model, and with a model it is simpler to read the label directly.
4. **Barcode databases** — none with decent coverage of Vietnam exists. General product catalogues (UPCitemdb and the like) do not contain nutrition, and GS1 is a registry of registrations, not nutritional value. The tables of the Vietnamese Institute of Nutrition describe generic products, not packaged brands.
5. **Recognising the nutrition facts table from a label photo** — does not depend on any third-party database, covers goods without a barcode (loose, market, repacked) and any label language.

Vision: a cloud API versus a local model.

## Decision

- **The replacement is recognising the nutrition facts table from a label photo** (Phase 13 of the plan).
- **Vision is a cloud API, not a local model.** A few dozen photos a month cost cents, it works always and from anywhere, and requires neither a tunnel nor a laptop that is awake. The key lives in a Supabase Edge Function.
- **There are no `barcode` / `external_id` fields in the schema.** They were introduced for the scanner, and there will be no source — a field without a source is dead weight. `source` stays as `seed | manual | label | llm` ([ADR 0016](0016-variants-and-active-variant.md)).
- **A critical requirement for recognition: distinguish "per 100 g" from "per serving".** Per-serving values are common on Asian packages, and silently taking them for per-100-g values means quietly wrong numbers in all recipes with this product.
- **The phase priority is low.** Four numbers from a label are typed in ~20 seconds, and new products are rare after the first month. Do it only if manual entry really starts to be annoying.

## Consequences

- This removes the need for home hosting for this feature entirely ([ADR 0013](0013-cloudflare-hosting.md)). A local model stays appropriate only for a future planning assistant ([ADR 0028](0028-local-llm-assistant-deferred.md)), and even then by wish, not by need.
- A camera feature must work in Safari on iOS, including from a PWA on the home screen ([ADR 0001](0001-personal-app-for-two.md)).
- The idea is in [`BACKLOG.md`](../../BACKLOG.md) ("Nutrition from a label photo").
