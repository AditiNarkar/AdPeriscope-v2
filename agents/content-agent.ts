import { runMarketingAgent } from "@/agents/base-agent";

export function runContentAgent(query: string) {
  return runMarketingAgent({ agent: "content", query });
}
