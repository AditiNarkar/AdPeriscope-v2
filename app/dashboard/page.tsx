import { ActivityTimeline } from "@/components/dashboard/activity-timeline";
import { AiSuggestionsPanel } from "@/components/dashboard/ai-suggestions-panel";
import { MetricCard } from "@/components/dashboard/metric-card";
import { TrendChart } from "@/components/charts/trend-chart";
import { Card } from "@/components/ui/card";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { metrics } from "@/lib/mock-data";

export default function DashboardPage() {
  return (
    <DashboardShell title="AI Command Center" eyebrow="Workspace overview">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => <MetricCard key={metric.label} {...metric} />)}
      </div>
      <div className="mt-5 grid gap-5 xl:grid-cols-[1.4fr_0.8fr]">
        <Card className="bg-white">
          <h2 className="text-2xl font-black">Growth signals</h2>
          <TrendChart />
        </Card>
        <AiSuggestionsPanel />
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <ActivityTimeline />
        <Card className="bg-bolt">
          <h2 className="text-xl font-black">Saved Reports</h2>
          <div className="mt-4 space-y-3 font-bold">
            {["May SEO gap brief", "Creator pain-point digest", "Competitor pattern scan"].map((report) => (
              <div key={report} className="rounded-brutal border-2 border-ink bg-white p-3">{report}</div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardShell>
  );
}
