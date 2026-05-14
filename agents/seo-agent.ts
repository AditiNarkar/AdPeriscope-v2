import { runMarketingAgent } from "@/agents/base-agent";

export function runSeoAgent(query: string) {
  return runMarketingAgent({ agent: "seo", query });
}
