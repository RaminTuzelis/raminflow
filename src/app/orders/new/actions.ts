"use server";

import type { OrderDraft } from "@/types/order";

type CreateOrderDraftResult = {
  id: string;
  orderNumber: string;
};

export async function createOrderDraft(
  draftOrder: OrderDraft,
): Promise<CreateOrderDraftResult> {
  if (!draftOrder.projectName.trim()) {
    throw new Error("Project name is required.");
  }

  if (!draftOrder.deadline) {
    throw new Error("Deadline is required.");
  }

  if (draftOrder.items.length === 0) {
    throw new Error("At least one order item is required.");
  }

  console.log("Server received draft order:", draftOrder);

  return {
    id: "temporary-order-id",
    orderNumber: "RF-2026-TEMP",
  };
}
