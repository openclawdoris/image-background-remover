# Image Background Remover

一个 AI 驱动的图片背景去除工具，使用 Next.js + Tailwind CSS 构建。

## 功能特性

- 🖼️ 简单上传（拖拽/点击/粘贴）
- ✨ AI 驱动的背景去除
- 🎨 背景预设选择（透明/纯白/纯灰/渐变）
- 🔄 对比滑块查看效果
- 📥 高清下载（PNG/JPG）
- 🔒 隐私保护（不存储图片）

## 技术栈

- **框架**: Next.js 14 (App Router)
- **UI**: Tailwind CSS
- **图标**: Lucide React
- **AI API**: remove.bg
- **部署**: Cloudflare Pages

## 开始使用

### 安装依赖

```bash
npm install
```

### 配置环境变量

创建 `.env.local` 文件：

```env
REMOVE_BG_API_KEY=your_api_key_here
```

### 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 获取 API Key

1. 访问 [remove.bg](https://www.remove.bg/api)
2. 注册账号并获取免费 API Key
3. 将 API Key 配置到 `.env.local` 中

## 部署

### Cloudflare Pages

```bash
npm run build
```

然后使用 Wrangler 部署到 Cloudflare Pages。

## 项目结构

```
app/
├── page.tsx              # Landing Page
├── layout.tsx            # 根布局
├── globals.css           # 全局样式
├── tool/
│   └── page.tsx          # 工具页面
└── api/
    └── remove-bg/
        └── route.ts      # remove.bg API 代理
```

## 许可证

MIT
