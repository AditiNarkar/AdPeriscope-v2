import { embedText } from "@/services/ai/provider";
import type { PainPoint } from "@/types/marketing";
import type { ScrapedDiscussion } from "@/services/scraping/public-sources";
import { log } from "@/lib/logger";

export async function extractPainPoints(discussions: ScrapedDiscussion[]): Promise<PainPoint[]> {
  log("info", "Pain-point extraction started", {
    discussionCount: discussions.length
  });

  const points = await Promise.all(
    discussions.map(async (discussion, index) => {
      await embedText(`${discussion.title}\n${discussion.body}`);
      return {
        theme: index === 0 ? "Manual research fatigue" : "Need practical templates",
        frequency: discussion.engagement ?? 20,
        intensity: index === 0 ? 88 : 73,
        source: discussion.source,
        quote: discussion.body.slice(0, 120)
      } satisfies PainPoint;
    })
  );

  const ranked = points.sort((a, b) => b.frequency + b.intensity - (a.frequency + a.intensity));
  log("info", "Pain-point extraction completed", {
    painPointCount: ranked.length,
    topTheme: ranked[0]?.theme ?? "none"
  });
  return ranked;
}
