import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { withApiLogging } from "@/lib/api-logging";
import { log } from "@/lib/logger";
import { extractPainPoints } from "@/services/analytics/pain-point-engine";
import { scrapePublicDiscussions } from "@/services/scraping/public-sources";

const bodySchema = z.object({ query: z.string().min(2) });

export const POST = withApiLogging("/api/pain-points", async (request: NextRequest, { requestId }) => {
  const { query } = bodySchema.parse(await request.json());
  log("info", "Validated pain-point request", { requestId, query });
  const discussions = await scrapePublicDiscussions(query);
  const painPoints = await extractPainPoints(discussions);
  return NextResponse.json({ discussions, painPoints });
});
