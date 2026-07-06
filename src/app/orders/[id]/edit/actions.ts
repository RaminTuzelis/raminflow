"use server";

import { auth } from "@/auth";
import { db } from "@/db/client";
import { orders } from "@/db/schema";
import { canEditOrder } from "@/lib/permissions";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateOrderHeader(formData: FormData) {
  const session = await auth();

  if (!session?.user) {
    throw new Error("You must be signed in to edit orders.");
  }

  if (!canEditOrder(session.user.role)) {
    throw new Error("You are not allowed to edit orders.");
  }

  const orderId = Number(formData.get("orderId"));
  const projectName = String(formData.get("projectName") ?? "");
  const deadline = String(formData.get("deadline") ?? "");
  const productionNotes = String(formData.get("productionNotes") ?? "");

  if (!Number.isInteger(orderId)) {
    throw new Error("Order id is invalid.");
  }

  if (projectName.trim() === "") {
    throw new Error("Project name is required.");
  }

  if (deadline === "") {
    throw new Error("Deadline is required.");
  }

  const deadlineDate = new Date(deadline);

  if (Number.isNaN(deadlineDate.getTime())) {
    throw new Error("Deadline is invalid.");
  }

  await db
    .update(orders)
    .set({
      projectName: projectName.trim(),
      deadline: deadlineDate,
      productionNotes: productionNotes.trim(),
      updatedAt: new Date(),
    })
    .where(eq(orders.id, orderId));

  revalidatePath(`/orders/${orderId}`);
  revalidatePath("/");
  redirect(`/orders/${orderId}`);
}
