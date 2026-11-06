-- ════════════════════════════════════════════════════════════════
-- RESET — removes everything the setup creates, so setup can run
-- again cleanly. ⚠ Deletes all website data. Only for use BEFORE
-- real data exists (e.g. after a failed or repeated first setup).
-- The "posters" storage bucket is kept.
-- ════════════════════════════════════════════════════════════════
drop policy if exists "staff upload posters" on storage.objects;
drop policy if exists "staff update posters" on storage.objects;
drop policy if exists "staff delete posters" on storage.objects;

drop table if exists public.upcoming_activities, public.activities, public.schedule_events, public.announcements,
  public.participant_private, public.participants, public.checkpoints, public.race_categories,
  public.site_settings, public.audit_logs, public.staff_roles, public.staff_profiles cascade;

drop function if exists public.public_event_stats() cascade;
drop function if exists public.public_registration_stats() cascade;
drop function if exists public.log_audit(text, text, text, jsonb) cascade;
drop function if exists public.current_staff_name() cascade;
drop function if exists public.is_staff() cascade;
drop function if exists public.set_updated_at() cascade;

drop type if exists public.upcoming_status, public.activity_kind, public.event_status, public.announcement_priority,
  public.announcement_category, public.publish_state, public.payment_status, public.participant_status,
  public.race_status, public.registration_status cascade;
drop type if exists public.app_role cascade;  -- also removes has_any_role()
