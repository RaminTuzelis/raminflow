"use server";

import { db } from "@/db/client";
import { orderStatusHistory, orders } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { isOrderStatus } from "@/lib/order-options";
import { getCurrentUser } from "@/lib/current-user";
import { canUpdateOrderStatus } from "@/lib/permissions";

export async function updateOrderStatus(formData: FormData) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    throw new Error("You must be signed in to update order status.");
  }

  if (!canUpdateOrderStatus(currentUser.role)) {
    throw new Error("You are not allowed to update order status.");
  }

  const orderId = Number(formData.get("orderId"));
  const nextStatus = String(formData.get("status") ?? "");

  if (!Number.isInteger(orderId)) {
    throw new Error("Order id is invalid.");
  }

  if (!isOrderStatus(nextStatus)) {
    throw new Error("Order status is invalid.");
  }

  const [currentOrder] = await db
    .select({
      status: orders.status,
    })
    .from(orders)
    .where(eq(orders.id, orderId))
    .limit(1);

  if (!currentOrder) {
    throw new Error("Order was not found.");
  }

  if (currentOrder.status === nextStatus) {
    return;
  }

  await db.transaction(async (tx) => {
    await tx.insert(orderStatusHistory).values({
      orderId,
      fromStatus: currentOrder.status,
      toStatus: nextStatus,
    });

    await tx
      .update(orders)
      .set({
        status: nextStatus,
        updatedAt: new Date(),
      })
      .where(eq(orders.id, orderId));
  });

  revalidatePath(`/orders/${orderId}`);
  revalidatePath(`/`);
}
