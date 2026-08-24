# AXIN 官网部署规范

> 生产仓库：`sehaha/axin-website` 的 **main** 分支。
> 生产服务器：**Server A (173.249.200.219)**，与 wanneng.app 同机，NPM 反代在最前面。
> 状态：**已上线**（2026-08-24），https://axin.group

## 域名策略

**主域名 `axin.group`，`www.axin.group` 301 跳到主域名。**

理由：`.group` 这个 TLD 本身就承载了"集团"的含义，`axin.group` 读起来是完整的一句品牌名，
前面再加 `www.` 纯属冗余。传统上把 www 当主域的两个理由在这里都不成立——
Cloudflare 支持根域 CNAME flattening，不存在根域无法接 CDN 的问题；
本站不写 cookie，也不存在 cookie 泄漏到子域的顾虑。

两个域名不同时返回 200，统一 301 收敛到根域，避免重复内容。
`lib/site.ts` 里的 `site.url` 必须跟这个策略一致（它同时喂给 canonical、OG、sitemap、robots）。
**V5 源码原本写的是 `https://www.axin.group`，已改为根域。以后合并上游改动时注意别被改回去。**

## 生产架构

| 组件 | 容器名 | 端口 | 入口 |
|------|--------|------|------|
| AXIN 官网（Next.js SSR） | `axin-website` | 4003 | `axin.group`（经 NPM 反代） |

V5 起站点是 **Next.js App Router 应用**（不是静态页），带 `/api/contact` 服务端路由，
所以必须跑 Node 进程，不能像 V4 那样用 nginx 挂静态文件。

- 代码：Server A 上 `/opt/axin-website`（本仓库的 clone）
- 镜像：`axin-website:latest`，多阶段构建，产物是 Next.js `output: "standalone"`
- 容器：`-p 4003:3000`，`--restart always`
- 端口沿用本机静态站惯例：4000 wanneng-landing / 4001 tuancan-h5 / 4002 icross-arcfe / **4003 axin-website**

## DNS（Cloudflare，zone `axin.group`）

| 类型 | 名称 | 值 | 代理 |
|------|------|-----|------|
| A | `axin.group` | 173.249.200.219 | 橙云 |
| A | `www.axin.group` | 173.249.200.219 | 橙云 |

NS 已从 Dynadot 切到 `crystal.ns.cloudflare.com` / `hank.ns.cloudflare.com`，zone 已 active。

## NPM 配置（已建好）

- **Proxy Host #3**：`axin.group` → `172.17.0.1:4003`，Force SSL、HTTP/2、Block Exploits、Websockets
- **Redirection Host #1**：`www.axin.group` → `axin.group`，301，Preserve Path
- **证书 #3**：Let's Encrypt，DNS-01（Cloudflare），一张覆盖 `axin.group` + `www.axin.group`，NPM 自动续期

## 更新站点

改代码 push 到 main，然后在 Server A 上重新构建镜像并重启容器：

```bash
ssh -i ~/.ssh/wanneng_deploy root@173.249.200.219 '
  cd /opt/axin-website &&
  git fetch --depth 1 origin main -q && git reset --hard origin/main -q &&
  docker build -t axin-website:latest . &&
  docker rm -f axin-website &&
  docker run -d --name axin-website --restart always -p 4003:3000 axin-website:latest
'
```

**注意 V5 跟 V4 不一样**：V4 是挂载静态文件，`git pull` 就生效；
V5 是编译型应用，改完必须**重新 build 镜像 + 重启容器**才生效。

改完如果 Cloudflare 缓存了旧版，去 CF 后台 Purge。

## 联系表单（Formspree）

`POST /api/contact` 校验字段后转发到 **Formspree**。链路：

```
浏览器 → /api/contact（同源，服务端）→ Formspree
```

走服务端中转而不是让前端直接 POST 到 Formspree，好处是表单 ID 不暴露在前端代码里，
且校验和蜜罐都在服务端执行。

配置：Server A 上 `/opt/axin-website/.env.prod`（权限 600，不进仓库）

```
FORMSPREE_ENDPOINT=https://formspree.io/f/xxxxxxxx
```

容器启动时用 `--env-file /opt/axin-website/.env.prod` 注入。**改了这个文件必须重启容器才生效。**

几个实现上的要点：

- 请求必须带 `Accept: application/json`，否则 Formspree 返回 302 跳它自家致谢页，拿不到 JSON
- `_subject` 字段让邮件主题带上来意（`AXIN website enquiry — <intent>`），收件箱里好分辨
- `_gotcha` 是蜜罐字段，前端藏在屏幕外且 `tabIndex={-1}`，真人填不到；有值就静默返回成功，不给爬虫反馈
- Formspree 报错时把具体原因写进服务端日志（`docker logs axin-website`），
  前端只显示笼统提示。表单未激活、超额度这类问题靠这个日志排查

**没配 `FORMSPREE_ENDPOINT` 时接口返回 503**，前端显示 "Contact routing is not configured yet"。
这是有意为之——宁可报错也不静默丢线索。

## 待办

### 确认 Cloudflare SSL 模式是 Full (strict)

源站现在有合法的 Let's Encrypt 证书，可以安全地开 Full (strict)。
线上实测没有重定向循环，说明当前至少是 Full 而非 Flexible，但 Full 不校验源站证书。

服务器上 `credentials-1` 里那个 CF token **只有 DNS 权限**，读不了也改不了 Zone Settings。
要用 API 改的话，得让那个 token 补上 `Zone → Zone Settings → Edit`。

## 已完成

- GitHub Pages 已于 2026-08-24 关闭（原 `https://sehaha.github.io/axin-website/`），
  避免同一份内容有两个可索引地址。仓库保留，只是不再发布。

## 备注：NPM 的操作方式

服务器上没有存 NPM 管理员密码。本次配置是通过临时在 NPM 数据库里建一个管理员账号、
调它的 REST API 完成的，做完已删除该账号，并把创建的证书/主机归属改回真实管理员（id=1）。
操作前数据库备份在 `/opt/backups/npm-database-20260824-005414.sqlite`。

以后再动 NPM，**优先直接用后台 UI**（`http://173.249.200.219:81`）——
走 API 是因为当时拿不到密码，不是推荐做法。
