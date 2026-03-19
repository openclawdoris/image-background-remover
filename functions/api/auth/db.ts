import type { User, Session, GoogleUser, Env } from './types';

export async function findOrCreateUser(
  db: D1Database,
  googleUser: GoogleUser
): Promise<User> {
  // 先查找用户
  const existingUser = await db
    .prepare('SELECT * FROM users WHERE google_id = ? OR email = ?')
    .bind(googleUser.id, googleUser.email)
    .first<User>();

  if (existingUser) {
    // 更新用户信息和最后登录时间
    await db
      .prepare(
        'UPDATE users SET name = ?, avatar_url = ?, last_login_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
      )
      .bind(googleUser.name, googleUser.picture, existingUser.id)
      .run();

    return {
      ...existingUser,
      name: googleUser.name,
      avatar_url: googleUser.picture,
    };
  }

  // 创建新用户
  const result = await db
    .prepare(
      'INSERT INTO users (google_id, email, name, avatar_url, last_login_at) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)'
    )
    .bind(googleUser.id, googleUser.email, googleUser.name, googleUser.picture)
    .run();

  return {
    id: Number(result.meta.last_row_id),
    google_id: googleUser.id,
    email: googleUser.email,
    name: googleUser.name,
    avatar_url: googleUser.picture,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    last_login_at: new Date().toISOString(),
    is_active: true,
    subscription_tier: 'free',
    api_calls_used: 0,
    api_calls_limit: 50,
  };
}

export async function createSession(
  db: D1Database,
  userId: number,
  accessToken: string,
  refreshToken: string | undefined,
  expiresIn: number
): Promise<Session> {
  const sessionId = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + expiresIn * 1000).toISOString();

  await db
    .prepare(
      'INSERT INTO user_sessions (id, user_id, access_token, refresh_token, expires_at) VALUES (?, ?, ?, ?, ?)'
    )
    .bind(sessionId, userId, accessToken, refreshToken || null, expiresAt)
    .run();

  return {
    id: sessionId,
    user_id: userId,
    access_token: accessToken,
    refresh_token: refreshToken || null,
    expires_at: expiresAt,
    created_at: new Date().toISOString(),
  };
}

export async function getSession(db: D1Database, sessionId: string): Promise<Session | null> {
  return await db
    .prepare('SELECT * FROM user_sessions WHERE id = ? AND expires_at > CURRENT_TIMESTAMP')
    .bind(sessionId)
    .first<Session>();
}

export async function getUserById(db: D1Database, userId: number): Promise<User | null> {
  return await db.prepare('SELECT * FROM users WHERE id = ?').bind(userId).first<User>();
}

export async function deleteSession(db: D1Database, sessionId: string): Promise<void> {
  await db.prepare('DELETE FROM user_sessions WHERE id = ?').bind(sessionId).run();
}

export async function recordApiUsage(
  db: D1Database,
  userId: number,
  endpoint: string
): Promise<void> {
  await db
    .prepare('INSERT INTO api_usage (user_id, endpoint) VALUES (?, ?)')
    .bind(userId, endpoint)
    .run();

  // 更新用户的 API 使用计数（当天）
  await db
    .prepare(
      `UPDATE users 
       SET api_calls_used = api_calls_used + 1, updated_at = CURRENT_TIMESTAMP 
       WHERE id = ?`
    )
    .bind(userId)
    .run();
}

export async function checkUserQuota(db: D1Database, userId: number): Promise<boolean> {
  const user = await getUserById(db, userId);
  if (!user) return false;

  // 获取用户今天的 API 使用量
  const today = new Date().toISOString().split('T')[0];
  const usage = await db
    .prepare(
      'SELECT COUNT(*) as count FROM api_usage WHERE user_id = ? AND DATE(created_at) = ?'
    )
    .bind(userId, today)
    .first<{ count: number }>();

  return (usage?.count || 0) < user.api_calls_limit;
}
