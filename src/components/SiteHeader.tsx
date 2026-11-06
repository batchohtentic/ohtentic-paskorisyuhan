"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV } from "@/lib/catalog";
import { Wordmark } from "./Wordmark";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-40 border-b border-ivory-300/70 bg-ivory/90 backdrop-blur supports-[backdrop-filter]:bg-ivory/80">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Wordmark />
        <nav className="hidden items-center gap-0.5 xl:flex" aria-label="Main">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} aria-current={isActive(n.href) ? "page" : undefined}
              className={`relative whitespace-nowrap rounded-full px-3 py-2 text-[13px] font-medium transition-colors ${isActive(n.href) ? "text-maroon-800" : "text-ink-soft hover:text-maroon-800"}`}>
              {n.label}
              {isActive(n.href) && <span className="absolute inset-x-3 -bottom-[1px] h-[2px] rounded-full bg-gold-400" />}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/register" className="btn-primary whitespace-nowrap px-4 py-2 text-[13px] sm:px-5">Register Now</Link>
          <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-controls="mobile-nav"
            className="grid h-10 w-10 place-items-center rounded-full text-maroon-800 hover:bg-maroon-50 xl:hidden" aria-label={open ? "Close menu" : "Open menu"}>
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h10" />}
            </svg>
          </button>
        </div>
      </div>
      {open && (
        <div id="mobile-nav" className="fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto bg-ivory xl:hidden">
          <nav className="container-page flex flex-col py-4" aria-label="Mobile">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} aria-current={isActive(n.href) ? "page" : undefined}
                className={`flex items-center justify-between border-b border-ivory-300 py-4 font-display text-xl ${isActive(n.href) ? "text-christmas" : "text-maroon-900"}`}>
                {n.label}<span className="text-gold-500">→</span>
              </Link>
            ))}
            <Link href="/whats-next" className="flex items-center justify-between border-b border-ivory-300 py-4 font-display text-xl text-maroon-900">
              What&rsquo;s Next?<span className="text-gold-500">→</span>
            </Link>
            <Link href="/register" className="btn-primary mt-6 py-3.5 text-base">Register for the Fun Run</Link>
          </nav>
        </div>
      )}
    </header>
  );
}
