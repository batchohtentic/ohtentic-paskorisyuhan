# Architecture

## Principles

1. **The database is the source of truth.** This covers official times, records and results. Browsers only *display* data.
2. **Server-generated timestamps.** Every official record (checkpoint, finish, race clock) uses Postgres `now()`, never the phone's clock. When an offline-queued submission syncs later, we store both `device_recorded_at` and `server_received_at`, and records are never silently backdated.
3. **Three layers of access control:**
   - **Middleware:** signed-out visitors cannot open `/admin`.
   - **Server:** every admin page and action calls `requirePermission()`.
   - **Database:** Row Level Security, so even a bug in the app cannot read or write what the role isn't allowed to.
4. **Honest states.** Every data loader returns `ok | unconfigured | error`. The UI never shows fake numbers. Missing information renders as "To be announced"; missing integrations render as "Awaiting configuration".
5. **Personal data is physically separated.** Contact, address and payment data live in `participant_private`, which only Super/Event Administrators can read. Public pages only ever see aggregate counts, or bib + public name.

## Code layout

```
src/
  app/
    (site)/          Public website (cached, revalidated every 60s)
    admin/login      Staff sign-in
    admin/(portal)/  Authenticated admin modules (always server-rendered)
    register/        Redirect to the Google Form configured in settings
  components/        Shared UI (brand, cards, countdown, …)
  lib/
    auth/roles.ts    Role → permission matrix (mirrors the database policies)
    auth/session.ts  getStaff(), requirePermission()
    data/            Read-only data loaders for public pages
    supabase/        public (anon, cookie-less) / server (user session) / service (server jobs)
    settings-schema  Validated, editable event information
supabase/
  migrations/        Versioned SQL schema + RLS
  seed.sql           Only facts given by the organizers
scripts/check-migrations.mjs   Applies all SQL in an embedded Postgres and tests RLS per role
tests/               Unit tests (countdown, permissions, settings validation)
```

## Roles

| Role | Can |
|---|---|
| Super Administrator | Everything, including user management |
| Event Administrator | Registrations (incl. private data), settings, content, bibs |
| Race Director | Race clock, checkpoints, finish line, bibs, categories |
| Checkpoint Personnel | Look up runners (bib + name only), submit checkpoint reports |
| Finish-Line Recorder | Record finish arrivals |
| Results Administrator | Approve and publish official results and winners |
| Sports Coordinator | Activities, tournaments, schedule |
| Content Publisher | Announcements, schedule, gallery, Facebook publishing |

## Data model by phase

| Phase | Tables |
|---|---|
| 1 ✅ | `staff_profiles`, `staff_roles`, `audit_logs`, `site_settings`, `race_categories`, `checkpoints`, `participants`, `participant_private`, `announcements`, `schedule_events`, `activities`, `upcoming_activities`, storage bucket `posters` |
| 2 | `sync_runs`, `sync_issues` (duplicate/invalid rows), `bib_assignments` history; RPC `assign_bib()` |
| 3 | `checkpoint_assignments` (staff ↔ checkpoint), `checkpoint_reports` (unique `participant_id + checkpoint_id`, `server_received_at default now()`, `device_recorded_at`, `client_submission_id` for idempotent retries), view `public_checkpoint_feed`, Realtime publication |
| 4 | `race_sessions` (per category) + `race_session_events` (start/pause/resume/stop/reset, server timestamps; elapsed time computed from events), `finish_records` (unique per participant), `finish_corrections`, `result_approvals` |
| 5 | `teams`, `team_members`, `matches`, `match_results`, standings view, `raffle_prizes`, `raffle_winners` |
| 6 | `facebook_publications` (request, status, Graph API response, post id, error) |
| 7 | `gallery_albums`, `gallery_photos`, `awards` (podium with prize amounts entered by admins) |

## Race-day reliability (Phases 3–4)

- **Idempotent submissions:** each checkpoint/finish submission carries a client-generated UUID. Retries after a dropped connection can never create duplicates.
- **Offline queue:** submissions made while offline are stored on the device (IndexedDB) and sent when the connection returns. The UI shows `LIVE / RECONNECTING / OFFLINE` and the last successful server sync time.
- **Race clock:** elapsed time = sum of server-timestamped running intervals from `race_session_events`. The browser only animates the display.
- **Manual fallback:** printed bib sheets and paper logs per checkpoint, entered later through an audited correction workflow.
