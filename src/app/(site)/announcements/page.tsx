import type { Metadata } from "next";
import Link from "next/link";
import { AnnouncementCard } from "@/components/AnnouncementCard";
import { AwaitingNotice, EmptyState, PageHero } from "@/components/ui";
import { ANNOUNCEMENT_CATEGORY_LABEL } from "@/lib/catalog";
import { getAnnouncements } from "@/lib/data/public";
import type { AnnouncementCategory } from "@/lib/types";

export const revalidate = 60;
export const metadata: Metadata = { title: "Announcements" };

export default async function AnnouncementsPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  const res = await getAnnouncements(100);
  const active = category && category in ANNOUNCEMENT_CATEGORY_LABEL ? (category as AnnouncementCategory) : null;
  const items = res.state === "ok" ? res.data.filter((a) => !active || a.category === active) : [];

  return (
    <>
      <PageHero eyebrow="Announcement Center" title="Announcements & Updates" intro="Official updates from the Batch 2010 organizing committee." />
      <div className="container-page py-12">
        <nav className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2" aria-label="Filter by category">
          <Link href="/announcements" className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium ${!active ? "bg-maroon-800 text-ivory-50" : "bg-ivory-200 text-ink-soft hover:bg-ivory-300"}`}>All</Link>
          {Object.entries(ANNOUNCEMENT_CATEGORY_LABEL).map(([k, v]) => (
            <Link key={k} href={`/announcements?category=${k}`} className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium ${active === k ? "bg-maroon-800 text-ivory-50" : "bg-ivory-200 text-ink-soft hover:bg-ivory-300"}`}>{v}</Link>
          ))}
        </nav>
        <div className="mt-8">
          {res.state === "unconfigured" && <AwaitingNotice title="Announcements — awaiting database connection" />}
          {res.state === "error" && <AwaitingNotice title="Announcements are temporarily unavailable" />}
          {res.state === "ok" && items.length === 0 && <EmptyState title="No announcements in this category yet" />}
          {items.length > 0 && <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{items.map((a) => <AnnouncementCard key={a.id} a={a} />)}</div>}
        </div>
      </div>
    </>
  );
}
