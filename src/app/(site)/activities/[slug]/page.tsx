import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero, Tba } from "@/components/ui";
import { ACTIVITY_CATALOG, KIND_LABEL } from "@/lib/catalog";
import { getActivity } from "@/lib/data/public";

export const revalidate = 60;
export function generateStaticParams() { return ACTIVITY_CATALOG.map((a) => ({ slug: a.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return { title: ACTIVITY_CATALOG.find((a) => a.slug === slug)?.title ?? "Activity" };
}

export default async function ActivityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blueprint = ACTIVITY_CATALOG.find((a) => a.slug === slug);
  if (!blueprint) notFound();
  const res = await getActivity(slug);
  const db = res.state === "ok" ? res.data : null;
  const details = db?.details ?? {};

  return (
    <>
      <PageHero eyebrow={KIND_LABEL[blueprint.kind]} title={db?.title ?? blueprint.title} intro={db?.tagline ?? blueprint.tagline}>
        {db?.registration_url && <a href={db.registration_url} target="_blank" rel="noopener noreferrer" className="btn-primary mt-8">Register ↗</a>}
      </PageHero>
      <div className="container-page grid gap-10 py-14 lg:grid-cols-[2fr_1fr]">
        <div>
          <h2 className="text-2xl font-semibold">About this activity</h2>
          <div className="prose-event mt-4 whitespace-pre-line"><Tba value={db?.description} label="Full details will be announced by the organizing committee." /></div>
          <div className="mt-12 divide-y divide-ivory-300 border-y border-ivory-300">
            {blueprint.sections.map((s) => (
              <section key={s} className="grid gap-2 py-5 sm:grid-cols-[220px_1fr]">
                <h3 className="font-sans text-sm font-semibold uppercase tracking-wider text-ink-soft">{s}</h3>
                <div className="whitespace-pre-line text-[15px] leading-7 text-ink"><Tba value={details[s] ?? null} label="Not yet posted" /></div>
              </section>
            ))}
          </div>
        </div>
        <aside className="space-y-4">
          <div className="card p-6">
            <p className="eyebrow">Stay updated</p>
            <p className="mt-3 text-sm leading-6 text-ink-soft">Schedules, results and standings are posted here and in Announcements as the tournament progresses.</p>
            <Link href="/announcements" className="btn-ghost mt-5 w-full">Read announcements</Link>
          </div>
          <Link href="/activities" className="block text-sm font-semibold text-evergreen-600">← All activities</Link>
        </aside>
      </div>
    </>
  );
}
