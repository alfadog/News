# News monorepo

Production-ready skeleton for a multi-site news platform built with Next.js (App Router), Payload CMS v2 (running on Postgres), ingestion and AI worker services. The monorepo now runs Payload as a dedicated Express app alongside the public Next.js site.

## Getting started (local demo in ~5 commands)
1. Install dependencies from the repo root: `npm install` (workspaces are supported).
2. Copy environment defaults: `cp infra/.env.example .env.local` (services also fall back to `.env`). Adjust secrets/URLs as needed.
3. Start Postgres: `docker compose -f infra/docker-compose.yml up db`.
4. Start the CMS (Payload admin + REST API on port 4000): `npm run dev:cms` and verify `http://localhost:4000/api/health`.
5. Seed taxonomy + demo content (site, sections/channels, stories, 20+ articles): `npm run seed`.
6. Start the Next.js site (port 3000) with the API proxy and /admin redirect pointing at the CMS: `npm run dev:web`.
7. Run ingest + worker in separate terminals to add RSS-sourced articles and mark RawItems processed: `npm run dev:ingest` then `npm run dev:worker`.

## Core dependency pins
- `payload@2.32.3`
- `@payloadcms/db-postgres@1.3.2`
- `@payloadcms/richtext-lexical@1.0.11`

## Environment variables
Set these in `.env.local` (repo root) or `.env`:

- **Shared**: `PAYLOAD_SECRET` (session token), `PAYLOAD_PUBLIC_SERVER_URL` (CMS base URL, default `http://localhost:4000`), optional `PAYLOAD_REST_URL` (defaults to `${PAYLOAD_PUBLIC_SERVER_URL}/api`), optional `PAYLOAD_API_KEY` for ingest/worker scripts.
- **CMS / Vercel Function (`apps/cms`)**: `DATABASE_URI` (Postgres connection string), `DB_POOL_MAX` (default 5), `DB_IDLE_TIMEOUT_MS` (default 5000), `DB_CONNECTION_TIMEOUT_MS` (default 5000).
- **Web (`apps/web`)**: `PAYLOAD_PUBLIC_SERVER_URL` must point at the deployed CMS so API proxying and the `/admin` redirect work.

## Local routing and API
- Payload admin: `/admin` (served by `apps/cms`, the web app redirects here).
- Payload REST API: `/api/*` (the Next.js app proxies to the CMS when `PAYLOAD_PUBLIC_SERVER_URL` is set). Pages will render a clear setup warning if the env var is missing.
- Public site routes now render live content (home, section/channel pages, articles, stories, series, search, RSS, sitemap).

## Deployment on Vercel
Two Vercel projects keep the monorepo split cleanly:
- **CMS (`apps/cms`)**: Root Directory `apps/cms`, Install Command `npm install`, Build Command `npm run vercel-build`. The included `vercel.json` rewrites all routes to the `api/index.ts` function so `/admin` and `/api/*` work. Set `PAYLOAD_SECRET`, `DATABASE_URI`, `PAYLOAD_PUBLIC_SERVER_URL` (the CMS URL), optional `PAYLOAD_REST_URL`/`PAYLOAD_API_KEY`, and pool tuning (`DB_POOL_MAX`, `DB_IDLE_TIMEOUT_MS`, `DB_CONNECTION_TIMEOUT_MS`) for serverless Postgres.
- **Web (`apps/web`)**: Root Directory `apps/web`, Install Command `npm install`, Build Command `npm run vercel-build`. Set `PAYLOAD_PUBLIC_SERVER_URL` (pointing at the CMS deployment) so `/api/*` proxies correctly and `/admin` redirects to the live admin.

`npm run vercel-build` at the repo root still builds packages + the web app (matching the Vercel build for the web project). The CMS build uses the same config but caps Postgres pool sizes for serverless hosting.

## Project layout
- **apps/web**: Next.js site with public pages, RSS, sitemap, and an `/admin` redirect to the CMS.
- **apps/cms**: Express + Payload CMS v2 with Postgres adapter, admin UI, REST API, and seed script.
- **apps/ingest**: Ingestion service with RSS/API/manual adapters and audit logging to Payload.
- **apps/worker**: AI worker producing Articles from RawItems with stored `aiMeta` and prompt references.
- **packages/shared**: Shared TypeScript types, taxonomy seeds, logging and fingerprint utilities.
- **packages/rules**: Minimal routing + trend scoring engine with extension points for future embeddings.
- **infra**: Docker compose, env templates, deployment notes.
- **docs**: Architecture, data model, workflow notes.

## Scripts
- `npm run dev:web` — start Next.js locally.
- `npm run dev:cms` — start Payload CMS locally.
- `npm run dev:ingest` — run the RSS/API/manual ingestion examples.
- `npm run dev:worker` — run the mock AI worker.
- `npm run seed` — idempotent seed for the default site/taxonomy (requires running DB and CMS env vars).
- `npm run build` — build shared packages then the web app.
- `npm run build:cms` — type-check/build the CMS server.
- `npm run vercel-build` — deterministic build entrypoint for the web deployment (apps/web root directory).

## Pipeline notes
- Ingest writes `RawItems` via the CMS REST API (`PAYLOAD_REST_URL`).
- Worker reads `RawItems` and writes `Articles` with `aiMeta` via the same REST API.
- Seed keeps relationships intact (`Article -> RawItem -> Source`, site-aware taxonomy).
