# 部署指南 - Cloudflare Pages

## 🚀 方式一：Cloudflare Dashboard（推荐）

### 步骤 1：准备 GitHub 仓库

确保你的代码已经推送到 GitHub：

```bash
git add public/index.html _headers
git commit -m "Add Cloudflare Pages deployment files"
git push
```

### 步骤 2：登录 Cloudflare Dashboard

1. 访问 https://dash.cloudflare.com
2. 登录你的 Cloudflare 账户

### 步骤 3：创建 Pages 项目

1. 点击左侧菜单 **Workers & Pages**
2. 点击 **Create application**
3. 选择 **Pages** 标签页
4. 点击 **Connect to Git**

### 步骤 4：连接 GitHub 仓库

1. 选择 **GitHub**
2. 授权 Cloudflare 访问你的 GitHub 账户
3. 选择仓库：`openclawdoris/image-background-remover`
4. 点击 **Begin setup**

### 步骤 5：配置构建设置

在 **Build settings** 部分配置：

- **Project name**: `image-background-remover`（或你喜欢的名字）
- **Production branch**: `main`
- **Framework preset**: `None`（因为我们用的是静态 HTML）
- **Build command**: 留空（不需要构建）
- **Build output directory**: `public`

### 步骤 6：部署

1. 点击 **Save and Deploy**
2. 等待部署完成（通常 1-2 分钟）
3. 部署完成后，你会得到一个类似 `https://image-background-remover.pages.dev` 的地址

### 步骤 7：配置自定义域名（可选）

1. 在项目页面点击 **Custom domains**
2. 点击 **Set up a custom domain**
3. 输入你的域名
4. 按照提示配置 DNS

---

## 🔧 配置说明

### 文件结构

```
image-background-remover/
├── public/
│   └── index.html          # 主页面
├── _headers                # 安全头配置
└── ...
```

### 安全头配置 (`_headers`)

```
/*
  X-Frame-Options: DENY
  X-XSS-Protection: 1; mode=block
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
```

---

## ⚠️ 重要提示

### 后端 API 配置

由于 Cloudflare Pages 只托管静态前端，你需要：

1. **保持后端服务运行** 在你的服务器上（http://43.130.59.75:8000）
2. **或者** 部署后端到其他服务（如 Railway、Fly.io、Heroku 等）
3. **修改 `public/index.html` 中的 `API_BASE`** 为你的后端地址

### 修改 API 地址

编辑 `public/index.html`，找到这一行：

```javascript
const API_BASE = 'http://43.130.59.75:8000';
```

修改为你的后端地址，然后重新提交和部署。

---

## 📞  troubleshooting

### 部署失败

- 检查 `public` 目录是否存在
- 确认 `index.html` 在 `public` 目录中
- 查看 Cloudflare Pages 的构建日志

### 前端显示但无法处理图片

- 确认后端服务正在运行
- 检查浏览器控制台的网络请求
- 确认没有 CORS 错误

---

## 🎉 完成！

部署成功后，你就拥有了一个全球 CDN 加速的静态网站！

**你的网站地址：** `https://[your-project-name].pages.dev`
