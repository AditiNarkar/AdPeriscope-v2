import Link from "next/link";
import { ArrowRight, Bot, ChartNoAxesCombined, Radar, Sparkles } from "lucide-react";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/ui/reveal";
import { TrendChart } from "@/components/charts/trend-chart";
import { AiSuggestionsPanel } from "@/components/dashboard/ai-suggestions-panel";

const agents = [
  { name: "SEO Agent", icon: ChartNoAxesCombined, copy: "Clusters keywords, classifies intent, and scores ranking gaps." },
  { name: "Competitor Agent", icon: Radar, copy: "Tracks content cadence, headlines, campaigns, and viral patterns." },
  { name: "Audience Agent", icon: Sparkles, copy: "Mines public discussions for frustrations, objections, and language." },
  { name: "Content Agent", icon: Bot, copy: "Turns research into calendars, hooks, briefs, CTAs, and repurposing plans." }
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-paper text-ink">
      <MarketingNav />
      <section className="brutal-grid border-b-4 border-ink px-4 py-14 md:py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-[1fr_0.9fr]">
          <Reveal>
            <Badge>Autonomous AI marketing command center</Badge>
            <h1 className="mt-5 max-w-4xl text-5xl font-black leading-[0.95] md:text-7xl">
              AdPeriscope turns market noise into weekly growth moves.
            </h1>
            <p className="mt-5 max-w-2xl text-xl font-bold text-ink/75">
              Automate content planning, SEO research, competitor intelligence, audience pain-point mining, and brand personas from one sharp dashboard.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/dashboard">
                  Open demo <ArrowRight className="size-5" />
                </Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/pricing">View pricing</Link>
              </Button>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
          <div className="space-y-4">
            <Card className="bg-bolt">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black">Live trend radar</h2>
                <Badge className="bg-white">Demo data</Badge>
              </div>
              <TrendChart />
            </Card>
            <AiSuggestionsPanel />
          </div>
          </Reveal>
        </div>
      </section>
      <section className="px-4 py-12">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-2 lg:grid-cols-4">
          {agents.map((agent) => {
            const Icon = agent.icon;
            return (
              <Card key={agent.name} className="bg-white">
                <Icon className="size-9" />
                <h3 className="mt-4 text-2xl font-black">{agent.name}</h3>
                <p className="mt-2 font-semibold text-ink/70">{agent.copy}</p>
              </Card>
            );
          })}
        </div>
      </section>
    </main>
  );
}
