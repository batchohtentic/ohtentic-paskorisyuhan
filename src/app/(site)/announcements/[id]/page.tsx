import Link from "next/link";
import { notFound } from "next/navigation";
import { ANNOUNCEMENT_CATEGORY_LABEL } from "@/lib/catalog";
import { getAnnouncement } from "@/lib/data/public";
import { formatDateTime } from "@/lib/time";

export const revalidate = 60;

export default async function AnnouncementPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await getAnnouncement(id);
  if (res.state !== "ok" || !res.data) notFound();
  const a = res.data;
  return (
    <article className="container-page max-w-3xl py-14">
      <Link href="/announcements" className="text-sm font-semibold text-evergreen-600">← All announcements</Link>
      <p className="eyebrow mt-8">{ANNOUNCEMENT_CATEGORY_LABEL[a.category]}</p>
      <h1 className="mt-3 text-4xl font-semibold leading-tight sm:text-5xl">{a.title}</h1>
      <p className="mt-4 text-sm text-ink-mute">{formatDateTime(a.published_at)}{a.author_name ? ` · ${a.author_name}` : ""}</p>
      {a.poster_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={a.poster_url} alt={`Poster: ${a.title}`} className="mt-8 w-full rounded-2xl border border-ivory-300" />
      )}
      <div className="prose-event mt-8 whitespace-pre-line text-base">{a.body}</div>
      {a.facebook_post_url && <a href={a.facebook_post_url} target="_blank" rel="noopener noreferrer" className="btn-ghost mt-10">View on Facebook ↗</a>}
    </article>
  );
}
