"use server";

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

  console.log({
    orderId,
    nextStatus,
  });
}
