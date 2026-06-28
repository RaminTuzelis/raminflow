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

export type Order = {
  id: string;
  orderNumber: string;
  projectName: string;
  productionNotes: string;
  deadline: string;
  status: OrderStatus;
  updatedAt: string;
  items: OrderItem[];
};

export type OrderItemDraft = Omit<OrderItem, "id">;

export type OrderDraft = {
  projectName: string;
  productionNotes: string;
  deadline: string;
  items: OrderItemDraft[];
};
