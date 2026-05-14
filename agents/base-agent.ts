import type { AgentId } from "@/types/marketing";
import { buildAgentPrompt } from "@/prompts/agents";
import { generateText } from "@/services/ai/openai-client";
import { log } from "@/lib/logger";

export type AgentRunInput = {
  agent: AgentId;
  workspaceId?: string;
  query: string;
  sources?: string[];
};

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
    input.sources?.length ? `Sources: ${input.sources.join(", ")}` : ""
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
