import "server-only";
import { createClient } from "@supabase/supabase-js";
import { env, isServiceRoleConfigured } from "@/lib/env";

/**
 * SERVICE ROLE client — bypasses RLS. Only for trusted server jobs
 * (Google Sheets sync, Facebook publishing). Never use for user-driven
 * writes where the user's own permissions should apply.
 */
export function getServiceClient() {
  if (!isServiceRoleConfigured()) return null;
  return createClient(env.supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY!.trim().replace(/^["']+|["']+$/g, ""), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
