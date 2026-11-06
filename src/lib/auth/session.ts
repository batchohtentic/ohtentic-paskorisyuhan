import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { getServerClient } from "@/lib/supabase/server";
import { can, isRole, type Permission, type Role } from "./roles";

export interface StaffSession {
  userId: string;
  email: string | null;
  displayName: string;
  roles: Role[];
}

/**
 * Returns the signed-in, ACTIVE staff member or null.
 * Roles are read from the database (staff_roles), never from client input.
 */
export const getStaff = cache(async (): Promise<StaffSession | null> => {
  const supabase = await getServerClient();
  if (!supabase) return null;
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return null;

  const [{ data: profile }, { data: roleRows }] = await Promise.all([
    supabase.from("staff_profiles").select("display_name, is_active").eq("user_id", auth.user.id).maybeSingle(),
    supabase.from("staff_roles").select("role").eq("user_id", auth.user.id),
  ]);
  if (!profile?.is_active) return null;

  return {
    userId: auth.user.id,
    email: auth.user.email ?? null,
    displayName: profile.display_name,
    roles: (roleRows ?? []).map((r) => r.role as string).filter(isRole),
  };
});

/** Use at the top of every admin page / server action. */
export async function requirePermission(permission: Permission): Promise<StaffSession> {
  const staff = await getStaff();
  if (!staff) redirect("/admin/login");
  if (!can(staff.roles, permission)) redirect("/admin?denied=" + encodeURIComponent(permission));
  return staff;
}
