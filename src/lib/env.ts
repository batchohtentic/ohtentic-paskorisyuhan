/**
 * Central place to ask "is integration X configured?".
 * Pages use these to show an honest "awaiting configuration" state
 * instead of fake data when credentials are not yet provided.
 */
import { readSupabaseConfig } from "./supabase-config";

const supabase = readSupabaseConfig(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
if (supabase.problem) console.warn("[config] Supabase is not connected:", supabase.problem);

function siteUrl(): string {
  const raw = (process.env.NEXT_PUBLIC_SITE_URL ?? "").trim().replace(/\/+$/, "");
  try {
    return new URL(/^https?:\/\//.test(raw) ? raw : `https://${raw}`).origin;
  } catch {
    return process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000";
  }
}

export const env = {
  siteUrl: siteUrl(),
  supabaseUrl: supabase.url,
  supabaseAnonKey: supabase.key,
  /** Plain-language reason Supabase is not connected, if a value was entered but is unusable. */
  supabaseProblem: supabase.problem,
};

export function isSupabaseConfigured(): boolean {
  return supabase.ok;
}

/** Server-only check. Never import the key itself into client components. */
export function isServiceRoleConfigured(): boolean {
  return Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()) && isSupabaseConfigured();
}

export function isGoogleSheetsConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
      process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY &&
      process.env.GOOGLE_SHEETS_REGISTRATION_ID,
  );
}

export function isFacebookConfigured(): boolean {
  return Boolean(process.env.FACEBOOK_PAGE_ID && process.env.FACEBOOK_PAGE_ACCESS_TOKEN);
}
