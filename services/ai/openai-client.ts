import OpenAI from "openai";
import { env } from "@/lib/env";
import { log } from "@/lib/logger";

export const openai = env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: env.OPENAI_API_KEY })
  : null;

export async function generateText(prompt: string, system = "You are a senior digital marketing strategist.") {
  if (!openai) {
    log("warn", "OpenAI API key missing; returning demo AI response", {
      promptChars: prompt.length,
      system
    });
    return `Demo AI response: ${prompt.slice(0, 180)}...`;
  }

  log("info", "Calling OpenAI chat completion", {
    model: "gpt-4o-mini",
    promptChars: prompt.length
  });

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.5,
    messages: [
      { role: "system", content: system },
      { role: "user", content: prompt }
    ]
  });

  const output = response.choices[0]?.message.content ?? "";
  log("info", "OpenAI chat completion received", {
    outputChars: output.length
  });
  return output;
}

export async function embedText(input: string) {
  if (!openai) {
    log("warn", "OpenAI API key missing; returning deterministic demo embedding", {
      inputChars: input.length
    });
    return Array.from({ length: 1536 }, (_, index) => (index % 7) / 10);
  }
  log("info", "Calling OpenAI embeddings", {
    model: "text-embedding-3-small",
    inputChars: input.length
  });
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input
  });
  log("info", "OpenAI embedding received", {
    dimensions: response.data[0].embedding.length
  });
  return response.data[0].embedding;
}
