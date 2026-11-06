-- ════════════════════════════════════════════════════════════════
-- 0004 STORAGE — public "posters" bucket for announcement posters,
-- activity posters and (Phase 7) gallery photos. Anyone can VIEW;
-- only publishing staff can upload, replace or delete.
-- ════════════════════════════════════════════════════════════════
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('posters', 'posters', true, 10485760, array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;

create policy "staff upload posters" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'posters' and public.has_any_role(array['super_admin','event_admin','content_publisher','sports_coordinator']::public.app_role[]));
create policy "staff update posters" on storage.objects
  for update to authenticated
  using (bucket_id = 'posters' and public.has_any_role(array['super_admin','event_admin','content_publisher','sports_coordinator']::public.app_role[]));
create policy "staff delete posters" on storage.objects
  for delete to authenticated
  using (bucket_id = 'posters' and public.has_any_role(array['super_admin','event_admin','content_publisher']::public.app_role[]));
