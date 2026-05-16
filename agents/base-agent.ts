import type { AgentId } from "@/types/marketing";
import type { AgentStructuredOutput } from "@/types/marketing";
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

function asStringArray(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function extractJsonObject(text: string) {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i)?.[1];
  const raw = fenced ?? text;
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  return raw.slice(start, end + 1);
}

export function parseAgentStructuredOutput(text: string): AgentStructuredOutput | null {
  const json = extractJsonObject(text);
  if (!json) return null;

  try {
    const parsed = JSON.parse(json) as Record<string, unknown>;
    return {
      findings: asStringArray(parsed.findings),
      opportunities: asStringArray(parsed.opportunities),
      recommendedActions: asStringArray(parsed.recommendedActions),
      risks: asStringArray(parsed.risks),
      nextExperiment: typeof parsed.nextExperiment === "string" ? parsed.nextExperiment : ""
    };
  } catch {
    return null;
  }
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
  const structuredOutput = parseAgentStructuredOutput(output);
  log("info", "Marketing agent run completed", {
    runId,
    agent: input.agent,
    outputChars: output.length,
    structured: Boolean(structuredOutput)
  });

  return {
    agent: input.agent,
    output,
    structuredOutput,
    runId,
    createdAt: new Date().toISOString()
  };
}
