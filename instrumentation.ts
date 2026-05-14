import { logEnvStatus } from "@/lib/env";
import { log } from "@/lib/logger";

export async function register() {
  log("info", "AdPeriscope server instrumentation registered", {
    runtime: process.env.NEXT_RUNTIME ?? "nodejs"
  });
  logEnvStatus();
}
