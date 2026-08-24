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
