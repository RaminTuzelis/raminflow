"use server";

import { eq, sql } from "drizzle-orm";
import type { OrderDraft } from "@/types/order";
import {
  isMaterialType,
  isThicknessOption,
  isUnitType,
} from "@/lib/order-options";
import { db } from "@/db/client";
import { orderItems, orderNumberCounters, orders } from "@/db/schema";
import { formatOrderNumber } from "@/lib/order-number";

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

  const deadlineDate = new Date(draftOrder.deadline);
  const today = new Date();

  today.setHours(0, 0, 0, 0);
  deadlineDate.setHours(0, 0, 0, 0);

  if (deadlineDate < today) {
    return {
      success: false,
      error: "Deadline cannot be in the past.",
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

    if (!isUnitType(item.unit)) {
      return {
        success: false,
        error: "Each order item must have a valid unit.",
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

  const createdOrder = await db.transaction(async (tx) => {
    const year = new Date().getFullYear();

    await tx
      .insert(orderNumberCounters)
      .values({
        year,
        nextNumber: 1,
      })
      .onConflictDoNothing();

    const [counter] = await tx
      .update(orderNumberCounters)
      .set({
        nextNumber: sql`${orderNumberCounters.nextNumber} + 1`,
      })
      .where(eq(orderNumberCounters.year, year))
      .returning({
        nextNumber: orderNumberCounters.nextNumber,
      });

    if (!counter) {
      throw new Error("Could not reserve order number.");
    }

    const sequenceNumber = counter.nextNumber - 1;
    const orderNumber = formatOrderNumber(year, sequenceNumber);

    const [order] = await tx
      .insert(orders)
      .values({
        orderNumber,
        projectName: draftOrder.projectName.trim(),
        productionNotes: draftOrder.productionNotes.trim(),
        deadline: new Date(draftOrder.deadline),
      })
      .returning({
        id: orders.id,
        orderNumber: orders.orderNumber,
      });

    if (!order) {
      throw new Error("Could not create order.");
    }

    await tx.insert(orderItems).values(
      draftOrder.items.map((item) => ({
        orderId: order.id,
        name: item.name.trim(),
        quantity: item.quantity,
        unit: item.unit,
        materialType: item.materialType,
        thicknessMm: item.thicknessMm,
      })),
    );

    return order;
  });

  return {
    success: true,
    order: {
      id: String(createdOrder.id),
      orderNumber: createdOrder.orderNumber,
    },
  };
}
