'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Upload, Image as ImageIcon, Eraser, Download, Trash2, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

const API_BASE = 'http://localhost:8000';

type ToolType = 'background' | 'watermark';

export default function Home() {
  const [selectedTool, setSelectedTool] = useState<ToolType>('background');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [outputId, setOutputId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setOutputUrl(null);
      setOutputId(null);
      setMessage(null);
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
        ? '/api/remove-background' 
        : '/api/remove-watermark';

      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setOutputId(data.output_id);
        setOutputUrl(`${API_BASE}/api/output/${data.output_id}`);
        if (data.message) {
          setMessage(data.message);
        }
      } else {
        setMessage('处理失败，请重试');
      }
    } catch (error) {
      setMessage('网络错误，请确保后端服务已启动');
      console.error('Processing error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadImage = () => {
    if (outputUrl) {
      const a = document.createElement('a');
      a.href = outputUrl;
      a.download = selectedTool === 'background' ? 'no-bg.png' : 'no-watermark.png';
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🎨 图片工具
          </h1>
          <p className="text-xl text-gray-600">
            AI 驱动的图片处理工具 - 一键移除背景和去水印
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="flex gap-4">
              <button
                onClick={() => setSelectedTool('background')}
                className={cn(
                  'flex-1 py-4 px-6 rounded-xl font-medium transition-all',
                  selectedTool === 'background'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                )}
              >
                <div className="flex items-center justify-center gap-2">
                  <Eraser size={20} />
                  <span>移除背景</span>
                </div>
              </button>
              <button
                onClick={() => setSelectedTool('watermark')}
                className={cn(
                  'flex-1 py-4 px-6 rounded-xl font-medium transition-all',
                  selectedTool === 'watermark'
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                )}
              >
                <div className="flex items-center justify-center gap-2">
                  <ImageIcon size={20} />
                  <span>去水印</span>
                </div>
              </button>
            </div>

            {!selectedFile ? (
              <label className="block">
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 transition-all">
                  <Upload size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-lg font-medium text-gray-700 mb-2">
                    点击上传图片
                  </p>
                  <p className="text-sm text-gray-500">
                    支持 JPG, PNG, WEBP
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              </label>
            ) : (
              <div className="space-y-4">
                <div className="bg-white rounded-2xl p-4 shadow-sm">
                  <p className="text-sm font-medium text-gray-600 mb-2">
                    {selectedFile.name}
                  </p>
                  {previewUrl && (
                    <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src={previewUrl}
                        alt="Preview"
                        fill
                        className="object-contain"
                      />
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={processImage}
                    disabled={isProcessing}
                    className="flex-1 py-3 px-6 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <div className="flex items-center justify-center gap-2">
                      {isProcessing ? (
                        <>
                          <Loader2 size={20} className="animate-spin" />
                          <span>处理中...</span>
                        </>
                      ) : (
                        <>
                          <Eraser size={20} />
                          <span>开始处理</span>
                        </>
                      )}
                    </div>
                  </button>
                  <button
                    onClick={reset}
                    className="py-3 px-6 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            )}

            {message && (
              <div className={cn(
                'p-4 rounded-xl',
                message.includes('coming') || message.includes('失败') || message.includes('错误')
                  ? 'bg-yellow-50 text-yellow-800'
                  : 'bg-green-50 text-green-800'
              )}>
                <p className="text-sm">{message}</p>
              </div>
            )}
          </div>

          <div>
            {outputUrl ? (
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  ✨ 处理结果
                </h3>
                <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden mb-4">
                  <Image
                    src={outputUrl}
                    alt="Result"
                    fill
                    className="object-contain"
                  />
                </div>
                <button
                  onClick={downloadImage}
                  className="w-full py-3 px-6 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Download size={20} />
                    <span>下载图片</span>
                  </div>
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center shadow-lg border-2 border-dashed border-gray-200">
                <ImageIcon size={64} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">
                  处理结果将在这里显示
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eraser size={24} className="text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">AI 驱动</h3>
              <p className="text-gray-600 text-sm">使用先进的 AI 模型，处理效果出色</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload size={24} className="text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">简单易用</h3>
              <p className="text-gray-600 text-sm">一键上传，一键处理，无需复杂操作</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ImageIcon size={24} className="text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">双功能合一</h3>
              <p className="text-gray-600 text-sm">背景移除 + 去水印，一个网站搞定</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
