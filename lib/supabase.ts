import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// NEXT_PUBLIC_SUPABASE_URL is required on the browser. SUPABASE_URL is accepted
// as a server-only fallback so existing .env files keep working server-side.
const browserUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serverUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let _serverClient: SupabaseClient | null = null;
let _browserClient: SupabaseClient | null = null;

export function getServerSupabase(): SupabaseClient {
  if (!serverUrl || !serviceKey) {
    throw new Error(
      "Supabase server client unavailable: SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY must be set",
    );
  }
  if (!_serverClient) {
    _serverClient = createClient(serverUrl, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return _serverClient;
}

export function getBrowserSupabase(): SupabaseClient {
  if (!browserUrl || !anonKey) {
    throw new Error(
      "Supabase browser client unavailable: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set",
    );
  }
  if (!_browserClient) {
    _browserClient = createClient(browserUrl, anonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return _browserClient;
}

export function supabaseConfigured(): boolean {
  return Boolean(serverUrl && serviceKey);
}
