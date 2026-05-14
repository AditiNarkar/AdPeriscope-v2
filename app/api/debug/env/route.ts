import { NextResponse } from "next/server";
import { withApiLogging } from "@/lib/api-logging";
import { getEnvStatus } from "@/lib/env";
import { log } from "@/lib/logger";

export const GET = withApiLogging("/api/debug/env", async () => {
  const env = getEnvStatus();
  log("info", "Returning safe environment status", { env });

  return NextResponse.json({
    demoMode: env.DATABASE_URL === "missing",
    env,
    notes: [
      "Secret values are masked and never returned in full.",
      "AI routes use Ollama by default.",
      "If Ollama is not running, AI routes return an actionable setup message.",
      "Missing DATABASE_URL means persistence is not active."
    ]
  });
});
