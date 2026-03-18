export interface Env {
  REMOVE_BG_API_KEY?: string;
}

export async function onRequestPost(context: {
  request: Request;
  env: Env;
}): Promise<Response> {
  try {
    const { request, env } = context;
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return new Response(JSON.stringify({ success: false, detail: 'No file provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 如果没有配置 API Key，返回提示
    if (!env.REMOVE_BG_API_KEY) {
      return new Response(
        JSON.stringify({
          success: false,
          detail: '请在 Cloudflare Pages 中配置 REMOVE_BG_API_KEY 环境变量。\n获取地址：https://www.remove.bg/api',
        }),
        {
          status: 501,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // 调用 remove.bg API
    const removeBgFormData = new FormData();
    removeBgFormData.append('image_file', file);
    removeBgFormData.append('size', 'auto');

    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': env.REMOVE_BG_API_KEY,
      },
      body: removeBgFormData,
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Remove.bg error:', error);
      return new Response(
        JSON.stringify({ success: false, detail: 'API 调用失败，请检查 API Key' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // 获取处理后的图片
    const imageBuffer = await response.arrayBuffer();
    const outputId = crypto.randomUUID();

    // 返回 base64 编码的图片，这样前端可以直接显示
    const base64 = btoa(
      new Uint8Array(imageBuffer).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        ''
      )
    );

    return new Response(
      JSON.stringify({
        success: true,
        output_id: outputId,
        message: 'Background removed successfully',
        image_data: `data:image/png;base64,${base64}`,
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ success: false, detail: 'Internal server error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
