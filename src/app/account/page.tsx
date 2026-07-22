import { getCurrentUser } from "@/lib/current-user";
import { redirect } from "next/navigation";
import Link from "next/link";
import { canManageUsers } from "@/lib/permissions";
import { calculateAge } from "@/lib/date-utils";
import { ArrowLeftIcon, UsersIcon, KeyRoundIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default async function AccountPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const canManageUserAccounts = canManageUsers(user.role);

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm font-medium text-primary transition hover:text-[color-mix(in_oklch,var(--primary),var(--foreground)_25%)]"
      >
        <ArrowLeftIcon aria-hidden="true" className="size-4" />
        Back to orders
      </Link>
      <p className="mt-5 border-l-2 border-primary pl-2 text-sm font-semibold uppercase text-muted-foreground">
        Account
      </p>
      <div className="mt-4">
        <h1 className="text-3xl font-bold text-foreground">Your profile</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Review your account details and access account settings.
        </p>
      </div>
      <section className="mt-8 rounded-lg border bg-card p-6 text-card-foreground">
        <div className="flex items-center gap-4">
          <div className="flex size-14 items-center justify-center rounded-full border bg-muted text-lg font-semibold text-primary">
            {user.name.slice(0, 1).toUpperCase()}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              {user.name}
            </h2>
          </div>
        </div>

        <div className="mt-6 grid gap-6 border-t pt-6 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase text-muted-foreground">
              Email
            </p>
            <p className="mt-1 text-sm font-medium text-foreground">
              {user.email}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase text-muted-foreground">
              Title
            </p>
            <p className="mt-1 text-sm font-medium text-foreground">
              {user.title || "Not set"}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase text-muted-foreground">
              Birth date
            </p>
            <p className="mt-1 text-sm font-medium text-foreground">
              {user.birthDate || "Not set"}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase text-muted-foreground">
              Age
            </p>
            <p className="mt-1 text-sm font-medium text-foreground">
              {user.birthDate
                ? `${calculateAge(user.birthDate)} years old`
                : "Not set"}
            </p>
          </div>
        </div>

        {canManageUserAccounts && (
          <div className="mt-6 border-t pt-6">
            <p className="text-xs font-medium uppercase text-muted-foreground">
              Administration
            </p>
            <Link
              href="/admin/users"
              className={buttonVariants({
                variant: "secondary",
                className: "mt-3",
              })}
            >
              <UsersIcon data-icon="inline-start" />
              Manage users
            </Link>
          </div>
        )}
        <div className="mt-6 flex justify-end border-t pt-6">
          <Link
            href="/change-password"
            className={buttonVariants({ variant: "outline" })}
          >
            <KeyRoundIcon data-icon="inline-start" />
            Change password
          </Link>
        </div>
      </section>
    </main>
  );
}
