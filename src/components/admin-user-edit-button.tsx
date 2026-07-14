"use client";

import { useActionState, useState } from "react";
import type { UserRole } from "@/types/user";
import { userRoles } from "@/lib/user-constants";
import type { UpdateUserState } from "@/app/admin/users/[id]/actions";

const initialState: UpdateUserState = {
  success: false,
  error: null,
};

type EditableUser = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  title: string;
  birthDate: string | null;
};

type UpdateUserAction = (
  previousState: UpdateUserState,
  formData: FormData,
) => Promise<UpdateUserState>;

type AdminUserEditFormProps = {
  user: EditableUser;
  updateAction: UpdateUserAction;
  onClose: () => void;
};

type AdminUserEditButtonProps = {
  user: EditableUser;
  updateAction: UpdateUserAction;
};

function AdminUserEditForm({
  user,
  updateAction,
  onClose,
}: AdminUserEditFormProps) {
  async function handleUpdate(
    previousState: UpdateUserState,
    formData: FormData,
  ): Promise<UpdateUserState> {
    const result = await updateAction(previousState, formData);

    if (result.success) {
      onClose();
    }

    return result;
  }

  const [state, formAction, isPending] = useActionState(
    handleUpdate,
    initialState,
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 py-4">
      <div className="max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900 p-6 text-left shadow-xl">
        <h2 className="text-lg font-semibold text-white">Edit {user.name}</h2>
        <form action={formAction} className="mt-5 space-y-4">
          <input type="hidden" name="userId" value={user.id} />
          <div className="grid gap-2">
            <label
              htmlFor="edit-user-name"
              className="text-sm font-medium text-slate-200"
            >
              Name
            </label>
            <input
              type="text"
              id="edit-user-name"
              name="name"
              required
              defaultValue={user.name}
              autoComplete="name"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
            />
          </div>

          <div className="grid gap-2">
            <label
              htmlFor="edit-user-email"
              className="text-sm font-medium text-slate-200"
            >
              Email
            </label>
            <input
              type="email"
              id="edit-user-email"
              name="email"
              required
              defaultValue={user.email}
              autoComplete="email"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
            />
          </div>

          <div className="grid gap-2">
            <label
              htmlFor="edit-user-role"
              className="text-sm font-medium text-slate-200"
            >
              Role
            </label>

            <select
              id="edit-user-role"
              name="role"
              required
              defaultValue={user.role}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
            >
              {userRoles.map((role) => (
                <option key={role} value={role}>
                  {role.replaceAll("_", " ")}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-2">
            <label
              htmlFor="edit-user-title"
              className="text-sm font-medium text-slate-200"
            >
              Title
            </label>
            <input
              type="text"
              id="edit-user-title"
              name="title"
              autoComplete="organization-title"
              required
              defaultValue={user.title}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
            />
          </div>

          <div className="grid gap-2">
            <label
              htmlFor="edit-user-birth-date"
              className="text-sm font-medium text-slate-200"
            >
              Birth date
            </label>
            <input
              type="date"
              id="edit-user-birth-date"
              name="birthDate"
              defaultValue={user.birthDate ?? ""}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 [&::-webkit-calendar-picker-indicator]:invert"
            />
          </div>

          {state.error && (
            <p
              id="save-error"
              role="alert"
              className="text-sm font-medium text-red-400"
            >
              {state.error}
            </p>
          )}

          <div className="mt-5 flex justify-end gap-3 border-t border-slate-800 pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-slate-500 hover:text-slate-100"
            >
              Cancel
            </button>
            <button
              disabled={isPending}
              type="submit"
              className="rounded-lg border border-sky-500/40 bg-sky-500/10 px-4 py-2 text-sm font-semibold text-sky-300 transition hover:bg-sky-500/20"
            >
              {isPending ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function AdminUserEditButton({
  user,
  updateAction,
}: AdminUserEditButtonProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsEditOpen(true)}
        className="inline-flex items-center justify-center rounded-md border border-sky-500/40 bg-sky-500/10 px-3 py-1.5 text-sm font-semibold text-sky-300 transition hover:bg-sky-500/20"
      >
        Edit user
      </button>

      {isEditOpen && (
        <AdminUserEditForm
          user={user}
          updateAction={updateAction}
          onClose={() => setIsEditOpen(false)}
        />
      )}
    </>
  );
}
