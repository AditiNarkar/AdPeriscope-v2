import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { runMarketingAgent } from "@/agents/base-agent";
import { auth } from "@/lib/auth";
import { withApiLogging } from "@/lib/api-logging";
import { env } from "@/lib/env";
import { log } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import { scrapeCompetitorHomepages } from "@/services/scraping/public-sources";
import type { AgentId } from "@/types/marketing";

const agentSchema = z.enum(["seo", "competitor", "audience", "persona"]);

const bodySchema = z.object({
  query: z.string().min(3),
  agents: z.array(agentSchema).min(1).default(["seo", "competitor", "audience", "persona"])
});

type WorkerStatus = "queued" | "running" | "completed" | "failed";
type WorkspaceAccess =
  | { ok: true; userId: string; workspaceId: string }
  | { ok: false; response: NextResponse };

async function getCurrentUserId() {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) return null;

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true }
  });

  return user?.id ?? null;
}

function getWorkspaceId(request: NextRequest) {
  const parts = request.nextUrl.pathname.split("/");
  const workspacesIndex = parts.indexOf("workspaces");
  return workspacesIndex >= 0 ? parts[workspacesIndex + 1] : undefined;
}

function toDbAgent(agent: AgentId) {
  return agent.toUpperCase() as "SEO" | "COMPETITOR" | "AUDIENCE" | "PERSONA";
}

function fromDbAgent(agent: string) {
  return agent.toLowerCase() as AgentId;
}

function fromDbStatus(status: string): WorkerStatus {
  if (status === "PENDING") return "queued";
  return status.toLowerCase() as WorkerStatus;
}

function outputText(output: unknown) {
  if (!output || typeof output !== "object") return undefined;
  const record = output as Record<string, unknown>;
  if (typeof record.text === "string") return record.text;
  if (typeof record.error === "string") return record.error;
  return undefined;
}

function removeCompetitorContext(query: string) {
  const lines = query.split("\n");
  const cleanedLines: string[] = [];
  let skippingCompetitors = false;

  for (const line of lines) {
    if (line.startsWith("Competitors:")) {
      skippingCompetitors = true;
      continue;
    }

    if (skippingCompetitors && line.startsWith("Audience sources:")) {
      skippingCompetitors = false;
    }

    if (!skippingCompetitors) cleanedLines.push(line);
  }

  return cleanedLines.join("\n").trim();
}

function agentContext(agent: AgentId, query: string, sources: string[]) {
  if (agent === "competitor") {
    return { query, sources };
  }

  return {
    query: removeCompetitorContext(query),
    sources: []
  };
}

async function requireWorkspace(request: NextRequest): Promise<WorkspaceAccess> {
  const userId = await getCurrentUserId();
  if (!userId) {
    return { ok: false, response: NextResponse.json({ error: "Authentication required" }, { status: 401 }) };
  }

  const workspaceId = getWorkspaceId(request);
  if (!workspaceId) {
    return { ok: false, response: NextResponse.json({ error: "Workspace id required" }, { status: 400 }) };
  }

  const workspace = await prisma.workspace.findFirst({
    where: { id: workspaceId, userId },
    select: { id: true }
  });

  if (!workspace) {
    return { ok: false, response: NextResponse.json({ error: "Workspace not found" }, { status: 404 }) };
  }

  return { ok: true, userId, workspaceId: workspace.id };
}

function mapRun(run: {
  id: string;
  agent: string;
  status: string;
  output: unknown;
  updatedAt: Date;
}) {
  return {
    id: run.id,
    agent: fromDbAgent(run.agent),
    status: fromDbStatus(run.status),
    output: outputText(run.output),
    updatedAt: run.updatedAt.toISOString()
  };
}

export const GET = withApiLogging("/api/workspaces/[id]/agent-runs", async (request: NextRequest) => {
  const workspace = await requireWorkspace(request);
  if (!workspace.ok) return workspace.response;

  const runs = await prisma.agentRun.findMany({
    where: { workspaceId: workspace.workspaceId },
    orderBy: { updatedAt: "desc" }
  });

  log("info", "Loaded workspace agent runs", {
    userId: workspace.userId,
    workspaceId: workspace.workspaceId,
    runCount: runs.length
  });

  return NextResponse.json({ runs: runs.map(mapRun) });
});

export const POST = withApiLogging("/api/workspaces/[id]/agent-runs", async (request: NextRequest) => {
  const workspace = await requireWorkspace(request);
  if (!workspace.ok) return workspace.response;

  const body = bodySchema.parse(await request.json());
  const shouldScrapeCompetitors = body.agents.includes("competitor");
  const webSources = shouldScrapeCompetitors ? await scrapeCompetitorHomepages(body.query) : [];
  const sourceSnippets = webSources.map((source) =>
    [
      `Title: ${source.title}`,
      `URL: ${source.url}`,
      `Text: ${source.text}`
    ].join("\n")
  );
  const savedRuns = [];

  log("info", "Starting persisted workspace agent run batch", {
    userId: workspace.userId,
    workspaceId: workspace.workspaceId,
    agents: body.agents,
    appMode: env.APP_MODE,
    sourceCount: sourceSnippets.length
  });

  if (env.APP_MODE === "PRODUCTION") {
    if (!env.REDIS_URL) {
      return NextResponse.json(
        { error: "REDIS_URL is required when APP_MODE=PRODUCTION" },
        { status: 500 }
      );
    }

    const { enqueueAgentRun } = await import("@/jobs/queues");

    for (const agent of body.agents) {
      const context = agentContext(agent, body.query, sourceSnippets);
      const dbRun = await prisma.agentRun.create({
        data: {
          agent: toDbAgent(agent),
          status: "PENDING",
          input: {
            query: context.query,
            sourceUrls: agent === "competitor" ? webSources.map((source) => source.url) : []
          },
          workspaceId: workspace.workspaceId
        }
      });

      await enqueueAgentRun({
        agentRunId: dbRun.id,
        agent,
        query: context.query,
        workspaceId: workspace.workspaceId,
        sources: context.sources
      });

      savedRuns.push(dbRun);
    }

    return NextResponse.json({ runs: savedRuns.map(mapRun) });
  }

  for (const agent of body.agents) {
    const context = agentContext(agent, body.query, sourceSnippets);
    const dbRun = await prisma.agentRun.create({
      data: {
        agent: toDbAgent(agent),
        status: "RUNNING",
        input: {
          query: context.query,
          sourceUrls: agent === "competitor" ? webSources.map((source) => source.url) : []
        },
        workspaceId: workspace.workspaceId
      }
    });

    try {
      const result = await runMarketingAgent({
        agent,
        query: context.query,
        workspaceId: workspace.workspaceId,
        sources: context.sources
      });

      const updated = await prisma.agentRun.update({
        where: { id: dbRun.id },
        data: {
          status: "COMPLETED",
          output: {
            text: result.output,
            providerRunId: result.runId,
            sources:
              agent === "competitor"
                ? webSources.map((source) => ({
                    title: source.title,
                    url: source.url,
                    chars: source.text.length
                  }))
                : []
          }
        }
      });

      savedRuns.push(updated);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Agent failed";
      const updated = await prisma.agentRun.update({
        where: { id: dbRun.id },
        data: {
          status: "FAILED",
          output: { error: message }
        }
      });

      log("error", "Workspace agent run failed", {
        userId: workspace.userId,
        workspaceId: workspace.workspaceId,
        agent,
        error: message
      });
      savedRuns.push(updated);
    }
  }

  return NextResponse.json({ runs: savedRuns.map(mapRun) });
});
