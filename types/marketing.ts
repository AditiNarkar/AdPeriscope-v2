export type AgentId = "seo" | "competitor" | "audience" | "persona";

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
