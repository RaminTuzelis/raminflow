"use server";

import { signIn } from "@/auth";

export async function loginUser(formData: FormData): Promise<void> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  await signIn("credentials", {
    email,
    password,
    redirectTo: "/",
  });
}
