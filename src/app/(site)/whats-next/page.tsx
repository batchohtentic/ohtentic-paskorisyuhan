import type { Metadata } from "next";
import { AwaitingNotice, EmptyState, PageHero, Pill, Tba } from "@/components/ui";
import { getUpcoming } from "@/lib/data/public";
import { UPCOMING_STATUS } from "@/lib/labels";

export const revalidate = 60;
export const metadata: Metadata = { title: "What's Next, Oh-TEN-tic?" };

export default async function WhatsNextPage() {
  const res = await getUpcoming();
  return (
    <>
      <PageHero eyebrow="Reserved for the future" title={<>What&rsquo;s Next, <span className="italic text-christmas">Oh-TEN-tic?</span></>} intro="Batch 2010 is just getting started. Upcoming activities are revealed here as they are announced." />
      <div className="container-page py-14">
        {res.state === "unconfigured" && <AwaitingNotice title="Upcoming activities — awaiting database connection" />}
        {res.state === "ok" && res.data.length === 0 && <EmptyState title="Something Oh-TEN-tic is coming">Stay tuned — new activities will be announced soon.</EmptyState>}
        {res.state === "ok" && res.data.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {res.data.map((u) => {
              const st = UPCOMING_STATUS[u.status as keyof typeof UPCOMING_STATUS];
              return (
                <article key={u.id} className="card flex flex-col overflow-hidden">
                  {u.poster_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={u.poster_url} alt="" className="aspect-[4/3] w-full object-cover" />
                  ) : <div className="aspect-[4/3] bg-gradient-to-br from-maroon-800 to-maroon-950" />}
                  <div className="flex flex-1 flex-col p-6">
                    {st && <Pill tone={st.tone}>{st.label}</Pill>}
                    <h2 className="mt-3 text-xl font-semibold">{u.title}</h2>
                    <p className="mt-1 text-sm text-evergreen-600"><Tba value={u.date_label} label="Date TBA" /> · <Tba value={u.venue} label="Venue TBA" /></p>
                    {u.description && <p className="mt-3 flex-1 text-sm leading-6 text-ink-soft">{u.description}</p>}
                    {u.registration_url && u.status === "registration_open" && <a href={u.registration_url} target="_blank" rel="noopener noreferrer" className="btn-primary mt-5">Register ↗</a>}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
