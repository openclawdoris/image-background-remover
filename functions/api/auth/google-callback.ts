import type { Env, GoogleTokenResponse, GoogleUser } from './types';
import { findOrCreateUser, createSession } from './db';

export async function onRequestGet(context: {
  request: Request;
  env: Env;
}): Promise<Response> {
  try {
    const { request, env } = context;
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');

    if (!code) {
      return new Response('Authorization code missing', { status: 400 });
    }

    // 验证 state 参数（防止 CSRF）
    // 这里可以添加更复杂的 state 验证

    // 用 code 换取 access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: env.GOOGLE_CLIENT_ID,
        client_secret: env.GOOGLE_CLIENT_SECRET,
        redirect_uri: `${url.origin}/api/auth/google-callback`,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.text();
      console.error('Google token error:', error);
      return new Response('Failed to get access token', { status: 500 });
    }

    const tokens = (await tokenResponse.json()) as GoogleTokenResponse;

    // 获取用户信息
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });

    if (!userResponse.ok) {
      const error = await userResponse.text();
      console.error('Google user info error:', error);
      return new Response('Failed to get user info', { status: 500 });
    }

    const googleUser = (await userResponse.json()) as GoogleUser;

    // 查找或创建用户
    const user = await findOrCreateUser(env.DB, googleUser);

    // 创建会话
    const session = await createSession(
      env.DB,
      user.id,
      tokens.access_token,
      tokens.refresh_token,
      tokens.expires_in
    );

    // 设置 session cookie 并重定向
    const response = new Response(null, {
      status: 302,
      headers: {
        Location: '/',
        'Set-Cookie': `session_id=${session.id}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${tokens.expires_in}`,
      },
    });

    return response;
  } catch (error) {
    console.error('OAuth callback error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}
