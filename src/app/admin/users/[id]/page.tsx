import { getCurrentUser } from "@/lib/current-user";
import { canManageUsers } from "@/lib/permissions";
import { notFound, redirect } from "next/navigation";
import { db } from "@/db/client";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { calculateAge } from "@/lib/date-utils";
import { AdminUserEditButton } from "@/components/admin-user-edit-button";
import { AdminUserStatusButton } from "@/components/admin-user-status-button";
import {
  updateUser,
  setUserActiveState,
  resetUserPassword,
} from "@/app/admin/users/[id]/actions";
import { AdminUserPasswordResetButton } from "@/components/admin-user-password-reset-button";
import { userRoleLabels } from "@/lib/user-options";
import { Badge } from "@/components/ui/badge";
import { ArrowLeftIcon } from "lucide-react";

type AdminUserPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminUserPage({ params }: AdminUserPageProps) {
  const { id } = await params;
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  if (!canManageUsers(currentUser.role)) {
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
        className="inline-flex items-center gap-2 text-sm font-medium text-primary transition hover:text-primary/80"
      >
        <ArrowLeftIcon aria-hidden="true" className="size-4" />
        Back to users
      </Link>
      <p className="mt-5 border-l-2 border-primary pl-2 text-sm font-semibold uppercase text-muted-foreground">
        Administration
      </p>

      <div className="mt-4 flex flex-col gap-4 min-[784px]:flex-row min-[784px]:items-start min-[784px]:justify-between">
        <div className="min-w-0">
          <h1 className="text-3xl font-bold text-foreground">
            {selectedUser.name}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {selectedUser.title || "Title not set"}
          </p>
        </div>

        <div className="grid w-full gap-2 min-[500px]:flex min-[500px]:flex-wrap min-[784px]:w-auto min-[784px]:justify-end">
          <AdminUserEditButton
            user={{
              id: selectedUser.id,
              name: selectedUser.name,
              email: selectedUser.email,
              role: selectedUser.role,
              title: selectedUser.title,
              birthDate: selectedUser.birthDate,
            }}
            updateAction={updateUser}
          />

          {selectedUser.id !== currentUser.id && (
            <>
              <AdminUserPasswordResetButton
                user={{ id: selectedUser.id, name: selectedUser.name }}
                resetAction={resetUserPassword}
              />

              <AdminUserStatusButton
                user={{
                  id: selectedUser.id,
                  name: selectedUser.name,
                  isActive: selectedUser.isActive,
                }}
                updateAction={setUserActiveState}
              />
            </>
          )}
        </div>
      </div>

      <dl className="mt-8 grid gap-6 border-t border-border pt-6 sm:grid-cols-2">
        <div>
          <dt className="text-xs font-medium uppercase text-muted-foreground">
            Email
          </dt>
          <dd className="mt-1 text-sm font-medium text-foreground">
            {selectedUser.email}
          </dd>
        </div>

        <div>
          <dt className="text-xs font-medium uppercase text-muted-foreground">
            Role
          </dt>
          <dd className="mt-1 text-sm font-medium text-foreground">
            {userRoleLabels[selectedUser.role]}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase text-muted-foreground">
            Birth date
          </dt>
          <dd className="mt-1 text-sm font-medium text-foreground">
            {selectedUser.birthDate || "Not set"}
          </dd>
        </div>

        <div>
          <dt className="text-xs font-medium uppercase text-muted-foreground">
            Age
          </dt>
          <dd className="mt-1 text-sm font-medium text-foreground">
            {selectedUser.birthDate
              ? `${calculateAge(selectedUser.birthDate)} years old`
              : "Not set"}
          </dd>
        </div>

        <div>
          <dt className="text-xs font-medium uppercase text-muted-foreground">
            Account status
          </dt>
          <dd className="mt-1">
            <Badge variant={selectedUser.isActive ? "success" : "destructive"}>
              {selectedUser.isActive ? "Active" : "Inactive"}
            </Badge>
          </dd>
        </div>

        <div>
          <dt className="text-xs font-medium uppercase text-muted-foreground">
            Password status
          </dt>
          <dd className="mt-1">
            <Badge
              variant={selectedUser.mustChangePassword ? "warning" : "success"}
            >
              {selectedUser.mustChangePassword
                ? "Change required"
                : "Password changed"}
            </Badge>
          </dd>
        </div>
      </dl>
    </main>
  );
}
