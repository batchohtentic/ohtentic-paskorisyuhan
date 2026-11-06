/** All event times are displayed in Philippine time regardless of the viewer's device. */
export const EVENT_TZ = "Asia/Manila";

/** Asia/Manila has no DST — a fixed +08:00 offset is correct year-round. */
export function manilaDate(isoDate: string, time = "00:00"): Date {
  return new Date(`${isoDate}T${time}:00+08:00`);
}

export function formatDate(value: string | Date, opts: Intl.DateTimeFormatOptions = {}): string {
  const d = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("en-PH", { timeZone: EVENT_TZ, month: "long", day: "numeric", year: "numeric", ...opts }).format(d);
}

export function formatTime(value: string | Date): string {
  const d = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("en-PH", { timeZone: EVENT_TZ, hour: "numeric", minute: "2-digit", hour12: true }).format(d);
}

export function formatDateTime(value: string | Date): string {
  return `${formatDate(value, { month: "short" })} · ${formatTime(value)}`;
}

export type CountdownPhase = "before" | "during" | "after";

export interface CountdownParts {
  phase: CountdownPhase;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

/**
 * Pure function so it can be unit tested. `start` is when the race begins,
 * `end` is when the event is considered over.
 */
export function countdownParts(nowMs: number, startMs: number, endMs: number): CountdownParts {
  if (nowMs >= endMs) return { phase: "after", days: 0, hours: 0, minutes: 0, seconds: 0 };
  if (nowMs >= startMs) return { phase: "during", days: 0, hours: 0, minutes: 0, seconds: 0 };
  let s = Math.floor((startMs - nowMs) / 1000);
  const days = Math.floor(s / 86400);
  s -= days * 86400;
  const hours = Math.floor(s / 3600);
  s -= hours * 3600;
  const minutes = Math.floor(s / 60);
  return { phase: "before", days, hours, minutes, seconds: s - minutes * 60 };
}
