"use client";
import { useActionState } from "react";
import type { FormState } from "./actions";

export function ActionForm({ action, children, submitLabel = "Save changes" }: {
  action: (s: FormState, f: FormData) => Promise<FormState>; children: React.ReactNode; submitLabel?: string;
}) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(action, {});
  return (
    <form action={formAction} className="space-y-5">
      {children}
      <div className="flex flex-wrap items-center gap-4 border-t border-ivory-300 pt-5">
        <button className="btn-primary" disabled={pending}>{pending ? "Saving…" : submitLabel}</button>
        {state.ok && !pending && <p role="status" className="text-sm font-medium text-evergreen-600">✓ {state.ok}</p>}
        {state.error && !pending && <p role="alert" className="text-sm font-medium text-christmas">{state.error}</p>}
      </div>
    </form>
  );
}
