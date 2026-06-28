import { desc, eq } from "drizzle-orm";
import { db } from "@/db/client";
import { orderItems, orders } from "@/db/schema";
import type { Order } from "@/types/order";

export async function getOrders(): Promise<Order[]> {
  const orderRows = await db.select().from(orders).orderBy(desc(orders.id));
  const itemRows = await db.select().from(orderItems);

  return orderRows.map((order) => ({
    id: String(order.id),
    orderNumber: order.orderNumber,
    projectName: order.projectName,
    productionNotes: order.productionNotes,
    deadline: order.deadline.toISOString(),
    status: order.status,
    updatedAt: order.updatedAt.toISOString(),
    items: itemRows
      .filter((item) => item.orderId === order.id)
      .map((item) => ({
        id: String(item.id),
        name: item.name,
        quantity: item.quantity,
        unit: item.unit,
        materialType: item.materialType,
        thicknessMm: item.thicknessMm,
      })),
  }));
}

export async function getOrderById(id: string): Promise<Order | null> {
  const orderId = Number(id);

  if (!Number.isInteger(orderId)) {
    return null;
  }

  const [order] = await db
    .select()
    .from(orders)
    .where(eq(orders.id, orderId))
    .limit(1);

  if (!order) {
    return null;
  }

  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, order.id))
    .orderBy(orderItems.id);

  return {
    id: String(order.id),
    orderNumber: order.orderNumber,
    projectName: order.projectName,
    productionNotes: order.productionNotes,
    deadline: order.deadline.toISOString(),
    status: order.status,
    updatedAt: order.updatedAt.toISOString(),
    items: items.map((item) => ({
      id: String(item.id),
      name: item.name,
      quantity: item.quantity,
      unit: item.unit,
      materialType: item.materialType,
      thicknessMm: item.thicknessMm,
    })),
  };
}
