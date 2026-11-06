import { cache } from "react";
import { getPublicClient } from "@/lib/supabase/public";
import { DEFAULT_CATEGORIES } from "@/lib/settings-schema";
import type {
  Activity, Announcement, Loaded, PublicStats, RaceCategory, ScheduleEvent, UpcomingActivity,
} from "@/lib/types";

async function run<T>(fn: (sb: NonNullable<ReturnType<typeof getPublicClient>>) => Promise<{ data: T | null; error: { message: string } | null }>): Promise<Loaded<T>> {
  const sb = getPublicClient();
  if (!sb) return { state: "unconfigured" };
  try {
    const { data, error } = await fn(sb);
    if (error) return { state: "error", message: error.message };
    return { state: "ok", data: data as T };
  } catch (e) {
    return { state: "error", message: e instanceof Error ? e.message : "Unknown error" };
  }
}

/** Categories for display. Falls back to the three known categories (no fees/routes) when offline. */
export const getCategories = cache(async (): Promise<RaceCategory[]> => {
  const res = await run<RaceCategory[]>((sb) => sb.from("race_categories").select("*").order("sort_order") as never);
  if (res.state === "ok" && res.data.length) return res.data;
  return DEFAULT_CATEGORIES.map((c) => ({
    id: c.code, code: c.code, name: c.name, distance_km: c.distance_km, sort_order: c.sort_order,
    fee_php: null, gun_time: null, route_description: null, starting_point: null,
    registration_status: "not_open", race_status: "not_started",
  }));
});

export const getPublicStats = cache(async (): Promise<Loaded<PublicStats>> => {
  const sb = getPublicClient();
  if (!sb) return { state: "unconfigured" };
  const [reg, ev] = await Promise.all([sb.rpc("public_registration_stats"), sb.rpc("public_event_stats")]);
  if (reg.error || ev.error) return { state: "error", message: (reg.error ?? ev.error)!.message };
  return { state: "ok", data: { ...reg.data, ...ev.data } as PublicStats };
});

export const getAnnouncements = cache(async (limit = 50): Promise<Loaded<Announcement[]>> =>
  run((sb) => sb.from("announcements")
    .select("id,title,body,poster_url,category,priority,is_pinned,published_at,author_name,facebook_post_url")
    .order("is_pinned", { ascending: false }).order("published_at", { ascending: false }).limit(limit) as never));

export const getAnnouncement = cache(async (id: string): Promise<Loaded<Announcement | null>> => {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return { state: "ok", data: null };
  return run((sb) => sb.from("announcements")
    .select("id,title,body,poster_url,category,priority,is_pinned,published_at,author_name,facebook_post_url")
    .eq("id", id).maybeSingle() as never);
});

export const getSchedule = cache(async (): Promise<Loaded<ScheduleEvent[]>> =>
  run((sb) => sb.from("schedule_events").select("*")
    .order("starts_at", { ascending: true, nullsFirst: false }).order("sort_order") as never));

export const getActivities = cache(async (): Promise<Loaded<Activity[]>> =>
  run((sb) => sb.from("activities").select("*").order("sort_order") as never));

export const getActivity = cache(async (slug: string): Promise<Loaded<Activity | null>> =>
  run((sb) => sb.from("activities").select("*").eq("slug", slug).maybeSingle() as never));

export const getUpcoming = cache(async (): Promise<Loaded<UpcomingActivity[]>> =>
  run((sb) => sb.from("upcoming_activities").select("*").order("sort_order") as never));
