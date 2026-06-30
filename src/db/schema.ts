import { materialTypes, orderStatuses, unitTypes } from "@/lib/order-constants";

import {
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const orderStatus = pgEnum("order_status", orderStatuses);

export const materialType = pgEnum("material_type", materialTypes);

export const unitType = pgEnum("unit_type", unitTypes);

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  projectName: text("project_name").notNull(),
  productionNotes: text("production_notes").notNull().default(""),
  deadline: timestamp("deadline", { mode: "date" }).notNull(),
  status: orderStatus("status").notNull().default("DRAFT"),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  quantity: integer("quantity").notNull(),
  unit: unitType("unit").notNull().default("PCS"),
  materialType: materialType("material_type").notNull(),
  thicknessMm: integer("thickness_mm").notNull(),
});

export const orderStatusHistory = pgTable("order_status_history", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  fromStatus: orderStatus("from_status").notNull(),
  toStatus: orderStatus("to_status").notNull(),
  changedAt: timestamp("changed_at", { mode: "date" }).notNull().defaultNow(),
});
