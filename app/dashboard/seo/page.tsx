"use client";

import { useEffect } from "react";
import Link from "next/link";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { useAppStore } from "@/store/use-app-store";

type SeoRun = {
  id?: string;
  agent: "seo" | "competitor" | "audience" | "persona";
  status: "queued" | "running" | "completed" | "failed";
  output?: string;
  updatedAt: string;
};

function extractSeoScore(output?: string) {
  if (!output) return 0;
  const explicitScore = output.match(/seo\s*score[^0-9]{0,12}(\d{1,3})/i);
  const genericScore = output.match(/score[^0-9]{0,12}(\d{1,3})/i);
  const value = Number(explicitScore?.[1] ?? genericScore?.[1] ?? 0);
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, value));
}

export default function SeoPage() {
  const { activeWorkspaceId, workspaces, workerRuns, setWorkerRuns } = useAppStore();
  const workspace = workspaces.find((item) => item.id === activeWorkspaceId);
  const runs = activeWorkspaceId ? workerRuns[activeWorkspaceId] ?? [] : [];
  const seoRun = runs.find((run) => run.agent === "seo") as SeoRun | undefined;
  const seoScore = extractSeoScore(seoRun?.output);

  useEffect(() => {
    if (!activeWorkspaceId) return;

    let cancelled = false;

    async function loadRuns() {
      try {
        const response = await fetch(`/api/workspaces/${activeWorkspaceId}/agent-runs`);
        if (!response.ok) return;
        const data = (await response.json()) as { runs: SeoRun[] };
        if (!cancelled) setWorkerRuns(activeWorkspaceId, data.runs);
      } catch {
        // Keep local optimistic data if the API is unavailable.
      }
    }

    loadRuns();

    return () => {
      cancelled = true;
    };
  }, [activeWorkspaceId, setWorkerRuns]);

  return (
    <DashboardShell title="SEO Insights" eyebrow={workspace?.name ?? "Keyword intelligence"}>
      {!workspace ? (
        <EmptyState
          title="No workspace selected"
          description="Select a workspace before viewing SEO agent output."
        />
      ) : (
        <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
          <Card className="bg-hot">
            <p className="text-sm font-black uppercase">SEO Score</p>
            <h2 className="mt-3 text-7xl font-black">{seoScore}</h2>
            <p className="mt-3 font-bold">
              {seoRun?.status === "completed"
                ? "Score is parsed from the latest saved SEO worker output. If the model does not return a score, it stays at 0."
                : "No completed SEO run yet. Complete onboarding to generate workspace-specific SEO recommendations."}
            </p>
          </Card>

          <Card>
            <h2 className="text-2xl font-black">Latest SEO Worker Output</h2>
            {seoRun?.output ? (
              <div className="mt-4 rounded-brutal border-2 border-ink bg-paper p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs font-black uppercase">{seoRun.status}</p>
                  <p className="text-xs font-black uppercase">
                    {new Date(seoRun.updatedAt).toLocaleString()}
                  </p>
                </div>
                <p className="mt-3 whitespace-pre-wrap text-sm font-bold">{seoRun.output}</p>
              </div>
            ) : (
              <div className="mt-4">
                <EmptyState
                  title="No SEO data yet"
                  description="Start the onboarding workers and the SEO agent output will appear here from the database."
                />
                <Button asChild className="mt-4">
                  <Link href="/onboarding">Go to onboarding</Link>
                </Button>
              </div>
            )}
          </Card>
        </div>
      )}
    </DashboardShell>
  );
}
