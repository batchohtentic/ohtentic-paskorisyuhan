-- ════════════════════════════════════════════════════════════════
-- SEED — only facts stated by the organizers. Everything else
-- (fees, routes, gun times, prizes, venues) stays NULL and is shown
-- as "To be announced" until an administrator fills it in.
-- Safe to run more than once.
-- ════════════════════════════════════════════════════════════════
insert into public.race_categories (code, name, distance_km, sort_order) values
  ('5K',  '5KM',  5,  1),
  ('8K',  '8KM',  8,  2),
  ('12K', '12KM', 12, 3)
on conflict (code) do nothing;

insert into public.site_settings (key, value) values
  ('site', jsonb_build_object(
    'eventName', 'CCES Interbatch Paskorisyuhan 2026',
    'theme', 'Oh-TEN-tic Fun, Christmas for Everyone!',
    'host', 'CCES Alumni Association – Batch 2010 “Oh-TEN-tic!”',
    'location', 'Can-avid, Eastern Samar, Philippines',
    'facebookPageUrl', null, 'contactEmail', null, 'urgentTicker', null)),
  ('fun_run', jsonb_build_object(
    'title', 'Oh-TEN-tic! Fun Run for Everyone',
    'eventDate', '2026-12-05',
    'startTime', null, 'endTime', null,
    'startingPoint', null, 'destination', null, 'assemblyTime', null, 'routeInfo', null,
    'registrationFormUrl', null, 'registrationDeadline', null,
    'registrationInstructions', null, 'paymentInstructions', null,
    'inclusions', '[]'::jsonb, 'guidelines', '[]'::jsonb, 'reminders', '[]'::jsonb))
on conflict (key) do nothing;

insert into public.activities (slug, title, kind, tagline, sort_order) values
  ('basketball',       'Basketball',              'sport',   'Interbatch basketball tournament',        1),
  ('volleyball',       'Volleyball',              'sport',   'Interbatch volleyball tournament',        2),
  ('pickleball',       'Pickleball',              'sport',   'Pickleball tournament',                   3),
  ('mobile-legends',   'Mobile Legends',          'esport',  'Mobile Legends: Bang Bang tournament',    4),
  ('parade-opening',   'Parade & Formal Opening', 'program', 'Parade, formal opening program, games and Laro ng Lahi', 5),
  ('bingo-socials',    'Bingo Socials',           'social',  'Community bingo socials',                 6),
  ('raffle-bonanza',   'Raffle Bonanza',          'social',  'The Paskorisyuhan Raffle Bonanza',        7)
on conflict (slug) do nothing;

insert into public.schedule_events (title, starts_at, date_label, description, status, is_published, sort_order, activity_slug)
select 'Oh-TEN-tic! Fun Run for Everyone', null, 'December 5, 2026',
       'The kick-off event of CCES Interbatch Paskorisyuhan 2026 — 5KM, 8KM and 12KM categories.',
       'upcoming', true, 1, null
where not exists (select 1 from public.schedule_events where title = 'Oh-TEN-tic! Fun Run for Everyone');
