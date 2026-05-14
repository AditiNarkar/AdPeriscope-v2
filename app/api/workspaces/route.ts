import { NextResponse } from "next/server";
import { withApiLogging } from "@/lib/api-logging";
import { log } from "@/lib/logger";

export const GET = withApiLogging("/api/workspaces", async () => {
  log("warn", "Returning demo workspaces because database-backed workspace loading is not connected");
  return NextResponse.json({
    workspaces: [
      { id: "launch-lab", name: "Launch Lab", role: "owner" },
      { id: "creator-stack", name: "Creator Stack", role: "analyst" }
    ]
  });
});
