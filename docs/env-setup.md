# Environment Setup Guide

AdPeriscope uses local Ollama for AI by default, so there is no AI API bill.

## 1. Create `.env`

```bash
cp .env.example .env
```

## 2. Minimum Local Setup

```bash
NEXTAUTH_SECRET="dev-secret-change-me"
NEXTAUTH_URL="http://localhost:3000"
AI_PROVIDER="ollama"
OLLAMA_BASE_URL="http://localhost:11434"
OLLAMA_MODEL="llama3.1:8b"
OLLAMA_EMBEDDING_MODEL="nomic-embed-text"
```

## 3. Install and Run Ollama

Install Ollama from `https://ollama.com`, then run:

```bash
ollama pull llama3.1:8b
ollama pull nomic-embed-text
ollama serve
```

The app calls:

```txt
http://localhost:11434/api/chat
http://localhost:11434/api/embeddings
```

If Ollama is not running, backend logs will show the failed call and the UI will receive an actionable setup message.

## 4. Enable PostgreSQL + Prisma

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/adperiscope"
```

Then run:

```bash
npm run prisma:migrate
npm run prisma:generate
```

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

Callback URLs:

```txt
http://localhost:3000/api/auth/callback/google
http://localhost:3000/api/auth/callback/github
```

Use your actual local port if different.

## 6. Enable Redis + BullMQ Workers

```bash
REDIS_URL="redis://localhost:6379"
```

Start the worker in a second terminal:

```bash
npm run worker
```

## 7. Enable Supabase Report Storage

```bash
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

Keep the service role key server-side only.

## 8. Optional Public Data Sources

```bash
FIRECRAWL_API_KEY="your-firecrawl-key"
YOUTUBE_API_KEY="your-youtube-data-api-key"
REDDIT_CLIENT_ID="your-reddit-client-id"
REDDIT_CLIENT_SECRET="your-reddit-client-secret"
```

## 9. Check Backend Configuration

```txt
http://127.0.0.1:3000/api/debug/env
```

Secrets are masked. Ollama settings are shown so you can confirm the local model config.

## Recommended `.env`

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/adperiscope"
NEXTAUTH_SECRET="replace-with-a-long-random-string"
NEXTAUTH_URL="http://localhost:3000"
AI_PROVIDER="ollama"
OLLAMA_BASE_URL="http://localhost:11434"
OLLAMA_MODEL="llama3.1:8b"
OLLAMA_EMBEDDING_MODEL="nomic-embed-text"
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
