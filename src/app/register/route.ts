import { NextResponse } from "next/server";
import { getSettings } from "@/lib/data/settings";
import { env } from "@/lib/env";

/**
 * Every "Register Now" button points here, so the Google Form link only
 * has to be changed in one place (Admin → Website Settings).
 */
export const dynamic = "force-dynamic";

export async function GET() {
  const { funRun } = await getSettings();
  const target = funRun.registrationFormUrl ?? new URL("/fun-run#register", env.siteUrl).toString();
  return NextResponse.redirect(target, { status: 307 });
}
