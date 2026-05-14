"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";
import { apiPost } from "@/api/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input, Textarea } from "@/components/ui/input";
import { useAppStore } from "@/store/use-app-store";

const steps = ["Brand", "Competitors", "Audience"];
const agents = ["seo", "competitor", "audience", "persona"] as const;

export default function OnboardingPage() {
  const router = useRouter();
  const {
    activeWorkspaceId,
    workspaces,
    updateWorkspace,
    setWorkerRuns
  } = useAppStore();
  const [step, setStep] = useState(0);
  const [offer, setOffer] = useState("");
  const [brandBrief, setBrandBrief] = useState("");
  const [competitors, setCompetitors] = useState("");
  const [audienceSources, setAudienceSources] = useState("");
  const [audienceBrief, setAudienceBrief] = useState("");
  const [running, setRunning] = useState(false);
  const [error, setError] = useState("");

  const workspace = useMemo(
    () => workspaces.find((item) => item.id === activeWorkspaceId),
    [activeWorkspaceId, workspaces]
  );

  async function startWorkers() {
    if (!workspace) return;

    const prompt = [
      `Workspace: ${workspace.name}`,
      `Offer: ${offer}`,
      `Brand brief: ${brandBrief}`,
      `Competitors: ${competitors}`,
      `Audience sources: ${audienceSources}`,
      `Audience brief: ${audienceBrief}`
    ]
      .filter((line) => !line.endsWith(": "))
      .join("\n");

    setRunning(true);
    setError("");
    updateWorkspace(workspace.id, { prompt });
    setWorkerRuns(
      workspace.id,
      agents.map((agent) => ({
        agent,
        status: "queued",
        updatedAt: new Date().toISOString()
      }))
    );

    try {
      await fetch(`/api/workspaces/${workspace.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      });

      const response = await apiPost<
        {
          runs: {
            id?: string;
            agent: (typeof agents)[number];
            status: "queued" | "running" | "completed" | "failed";
            output?: string;
            updatedAt: string;
          }[];
        },
        { query: string; agents: (typeof agents)[number][] }
      >(`/api/workspaces/${workspace.id}/agent-runs`, {
        query: prompt,
        agents: [...agents]
      });

      setWorkerRuns(workspace.id, response.runs);

      router.push("/dashboard");
    } catch {
      setError("Could not save workspace setup. Check backend logs and database configuration.");
    } finally {
      setRunning(false);
    }
  }

  if (!workspace) {
    return (
      <main className="min-h-screen bg-paper p-4 text-ink">
        <section className="mx-auto max-w-3xl py-10">
          <EmptyState
            title="No workspace selected"
            description="Launch or select a workspace first, then enter the prompt that starts the workers."
          />
          <Button asChild className="mt-5">
            <Link href="/workspaces">Go to workspaces</Link>
          </Button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-paper p-4 text-ink">
      <section className="mx-auto max-w-3xl py-10">
        <div className="flex gap-2">
          {steps.map((item, index) => (
            <div key={item} className={`h-4 flex-1 rounded-full border-2 border-ink ${index <= step ? "bg-hot" : "bg-white"}`} />
          ))}
        </div>
        <Card className="mt-6 bg-white">
          <p className="text-sm font-black uppercase">{workspace.name}</p>
          <h1 className="mt-2 text-4xl font-black">{steps[step]} setup</h1>
          <div>
            <div className="mt-6 space-y-4">
              {step === 0 && (
                <>
                  <Input type="text" value={offer} onChange={(event) => setOffer(event.target.value)} placeholder="What do you sell?" />
                  <Textarea value={brandBrief} onChange={(event) => setBrandBrief(event.target.value)} placeholder="Describe your offer, positioning, and best customers." />
                </>
              )}
              {step === 1 && (
                <div className="space-y-2">
                  <label htmlFor="competitors" className="text-sm font-black uppercase">
                    Competitor URLs
                  </label>
                  <Textarea
                    id="competitors"
                    name="competitors"
                    value={competitors}
                    onChange={(event) => setCompetitors(event.currentTarget.value)}
                    placeholder="https://competitor-one.com&#10;https://competitor-two.com"
                    className="min-h-48"
                  />
                  <p className="text-sm font-bold text-ink/70">
                    Add one competitor website per line. The competitor worker will use this during analysis.
                  </p>
                </div>
              )}
              {step === 2 && (
                <>
                  <Input type="text" value={audienceSources} onChange={(event) => setAudienceSources(event.target.value)} placeholder="Subreddits, keywords, or YouTube topics" />
                  <Textarea value={audienceBrief} onChange={(event) => setAudienceBrief(event.target.value)} placeholder="What should the AI look for?" />
                </>
              )}
            </div>
            {error ? <p className="mt-4 rounded-brutal border-2 border-ink bg-hot p-3 text-sm font-bold">{error}</p> : null}
            <div className="mt-6 flex justify-between">
              <Button type="button" variant="secondary" disabled={step === 0 || running} onClick={() => setStep((value) => value - 1)}>Back</Button>
              {step < 2 ? (
                <Button type="button" onClick={() => setStep((value) => value + 1)}>
                  Continue <ArrowRight className="size-5" />
                </Button>
              ) : (
                <Button type="button" onClick={startWorkers} disabled={running}>
                  {running ? <Loader2 className="size-5 animate-spin" /> : <ArrowRight className="size-5" />}
                  {running ? "Starting workers..." : "Start workers"}
                </Button>
              )}
            </div>
          </div>
        </Card>
      </section>
    </main>
  );
}
