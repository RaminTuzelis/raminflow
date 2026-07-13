"use server";

import { auth } from "@/auth";
import { canManageUsers } from "@/lib/permissions";
import { isUserRole } from "@/lib/user-options";
import { db } from "@/db/client";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateUser(formData: FormData) {
  const session = await auth();

  if (!session?.user) {
    throw new Error("You must be signed in to update users.");
  }

  if (!canManageUsers(session.user.role)) {
    throw new Error("You are not allowed to manage users.");
  }

  const userId = Number(String(formData.get("userId") ?? ""));

  if (!Number.isInteger(userId) || userId <= 0) {
    throw new Error("User ID is invalid.");
  }

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const role = String(formData.get("role") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const birthDate = String(formData.get("birthDate") ?? "");

  if (!name) {
    throw new Error("Name is required.");
  }

  if (!email) {
    throw new Error("Email is required.");
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email)) {
    throw new Error("Email address is invalid.");
  }

  if (!isUserRole(role)) {
    throw new Error("Role is invalid.");
  }

  if (!title) {
    throw new Error("Title is required.");
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
    where: eq(users.id, userId),
  });

  if (!existingUser) {
    throw new Error("User was not found.");
  }

  const userWithEmail = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (userWithEmail && userWithEmail.id !== userId) {
    throw new Error("A user with this email already exists.");
  }

  const sessionUserId = Number(session.user.id);

  if (userId === sessionUserId && role !== existingUser.role) {
    throw new Error("You cannot change your own role.");
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
}
