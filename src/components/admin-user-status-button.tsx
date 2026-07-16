"use client";
import type { SetUserActiveState } from "@/app/admin/users/[id]/actions";
import { useState, useActionState } from "react";

const initialState: SetUserActiveState = {
  success: false,
  error: null,
};

type SetUserActiveAction = (
  previousState: SetUserActiveState,
  formData: FormData,
) => Promise<SetUserActiveState>;

type StatusUser = {
  id: number;
  name: string;
  isActive: boolean;
};

type AdminUserStatusFormProps = {
  user: StatusUser;
  updateAction: SetUserActiveAction;
  onClose: () => void;
};

type AdminUserStatusButtonProps = {
  user: StatusUser;
  updateAction: SetUserActiveAction;
};

function AdminUserStatusForm({
  user,
  updateAction,
  onClose,
}: AdminUserStatusFormProps) {
  async function handleStatusUpdate(
    previousState: SetUserActiveState,
    formData: FormData,
  ): Promise<SetUserActiveState> {
    const result = await updateAction(previousState, formData);

    if (result.success) {
      onClose();
    }
    return result;
  }

  const [state, formAction, isPending] = useActionState(
    handleStatusUpdate,
    initialState,
  );

  const actionLabel = user.isActive ? "Deactivate account" : "Activate account";
  const pendingLabel = user.isActive ? "Deactivating..." : "Activating...";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 py-4">
      <form
        action={formAction}
        className="max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900 p-6 text-left shadow-xl"
      >
        <input type="hidden" name="userId" value={user.id} />
        <input type="hidden" name="isActive" value={String(!user.isActive)} />
        <h2 className="text-lg font-semibold text-white">{actionLabel}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          Are you sure you want to {user.isActive ? "deactivate" : "activate"}{" "}
          this account?
          <span className="mt-1 block font-medium text-slate-200">
            {user.name}
          </span>
        </p>
        {state.error && (
          <p
            role="alert"
            id="user-status-error"
            className="mt-4 text-sm font-medium text-red-400"
          >
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
            className={`rounded-lg border px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
              user.isActive
                ? "border-red-500/40 bg-red-500/10 text-red-300 hover:bg-red-500/20"
                : "border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
            }`}
          >
            {isPending ? pendingLabel : actionLabel}
          </button>
        </div>
      </form>
    </div>
  );
}

export function AdminUserStatusButton({
  user,
  updateAction,
}: AdminUserStatusButtonProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsConfirmOpen(true)}
        className={`inline-flex items-center justify-center rounded-md border px-3 py-1.5 text-sm font-semibold transition ${
          user.isActive
            ? "border-red-500/40 bg-red-500/10 text-red-300 hover:bg-red-500/20"
            : "border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
        }`}
      >
        {user.isActive ? "Deactivate account" : "Activate account"}
      </button>

      {isConfirmOpen && (
        <AdminUserStatusForm
          user={user}
          updateAction={updateAction}
          onClose={() => setIsConfirmOpen(false)}
        />
      )}
    </>
  );
}
