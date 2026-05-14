# AdPeriscope Architecture

For the full system-design diagram, see [system-design.md](./system-design.md).

## Runtime Flow

1. Users configure a workspace, competitors, audience sources, and brand context.
2. API routes validate input with Zod and enqueue or run agent workflows.
3. Agents call the AI service layer, prompt templates, scraping adapters, and embedding helpers.
4. Results are persisted through Prisma and exported through Supabase storage.
5. Dashboards render actionable recommendations, not passive analytics.

## RAG Pipeline

- Ingest public discussions, competitor pages, RSS, YouTube comments, and user uploads.
- Normalize documents into source records.
- Generate embeddings with `text-embedding-3-small`.
- Store embeddings in Postgres/pgvector through the `PainPoint.embedding` field.
- Retrieve similar source snippets before agent runs and include citations in reports.

## Chrome Extension Idea

- Extension captures the active tab URL, visible headings, metadata, and selected text.
- Popup sends payload to `/api/competitors` or a future `/api/sources` route.
- AdPeriscope turns the page into competitor signals, content gaps, and headline patterns.

## Social Scheduler

- Add provider adapters under `services/social`.
- Store scheduled posts with approval status.
- Use BullMQ repeatable jobs to publish or remind users.
- Feed performance data back into the AI campaign scoring model.

## AI Campaign Scoring

Score each campaign using:

- Search intent fit
- Audience pain-point intensity
- Competitor gap size
- Offer clarity
- CTA strength
- Repurposing efficiency
