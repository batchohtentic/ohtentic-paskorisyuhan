import type { Permission } from "./auth/roles";

/** The 17 admin modules. `phase` marks when each becomes functional. */
export interface AdminModule { key: string; label: string; href: string; permission: Permission; phase: number }

export const ADMIN_MODULES: AdminModule[] = [
  { key: "dashboard", label: "Dashboard", href: "/admin", permission: "dashboard.view", phase: 1 },
  { key: "registrations", label: "Registration Management", href: "/admin/registrations", permission: "registrations.manage", phase: 2 },
  { key: "runners", label: "Runner Management", href: "/admin/runners", permission: "runners.view", phase: 2 },
  { key: "checkpoints", label: "Checkpoint Monitoring", href: "/admin/checkpoints", permission: "checkpoint.submit", phase: 3 },
  { key: "finish", label: "Finish-Line Recording", href: "/admin/finish", permission: "finish.record", phase: 4 },
  { key: "clock", label: "Race Timekeeping", href: "/admin/clock", permission: "race.clock", phase: 4 },
  { key: "results", label: "Results Management", href: "/admin/results", permission: "results.approve", phase: 4 },
  { key: "awarding", label: "Awarding", href: "/admin/awarding", permission: "results.approve", phase: 7 },
  { key: "sports", label: "Sports Management", href: "/admin/sports", permission: "sports.manage", phase: 5 },
  { key: "program", label: "Master Program", href: "/admin/program", permission: "content.publish", phase: 5 },
  { key: "announcements", label: "Announcements", href: "/admin/announcements", permission: "content.publish", phase: 5 },
  { key: "facebook", label: "Facebook Integration", href: "/admin/facebook", permission: "facebook.publish", phase: 6 },
  { key: "gallery", label: "Gallery", href: "/admin/gallery", permission: "gallery.manage", phase: 7 },
  { key: "upcoming", label: "Upcoming Activities", href: "/admin/upcoming", permission: "content.publish", phase: 5 },
  { key: "users", label: "User Management", href: "/admin/users", permission: "users.manage", phase: 2 },
  { key: "settings", label: "Website Settings", href: "/admin/settings", permission: "settings.manage", phase: 1 },
  { key: "audit", label: "Audit Logs", href: "/admin/audit", permission: "audit.view", phase: 2 },
];

export const CURRENT_PHASE = 1;
