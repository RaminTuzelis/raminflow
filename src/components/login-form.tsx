"use client";

import { useActionState, useState } from "react";
import { loginUser, type LoginState } from "@/app/login/actions";

const initialState: LoginState = {
  error: null,
};

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [state, formAction, isPending] = useActionState(
    loginUser,
    initialState,
  );

  return (
    <form
      action={formAction}
      className="mt-8 space-y-5 rounded-lg border border-slate-800 bg-slate-900/40 p-6 shadow-sm"
    >
      <div className="grid gap-2">
        <label className="text-sm font-medium text-slate-200" htmlFor="email">
          Email
        </label>
        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          aria-invalid={Boolean(state.error)}
          aria-describedby={state.error ? "login-error" : undefined}
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 aria-invalid:border-red-500 aria-invalid:focus:border-red-500 aria-invalid:focus:ring-red-500/20"
        />
      </div>
      <div className="grid gap-2">
        <label
          className="text-sm font-medium text-slate-200"
          htmlFor="password"
        >
          Password
        </label>
        <input
          aria-invalid={Boolean(state.error)}
          aria-describedby={state.error ? "login-error" : undefined}
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 aria-invalid:border-red-500 aria-invalid:focus:border-red-500 aria-invalid:focus:ring-red-500/20"
        />
      </div>
      {state.error && (
        <p
          id="login-error"
          role="alert"
          className="text-sm font-medium text-red-400"
        >
          {state.error}
        </p>
      )}

      <button
        disabled={isPending}
        type="submit"
        className="disabled:cursor-not-allowed disabled:opacity-60 w-full rounded-lg bg-sky-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
      >
        {isPending ? "Signing in..." : "Login"}
      </button>
    </form>
  );
}
