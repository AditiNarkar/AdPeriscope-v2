"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  FolderKanban,
  Plus,
  Trash2
} from "lucide-react";
import { apiPost } from "@/api/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/store/use-app-store";

type Workspace = {
  id: string;
  name: string;
  prompt: string;
  createdAt: string;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(value));
}

export default function WorkspacesPage() {
  const router = useRouter();
  const {
    workspace,
    workspaces,
    setWorkspace,
    setWorkspaces,
    addWorkspace,
    removeWorkspace
  } = useAppStore();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [error, setError] = useState("");

  const configuredCount = workspaces.filter((item) => item.prompt).length;

  useEffect(() => {
    async function loadWorkspaces() {
      try {
        const response = await fetch("/api/workspaces");
        if (!response.ok) {
          setError("Sign in with OAuth to load your saved workspaces.");
          return;
        }
        const data = (await response.json()) as { workspaces: Workspace[] };
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
        { workspace: Workspace },
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

  async function deleteWorkspace(item: Workspace) {
    const confirmed = window.confirm(`Delete "${item.name}"? This will remove its agent runs and reports.`);
    if (!confirmed) return;

    setDeletingId(item.id);
    setError("");

    try {
      const response = await fetch(`/api/workspaces/${item.id}`, {
        method: "DELETE"
      });

      if (!response.ok) throw new Error("Delete failed");
      removeWorkspace(item.id);
    } catch {
      setError("Could not delete workspace. Try again or check backend logs.");
    } finally {
      setDeletingId("");
    }
  }

  return (
    <main className="min-h-screen bg-paper p-4 text-ink">
      <section className="mx-auto max-w-7xl py-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase text-ink/60">Project control center</p>
            <h1 className="text-4xl font-black md:text-6xl">Workspaces</h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="secondary">
              <Link href="/dashboard">Open dashboard</Link>
            </Button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <Card className="bg-acid shadow-brutal-sm">
            <p className="text-xs font-black uppercase">Total</p>
            <p className="mt-2 text-4xl font-black">{workspaces.length}</p>
          </Card>
          <Card className="bg-bolt shadow-brutal-sm">
            <p className="text-xs font-black uppercase">Configured</p>
            <p className="mt-2 text-4xl font-black">{configuredCount}</p>
          </Card>
          <Card className="bg-hot shadow-brutal-sm">
            <p className="text-xs font-black uppercase">Needs setup</p>
            <p className="mt-2 text-4xl font-black">{workspaces.length - configuredCount}</p>
          </Card>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-[400px_1fr]">
          <Card className="h-fit bg-white">
            <div className="flex items-center gap-2">
              <Plus className="size-5" />
              <h2 className="text-2xl font-black">New workspace</h2>
            </div>
            <p className="mt-2 text-sm font-bold text-ink/70">
              Use one workspace per business, client, campaign, or creator brand.
            </p>
            <form onSubmit={launchWorkspace} className="mt-5 space-y-3">
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
              {error ? <p className="rounded-brutal border-2 border-ink bg-hot p-3 text-sm font-bold">{error}</p> : null}
            </form>
          </Card>

          <section>
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-2xl font-black">Project list</h2>
              <p className="text-sm font-black uppercase text-ink/60">{workspaces.length} saved</p>
            </div>

            {loading ? (
              <Card className="bg-white">
                <p className="font-black">Loading workspaces...</p>
              </Card>
            ) : workspaces.length === 0 ? (
              <EmptyState
                title="No workspaces yet"
                description="Launch a workspace to start organizing SEO scans, personas, pain points, and competitors."
              />
            ) : (
              <div className="overflow-hidden rounded-brutal border-4 border-ink bg-white shadow-brutal">
                {workspaces.map((item, index) => {
                  const isActive = item.name === workspace;
                  const isConfigured = Boolean(item.prompt);

                  return (
                    <article
                      key={item.id}
                      className={`grid gap-4 border-ink p-4 md:grid-cols-[1fr_auto] md:items-center ${
                        index > 0 ? "border-t-4" : ""
                      } ${isActive ? "bg-bolt" : "bg-white"}`}
                    >
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-3">
                          <FolderKanban className="size-5 shrink-0" />
                          <h3 className="truncate text-2xl font-black">{item.name}</h3>
                          <span className={`inline-flex items-center gap-1 rounded-full border-2 border-ink px-3 py-1 text-xs font-black uppercase ${
                            isConfigured ? "bg-acid" : "bg-bone"
                          }`}>
                            <CheckCircle2 className="size-3" />
                            {isConfigured ? "Ready" : "Setup needed"}
                          </span>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-3 text-sm font-bold text-ink/70">
                          <span className="inline-flex items-center gap-2">
                            <CalendarDays className="size-4" />
                            Created {formatDate(item.createdAt)}
                          </span>
                          <span>ID: {item.id.slice(0, 8)}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 md:justify-end">
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => setWorkspace(item.name, item.id)}
                          asChild
                        >
                          <Link href={isConfigured ? "/dashboard" : "/onboarding"}>
                            {isConfigured ? "Open" : "Set up"} <ArrowRight className="size-5" />
                          </Link>
                        </Button>
                        <Button
                          type="button"
                          variant="hot"
                          disabled={deletingId === item.id}
                          onClick={() => deleteWorkspace(item)}
                          aria-label={`Delete ${item.name}`}
                        >
                          <Trash2 className="size-5" />
                          {deletingId === item.id ? "Deleting" : "Delete"}
                        </Button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}
