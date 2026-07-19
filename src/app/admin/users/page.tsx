import { getCurrentUser } from "@/lib/current-user";
import { canManageUsers } from "@/lib/permissions";
import { redirect } from "next/navigation";
import { db } from "@/db/client";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { AdminUserFilters } from "@/components/admin-user-filters";
import { isUserRole, userRoleLabels } from "@/lib/user-options";

type AdminUsersPageProps = {
  searchParams: Promise<{
    q?: string;
    role?: string;
  }>;
};

export default async function AdminUsersPage({
  searchParams,
}: AdminUsersPageProps) {
  const { q, role } = await searchParams;
  const searchQuery = q?.trim() ?? "";
  const selectedRole = role && isUserRole(role) ? role : undefined;
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  if (!canManageUsers(currentUser.role)) {
    redirect("/");
  }

  const userRows = await db.query.users.findMany({
    where: (users, { and, eq, ilike, or }) =>
      and(
        searchQuery
          ? or(
              ilike(users.name, `%${searchQuery}%`),
              ilike(users.email, `%${searchQuery}%`),
            )
          : undefined,
        selectedRole ? eq(users.role, selectedRole) : undefined,
      ),
    orderBy: (users, { asc }) => [asc(users.name)],
  });

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/account"
        className="inline-flex items-center gap-2 text-sm font-medium text-sky-400 transition hover:text-sky-300"
      >
        <span aria-hidden="true">←</span>
        Back to account
      </Link>
      <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
        Administration
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-white">Users</h1>

        <Link
          href="/admin/users/new"
          className={buttonVariants({ variant: "default" })}
        >
          <PlusIcon data-icon="inline-start" />
          Create user
        </Link>
      </div>

      <div className="mt-6">
        <AdminUserFilters initialQuery={searchQuery} />

        <p className="mt-3 text-right text-sm text-slate-500">
          {userRows.length} {userRows.length === 1 ? "user" : "users"} found.
        </p>
      </div>

      <div className="mt-4 overflow-x-auto rounded-lg border border-slate-800">
        <table className="min-w-225 w-full text-left text-sm">
          <thead className="bg-slate-900/70 text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Active</th>
              <th className="px-4 py-3 font-medium">Password</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800">
            {userRows.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center text-sm text-slate-500"
                >
                  {searchQuery
                    ? `No users found for "${searchQuery}".`
                    : selectedRole
                      ? "No users found for the selected role."
                      : "No users found."}
                </td>
              </tr>
            ) : (
              userRows.map((user) => (
                <tr key={user.id} className="text-slate-200">
                  <td className="px-4 py-3 font-medium">
                    <Link
                      href={`/admin/users/${user.id}`}
                      className="text-sky-400 transition hover:text-sky-300"
                    >
                      {user.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-slate-400">{user.email}</td>
                  <td className="px-4 py-3 text-slate-400">
                    {userRoleLabels[user.role]}
                  </td>
                  <td className="px-4 py-3 text-slate-400">
                    {user.title || "Not set"}
                  </td>
                  <td className="px-4 py-3 text-slate-400">
                    {user.isActive ? "Active" : "Inactive"}
                  </td>
                  <td className="px-4 py-3 text-slate-400">
                    {user.mustChangePassword ? "Required" : "Changed"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
