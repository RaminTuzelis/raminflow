"use client";

import { useActionState, useState } from "react";
import {
  changePassword,
  type ChangePasswordState,
} from "@/app/change-password/actions";

const initialState: ChangePasswordState = {
  error: null,
};

export function ChangePasswordForm() {
  const [state, formAction, isPending] = useActionState(
    changePassword,
    initialState,
  );

  const [hasEditedAfterSubmit, setHasEditedAfterSubmit] = useState(false);

  const showError = Boolean(state.error) && !hasEditedAfterSubmit && !isPending;

  return (
    <form
      onChange={() => setHasEditedAfterSubmit(true)}
      onSubmit={() => setHasEditedAfterSubmit(false)}
      action={formAction}
      className="mt-8 space-y-5 rounded-lg border border-slate-800 bg-slate-900/40 p-6 shadow-sm"
    >
      <div className="grid gap-2">
        <label
          className="text-sm font-medium text-slate-200"
          htmlFor="currentPassword"
        >
          Current password
        </label>
        <input
          aria-describedby={showError ? "change-password-error" : undefined}
          aria-invalid={showError}
          id="currentPassword"
          name="currentPassword"
          type="password"
          autoComplete="current-password"
          required
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 aria-invalid:border-red-500 aria-invalid:focus:border-red-500 aria-invalid:focus:ring-red-500/20"
        />
      </div>

      <div className="grid gap-2">
        <label
          className="text-sm font-medium text-slate-200"
          htmlFor="newPassword"
        >
          New password
        </label>
        <input
          aria-describedby={showError ? "change-password-error" : undefined}
          aria-invalid={showError}
          id="newPassword"
          name="newPassword"
          type="password"
          autoComplete="new-password"
          required
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 aria-invalid:border-red-500 aria-invalid:focus:border-red-500 aria-invalid:focus:ring-red-500/20"
        />
      </div>

      <div className="grid gap-2">
        <label
          className="text-sm font-medium text-slate-200"
          htmlFor="confirmPassword"
        >
          Confirm new password
        </label>
        <input
          aria-describedby={showError ? "change-password-error" : undefined}
          aria-invalid={showError}
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 aria-invalid:border-red-500 aria-invalid:focus:border-red-500 aria-invalid:focus:ring-red-500/20"
        />
      </div>

      <p className="text-xs leading-5 text-slate-500">
        After changing your password, you will be asked to sign in again.
      </p>

      {showError && (
        <p
          id="change-password-error"
          role="alert"
          className="text-sm font-medium text-red-400"
        >
          {state.error}
        </p>
      )}

      <button
        disabled={isPending}
        type="submit"
        className="w-full rounded-lg bg-sky-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Changing..." : "Change password"}
      </button>
    </form>
  );
}
