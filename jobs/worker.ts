import { Worker } from "bullmq";
import { runMarketingAgent } from "@/agents/base-agent";
import { connection } from "@/jobs/queues";
import { log } from "@/lib/logger";

new Worker(
  "agent-runs",
  async (job) => {
    log("info", "Running queued agent job", { jobId: job.id });
    return runMarketingAgent(job.data);
  },
  { connection }
);

log("info", "AdPeriscope worker started");
