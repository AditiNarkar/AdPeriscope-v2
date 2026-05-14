import { NextResponse } from "next/server";
import { withApiLogging } from "@/lib/api-logging";
import { log } from "@/lib/logger";

export const POST = withApiLogging("/api/reports/export", async () => {
  // Hook this to a server-side PDF renderer in production.
  log("warn", "Report export is running in demo queued mode");
  return NextResponse.json({
    url: "/reports/demo-marketing-brief.pdf",
    status: "queued"
  });
});
