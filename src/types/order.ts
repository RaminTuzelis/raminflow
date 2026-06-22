export type OrderStatus =
  | "DRAFT"
  | "APPROVED_FOR_PRODUCTION"
  | "IN_PRODUCTION"
  | "READY_FOR_DISPATCH"
  | "DISPATCHED"
  | "CANCELLED";

export type OrderItem = {
  id: string;
  name: string;
  quantity: number;
  technicalDescription: string;
  materials: OrderItemMaterial[];
};

export type Order = {
  id: string;
  orderNumber: string;
  projectName: string;
  deadline: string;
  status: OrderStatus;
  updatedAt: string;
  items: OrderItem[];
};

export type MaterialType = "PP" | "PE" | "PVC";

export type OrderItemMaterial = {
  id: string;
  partName?: string;
  materialType: MaterialType;
  thicknessMm: number;
};
