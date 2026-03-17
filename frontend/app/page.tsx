'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { 
  Upload, 
  Image as ImageIcon, 
  Eraser, 
  Download, 
  Trash2, 
  Loader2,
  Zap,
  Shield,
  Sparkles
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

// 使用相对路径，让 Next.js API routes 代理请求，避免 CORS 问题
const API_BASE = '/api/proxy';

type ToolType = 'background' | 'watermark';

export default function Home() {
  const [selectedTool, setSelectedTool] = useState<ToolType>('background');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [outputId, setOutputId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = useCallback((file: File) => {
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setOutputUrl(null);
    setOutputId(null);
    setMessage(null);
  }, []);

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const processImage = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const endpoint = selectedTool === 'background' 
        ? 'http://localhost:8000/api/remove-background' 
        : 'http://localhost:8000/api/remove-watermark';

      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setOutputId(data.output_id);
        setOutputUrl(`http://localhost:8000/api/output/${data.output_id}`);
        setMessage({ 
          text: data.message || '处理成功！', 
          type: 'success' 
        });
      } else {
        setMessage({ 
          text: data.detail || '处理失败，请重试', 
          type: 'error' 
        });
      }
    } catch (error) {
      setMessage({ 
        text: '网络错误，请确保后端服务已启动', 
        type: 'error' 
      });
      console.error('Processing error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadImage = () => {
    if (outputUrl) {
      const a = document.createElement('a');
      a.href = outputUrl;
      a.download = selectedTool === 'background' ? 'image-no-bg.png' : 'image-no-watermark.png';
      a.click();
    }
  };

  const reset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setOutputUrl(null);
    setOutputId(null);
    setMessage(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Sparkles className="text-white w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">图片工具</h1>
                <p className="text-xs text-gray-500">AI 驱动的图片处理</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span>极速处理</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Tool Selection */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setSelectedTool('background')}
            className={cn(
              'flex-1 py-4 px-6 rounded-2xl font-medium transition-all duration-200',
              selectedTool === 'background'
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-xl shadow-blue-500/25 scale-[1.02]'
                : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm border border-gray-200'
            )}
          >
            <div className="flex items-center justify-center gap-3">
              <Eraser size={24} />
              <div className="text-left">
                <div className="font-semibold">移除背景</div>
                <div className="text-xs opacity-75">AI 智能抠图</div>
              </div>
            </div>
          </button>
          <button
            onClick={() => setSelectedTool('watermark')}
            className={cn(
              'flex-1 py-4 px-6 rounded-2xl font-medium transition-all duration-200',
              selectedTool === 'watermark'
                ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-xl shadow-purple-500/25 scale-[1.02]'
                : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm border border-gray-200'
            )}
          >
            <div className="flex items-center justify-center gap-3">
              <ImageIcon size={24} />
              <div className="text-left">
                <div className="font-semibold">去水印</div>
                <div className="text-xs opacity-75">即将上线</div>
              </div>
            </div>
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-6">
            {!selectedFile ? (
              <label className="block">
                <div 
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  onDrop={onDrop}
                  className={cn(
                    'border-2 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all duration-200',
                    dragOver
                      ? 'border-blue-500 bg-blue-50/50 scale-[1.02]'
                      : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50/30'
                  )}
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Upload size={32} className="text-blue-600" />
                  </div>
                  <p className="text-lg font-semibold text-gray-700 mb-2">
                    拖拽图片到这里
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    或者点击选择文件
                  </p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-600">
                    <span>支持</span>
                    <span className="font-medium">JPG, PNG, WEBP</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={onFileInputChange}
                    className="hidden"
                  />
                </div>
              </label>
            ) : (
              <div className="space-y-4">
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <ImageIcon size={20} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                          {selectedFile.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                  </div>
                  {previewUrl && (
                    <div className="relative aspect-video bg-gray-100 rounded-xl overflow-hidden">
                      <Image
                        src={previewUrl}
                        alt="Preview"
                        fill
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={processImage}
                    disabled={isProcessing}
                    className={cn(
                      'flex-1 py-4 px-6 rounded-xl font-semibold transition-all duration-200',
                      isProcessing
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98]'
                    )}
                  >
                    <div className="flex items-center justify-center gap-2">
                      {isProcessing ? (
                        <>
                          <Loader2 size={20} className="animate-spin" />
                          <span>AI 处理中...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles size={20} />
                          <span>开始处理</span>
                        </>
                      )}
                    </div>
                  </button>
                  <button
                    onClick={reset}
                    className="py-4 px-5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            )}

            {/* Message */}
            {message && (
              <div className={cn(
                'p-4 rounded-2xl border',
                message.type === 'success' 
                  ? 'bg-green-50 border-green-200 text-green-800'
                  : message.type === 'error'
                  ? 'bg-red-50 border-red-200 text-red-800'
                  : 'bg-blue-50 border-blue-200 text-blue-800'
              )}>
                <div className="flex items-center gap-2">
                  {message.type === 'success' && <Sparkles size={18} />}
                  {message.type === 'error' && <Eraser size={18} />}
                  <p className="text-sm font-medium">{message.text}</p>
                </div>
              </div>
            )}
          </div>

          {/* Result Section */}
          <div>
            {outputUrl ? (
              <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
                    <Sparkles size={20} className="text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">处理完成！</h3>
                    <p className="text-sm text-gray-500">点击下方下载图片</p>
                  </div>
                </div>
                <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden mb-5">
                  <Image
                    src={outputUrl}
                    alt="Result"
                    fill
                    className="object-contain"
                    unoptimized
                  />
                  {/* Checkerboard background for transparent images */}
                  <div 
                    className="absolute inset-0 -z-10"
                    style={{
                      backgroundImage: 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)',
                      backgroundSize: '20px 20px',
                      backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                    }}
                  />
                </div>
                <button
                  onClick={downloadImage}
                  className="w-full py-4 px-6 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-green-700 shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/30 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Download size={20} />
                    <span>下载图片</span>
                  </div>
                </button>
              </div>
            ) : (
              <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-12 text-center border-2 border-dashed border-gray-200">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <ImageIcon size={40} className="text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium">处理结果将在这里显示</p>
                <p className="text-sm text-gray-400 mt-2">上传图片后点击"开始处理"</p>
              </div>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Eraser size={24} className="text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">AI 驱动</h3>
              <p className="text-gray-600 text-sm">使用先进的 AI 模型，处理效果出色</p>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap size={24} className="text-green-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">简单易用</h3>
              <p className="text-gray-600 text-sm">一键上传，一键处理，无需复杂操作</p>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield size={24} className="text-purple-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">隐私保护</h3>
              <p className="text-gray-600 text-sm">图片在本地处理，保护您的隐私</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
