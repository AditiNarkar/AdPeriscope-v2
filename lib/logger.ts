type LogLevel = "info" | "warn" | "error";

export function log(level: LogLevel, message: string, context?: Record<string, unknown>) {
  const payload = {
    level,
    message,
    service: "adperiscope",
    time: new Date().toISOString(),
    ...context
  };
  console[level === "error" ? "error" : level === "warn" ? "warn" : "log"](JSON.stringify(payload));
}

export function createRequestId() {
  return crypto.randomUUID();
}

export function maskSecret(value?: string) {
  if (!value) return "missing";
  if (value.length <= 8) return "configured";
  return `${value.slice(0, 4)}...${value.slice(-4)}`;
}
