# Environment Setup Guide

AdPeriscope can run in demo mode without secrets, but real backend behavior needs a local `.env` file.

## 1. Create `.env`

## 2. Minimum Local Demo Setup

Use this when you only want the frontend and mocked AI fallbacks:

```bash
NEXTAUTH_SECRET="dev-secret-change-me"
NEXTAUTH_URL="http://localhost:3000"
```

With only those values, the app still works, but backend logs will say:

- OpenAI is missing, so demo AI responses are returned.
- Database is missing, so persistence is not active.
- Supabase is missing, so report export returns a demo URL.

## 3. Enable Real OpenAI Responses

Create an OpenAI API key and add:

```bash
OPENAI_API_KEY="sk-your-key"
```

After restarting `npm run dev`, AI chat and agent routes call OpenAI instead of returning demo text.

## 4. Enable PostgreSQL + Prisma

Run PostgreSQL locally or use a managed provider such as Supabase, Neon, Railway, or Render.

Example local URL:

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/adperiscope"
```

Then run:

```bash
npm run prisma:migrate
npm run prisma:generate
```

The current schema is in `prisma/schema.prisma`.

## 5. Enable OAuth

For Google OAuth:

```bash
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

For GitHub OAuth:

```bash
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
```

In each provider dashboard, set the callback URL to:

```txt
http://localhost:3000/api/auth/callback/google
http://localhost:3000/api/auth/callback/github
```

For production, replace the host with your deployed domain.

## 6. Enable Redis + BullMQ Workers

For local Redis:

```bash
REDIS_URL="redis://localhost:6379"
```

Start the worker in a second terminal:

```bash
npm run worker
```

Without Redis, direct API demo flows still work, but queued jobs need Redis.

## 7. Enable Supabase Report Storage

Create a Supabase project and a `reports` storage bucket, then set:

```bash
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

Keep the service role key server-side only. Do not expose it to browser code.

## 8. Enable Public Data Sources

Optional source credentials:

```bash
FIRECRAWL_API_KEY="your-firecrawl-key"
YOUTUBE_API_KEY="your-youtube-data-api-key"
REDDIT_CLIENT_ID="your-reddit-client-id"
REDDIT_CLIENT_SECRET="your-reddit-client-secret"
```

The current source adapters are scaffolded in `services/scraping/public-sources.ts`. When credentials are missing, logs clearly state that mocked source data is being used.

## 9. Check Backend Configuration

Start the app:

```bash
npm run dev
```

Then open:

```txt
http://127.0.0.1:3000/api/debug/env
```

This returns a safe masked configuration report. Secrets are never returned in full.

## 10. Read Backend Logs

When the frontend calls backend routes, your terminal will now show JSON logs like:

```json
{"level":"info","message":"API request started","route":"/api/ai/chat","requestId":"..."}
{"level":"warn","message":"OpenAI API key missing; returning demo AI response"}
{"level":"info","message":"API request completed","status":200,"durationMs":42}
```

Useful routes to trigger logs:

- `/api/debug/env`
- `/api/ai/chat`
- `/api/agents/run`
- `/api/pain-points`
- `/api/seo`
- `/api/competitors`
- `/api/content-plan`

## Recommended `.env` for Local Full Stack

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/adperiscope"
NEXTAUTH_SECRET="replace-with-a-long-random-string"
NEXTAUTH_URL="http://localhost:3000"
OPENAI_API_KEY="sk-your-key"
REDIS_URL="redis://localhost:6379"
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
FIRECRAWL_API_KEY="your-firecrawl-key"
YOUTUBE_API_KEY="your-youtube-data-api-key"
REDDIT_CLIENT_ID="your-reddit-client-id"
REDDIT_CLIENT_SECRET="your-reddit-client-secret"
```
