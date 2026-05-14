"use client";

import { useState } from "react";
import type { AgentId } from "@/types/marketing";
import { apiPost } from "@/api/client";

export function useAgentRun() {
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");

  async function run(agent: AgentId, query: string) {
    setLoading(true);
    try {
      const result = await apiPost<{ output: string }, { agent: AgentId; query: string }>("/api/agents/run", { agent, query });
      setOutput(result.output);
    } finally {
      setLoading(false);
    }
  }

  return { loading, output, run };
}
