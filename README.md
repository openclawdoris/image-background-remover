# 🎨 Image Tools - 图片工具

> AI 驱动的图片处理工具 - 一键移除背景和去水印

[![GitHub license](https://img.shields.io/github/license/openclawdoris/image-background-remover)](https://github.com/openclawdoris/image-background-remover/blob/main/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/openclawdoris/image-background-remover)](https://github.com/openclawdoris/image-background-remover/stargazers)

## ✨ 功能特性

- 🤖 **AI 背景移除** - 使用 rembg (U2Net) 模型，智能抠图
- 🎭 **去水印** (开发中) - 即将集成 LaMa 模型
- ⚡ **极速处理** - 优化的 AI 模型，秒出结果
- 🎨 **精美 UI** - Next.js + Tailwind CSS，现代化界面
- 📱 **响应式设计** - 完美适配各种设备
- 🔒 **隐私保护** - 图片在本地处理，不存储

## 🛠️ 技术栈

### 前端
- **框架**: Next.js 14 (App Router) + React 18
- **样式**: Tailwind CSS
- **图标**: lucide-react
- **工具**: clsx + tailwind-merge

### 后端
- **框架**: FastAPI
- **语言**: Python 3.9+
- **AI 模型**: 
  - 背景移除: rembg (U2Net)
  - 去水印: LaMa (待集成)

## 🚀 快速开始

### 前置要求

- Node.js 18+
- Python 3.9+
- pip

### 一键启动

```bash
# 克隆项目
git clone https://github.com/openclawdoris/image-background-remover.git
cd image-background-remover

# 使用启动脚本（需要先给执行权限）
chmod +x start.sh
./start.sh
```

### 分别启动

#### 后端

```bash
cd backend

# 创建虚拟环境
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 安装依赖
pip install -r requirements.txt

# 启动服务
python main.py
```

后端服务将运行在 http://localhost:8000

#### 前端

```bash
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

前端服务将运行在 http://localhost:3000

## 📁 项目结构

```
image-background-remover/
├── backend/
│   ├── main.py              # FastAPI 后端
│   ├── requirements.txt     # Python 依赖
│   ├── .env.example         # 环境变量示例
│   └── uploads/             # 上传文件目录（自动创建）
├── frontend/
│   ├── app/
│   │   ├── page.tsx         # 主页面
│   │   ├── layout.tsx       # 布局
│   │   └── globals.css      # 样式
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   ├── postcss.config.js
│   └── next.config.js
├── start.sh                 # 一键启动脚本
├── .gitignore
├── README.md
└── 项目文档.md              # 中文项目文档
```

## 🎯 使用说明

1. 打开 http://localhost:3000
2. 选择工具：移除背景 或 去水印
3. 上传图片（支持拖拽或点击选择）
4. 点击"开始处理"
5. 等待 AI 处理完成
6. 下载处理后的图片

## 🔧 配置

### 后端配置

在 `backend` 目录下创建 `.env` 文件：

```env
PORT=8000
HOST=0.0.0.0
UPLOAD_DIR=uploads
MAX_FILE_SIZE=10485760  # 10MB
```

### 前端配置

修改 `frontend/app/page.tsx` 中的 `API_BASE`：

```typescript
const API_BASE = 'http://localhost:8000';  // 修改为你的后端地址
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🔗 相关链接

- **GitHub**: https://github.com/openclawdoris/image-background-remover
- **rembg**: https://github.com/danielgatis/rembg
- **LaMa**: https://github.com/advimman/lama
- **Next.js**: https://nextjs.org/docs
- **FastAPI**: https://fastapi.tiangolo.com

---

**如果这个项目对你有帮助，请给个 Star ⭐️**
