/**
 * Reads the Supabase settings defensively. Values are pasted by hand into
 * Vercel, so common paste mistakes are corrected (spaces, quotes, missing
 * https://, a trailing /rest/v1, the dashboard address instead of the
 * Project URL). Anything that still isn't usable is reported as a problem
 * instead of crashing the build: the site then runs in "awaiting
 * configuration" mode and the admin login explains what to fix.
 *
 * Pure and dependency-free so the browser, middleware and server can all use it.
 * Callers must pass `process.env.NEXT_PUBLIC_…` literally so Next.js can inline it.
 */
export interface SupabaseConfig {
  url: string;
  key: string;
  ok: boolean;
  /** Plain-language explanation when `ok` is false and something was entered. */
  problem: string | null;
}

function clean(v: string | undefined): string {
  return (v ?? "").trim().replace(/^["'`]+|["'`]+$/g, "").trim();
}

export function normalizeSupabaseUrl(raw: string | undefined): { url: string; problem: string | null } {
  let v = clean(raw);
  if (!v) return { url: "", problem: null };
  if (/^eyJ|^sb_(publishable|secret)_/.test(v))
    return { url: "", problem: "NEXT_PUBLIC_SUPABASE_URL contains a key, not the Project URL. Put the Project URL (https://….supabase.co) in this variable." };
  if (!/^https?:\/\//i.test(v)) v = "https://" + v;
  let u: URL;
  try {
    u = new URL(v);
  } catch {
    return { url: "", problem: "NEXT_PUBLIC_SUPABASE_URL is not a web address. Copy the Project URL from Supabase → Project Settings → API (it looks like https://abcdxyz.supabase.co)." };
  }
  // Dashboard link pasted instead of the Project URL: https://supabase.com/dashboard/project/<ref>
  if (/(^|\.)supabase\.com$/i.test(u.hostname)) {
    const ref = u.pathname.match(/\/project\/([a-z0-9]{10,40})/i)?.[1];
    if (ref) return { url: `https://${ref.toLowerCase()}.supabase.co`, problem: null };
    return { url: "", problem: "NEXT_PUBLIC_SUPABASE_URL is the Supabase website address. Use the Project URL instead (it ends in .supabase.co)." };
  }
  if (u.protocol !== "https:" && !/^(localhost|127\.0\.0\.1)$/.test(u.hostname))
    return { url: "", problem: "NEXT_PUBLIC_SUPABASE_URL must start with https://" };
  return { url: `${u.protocol}//${u.host}`, problem: null };
}

export function readSupabaseConfig(rawUrl: string | undefined, rawKey: string | undefined): SupabaseConfig {
  const { url, problem } = normalizeSupabaseUrl(rawUrl);
  const key = clean(rawKey);
  let keyProblem: string | null = null;
  if (key && /^https?:\/\//i.test(key)) keyProblem = "NEXT_PUBLIC_SUPABASE_ANON_KEY contains a web address, not a key. Put the anon / publishable key here.";
  else if (key && /^sb_secret_/.test(key)) keyProblem = "NEXT_PUBLIC_SUPABASE_ANON_KEY contains the SECRET key. Use the anon / publishable key here, and move the secret key to SUPABASE_SERVICE_ROLE_KEY.";
  const ok = Boolean(url && key && !problem && !keyProblem);
  const missing = !ok && !problem && !keyProblem && (url || key) ? `Missing ${url ? "NEXT_PUBLIC_SUPABASE_ANON_KEY" : "NEXT_PUBLIC_SUPABASE_URL"}.` : null;
  return { url: ok ? url : "", key: ok ? key : "", ok, problem: problem ?? keyProblem ?? missing };
}
