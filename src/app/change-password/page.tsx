import { getCurrentUser } from "@/lib/current-user";
import { redirect } from "next/navigation";
import { changePassword } from "@/app/change-password/actions";
import Link from "next/link";

export default async function ChangePasswordPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  const isRequiredPasswordChange = currentUser.mustChangePassword;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-4 py-8">
      {!isRequiredPasswordChange && (
        <Link
          href="/account"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-sky-400 transition hover:text-sky-300"
        >
          <span aria-hidden="true">←</span>
          Back to account
        </Link>
      )}
      <p className="text-sm font-medium uppercase tracking-wider text-slate-500">
        RaminFlow
      </p>

      <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">
        Change password
      </h1>

      <p className="mt-3 text-sm leading-6 text-slate-400">
        {isRequiredPasswordChange
          ? "You need to change your temporary password before using RaminFlow."
          : "Update your password to keep your account secure."}
      </p>

      <form
        action={changePassword}
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
            id="currentPassword"
            name="currentPassword"
            type="password"
            autoComplete="current-password"
            required
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
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
            id="newPassword"
            name="newPassword"
            type="password"
            autoComplete="new-password"
            required
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
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
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
          />
        </div>

        <p className="text-xs leading-5 text-slate-500">
          After changing your password, you will be asked to sign in again.
        </p>

        <button
          type="submit"
          className="w-full rounded-lg bg-sky-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
        >
          Change password
        </button>
      </form>
    </main>
  );
}
