# AXIN 官网部署规范

> 生产仓库：`sehaha/axin-website` 的 **main** 分支。
> 生产服务器：**Server A (173.249.200.219)**，与 wanneng.app 同机，NPM 反代在最前面。

## 域名策略

**主域名 `axin.group`，`www.axin.group` 301 跳到主域名。**

理由：`.group` 这个 TLD 本身就承载了"集团"的含义，`axin.group` 读起来是完整的一句品牌名，
前面再加 `www.` 纯属冗余。传统上把 www 当主域的两个理由在这里都不成立——
Cloudflare 支持根域 CNAME flattening，不存在根域无法接 CDN 的问题；
本站是纯静态页面、不写 cookie，也不存在 cookie 泄漏到子域的顾虑。

不要让两个域名同时返回 200（会产生重复内容），统一 301 收敛到根域。

## 生产架构

| 组件 | 容器名 | 端口 | 入口 |
|------|--------|------|------|
| AXIN 官网静态站 | `axin-website` | 4003 | `axin.group`（经 NPM 反代） |

- 站点文件：Server A 上 `/opt/axin-website`（就是本仓库的 clone）
- 容器：`nginx:alpine`，把 `/opt/axin-website` 只读挂到 `/usr/share/nginx/html`
- 端口分配沿用本机静态站惯例：4000 wanneng-landing / 4001 tuancan-h5 / 4002 icross-arcfe / **4003 axin-website**

容器创建命令（已执行，仅作记录）：

```bash
docker run -d --name axin-website --restart always \
  -p 4003:80 \
  -v /opt/axin-website:/usr/share/nginx/html:ro \
  nginx:alpine
```

## DNS（Cloudflare，zone `axin.group`）

| 类型 | 名称 | 值 | 代理 |
|------|------|-----|------|
| A | `axin.group` | 173.249.200.219 | 已开启（橙云） |
| A | `www.axin.group` | 173.249.200.219 | 已开启（橙云） |

两条记录都已配好。

**注册商是 Dynadot，域名的 NS 还没切到 Cloudflare**，所以以上记录暂时不生效。
需要在 Dynadot 后台把 axin.group 的 nameserver 改成：

```
crystal.ns.cloudflare.com
hank.ns.cloudflare.com
```

（与 wanneng.app 用的是同一组，改完通常几分钟到几小时生效。）

## NPM 配置

需要建两个对象，都在 NPM 后台（`http://173.249.200.219:81`）：

**1. Proxy Host —— 主域名**
- Domain Names: `axin.group`
- Scheme: `http`，Forward Hostname/IP: `172.17.0.1`，Forward Port: `4003`
- 勾 Block Common Exploits、Websockets Support
- SSL 标签页：`Request a new SSL Certificate`，**用 DNS Challenge，Provider 选 Cloudflare**
  （沿用本机惯例，API token 已在 `/opt/docker-apps/gateway/letsencrypt/credentials/`）
  域名同时填 `axin.group` 和 `www.axin.group`，一张证书覆盖两个
- 勾 Force SSL、HTTP/2 Support

**2. Redirection Host —— www 跳主域**
- Domain Names: `www.axin.group`
- Forward Domain: `axin.group`，Scheme `https`
- HTTP Code: **301**，勾 Preserve Path
- SSL 选上一步签好的那张证书，勾 Force SSL

> DNS Challenge 必须等 NS 切换生效之后再做。Let's Encrypt 会去查域名的权威 NS，
> 现在还是 Dynadot 的 parking NS，TXT 验证记录写在 Cloudflare 上它看不见，签发一定失败。

## 上线顺序（有先后依赖，别跳）

1. Dynadot 改 NS → 等 `dig NS axin.group` 返回 cloudflare 的两条
2. Cloudflare zone 状态从 `pending` 变 `active`
3. **先把 Cloudflare 的 SSL/TLS 模式设成 `Full (strict)`**
4. NPM 建 Proxy Host + 签证书（DNS Challenge）
5. NPM 建 Redirection Host
6. 验证：`axin.group` 200、`www.axin.group` 301

> ⚠️ 第 3 步不能省。如果 Cloudflare 停在 `Flexible` 模式（CF 用 HTTP 回源），
> 而 NPM 那边勾了 Force SSL，会形成无限重定向循环，页面直接打不开。
> 顺序是"先把回源改成 HTTPS，再开 Force SSL"。

## 更新站点

改 `index.html`，push 到 main，然后：

```bash
ssh -i ~/.ssh/wanneng_deploy root@173.249.200.219 'cd /opt/axin-website && git pull --ff-only'
```

目录是只读挂载进容器的，`git pull` 完立刻生效，**不需要重启容器**。
如果 Cloudflare 缓存了旧版，去 CF 后台 Purge 一下。

## 备注

仓库同时开着 GitHub Pages（`https://sehaha.github.io/axin-website/`），当初用来快速预览。
正式域名上线后建议关掉，避免同一份内容有两个可索引的地址。
