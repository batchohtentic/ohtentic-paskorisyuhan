import { RACE_STATUS, REGISTRATION_STATUS, peso } from "@/lib/labels";
import { formatTime } from "@/lib/time";
import type { CategoryStats, Loaded, PublicStats, RaceCategory } from "@/lib/types";
import { Pill, Tba } from "./ui";

export function CategoryCard({ category, stats, detailed = false }: {
  category: RaceCategory; stats: Loaded<PublicStats>; detailed?: boolean;
}) {
  const s: CategoryStats | undefined = stats.state === "ok" ? stats.data.per_category.find((c) => c.category_code === category.code) : undefined;
  const reg = REGISTRATION_STATUS[category.registration_status];
  const race = RACE_STATUS[category.race_status];
  const count = (n: number | undefined) =>
    stats.state === "ok" ? <span className="tabular-nums">{n ?? 0}</span> : <span className="text-ink-mute" title="Database not connected">—</span>;

  return (
    <article className="card group relative flex flex-col overflow-hidden transition-shadow hover:shadow-lift">
      <div className="relative bg-maroon-800 px-6 pb-6 pt-5 text-ivory-50">
        <div className="flex items-start justify-between gap-3">
          <Pill tone={reg.tone}>{reg.label}</Pill>
          {category.race_status !== "not_started" && <Pill tone={race.tone}>{race.label}</Pill>}
        </div>
        <p className="mt-6 font-display text-6xl font-semibold leading-none tracking-tight">
          {category.distance_km}<span className="ml-1 text-2xl font-medium text-gold-300">KM</span>
        </p>
        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-gold-500 via-sun to-ember opacity-80" />
      </div>
      <dl className="grid flex-1 grid-cols-2 gap-x-4 gap-y-4 px-6 py-5 text-sm">
        <div className="col-span-2 flex items-baseline justify-between border-b border-ivory-300 pb-4">
          <dt className="text-ink-mute">Registration fee</dt>
          <dd className="font-display text-xl font-semibold text-maroon-900"><Tba value={peso(category.fee_php)} /></dd>
        </div>
        <div><dt className="text-[11px] uppercase tracking-wider text-ink-mute">Registered</dt><dd className="mt-1 font-display text-2xl text-maroon-900">{count(s?.registered)}</dd></div>
        <div><dt className="text-[11px] uppercase tracking-wider text-ink-mute">Confirmed</dt><dd className="mt-1 font-display text-2xl text-evergreen-600">{count(s?.confirmed)}</dd></div>
        <div className="col-span-2"><dt className="text-[11px] uppercase tracking-wider text-ink-mute">Gun time</dt>
          <dd className="mt-1 font-medium text-ink"><Tba value={category.gun_time ? formatTime(category.gun_time) : null} /></dd></div>
        {detailed && (
          <>
            <div className="col-span-2"><dt className="text-[11px] uppercase tracking-wider text-ink-mute">Starting point</dt>
              <dd className="mt-1 text-ink"><Tba value={category.starting_point} /></dd></div>
            <div className="col-span-2"><dt className="text-[11px] uppercase tracking-wider text-ink-mute">Race route</dt>
              <dd className="mt-1 whitespace-pre-line leading-6 text-ink-soft"><Tba value={category.route_description} /></dd></div>
          </>
        )}
      </dl>
    </article>
  );
}
