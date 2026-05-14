import type { CompetitorSignal, ContentPlanItem, Insight, PainPoint } from "@/types/marketing";

export const metrics = [
  { label: "AI opportunities", value: "148", change: "+28%", tone: "bg-acid" },
  { label: "SEO score", value: "82", change: "+9 pts", tone: "bg-bolt" },
  { label: "Pain points found", value: "2.4K", change: "+311", tone: "bg-hot" },
  { label: "Content velocity", value: "5.8x", change: "+41%", tone: "bg-mint" }
];

export const trendData = [
  { name: "Mon", seo: 48, audience: 34, content: 28 },
  { name: "Tue", seo: 55, audience: 46, content: 36 },
  { name: "Wed", seo: 64, audience: 52, content: 48 },
  { name: "Thu", seo: 70, audience: 68, content: 52 },
  { name: "Fri", seo: 84, audience: 74, content: 67 },
  { name: "Sat", seo: 76, audience: 80, content: 72 },
  { name: "Sun", seo: 91, audience: 88, content: 83 }
];

export const insights: Insight[] = [
  {
    title: "Double down on comparison pages",
    summary: "Competitor SERPs are thin for 'AI marketing workflow vs agency retainer'. Publish a BOFU comparison cluster.",
    impact: "high",
    metric: "$18K MRR upside"
  },
  {
    title: "Audience friction: reporting fatigue",
    summary: "Reddit and YouTube comments repeatedly mention manual report creation and unclear ROI language.",
    impact: "high",
    metric: "436 mentions"
  },
  {
    title: "Creator segment wants templates",
    summary: "Short-form creators respond to plug-and-play content calendars with reusable hooks.",
    impact: "medium",
    metric: "71% positive"
  }
];

export const competitors: CompetitorSignal[] = [
  {
    name: "GrowthLens",
    url: "growthlens.example",
    score: 88,
    cadence: "4 posts/week",
    winningTopics: ["content refreshes", "AI briefs", "founder-led SEO"]
  },
  {
    name: "RankPilot",
    url: "rankpilot.example",
    score: 74,
    cadence: "2 posts/week",
    winningTopics: ["keyword clustering", "programmatic SEO", "templates"]
  },
  {
    name: "AudienceForge",
    url: "audienceforge.example",
    score: 69,
    cadence: "daily social",
    winningTopics: ["pain points", "comment mining", "positioning"]
  }
];

export const painPoints: PainPoint[] = [
  {
    theme: "Unclear marketing ROI",
    frequency: 312,
    intensity: 91,
    source: "reddit",
    quote: "I know we post a lot, but I cannot tell which ideas move revenue."
  },
  {
    theme: "SEO research takes too long",
    frequency: 284,
    intensity: 86,
    source: "youtube",
    quote: "Every keyword tool gives numbers, not a plan I can actually execute."
  },
  {
    theme: "Content feels generic",
    frequency: 207,
    intensity: 78,
    source: "reddit",
    quote: "AI captions all sound the same unless I spend an hour rewriting them."
  }
];

export const calendar: ContentPlanItem[] = [
  { day: "Mon", channel: "Blog", hook: "Why your SEO dashboard is not a strategy", format: "Pillar post", cta: "Download audit" },
  { day: "Tue", channel: "LinkedIn", hook: "The 5-minute competitor teardown", format: "Carousel", cta: "Comment URL" },
  { day: "Wed", channel: "YouTube", hook: "Mining Reddit for product messaging", format: "Tutorial", cta: "Try workflow" },
  { day: "Thu", channel: "Email", hook: "Pain points worth building around", format: "Newsletter", cta: "Book strategy call" },
  { day: "Fri", channel: "TikTok", hook: "AI writes the brief, you pick the angle", format: "Short", cta: "Save template" }
];
