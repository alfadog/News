# Development workflow

1. Install dependencies with `npm install` from the repo root (uses npm workspaces).
2. Create `.env.local` based on `infra/.env.example` and set `PAYLOAD_SECRET` plus database credentials.
3. Run Postgres via `docker compose -f infra/docker-compose.yml up db`.
4. Start the web app with `npm run dev:web` (admin lives at `/admin`).
5. Seed the default site taxonomy using `npm run seed`.
6. Run ingestion in a separate terminal with `npm run dev:ingest` to fetch sample RSS content into RawItems.
7. Run the worker with `npm run dev:worker` to translate/summarize RawItems into Articles in `review` state.

Extend adapters in `apps/ingest/src/adapters` and AI logic in `apps/worker/src/handlers`. Update routing or scoring in `packages/rules`.
