import { desc, eq } from "drizzle-orm";
import { db } from "@/db/client";
import { orderItems, orders, orderStatusHistory, users } from "@/db/schema";
import type { Order } from "@/types/order";

export async function getOrders(): Promise<Order[]> {
  const itemRows = await db.select().from(orderItems);
  const orderRows = await db
    .select({
      order: orders,
      creator: {
        id: users.id,
        name: users.name,
      },
    })
    .from(orders)
    .innerJoin(users, eq(orders.createdByUserId, users.id))
    .orderBy(desc(orders.id));

  return orderRows.map((row) => ({
    id: String(row.order.id),
    orderNumber: row.order.orderNumber,
    projectName: row.order.projectName,
    productionNotes: row.order.productionNotes,
    deadline: row.order.deadline.toISOString(),
    status: row.order.status,
    createdBy: {
      id: String(row.creator.id),
      name: row.creator.name,
    },
    updatedAt: row.order.updatedAt.toISOString(),
    items: itemRows
      .filter((item) => item.orderId === row.order.id)
      .map((item) => ({
        id: String(item.id),
        name: item.name,
        quantity: item.quantity,
        unit: item.unit,
        materialType: item.materialType,
        thicknessMm: item.thicknessMm,
      })),
    statusHistory: [],
  }));
}

export async function getOrderById(id: string): Promise<Order | null> {
  const orderId = Number(id);

  if (!Number.isInteger(orderId)) {
    return null;
  }

  const [orderRow] = await db
    .select({
      order: orders,
      creator: {
        id: users.id,
        name: users.name,
      },
    })
    .from(orders)
    .innerJoin(users, eq(orders.createdByUserId, users.id))
    .where(eq(orders.id, orderId))
    .limit(1);

  if (!orderRow) {
    return null;
  }

  const { order, creator } = orderRow;

  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, order.id))
    .orderBy(orderItems.id);

  const history = await db
    .select()
    .from(orderStatusHistory)
    .where(eq(orderStatusHistory.orderId, order.id))
    .orderBy(orderStatusHistory.changedAt);

  return {
    id: String(order.id),
    orderNumber: order.orderNumber,
    projectName: order.projectName,
    productionNotes: order.productionNotes,
    deadline: order.deadline.toISOString(),
    status: order.status,
    createdBy: {
      id: String(creator.id),
      name: creator.name,
    },
    updatedAt: order.updatedAt.toISOString(),
    items: items.map((item) => ({
      id: String(item.id),
      name: item.name,
      quantity: item.quantity,
      unit: item.unit,
      materialType: item.materialType,
      thicknessMm: item.thicknessMm,
    })),
    statusHistory: history.map((entry) => ({
      id: String(entry.id),
      fromStatus: entry.fromStatus,
      toStatus: entry.toStatus,
      changedAt: entry.changedAt.toISOString(),
    })),
  };
}
