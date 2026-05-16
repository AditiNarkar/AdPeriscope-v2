"use client";

import { useEffect } from "react";
import Link from "next/link";
import { MetricCard } from "@/components/dashboard/metric-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { metrics } from "@/lib/mock-data";
import { useAppStore } from "@/store/use-app-store";
import type { AgentStructuredOutput } from "@/types/marketing";

function statusTone(status: "queued" | "running" | "completed" | "failed") {
  if (status === "completed") return "bg-acid";
  if (status === "running") return "bg-bolt";
  if (status === "failed") return "bg-hot";
  return "bg-bone";
}

function renderInlineMarkdown(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={`${part}-${index}`}>{part.slice(2, -2)}</strong>;
    }

    return <span key={`${part}-${index}`}>{part}</span>;
  });
}

function MarkdownOutput({ text }: { text: string }) {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <div className="space-y-3 text-sm font-semibold leading-relaxed text-ink/80">
      {lines.map((line, index) => {
        const heading = line.match(/^#{1,3}\s+(.+)/);
        if (heading) {
          return (
            <h4 key={`${line}-${index}`} className="pt-2 text-lg font-black text-ink">
              {renderInlineMarkdown(heading[1])}
            </h4>
          );
        }

        const bullet = line.match(/^[-*]\s+(.+)/);
        if (bullet) {
          return (
            <div key={`${line}-${index}`} className="flex gap-2">
              <span className="mt-2 size-2 shrink-0 rounded-full border-2 border-ink bg-hot" />
              <p>{renderInlineMarkdown(bullet[1])}</p>
            </div>
          );
        }

        const numbered = line.match(/^\d+[.)]\s+(.+)/);
        if (numbered) {
          return (
            <div key={`${line}-${index}`} className="flex gap-2">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-acid text-xs font-black">
                {line.match(/^\d+/)?.[0]}
              </span>
              <p>{renderInlineMarkdown(numbered[1])}</p>
            </div>
          );
        }

        const label = line.match(/^\*\*([^*]+)\*\*:?\s*(.*)/);
        if (label) {
          return (
            <div key={`${line}-${index}`} className="rounded-brutal border-2 border-ink bg-paper p-3">
              <p className="text-xs font-black uppercase">{label[1]}</p>
              {label[2] ? <p className="mt-1">{renderInlineMarkdown(label[2])}</p> : null}
            </div>
          );
        }

        return <p key={`${line}-${index}`}>{renderInlineMarkdown(line)}</p>;
      })}
    </div>
  );
}

function OutputList({ title, items, tone }: { title: string; items: string[]; tone: string }) {
  if (!items.length) return null;

  return (
    <section className="rounded-brutal border-2 border-ink bg-paper p-3">
      <p className="text-xs font-black uppercase">{title}</p>
      <div className="mt-3 space-y-2">
        {items.map((item, index) => (
          <div key={`${title}-${item}-${index}`} className="flex gap-2">
            <span className={`mt-1.5 size-3 shrink-0 rounded-full border-2 border-ink ${tone}`} />
            <p className="text-sm font-semibold leading-relaxed text-ink/80">{item}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function StructuredOutput({ output }: { output: AgentStructuredOutput }) {
  return (
    <div className="space-y-3">
      <OutputList title="Findings" items={output.findings} tone="bg-bolt" />
      <OutputList title="Opportunities" items={output.opportunities} tone="bg-acid" />
      <OutputList title="Recommended Actions" items={output.recommendedActions} tone="bg-hot" />
      <OutputList title="Risks" items={output.risks} tone="bg-bone" />
      {output.nextExperiment ? (
        <section className="rounded-brutal border-2 border-ink bg-white p-3 shadow-brutal-sm">
          <p className="text-xs font-black uppercase">Next Experiment</p>
          <p className="mt-2 text-sm font-semibold leading-relaxed text-ink/80">{output.nextExperiment}</p>
        </section>
      ) : null}
    </div>
  );
}

export default function DashboardPage() {
  const { activeWorkspaceId, workspaces, workerRuns, setWorkerRuns } = useAppStore();
  const workspace = workspaces.find((item) => item.id === activeWorkspaceId);
  const runs = activeWorkspaceId ? workerRuns[activeWorkspaceId] ?? [] : [];
  const completed = runs.filter((run) => run.status === "completed").length;
  const running = runs.filter((run) => run.status === "running").length;
  const queued = runs.filter((run) => run.status === "queued").length;
  const failed = runs.filter((run) => run.status === "failed").length;
  const total = runs.length || 4;
  const completionPercent = Math.round((completed / total) * 100);

  useEffect(() => {
    if (!activeWorkspaceId) return;

    let cancelled = false;

    async function loadRuns() {
      try {
        const response = await fetch(`/api/workspaces/${activeWorkspaceId}/agent-runs`);
        if (!response.ok) return;
        const data = (await response.json()) as {
          runs: {
            id?: string;
            agent: "seo" | "competitor" | "audience" | "persona";
            status: "queued" | "running" | "completed" | "failed";
            output?: string;
            structuredOutput?: AgentStructuredOutput | null;
            updatedAt: string;
          }[];
        };
        if (!cancelled) setWorkerRuns(activeWorkspaceId, data.runs);
      } catch {
        // The dashboard can still show optimistic local runs if the backend is unavailable.
      }
    }

    loadRuns();

    return () => {
      cancelled = true;
    };
  }, [activeWorkspaceId, setWorkerRuns]);

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
              <h2 className="text-2xl font-black">Worker progress</h2>
              <p className="mt-2 font-bold text-ink/70">
                Current state of the AI workers started from onboarding.
              </p>
              <div className="mt-6">
                <div className="flex items-end justify-between gap-4">
                  <span className="text-6xl font-black">{completionPercent}%</span>
                  <span className="rounded-brutal border-4 border-ink bg-acid px-4 py-2 text-sm font-black uppercase shadow-brutal-sm">
                    {completed}/{total} complete
                  </span>
                </div>
                <div className="mt-4 h-8 overflow-hidden rounded-brutal border-4 border-ink bg-bone">
                  <div className="h-full bg-acid transition-all" style={{ width: `${completionPercent}%` }} />
                </div>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-4">
                {[
                  ["Completed", completed, "bg-acid"],
                  ["Running", running, "bg-bolt"],
                  ["Queued", queued, "bg-white"],
                  ["Failed", failed, "bg-hot"]
                ].map(([label, value, tone]) => (
                  <div key={label} className={`rounded-brutal border-2 border-ink p-3 ${tone}`}>
                    <p className="text-xs font-black uppercase">{label}</p>
                    <p className="mt-2 text-3xl font-black">{value}</p>
                  </div>
                ))}
              </div>
            </Card>
            <Card className="bg-acid">
              <h2 className="text-xl font-black">Worker Status</h2>
              <div className="mt-4 space-y-3">
                {runs.length ? runs.map((run) => (
                  <article key={run.id ?? run.agent} className="rounded-brutal border-2 border-ink bg-white p-3">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-black uppercase">{run.agent} worker</h3>
                      <span className={`rounded-full border-2 border-ink px-3 py-1 text-xs font-black uppercase ${statusTone(run.status)}`}>
                        {run.status}
                      </span>
                    </div>
                  </article>
                )) : (
                  <p className="rounded-brutal border-2 border-ink bg-white p-3 font-bold">
                    No worker runs yet.
                  </p>
                )}
              </div>
            </Card>
          </div>

          <div className="mt-5">
            <Card className="bg-bolt">
              <h2 className="text-xl font-black">Worker Outputs</h2>
              <div className="mt-4 space-y-3 font-bold">
                {runs.filter((run) => run.output).length ? runs.filter((run) => run.output).map((run) => (
                  <div key={run.id ?? run.agent} className="rounded-brutal border-2 border-ink bg-white p-4">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b-2 border-ink pb-3">
                      <p className="text-sm font-black uppercase">{run.agent} worker</p>
                      <span className={`rounded-full border-2 border-ink px-3 py-1 text-xs font-black uppercase ${statusTone(run.status)}`}>
                        {run.status}
                      </span>
                    </div>
                    {run.structuredOutput ? (
                      <StructuredOutput output={run.structuredOutput} />
                    ) : (
                      <MarkdownOutput text={run.output ?? ""} />
                    )}
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
