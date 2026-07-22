import { getCurrentUser } from "@/lib/current-user";
import { redirect } from "next/navigation";
import { ChangePasswordForm } from "@/components/change-password-form";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

export default async function ChangePasswordPage() {
  const currentUser = await getCurrentUser({
    allowMustChangePassword: true,
  });

  if (!currentUser) {
    redirect("/login");
  }

  const isRequiredPasswordChange = currentUser.mustChangePassword;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-4 py-8">
      {!isRequiredPasswordChange && (
        <Link
          href="/account"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-primary transition hover:text-[color-mix(in_oklch,var(--primary),var(--foreground)_25%)]"
        >
          <ArrowLeftIcon aria-hidden="true" className="size-4" />
          Back to account
        </Link>
      )}
      <p className="border-l-2 border-primary pl-2 text-sm font-semibold uppercase text-muted-foreground">
        RaminFlow
      </p>

      <h1 className="mt-4 text-3xl font-bold text-foreground">
        Change password
      </h1>

      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        {isRequiredPasswordChange
          ? "You need to change your temporary password before using RaminFlow."
          : "Update your password to keep your account secure."}
      </p>

      <ChangePasswordForm />
    </main>
  );
}
