import { NextRequest, NextResponse } from "next/server";
import { log, createRequestId } from "@/lib/logger";

type ApiHandler = (request: NextRequest, context: { requestId: string }) => Promise<NextResponse>;

export function withApiLogging(route: string, handler: ApiHandler) {
  return async function loggedHandler(request: NextRequest) {
    const requestId = createRequestId();
    const startedAt = Date.now();

    log("info", "API request started", {
      requestId,
      route,
      method: request.method,
      userAgent: request.headers.get("user-agent") ?? "unknown"
    });

    try {
      const response = await handler(request, { requestId });
      log("info", "API request completed", {
        requestId,
        route,
        status: response.status,
        durationMs: Date.now() - startedAt
      });
      response.headers.set("x-adperiscope-request-id", requestId);
      return response;
    } catch (error) {
      log("error", "API request failed", {
        requestId,
        route,
        durationMs: Date.now() - startedAt,
        error: error instanceof Error ? error.message : "Unknown error"
      });
      return NextResponse.json(
        {
          error: "Internal server error",
          requestId
        },
        { status: 500 }
      );
    }
  };
}
