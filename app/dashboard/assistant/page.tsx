"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/input";
import { apiPost } from "@/api/client";

type Message = { role: "user" | "assistant"; content: string };

export default function AssistantPage() {
  const [input, setInput] = useState("Create a launch campaign for an AI marketing SaaS.");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Ask me for campaign ideas, SEO actions, competitor summaries, captions, hooks, or reporting briefs." }
  ]);

  async function send() {
    if (!input.trim()) return;
    const userMessage = input;
    setMessages((current) => [...current, { role: "user", content: userMessage }]);
    setInput("");
    setLoading(true);
    try {
      const response = await apiPost<{ output: string }, { message: string }>("/api/ai/chat", { message: userMessage });
      setMessages((current) => [...current, { role: "assistant", content: response.output }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <DashboardShell title="AI Content Assistant" eyebrow="Strategy chat">
      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <Card className="min-h-[540px] bg-white">
          <div className="space-y-3">
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`rounded-brutal border-2 border-ink p-4 font-bold ${message.role === "assistant" ? "bg-acid" : "bg-bolt"}`}>
                <p className="text-xs font-black uppercase">{message.role}</p>
                <p className="mt-2 whitespace-pre-wrap">{message.content}</p>
              </div>
            ))}
            {loading ? <div className="rounded-brutal border-2 border-ink bg-bone p-4 font-black">Thinking...</div> : null}
          </div>
        </Card>
        <Card className="bg-hot">
          <h2 className="text-2xl font-black">Prompt workspace</h2>
          <Textarea className="mt-4" value={input} onChange={(event) => setInput(event.target.value)} />
          <Button variant="secondary" className="mt-4 w-full" onClick={send}>
            <Send className="size-5" /> Send
          </Button>
        </Card>
      </div>
    </DashboardShell>
  );
}
