"use client";
import { createBrowserClient } from "@supabase/ssr";
import { readSupabaseConfig } from "@/lib/supabase-config";

/** Browser client — used for login and (from Phase 3) Realtime subscriptions. */
export function getBrowserClient() {
  const { url, key, ok } = readSupabaseConfig(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  if (!ok) return null;
  return createBrowserClient(url, key);
}
