export function Ticker({ items }: { items: string[] }) {
  if (!items.length) return null;
  const loop = [...items, ...items];
  return (
    <div className="relative overflow-hidden bg-maroon-900 text-ivory-50" role="region" aria-label="Urgent updates">
      <div className="container-page flex items-center gap-3 py-2">
        <span className="shrink-0 rounded-full bg-christmas px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest">Update</span>
        <div className="relative min-w-0 flex-1 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_4%,#000_96%,transparent)]">
          <div className="flex w-max animate-ticker gap-12 whitespace-nowrap text-[13px] hover:[animation-play-state:paused]">
            {loop.map((t, i) => <span key={i} aria-hidden={i >= items.length}>{t}</span>)}
          </div>
        </div>
      </div>
    </div>
  );
}
