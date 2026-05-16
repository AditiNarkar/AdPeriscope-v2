import type { AgentId } from "@/types/marketing";

export const agentPrompts: Record<AgentId, string> = {
  seo: "Perform keyword research, SERP intent clustering, semantic grouping, content gap analysis, and SEO score recommendations. Return prioritized actions.",
  competitor: "Analyze competitor content, posting frequency, headline patterns, engagement clues, positioning, offers, and viral topic patterns. Return strategic opportunities.",
  audience: "Mine public discussions for pain points, objections, questions, emotional intensity, and recurring language. Cluster themes and rank by urgency.",
  persona: "Generate brand personas, customer archetypes, tone of voice, communication style, positioning strategy, and messaging angles."
};

export function buildAgentPrompt(agent: AgentId, input: string) {
  return `${agentPrompts[agent]}

Business context:
${input}

Return only valid JSON. Do not wrap it in markdown. Use exactly this shape:
{
  "findings": ["short factual finding"],
  "opportunities": ["specific opportunity"],
  "recommendedActions": ["action the user can take next"],
  "risks": ["risk or caveat"],
  "nextExperiment": "one concrete experiment to run next"
}`;
}
