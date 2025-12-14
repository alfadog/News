# Architecture

This monorepo uses a single Next.js application that hosts both the public site and the Payload CMS admin. Separate worker services run ingestion and AI processing, while shared packages keep types and rules consistent.

- **apps/web**: Next.js App Router + Payload CMS configuration. Public routes render section/channel/article/story/series/search pages. Admin is mounted at `/admin` by Payload.
- **apps/ingest**: Fetches external content via pluggable adapters (RSS implemented, API/manual stubs). Writes RawItems to Payload via REST.
- **apps/worker**: Processes RawItems with a placeholder AI client, producing review-ready Articles and storing AI metadata.
- **packages/shared**: Type definitions, default taxonomy seed, utility helpers shared by all apps.
- **packages/rules**: Minimal routing and trend-scoring engine with extension points for embeddings.
- **infra**: Docker Compose for local Postgres + web/worker containers, plus environment templates.

Communication is intentionally explicit: the ingest and worker apps talk to Payload through its REST API using the shared types. Logging utilities emit structured JSON suitable for shipping to observability backends.
