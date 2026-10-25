# 0003. SPA + PWA on Vite, React and TypeScript

- Status: accepted
- Date: 2026-08-02

## Context and problem

We need an app that installs to the phone home screen, opens without an address bar and reads data offline. It sits behind a login; search engines have nothing to do there.

## Considered options

1. **Vite + React 19 + TypeScript (strict), SPA, PWA through `vite-plugin-pwa`.**
2. Next.js — rejected as excessive: the app is app-like, behind a login, with no SEO.

## Decision

**Vite + React 19 + TypeScript (strict), SPA.** **PWA** through `vite-plugin-pwa` — installation to the home screen, standalone mode without an address bar. Unit tests use **Vitest** (for the nutrition calculation and scaling module).

## Consequences

- There is no SSR and none is planned: there is no own server, and adding one for rendering would mean giving up the whole architecture ([ADR 0010](0010-supabase-without-own-backend.md)); offline reading in the kitchen is provided precisely by the PWA.
- How this works in practice (service worker, Cache Storage) is in [`architecture.md`](../agents/architecture.md).
