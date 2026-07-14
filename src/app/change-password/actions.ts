"use server";

import { signOut } from "@/auth";
import { getCurrentUser } from "@/lib/current-user";
import { db } from "@/db/client";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import argon2 from "argon2";

export type ChangePasswordState = {
  error: string | null;
};

export async function changePassword(
  _previousState: ChangePasswordState,
  formData: FormData,
): Promise<ChangePasswordState> {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    throw new Error("You must be signed in to change your password.");
  }

  const currentPassword = String(formData.get("currentPassword") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!currentPassword || !newPassword || !confirmPassword) {
    return {
      error: "All password fields are required.",
    };
  }

  if (newPassword !== confirmPassword) {
    return {
      error: "New password and confirmation do not match.",
    };
  }

  if (newPassword.length < 8) {
    return {
      error: "New password must be at least 8 characters long.",
    };
  }

  const currentPasswordIsValid = await argon2.verify(
    currentUser.passwordHash,
    currentPassword,
  );

  if (!currentPasswordIsValid) {
    return {
      error: "Current password is incorrect.",
    };
  }

  if (newPassword === currentPassword) {
    return {
      error: "New password must be different from your current password.",
    };
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

  return {
    error: null,
  };
}
