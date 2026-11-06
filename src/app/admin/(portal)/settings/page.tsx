import type { Metadata } from "next";
import { requirePermission } from "@/lib/auth/session";
import { getSettings } from "@/lib/data/settings";
import { getServerClient } from "@/lib/supabase/server";
import type { RaceCategory } from "@/lib/types";
import { saveCategory, saveFunRunSettings, saveSiteSettings } from "./actions";
import { ActionForm } from "./ActionForm";

export const metadata: Metadata = { title: "Website Settings" };

function Field({ label, name, defaultValue, hint, type = "text", textarea, rows = 3, required, placeholder }: {
  label: string; name: string; defaultValue?: string | number | null; hint?: string; type?: string;
  textarea?: boolean; rows?: number; required?: boolean; placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="field-label">{label}{required && <span className="text-christmas"> *</span>}</label>
      {textarea
        ? <textarea id={name} name={name} rows={rows} defaultValue={defaultValue ?? ""} className="field" placeholder={placeholder} />
        : <input id={name} name={name} type={type} defaultValue={defaultValue ?? ""} required={required} className="field" placeholder={placeholder} step={type === "number" ? "0.01" : undefined} />}
      {hint && <p className="mt-1.5 text-xs text-ink-mute">{hint}</p>}
    </div>
  );
}

/** ISO → "YYYY-MM-DDTHH:MM" in Manila time for <input type="datetime-local"> */
function toManilaLocal(iso: string | null) {
  if (!iso) return "";
  return new Date(new Date(iso).getTime() + 8 * 3600_000).toISOString().slice(0, 16);
}

export default async function SettingsPage() {
  await requirePermission("settings.manage");
  const { site, funRun: f } = await getSettings();
  const supabase = (await getServerClient())!;
  const { data: categories } = await supabase.from("race_categories").select("*").order("sort_order");

  return (
    <div className="mx-auto max-w-4xl space-y-10">
      <div>
        <p className="eyebrow">Admin · Website Settings</p>
        <h1 className="mt-2 text-3xl font-semibold">Event information</h1>
        <p className="mt-2 text-sm text-ink-soft">Leave a field empty to show &ldquo;To be announced&rdquo; on the public site. Every save is recorded in the audit log and goes live within a minute.</p>
      </div>

      <section className="card p-6 sm:p-8" id="funrun">
        <h2 className="text-2xl font-semibold">Fun Run &amp; registration</h2>
        <div className="mt-6">
          <ActionForm action={saveFunRunSettings}>
            <Field label="Official Google Form registration link" name="registrationFormUrl" defaultValue={f.registrationFormUrl} type="url"
              placeholder="https://forms.gle/…" hint="Every “Register Now” button on the website opens this link." />
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Event title" name="title" defaultValue={f.title} required />
              <Field label="Event date" name="eventDate" defaultValue={f.eventDate} type="date" required />
              <Field label="Countdown target (start time)" name="startTime" defaultValue={f.startTime} type="time" hint="Philippine time. Empty = counts down to midnight of race day." />
              <Field label="Event end time" name="endTime" defaultValue={f.endTime} type="time" hint="After this, the countdown shows “Thank you for running with us!”. Empty = end of day." />
              <Field label="Assembly time" name="assemblyTime" defaultValue={f.assemblyTime} placeholder="e.g. 4:30 AM" />
              <Field label="Registration deadline" name="registrationDeadline" defaultValue={f.registrationDeadline} placeholder="e.g. November 28, 2026" />
              <Field label="Starting point" name="startingPoint" defaultValue={f.startingPoint} />
              <Field label="Destination / finish" name="destination" defaultValue={f.destination} />
            </div>
            <Field label="Route information" name="routeInfo" defaultValue={f.routeInfo} textarea rows={4} />
            <Field label="Registration instructions" name="registrationInstructions" defaultValue={f.registrationInstructions} textarea rows={4} />
            <Field label="Payment instructions" name="paymentInstructions" defaultValue={f.paymentInstructions} textarea rows={4} />
            <div className="grid gap-5 sm:grid-cols-3">
              <Field label="Inclusions (one per line)" name="inclusions" defaultValue={f.inclusions.join("\n")} textarea rows={6} />
              <Field label="Guidelines (one per line)" name="guidelines" defaultValue={f.guidelines.join("\n")} textarea rows={6} />
              <Field label="Reminders (one per line)" name="reminders" defaultValue={f.reminders.join("\n")} textarea rows={6} />
            </div>
          </ActionForm>
        </div>
      </section>

      <section className="space-y-5" id="categories">
        <h2 className="text-2xl font-semibold">Race categories</h2>
        {(categories as RaceCategory[] | null)?.map((c) => (
          <div key={c.id} className="card p-6 sm:p-8">
            <h3 className="font-display text-xl font-semibold">{c.name}</h3>
            <div className="mt-5">
              <ActionForm action={saveCategory} submitLabel={`Save ${c.name}`}>
                <input type="hidden" name="id" value={c.id} />
                <div className="grid gap-5 sm:grid-cols-3">
                  <Field label="Registration fee (₱)" name="fee_php" type="number" defaultValue={c.fee_php} />
                  <Field label="Gun time (Philippine time)" name="gun_time" type="datetime-local" defaultValue={toManilaLocal(c.gun_time)} />
                  <div>
                    <label htmlFor={`rs-${c.id}`} className="field-label">Registration status</label>
                    <select id={`rs-${c.id}`} name="registration_status" defaultValue={c.registration_status} className="field">
                      <option value="not_open">Not yet open</option><option value="open">Open</option>
                      <option value="closed">Closed</option><option value="full">Slots full</option>
                    </select>
                  </div>
                </div>
                <Field label="Starting point" name="starting_point" defaultValue={c.starting_point} />
                <Field label="Race route" name="route_description" defaultValue={c.route_description} textarea />
              </ActionForm>
            </div>
          </div>
        ))}
        <p className="text-xs text-ink-mute">Live race status (Ready / In progress / Completed) is controlled by the Race Director from Race Timekeeping (Phase 4).</p>
      </section>

      <section className="card p-6 sm:p-8" id="general">
        <h2 className="text-2xl font-semibold">General</h2>
        <div className="mt-6">
          <ActionForm action={saveSiteSettings}>
            <Field label="Official Facebook Page link" name="facebookPageUrl" defaultValue={site.facebookPageUrl} type="url" placeholder="https://www.facebook.com/…" />
            <Field label="Urgent ticker message" name="urgentTicker" defaultValue={site.urgentTicker} hint="Shown in the red bar at the top of every page. Leave empty to hide." />
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Event name" name="eventName" defaultValue={site.eventName} required />
              <Field label="Theme" name="theme" defaultValue={site.theme} required />
              <Field label="Host" name="host" defaultValue={site.host} required />
              <Field label="Location" name="location" defaultValue={site.location} required />
              <Field label="Contact email (public)" name="contactEmail" defaultValue={site.contactEmail} type="email" />
            </div>
          </ActionForm>
        </div>
      </section>
    </div>
  );
}
