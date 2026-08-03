"use server";

import { getCurrentUser } from "@/lib/current-user";
import { db } from "@/db/client";
import { orderItems, orders } from "@/db/schema";
import { canEditOrder } from "@/lib/permissions";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  isMaterialType,
  isThicknessOption,
  isUnitType,
} from "@/lib/order-options";

export type UpdateOrderItemErrorField =
  | "itemName"
  | "quantity"
  | "unit"
  | "materialType"
  | "thicknessMm";

export type UpdateOrderItemState = {
  success: boolean;
  error: string | null;
  errorField?: UpdateOrderItemErrorField;
};

export type UpdateOrderItemAction = (
  previousState: UpdateOrderItemState,
  formData: FormData,
) => Promise<UpdateOrderItemState>;

export type RemoveOrderItemState = {
  success: boolean;
  error: string | null;
};

export type RemoveOrderItemAction = (
  previousState: RemoveOrderItemState,
  formData: FormData,
) => Promise<RemoveOrderItemState>;

export async function updateOrderHeader(formData: FormData) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    throw new Error("You must be signed in to edit orders.");
  }

  if (!canEditOrder(currentUser.role)) {
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

export async function addOrderItem(formData: FormData) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    throw new Error("You must be signed in to add order items.");
  }

  if (!canEditOrder(currentUser.role)) {
    throw new Error("You are not allowed to edit orders.");
  }

  const orderId = Number(formData.get("orderId"));
  const itemName = String(formData.get("itemName") ?? "");
  const quantity = Number(formData.get("quantity"));
  const unit = String(formData.get("unit") ?? "");
  const materialType = String(formData.get("materialType") ?? "");
  const thicknessMm = Number(formData.get("thicknessMm"));

  if (!Number.isInteger(orderId)) {
    throw new Error("Order id is invalid.");
  }

  if (itemName.trim() === "") {
    throw new Error("Item name is required.");
  }

  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new Error("Quantity must be at least 1");
  }

  if (!isUnitType(unit)) {
    throw new Error("Unit is invalid.");
  }

  if (!isMaterialType(materialType)) {
    throw new Error("Material is invalid.");
  }

  if (!isThicknessOption(thicknessMm)) {
    throw new Error("Thickness is invalid.");
  }

  await db.insert(orderItems).values({
    orderId,
    name: itemName.trim(),
    quantity,
    unit,
    materialType,
    thicknessMm,
  });

  revalidatePath(`/orders/${orderId}/edit`);
  revalidatePath(`/orders/${orderId}`);
  revalidatePath("/");
}

export async function removeOrderItem(
  _previousState: RemoveOrderItemState,
  formData: FormData,
): Promise<RemoveOrderItemState> {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    throw new Error("You must be signed in to remove order items.");
  }

  if (!canEditOrder(currentUser.role)) {
    throw new Error("You are not allowed to edit orders.");
  }

  const orderId = Number(formData.get("orderId"));
  const itemId = Number(formData.get("itemId"));

  if (!Number.isInteger(orderId)) {
    throw new Error("Order id is invalid.");
  }

  if (!Number.isInteger(itemId)) {
    throw new Error("Item id is invalid.");
  }

  await db
    .delete(orderItems)
    .where(and(eq(orderItems.id, itemId), eq(orderItems.orderId, orderId)));

  revalidatePath(`/orders/${orderId}/edit`);
  revalidatePath(`/orders/${orderId}`);
  revalidatePath("/");

  return {
    success: true,
    error: null,
  };
}

export async function updateOrderItem(
  _previousState: UpdateOrderItemState,
  formData: FormData,
): Promise<UpdateOrderItemState> {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    throw new Error("You must be signed in to edit order items.");
  }

  if (!canEditOrder(currentUser.role)) {
    throw new Error("You are not allowed to edit orders.");
  }

  const orderId = Number(formData.get("orderId"));
  const itemId = Number(formData.get("itemId"));
  const itemName = String(formData.get("itemName") ?? "");
  const quantity = Number(formData.get("quantity"));
  const unit = String(formData.get("unit") ?? "");
  const materialType = String(formData.get("materialType") ?? "");
  const thicknessMm = Number(formData.get("thicknessMm"));

  if (!Number.isInteger(orderId)) {
    throw new Error("Order id is invalid.");
  }

  if (!Number.isInteger(itemId)) {
    throw new Error("Item id is invalid.");
  }

  if (itemName.trim() === "") {
    return {
      success: false,
      error: "Item name is required.",
      errorField: "itemName",
    };
  }

  if (!Number.isInteger(quantity) || quantity < 1) {
    return {
      success: false,
      error: "Quantity must be at least 1.",
      errorField: "quantity",
    };
  }

  if (!isUnitType(unit)) {
    return {
      success: false,
      error: "Unit is invalid.",
      errorField: "unit",
    };
  }

  if (!isMaterialType(materialType)) {
    return {
      success: false,
      error: "Material is invalid.",
      errorField: "materialType",
    };
  }

  if (!isThicknessOption(thicknessMm)) {
    return {
      success: false,
      error: "Thickness is invalid.",
      errorField: "thicknessMm",
    };
  }

  await db
    .update(orderItems)
    .set({
      name: itemName.trim(),
      quantity,
      unit,
      materialType,
      thicknessMm,
    })
    .where(and(eq(orderItems.id, itemId), eq(orderItems.orderId, orderId)));

  revalidatePath(`/orders/${orderId}/edit`);
  revalidatePath(`/orders/${orderId}`);
  revalidatePath("/");

  return {
    success: true,
    error: null,
  };
}
