"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, FolderKanban, Plus } from "lucide-react";
import { apiPost } from "@/api/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/store/use-app-store";

export default function WorkspacesPage() {
  const router = useRouter();
  const { workspace, workspaces, setWorkspace, setWorkspaces, addWorkspace } = useAppStore();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadWorkspaces() {
      try {
        const response = await fetch("/api/workspaces");
        if (!response.ok) {
          setError("Sign in with OAuth to load your saved workspaces.");
          return;
        }
        const data = (await response.json()) as { workspaces: typeof workspaces };
        setWorkspaces(data.workspaces);
      } finally {
        setLoading(false);
      }
    }

    loadWorkspaces();
    // Loading from the backend happens once on entry; Zustand keeps the active workspace locally.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function launchWorkspace(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextName = name.trim();
    if (!nextName) {
      setError("Workspace name is required.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const response = await apiPost<
        { workspace: { id: string; name: string; prompt: string; createdAt: string } },
        { name: string }
      >("/api/workspaces", {
        name: nextName
      });

      addWorkspace(response.workspace);
      setName("");
      router.push("/onboarding");
    } catch {
      setError("Could not save workspace. Check that you are signed in and DATABASE_URL is configured.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-paper p-4 text-ink">
      <section className="mx-auto max-w-7xl py-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase">After login</p>
            <h1 className="text-4xl font-black md:text-6xl">My Workspaces</h1>
          </div>
          <Button asChild variant="secondary">
            <Link href="/dashboard">Open dashboard</Link>
          </Button>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-[420px_1fr]">
          <Card className="bg-acid">
            <div className="flex items-center gap-2">
              <Plus className="size-5" />
              <h2 className="text-2xl font-black">Launch workspace</h2>
            </div>
            <form onSubmit={launchWorkspace} className="mt-4 space-y-3">
              <Input
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Workspace name"
                aria-label="Workspace name"
              />
              <Button type="submit" className="w-full" disabled={saving || !name.trim()}>
                {saving ? "Launching..." : "Launch workspace"}
              </Button>
              {error ? <p className="rounded-brutal border-2 border-ink bg-white p-3 text-sm font-bold">{error}</p> : null}
            </form>
          </Card>

          <section className="space-y-4">
            {loading ? (
              <Card className="bg-white">
                <p className="font-black">Loading workspaces...</p>
              </Card>
            ) : workspaces.length === 0 ? (
              <EmptyState
                title="No workspaces yet"
                description="Launch a workspace to start organizing prompts, SEO scans, personas, pain points, competitors, and content plans."
              />
            ) : (
              workspaces.map((item) => (
                <Card key={item.id} className={item.name === workspace ? "bg-bolt" : "bg-white"}>
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <FolderKanban className="size-5" />
                        <h2 className="text-2xl font-black">{item.name}</h2>
                      </div>
                      {item.prompt ? <p className="mt-2 max-w-3xl font-bold text-ink/70">{item.prompt}</p> : null}
                    </div>
                    <Button asChild onClick={() => setWorkspace(item.name, item.id)}>
                      <Link href={item.prompt ? "/dashboard" : "/onboarding"}>
                        {item.prompt ? "Open" : "Set up"} <ArrowRight className="size-5" />
                      </Link>
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </section>
        </div>
      </section>
    </main>
  );
}
