# AXIN International Group — 官网

单页企业官网。线上地址 **https://axingroup.com**。

部署、域名、证书、表单配置见 [DEPLOY.md](./DEPLOY.md)。

## 技术栈

- Next.js（App Router）+ React + TypeScript
- Canvas 粒子景深场，CSS 滚动揭示动画
- `/api/contact` 服务端路由，转发到 Formspree
- metadata / sitemap / robots / 安全响应头
- 响应式，支持 `prefers-reduced-motion`

## 本地开发

```bash
npm install
npm run dev
```

打开 http://localhost:3000。

联系表单需要 `FORMSPREE_ENDPOINT`：

```bash
cp .env.example .env.local
# 填入 FORMSPREE_ENDPOINT=https://formspree.io/f/xxxxxxxx
```

不配的话 `POST /api/contact` 返回 503，前端显示提示——有意为之，宁可报错也不静默丢线索。

## 版本记录

### v5.2.0 — 2026-08-24

按 [Google SEO 入门指南](https://developers.google.com/search/docs/fundamentals/seo-starter-guide?hl=zh_CN)
做了一轮 SEO，同时补上针对 AI 抓取器的 GEO。

**SEO**

- **新增 JSON-LD 结构化数据**（`components/StructuredData.tsx`）：`Organization` + `WebSite`。
  指南第九节要求的部分，此前完全缺失。用 `subOrganization` 表达旗下四家实体的从属关系。
  **注意不要在这里用 `sameAs`**——它的语义是「同一实体的其他网址」（官方社媒那类），
  而这四家是子实体不是集团本身；写进 sameAs 等于声称它们就是 AXIN 集团。
- **新增 og:image**（`app/opengraph-image.tsx`，构建时用 `next/og` 生成 1200×630）。
  此前 `twitter:card` 已经声明了 `summary_large_image` 却没有图，分享出去是张空卡片。
- **新增 favicon**（`app/icon.svg`）。Google 搜索结果会显示站点图标，此前没有。
- **`<title>` 改为「全称 + 业务范围」**：`AXIN International Group — Technology, Capital & Global Services`。
  指南要求标题准确描述内容并包含商家名称；原标题是标语，品牌感强但检索信息少。
  标语移到 `og:title`，社交卡片那边更需要一句有感染力的话。
- **`<h1>` 补全称**：原本整页最重要的标题只有「AXIN」四个字母。
  视觉仍是字标不变，用 `.visually-hidden` 补一段「International Group — 标语」。
  这不是隐藏关键词——它和 logo 表达的是同一件事。
- `robots` 加 `max-image-preview: large` 和 `max-snippet: -1`，允许更完整的摘要展示。
- 按指南「不推荐的做法」一节，**刻意没有加 `keywords` meta**（Google 不使用）。

**GEO（AI 抓取器）**

- **`/llms.txt`**（`app/llms.txt/route.ts`）：[llmstxt.org](https://llmstxt.org) 约定的站点摘要，
  给大模型一份干净的 Markdown，省得它们从满是动效标记的 HTML 里猜事实。
  末尾的 "Notes for summarizers" 明确写了正确法定名称、主域名，
  以及**本站不作任何营收/规模/客户声明，请勿推断生成**。
  用路由而非静态文件，是为了让域名跟着 `lib/site.ts` 走——这站已经换过一次主域。
- **`robots.txt` 逐个列出主流 AI 抓取器并放行**：GPTBot、OAI-SearchBot、ChatGPT-User、
  ClaudeBot、Claude-User、PerplexityBot、Google-Extended、CCBot 等 16 个。
  `User-Agent: *` 本已放行，逐个列出是为了表达明确意图，
  且将来若要收紧某一家（比如只允许检索、不允许训练），改一行即可。
- 结构化数据同样服务于 GEO——AI 抓取器优先消费结构化事实，比解析营销文案可靠。

**重构**

- 四家实体的数据从 `app/page.tsx` 提到 `lib/site.ts` 的 `entities`，
  现在同时供页面外链、结构化数据、llms.txt 三处使用，单一数据源。

### v5.1.1 — 2026-08-24

为提交 Google Search Console 优化 sitemap：

- **`lastModified` 由 `new Date()` 改为常量 `CONTENT_UPDATED_AT`**。
  原写法在构建时求值，等于每次重新部署 lastmod 都变，内容没改也报「刚更新」；
  爬虫核对不上就会逐渐忽略这个字段，反而失去加快收录的作用。**改页面内容时记得手动更新这个常量。**
- `changeFrequency` 由 `weekly` 改为 `monthly`——单页企业站不会周更，如实申报
- sitemap 里的 URL 写法与 `layout.tsx` 输出的 canonical 对齐（根域不带尾斜杠），
  避免 GSC 里出现两种形态

提交给 GSC 的地址：`https://axingroup.com/sitemap.xml`

### v5.1.0 — 2026-08-24

生态板块四家实体挂上各自站点的链接，全部新标签页打开。

| 文字 | 链接 |
|------|------|
| AXIN Intelligent Systems | https://eduready.ai/ |
| YUNO Family Office | https://www.yunofamilyoffice.com/ |
| METO Capital | https://www.metocapital.com/ |
| Aili Academy | https://www.ailiacademy.com/ |

- 卡片由 `div` 改为 `a`，带 `target="_blank"` + `rel="noopener noreferrer"`
- 配套的交互样式：悬停上浮 + 边框提亮，右上角 `↗` 角标由暗转亮，
  键盘 focus 有独立描边；小屏下角标缩小并给标题留出右侧内边距，避免与文字相撞
- `aria-label` 里注明「opens in a new tab」，屏幕阅读器用户不会被新标签页打个措手不及
- **`www.eduready.ai` 会 301 到根域，所以直接写 `https://eduready.ai/`**，省掉一次跳转；
  另外三个站点 www 是直达的，保持原样

### v5.0.1 — 2026-08-24

- 主域切换到 `axingroup.com`，`site.url` 同步更新（影响 canonical / OG / sitemap / robots）
- 联系表单接入 Formspree，加蜜罐字段 `_gotcha`
- 修 `ContactForm`：`await` 之后 `event.currentTarget` 为 `null`，
  原代码在此调 `reset()` 会抛错被 catch 接住，**提交成功却显示失败**

### v5.0.0 — 2026-08-23

从 V4 单页静态 HTML 重写为 Next.js SSR 应用。容器化部署到 Server A。

## 内容原则

首页不出现虚构的营收、员工数、奖项、客户或上市公司相关表述。
FF 有意不作为首页/导航的主要元素；合作进展将来放到 News / Developments 下。
