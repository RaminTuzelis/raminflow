"use server";

import { getCurrentUser } from "@/lib/current-user";
import { canManageUsers } from "@/lib/permissions";
import { isUserRole } from "@/lib/user-options";
import { db } from "@/db/client";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import argon2 from "argon2";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type CreateUserErrorField =
  | "name"
  | "email"
  | "role"
  | "title"
  | "birthDate"
  | "temporaryPassword";

export type CreateUserState = {
  error: string | null;
  errorField?: CreateUserErrorField;
};

export async function createUser(
  _previousState: CreateUserState,
  formData: FormData,
): Promise<CreateUserState> {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    throw new Error("You must be signed in to create users.");
  }

  if (!canManageUsers(currentUser.role)) {
    throw new Error("You are not allowed to manage users.");
  }

  const name = String(formData.get("name") ?? "");
  const email = String(formData.get("email") ?? "");
  const role = String(formData.get("role") ?? "");
  const title = String(formData.get("title") ?? "");
  const birthDate = String(formData.get("birthDate") ?? "");
  const temporaryPassword = String(formData.get("temporaryPassword") ?? "");

  if (!name.trim()) {
    return {
      error: "Name is required.",
      errorField: "name",
    };
  }

  if (!email.trim()) {
    return {
      error: "Email is required.",
      errorField: "email",
    };
  }

  const normalizedEmail = email.trim().toLowerCase();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(normalizedEmail)) {
    return {
      error: "Email address is invalid.",
      errorField: "email",
    };
  }

  if (!isUserRole(role)) {
    return {
      error: "Role is invalid.",
      errorField: "role",
    };
  }

  if (!title.trim()) {
    return {
      error: "Title is required.",
      errorField: "title",
    };
  }

  if (temporaryPassword.length < 8) {
    return {
      error: "Temporary password must be at least 8 characters long.",
      errorField: "temporaryPassword",
    };
  }

  const birthDatePattern = /^\d{4}-\d{2}-\d{2}$/;

  if (birthDate !== "" && !birthDatePattern.test(birthDate)) {
    return {
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
        error: "Birth date cannot be in the future.",
        errorField: "birthDate",
      };
    }
  }

  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, normalizedEmail),
  });

  if (existingUser) {
    return {
      error: "A user with this email already exists.",
      errorField: "email",
    };
  }

  const passwordHash = await argon2.hash(temporaryPassword);

  await db.insert(users).values({
    role,
    name: name.trim(),
    email: normalizedEmail,
    title: title.trim(),
    birthDate: birthDate === "" ? null : birthDate,
    passwordHash,
    mustChangePassword: true,
  });

  revalidatePath("/admin/users");
  redirect("/admin/users");
}
