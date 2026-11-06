import { z } from "zod";

/**
 * Editable event information. Every field that the organizers have not yet
 * finalized is nullable; the UI renders "To be announced" for null values.
 * Only facts given in the project brief are pre-filled.
 */
const optionalText = z.string().trim().max(4000).nullable().transform((v) => (v ? v : null));
const optionalUrl = z
  .string()
  .trim()
  .nullable()
  .transform((v) => (v ? v : null))
  .refine((v) => v === null || /^https:\/\/[^\s]+$/i.test(v), "Must be a full https:// link");
const lines = z.array(z.string().trim().min(1).max(500)).max(40);

export const siteSettingsSchema = z.object({
  eventName: z.string().trim().min(1).max(200),
  theme: z.string().trim().min(1).max(200),
  host: z.string().trim().min(1).max(200),
  location: z.string().trim().min(1).max(200),
  facebookPageUrl: optionalUrl,
  contactEmail: optionalText,
  urgentTicker: optionalText,
});
export type SiteSettings = z.infer<typeof siteSettingsSchema>;

export const funRunSettingsSchema = z.object({
  title: z.string().trim().min(1).max(200),
  eventDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  /** "HH:MM" Manila time the countdown targets; null = midnight of event date */
  startTime: z.string().regex(/^\d{2}:\d{2}$/).nullable(),
  /** "HH:MM" Manila time the event is considered finished; null = end of event day */
  endTime: z.string().regex(/^\d{2}:\d{2}$/).nullable(),
  startingPoint: optionalText,
  destination: optionalText,
  assemblyTime: optionalText,
  routeInfo: optionalText,
  registrationFormUrl: optionalUrl,
  registrationDeadline: optionalText,
  registrationInstructions: optionalText,
  paymentInstructions: optionalText,
  inclusions: lines,
  guidelines: lines,
  reminders: lines,
});
export type FunRunSettings = z.infer<typeof funRunSettingsSchema>;

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  eventName: "CCES Interbatch Paskorisyuhan 2026",
  theme: "Oh-TEN-tic Fun, Christmas for Everyone!",
  host: "CCES Alumni Association – Batch 2010 “Oh-TEN-tic!”",
  location: "Can-avid, Eastern Samar, Philippines",
  facebookPageUrl: null,
  contactEmail: null,
  urgentTicker: null,
};

export const DEFAULT_FUN_RUN_SETTINGS: FunRunSettings = {
  title: "Oh-TEN-tic! Fun Run for Everyone",
  eventDate: "2026-12-05",
  startTime: null,
  endTime: null,
  startingPoint: null,
  destination: null,
  assemblyTime: null,
  routeInfo: null,
  registrationFormUrl: null,
  registrationDeadline: null,
  registrationInstructions: null,
  paymentInstructions: null,
  inclusions: [],
  guidelines: [],
  reminders: [],
};

/** The three race categories named in the brief. Fees/routes/gun times are set by admins. */
export const DEFAULT_CATEGORIES = [
  { code: "5K", name: "5KM", distance_km: 5, sort_order: 1 },
  { code: "8K", name: "8KM", distance_km: 8, sort_order: 2 },
  { code: "12K", name: "12KM", distance_km: 12, sort_order: 3 },
] as const;
