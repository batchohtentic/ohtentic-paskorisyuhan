"use client";
import { useEffect, useState } from "react";
import { countdownParts, type CountdownParts } from "@/lib/time";

/**
 * Public countdown (display only — NOT the official race clock).
 * Renders nothing time-dependent on the server to avoid hydration mismatch.
 */
export function Countdown({ startMs, endMs, tone = "light" }: { startMs: number; endMs: number; tone?: "light" | "dark" }) {
  const [parts, setParts] = useState<CountdownParts | null>(null);
  useEffect(() => {
    const tick = () => setParts(countdownParts(Date.now(), startMs, endMs));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [startMs, endMs]);

  const num = tone === "light" ? "text-ivory-50" : "text-maroon-900";
  const lab = tone === "light" ? "text-gold-300/90" : "text-gold-600";

  if (parts?.phase === "during") {
    return <p className={`font-display text-3xl font-semibold sm:text-4xl ${num}`} role="status">The Race is On!</p>;
  }
  if (parts?.phase === "after") {
    return <p className={`font-display text-2xl font-semibold sm:text-3xl ${num}`} role="status">Thank You for Running With Us!</p>;
  }
  const cells: [string, number | undefined][] = [
    ["Days", parts?.days], ["Hours", parts?.hours], ["Minutes", parts?.minutes], ["Seconds", parts?.seconds],
  ];
  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-3" role="timer" aria-live="off">
      {cells.map(([label, v], i) => (
        <div key={label} className={`relative text-center ${i > 0 ? "before:absolute before:-left-1 before:top-2 before:h-8 before:w-px before:bg-gold-400/30 sm:before:-left-1.5" : ""}`}>
          <span className={`block font-display text-4xl font-semibold tabular-nums leading-none sm:text-5xl ${num}`}>
            {v === undefined ? "––" : String(v).padStart(2, "0")}
          </span>
          <span className={`mt-2 block text-[10px] font-semibold uppercase tracking-[0.2em] ${lab}`}>{label}</span>
        </div>
      ))}
    </div>
  );
}
