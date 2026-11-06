/**
 * Fine-line parol (Filipino Christmas star lantern). Decorative only.
 * Drawn with strokes so it stays elegant at any size.
 */
export function Parol({ className = "", strokeWidth = 1 }: { className?: string; strokeWidth?: number }) {
  const pts = Array.from({ length: 10 }, (_, i) => {
    const r = i % 2 === 0 ? 46 : 19;
    const a = (Math.PI / 5) * i - Math.PI / 2;
    return `${50 + r * Math.cos(a)},${50 + r * Math.sin(a)}`;
  }).join(" ");
  return (
    <svg viewBox="0 0 100 140" className={className} fill="none" stroke="currentColor" strokeWidth={strokeWidth} aria-hidden="true">
      <polygon points={pts} strokeLinejoin="round" />
      <circle cx="50" cy="50" r="12" />
      <circle cx="50" cy="50" r="4" fill="currentColor" stroke="none" />
      {[0, 1, 2, 3, 4].map((i) => {
        const a = (Math.PI / 5) * 2 * i - Math.PI / 2;
        return <line key={i} x1={50 + 12 * Math.cos(a)} y1={50 + 12 * Math.sin(a)} x2={50 + 46 * Math.cos(a)} y2={50 + 46 * Math.sin(a)} opacity=".55" />;
      })}
      <path d="M38 88 q-3 22 -6 46 M50 92 v44 M62 88 q3 22 6 46" opacity=".7" />
    </svg>
  );
}

export function Sparkle({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 0c.6 6.2 5.8 11.4 12 12-6.2.6-11.4 5.8-12 12-.6-6.2-5.8-11.4-12-12C6.2 11.4 11.4 6.2 12 0z" />
    </svg>
  );
}
