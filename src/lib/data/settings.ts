import { cache } from "react";
import { getPublicClient } from "@/lib/supabase/public";
import {
  DEFAULT_FUN_RUN_SETTINGS, DEFAULT_SITE_SETTINGS, funRunSettingsSchema, siteSettingsSchema,
  type FunRunSettings, type SiteSettings,
} from "@/lib/settings-schema";
import { manilaDate } from "@/lib/time";

export interface Settings {
  site: SiteSettings;
  funRun: FunRunSettings;
  /** false when values are code defaults because the database is not connected */
  fromDatabase: boolean;
}

/** Merge stored values over defaults; ignore anything that fails validation. */
function merge<T extends object>(defaults: T, stored: unknown, schema: { safeParse: (v: unknown) => { success: boolean; data?: T } }): T {
  if (!stored || typeof stored !== "object") return defaults;
  const parsed = schema.safeParse({ ...defaults, ...(stored as object) });
  return parsed.success && parsed.data ? parsed.data : defaults;
}

export const getSettings = cache(async (): Promise<Settings> => {
  const supabase = getPublicClient();
  if (!supabase) return { site: DEFAULT_SITE_SETTINGS, funRun: DEFAULT_FUN_RUN_SETTINGS, fromDatabase: false };
  const { data, error } = await supabase.from("site_settings").select("key, value").in("key", ["site", "fun_run"]);
  if (error) {
    console.error("[settings]", error.message);
    return { site: DEFAULT_SITE_SETTINGS, funRun: DEFAULT_FUN_RUN_SETTINGS, fromDatabase: false };
  }
  const byKey = Object.fromEntries((data ?? []).map((r) => [r.key, r.value]));
  return {
    site: merge(DEFAULT_SITE_SETTINGS, byKey.site, siteSettingsSchema),
    funRun: merge(DEFAULT_FUN_RUN_SETTINGS, byKey.fun_run, funRunSettingsSchema),
    fromDatabase: true,
  };
});

/** Countdown window for the Fun Run, in absolute milliseconds. */
export function funRunWindow(f: FunRunSettings) {
  const start = manilaDate(f.eventDate, f.startTime ?? "00:00");
  const end = f.endTime ? manilaDate(f.eventDate, f.endTime) : new Date(manilaDate(f.eventDate).getTime() + 86_400_000);
  return { startMs: start.getTime(), endMs: Math.max(end.getTime(), start.getTime()), hasExactStart: Boolean(f.startTime) };
}
