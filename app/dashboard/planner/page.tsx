import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { calendar } from "@/lib/mock-data";

export default function PlannerPage() {
  return (
    <DashboardShell title="Content Strategy Planner" eyebrow="Calendar builder">
      <Card className="bg-hot">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-black">Weekly content calendar</h2>
            <p className="font-bold">Generated from SEO gaps, competitor velocity, and audience pain points.</p>
          </div>
          <Button variant="secondary">Schedule generation</Button>
        </div>
      </Card>
      <div className="mt-5 grid gap-4">
        {calendar.map((item) => (
          <Card key={`${item.day}-${item.channel}`} className="grid gap-4 bg-white md:grid-cols-[80px_120px_1fr_160px_180px] md:items-center">
            <strong className="text-2xl font-black">{item.day}</strong>
            <span className="rounded-full border-2 border-ink bg-acid px-3 py-1 text-center font-black">{item.channel}</span>
            <p className="text-lg font-black">{item.hook}</p>
            <p className="font-bold">{item.format}</p>
            <p className="font-bold">{item.cta}</p>
          </Card>
        ))}
      </div>
    </DashboardShell>
  );
}
