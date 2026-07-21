import { getCurrentUser } from "@/lib/current-user";
import { canManageUsers } from "@/lib/permissions";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CreateUserForm } from "@/components/create-user-form";
import { ArrowLeftIcon } from "lucide-react";

export default async function NewUserPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  if (!canManageUsers(currentUser.role)) {
    redirect("/");
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/admin/users"
        className="inline-flex items-center gap-2 text-sm font-medium text-primary transition hover:text-primary/80"
      >
        <ArrowLeftIcon aria-hidden="true" className="size-4" />
        Back to users
      </Link>
      <p className="mt-5 border-l-2 border-primary pl-2 text-sm font-semibold uppercase text-muted-foreground">
        Administration
      </p>

      <h1 className="mt-4 text-3xl font-bold text-foreground">Create user</h1>
      <CreateUserForm />
    </main>
  );
}
