'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, Loader2, Download, Image as ImageIcon, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';

type BackgroundType = 'transparent' | 'white' | 'gray' | 'gradient';

export default function ToolPage() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [backgroundType, setBackgroundType] = useState<BackgroundType>('transparent');
  const [viewMode, setViewMode] = useState<'comparison' | 'result'>('comparison');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('请选择图片文件');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('文件大小不能超过 10MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setOriginalImage(e.target?.result as string);
      setProcessedImage(null);
      setError(null);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }, [handleFileSelect]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) handleFileSelect(file);
        break;
      }
    }
  }, [handleFileSelect]);

  const processImage = async () => {
    if (!originalImage) return;

    setIsProcessing(true);
    setError(null);
    setProgress(0);

    try {
      const response = await fetch(originalImage);
      const blob = await response.blob();
      const file = new File([blob], 'image.png', { type: 'image/png' });

      const formData = new FormData();
      formData.append('image', file);

      setProgress(20);

      const apiResponse = await fetch('/api/remove-bg', {
        method: 'POST',
        body: formData,
      });

      setProgress(70);

      if (!apiResponse.ok) {
        throw new Error('处理失败');
      }

      const resultBlob = await apiResponse.blob();
      const resultUrl = URL.createObjectURL(resultBlob);
      setProcessedImage(resultUrl);
      setProgress(100);
    } catch (err) {
      setError(err instanceof Error ? err.message : '处理失败，请重试');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSliderMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!sliderRef.current) return;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    let position = ((clientX - rect.left) / rect.width) * 100;
    position = Math.max(0, Math.min(100, position));
    setSliderPosition(position);
  }, []);

  const downloadImage = (format: 'png' | 'jpg') => {
    if (!processedImage) return;

    const link = document.createElement('a');
    link.href = processedImage;
    link.download = `background-removed.${format}`;
    link.click();
  };

  const transparentGridUrl = "data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23999' fill-opacity='0.1'%3E%3Cpath d='M0 0h10v10H0zM10 10h10v10H10z'/%3E%3C/g%3E%3C/svg%3E";

  const getBackgroundStyle = () => {
    switch (backgroundType) {
      case 'white':
        return 'bg-white';
      case 'gray':
        return 'bg-gray-200';
      case 'gradient':
        return 'bg-gradient-to-br from-blue-500 to-purple-600';
      default:
        return 'bg-[url(' + transparentGridUrl + ')]';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white" onPaste={handlePaste}>
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <ImageIcon className="w-8 h-8 text-blue-500" />
            <h1 className="text-2xl font-bold text-gray-900">Image Background Remover</h1>
          </div>
          <button
            onClick={() => window.location.href = '/'}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            返回首页
          </button>
        </div>

        {!originalImage ? (
          <div
            className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center hover:border-blue-400 transition-colors cursor-pointer bg-white"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
            />
            <div className="w-20 h-20 mx-auto mb-6 bg-blue-50 rounded-full flex items-center justify-center">
              <Upload className="w-10 h-10 text-blue-500" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">上传图片</h2>
            <p className="text-gray-600 mb-4">拖拽图片到这里，或点击选择文件</p>
            <p className="text-sm text-gray-400">支持 JPG、PNG、WebP，最大 10MB</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border">
              {!processedImage ? (
                <div className="text-center">
                  <div className="max-w-md mx-auto mb-6">
                    <img
                      src={originalImage}
                      alt="原图"
                      className="max-h-96 mx-auto rounded-lg shadow-lg"
                    />
                  </div>
                  {error && (
                    <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg">
                      {error}
                    </div>
                  )}
                  {isProcessing ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-center gap-3 text-blue-600">
                        <Loader2 className="w-6 h-6 animate-spin" />
                        <span className="font-medium">正在处理...</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 max-w-xs mx-auto">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={processImage}
                      className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-colors shadow-lg hover:shadow-xl"
                    >
                      去除背景
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-center gap-4">
                    <button
                      onClick={() => setViewMode('comparison')}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        viewMode === 'comparison'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      对比视图
                    </button>
                    <button
                      onClick={() => setViewMode('result')}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        viewMode === 'result'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      仅看结果
                    </button>
                  </div>

                  {viewMode === 'comparison' ? (
                    <div
                      ref={sliderRef}
                      className="comparison-slider relative aspect-video max-h-[500px] mx-auto bg-gray-100"
                      onMouseMove={handleSliderMove}
                      onMouseDown={handleSliderMove}
                      onTouchMove={handleSliderMove}
                    >
                      <img src={originalImage} alt="原图" className="before-image" />
                      <div style={{ position: 'absolute', inset: 0 }} className={getBackgroundStyle()}>
                        <img
                          src={processedImage}
                          alt="处理后"
                          className="after-image"
                          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                        />
                      </div>
                      <div
                        className="slider-handle"
                        style={{ left: `${sliderPosition}%` }}
                      >
                        <div className="slider-button">
                          <ChevronLeft className="w-5 h-5 text-gray-600 -ml-1" />
                          <ChevronRight className="w-5 h-5 text-gray-600 -mr-1" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className={`aspect-video max-h-[500px] mx-auto rounded-xl overflow-hidden ${getBackgroundStyle()}`}>
                      <img
                        src={processedImage}
                        alt="处理后"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button
                      onClick={() => setBackgroundType('transparent')}
                      className={`p-4 rounded-xl border-2 transition-colors ${
                        backgroundType === 'transparent'
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="w-full aspect-square rounded-lg bg-[url(' + transparentGridUrl + ')] mb-2" />
                      <span className="text-sm font-medium text-gray-700">透明</span>
                    </button>
                    <button
                      onClick={() => setBackgroundType('white')}
                      className={`p-4 rounded-xl border-2 transition-colors ${
                        backgroundType === 'white'
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="w-full aspect-square rounded-lg bg-white border mb-2" />
                      <span className="text-sm font-medium text-gray-700">纯白</span>
                    </button>
                    <button
                      onClick={() => setBackgroundType('gray')}
                      className={`p-4 rounded-xl border-2 transition-colors ${
                        backgroundType === 'gray'
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="w-full aspect-square rounded-lg bg-gray-200 mb-2" />
                      <span className="text-sm font-medium text-gray-700">纯灰</span>
                    </button>
                    <button
                      onClick={() => setBackgroundType('gradient')}
                      className={`p-4 rounded-xl border-2 transition-colors ${
                        backgroundType === 'gradient'
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="w-full aspect-square rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 mb-2" />
                      <span className="text-sm font-medium text-gray-700">渐变</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-center gap-4">
                    <button
                      onClick={() => {
                        setOriginalImage(null);
                        setProcessedImage(null);
                        setError(null);
                      }}
                      className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors flex items-center gap-2"
                    >
                      <RefreshCw className="w-5 h-5" />
                      重新上传
                    </button>
                    <button
                      onClick={() => downloadImage('png')}
                      className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-colors flex items-center gap-2 shadow-lg"
                    >
                      <Download className="w-5 h-5" />
                      下载 PNG
                    </button>
                    <button
                      onClick={() => downloadImage('jpg')}
                      className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-xl transition-colors flex items-center gap-2 shadow-lg"
                    >
                      <Download className="w-5 h-5" />
                      下载 JPG
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
