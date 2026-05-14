import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { runMarketingAgent } from "@/agents/base-agent";
import { withApiLogging } from "@/lib/api-logging";
import { rateLimit } from "@/lib/rate-limit";
import { log } from "@/lib/logger";

const bodySchema = z.object({
  agent: z.enum(["seo", "competitor", "audience", "persona"]),
  query: z.string().min(3),
  sources: z.array(z.string()).optional()
});

export const POST = withApiLogging("/api/agents/run", async (request: NextRequest, { requestId }) => {
  const limited = rateLimit(request.headers.get("x-forwarded-for") ?? "local");
  if (!limited.ok) return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });

  const body = bodySchema.parse(await request.json());
  log("info", "Validated agent run request", {
    requestId,
    agent: body.agent,
    sourceCount: body.sources?.length ?? 0
  });
  const result = await runMarketingAgent(body);
  return NextResponse.json(result);
});
