"use client";

import type { ResetUserPasswordState } from "@/app/admin/users/[id]/actions";
import { useActionState, useState } from "react";
import { toast } from "sonner";

const initialState: ResetUserPasswordState = {
  success: false,
  error: null,
};

type ResetUserPasswordAction = (
  previousState: ResetUserPasswordState,
  formData: FormData,
) => Promise<ResetUserPasswordState>;

type PasswordResetUser = {
  id: number;
  name: string;
};

type AdminUserPasswordResetButtonProps = {
  user: PasswordResetUser;
  resetAction: ResetUserPasswordAction;
};

type AdminUserPasswordResetFormProps = {
  user: PasswordResetUser;
  resetAction: ResetUserPasswordAction;
  onClose: () => void;
  onSuccess: () => void;
};

function AdminUserPasswordResetForm({
  user,
  resetAction,
  onClose,
  onSuccess,
}: AdminUserPasswordResetFormProps) {
  async function handleReset(
    previousState: ResetUserPasswordState,
    formData: FormData,
  ): Promise<ResetUserPasswordState> {
    const result = await resetAction(previousState, formData);

    if (result.success) {
      onSuccess();
    }
    return result;
  }

  const [state, formAction, isPending] = useActionState(
    handleReset,
    initialState,
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 py-4">
      <form
        action={formAction}
        className="max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900 p-6 text-left shadow-xl"
      >
        <input type="hidden" name="userId" value={user.id} />
        <h2 className="text-lg font-semibold text-white">Reset password</h2>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          Set a temporary password for{" "}
          <span className="font-medium text-slate-200">{user.name}</span>.
        </p>
        <div className="mt-5 grid gap-2">
          <label
            htmlFor="temporary-password"
            className="text-sm font-medium text-slate-200"
          >
            Temporary password
          </label>
          <input
            id="temporary-password"
            name="temporaryPassword"
            type="password"
            minLength={8}
            required
            autoComplete="new-password"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
          />
        </div>

        <div className="mt-4 grid gap-2">
          <label
            htmlFor="confirm-temporary-password"
            className="text-sm font-medium text-slate-200"
          >
            Confirm temporary password
          </label>
          <input
            id="confirm-temporary-password"
            name="confirmPassword"
            type="password"
            minLength={8}
            required
            autoComplete="new-password"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
          />
        </div>
        {state.error && (
          <p role="alert" className="mt-4 text-sm font-medium text-red-400">
            {state.error}
          </p>
        )}

        <div className="mt-5 flex justify-end gap-3 border-t border-slate-800 pt-5">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-slate-500 hover:text-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-300 transition hover:bg-amber-500/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "Resetting..." : "Reset password"}
          </button>
        </div>
      </form>
    </div>
  );
}

export function AdminUserPasswordResetButton({
  user,
  resetAction,
}: AdminUserPasswordResetButtonProps) {
  const [isResetOpen, setIsResetOpen] = useState(false);

  function handleOpen() {
    setIsResetOpen(true);
  }

  function handleSuccess() {
    setIsResetOpen(false);
    toast.success("Password reset successfully.", {
      description: user.name,
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="inline-flex items-center justify-center rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 text-sm font-semibold text-amber-300 transition hover:bg-amber-500/20"
      >
        Reset password
      </button>

      {isResetOpen && (
        <AdminUserPasswordResetForm
          user={user}
          resetAction={resetAction}
          onClose={() => setIsResetOpen(false)}
          onSuccess={handleSuccess}
        />
      )}
    </>
  );
}
