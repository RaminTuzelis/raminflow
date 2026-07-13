import { auth } from "@/auth";
import { canManageUsers } from "@/lib/permissions";
import { notFound, redirect } from "next/navigation";
import { db } from "@/db/client";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { calculateAge } from "@/lib/date-utils";

type AdminUserPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminUserPage({ params }: AdminUserPageProps) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (!canManageUsers(session.user.role)) {
    redirect("/");
  }

  const userId = Number(id);

  if (!Number.isInteger(userId) || userId <= 0) {
    notFound();
  }

  const selectedUser = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  if (!selectedUser) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
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
        {selectedUser.name}
      </h1>
      <p className="mt-2 text-sm text-slate-400">
        {selectedUser.title || "Title not set"}
      </p>

      <section className="mt-8 border-t border-slate-800 pt-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Email
            </p>
            <p className="mt-1 text-sm font-medium text-slate-200">
              {selectedUser.email}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Role
            </p>
            <p className="mt-1 text-sm font-medium text-slate-200">
              {selectedUser.role.replaceAll("_", " ")}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Birth date
            </p>
            <p className="mt-1 text-sm font-medium text-slate-200">
              {selectedUser.birthDate || "Not set"}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Age
            </p>
            <p className="mt-1 text-sm font-medium text-slate-200">
              {selectedUser.birthDate
                ? `${calculateAge(selectedUser.birthDate)} years old`
                : "Not set"}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Account status
            </p>
            <p className="mt-1 text-sm font-medium text-slate-200">
              {selectedUser.isActive ? "Active" : "Inactive"}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Password status
            </p>
            <p className="mt-1 text-sm font-medium text-slate-200">
              {selectedUser.mustChangePassword
                ? "Change required"
                : "Password changed"}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
