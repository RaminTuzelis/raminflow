"use server";

import type { OrderDraft } from "@/types/order";
import { isMaterialType, isThicknessOption } from "@/lib/order-options";

type CreateOrderDraftResult =
  | {
      success: true;
      order: {
        id: string;
        orderNumber: string;
      };
    }
  | {
      success: false;
      error: string;
    };

export async function createOrderDraft(
  draftOrder: OrderDraft,
): Promise<CreateOrderDraftResult> {
  if (!draftOrder.projectName.trim()) {
    return {
      success: false,
      error: "Project name is required.",
    };
  }

  if (!draftOrder.deadline) {
    return {
      success: false,
      error: "Deadline is required.",
    };
  }

  if (draftOrder.items.length === 0) {
    return {
      success: false,
      error: "At least one order item is required.",
    };
  }

  for (const item of draftOrder.items) {
    if (!item.name.trim()) {
      return {
        success: false,
        error: "Each order item must have a name.",
      };
    }

    if (item.quantity < 1) {
      return {
        success: false,
        error: "Each order item quantity must be at least 1.",
      };
    }

    if (!isMaterialType(item.materialType)) {
      return {
        success: false,
        error: "Each order item must have a valid material.",
      };
    }

    if (!isThicknessOption(item.thicknessMm)) {
      return {
        success: false,
        error: "Each order item must have a valid thickness.",
      };
    }
  }

  console.log("Server received draft order:", draftOrder);

  return {
    success: true,
    order: {
      id: "temporary-order-id",
      orderNumber: "RF-2026-TEMP",
    },
  };
}
