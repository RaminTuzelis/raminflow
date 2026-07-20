"use server";

import { getCurrentUser } from "@/lib/current-user";
import { canManageUsers } from "@/lib/permissions";
import { isUserRole } from "@/lib/user-options";
import { db } from "@/db/client";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import argon2 from "argon2";

export type SetUserActiveState = {
  success: boolean;
  error: string | null;
};

export type UpdateUserErrorField =
  | "name"
  | "email"
  | "role"
  | "title"
  | "birthDate";

export type UpdateUserState = {
  success: boolean;
  error: string | null;
  errorField?: UpdateUserErrorField;
};

export type ResetUserPasswordState = {
  success: boolean;
  error: string | null;
};

export async function updateUser(
  _previousState: UpdateUserState,
  formData: FormData,
): Promise<UpdateUserState> {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    throw new Error("You must be signed in to update users.");
  }

  if (!canManageUsers(currentUser.role)) {
    throw new Error("You are not allowed to manage users.");
  }

  const userId = Number(String(formData.get("userId") ?? ""));

  if (!Number.isInteger(userId) || userId <= 0) {
    return {
      success: false,
      error: "User ID is invalid.",
    };
  }

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const role = String(formData.get("role") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const birthDate = String(formData.get("birthDate") ?? "");

  if (!name) {
    return {
      success: false,
      error: "Name is required.",
      errorField: "name",
    };
  }

  if (!email) {
    return {
      success: false,
      error: "Email is required.",
      errorField: "email",
    };
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email)) {
    return {
      success: false,
      error: "Email address is invalid.",
      errorField: "email",
    };
  }

  if (!isUserRole(role)) {
    return {
      success: false,
      error: "Role is invalid.",
      errorField: "role",
    };
  }

  if (!title) {
    return {
      success: false,
      error: "Title is required.",
      errorField: "title",
    };
  }

  const birthDatePattern = /^\d{4}-\d{2}-\d{2}$/;

  if (birthDate !== "" && !birthDatePattern.test(birthDate)) {
    return {
      success: false,
      error: "Birth date is invalid.",
      errorField: "birthDate",
    };
  }

  if (birthDate !== "") {
    const parsedBirthDate = new Date(`${birthDate}T00:00:00Z`);

    const isRealDate =
      !Number.isNaN(parsedBirthDate.getTime()) &&
      parsedBirthDate.toISOString().slice(0, 10) === birthDate;

    if (!isRealDate) {
      return {
        success: false,
        error: "Birth date is invalid.",
        errorField: "birthDate",
      };
    }

    const todayInVilnius = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Europe/Vilnius",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());

    if (birthDate > todayInVilnius) {
      return {
        success: false,
        error: "Birth date cannot be in the future.",
        errorField: "birthDate",
      };
    }
  }

  const existingUser = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  if (!existingUser) {
    return {
      success: false,
      error: "User was not found.",
    };
  }

  const userWithEmail = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (userWithEmail && userWithEmail.id !== userId) {
    return {
      success: false,
      error: "A user with this email already exists.",
      errorField: "email",
    };
  }

  const currentUserId = currentUser.id;

  if (userId === currentUserId && role !== existingUser.role) {
    return {
      success: false,
      error: "You cannot change your own role.",
      errorField: "role",
    };
  }

  await db
    .update(users)
    .set({
      name,
      email,
      role,
      title,
      birthDate: birthDate === "" ? null : birthDate,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId));

  revalidatePath("/admin/users");
  revalidatePath(`/admin/users/${userId}`);
  revalidatePath("/");
  revalidatePath("/account");

  return {
    success: true,
    error: null,
  };
}

export async function setUserActiveState(
  _previousState: SetUserActiveState,
  formData: FormData,
): Promise<SetUserActiveState> {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    throw new Error("You must be signed in to update users.");
  }

  if (!canManageUsers(currentUser.role)) {
    throw new Error("You are not allowed to manage users.");
  }

  const userId = Number(String(formData.get("userId") ?? ""));

  if (!Number.isInteger(userId) || userId <= 0) {
    return {
      success: false,
      error: "User ID is invalid.",
    };
  }

  const isActiveValue = String(formData.get("isActive") ?? "");

  if (isActiveValue !== "true" && isActiveValue !== "false") {
    return {
      success: false,
      error: "Account status is invalid.",
    };
  }

  const isActive = isActiveValue === "true";

  const existingUser = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  if (!existingUser) {
    return {
      success: false,
      error: "User was not found.",
    };
  }

  if (userId === currentUser.id && !isActive) {
    return {
      success: false,
      error: "You cannot deactivate your own account.",
    };
  }

  await db
    .update(users)
    .set({
      isActive,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId));

  revalidatePath("/admin/users");
  revalidatePath(`/admin/users/${userId}`);

  return {
    success: true,
    error: null,
  };
}

export async function resetUserPassword(
  _previousState: ResetUserPasswordState,
  formData: FormData,
): Promise<ResetUserPasswordState> {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    throw new Error("You must be signed in to reset user passwords.");
  }

  if (!canManageUsers(currentUser.role)) {
    throw new Error("You are not allowed to manage users.");
  }

  const userId = Number(String(formData.get("userId") ?? ""));

  if (!Number.isInteger(userId) || userId <= 0) {
    return {
      success: false,
      error: "User ID is invalid.",
    };
  }

  if (userId === currentUser.id) {
    return {
      success: false,
      error: "Use your account page to change your own password.",
    };
  }

  const temporaryPassword = String(formData.get("temporaryPassword") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (temporaryPassword === "" || confirmPassword === "") {
    return {
      success: false,
      error: "Both password fields are required.",
    };
  }

  if (temporaryPassword !== confirmPassword) {
    return {
      success: false,
      error: "Temporary password and confirmation do not match.",
    };
  }

  if (temporaryPassword.length < 8) {
    return {
      success: false,
      error: "Temporary password must be at least 8 characters long.",
    };
  }

  const existingUser = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  if (!existingUser) {
    return {
      success: false,
      error: "User was not found.",
    };
  }

  const temporaryPasswordHash = await argon2.hash(temporaryPassword);

  await db
    .update(users)
    .set({
      passwordHash: temporaryPasswordHash,
      mustChangePassword: true,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId));

  revalidatePath("/admin/users");
  revalidatePath(`/admin/users/${userId}`);

  return {
    success: true,
    error: null,
  };
}
