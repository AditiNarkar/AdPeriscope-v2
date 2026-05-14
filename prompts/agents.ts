import type { AgentId } from "@/types/marketing";

export const agentPrompts: Record<AgentId, string> = {
  seo: "Perform keyword research, SERP intent clustering, semantic grouping, content gap analysis, and SEO score recommendations. Return prioritized actions.",
  competitor: "Analyze competitor content, posting frequency, headline patterns, engagement clues, positioning, offers, and viral topic patterns. Return strategic opportunities.",
  audience: "Mine public discussions for pain points, objections, questions, emotional intensity, and recurring language. Cluster themes and rank by urgency.",
  persona: "Generate brand personas, customer archetypes, tone of voice, communication style, positioning strategy, and messaging angles.",
  content: "Build weekly or monthly content strategies with hooks, titles, platform tactics, hashtags, CTAs, outlines, and repurposing ideas."
};

export function buildAgentPrompt(agent: AgentId, input: string) {
  return `${agentPrompts[agent]}\n\nBusiness context:\n${input}\n\nRespond with concise sections: Findings, Opportunities, Recommended Actions, Risks, Next Experiment.`;
}
