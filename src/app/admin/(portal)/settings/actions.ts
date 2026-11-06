"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { writeAudit } from "@/lib/audit";
import { requirePermission } from "@/lib/auth/session";
import { funRunSettingsSchema, siteSettingsSchema } from "@/lib/settings-schema";
import { getServerClient } from "@/lib/supabase/server";

export type FormState = { ok?: string; error?: string };

const str = (f: FormData, k: string) => {
  const v = f.get(k);
  return typeof v === "string" && v.trim() !== "" ? v.trim() : null;
};
const lines = (f: FormData, k: string) => (str(f, k) ?? "").split("\n").map((l) => l.trim()).filter(Boolean);
const firstIssue = (e: z.ZodError) => { const i = e.issues[0]; return `${i.path.join(".") || "Form"}: ${i.message}`; };

function revalidatePublic() {
  ["/", "/fun-run", "/about", "/schedule", "/announcements", "/activities", "/results", "/live"].forEach((p) => revalidatePath(p));
  revalidatePath("/", "layout");
}

async function saveSetting(key: "site" | "fun_run", value: unknown, staffId: string) {
  const supabase = (await getServerClient())!;
  const { error } = await supabase.from("site_settings").upsert({ key, value, updated_by: staffId });
  if (error) return { error: `Could not save: ${error.message}` };
  await writeAudit(supabase, "settings.update", "site_settings", key, { value });
  revalidatePublic();
  return null;
}

export async function saveSiteSettings(_: FormState, f: FormData): Promise<FormState> {
  const staff = await requirePermission("settings.manage");
  const parsed = siteSettingsSchema.safeParse({
    eventName: str(f, "eventName"), theme: str(f, "theme"), host: str(f, "host"), location: str(f, "location"),
    facebookPageUrl: str(f, "facebookPageUrl"), contactEmail: str(f, "contactEmail"), urgentTicker: str(f, "urgentTicker"),
  });
  if (!parsed.success) return { error: firstIssue(parsed.error) };
  return (await saveSetting("site", parsed.data, staff.userId)) ?? { ok: "General settings saved and published." };
}

export async function saveFunRunSettings(_: FormState, f: FormData): Promise<FormState> {
  const staff = await requirePermission("settings.manage");
  const parsed = funRunSettingsSchema.safeParse({
    title: str(f, "title"), eventDate: str(f, "eventDate"), startTime: str(f, "startTime"), endTime: str(f, "endTime"),
    startingPoint: str(f, "startingPoint"), destination: str(f, "destination"), assemblyTime: str(f, "assemblyTime"),
    routeInfo: str(f, "routeInfo"), registrationFormUrl: str(f, "registrationFormUrl"),
    registrationDeadline: str(f, "registrationDeadline"), registrationInstructions: str(f, "registrationInstructions"),
    paymentInstructions: str(f, "paymentInstructions"),
    inclusions: lines(f, "inclusions"), guidelines: lines(f, "guidelines"), reminders: lines(f, "reminders"),
  });
  if (!parsed.success) return { error: firstIssue(parsed.error) };
  if (parsed.data.startTime && parsed.data.endTime && parsed.data.endTime <= parsed.data.startTime)
    return { error: "Event end time must be after the start time." };
  return (await saveSetting("fun_run", parsed.data, staff.userId)) ?? { ok: "Fun Run information saved and published." };
}

const categorySchema = z.object({
  id: z.string().uuid(),
  fee_php: z.number().min(0).max(100000).nullable(),
  gun_time: z.string().nullable(),
  starting_point: z.string().max(500).nullable(),
  route_description: z.string().max(4000).nullable(),
  registration_status: z.enum(["not_open", "open", "closed", "full"]),
});

export async function saveCategory(_: FormState, f: FormData): Promise<FormState> {
  await requirePermission("settings.manage");
  const fee = str(f, "fee_php");
  const gun = str(f, "gun_time"); // "YYYY-MM-DDTHH:MM" entered in Manila time
  const parsed = categorySchema.safeParse({
    id: str(f, "id"),
    fee_php: fee === null ? null : Number(fee),
    gun_time: gun ? new Date(`${gun}:00+08:00`).toISOString() : null,
    starting_point: str(f, "starting_point"),
    route_description: str(f, "route_description"),
    registration_status: str(f, "registration_status"),
  });
  if (!parsed.success) return { error: firstIssue(parsed.error) };
  if (parsed.data.fee_php !== null && Number.isNaN(parsed.data.fee_php)) return { error: "Fee must be a number." };

  const supabase = (await getServerClient())!;
  const { id, ...values } = parsed.data;
  const { data, error } = await supabase.from("race_categories").update(values).eq("id", id).select("code").maybeSingle();
  if (error) return { error: `Could not save: ${error.message}` };
  if (!data) return { error: "Category not found or you do not have permission." };
  await writeAudit(supabase, "category.update", "race_categories", id, values);
  revalidatePublic();
  return { ok: `${data.code.replace("K", "KM")} category saved.` };
}
