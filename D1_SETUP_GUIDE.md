# 🚀 Cloudflare D1 数据库和用户认证设置指南

## 📋 概述

我们已经完成了代码的编写，现在需要在 Cloudflare 上完成以下配置：

1. 创建 D1 数据库
2. 配置 wrangler.toml
3. 运行数据库迁移
4. 配置环境变量
5. 重新部署

---

## 🛠️ 详细步骤

### 第一步：安装 wrangler CLI

如果你还没有安装 wrangler：

```bash
npm install -g wrangler
```

### 第二步：登录 Cloudflare

```bash
wrangler login
```

### 第三步：创建 D1 数据库

```bash
wrangler d1 create image-tools-users
```

这会返回一个数据库 ID，复制这个 ID。

### 第四步：更新 wrangler.toml

将第三步得到的数据库 ID 填入 `wrangler.toml`：

```toml
[[d1_databases]]
binding = "DB"
database_name = "image-tools-users"
database_id = "你的数据库ID"  # 替换这里
```

### 第五步：执行数据库迁移

```bash
wrangler d1 execute image-tools-users --file=./schema.sql
```

### 第六步：配置环境变量

在 Cloudflare Pages 控制台中：

1. 进入你的项目 → Settings → Environment variables
2. 添加以下变量：

**生产环境变量：**
- `GOOGLE_CLIENT_ID` = `你的Google Client ID`
- `GOOGLE_CLIENT_SECRET` = `你的Google Client Secret` (⚠️ 勾选 Encrypt)
- `REMOVE_BG_API_KEY` = `你的remove.bg API Key` (如果有)

### 第七步：配置 D1 数据库绑定

在 Cloudflare Pages 控制台中：

1. 进入你的项目 → Settings → Functions
2. 找到 "D1 database bindings"
3. 添加绑定：
   - Variable name: `DB`
   - D1 database: 选择 `image-tools-users`

### 第八步：重新部署

提交代码并推送到 GitHub，Cloudflare Pages 会自动重新部署。

或者手动触发部署：

```bash
# 提交代码
git add .
git commit -m "Add D1 database and user authentication"
git push
```

---

## 🔧 Google OAuth 配置补充

### 配置 Google Cloud Console 回调 URL

在 https://console.cloud.google.com/ 中：

1. 进入你的项目
2. 找到 "APIs & Services" → "Credentials"
3. 编辑你的 OAuth 2.0 Client ID
4. 在 "Authorized redirect URIs" 中添加：
   ```
   https://imagebackgroundandwatermarkremover.shop/api/auth/google-callback
   https://你的pages域名.pages.dev/api/auth/google-callback
   ```

---

## 📊 数据库表结构

### users 表
存储用户基本信息

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER | 主键 |
| google_id | TEXT | Google 用户 ID |
| email | TEXT | 邮箱 |
| name | TEXT | 姓名 |
| avatar_url | TEXT | 头像 URL |
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 更新时间 |
| last_login_at | DATETIME | 最后登录时间 |
| subscription_tier | TEXT | 套餐等级 (free/pro/enterprise) |
| api_calls_used | INTEGER | 已使用 API 次数 |
| api_calls_limit | INTEGER | API 调用限制 |

### user_sessions 表
存储用户会话

### api_usage 表
记录 API 使用历史

---

## 🧪 测试流程

部署完成后：

1. 访问网站
2. 点击 "Google 登录"
3. 授权后应该能看到用户头像和姓名
4. 上传图片并处理
5. 检查配额是否正确更新
6. 点击登出，确认会话清除

---

## 🚨 常见问题

### 数据库绑定不生效
- 确保在 Cloudflare Pages 的 Functions 设置中配置了 D1 绑定
- 变量名必须是 `DB`

### OAuth 回调错误
- 确认 Google Cloud Console 中配置了正确的回调 URL
- 检查 `GOOGLE_CLIENT_SECRET` 是否正确配置

### 配额没有更新
- 确认用户已登录
- 检查数据库中 `api_usage` 表是否有数据

---

## 📞 需要帮助？

如果遇到问题：

1. 检查 Cloudflare Pages 的 Functions 日志
2. 确认所有环境变量都已正确设置
3. 验证数据库 schema 是否已导入
