import { SITE_URL } from "@/lib/seo";

// Private areas — never useful in search results or AI answers.
const PRIVATE = [
  "/admin",
  "/api/",
  "/manufacturer",
  "/invite/",
  "/user/profile",
  "/user/saved",
  "/user/quote-cart",
  "/post-login",
  "/login",
  "/register",
  "/forgot-password",
];

// AI assistants and AI search crawlers we explicitly welcome, so KrisluxECO can be
// found and cited by ChatGPT, Claude, Gemini, Perplexity, Copilot, Grok, Meta AI, etc.
const AI_BOTS = [
  "GPTBot", // OpenAI training
  "OAI-SearchBot", // ChatGPT search
  "ChatGPT-User", // ChatGPT browsing on a user's request
  "ClaudeBot", // Anthropic
  "Claude-SearchBot",
  "Claude-User",
  "anthropic-ai",
  "Google-Extended", // Gemini / Vertex AI
  "GoogleOther",
  "PerplexityBot",
  "Perplexity-User",
  "Applebot", // Siri / Spotlight
  "Applebot-Extended", // Apple Intelligence
  "Bingbot", // Bing + Microsoft Copilot
  "DuckAssistBot",
  "meta-externalagent", // Meta AI
  "Meta-ExternalFetcher",
  "xAI-Bot", // Grok
  "Amazonbot", // Alexa
  "MistralAI-User",
  "cohere-ai",
  "YouBot",
  "CCBot", // Common Crawl (used by many open AI models)
];

export default function robots() {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: PRIVATE },
      { userAgent: AI_BOTS, allow: ["/", "/llms.txt", "/llms-full.txt"], disallow: PRIVATE },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
