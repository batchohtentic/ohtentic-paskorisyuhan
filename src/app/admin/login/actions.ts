"use server";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getServerClient } from "@/lib/supabase/server";

const schema = z.object({ email: z.string().trim().email(), password: z.string().min(6).max(200) });

export type LoginState = { error?: string };

export async function login(_: LoginState, form: FormData): Promise<LoginState> {
  const supabase = await getServerClient();
  if (!supabase) return { error: "The admin portal is not connected to the database yet. See docs/SETUP.md." };
  const parsed = schema.safeParse({ email: form.get("email"), password: form.get("password") });
  if (!parsed.success) return { error: "Enter a valid email and password." };

  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);
  // Same message for wrong email or wrong password — don't reveal which accounts exist.
  if (error || !data.user) return { error: "Incorrect email or password." };

  const { data: profile } = await supabase.from("staff_profiles").select("is_active").eq("user_id", data.user.id).maybeSingle();
  if (!profile?.is_active) {
    await supabase.auth.signOut();
    return { error: "This account is not an active Batch 2010 staff account. Contact the Super Administrator." };
  }
  await supabase.rpc("log_audit", { p_action: "auth.login", p_entity: "staff", p_entity_id: data.user.id, p_details: {} });
  redirect("/admin");
}

export async function logout() {
  const supabase = await getServerClient();
  if (supabase) {
    await supabase.rpc("log_audit", { p_action: "auth.logout", p_entity: "staff", p_entity_id: null, p_details: {} });
    await supabase.auth.signOut();
  }
  redirect("/admin/login");
}
