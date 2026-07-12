import { auth } from "@/auth";
import { canManageUsers } from "@/lib/permissions";
import { redirect } from "next/navigation";
import Link from "next/link";
import { userRoles } from "@/lib/user-constants";

export default async function NewUserPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (!canManageUsers(session.user.role)) {
    redirect("/");
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/admin/users"
        className="inline-flex items-center gap-2 text-sm font-medium text-sky-400 transition hover:text-sky-300"
      >
        <span aria-hidden="true">←</span>
        Back to users
      </Link>

      <h1 className="mt-6 text-3xl font-bold tracking-tight text-white">
        Create user
      </h1>

      <form className="mt-8 space-y-5 rounded-lg border border-slate-800 bg-slate-900/40 p-6">
        <div className="grid gap-2">
          <label htmlFor="name" className="text-sm font-medium text-slate-200">
            Name
          </label>
          <input
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
            defaultValue=""
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
      </form>
    </main>
  );
}
