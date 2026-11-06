/** Result wrapper: every data loader says honestly where its data came from. */
export type Loaded<T> =
  | { state: "ok"; data: T }
  | { state: "unconfigured" }
  | { state: "error"; message: string };

export type RegistrationStatus = "not_open" | "open" | "closed" | "full";
export type RaceStatus = "not_started" | "ready" | "in_progress" | "paused" | "completed";

export interface RaceCategory {
  id: string;
  code: string; // "5K"
  name: string; // "5KM"
  distance_km: number;
  fee_php: number | null;
  gun_time: string | null;
  route_description: string | null;
  starting_point: string | null;
  registration_status: RegistrationStatus;
  race_status: RaceStatus;
  sort_order: number;
}

export interface CategoryStats {
  category_code: string;
  registered: number;
  confirmed: number;
}

export interface PublicStats {
  total_registered: number;
  total_confirmed: number;
  per_category: CategoryStats[];
  upcoming_events: number;
  completed_events: number;
}

export type AnnouncementCategory =
  | "general" | "fun_run" | "registration" | "sports" | "parade_opening"
  | "bingo" | "raffle" | "results" | "reminder";

export type AnnouncementPriority = "normal" | "important" | "urgent";

export interface Announcement {
  id: string;
  title: string;
  body: string;
  poster_url: string | null;
  category: AnnouncementCategory;
  priority: AnnouncementPriority;
  is_pinned: boolean;
  published_at: string;
  author_name: string | null;
  facebook_post_url: string | null;
}

export type EventStatus = "upcoming" | "ongoing" | "completed" | "postponed" | "cancelled";

export interface ScheduleEvent {
  id: string;
  title: string;
  starts_at: string | null;
  ends_at: string | null;
  date_label: string | null;
  venue: string | null;
  description: string | null;
  poster_url: string | null;
  status: EventStatus;
  sort_order: number;
  activity_slug: string | null;
}

export type ActivityKind = "sport" | "esport" | "program" | "social";

export interface Activity {
  slug: string;
  title: string;
  kind: ActivityKind;
  tagline: string | null;
  description: string | null;
  details: Record<string, string | null>;
  poster_url: string | null;
  registration_url: string | null;
  sort_order: number;
}

export type UpcomingStatus = "reserved" | "coming_soon" | "registration_open" | "fully_booked" | "completed";

export interface UpcomingActivity {
  id: string;
  title: string;
  date_label: string | null;
  venue: string | null;
  description: string | null;
  poster_url: string | null;
  registration_url: string | null;
  status: UpcomingStatus;
}
