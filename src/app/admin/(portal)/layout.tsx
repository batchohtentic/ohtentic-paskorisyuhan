import Link from "next/link";
import { redirect } from "next/navigation";
import { Wordmark } from "@/components/Wordmark";
import { ADMIN_MODULES } from "@/lib/admin-modules";
import { can, ROLE_LABELS } from "@/lib/auth/roles";
import { getStaff } from "@/lib/auth/session";
import { logout } from "../login/actions";
import { AdminNav } from "./AdminNav";

export const dynamic = "force-dynamic";

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const staff = await getStaff();
  if (!staff) redirect("/admin/login");
  const modules = ADMIN_MODULES.filter((m) => can(staff.roles, m.permission));

  return (
    <div className="min-h-screen bg-ivory-100 lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="bg-maroon-950 px-4 py-5 text-ivory-50 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto">
        <div className="flex items-center justify-between lg:block">
          <Wordmark tone="light" />
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-300 lg:mt-3">Admin Portal</p>
        </div>
        <div className="mt-5"><AdminNav modules={modules} /></div>
      </aside>
      <div className="min-w-0">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-ivory-300 bg-ivory-50 px-4 py-3 sm:px-8">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-maroon-900">{staff.displayName}</p>
            <p className="truncate text-xs text-ink-mute">{staff.roles.map((r) => ROLE_LABELS[r]).join(" · ") || "No role assigned"}</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/" className="btn-ghost px-3 py-1.5 text-xs" target="_blank">View site ↗</Link>
            <form action={logout}><button className="btn-ghost px-3 py-1.5 text-xs">Sign out</button></form>
          </div>
        </header>
        <main className="px-4 py-8 sm:px-8">{children}</main>
      </div>
    </div>
  );
}
