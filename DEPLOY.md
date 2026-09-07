# 会务报价选配确认单系统 — 公网部署文档

本系统为纯前端静态应用（Vue3 + Vite），无后端、无数据库。所有勾选计算、PDF/Word 导出均在用户浏览器本地执行，可直接托管于任意免费静态网页平台。

> ⚠️ **国内访问提示**：Vercel（vercel.app）在中国大陆访问普遍超时（`ERR_CONNECTION_TIMED_OUT`）。本方案推荐使用 **Cloudflare Pages**，免费、无需备案、国内访问性远优于 Vercel。

## 一、本地打包

```bash
npm install
npm run build
```

打包完成后生成 `dist/` 目录（含 `index.html`、`assets/`、`_redirects`），可直接部署。

本地预览：

```bash
npm run preview   # http://localhost:4173
```

## 二、上传到 GitHub

1. 在 GitHub 新建仓库（例如 `priceform`，公开或私有均可）。
2. 在项目根目录执行：

```bash
git init
git add .
git commit -m "会务报价选配确认单系统"
git branch -M main
git remote add origin https://github.com/<你的用户名>/priceform.git
git push -u origin main
```

> `.gitignore` 已忽略 `node_modules` 与 `dist`，平台会自动构建，无需提交 dist。

## 三、部署到 Cloudflare Pages（推荐，国内可访问）

### 方式 A：网页导入（最简单）

1. 打开 https://dash.cloudflare.com ，注册/登录（可用 GitHub 账号）。
2. 左侧菜单 **Workers & Pages → Create → Pages → Connect to Git**。
3. 选择刚上传的 `priceform` 仓库，授权。
4. 构建配置填写：
   - Framework preset：**Vite**
   - Build command：`npm run build`
   - Build output directory：`dist`
5. 点击 **Save and Deploy**，等待约 1-2 分钟构建完成。
6. 部署成功后获得公网地址，例如：`https://priceform.pages.dev`

### 方式 B：Wrangler CLI 直接上传 dist

```bash
npm i -g wrangler
wrangler login
wrangler pages deploy dist --project-name=priceform
```

按提示完成，首次会创建项目并返回 `https://priceform.pages.dev` 公网地址。

## 四、SPA 路由说明

项目已含 `public/_redirects`（Cloudflare Pages 规则）与 `vercel.json`（Vercel 规则）：

```
/*    /index.html   200
```

所有未匹配静态文件的路径（如 `/schemes`、`/dict`）都回退到 `index.html`，**刷新页面不会 404**。

## 五、移动端访问

- 页面已做响应式适配，手机浏览器打开公网链接即可正常勾选、计算、导出文件。
- 导出 PDF 时手机浏览器会触发下载或预览，建议在电脑端打印另存为 PDF 效果最佳。
- 推荐手机浏览器：Chrome、Edge、Safari。

## 六、自定义域名（可选）

在 Cloudflare Pages 项目 → Custom domains，添加自有域名，按提示完成 DNS 解析即可绑定（免费）。

## 七、备选方案

- **Vercel**：`vercel.json` 已配置好，导入仓库即可部署，但 `vercel.app` 国内访问常超时，需代理访问。
- **GitHub Pages**：`npm run build` 后将 `dist/` 推送到 `gh-pages` 分支，启用 Pages 即可（`base: './'` 已适配子路径，但 github.io 国内访问不稳定）。
- **Netlify**：导入仓库，Build Command 填 `npm run build`，Publish 目录填 `dist`，自动生成公网地址（国内访问性一般）。

## 八、更新发布

代码推送到 `main` 分支后，Cloudflare Pages 自动触发重新构建部署，约 1-2 分钟后公网地址更新为最新版本。
