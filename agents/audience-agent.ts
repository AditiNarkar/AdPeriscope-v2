import { runMarketingAgent } from "@/agents/base-agent";

export function runAudienceAgent(query: string, sources: string[] = []) {
  return runMarketingAgent({ agent: "audience", query, sources });
}
