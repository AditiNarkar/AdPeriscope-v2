import { env } from "@/lib/env";
import { log } from "@/lib/logger";

const DEFAULT_OLLAMA_BASE_URL = "http://localhost:11434";
const DEFAULT_OLLAMA_MODEL = "llama3.1:8b";
const DEFAULT_OLLAMA_EMBEDDING_MODEL = "nomic-embed-text";

function getOllamaBaseUrl() {
  return env.OLLAMA_BASE_URL || DEFAULT_OLLAMA_BASE_URL;
}

function getOllamaModel() {
  return env.OLLAMA_MODEL || DEFAULT_OLLAMA_MODEL;
}

function getOllamaEmbeddingModel() {
  return env.OLLAMA_EMBEDDING_MODEL || DEFAULT_OLLAMA_EMBEDDING_MODEL;
}

export async function generateText(prompt: string, system = "You are a senior digital marketing strategist.") {
  const baseUrl = getOllamaBaseUrl();
  const model = getOllamaModel();

  log("info", "Calling Ollama text generation", {
    provider: "ollama",
    baseUrl,
    model,
    promptChars: prompt.length
  });

  try {
    const response = await fetch(`${baseUrl}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        stream: false,
        messages: [
          { role: "system", content: system },
          { role: "user", content: prompt }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`Ollama chat failed with ${response.status}`);
    }

    const data = (await response.json()) as { message?: { content?: string } };
    const output = data.message?.content ?? "";

    log("info", "Ollama text generation completed", {
      provider: "ollama",
      model,
      outputChars: output.length
    });

    return output;
  } catch (error) {
    log("error", "Ollama text generation failed", {
      provider: "ollama",
      baseUrl,
      model,
      error: error instanceof Error ? error.message : "Unknown error"
    });

    return [
      "Ollama is not available yet.",
      `Expected server: ${baseUrl}`,
      `Expected model: ${model}`,
      "Run: ollama serve",
      `Then run: ollama pull ${model}`,
      "",
      "Original prompt preview:",
      prompt.slice(0, 500)
    ].join("\n");
  }
}

export async function embedText(input: string) {
  const baseUrl = getOllamaBaseUrl();
  const model = getOllamaEmbeddingModel();

  log("info", "Calling Ollama embeddings", {
    provider: "ollama",
    baseUrl,
    model,
    inputChars: input.length
  });

  try {
    const response = await fetch(`${baseUrl}/api/embeddings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        prompt: input
      })
    });

    if (!response.ok) {
      throw new Error(`Ollama embeddings failed with ${response.status}`);
    }

    const data = (await response.json()) as { embedding?: number[] };
    const embedding = data.embedding ?? [];

    log("info", "Ollama embedding completed", {
      provider: "ollama",
      model,
      dimensions: embedding.length
    });

    return embedding.length ? embedding : Array.from({ length: 768 }, () => 0);
  } catch (error) {
    log("error", "Ollama embedding failed; returning zero vector fallback", {
      provider: "ollama",
      baseUrl,
      model,
      error: error instanceof Error ? error.message : "Unknown error"
    });

    return Array.from({ length: 768 }, () => 0);
  }
}
