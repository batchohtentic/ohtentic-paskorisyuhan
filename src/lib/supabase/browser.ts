"use client";
import { createBrowserClient } from "@supabase/ssr";

/** Browser client — used for login and (from Phase 3) Realtime subscriptions. */
export function getBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createBrowserClient(url, key);
}
