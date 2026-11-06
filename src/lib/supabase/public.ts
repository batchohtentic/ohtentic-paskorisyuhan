import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { env, isSupabaseConfigured } from "@/lib/env";

/**
 * Cookie-less anonymous client for PUBLIC reads. Because it never touches
 * cookies, public pages can be cached and revalidated (fast for visitors).
 * Row Level Security guarantees it can only see public data.
 */
let cached: SupabaseClient | null = null;
export function getPublicClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;
  cached ??= createClient(env.supabaseUrl, env.supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}
