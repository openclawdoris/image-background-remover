import type { Env } from './types';
import { getSession, getUserById } from './db';

export async function onRequestGet(context: {
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

    if (!sessionId) {
      return new Response(JSON.stringify({ success: false, detail: 'Not authenticated' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 获取会话
    const session = await getSession(env.DB, sessionId);
    if (!session) {
      return new Response(JSON.stringify({ success: false, detail: 'Session expired' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 获取用户信息
    const user = await getUserById(env.DB, session.user_id);
    if (!user) {
      return new Response(JSON.stringify({ success: false, detail: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 计算今天的 API 使用量
    const today = new Date().toISOString().split('T')[0];
    const usage = await env.DB.prepare(
      'SELECT COUNT(*) as count FROM api_usage WHERE user_id = ? AND DATE(created_at) = ?'
    )
      .bind(user.id, today)
      .first<{ count: number }>();

    return new Response(
      JSON.stringify({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatar_url: user.avatar_url,
          subscription_tier: user.subscription_tier,
          api_calls_used: usage?.count || 0,
          api_calls_limit: user.api_calls_limit,
        },
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Get user error:', error);
    return new Response(
      JSON.stringify({ success: false, detail: 'Internal server error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
