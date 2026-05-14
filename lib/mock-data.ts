import type { CompetitorSignal, Insight, PainPoint } from "@/types/marketing";

export const metrics = [
  { label: "AI opportunities", value: "0", change: "0", tone: "bg-acid" },
  { label: "SEO score", value: "0", change: "0", tone: "bg-bolt" },
  { label: "Pain points found", value: "0", change: "0", tone: "bg-hot" },
  { label: "Content velocity", value: "0", change: "0", tone: "bg-mint" }
];

export const trendData = [
  { name: "Mon", seo: 0, audience: 0, content: 0 },
  { name: "Tue", seo: 0, audience: 0, content: 0 },
  { name: "Wed", seo: 0, audience: 0, content: 0 },
  { name: "Thu", seo: 0, audience: 0, content: 0 },
  { name: "Fri", seo: 0, audience: 0, content: 0 },
  { name: "Sat", seo: 0, audience: 0, content: 0 },
  { name: "Sun", seo: 0, audience: 0, content: 0 }
];

export const insights: Insight[] = [];

export const competitors: CompetitorSignal[] = [];

export const painPoints: PainPoint[] = [];
