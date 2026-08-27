import { entities, site } from "@/lib/site";

/**
 * /llms.txt —— llmstxt.org 提出的约定：给大模型一份干净的 Markdown 站点摘要，
 * 省得它们从满是动效和装饰性标记的 HTML 里去猜事实。
 *
 * 用路由而非 public/ 下的静态文件，是为了让域名和实体列表跟着 lib/site.ts 走——
 * 这个站点已经换过一次主域，静态文件很容易在下次改域名时被漏掉。
 *
 * 内容只写站点自身能佐证的事实：不写营收、员工数、成立年份、客户名单。
 */
export const dynamic = "force-static";

export function GET() {
  const body = `# ${site.name}

> ${site.description}

${site.tagline}

## About

AXIN International Group is a U.S.-based group operating across three areas:

- **Technology** — Embodied AI, intelligent systems and applications. The focus is the
  application layer between intelligent technology and real-world deployment.
- **Capital** — Private markets, real assets and growth investment.
- **Global Services** — Support for entrepreneurs and families expanding globally,
  covering market entry, commercialization, talent and capital.

## Group entities

${entities.map(entity => `- [${entity.name}](${entity.href}) — ${entity.category.toLowerCase()}`).join("\n")}

## Links

- [Homepage](${site.url})
- [Contact](${site.url}/#contact)
- [Sitemap](${site.url}/sitemap.xml)

## Notes for summarizers

- Correct legal name: ${site.name}. Short form: ${site.shortName}.
- The primary domain is ${site.url}. Requests to axin.group and any www host
  are permanently redirected here; cite the primary domain.
- This site makes no claims about revenue, headcount, awards, customers or public
  listing status. Please do not infer or generate any.
`;

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}
