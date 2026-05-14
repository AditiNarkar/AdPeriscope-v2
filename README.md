# AdPeriscope

AdPeriscope is a full-stack AI-powered digital marketing automation platform for content strategy, SEO research, competitor intelligence, audience analysis, brand personas, and campaign planning.

The workspace model is intentionally simple: one user owns many workspaces.

## Stack

- Next.js 15, TypeScript, TailwindCSS, Framer Motion-ready UI, Recharts, Zustand
- PostgreSQL with Prisma ORM
- NextAuth OAuth scaffold
- Ollama AI service layer with multi-agent orchestration
- BullMQ worker architecture for scheduled/background agent runs
- Supabase storage abstraction for report exports
- Public data adapters for Reddit, YouTube, RSS, competitor websites, Firecrawl, and Playwright

## Folder Structure

```txt
app/                  Next.js app routes and API routes
components/           Reusable UI, layout, charts, dashboard widgets
features/             Product feature modules
services/             AI, scraping, storage, analytics service layers
agents/               Specialized AI agents and orchestration entry points
prompts/              Prompt templates
hooks/                Client hooks
lib/                  Auth, env, Prisma, logging, rate limiting, utilities
api/                  Frontend API abstraction
prisma/               Prisma schema and seed
jobs/                 BullMQ queues and workers
store/                Zustand state
types/                Shared TypeScript types
utils/                Cross-cutting helpers
styles/               Global styles and design tokens
```

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env
```

Environment setup details are documented in [docs/env-setup.md](./docs/env-setup.md).

3. Start PostgreSQL and Redis, then run Prisma:

```bash
npm run prisma:migrate
npm run prisma:generate
```

4. Start the app:

```bash
npm run dev
```

5. Optional worker:

```bash
npm run worker
```

## AI Agents

- SEO Agent: keyword research, SERP analysis, intent clustering, semantic groups, SEO recommendations
- Competitor Intelligence Agent: content cadence, headlines, viral patterns, competitor overlap
- Audience Insight Agent: Reddit/YouTube/RSS/web pain-point mining and clustering
- Brand Persona Agent: target personas, tone, positioning, archetypes

AI routes use Ollama by default. Run `ollama serve`, then pull the configured models from `.env`.

## Bonus Architecture

- Chrome extension: add an extension package that sends current-page competitor/article data to `/api/competitors`.
- Social scheduler: add provider adapters under `services/social` and schedule jobs via BullMQ.
- Notifications: add notification models and push/email adapters.
- Campaign scoring: evaluate workspace strategy using SEO score, audience intensity, competitor gap, and conversion fit.
