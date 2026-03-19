-- 用户表
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  google_id TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_login_at DATETIME,
  is_active BOOLEAN DEFAULT 1,
  subscription_tier TEXT DEFAULT 'free', -- free, pro, enterprise
  api_calls_used INTEGER DEFAULT 0,
  api_calls_limit INTEGER DEFAULT 50 -- 免费用户每天50次调用
);

-- 用户会话表
CREATE TABLE IF NOT EXISTS user_sessions (
  id TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  expires_at DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- API 使用记录表
CREATE TABLE IF NOT EXISTS api_usage (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  endpoint TEXT NOT NULL,
  image_processed BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 索引优化
CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_api_usage_user_id ON api_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_api_usage_date ON api_usage(created_at);
