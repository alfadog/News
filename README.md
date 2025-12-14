# News monorepo

Production-ready skeleton for a multi-site news platform built with Next.js (App Router) and Payload CMS in a single codebase. Includes ingestion and AI worker services plus shared rules and types.

## Getting started
1. Install dependencies: `npm install`
2. Copy `infra/.env.example` to `.env.local` and adjust secrets/URLs.
3. Run Postgres locally (e.g., `docker compose -f infra/docker-compose.yml up db`).
4. Start the web app + Payload admin: `npm run dev:web` (admin at `/admin`).
5. Seed the default Harper's Bazaar-style taxonomy: `npm run seed`.
6. Run ingest + worker in separate terminals for the automation pipeline: `npm run dev:ingest` and `npm run dev:worker`.

## Project layout
- **apps/web**: Next.js site, Payload CMS config/collections, seed scripts, public routes (home, section, channel, article, story, series, search, RSS, sitemap).
- **apps/ingest**: Ingestion service with pluggable adapters (RSS implemented, API/manual stubs) and auditing hooks.
- **apps/worker**: AI worker producing Articles from RawItems with stored `aiMeta` and prompt references.
- **packages/shared**: Shared TypeScript types, taxonomy seeds, logging and fingerprint utilities.
- **packages/rules**: Minimal routing + trend scoring engine with extension points for future embeddings.
- **infra**: Docker compose, env templates, deployment notes.
- **docs**: Architecture, data model, workflow notes.

## Extending
- Add more Payload collections/fields in `apps/web/src/payload/collections`.
- Implement new ingestion adapters in `apps/ingest/src/adapters`.
- Replace the mock AI client in `apps/worker/src/ai` and expand handlers in `apps/worker/src/handlers`.
- Modify routing and scoring in `packages/rules`.
