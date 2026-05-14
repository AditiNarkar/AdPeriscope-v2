import { runMarketingAgent } from "@/agents/base-agent";

export function runPersonaAgent(query: string) {
  return runMarketingAgent({ agent: "persona", query });
}
