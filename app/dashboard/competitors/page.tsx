import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { competitors } from "@/lib/mock-data";

export default function CompetitorsPage() {
  return (
    <DashboardShell title="Competitor Intelligence" eyebrow="Pattern tracking">
      <Card className="bg-acid">
        <div className="grid gap-3 md:grid-cols-[1fr_auto]">
          <Input placeholder="https://competitor.com/blog" />
          <Button>Track competitor</Button>
        </div>
      </Card>
      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        {competitors.map((competitor) => (
          <Card key={competitor.name} className="bg-white">
            <p className="text-sm font-black uppercase">{competitor.url}</p>
            <h2 className="mt-2 text-3xl font-black">{competitor.name}</h2>
            <p className="mt-3 text-5xl font-black">{competitor.score}</p>
            <p className="font-black">{competitor.cadence}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {competitor.winningTopics.map((topic) => (
                <span key={topic} className="rounded-full border-2 border-ink bg-bolt px-3 py-1 text-xs font-black">{topic}</span>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </DashboardShell>
  );
}
