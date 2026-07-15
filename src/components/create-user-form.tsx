"use client";

import { useActionState, useState } from "react";
import {
  createUser,
  type CreateUserState,
} from "@/app/admin/users/new/actions";
import { userRoles } from "@/lib/user-constants";

const initialState: CreateUserState = {
  error: null,
};

export function CreateUserForm() {
  const [state, formAction, isPending] = useActionState(
    createUser,
    initialState,
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  return (
    <form
      action={formAction}
      className="mt-8 space-y-5 rounded-lg border border-slate-800 bg-slate-900/40 p-6"
    >
      <div className="grid gap-2">
        <label htmlFor="name" className="text-sm font-medium text-slate-200">
          Name
        </label>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          type="text"
          id="name"
          name="name"
          required
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
        />
      </div>
      <div className="grid gap-2">
        <label htmlFor="email" className="text-sm font-medium text-slate-200">
          Email
        </label>
        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          type="email"
          id="email"
          name="email"
          required
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
        />
      </div>
      <div className="grid gap-2">
        <label htmlFor="role" className="text-sm font-medium text-slate-200">
          Role
        </label>

        <select
          id="role"
          name="role"
          required
          value={role}
          onChange={(event) => setRole(event.target.value)}
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
        >
          <option value="" disabled>
            Select a role
          </option>
          {userRoles.map((role) => (
            <option key={role} value={role}>
              {role.replaceAll("_", " ")}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-2">
        <label htmlFor="title" className="text-sm font-medium text-slate-200">
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          required
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
        />
      </div>

      <div className="grid gap-2">
        <label
          htmlFor="birthDate"
          className="text-sm font-medium text-slate-200"
        >
          Birth date
        </label>
        <input
          type="date"
          id="birthDate"
          name="birthDate"
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 [&::-webkit-calendar-picker-indicator]:invert"
        />
      </div>

      <div className="grid gap-2">
        <label
          htmlFor="temporaryPassword"
          className="text-sm font-medium text-slate-200"
        >
          Temporary password
        </label>
        <input
          type="password"
          id="temporaryPassword"
          name="temporaryPassword"
          autoComplete="new-password"
          minLength={8}
          required
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
        />
        <p className="text-xs leading-5 text-slate-500">
          The user will be required to change this password after signing in.
        </p>
      </div>
      {state.error && (
        <p
          id="create-user-error"
          role="alert"
          className="text-sm font-medium text-red-400"
        >
          {state.error}
        </p>
      )}
      <div className="flex justify-end border-t border-slate-800 pt-5">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center w-full justify-center sm:w-auto rounded-lg border border-sky-500/40 bg-sky-500/10 px-4 py-2 text-sm font-semibold text-sky-300 transition hover:bg-sky-500/20 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Creating..." : "Create user"}
        </button>
      </div>
    </form>
  );
}
