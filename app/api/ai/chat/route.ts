import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { withApiLogging } from "@/lib/api-logging";
import { log } from "@/lib/logger";
import { generateText } from "@/services/ai/provider";

const bodySchema = z.object({
  message: z.string().min(1),
  context: z.string().optional()
});

export const POST = withApiLogging("/api/ai/chat", async (request: NextRequest, { requestId }) => {
  const { message, context } = bodySchema.parse(await request.json());
  log("info", "Validated AI chat request", {
    requestId,
    messageChars: message.length,
    hasContext: Boolean(context)
  });
  const output = await generateText(
    `Context: ${context ?? "AdPeriscope workspace"}\n\nUser asks: ${message}`,
    "You are AdPeriscope's AI content strategist. Be actionable, concise, and specific."
  );
  return NextResponse.json({ output });
});
