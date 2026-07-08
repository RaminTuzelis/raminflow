import type {
  materialTypes,
  orderStatuses,
  unitTypes,
} from "@/lib/order-constants";

export type OrderStatus = (typeof orderStatuses)[number];

export type MaterialType = (typeof materialTypes)[number];

export type UnitType = (typeof unitTypes)[number];

export type OrderItem = {
  id: string;
  name: string;
  quantity: number;
  unit: UnitType;
  materialType: MaterialType;
  thicknessMm: number;
};

export type OrderStatusHistory = {
  id: string;
  fromStatus: OrderStatus;
  toStatus: OrderStatus;
  changedAt: string;
};

export type OrderCreator = {
  id: string;
  name: string;
};

export type Order = {
  id: string;
  orderNumber: string;
  projectName: string;
  productionNotes: string;
  deadline: string;
  status: OrderStatus;
  createdBy: OrderCreator;
  updatedAt: string;
  items: OrderItem[];
  statusHistory: OrderStatusHistory[];
};

export type OrderItemDraft = Omit<OrderItem, "id">;

export type OrderDraft = {
  projectName: string;
  productionNotes: string;
  deadline: string;
  items: OrderItemDraft[];
};
