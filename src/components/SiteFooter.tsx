import Link from "next/link";
import { NAV } from "@/lib/catalog";
import type { SiteSettings } from "@/lib/settings-schema";
import { Parol } from "./Parol";
import { Wordmark } from "./Wordmark";

export function SiteFooter({ site }: { site: SiteSettings }) {
  return (
    <footer className="grain relative overflow-hidden bg-evergreen-900 text-ivory-200">
      <Parol className="pointer-events-none absolute -right-6 -top-4 h-56 w-40 text-gold-400/15" />
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Wordmark tone="light" />
          <p className="mt-5 max-w-sm text-sm leading-6 text-ivory-200/80">
            {site.eventName} — &ldquo;{site.theme}&rdquo; Hosted by {site.host}, {site.location}.
          </p>
          {site.facebookPageUrl ? (
            <a href={site.facebookPageUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost-light mt-6 text-[13px]">
              Follow us on Facebook ↗
            </a>
          ) : (
            <p className="mt-6 text-xs text-ivory-200/50">Official Facebook Page link — awaiting configuration.</p>
          )}
        </div>
        <div>
          <p className="eyebrow text-gold-300">Explore</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            {NAV.map((n) => <li key={n.href}><Link className="hover:text-gold-300" href={n.href}>{n.label}</Link></li>)}
          </ul>
        </div>
        <div>
          <p className="eyebrow text-gold-300">Participate</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link className="hover:text-gold-300" href="/register">Register for the Fun Run</Link></li>
            <li><Link className="hover:text-gold-300" href="/live">Live Race Monitoring</Link></li>
            <li><Link className="hover:text-gold-300" href="/whats-next">What&rsquo;s Next, Oh-TEN-tic?</Link></li>
            <li><Link className="hover:text-gold-300" href="/admin/login">Batch 2010 Admin Login</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-ivory/10">
        <div className="container-page flex flex-col gap-2 py-5 text-xs text-ivory-200/55 sm:flex-row sm:justify-between">
          <p>© 2026 CCES Alumni Association – Batch 2010 &ldquo;Oh-TEN-tic!&rdquo;</p>
          <p>All event times are Philippine Standard Time (UTC+8).</p>
        </div>
      </div>
    </footer>
  );
}
