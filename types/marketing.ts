export type AgentId = "seo" | "competitor" | "audience" | "persona" | "content";

export type Insight = {
  title: string;
  summary: string;
  impact: "low" | "medium" | "high";
  metric?: string;
};

export type CompetitorSignal = {
  name: string;
  url: string;
  score: number;
  cadence: string;
  winningTopics: string[];
};

export type PainPoint = {
  theme: string;
  frequency: number;
  intensity: number;
  source: "reddit" | "youtube" | "rss" | "web";
  quote: string;
};

export type ContentPlanItem = {
  day: string;
  channel: string;
  hook: string;
  format: string;
  cta: string;
};
