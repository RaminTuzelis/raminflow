"use server";

import { db } from "@/db/client";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { isOrderStatus } from "@/lib/order-options";

export async function updateOrderStatus(formData: FormData) {
  const orderId = Number(formData.get("orderId"));
  const nextStatus = String(formData.get("status") ?? "");

  if (!Number.isInteger(orderId)) {
    throw new Error("Order id is invalid.");
  }

  if (!isOrderStatus(nextStatus)) {
    throw new Error("Order status is invalid.");
  }

  await db
    .update(orders)
    .set({
      status: nextStatus,
      updatedAt: new Date(),
    })
    .where(eq(orders.id, orderId));

  revalidatePath(`/orders/${orderId}`);
  revalidatePath(`/`);
}
