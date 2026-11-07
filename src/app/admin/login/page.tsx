import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Parol } from "@/components/Parol";
import { Wordmark } from "@/components/Wordmark";
import { AwaitingNotice } from "@/components/ui";
import { getStaff } from "@/lib/auth/session";
import { env, isSupabaseConfigured } from "@/lib/env";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Admin Login", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (await getStaff()) redirect("/admin");
  const configured = isSupabaseConfigured();
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="grain relative hidden overflow-hidden bg-maroon-900 lg:block">
        <Parol className="absolute left-1/2 top-1/2 h-[420px] w-[300px] -translate-x-1/2 -translate-y-1/2 text-gold-400/25" strokeWidth={0.6} />
        <div className="absolute bottom-10 left-10 right-10 text-ivory-50">
          <p className="eyebrow text-gold-300">Batch 2010 Operations</p>
          <p className="mt-3 max-w-sm font-display text-3xl leading-tight">The command center of Paskorisyuhan 2026.</p>
        </div>
      </div>
      <div className="flex flex-col justify-center px-6 py-12 sm:px-12">
        <div className="mx-auto w-full max-w-sm">
          <Wordmark />
          <h1 className="mt-10 text-3xl font-semibold">Admin sign in</h1>
          <p className="mt-2 text-sm text-ink-soft">For authorized Batch 2010 staff only. All sign-ins are logged.</p>
          {!configured && (
            <div className="mt-6">
              <AwaitingNotice title={env.supabaseProblem ? "Supabase setting needs fixing" : "Authentication — awaiting configuration"}>
                {env.supabaseProblem
                  ? <>{env.supabaseProblem} Then open Vercel → Deployments → ⋯ → Redeploy.</>
                  : <>Add the Supabase settings in Vercel (see docs/SETUP.md) to enable staff sign-in.</>}
              </AwaitingNotice>
            </div>
          )}
          <div className="mt-8"><LoginForm configured={configured} /></div>
          <Link href="/" className="mt-10 inline-block text-sm text-ink-mute hover:text-maroon-800">← Back to public website</Link>
        </div>
      </div>
    </div>
  );
}
