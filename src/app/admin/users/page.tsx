import { auth } from "@/auth";
import { canManageUsers } from "@/lib/permissions";
import { redirect } from "next/navigation";
import { db } from "@/db/client";

export default async function AdminUsersPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (!canManageUsers(session.user.role)) {
    redirect("/");
  }

  const userRows = await db.query.users.findMany({
    orderBy: (users, { asc }) => [asc(users.name)],
  });

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-white">Users</h1>

      <p className="mt-2 text-sm text-slate-400">
        {userRows.length} users found.
      </p>

      <div className="mt-6 overflow-hidden rounded-lg border border-slate-800">
        <table className="w-full text-left text-sm">
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
            {userRows.map((user) => (
              <tr key={user.id} className="text-slate-200">
                <td className="px-4 py-3 font-medium">{user.name}</td>
                <td className="px-4 py-3 text-slate-400">{user.email}</td>
                <td className="px-4 py-3 text-slate-400">{user.role}</td>
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
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
