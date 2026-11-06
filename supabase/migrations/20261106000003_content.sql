-- ════════════════════════════════════════════════════════════════
-- 0003 CONTENT — announcements, master schedule, activities,
--               "What's Next, Oh-TEN-tic?" reservations
-- ════════════════════════════════════════════════════════════════
create type public.publish_state as enum ('draft', 'published', 'archived');
create type public.announcement_category as enum (
  'general', 'fun_run', 'registration', 'sports', 'parade_opening',
  'bingo', 'raffle', 'results', 'reminder'
);
create type public.announcement_priority as enum ('normal', 'important', 'urgent');
create type public.event_status as enum ('upcoming', 'ongoing', 'completed', 'postponed', 'cancelled');
create type public.activity_kind as enum ('sport', 'esport', 'program', 'social');
create type public.upcoming_status as enum (
  'draft', 'reserved', 'coming_soon', 'registration_open', 'fully_booked', 'completed'
);

-- ── Announcements ───────────────────────────────────────────────
create table public.announcements (
  id                uuid primary key default gen_random_uuid(),
  title             text not null check (length(title) between 1 and 200),
  body              text not null default '',
  poster_url        text,
  category          public.announcement_category not null default 'general',
  priority          public.announcement_priority not null default 'normal',
  is_pinned         boolean not null default false,
  state             public.publish_state not null default 'draft',
  published_at      timestamptz,
  author_id         uuid references auth.users(id),
  author_name       text,
  facebook_post_id  text,      -- set ONLY after the Graph API confirms success (Phase 6)
  facebook_post_url text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  constraint published_has_date check (state <> 'published' or published_at is not null)
);
create index announcements_public_idx on public.announcements (state, published_at desc);
create trigger announcements_updated before update on public.announcements
  for each row execute function public.set_updated_at();

-- ── Master schedule ─────────────────────────────────────────────
create table public.schedule_events (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  starts_at     timestamptz,
  ends_at       timestamptz,
  date_label    text,             -- free text when exact time is not final ("December 2026")
  venue         text,
  description   text,
  poster_url    text,
  status        public.event_status not null default 'upcoming',
  is_published  boolean not null default false,
  sort_order    int not null default 0,
  activity_slug text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  check (ends_at is null or starts_at is null or ends_at >= starts_at)
);
create index schedule_events_order_idx on public.schedule_events (is_published, starts_at, sort_order);
create trigger schedule_events_updated before update on public.schedule_events
  for each row execute function public.set_updated_at();

-- ── Activities (Basketball, Volleyball, Pickleball, ML, Parade, Bingo, Raffle) ─
-- Tournament teams, matches and standings are added in Phase 5.
create table public.activities (
  slug             text primary key check (slug ~ '^[a-z0-9-]+$'),
  title            text not null,
  kind             public.activity_kind not null,
  tagline          text,
  description      text,
  details          jsonb not null default '{}'::jsonb,  -- venue, date, mechanics, ticket info…
  poster_url       text,
  registration_url text,
  is_published     boolean not null default true,
  sort_order       int not null default 0,
  updated_at       timestamptz not null default now()
);
create trigger activities_updated before update on public.activities
  for each row execute function public.set_updated_at();

-- ── What's Next, Oh-TEN-tic? ────────────────────────────────────
create table public.upcoming_activities (
  id               uuid primary key default gen_random_uuid(),
  title            text not null,
  date_label       text,
  venue            text,
  description      text,
  poster_url       text,
  registration_url text,
  status           public.upcoming_status not null default 'draft',
  sort_order       int not null default 0,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create trigger upcoming_activities_updated before update on public.upcoming_activities
  for each row execute function public.set_updated_at();

-- ── RLS ─────────────────────────────────────────────────────────
alter table public.announcements       enable row level security;
alter table public.schedule_events     enable row level security;
alter table public.activities          enable row level security;
alter table public.upcoming_activities enable row level security;

create policy "public reads published announcements" on public.announcements
  for select to anon, authenticated using (state = 'published' and published_at <= now());
create policy "publishers manage announcements" on public.announcements
  for all to authenticated
  using (public.has_any_role(array['super_admin','event_admin','content_publisher']::public.app_role[]))
  with check (public.has_any_role(array['super_admin','event_admin','content_publisher']::public.app_role[]));

create policy "public reads published schedule" on public.schedule_events
  for select to anon, authenticated using (is_published);
create policy "publishers manage schedule" on public.schedule_events
  for all to authenticated
  using (public.has_any_role(array['super_admin','event_admin','content_publisher','sports_coordinator']::public.app_role[]))
  with check (public.has_any_role(array['super_admin','event_admin','content_publisher','sports_coordinator']::public.app_role[]));

create policy "public reads published activities" on public.activities
  for select to anon, authenticated using (is_published);
create policy "coordinators manage activities" on public.activities
  for all to authenticated
  using (public.has_any_role(array['super_admin','event_admin','content_publisher','sports_coordinator']::public.app_role[]))
  with check (public.has_any_role(array['super_admin','event_admin','content_publisher','sports_coordinator']::public.app_role[]));

-- DRAFT and RESERVED slots are never visible to the public.
create policy "public reads announced upcoming" on public.upcoming_activities
  for select to anon, authenticated using (status not in ('draft', 'reserved'));
create policy "publishers manage upcoming" on public.upcoming_activities
  for all to authenticated
  using (public.has_any_role(array['super_admin','event_admin','content_publisher']::public.app_role[]))
  with check (public.has_any_role(array['super_admin','event_admin','content_publisher']::public.app_role[]));

-- ── Public event counters for the homepage ─────────────────────
create or replace function public.public_event_stats() returns jsonb
language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'upcoming_events',  (select count(*) from schedule_events where is_published and status in ('upcoming','ongoing')),
    'completed_events', (select count(*) from schedule_events where is_published and status = 'completed')
  );
$$;
grant execute on function public.public_event_stats() to anon, authenticated;
