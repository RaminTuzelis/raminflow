import { getCurrentUser } from "@/lib/current-user";
import { canManageUsers } from "@/lib/permissions";
import { redirect } from "next/navigation";
import { db } from "@/db/client";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { AdminUserFilters } from "@/components/admin-user-filters";
import { isUserRole, userRoleLabels } from "@/lib/user-options";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowLeftIcon, PlusIcon } from "lucide-react";

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
        className="inline-flex items-center gap-2 text-sm font-medium text-primary transition hover:text-[color-mix(in_oklch,var(--primary),var(--foreground)_25%)]"
      >
        <ArrowLeftIcon aria-hidden="true" className="size-4" />
        Back to account
      </Link>
      <p className="mt-5 border-l-2 border-primary pl-2 text-sm font-semibold uppercase text-muted-foreground">
        Administration
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-4">
        <h1 className="text-3xl font-bold text-foreground">Users</h1>

        <Link
          href="/admin/users/new"
          className={buttonVariants({ variant: "default" })}
        >
          <PlusIcon data-icon="inline-start" />
          Create user
        </Link>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <AdminUserFilters initialQuery={searchQuery} />

        <p className="shrink-0 text-right text-sm text-muted-foreground">
          {userRows.length} {userRows.length === 1 ? "user" : "users"} found.
        </p>
      </div>

      <div className="mt-4 overflow-hidden rounded-lg border">
        <Table className="min-w-225">
          <TableCaption className="sr-only">User accounts</TableCaption>
          <TableHeader className="bg-muted text-xs uppercase">
            <TableRow className="hover:bg-transparent">
              <TableHead className="px-4 text-muted-foreground">Name</TableHead>
              <TableHead className="px-4 text-muted-foreground">
                Email
              </TableHead>
              <TableHead className="px-4 text-muted-foreground">Role</TableHead>
              <TableHead className="px-4 text-muted-foreground">
                Title
              </TableHead>
              <TableHead className="px-4 text-muted-foreground">
                Active
              </TableHead>
              <TableHead className="px-4 text-muted-foreground">
                Password
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {userRows.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={6}
                  className="h-28 px-4 text-center text-muted-foreground"
                >
                  {searchQuery
                    ? `No users found for "${searchQuery}".`
                    : selectedRole
                      ? "No users found for the selected role."
                      : "No users found."}
                </TableCell>
              </TableRow>
            ) : (
              userRows.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="px-4 py-3 font-medium">
                    <Link
                      href={`/admin/users/${user.id}`}
                      className="text-primary transition hover:text-foreground"
                    >
                      {user.name}
                    </Link>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-muted-foreground">
                    {user.email}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-muted-foreground">
                    {userRoleLabels[user.role]}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-muted-foreground">
                    {user.title || "Not set"}
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <Badge variant={user.isActive ? "success" : "destructive"}>
                      {user.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <Badge
                      variant={user.mustChangePassword ? "warning" : "success"}
                    >
                      {user.mustChangePassword ? "Required" : "Changed"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </main>
  );
}
