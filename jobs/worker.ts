import { Worker } from "bullmq";
import { runMarketingAgent } from "@/agents/base-agent";
import { connection } from "@/jobs/queues";
import { log } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import type { AgentId } from "@/types/marketing";

type AgentJob = {
  agentRunId?: string;
  agent: AgentId;
  query: string;
  workspaceId?: string;
  sources?: string[];
};

new Worker(
  "agent-runs",
  async (job) => {
    const data = job.data as AgentJob;
    log("info", "Running queued agent job", {
      jobId: job.id,
      agentRunId: data.agentRunId,
      agent: data.agent
    });

    if (data.agentRunId) {
      await prisma.agentRun.update({
        where: { id: data.agentRunId },
        data: { status: "RUNNING" }
      });
    }

    try {
      const result = await runMarketingAgent(data);

      if (data.agentRunId) {
        await prisma.agentRun.update({
          where: { id: data.agentRunId },
          data: {
            status: "COMPLETED",
            output: {
              text: result.output,
              structuredOutput: result.structuredOutput,
              providerRunId: result.runId
            }
          }
        });
      }

      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Agent failed";

      if (data.agentRunId) {
        await prisma.agentRun.update({
          where: { id: data.agentRunId },
          data: {
            status: "FAILED",
            output: { error: message }
          }
        });
      }

      throw error;
    }
  },
  { connection }
);

log("info", "AdPeriscope worker started");
