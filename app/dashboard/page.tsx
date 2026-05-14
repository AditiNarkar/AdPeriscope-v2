"use client";

import Link from "next/link";
import { ActivityTimeline } from "@/components/dashboard/activity-timeline";
import { MetricCard } from "@/components/dashboard/metric-card";
import { TrendChart } from "@/components/charts/trend-chart";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { metrics } from "@/lib/mock-data";
import { useAppStore } from "@/store/use-app-store";

export default function DashboardPage() {
  const { activeWorkspaceId, workspaces, workerRuns } = useAppStore();
  const workspace = workspaces.find((item) => item.id === activeWorkspaceId);
  const runs = activeWorkspaceId ? workerRuns[activeWorkspaceId] ?? [] : [];

  return (
    <DashboardShell title="AI Command Center" eyebrow={workspace?.name ?? "No workspace selected"}>
      {!workspace ? (
        <div className="space-y-5">
          <EmptyState
            title="No workspace selected"
            description="Select or launch a workspace, enter the onboarding prompt, then the workers will generate outputs here."
          />
          <Button asChild>
            <Link href="/workspaces">Go to workspaces</Link>
          </Button>
        </div>
      ) : (
        <>
          <Card className="mb-5 bg-punch">
            <p className="text-xs font-black uppercase">Workspace prompt</p>
            <p className="mt-2 whitespace-pre-wrap font-bold">{workspace.prompt || "No prompt submitted yet. Complete onboarding to start workers."}</p>
            {!workspace.prompt ? (
              <Button asChild className="mt-4" variant="secondary">
                <Link href="/onboarding">Complete onboarding</Link>
              </Button>
            ) : null}
          </Card>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {metrics.map((metric) => <MetricCard key={metric.label} {...metric} />)}
          </div>

          <div className="mt-5 grid gap-5 xl:grid-cols-[1.4fr_0.8fr]">
            <Card className="bg-white">
              <h2 className="text-2xl font-black">Growth signals</h2>
              <TrendChart />
            </Card>
            <Card className="bg-acid">
              <h2 className="text-xl font-black">Worker Status</h2>
              <div className="mt-4 space-y-3">
                {runs.length ? runs.map((run) => (
                  <article key={run.agent} className="rounded-brutal border-2 border-ink bg-white p-3">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-black uppercase">{run.agent} worker</h3>
                      <span className="text-xs font-black uppercase">{run.status}</span>
                    </div>
                    {run.output ? <p className="mt-2 line-clamp-4 whitespace-pre-wrap text-sm font-semibold text-ink/75">{run.output}</p> : null}
                  </article>
                )) : (
                  <p className="rounded-brutal border-2 border-ink bg-white p-3 font-bold">
                    No worker runs yet.
                  </p>
                )}
              </div>
            </Card>
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            <ActivityTimeline items={runs.map((run) => `${run.agent} worker is ${run.status}`)} />
            <Card className="bg-bolt">
              <h2 className="text-xl font-black">Worker Outputs</h2>
              <div className="mt-4 space-y-3 font-bold">
                {runs.filter((run) => run.output).length ? runs.filter((run) => run.output).map((run) => (
                  <div key={run.agent} className="rounded-brutal border-2 border-ink bg-white p-3">
                    <p className="text-xs font-black uppercase">{run.agent}</p>
                    <p className="mt-2 whitespace-pre-wrap text-sm">{run.output}</p>
                  </div>
                )) : (
                  <p className="rounded-brutal border-2 border-ink bg-white p-3">
                    Outputs appear after onboarding starts workers.
                  </p>
                )}
              </div>
            </Card>
          </div>
        </>
      )}
    </DashboardShell>
  );
}
