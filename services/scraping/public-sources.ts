export type ScrapedDiscussion = {
  source: "reddit" | "youtube" | "web" | "rss";
  title: string;
  body: string;
  url: string;
  engagement?: number;
};

export type ScrapedWebSource = {
  title: string;
  url: string;
  text: string;
};

const MAX_COMPETITOR_URLS = 3;
const MAX_SOURCE_CHARS = 8_000;
const MAX_RESPONSE_BYTES = 1_000_000;
const FETCH_TIMEOUT_MS = 8_000;

export function extractHttpUrls(input: string) {
  const matches = input.match(/https?:\/\/[^\s),]+/gi) ?? [];
  return Array.from(new Set(matches))
    .map((url) => url.replace(/[.,;]+$/, ""))
    .slice(0, MAX_COMPETITOR_URLS);
}

function extractTitle(html: string, fallbackUrl: string) {
  const title = html.match(/<title[^>]*>(.*?)<\/title>/is)?.[1];
  if (!title) return fallbackUrl;
  return normalizeText(title).slice(0, 140) || fallbackUrl;
}

function normalizeText(value: string) {
  return value
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function htmlToText(html: string) {
  const withoutNoise = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<svg[\s\S]*?<\/svg>/gi, " ");

  return normalizeText(withoutNoise.replace(/<[^>]+>/g, " ")).slice(0, MAX_SOURCE_CHARS);
}

async function fetchHomepageText(url: string): Promise<ScrapedWebSource | null> {
  const { log } = await import("@/lib/logger");
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "user-agent": "AdPeriscopeBot/0.1; low-load research preview"
      }
    });

    const contentType = response.headers.get("content-type") ?? "";
    const contentLength = Number(response.headers.get("content-length") ?? 0);

    if (!response.ok || !contentType.includes("text/html") || contentLength > MAX_RESPONSE_BYTES) {
      log("warn", "Skipped competitor source", {
        url,
        status: response.status,
        contentType,
        contentLength
      });
      return null;
    }

    const html = await response.text();
    const text = htmlToText(html);
    if (text.length < 200) {
      log("warn", "Skipped competitor source with too little text", { url, textChars: text.length });
      return null;
    }

    return {
      title: extractTitle(html, url),
      url,
      text
    };
  } catch (error) {
    log("warn", "Competitor source fetch failed", {
      url,
      error: error instanceof Error ? error.message : "Unknown error"
    });
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

export async function scrapeCompetitorHomepages(input: string): Promise<ScrapedWebSource[]> {
  const { log } = await import("@/lib/logger");
  const urls = extractHttpUrls(input);
  const sources: ScrapedWebSource[] = [];

  log("info", "Low-load competitor source scrape started", {
    requestedUrlCount: urls.length,
    maxUrls: MAX_COMPETITOR_URLS,
    maxCharsPerSource: MAX_SOURCE_CHARS
  });

  for (const url of urls) {
    const source = await fetchHomepageText(url);
    if (source) sources.push(source);
  }

  log("info", "Low-load competitor source scrape completed", {
    requestedUrlCount: urls.length,
    sourceCount: sources.length
  });

  return sources;
}

export async function scrapePublicDiscussions(query: string): Promise<ScrapedDiscussion[]> {
  const { log } = await import("@/lib/logger");
  log("info", "Public discussion scrape started", {
    query,
    mode: "demo",
    adapters: ["reddit", "youtube"]
  });

  // Production adapters can plug in Reddit API, YouTube Data API, Firecrawl, or Playwright here.
  const discussions: ScrapedDiscussion[] = [
    {
      source: "reddit",
      title: `Reddit discussion about ${query}`,
      body: "Found recurring complaints about unclear ROI, too much manual research, and generic AI outputs.",
      url: "https://reddit.com",
      engagement: 128
    },
    {
      source: "youtube",
      title: `YouTube comments about ${query}`,
      body: "Commenters ask for practical workflows, templates, and examples they can adapt quickly.",
      url: "https://youtube.com",
      engagement: 74
    }
  ];

  log("warn", "Using mocked public discussion data because source API credentials are not connected", {
    query,
    discussionCount: discussions.length
  });

  return discussions;
}
