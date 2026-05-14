import { z } from "zod";
import { log, maskSecret } from "@/lib/logger";

const envSchema = z.object({
  DATABASE_URL: z.string().optional(),
  NEXTAUTH_SECRET: z.string().optional(),
  NEXTAUTH_URL: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  REDIS_URL: z.string().optional(),
  SUPABASE_URL: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  FIRECRAWL_API_KEY: z.string().optional(),
  YOUTUBE_API_KEY: z.string().optional(),
  REDDIT_CLIENT_ID: z.string().optional(),
  REDDIT_CLIENT_SECRET: z.string().optional()
});

export const env = envSchema.parse(process.env);

export function getEnvStatus() {
  return {
    DATABASE_URL: env.DATABASE_URL ? "configured" : "missing",
    NEXTAUTH_SECRET: env.NEXTAUTH_SECRET ? "configured" : "missing",
    NEXTAUTH_URL: env.NEXTAUTH_URL ?? "missing",
    OPENAI_API_KEY: maskSecret(env.OPENAI_API_KEY),
    REDIS_URL: env.REDIS_URL ?? "missing",
    SUPABASE_URL: env.SUPABASE_URL ?? "missing",
    SUPABASE_SERVICE_ROLE_KEY: maskSecret(env.SUPABASE_SERVICE_ROLE_KEY),
    FIRECRAWL_API_KEY: maskSecret(env.FIRECRAWL_API_KEY),
    YOUTUBE_API_KEY: maskSecret(env.YOUTUBE_API_KEY),
    REDDIT_CLIENT_ID: maskSecret(env.REDDIT_CLIENT_ID),
    REDDIT_CLIENT_SECRET: maskSecret(env.REDDIT_CLIENT_SECRET)
  };
}

export function logEnvStatus() {
  log("info", "Environment status checked", {
    env: getEnvStatus(),
    demoMode: !env.OPENAI_API_KEY || !env.DATABASE_URL
  });
}

export function requireEnv(name: keyof z.infer<typeof envSchema>) {
  const value = env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}
