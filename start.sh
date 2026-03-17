#!/bin/bash

echo "🎨 Image Tools MVP - 启动脚本"
echo ""

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 未找到，请先安装 Python3"
    exit 1
fi

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未找到，请先安装 Node.js"
    exit 1
fi

echo "📦 安装后端依赖..."
cd backend
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi
source venv/bin/activate
pip install -r requirements.txt

echo ""
echo "🚀 启动后端服务 (端口 8000)..."
python main.py &
BACKEND_PID=$!

echo ""
echo "📦 安装前端依赖..."
cd ../frontend
npm install

echo ""
echo "🚀 启动前端服务 (端口 3000)..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ 服务启动成功！"
echo "   前端: http://localhost:3000"
echo "   后端: http://localhost:8000"
echo ""
echo "按 Ctrl+C 停止所有服务"

# Wait for user to stop
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
