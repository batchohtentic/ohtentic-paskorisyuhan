import type { Metadata } from "next";
import Link from "next/link";
import { CategoryCard } from "@/components/CategoryCard";
import { Countdown } from "@/components/Countdown";
import { Sparkle } from "@/components/Parol";
import { AwaitingNotice, SectionHeading, Tba } from "@/components/ui";
import { getCategories, getPublicStats } from "@/lib/data/public";
import { funRunWindow, getSettings } from "@/lib/data/settings";
import { formatDate, manilaDate } from "@/lib/time";

export const revalidate = 60;
export const metadata: Metadata = { title: "Fun Run", description: "Oh-TEN-tic! Fun Run for Everyone — December 5, 2026. 5KM, 8KM and 12KM categories." };

function List({ items, empty }: { items: string[]; empty: string }) {
  if (!items.length) return <p className="tba text-sm">{empty}</p>;
  return (
    <ul className="space-y-3">
      {items.map((t, i) => (
        <li key={i} className="flex gap-3 text-[15px] leading-6 text-ink-soft">
          <Sparkle className="mt-1.5 h-2.5 w-2.5 shrink-0 text-gold-500" />{t}
        </li>
      ))}
    </ul>
  );
}

export default async function FunRunPage() {
  const [{ funRun: f }, categories, stats] = await Promise.all([getSettings(), getCategories(), getPublicStats()]);
  const win = funRunWindow(f);
  const anyOpen = categories.some((c) => c.registration_status === "open");
  const facts: [string, string | null][] = [
    ["Date", formatDate(manilaDate(f.eventDate), { weekday: "long" })],
    ["Assembly", f.assemblyTime],
    ["Starting point", f.startingPoint],
    ["Destination", f.destination],
  ];

  return (
    <>
      <section className="grain relative overflow-hidden bg-maroon-900 text-ivory-50">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_70%_at_100%_0%,rgba(217,105,43,.18),transparent_60%)]" />
        <div className="container-page relative py-14 sm:py-20">
          <p className="eyebrow text-gold-300">Paskorisyuhan 2026 · Kick-off Event</p>
          <h1 className="mt-4 max-w-3xl text-5xl font-semibold leading-[1.02] text-ivory-50 sm:text-6xl">{f.title}</h1>
          <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-ivory/15 pt-8 md:grid-cols-4">
            {facts.map(([k, v]) => (
              <div key={k}>
                <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-300">{k}</dt>
                <dd className="mt-2 text-[15px] font-medium text-ivory-50">{v ?? <span className="italic text-ivory-200/60">To be announced</span>}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-10 flex flex-col gap-6 rounded-2xl border border-gold-400/25 bg-maroon-950/40 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-md flex-1"><Countdown startMs={win.startMs} endMs={win.endMs} /></div>
            <div className="flex flex-wrap gap-3">
              <Link href="/register" className="btn-gold px-6 py-3">Register Now</Link>
              <Link href="/live" className="btn-ghost-light px-6 py-3">Live Monitoring</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-16 sm:py-20">
        <SectionHeading eyebrow="Race Categories" title="5KM · 8KM · 12KM" intro="Fees, gun times and routes are published by the organizing committee. Counts update automatically from the official registration database." />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {categories.map((c) => <CategoryCard key={c.code} category={c} stats={stats} detailed />)}
        </div>
        {stats.state !== "ok" && (
          <div className="mt-6"><AwaitingNotice title="Participant counts — awaiting database connection">Counts are shown as “—” until the registration database is connected.</AwaitingNotice></div>
        )}
      </section>

      <section id="register" className="scroll-mt-20 border-y border-ivory-300/70 bg-ivory-200/50">
        <div className="container-page grid gap-10 py-16 sm:py-20 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <p className="eyebrow">Registration</p>
            <h2 className="mt-3 text-4xl font-semibold">How to register</h2>
            <dl className="mt-8 space-y-5">
              <div className="flex items-baseline justify-between gap-6 border-b border-ivory-300 pb-4">
                <dt className="text-sm text-ink-mute">Status</dt>
                <dd className="text-right font-semibold text-maroon-900">{anyOpen ? "Open" : "Not yet open"}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-6 border-b border-ivory-300 pb-4">
                <dt className="text-sm text-ink-mute">Deadline</dt>
                <dd className="text-right font-semibold text-maroon-900"><Tba value={f.registrationDeadline} /></dd>
              </div>
            </dl>
            {f.registrationFormUrl ? (
              <a href="/register" className="btn-primary mt-8 px-7 py-3.5 text-base">Open the official registration form ↗</a>
            ) : (
              <div className="mt-8"><AwaitingNotice title="Official registration form link — not yet published">The Register Now button will open the official Google Form as soon as the committee publishes it.</AwaitingNotice></div>
            )}
          </div>
          <div className="grid gap-6">
            <div className="card p-6">
              <h3 className="text-xl font-semibold">Registration instructions</h3>
              <div className="prose-event mt-3 whitespace-pre-line"><Tba value={f.registrationInstructions} /></div>
            </div>
            <div className="card p-6">
              <h3 className="text-xl font-semibold">Payment instructions</h3>
              <div className="prose-event mt-3 whitespace-pre-line"><Tba value={f.paymentInstructions} /></div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page grid gap-12 py-16 sm:py-20 lg:grid-cols-3">
        <div><h2 className="text-2xl font-semibold">Inclusions</h2><div className="rule-gold my-5" /><List items={f.inclusions} empty="Race kit inclusions to be announced." /></div>
        <div><h2 className="text-2xl font-semibold">Guidelines</h2><div className="rule-gold my-5" /><List items={f.guidelines} empty="Race guidelines to be announced." /></div>
        <div><h2 className="text-2xl font-semibold">Important reminders</h2><div className="rule-gold my-5" /><List items={f.reminders} empty="Reminders will be posted before race day." /></div>
      </section>

      <section className="container-page pb-20">
        <div className="card grid gap-6 p-8 md:grid-cols-[1fr_2fr]">
          <h2 className="text-2xl font-semibold">Route information</h2>
          <div className="prose-event whitespace-pre-line"><Tba value={f.routeInfo} label="The official race route will be published by the organizing committee." /></div>
        </div>
      </section>
    </>
  );
}
