import type { AgentId } from "@/types/marketing";
import { runMarketingAgent } from "@/agents/base-agent";

export async function orchestrateStrategyBrief(query: string, agents: AgentId[] = ["seo", "competitor", "audience", "content"]) {
  const runs = await Promise.all(agents.map((agent) => runMarketingAgent({ agent, query })));
  return {
    summary: "Multi-agent strategy brief generated from specialized research passes.",
    runs,
    nextActions: [
      "Prioritize content gaps with commercial intent",
      "Turn top pain points into sales-page language",
      "Schedule a two-week campaign test"
    ]
  };
}
