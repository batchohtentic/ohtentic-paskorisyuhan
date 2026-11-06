"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { AdminModule } from "@/lib/admin-modules";
import { CURRENT_PHASE } from "@/lib/admin-modules";

export function AdminNav({ modules }: { modules: AdminModule[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const list = (
    <ul className="space-y-0.5">
      {modules.map((m) => {
        const live = m.phase <= CURRENT_PHASE;
        const active = m.href === "/admin" ? pathname === "/admin" : pathname.startsWith(m.href);
        if (!live) {
          return (
            <li key={m.key} className="flex items-center justify-between rounded-lg px-3 py-2 text-[13px] text-ivory-200/40" title={`Available from Phase ${m.phase}`}>
              {m.label}<span className="rounded bg-white/5 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider">P{m.phase}</span>
            </li>
          );
        }
        return (
          <li key={m.key}>
            <Link href={m.href} onClick={() => setOpen(false)} aria-current={active ? "page" : undefined}
              className={`block rounded-lg px-3 py-2 text-[13px] font-medium ${active ? "bg-gold-400 text-maroon-950" : "text-ivory-100 hover:bg-white/10"}`}>
              {m.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
  return (
    <>
      <button onClick={() => setOpen((v) => !v)} className="btn-ghost-light w-full justify-between lg:hidden" aria-expanded={open}>
        Modules <span>{open ? "▲" : "▼"}</span>
      </button>
      <div className={`${open ? "block" : "hidden"} mt-3 lg:mt-0 lg:block`}>{list}</div>
    </>
  );
}
