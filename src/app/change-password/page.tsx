import { getCurrentUser } from "@/lib/current-user";
import { redirect } from "next/navigation";
import { ChangePasswordForm } from "@/components/change-password-form";
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

      <ChangePasswordForm />
    </main>
  );
}
