import type { Env } from './types';
import { deleteSession } from './db';

export async function onRequestPost(context: {
  request: Request;
  env: Env;
}): Promise<Response> {
  try {
    const { request, env } = context;

    // 从 cookie 中获取 session_id
    const cookieHeader = request.headers.get('Cookie');
    const sessionId = cookieHeader
      ?.split(';')
      .find((c) => c.trim().startsWith('session_id='))
      ?.split('=')[1];

    if (sessionId) {
      // 删除会话
      await deleteSession(env.DB, sessionId);
    }

    // 清除 cookie 并返回
    return new Response(
      JSON.stringify({ success: true, message: 'Logged out successfully' }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': 'session_id=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0',
        },
      }
    );
  } catch (error) {
    console.error('Logout error:', error);
    return new Response(
      JSON.stringify({ success: false, detail: 'Internal server error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
