import Link from "next/link";
import { AnnouncementCard } from "@/components/AnnouncementCard";
import { CategoryCard } from "@/components/CategoryCard";
import { Countdown } from "@/components/Countdown";
import { Parol, Sparkle } from "@/components/Parol";
import { AwaitingNotice, EmptyState, SectionHeading } from "@/components/ui";
import { ACTIVITY_CATALOG, KIND_LABEL } from "@/lib/catalog";
import { getAnnouncements, getCategories, getPublicStats } from "@/lib/data/public";
import { funRunWindow, getSettings } from "@/lib/data/settings";
import { formatDate, manilaDate } from "@/lib/time";

export const revalidate = 60;

export default async function HomePage() {
  const [{ site, funRun }, categories, stats, announcements] = await Promise.all([
    getSettings(), getCategories(), getPublicStats(), getAnnouncements(3),
  ]);
  const win = funRunWindow(funRun);
  const eventDateLabel = formatDate(manilaDate(funRun.eventDate), { month: "long", day: "2-digit", year: "numeric" });

  return (
    <>
      {/* ── HERO ───────────────────────────────────────────── */}
      <section className="grain relative overflow-hidden bg-maroon-900 text-ivory-50">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_80%_at_85%_10%,rgba(212,173,67,.18),transparent_60%)]" />
        <Parol className="pointer-events-none absolute -left-10 top-10 hidden h-72 w-52 text-gold-400/10 lg:block" />
        <div className="container-page relative grid gap-12 py-14 sm:py-20 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-16 lg:py-24">
          <div className="animate-rise">
            <p className="eyebrow flex items-center gap-2 text-gold-300"><Sparkle className="h-2.5 w-2.5" />CCES Interbatch Paskorisyuhan 2026</p>
            <h1 className="mt-5 text-[2.6rem] font-semibold leading-[1.02] text-ivory-50 sm:text-6xl lg:text-[4.25rem]">
              Oh-TEN-tic Fun,<br />
              <span className="italic text-gold-300">Christmas</span> for Everyone!
            </h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-ivory-200/85">
              Hosted by Batch 2010 — <span className="font-semibold text-ivory-50">Oh-TEN-tic!</span> Join us in {site.location.replace(", Philippines", "")} for a season of running, games, parades and homecoming.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/register" className="btn-gold px-6 py-3">Register Now</Link>
              <Link href="/activities" className="btn-ghost-light px-6 py-3">Explore Activities</Link>
            </div>
            {site.facebookPageUrl && (
              <a href={site.facebookPageUrl} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 text-sm text-ivory-200/80 underline-offset-4 hover:text-gold-300 hover:underline">
                Follow Batch 2010 on Facebook ↗
              </a>
            )}
          </div>

          {/* Featured event ticket */}
          <div className="animate-rise [animation-delay:120ms]">
            <div className="relative rounded-[22px] border border-gold-400/30 bg-maroon-950/50 p-1.5 shadow-2xl shadow-black/30 backdrop-blur">
              <div className="rounded-[18px] border border-ivory/10 px-6 py-7 sm:px-8">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-gold-300">Featured Event</p>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-ivory-200/60">Kick-off</p>
                </div>
                <h2 className="mt-4 font-display text-[1.9rem] font-semibold leading-tight text-ivory-50 sm:text-4xl">
                  Oh-TEN-tic! Fun Run <span className="block text-gold-300">for Everyone</span>
                </h2>
                <p className="mt-3 font-display text-lg uppercase tracking-[0.12em] text-ivory-200">{eventDateLabel}</p>
                <div className="my-6 border-t border-dashed border-gold-400/30" />
                <Countdown startMs={win.startMs} endMs={win.endMs} />
                {!win.hasExactStart && (
                  <p className="mt-4 text-[11px] text-ivory-200/55">Counting down to race day. Exact gun time to be announced.</p>
                )}
                <div className="mt-6 flex flex-wrap gap-2">
                  {categories.map((c) => (
                    <span key={c.code} className="rounded-full border border-gold-400/40 px-3 py-1 text-xs font-semibold text-gold-200">{c.name}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── LIVE NUMBERS ───────────────────────────────────── */}
      <section className="border-b border-ivory-300/70 bg-ivory-50">
        <div className="container-page py-10">
          {stats.state === "ok" ? (
            <dl className="grid grid-cols-2 gap-y-8 sm:grid-cols-4 lg:grid-cols-7 lg:divide-x lg:divide-ivory-300">
              {[
                ["Total registrants", stats.data.total_registered],
                ["Confirmed", stats.data.total_confirmed],
                ...stats.data.per_category.map((c) => [`${c.category_code.replace("K", "KM")} runners`, c.registered] as [string, number]),
                ["Upcoming activities", stats.data.upcoming_events],
                ["Completed events", stats.data.completed_events],
              ].map(([label, value]) => (
                <div key={label as string} className="lg:px-5 lg:first:pl-0">
                  <dt className="text-[11px] font-semibold uppercase tracking-wider text-ink-mute">{label}</dt>
                  <dd className="mt-2 font-display text-4xl font-semibold tabular-nums text-maroon-900">{value as number}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <AwaitingNotice title={stats.state === "unconfigured" ? "Live registration numbers — awaiting database connection" : "Live registration numbers are temporarily unavailable"}>
              Registration counts appear here automatically once the official registration database is connected. No numbers are shown until then.
            </AwaitingNotice>
          )}
        </div>
      </section>

      {/* ── FUN RUN CATEGORIES ─────────────────────────────── */}
      <section className="container-page py-16 sm:py-20">
        <SectionHeading eyebrow="The Main Event" title={<>Choose your distance</>}
          intro="Three categories, one finish line. Every runner is part of the Oh-TEN-tic! story."
          action={<Link href="/fun-run" className="btn-ghost">Full Fun Run details →</Link>} />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {categories.map((c) => <CategoryCard key={c.code} category={c} stats={stats} />)}
        </div>
      </section>

      {/* ── ANNOUNCEMENTS ──────────────────────────────────── */}
      <section className="border-y border-ivory-300/70 bg-ivory-200/50">
        <div className="container-page py-16 sm:py-20">
          <SectionHeading eyebrow="Latest Announcements" title="News from the committee"
            action={<Link href="/announcements" className="btn-ghost">All announcements →</Link>} />
          <div className="mt-10">
            {announcements.state === "ok" && announcements.data.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-3">{announcements.data.map((a) => <AnnouncementCard key={a.id} a={a} />)}</div>
            ) : (
              <EmptyState title="No announcements yet">
                {announcements.state === "unconfigured" ? "Announcements will appear here once the website database is connected." : "Official updates from Batch 2010 will be posted here. Check back soon."}
              </EmptyState>
            )}
          </div>
        </div>
      </section>

      {/* ── PROGRAM ────────────────────────────────────────── */}
      <section className="container-page py-16 sm:py-20">
        <SectionHeading eyebrow="Paskorisyuhan 2026" title="More than a run" intro="From the parade and formal opening to the courts, the arena and the raffle draw — here is everything happening this season." />
        <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-ivory-300 bg-ivory-300 sm:grid-cols-2 lg:grid-cols-4">
          {ACTIVITY_CATALOG.map((a) => (
            <Link key={a.slug} href={`/activities/${a.slug}`} className="group flex flex-col justify-between bg-ivory-50 p-6 transition-colors hover:bg-white">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-evergreen-600">{KIND_LABEL[a.kind]}</span>
              <span className="mt-8 font-display text-2xl font-semibold text-maroon-900 group-hover:text-christmas">{a.title}</span>
              <span className="mt-1 text-sm text-ink-mute">{a.tagline}</span>
            </Link>
          ))}
          <Link href="/whats-next" className="group flex flex-col justify-between bg-evergreen-800 p-6 text-ivory-50 transition-colors hover:bg-evergreen-700">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-gold-300">Reserved</span>
            <span className="mt-8 font-display text-2xl font-semibold">What&rsquo;s Next, Oh-TEN-tic?</span>
            <span className="mt-1 text-sm text-ivory-200/70">Future activities →</span>
          </Link>
        </div>
      </section>
    </>
  );
}
