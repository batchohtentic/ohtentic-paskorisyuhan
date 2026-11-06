import Link from "next/link";
import { ANNOUNCEMENT_CATEGORY_LABEL } from "@/lib/catalog";
import { formatDate } from "@/lib/time";
import type { Announcement } from "@/lib/types";
import { Pill } from "./ui";

export function AnnouncementCard({ a }: { a: Announcement }) {
  return (
    <Link href={`/announcements/${a.id}`} className="card group flex h-full flex-col p-6 transition-shadow hover:shadow-lift">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-evergreen-600">{ANNOUNCEMENT_CATEGORY_LABEL[a.category]}</span>
        {a.priority === "urgent" && <Pill tone="red">Urgent</Pill>}
        {a.priority === "important" && <Pill tone="gold">Important</Pill>}
        {a.is_pinned && <Pill>Pinned</Pill>}
      </div>
      <h3 className="mt-3 text-xl font-semibold leading-snug group-hover:text-christmas">{a.title}</h3>
      <p className="mt-2 line-clamp-3 flex-1 text-sm leading-6 text-ink-soft">{a.body}</p>
      <p className="mt-5 text-xs text-ink-mute">{formatDate(a.published_at)}{a.author_name ? ` · ${a.author_name}` : ""}</p>
    </Link>
  );
}
