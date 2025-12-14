# News monorepo

Production-ready skeleton for a multi-site news platform built with Next.js (App Router), Payload CMS v2 (running on Postgres), ingestion and AI worker services. The monorepo now runs Payload as a dedicated Express app alongside the public Next.js site.

## Getting started
1. Install dependencies from the repo root: `npm install`.
2. Copy environment defaults: `cp infra/.env.example .env.local` (the services also fall back to `.env`). Adjust secrets and URLs as needed.
3. Start Postgres: `docker compose -f infra/docker-compose.yml up db`.
4. Start the CMS (Payload admin + REST API on port 4000): `npm run dev:cms`.
5. Seed the default Harper's Bazaar-style taxonomy: `npm run seed`.
6. Start the Next.js site (port 3000) with the API proxy and /admin redirect pointing at the CMS: `npm run dev:web`.
7. Run ingest + worker in separate terminals for the automation pipeline: `npm run dev:ingest` and `npm run dev:worker`.

## Environment variables
Set these in `.env.local` (repo root) or `.env`:
- `PAYLOAD_SECRET` — token for Payload sessions and REST auth.
- `DATABASE_URI` — Postgres connection string (e.g., `postgres://payload:payload@localhost:5432/payload`).
- `PAYLOAD_PUBLIC_SERVER_URL` — public URL for the CMS (default `http://localhost:4000`).
- `PAYLOAD_REST_URL` — optional explicit REST base URL; defaults to `${PAYLOAD_PUBLIC_SERVER_URL}/api`.
- `PAYLOAD_API_KEY` — optional API key for ingest/worker.

## Local routing and API
- Payload admin: `/admin` (served by `apps/cms`, the web app redirects here).
- Payload REST API: `/api/*` (the Next.js app proxies to the CMS when `PAYLOAD_PUBLIC_SERVER_URL` is set).
- Public site routes stay unchanged (home, section/channel pages, articles, stories, series, search, RSS, sitemap).

## Deployment on Vercel
Two Vercel projects keep the monorepo split cleanly:
- **CMS (`apps/cms`)**: Root Directory `apps/cms`, Install Command `npm install`, Build Command `npm run vercel-build`. The included `vercel.json` rewrites all routes to the `api/index.ts` function so `/admin` and `/api/*` work. Set `PAYLOAD_SECRET`, `DATABASE_URI`, `PAYLOAD_PUBLIC_SERVER_URL` (the CMS URL), and optionally `PAYLOAD_REST_URL`/`PAYLOAD_API_KEY`.
- **Web (`apps/web`)**: Root Directory `apps/web`, Install Command `npm install`, Build Command `npm run vercel-build`. Set `PAYLOAD_PUBLIC_SERVER_URL` (pointing at the CMS deployment) so `/api/*` proxies correctly and `/admin` redirects to the live admin.

`npm run vercel-build` at the repo root still builds packages + the web app (matching the Vercel build for the web project).

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
