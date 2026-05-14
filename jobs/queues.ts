import { Queue } from "bullmq";
import IORedis from "ioredis";
import { env } from "@/lib/env";
import { log } from "@/lib/logger";

export const connection = new IORedis(env.REDIS_URL ?? "redis://localhost:6379", {
  maxRetriesPerRequest: null
});

export const agentQueue = new Queue("agent-runs", { connection });
export const reportQueue = new Queue("report-exports", { connection });

export function enqueueAgentRun(payload: Record<string, unknown>) {
  log("info", "Queueing agent run", {
    queue: "agent-runs",
    payloadKeys: Object.keys(payload)
  });
  return agentQueue.add("run-agent", payload, {
    attempts: 3,
    backoff: { type: "exponential", delay: 2_000 },
    removeOnComplete: 100
  });
}
