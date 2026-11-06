import type { Metadata } from "next";
import { PageHero, Pill } from "@/components/ui";
import { getCategories } from "@/lib/data/public";

export const revalidate = 60;
export const metadata: Metadata = { title: "Live Race Monitoring" };

export default async function LivePage() {
  const categories = await getCategories();
  return (
    <>
      <PageHero eyebrow="Race Day · December 5, 2026" title="Live Race Monitoring" intro="Follow every runner checkpoint by checkpoint. Updates come only from official reports submitted by authorized Batch 2010 checkpoint personnel." />
      <div className="container-page py-14">
        <div className="grid gap-5 md:grid-cols-3">
          {categories.map((c) => (
            <div key={c.code} className="card p-6">
              <div className="flex items-center justify-between"><p className="font-display text-3xl font-semibold text-maroon-900">{c.name}</p><Pill>Not started</Pill></div>
              <p className="mt-4 text-sm leading-6 text-ink-soft">The live checkpoint feed for this category activates when the race begins.</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
