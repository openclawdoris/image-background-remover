export interface GoogleUser {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}

export interface GoogleTokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  scope: string;
  token_type: string;
  id_token: string;
}

export interface User {
  id: number;
  google_id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  last_login_at: string | null;
  is_active: boolean;
  subscription_tier: 'free' | 'pro' | 'enterprise';
  api_calls_used: number;
  api_calls_limit: number;
}

export interface Session {
  id: string;
  user_id: number;
  access_token: string | null;
  refresh_token: string | null;
  expires_at: string;
  created_at: string;
}

export interface Env {
  DB: D1Database;
  REMOVE_BG_API_KEY?: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
}
