import { auth } from "@/auth";
import { and, eq } from "drizzle-orm";
import { db } from "@/db/client";
import { users } from "@/db/schema";
import { redirect } from "next/navigation";

type GetCurrentUserOptions = {
  allowMustChangePassword?: boolean;
};

export async function getCurrentUser(options: GetCurrentUserOptions = {}) {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  const userId = Number(session.user.id);

  if (!Number.isInteger(userId) || userId <= 0) {
    return null;
  }

  const currentUser = await db.query.users.findFirst({
    where: and(eq(users.id, userId), eq(users.isActive, true)),
  });

  if (currentUser?.mustChangePassword && !options.allowMustChangePassword) {
    redirect("/change-password");
  }

  return currentUser ?? null;
}
