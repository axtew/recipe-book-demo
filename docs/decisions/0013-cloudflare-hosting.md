# 0013. The frontend is hosted in the cloud on Cloudflare

- Status: accepted
- Date: 2026-08-02

## Context and problem

We need a place that serves the app's static files. Nothing should run at home.

## Considered options

1. **Cloud: static files on Cloudflare Pages or Vercel, deployed from git.**
2. Hosting at home — would require a public IP and port forwarding.

## Decision

**The frontend is hosted in the cloud, not at home.** Static files on Cloudflare Pages or Vercel, deployed from git. Nothing runs at home, no public IP is needed.

Open at the time of the decision:

- **Domain** — for now `*.pages.dev`. A custom domain is deferred together with local LLM hosting.
- **Exposing to the outside without a public IP** — needed only if a **local** LLM ever appears ([ADR 0028](0028-local-llm-assistant-deferred.md)). Options: Tailscale (a private network, recommended) or Cloudflare Tunnel (public HTTPS + Cloudflare Access). Both work behind CGNAT, no ports need forwarding. None of the planned features requires home hosting: label recognition moved to a cloud vision API ([ADR 0027](0027-external-nutrition-sources.md)).

## Consequences

- The app is actually deployed on Cloudflare Workers (static assets, `wrangler.jsonc`); the deploy procedure, domains and rollback are in `DEPLOY.md` (working repository only; for your own deployment, see the ["Deploy your own"](../../README.md#deploy-your-own) section of the README).
