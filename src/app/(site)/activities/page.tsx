import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/ui";
import { ACTIVITY_CATALOG, KIND_LABEL } from "@/lib/catalog";
import { getActivities } from "@/lib/data/public";

export const revalidate = 60;
export const metadata: Metadata = { title: "Activities" };

export default async function ActivitiesPage() {
  const res = await getActivities();
  const fromDb = res.state === "ok" ? new Map(res.data.map((a) => [a.slug, a])) : new Map();
  const groups = (["program", "sport", "esport", "social"] as const).map((k) => ({ kind: k, items: ACTIVITY_CATALOG.filter((a) => a.kind === k) }));

  return (
    <>
      <PageHero eyebrow="Paskorisyuhan 2026" title="Activities" intro="The parade and formal opening, the tournaments, the arena and the socials. Select an activity for announcements, schedules and results." />
      <div className="container-page space-y-14 py-14">
        {groups.map((g) => (
          <section key={g.kind}>
            <h2 className="eyebrow">{KIND_LABEL[g.kind]}</h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {g.items.map((a) => {
                const db = fromDb.get(a.slug);
                return (
                  <Link key={a.slug} href={`/activities/${a.slug}`} className="card group flex flex-col p-6 transition-shadow hover:shadow-lift">
                    <h3 className="text-2xl font-semibold group-hover:text-christmas">{db?.title ?? a.title}</h3>
                    <p className="mt-2 flex-1 text-sm leading-6 text-ink-soft">{db?.tagline ?? a.tagline}</p>
                    <span className="mt-6 text-sm font-semibold text-evergreen-600">View details →</span>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
