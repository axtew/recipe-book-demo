# 0001. Personal app for two, phones, iOS first

- Status: accepted
- Date: 2026-08-02

## Context and problem

The product boundaries need to be fixed: who it is for, which devices it runs on and what goes into the first version. The main user is my wife, the second is me. My phone is Android, hers is an iPhone. The wife is the main user, so every camera feature must work in Safari on iOS.

## Considered options

1. A personal app for two, phones only.
2. An app with public access, sign-up and roles (see [ADR 0029](0029-multi-tenancy-deferred.md)).
3. An adaptive desktop layout from the start.
4. Menu planning and a shopping list in the first version (deferred, see below).

## Decision

- **A personal app for two users.** There will be no public access, sign-up or roles.
- **v1** = product list → recipes with nutrition calculation → lists and search → cook log. The order of layers from the original brief ([`docs/task.md`](../task.md)) is kept.
- **v1 devices are the phones of both users:** the husband has Android, the wife has an iPhone. The wife is the main user, so when behaviour differs, iOS/Safari has priority. Laptops are "later".
- **No desktop adaptation in v1:** one centred column with `max-width ~600px`, no separate layouts. A full desktop is a separate task for later.
- **Deferred:** two-week menu planning and shopping list generation are v2, as in the brief; recipe import from a link or screenshots is v2 (tied to an LLM, [ADR 0028](0028-local-llm-assistant-deferred.md)). Ideas are in [`BACKLOG.md`](../../BACKLOG.md).

## Consequences

- Any camera feature is checked in Safari on iOS, including a PWA added to the home screen. For a barcode scanner this would have meant a mandatory `zxing-wasm` (Safari has no native `BarcodeDetector`); the scanner itself was later cancelled ([ADR 0027](0027-external-nutrition-sources.md)), but the "works in Safari on iOS" requirement stays in force for label recognition from a photo.
- Mobile layout rules (`100dvh`, safe area, tap targets) are in [ADR 0021](0021-mobile-first-ux.md).
