import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { runContentAgent } from "@/agents/content-agent";
import { withApiLogging } from "@/lib/api-logging";
import { log } from "@/lib/logger";

const bodySchema = z.object({ context: z.string().min(5), horizon: z.enum(["weekly", "monthly"]).default("weekly") });

export const POST = withApiLogging("/api/content-plan", async (request: NextRequest, { requestId }) => {
  const { context, horizon } = bodySchema.parse(await request.json());
  log("info", "Validated content-plan request", {
    requestId,
    horizon,
    contextChars: context.length
  });
  return NextResponse.json(await runContentAgent(`Build a ${horizon} plan.\n${context}`));
});
