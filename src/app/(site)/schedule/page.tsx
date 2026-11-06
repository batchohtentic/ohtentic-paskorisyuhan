import type { Metadata } from "next";
import { AwaitingNotice, EmptyState, PageHero, Pill, Tba } from "@/components/ui";
import { getSchedule } from "@/lib/data/public";
import { EVENT_STATUS } from "@/lib/labels";
import { formatDate, formatTime } from "@/lib/time";

export const revalidate = 60;
export const metadata: Metadata = { title: "Event Schedule" };

export default async function SchedulePage() {
  const res = await getSchedule();
  return (
    <>
      <PageHero eyebrow="Master Program" title="Event Schedule" intro="The official Paskorisyuhan 2026 calendar. All times are Philippine Standard Time." />
      <div className="container-page py-14">
        {res.state === "unconfigured" && <AwaitingNotice title="Schedule — awaiting database connection">The master program will appear here once the website database is connected.</AwaitingNotice>}
        {res.state === "error" && <AwaitingNotice title="The schedule is temporarily unavailable">Please refresh in a moment.</AwaitingNotice>}
        {res.state === "ok" && res.data.length === 0 && <EmptyState title="The program is being finalized">Schedules will be published here by the organizing committee.</EmptyState>}
        {res.state === "ok" && res.data.length > 0 && (
          <ol className="relative space-y-5 border-l border-gold-300 pl-6 sm:pl-10">
            {res.data.map((e) => {
              const st = EVENT_STATUS[e.status];
              return (
                <li key={e.id} className="relative">
                  <span className="absolute -left-[31px] top-7 h-3 w-3 rounded-full border-2 border-ivory bg-gold-400 ring-1 ring-gold-400 sm:-left-[47px]" />
                  <article className="card grid gap-4 p-6 sm:grid-cols-[180px_1fr]">
                    <div>
                      <p className="font-display text-lg font-semibold text-maroon-900">{e.starts_at ? formatDate(e.starts_at, { month: "short" }) : <Tba value={e.date_label} label="Date TBA" />}</p>
                      <p className="mt-1 text-sm text-ink-mute">{e.starts_at ? formatTime(e.starts_at) + (e.ends_at ? ` – ${formatTime(e.ends_at)}` : "") : "Time TBA"}</p>
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-3"><h2 className="text-xl font-semibold">{e.title}</h2><Pill tone={st.tone}>{st.label}</Pill></div>
                      <p className="mt-1 text-sm text-evergreen-600"><Tba value={e.venue} label="Venue TBA" /></p>
                      {e.description && <p className="mt-3 text-sm leading-6 text-ink-soft">{e.description}</p>}
                    </div>
                  </article>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </>
  );
}
