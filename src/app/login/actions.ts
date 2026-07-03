"use server";

import { signIn } from "@/auth";

export async function loginUser(formData: FormData): Promise<void> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
  } catch (error) {
    console.log("Auth sign in failed:", error);
  }
}
