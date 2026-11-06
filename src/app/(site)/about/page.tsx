import type { Metadata } from "next";
import { Parol } from "@/components/Parol";
import { PageHero } from "@/components/ui";
import { getSettings } from "@/lib/data/settings";

export const revalidate = 300;
export const metadata: Metadata = { title: "About Us" };

export default async function AboutPage() {
  const { site } = await getSettings();
  return (
    <>
      <PageHero eyebrow="About Us" title={<>Batch 2010 &mdash; <span className="italic text-christmas">Oh-TEN-tic!</span></>} intro={`Proud hosts of ${site.eventName}.`} />
      <div className="container-page grid gap-12 py-14 lg:grid-cols-[1.4fr_1fr]">
        <div className="prose-event text-base">
          <p>The <strong className="text-maroon-900">{site.eventName}</strong> brings together alumni of every batch for a season of homecoming in {site.location}.</p>
          <p>This year&rsquo;s celebration is hosted by the {site.host}, under the theme <em>&ldquo;{site.theme}&rdquo;</em>. The season opens with the Oh-TEN-tic! Fun Run for Everyone, followed by the parade and formal opening, sports tournaments, Laro ng Lahi, bingo socials and the Raffle Bonanza.</p>
          <p>This website is the official digital headquarters of Batch 2010 for every Paskorisyuhan 2026 activity.</p>
        </div>
        <div className="card relative overflow-hidden bg-evergreen-800 p-8 text-ivory-50">
          <Parol className="absolute -right-4 -top-6 h-48 w-36 text-gold-400/20" />
          <p className="eyebrow text-gold-300">Get in touch</p>
          <p className="mt-4 text-sm leading-6 text-ivory-200/85">For questions about registration or the program, message the official Batch 2010 Facebook Page.</p>
          {site.facebookPageUrl ? <a href={site.facebookPageUrl} target="_blank" rel="noopener noreferrer" className="btn-gold mt-6">Message us on Facebook ↗</a> : <p className="mt-6 text-xs text-ivory-200/60">Facebook Page link — awaiting configuration.</p>}
          {site.contactEmail && <p className="mt-4 text-sm">{site.contactEmail}</p>}
        </div>
      </div>
    </>
  );
}
