import type { EventStatus, RaceStatus, RegistrationStatus, UpcomingStatus } from "./types";

type Tone = "neutral" | "green" | "gold" | "red" | "live";

export const REGISTRATION_STATUS: Record<RegistrationStatus, { label: string; tone: Tone }> = {
  not_open: { label: "Registration not yet open", tone: "neutral" },
  open: { label: "Registration open", tone: "green" },
  closed: { label: "Registration closed", tone: "red" },
  full: { label: "Slots full", tone: "gold" },
};

export const RACE_STATUS: Record<RaceStatus, { label: string; tone: Tone }> = {
  not_started: { label: "Not started", tone: "neutral" },
  ready: { label: "Ready", tone: "gold" },
  in_progress: { label: "Race in progress", tone: "live" },
  paused: { label: "Paused", tone: "gold" },
  completed: { label: "Completed", tone: "green" },
};

export const EVENT_STATUS: Record<EventStatus, { label: string; tone: Tone }> = {
  upcoming: { label: "Upcoming", tone: "gold" },
  ongoing: { label: "Ongoing", tone: "live" },
  completed: { label: "Completed", tone: "green" },
  postponed: { label: "Postponed", tone: "neutral" },
  cancelled: { label: "Cancelled", tone: "red" },
};

export const UPCOMING_STATUS: Record<UpcomingStatus, { label: string; tone: Tone }> = {
  reserved: { label: "Reserved", tone: "neutral" },
  coming_soon: { label: "Announcement coming soon", tone: "gold" },
  registration_open: { label: "Registration open", tone: "green" },
  fully_booked: { label: "Fully booked", tone: "red" },
  completed: { label: "Completed", tone: "neutral" },
};

export function peso(n: number | null): string | null {
  if (n === null || n === undefined) return null;
  return new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: n % 1 ? 2 : 0 }).format(n);
}
