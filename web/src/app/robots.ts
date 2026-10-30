import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * AI crawlers and answer engines, allowed by name so the site (and its
 * llms.txt) can be quoted in AI answers. Each one documents this user agent:
 * OpenAI (training, search, user fetches), Anthropic (training, user
 * fetches, search), Perplexity (index, user fetches), Google and Apple
 * (opt-in tokens for AI use) and Common Crawl (the open web corpus).
 */
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: AI_CRAWLERS, allow: "/" },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
