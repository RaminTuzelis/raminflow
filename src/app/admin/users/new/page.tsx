import { getCurrentUser } from "@/lib/current-user";
import { canManageUsers } from "@/lib/permissions";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CreateUserForm } from "@/components/create-user-form";
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
        className="inline-flex items-center gap-2 text-sm font-medium text-sky-400 transition hover:text-sky-300"
      >
        <span aria-hidden="true">←</span>
        Back to users
      </Link>
      <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
        Administration
      </p>

      <h1 className="mt-4 text-3xl font-bold tracking-tight text-white">
        Create user
      </h1>
      <CreateUserForm />
    </main>
  );
}
