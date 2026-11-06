"use client";
import { useActionState } from "react";
import { login, type LoginState } from "./actions";

export function LoginForm({ configured }: { configured: boolean }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});
  return (
    <form action={action} className="space-y-5">
      <div>
        <label htmlFor="email" className="field-label">Email</label>
        <input id="email" name="email" type="email" autoComplete="username" required className="field" disabled={!configured} />
      </div>
      <div>
        <label htmlFor="password" className="field-label">Password</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required className="field" disabled={!configured} />
      </div>
      {state.error && <p role="alert" className="rounded-lg bg-maroon-50 px-3 py-2.5 text-sm text-christmas">{state.error}</p>}
      <button type="submit" className="btn-primary w-full py-3" disabled={pending || !configured}>{pending ? "Signing in…" : "Sign in"}</button>
    </form>
  );
}
