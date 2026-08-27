import { entities, site } from "@/lib/site";

/**
 * JSON-LD 结构化数据。两个作用：
 *  1. 让 Google 把 AXIN 识别为一个明确的组织实体，而不只是一堆文字；
 *  2. AI 抓取器（ChatGPT / Perplexity / Claude 等）优先消费结构化事实，
 *     有这块比让它们去猜页面里的营销文案可靠得多。
 *
 * 只写站点自身能佐证的事实——不写营收、员工数、成立年份、奖项这类无从核实的内容。
 */
export function StructuredData() {
  const organizationId = `${site.url}/#organization`;

  const graph = [
    {
      "@type": "Organization",
      "@id": organizationId,
      name: site.name,
      alternateName: site.shortName,
      url: site.url,
      description: site.description,
      slogan: site.tagline,
      address: {
        "@type": "PostalAddress",
        addressCountry: "US",
      },
      // 注意别在这里用 sameAs——它的语义是「同一个实体的其他网址」（官方社媒主页那类），
      // 而下面这几家是旗下子实体，不是 AXIN 集团本身。将来有官方 LinkedIn 等再加 sameAs。
      subOrganization: entities.map(entity => ({
        "@type": "Organization",
        name: entity.name,
        url: entity.href,
      })),
    },
    {
      "@type": "WebSite",
      "@id": `${site.url}/#website`,
      url: site.url,
      name: site.name,
      description: site.description,
      inLanguage: "en",
      publisher: { "@id": organizationId },
    },
  ];

  return (
    <script
      type="application/ld+json"
      // JSON.stringify 的输出不含未转义的 </script>，此处注入是安全的
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }),
      }}
    />
  );
}
