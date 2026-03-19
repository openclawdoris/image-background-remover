import Link from 'next/link';
import { Upload, Sparkles, Download, Zap, CheckCircle, ChevronRight } from 'lucide-react';

export default function LandingPage() {
  const features = [
    {
      icon: <Upload className="w-8 h-8 text-blue-500" />,
      title: '简单上传',
      description: '拖拽、点击或粘贴图片，支持 JPG、PNG、WebP 格式',
    },
    {
      icon: <Sparkles className="w-8 h-8 text-blue-500" />,
      title: 'AI 驱动',
      description: '先进的 AI 技术，精确识别并去除背景',
    },
    {
      icon: <Zap className="w-8 h-8 text-blue-500" />,
      title: '快速处理',
      description: '几秒内完成处理，无需漫长等待',
    },
    {
      icon: <Download className="w-8 h-8 text-blue-500" />,
      title: '免费下载',
      description: '高清 PNG 透明背景，无水印',
    },
  ];

  const faqs = [
    {
      question: '是否免费使用？',
      answer: '是的，基础功能完全免费使用。',
    },
    {
      question: '图片会被保存吗？',
      answer: '不会。所有图片都只在内存中处理，处理完成后立即删除，保护您的隐私安全。',
    },
    {
      question: '支持哪些图片格式？',
      answer: '支持 JPG、PNG、WebP 格式，最大文件大小为 10MB。',
    },
    {
      question: '处理质量如何？',
      answer: '使用先进的 AI 算法，能够精确识别物体边缘，处理效果出色。',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-gray-50">
      <nav className="max-w-6xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">BG Remover</span>
          </div>
          <Link
            href="/tool"
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-colors"
          >
            开始使用
          </Link>
        </div>
      </nav>

      <section className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
            <CheckCircle className="w-4 h-4" />
            100% 免费使用
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            一键去除图片背景
            <br />
            <span className="text-blue-500">AI 驱动</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            上传图片，AI 自动识别并去除背景。无需注册，完全免费。
          </p>
          <Link
            href="/tool"
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white text-lg font-semibold rounded-2xl transition-all shadow-xl hover:shadow-2xl"
          >
            免费开始
            <ChevronRight className="w-6 h-6" />
          </Link>
          <p className="text-sm text-gray-400 mt-4">
            无需注册 · 不存储图片 · 隐私保护
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="relative">
                <div className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center">
                  <div className="text-8xl">🖼️</div>
                </div>
                <div className="absolute -bottom-4 -right-4 bg-white rounded-xl p-4 shadow-lg">
                  <div className="text-green-500 text-4xl">✅</div>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">
                Before & After
              </h2>
              <p className="text-gray-600 text-lg">
                看看 AI 如何神奇地去除图片背景，让你的图片更加专业。
              </p>
              <ul className="space-y-3">
                {[
                  '精确识别物体边缘',
                  '支持复杂背景',
                  '处理后的图片支持透明背景',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-700">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            为什么选择我们？
          </h2>
          <p className="text-gray-600 text-lg">
            简单、快速、安全，让图片处理变得轻而易举
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 shadow-sm border hover:shadow-lg transition-shadow"
            >
              <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            常见问题
          </h2>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {faq.question}
              </h3>
              <p className="text-gray-600">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            准备好开始了吗？
          </h2>
          <p className="text-lg opacity-90 mb-8">
            上传你的第一张图片，体验 AI 的魔力
          </p>
          <Link
            href="/tool"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 text-lg font-semibold rounded-2xl transition-all hover:shadow-xl"
          >
            立即开始
            <ChevronRight className="w-6 h-6" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-500" />
              <span className="font-semibold text-gray-900">BG Remover</span>
            </div>
            <p className="text-gray-500 text-sm">
              © 2026 BG Remover. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
