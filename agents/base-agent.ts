import type { AgentId } from "@/types/marketing";
import { buildAgentPrompt } from "@/prompts/agents";
import { generateText } from "@/services/ai/provider";
import { log } from "@/lib/logger";

export type AgentRunInput = {
  agent: AgentId;
  workspaceId?: string;
  query: string;
  sources?: string[];
};

function formatSources(sources?: string[]) {
  if (!sources?.length) return "";

  return [
    "Grounding sources:",
    ...sources.map((source, index) => `Source ${index + 1}:\n${source}`)
  ].join("\n\n");
}

export async function runMarketingAgent(input: AgentRunInput) {
  const runId = crypto.randomUUID();
  log("info", "Marketing agent run started", {
    runId,
    agent: input.agent,
    workspaceId: input.workspaceId ?? "demo-workspace",
    sourceCount: input.sources?.length ?? 0,
    queryChars: input.query.length
  });

  const prompt = buildAgentPrompt(input.agent, [
    input.query,
    formatSources(input.sources)
  ].join("\n"));

  const output = await generateText(prompt);
  log("info", "Marketing agent run completed", {
    runId,
    agent: input.agent,
    outputChars: output.length
  });

  return {
    agent: input.agent,
    output,
    runId,
    createdAt: new Date().toISOString()
  };
}
