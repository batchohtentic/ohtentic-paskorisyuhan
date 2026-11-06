import Link from "next/link";
import { Sparkle } from "./Parol";

export function Wordmark({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const main = tone === "dark" ? "text-maroon-800" : "text-ivory-50";
  const sub = tone === "dark" ? "text-evergreen-600" : "text-gold-300";
  return (
    <Link href="/" className="group inline-flex items-center gap-2.5" aria-label="Oh-TEN-tic! Paskorisyuhan 2026 — Home">
      <span className="relative grid h-9 w-9 place-items-center rounded-full bg-maroon-800 text-gold-300 ring-1 ring-gold-400/50">
        <span className="font-display text-[15px] font-semibold leading-none">10</span>
        <Sparkle className="absolute -right-0.5 -top-0.5 h-3 w-3 text-gold-400" />
      </span>
      <span className="leading-none">
        <span className={`block font-display text-[17px] font-semibold tracking-tight ${main}`}>Oh-TEN-tic!</span>
        <span className={`mt-1 block whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.16em] ${sub}`}>Paskorisyuhan 2026</span>
      </span>
    </Link>
  );
}
