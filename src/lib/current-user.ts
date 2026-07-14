import { auth } from "@/auth";
import { and, eq } from "drizzle-orm";
import { db } from "@/db/client";
import { users } from "@/db/schema";

export async function getCurrentUser() {
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

  return currentUser ?? null;
}
