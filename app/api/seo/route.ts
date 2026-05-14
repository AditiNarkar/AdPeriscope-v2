import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { runSeoAgent } from "@/agents/seo-agent";
import { withApiLogging } from "@/lib/api-logging";
import { log } from "@/lib/logger";

const bodySchema = z.object({ query: z.string().min(2) });

export const POST = withApiLogging("/api/seo", async (request: NextRequest, { requestId }) => {
  const { query } = bodySchema.parse(await request.json());
  log("info", "Validated SEO request", { requestId, queryChars: query.length });
  return NextResponse.json(await runSeoAgent(query));
});
