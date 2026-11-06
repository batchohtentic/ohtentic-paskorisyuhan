-- ════════════════════════════════════════════════════════════════
-- 0002 RACE CORE — categories, checkpoints, participants
-- Checkpoint reports, race clock and finish records arrive in later
-- migrations (Phases 3–4) and reference these tables.
-- ════════════════════════════════════════════════════════════════
create type public.registration_status as enum ('not_open', 'open', 'closed', 'full');
create type public.race_status         as enum ('not_started', 'ready', 'in_progress', 'paused', 'completed');
create type public.participant_status  as enum ('registered', 'confirmed', 'cancelled');
create type public.payment_status      as enum ('pending', 'verified', 'rejected', 'waived');

create table public.race_categories (
  id                  uuid primary key default gen_random_uuid(),
  code                text not null unique check (code ~ '^[0-9]+K$'),
  name                text not null,
  distance_km         numeric(5,2) not null check (distance_km > 0),
  fee_php             numeric(10,2) check (fee_php >= 0),       -- null = not yet announced
  gun_time            timestamptz,                              -- null = not yet announced
  starting_point      text,
  route_description   text,
  registration_status public.registration_status not null default 'not_open',
  race_status         public.race_status not null default 'not_started',
  sort_order          int not null default 0,
  updated_at          timestamptz not null default now()
);
create trigger race_categories_updated before update on public.race_categories
  for each row execute function public.set_updated_at();

create table public.checkpoints (
  id          uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.race_categories(id) on delete cascade,
  name        text not null,               -- "Turning Point 1"
  location    text,
  sequence    int not null check (sequence > 0),
  is_finish   boolean not null default false,
  is_active   boolean not null default true,
  unique (category_id, sequence)
);

-- Race-facing participant record. Contains NO contact or payment data.
create table public.participants (
  id                  uuid primary key default gen_random_uuid(),
  bib                 text unique check (bib ~ '^[0-9]{1,5}$'),
  full_name           text not null,
  public_name         text not null,            -- what appears on public boards
  age                 int check (age between 1 and 120),
  category_id         uuid references public.race_categories(id),
  status              public.participant_status not null default 'registered',
  singlet_size        text,
  finisher_shirt_size text,
  sheet_row_key       text unique,              -- stable key from Google Sheets (Phase 2)
  source              text not null default 'google_sheets' check (source in ('google_sheets','manual')),
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);
create index participants_category_idx on public.participants (category_id, status);
create trigger participants_updated before update on public.participants
  for each row execute function public.set_updated_at();

-- PRIVATE data — readable only by Super/Event Administrators.
create table public.participant_private (
  participant_id    uuid primary key references public.participants(id) on delete cascade,
  address           text,
  contact_number    text,
  email             text,
  payment_status    public.payment_status not null default 'pending',
  payment_reference text,
  amount_paid_php   numeric(10,2),
  notes             text,
  updated_at        timestamptz not null default now()
);
create trigger participant_private_updated before update on public.participant_private
  for each row execute function public.set_updated_at();

-- ── RLS ─────────────────────────────────────────────────────────
alter table public.race_categories     enable row level security;
alter table public.checkpoints         enable row level security;
alter table public.participants        enable row level security;
alter table public.participant_private enable row level security;

create policy "public reads categories" on public.race_categories
  for select to anon, authenticated using (true);
create policy "admins edit categories" on public.race_categories
  for all to authenticated
  using (public.has_any_role(array['super_admin','event_admin','race_director']::public.app_role[]))
  with check (public.has_any_role(array['super_admin','event_admin','race_director']::public.app_role[]));

create policy "public reads active checkpoints" on public.checkpoints
  for select to anon, authenticated using (is_active);
create policy "race admins manage checkpoints" on public.checkpoints
  for all to authenticated
  using (public.has_any_role(array['super_admin','event_admin','race_director']::public.app_role[]))
  with check (public.has_any_role(array['super_admin','event_admin','race_director']::public.app_role[]));

-- Public visitors get NO direct access to participants. Public boards use
-- dedicated functions/views that expose bib + public_name only.
create policy "race staff read participants" on public.participants
  for select to authenticated
  using (public.has_any_role(array['super_admin','event_admin','race_director','checkpoint_personnel','finish_recorder','results_admin']::public.app_role[]));
create policy "registration admins write participants" on public.participants
  for all to authenticated
  using (public.has_any_role(array['super_admin','event_admin']::public.app_role[]))
  with check (public.has_any_role(array['super_admin','event_admin']::public.app_role[]));

create policy "registration admins only" on public.participant_private
  for all to authenticated
  using (public.has_any_role(array['super_admin','event_admin']::public.app_role[]))
  with check (public.has_any_role(array['super_admin','event_admin']::public.app_role[]));

-- ── Public aggregate statistics (counts only, never names) ─────
create or replace function public.public_registration_stats() returns jsonb
language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'total_registered', (select count(*) from participants where status <> 'cancelled'),
    'total_confirmed',  (select count(*) from participants where status = 'confirmed'),
    'per_category', coalesce((
      select jsonb_agg(jsonb_build_object(
        'category_code', c.code,
        'registered', (select count(*) from participants p where p.category_id = c.id and p.status <> 'cancelled'),
        'confirmed',  (select count(*) from participants p where p.category_id = c.id and p.status = 'confirmed')
      ) order by c.sort_order)
      from race_categories c
    ), '[]'::jsonb)
  );
$$;
grant execute on function public.public_registration_stats() to anon, authenticated;
