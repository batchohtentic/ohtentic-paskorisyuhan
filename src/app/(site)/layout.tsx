import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { Ticker } from "@/components/Ticker";
import { getAnnouncements } from "@/lib/data/public";
import { getSettings } from "@/lib/data/settings";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [{ site }, ann] = await Promise.all([getSettings(), getAnnouncements(10)]);
  const urgent = [
    ...(site.urgentTicker ? [site.urgentTicker] : []),
    ...(ann.state === "ok" ? ann.data.filter((a) => a.priority === "urgent").map((a) => a.title) : []),
  ];
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-maroon-800 focus:px-4 focus:py-2 focus:text-ivory-50">
        Skip to content
      </a>
      <Ticker items={urgent} />
      <SiteHeader />
      <main id="main" className="min-h-[60vh]">{children}</main>
      <SiteFooter site={site} />
    </>
  );
}
