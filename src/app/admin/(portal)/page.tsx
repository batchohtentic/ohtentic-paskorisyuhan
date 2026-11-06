import Link from "next/link";
import { ADMIN_MODULES, CURRENT_PHASE } from "@/lib/admin-modules";
import { can, type Role } from "@/lib/auth/roles";
import { redirect } from "next/navigation";
import { getStaff } from "@/lib/auth/session";
import { isFacebookConfigured, isGoogleSheetsConfigured, isServiceRoleConfigured, isSupabaseConfigured } from "@/lib/env";
import { getServerClient } from "@/lib/supabase/server";

function Stat({ label, value, note }: { label: string; value: number | string | null; note?: string }) {
  return (
    <div className="card p-5">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-mute">{label}</p>
      <p className="mt-2 font-display text-3xl font-semibold tabular-nums text-maroon-900">{value ?? "—"}</p>
      {note && <p className="mt-1 text-xs text-ink-mute">{note}</p>}
    </div>
  );
}

function Integration({ name, ok, detail }: { name: string; ok: boolean; detail: string }) {
  return (
    <li className="flex items-start justify-between gap-4 py-3">
      <div><p className="text-sm font-semibold text-ink">{name}</p><p className="text-xs text-ink-mute">{detail}</p></div>
      <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${ok ? "bg-evergreen-50 text-evergreen-700" : "bg-gold-100 text-gold-700"}`}>
        {ok ? "Connected" : "Awaiting configuration"}
      </span>
    </li>
  );
}

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ denied?: string }> }) {
  const staff = await getStaff();
  if (!staff) redirect("/admin/login");
  const { denied } = await searchParams;
  const roles: Role[] = staff.roles;
  if (!can(roles, "dashboard.view")) {
    // e.g. Checkpoint Personnel: no statistics, just their assigned modules.
    return (
      <div className="mx-auto max-w-xl">
        {denied && <p className="mb-6 rounded-lg bg-maroon-50 px-4 py-3 text-sm text-christmas">Your role does not have access to that module.</p>}
        <h1 className="text-3xl font-semibold">Welcome, {staff.displayName}</h1>
        <p className="mt-3 text-sm leading-6 text-ink-soft">Use the menu to open the modules assigned to your role. Race-day tools become available as each phase is completed.</p>
      </div>
    );
  }
  const supabase = (await getServerClient())!;

  const [regStats, pending, published] = await Promise.all([
    supabase.rpc("public_registration_stats"),
    can(roles, "registrations.view_private")
      ? supabase.from("participant_private").select("participant_id", { count: "exact", head: true }).eq("payment_status", "pending")
      : Promise.resolve({ count: null }),
    supabase.from("announcements").select("id", { count: "exact", head: true }).eq("state", "published"),
  ]);
  const r = regStats.data as { total_registered: number; total_confirmed: number; per_category: { category_code: string; registered: number; confirmed: number }[] } | null;

  return (
    <div className="mx-auto max-w-6xl">
      {denied && <p className="mb-6 rounded-lg bg-maroon-50 px-4 py-3 text-sm text-christmas">Your role does not have access to that module.</p>}
      <p className="eyebrow">Phase {CURRENT_PHASE} of 8</p>
      <h1 className="mt-2 text-3xl font-semibold">Dashboard</h1>

      <section className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Total registrants" value={r?.total_registered ?? null} />
        <Stat label="Confirmed" value={r?.total_confirmed ?? null} />
        <Stat label="Pending payments" value={pending.count ?? null} note={can(roles, "registrations.view_private") ? undefined : "Restricted to registration admins"} />
        <Stat label="Published announcements" value={published.count ?? null} />
        {(r?.per_category ?? []).map((c) => (
          <Stat key={c.category_code} label={`${c.category_code.replace("K", "KM")} category`} value={c.registered} note={`${c.confirmed} confirmed`} />
        ))}
      </section>
      {r && r.total_registered === 0 && (
        <p className="mt-3 text-xs text-ink-mute">No participants yet. Registrations will populate automatically once Google Sheets sync is connected (Phase 2).</p>
      )}

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <section className="card p-6">
          <h2 className="text-xl font-semibold">Integrations</h2>
          <ul className="mt-3 divide-y divide-ivory-300">
            <Integration name="Supabase database & login" ok={isSupabaseConfigured()} detail="Database, authentication, realtime, file storage" />
            <Integration name="Supabase service key (server)" ok={isServiceRoleConfigured()} detail="Required for background registration sync" />
            <Integration name="Google Sheets registration sync" ok={isGoogleSheetsConfigured()} detail="Phase 2 — official registration spreadsheet" />
            <Integration name="Facebook Page publishing" ok={isFacebookConfigured()} detail="Phase 6 — Meta Graph API" />
          </ul>
        </section>
        <section className="card p-6">
          <h2 className="text-xl font-semibold">Build roadmap</h2>
          <ol className="mt-3 space-y-2 text-sm">
            {[
              "Foundation & public website", "Registration & Google Sheets", "Checkpoint & runner monitoring", "Race clock & finish line",
              "Sports & Paskorisyuhan management", "Facebook integration", "Gallery, results & awarding", "Testing, security & deployment",
            ].map((t, i) => (
              <li key={t} className="flex items-center gap-3">
                <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-bold ${i + 1 < CURRENT_PHASE ? "bg-evergreen-500 text-white" : i + 1 === CURRENT_PHASE ? "bg-gold-400 text-maroon-950" : "bg-ivory-200 text-ink-mute"}`}>{i + 1}</span>
                <span className={i + 1 === CURRENT_PHASE ? "font-semibold text-maroon-900" : "text-ink-soft"}>{t}</span>
              </li>
            ))}
          </ol>
          {can(roles, "settings.manage") && <Link href="/admin/settings" className="btn-primary mt-6">Edit event information →</Link>}
        </section>
      </div>
      <p className="mt-8 text-xs text-ink-mute">{ADMIN_MODULES.filter((m) => m.phase > CURRENT_PHASE).length} modules unlock in later phases.</p>
    </div>
  );
}
