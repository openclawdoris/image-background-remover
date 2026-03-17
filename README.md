# Image Tools MVP

图片工具 MVP - 背景移除 + 去水印

## 功能

- ✅ AI 背景移除
- ✅ 智能去水印
- ✅ 单张图片处理
- ✅ 批量处理
- ✅ 实时预览

## 技术栈

- **前端**: Next.js 14 + React + Tailwind CSS
- **后端**: Python FastAPI
- **AI 模型**: 
  - 背景移除: rembg (U2Net)
  - 去水印: LaMa
- **存储**: 本地文件 (开发) / OSS (生产)

## 快速开始

### 后端启动

```bash
cd backend
pip install -r requirements.txt
python main.py
```

### 前端启动

```bash
cd frontend
npm install
npm run dev
```

访问 http://localhost:3000
