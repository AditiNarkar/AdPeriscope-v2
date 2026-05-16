import Link from "next/link";
import {
  ArrowRight,
  ChartNoAxesCombined,
  ClipboardList,
  MessageSquareText,
  Radar,
  Sparkles,
  Telescope,
  Users
} from "lucide-react";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/ui/reveal";
import { auth } from "@/lib/auth";

const agents = [
  {
    name: "SEO Agent",
    icon: ChartNoAxesCombined,
    copy: "Finds keyword gaps, search intent, long-tail ideas, and concrete SEO fixes."
  },
  {
    name: "Competitor Agent",
    icon: Radar,
    copy: "Reads competitor URLs from onboarding and turns patterns into positioning moves."
  },
  {
    name: "Audience Agent",
    icon: MessageSquareText,
    copy: "Extracts pain points, recurring objections, and customer language from public discussions."
  },
  {
    name: "Persona Agent",
    icon: Users,
    copy: "Builds target personas, tone guidance, customer archetypes, and message angles."
  }
];

const workflow = [
  "Launch a workspace for each business, client, or product.",
  "Add your offer, competitors, and audience research prompt.",
  "Run the workers and save every agent result to the workspace database.",
  "Review SEO, competitor, audience, and persona outputs from one dashboard."
];

export default async function LandingPage() {
  const session = await auth();
  const signedIn = Boolean(session?.user?.email);
  const primaryHref = signedIn ? "/workspaces" : "/sign-in";
  const primaryLabel = signedIn ? "Open workspaces" : "Start with OAuth";

  return (
    <main className="min-h-screen bg-paper text-ink">
      <MarketingNav signedIn={signedIn} />

      <section className="brutal-grid border-b-4 border-ink px-4 py-14 md:py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-[1fr_0.85fr]">
          <Reveal>
            <Badge>AI marketing operations workspace</Badge>
            <h1 className="mt-5 max-w-4xl text-5xl font-black leading-[0.95] md:text-7xl">
              Turn raw market context into saved growth decisions.
            </h1>
            <p className="mt-5 max-w-2xl text-xl font-bold text-ink/75">
              AdPeriscope gives each project its own workspace, runs focused AI workers, and stores the outputs so SEO, competitor, audience, and persona research does not disappear after one prompt.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild>
                <Link href={primaryHref}>
                  {primaryLabel} <ArrowRight className="size-5" />
                </Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/pricing">View pricing</Link>
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <Card className="bg-bolt">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-black uppercase">Workspace run</p>
                  <h2 className="mt-2 text-3xl font-black">From onboarding prompt to durable outputs</h2>
                </div>
                <Telescope className="size-10 shrink-0" />
              </div>
              <div className="mt-6 space-y-3">
                {[
                  ["SEO", "Keyword gaps, score, intent fixes"],
                  ["Competitors", "URL analysis and market pattern notes"],
                  ["Audience", "Pain points and recurring questions"],
                  ["Persona", "Tone, positioning, and customer archetypes"]
                ].map(([label, value]) => (
                  <div key={label} className="rounded-brutal border-2 border-ink bg-white p-3 shadow-brutal-sm">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-black uppercase">{label}</p>
                      <span className="rounded-full border-2 border-ink bg-acid px-3 py-1 text-xs font-black uppercase">
                        Saved
                      </span>
                    </div>
                    <p className="mt-1 text-sm font-bold text-ink/70">{value}</p>
                  </div>
                ))}
              </div>
            </Card>
          </Reveal>
        </div>
      </section>

      <section className="border-b-4 border-ink px-4 py-12">
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

      <section className="px-4 py-12">
        <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[0.85fr_1.15fr]">
          <Card className="bg-hot">
            <ClipboardList className="size-10" />
            <h2 className="mt-4 text-4xl font-black">Built around projects, not throwaway chats.</h2>
            <p className="mt-4 text-lg font-bold text-ink/75">
              Create one workspace per product, client, campaign, or creator brand. Each run is tied back to that workspace so the dashboard can show real saved progress instead of placeholder analytics.
            </p>
          </Card>

          <Card className="bg-white">
            <div className="flex items-center gap-3">
              <Sparkles className="size-9" />
              <h2 className="text-3xl font-black">How the flow works</h2>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {workflow.map((item, index) => (
                <div key={item} className="rounded-brutal border-2 border-ink bg-paper p-4">
                  <p className="text-xs font-black uppercase">Step {index + 1}</p>
                  <p className="mt-2 font-bold">{item}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>
    </main>
  );
}
