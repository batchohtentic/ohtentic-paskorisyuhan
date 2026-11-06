-- ════════════════════════════════════════════════════════════════
-- 0001 FOUNDATION — staff accounts, roles, audit trail, site settings
-- ════════════════════════════════════════════════════════════════

-- ── Roles ───────────────────────────────────────────────────────
create type public.app_role as enum (
  'super_admin',
  'event_admin',
  'race_director',
  'checkpoint_personnel',
  'finish_recorder',
  'results_admin',
  'sports_coordinator',
  'content_publisher'
);

create or replace function public.set_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

-- A staff profile exists only for Batch 2010 accounts. Public visitors never
-- sign in, so "no profile" = "no access".
create table public.staff_profiles (
  user_id      uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (length(display_name) between 1 and 120),
  is_active    boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create trigger staff_profiles_updated before update on public.staff_profiles
  for each row execute function public.set_updated_at();

create table public.staff_roles (
  user_id    uuid not null references public.staff_profiles(user_id) on delete cascade,
  role       public.app_role not null,
  granted_by uuid references auth.users(id),
  granted_at timestamptz not null default now(),
  primary key (user_id, role)
);

-- SECURITY DEFINER so RLS policies can call it without recursion.
create or replace function public.has_any_role(roles public.app_role[]) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1
    from public.staff_roles r
    join public.staff_profiles p on p.user_id = r.user_id
    where r.user_id = auth.uid() and p.is_active and r.role = any(roles)
  );
$$;

create or replace function public.is_staff() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.staff_profiles where user_id = auth.uid() and is_active);
$$;

create or replace function public.current_staff_name() returns text
language sql stable security definer set search_path = public as $$
  select display_name from public.staff_profiles where user_id = auth.uid();
$$;

alter table public.staff_profiles enable row level security;
alter table public.staff_roles    enable row level security;

create policy "staff read own profile; super admin reads all" on public.staff_profiles
  for select to authenticated
  using (user_id = auth.uid() or public.has_any_role(array['super_admin']::public.app_role[]));
create policy "super admin manages profiles" on public.staff_profiles
  for all to authenticated
  using (public.has_any_role(array['super_admin']::public.app_role[]))
  with check (public.has_any_role(array['super_admin']::public.app_role[]));

create policy "staff read own roles; super admin reads all" on public.staff_roles
  for select to authenticated
  using (user_id = auth.uid() or public.has_any_role(array['super_admin']::public.app_role[]));
create policy "super admin manages roles" on public.staff_roles
  for all to authenticated
  using (public.has_any_role(array['super_admin']::public.app_role[]))
  with check (public.has_any_role(array['super_admin']::public.app_role[]));

-- ── Audit trail (append-only) ───────────────────────────────────
create table public.audit_logs (
  id          bigint generated always as identity primary key,
  occurred_at timestamptz not null default now(),
  actor_id    uuid,
  actor_name  text,
  action      text not null,
  entity      text not null,
  entity_id   text,
  details     jsonb not null default '{}'::jsonb
);
create index audit_logs_occurred_idx on public.audit_logs (occurred_at desc);
create index audit_logs_entity_idx on public.audit_logs (entity, entity_id);

alter table public.audit_logs enable row level security;
create policy "admins read audit" on public.audit_logs
  for select to authenticated
  using (public.has_any_role(array['super_admin','event_admin']::public.app_role[]));
-- No insert/update/delete policies: rows can ONLY be written through log_audit(),
-- and never modified or removed by any app user.
revoke insert, update, delete on public.audit_logs from anon, authenticated;

create or replace function public.log_audit(
  p_action text, p_entity text, p_entity_id text, p_details jsonb default '{}'::jsonb
) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not public.is_staff() then
    raise exception 'Only active staff can write audit entries' using errcode = '42501';
  end if;
  insert into public.audit_logs (actor_id, actor_name, action, entity, entity_id, details)
  values (auth.uid(), public.current_staff_name(), p_action, p_entity, p_entity_id, coalesce(p_details, '{}'::jsonb));
end $$;
revoke execute on function public.log_audit(text, text, text, jsonb) from anon;

-- ── Site settings (key/value, editable from the admin portal) ──
create table public.site_settings (
  key        text primary key check (key ~ '^[a-z_]+$'),
  value      jsonb not null,
  is_public  boolean not null default true,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);
create trigger site_settings_updated before update on public.site_settings
  for each row execute function public.set_updated_at();

alter table public.site_settings enable row level security;
create policy "anyone reads public settings" on public.site_settings
  for select to anon, authenticated using (is_public);
create policy "settings managers read all" on public.site_settings
  for select to authenticated
  using (public.has_any_role(array['super_admin','event_admin']::public.app_role[]));
create policy "settings managers write" on public.site_settings
  for all to authenticated
  using (public.has_any_role(array['super_admin','event_admin']::public.app_role[]))
  with check (public.has_any_role(array['super_admin','event_admin']::public.app_role[]));
