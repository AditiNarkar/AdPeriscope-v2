import { runMarketingAgent } from "@/agents/base-agent";

export function runCompetitorAgent(query: string, sources: string[] = []) {
  return runMarketingAgent({ agent: "competitor", query, sources });
}
