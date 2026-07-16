"use server";

import { getCurrentUser } from "@/lib/current-user";
import { canManageUsers } from "@/lib/permissions";
import { isUserRole } from "@/lib/user-options";
import { db } from "@/db/client";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export type SetUserActiveState = {
  success: boolean;
  error: string | null;
};

export type UpdateUserState = {
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
    };
  }

  if (!email) {
    return {
      success: false,
      error: "Email is required.",
    };
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email)) {
    return {
      success: false,
      error: "Email address is invalid.",
    };
  }

  if (!isUserRole(role)) {
    return {
      success: false,
      error: "Role is invalid.",
    };
  }

  if (!title) {
    return {
      success: false,
      error: "Title is required.",
    };
  }

  const birthDatePattern = /^\d{4}-\d{2}-\d{2}$/;

  if (birthDate !== "" && !birthDatePattern.test(birthDate)) {
    return {
      success: false,
      error: "Birth date is invalid.",
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
    };
  }

  const currentUserId = currentUser.id;

  if (userId === currentUserId && role !== existingUser.role) {
    return {
      success: false,
      error: "You cannot change your own role.",
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
