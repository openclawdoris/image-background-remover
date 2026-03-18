# 🚀 Cloudflare 完整部署指南

## 方案概述

我们使用 **Cloudflare Pages + Pages Functions + remove.bg API**，完全免费且无需维护服务器！

### 架构
- **前端**: Cloudflare Pages（静态托管，全球 CDN）
- **后端**: Cloudflare Pages Functions（Serverless）
- **AI 处理**: remove.bg API（每天 50 次免费调用）

---

## 📋 部署步骤

### 第一步：获取 remove.bg API Key

1. 访问 https://www.remove.bg/api
2. 点击 "Get API Key"
3. 注册账号（免费）
4. 获取你的 API Key（格式类似：`abc123xyz456`）

### 第二步：部署到 Cloudflare Pages

1. 访问 https://dash.cloudflare.com
2. 登录你的账号
3. 点击左侧菜单 **Workers & Pages**
4. 点击 **Create application**
5. 选择 **Pages** 标签页
6. 点击 **Connect to Git**
7. 选择 **GitHub**
8. 授权 Cloudflare 访问你的仓库
9. 选择仓库：`openclawdoris/image-background-remover`
10. 点击 **Begin setup**

### 第三步：配置项目

**构建设置：**
- **Project name**: `image-background-remover`
- **Production branch**: `main`
- **Framework preset**: `None`
- **Build command**: 留空
- **Build output directory**: `public`

### 第四步：配置环境变量

1. 点击 **Environment variables (advanced)**
2. 点击 **Add variable**
3. **Variable name**: `REMOVE_BG_API_KEY`
4. **Value**: 粘贴你的 remove.bg API Key
5. ✅ 勾选 "Encrypt"（加密）
6. 点击 **Add**

### 第五步：部署

1. 点击 **Save and Deploy**
2. 等待 1-2 分钟
3. 部署成功！你会得到一个类似 `https://image-background-remover.pages.dev` 的地址

### 第六步：配置自定义域名（可选）

1. 在项目页面点击 **Custom domains**
2. 点击 **Set up a custom domain**
3. 输入你的域名：`imagebackgroundandwatermarkremover.shop`
4. 按照提示配置 DNS

---

## 🎯 完成！

现在你有了：
- ✅ 全球 CDN 加速的前端
- ✅ Serverless 后端，无需维护服务器
- ✅ AI 背景移除功能
- ✅ 自定义域名支持

---

## 💰 成本说明

| 服务 | 免费额度 | 超出价格 |
|------|---------|---------|
| Cloudflare Pages | 无限 | - |
| Cloudflare Functions | 10万次/月 | $0.30/百万次 |
| remove.bg API | 50次/天 | $0.20/张 |

---

## 🔧 备选方案：如果不用 remove.bg

### 方案 A：自建后端到 Railway

1. 访问 https://railway.app
2. 用 GitHub 登录
3. 新建项目 → 选择仓库
4. Root Directory: `backend`
5. 自动检测 Dockerfile 部署
6. 得到后端域名，更新前端的 `API_BASE`

### 方案 B：等 Cloudflare Workers AI 支持

Cloudflare 正在不断增加新模型，未来可能会有背景移除模型！

---

## 📞 遇到问题？

1. 检查 Cloudflare Pages 构建日志
2. 确认环境变量已正确设置
3. 确认 remove.bg API Key 有效
