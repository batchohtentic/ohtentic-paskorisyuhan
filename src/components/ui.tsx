import type { ReactNode } from "react";
import { Sparkle } from "./Parol";

export function SectionHeading({ eyebrow, title, intro, align = "left", action }: {
  eyebrow?: string; title: ReactNode; intro?: ReactNode; align?: "left" | "center"; action?: ReactNode;
}) {
  return (
    <div className={`flex flex-col gap-4 ${align === "center" ? "items-center text-center" : "sm:flex-row sm:items-end sm:justify-between"}`}>
      <div className={align === "center" ? "max-w-2xl" : "max-w-2xl"}>
        {eyebrow && <p className="eyebrow flex items-center gap-2"><Sparkle className="h-2.5 w-2.5" />{eyebrow}</p>}
        <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">{title}</h2>
        {intro && <p className="mt-3 text-[15px] leading-7 text-ink-soft">{intro}</p>}
      </div>
      {action}
    </div>
  );
}

export function PageHero({ eyebrow, title, intro, children }: { eyebrow: string; title: ReactNode; intro?: ReactNode; children?: ReactNode }) {
  return (
    <section className="border-b border-ivory-300/70 bg-ivory-50">
      <div className="container-page py-12 sm:py-16">
        <p className="eyebrow flex items-center gap-2"><Sparkle className="h-2.5 w-2.5" />{eyebrow}</p>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-[1.05] sm:text-5xl">{title}</h1>
        {intro && <p className="mt-5 max-w-2xl text-base leading-7 text-ink-soft">{intro}</p>}
        {children}
      </div>
    </section>
  );
}

/** Renders a value or a clearly labelled "To be announced". Never invents data. */
export function Tba({ value, label = "To be announced" }: { value: ReactNode | null | undefined; label?: string }) {
  if (value === null || value === undefined || value === "") return <span className="tba">{label}</span>;
  return <>{value}</>;
}

const PILL_TONES = {
  neutral: "bg-ivory-200 text-ink-soft ring-ivory-300",
  green: "bg-evergreen-50 text-evergreen-700 ring-evergreen-100",
  gold: "bg-gold-100 text-gold-700 ring-gold-200",
  red: "bg-maroon-50 text-christmas ring-maroon-100",
  live: "bg-christmas text-ivory-50 ring-christmas",
} as const;
export function Pill({ tone = "neutral", children }: { tone?: keyof typeof PILL_TONES; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10.5px] font-semibold uppercase tracking-wider ring-1 ring-inset ${PILL_TONES[tone]}`}>
      {tone === "live" && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ivory-50" />}
      {children}
    </span>
  );
}

/** Honest placeholder used when an integration has not been connected yet. */
export function AwaitingNotice({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-gold-300 bg-gold-100/40 px-5 py-4 text-sm text-ink-soft">
      <p className="font-semibold text-gold-700">{title}</p>
      {children && <div className="mt-1 leading-6">{children}</div>}
    </div>
  );
}

export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="card flex flex-col items-center px-6 py-14 text-center">
      <Sparkle className="h-5 w-5 text-gold-400" />
      <p className="mt-4 font-display text-xl text-maroon-900">{title}</p>
      {children && <div className="mt-2 max-w-md text-sm leading-6 text-ink-soft">{children}</div>}
    </div>
  );
}
