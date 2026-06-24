export type OrderStatus =
  | "DRAFT"
  | "APPROVED_FOR_PRODUCTION"
  | "IN_PRODUCTION"
  | "READY_FOR_DISPATCH"
  | "DISPATCHED"
  | "CANCELLED";

export type MaterialType = "PP" | "PE" | "PVC";

export type OrderItem = {
  id: string;
  name: string;
  quantity: number;
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
