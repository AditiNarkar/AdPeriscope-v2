import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { runPersonaAgent } from "@/agents/persona-agent";
import { withApiLogging } from "@/lib/api-logging";
import { log } from "@/lib/logger";

const bodySchema = z.object({ context: z.string().min(5) });

export const POST = withApiLogging("/api/personas", async (request: NextRequest, { requestId }) => {
  const { context } = bodySchema.parse(await request.json());
  log("info", "Validated persona generation request", { requestId, contextChars: context.length });
  return NextResponse.json(await runPersonaAgent(context));
});
