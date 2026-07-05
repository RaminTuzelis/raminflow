"use server";

import { auth, signOut } from "@/auth";
import { db } from "@/db/client";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import argon2 from "argon2";

export async function changePassword(formData: FormData) {
  const session = await auth();

  if (!session?.user) {
    throw new Error("You must be signed in to change your password.");
  }

  const currentUser = await db.query.users.findFirst({
    where: eq(users.id, Number(session.user.id)),
  });

  if (!currentUser) {
    throw new Error("User was not found.");
  }

  const currentPassword = String(formData.get("currentPassword") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!currentPassword || !newPassword || !confirmPassword) {
    throw new Error("All password fields are required.");
  }

  if (newPassword !== confirmPassword) {
    throw new Error("New password and confirmation do not match.");
  }

  if (newPassword.length < 8) {
    throw new Error("New password must be at least 8 characters long.");
  }

  const currentPasswordIsValid = await argon2.verify(
    currentUser.passwordHash,
    currentPassword,
  );

  if (!currentPasswordIsValid) {
    throw new Error("Current password is incorrect.");
  }

  const newPasswordHash = await argon2.hash(newPassword);

  await db
    .update(users)
    .set({
      passwordHash: newPasswordHash,
      mustChangePassword: false,
      updatedAt: new Date(),
    })
    .where(eq(users.id, currentUser.id));

  await signOut({ redirectTo: "/login" });
}
