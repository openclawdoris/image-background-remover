import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'http://localhost:8000';

export async function GET(request: NextRequest) {
  const path = request.nextUrl.pathname.replace('/api/proxy', '');
  const url = `${BACKEND_URL}${path}${request.nextUrl.search}`;
  
  const response = await fetch(url, {
    method: 'GET',
  });
  
  // 检查响应类型，如果是图片就直接返回二进制数据
  const contentType = response.headers.get('content-type') || '';
  
  if (contentType.startsWith('image/')) {
    // 返回图片数据
    const blob = await response.blob();
    return new NextResponse(blob, {
      status: response.status,
      headers: {
        'Content-Type': contentType,
      },
    });
  } else {
    // 返回 JSON 数据
    const data = await response.json();
    return NextResponse.json(data);
  }
}

export async function POST(request: NextRequest) {
  const path = request.nextUrl.pathname.replace('/api/proxy', '');
  const url = `${BACKEND_URL}${path}`;
  
  const formData = await request.formData();
  
  const response = await fetch(url, {
    method: 'POST',
    body: formData,
  });
  
  const data = await response.json();
  return NextResponse.json(data);
}
