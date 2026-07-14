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

export async function createUser(formData: FormData) {
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
    throw new Error("Name is required.");
  }

  if (!email.trim()) {
    throw new Error("Email is required.");
  }

  const normalizedEmail = email.trim().toLowerCase();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(normalizedEmail)) {
    throw new Error("Email address is invalid.");
  }

  if (!isUserRole(role)) {
    throw new Error("Role is invalid.");
  }

  if (!title.trim()) {
    throw new Error("Title is required.");
  }

  if (temporaryPassword.length < 8) {
    throw new Error("Temporary password must be at least 8 characters long.");
  }

  const birthDatePattern = /^\d{4}-\d{2}-\d{2}$/;

  if (birthDate !== "" && !birthDatePattern.test(birthDate)) {
    throw new Error("Birth date is invalid.");
  }

  if (birthDate !== "") {
    const parsedBirthDate = new Date(`${birthDate}T00:00:00Z`);

    const isRealDate =
      !Number.isNaN(parsedBirthDate.getTime()) &&
      parsedBirthDate.toISOString().slice(0, 10) === birthDate;

    if (!isRealDate) {
      throw new Error("Birth date is invalid.");
    }

    const todayInVilnius = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Europe/Vilnius",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());

    if (birthDate > todayInVilnius) {
      throw new Error("Birth date cannot be in the future.");
    }
  }

  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, normalizedEmail),
  });

  if (existingUser) {
    throw new Error("A user with this email already exists.");
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
