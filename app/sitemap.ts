import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

// 内容实际变更的日期，改页面内容时手动更新这里。
// 不要写成 new Date()：那样 lastmod 会跟着每次构建走，内容没动也报"刚更新"，
// 爬虫对不上就会逐渐忽略这个字段，反而失去加快收录的作用。
const CONTENT_UPDATED_AT = "2026-08-24";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      // 与 layout.tsx 输出的 canonical 保持完全一致的写法（根域不带尾斜杠），
      // 免得 GSC 里出现两种形态让人疑心是两个 URL
      url: site.url,
      lastModified: new Date(CONTENT_UPDATED_AT),
      // 单页企业站，内容不会周更，如实写月度
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
