/**
 * Role → permission matrix. This is the single source of truth for the
 * application layer. The SAME rules are enforced again inside the database
 * by Row Level Security (see supabase/migrations), so a bug in the UI can
 * never grant access the database would refuse.
 */
export const ROLES = [
  "super_admin",
  "event_admin",
  "race_director",
  "checkpoint_personnel",
  "finish_recorder",
  "results_admin",
  "sports_coordinator",
  "content_publisher",
] as const;
export type Role = (typeof ROLES)[number];

export const ROLE_LABELS: Record<Role, string> = {
  super_admin: "Super Administrator",
  event_admin: "Event Administrator",
  race_director: "Race Director",
  checkpoint_personnel: "Checkpoint Personnel",
  finish_recorder: "Finish-Line Recorder",
  results_admin: "Results Administrator",
  sports_coordinator: "Sports Coordinator",
  content_publisher: "Content Publisher",
};

export const PERMISSIONS = {
  "dashboard.view": ["super_admin", "event_admin", "race_director", "results_admin", "sports_coordinator", "content_publisher"],
  "registrations.view_private": ["super_admin", "event_admin"],
  "registrations.manage": ["super_admin", "event_admin"],
  "bibs.manage": ["super_admin", "event_admin", "race_director"],
  "runners.view": ["super_admin", "event_admin", "race_director", "checkpoint_personnel", "finish_recorder", "results_admin"],
  "checkpoint.submit": ["super_admin", "race_director", "checkpoint_personnel"],
  "finish.record": ["super_admin", "race_director", "finish_recorder"],
  "race.clock": ["super_admin", "race_director"],
  "results.approve": ["super_admin", "results_admin"],
  "sports.manage": ["super_admin", "event_admin", "sports_coordinator"],
  "content.publish": ["super_admin", "event_admin", "content_publisher"],
  "facebook.publish": ["super_admin", "event_admin", "content_publisher"],
  "gallery.manage": ["super_admin", "event_admin", "content_publisher"],
  "settings.manage": ["super_admin", "event_admin"],
  "users.manage": ["super_admin"],
  "audit.view": ["super_admin", "event_admin"],
} as const satisfies Record<string, readonly Role[]>;
export type Permission = keyof typeof PERMISSIONS;

export function can(roles: readonly Role[], permission: Permission): boolean {
  const allowed = PERMISSIONS[permission] as readonly Role[];
  return roles.some((r) => allowed.includes(r));
}

export function isRole(value: string): value is Role {
  return (ROLES as readonly string[]).includes(value);
}
