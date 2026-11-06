import type { Metadata } from "next";
import Link from "next/link";
import { EmptyState, PageHero, Pill } from "@/components/ui";
import { getCategories } from "@/lib/data/public";

export const revalidate = 60;
export const metadata: Metadata = { title: "Results & Winners" };

export default async function ResultsPage() {
  const categories = await getCategories();
  return (
    <>
      <PageHero eyebrow="Results & Winners" title="Celebrating our champions" intro="Fun Run leaderboards and tournament champions. Provisional results are always labelled; only results approved by the Results Administrator are marked Official." />
      <div className="container-page space-y-10 py-14">
        <section>
          <h2 className="text-2xl font-semibold">Oh-TEN-tic! Fun Run</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {categories.map((c) => (
              <div key={c.code} className="card p-6">
                <div className="flex items-center justify-between"><p className="font-display text-3xl font-semibold text-maroon-900">{c.name}</p><Pill>Awaiting race day</Pill></div>
                <p className="mt-4 text-sm leading-6 text-ink-soft">The leaderboard opens when the first verified finisher crosses the line on December 5.</p>
              </div>
            ))}
          </div>
        </section>
        <EmptyState title="Tournament results will appear here">
          Basketball, Volleyball, Pickleball and Mobile Legends champions are published once each tournament concludes. <Link className="font-semibold text-evergreen-600" href="/activities">See activities →</Link>
        </EmptyState>
      </div>
    </>
  );
}
