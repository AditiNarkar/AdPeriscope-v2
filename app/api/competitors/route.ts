import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { runCompetitorAgent } from "@/agents/competitor-agent";
import { withApiLogging } from "@/lib/api-logging";
import { log } from "@/lib/logger";

const bodySchema = z.object({ url: z.string().url(), context: z.string().optional() });

export const POST = withApiLogging("/api/competitors", async (request: NextRequest, { requestId }) => {
  const { url, context } = bodySchema.parse(await request.json());
  log("info", "Validated competitor analysis request", {
    requestId,
    url,
    hasContext: Boolean(context)
  });
  return NextResponse.json(await runCompetitorAgent(context ?? "Analyze this competitor.", [url]));
});
