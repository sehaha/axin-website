import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

// 主流 AI 抓取器 / 检索代理。`User-Agent: *` 本来就已经放行了它们，
// 这里逐个列出是为了把"欢迎抓取"这件事表达明确——部分厂商只认自己的 token，
// 且将来若要收紧某一家（比如只允许检索、不允许训练），在这里改一行就行。
const aiAgents = [
  "GPTBot", // OpenAI 训练抓取
  "OAI-SearchBot", // ChatGPT 搜索索引
  "ChatGPT-User", // ChatGPT 用户实时取用
  "ClaudeBot", // Anthropic 抓取
  "Claude-User", // Claude 用户实时取用
  "Claude-SearchBot",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended", // Gemini / Vertex 训练用，与 Googlebot 的收录相互独立
  "Applebot-Extended",
  "meta-externalagent",
  "Bytespider",
  "CCBot", // Common Crawl，多数开源模型的语料来源
  "cohere-ai",
  "Diffbot",
  "Amazonbot",
  "YouBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      ...aiAgents.map(userAgent => ({ userAgent, allow: "/" })),
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
