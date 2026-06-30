import type { OrderStatus, UnitType } from "@/types/order";

export const dateFormatter = new Intl.DateTimeFormat("lt-LT", {
  dateStyle: "short",
  timeZone: "Europe/Vilnius",
});

export const dateTimeFormatter = new Intl.DateTimeFormat("lt-LT", {
  dateStyle: "short",
  timeStyle: "short",
  timeZone: "Europe/Vilnius",
});

export const statusLabels: Record<OrderStatus, string> = {
  DRAFT: "Draft",
  APPROVED_FOR_PRODUCTION: "Approved for production",
  IN_PRODUCTION: "In production",
  READY_FOR_DISPATCH: "Ready for dispatch",
  DISPATCHED: "Dispatched",
  CANCELLED: "Cancelled",
};

export const unitLabels: Record<UnitType, string> = {
  PCS: "pcs",
  M: "m",
  M2: "m²",
  KG: "kg",
};

export const unitOptionLabels: Record<UnitType, string> = {
  PCS: "Pieces (pcs)",
  M: "Meters (m)",
  M2: "Square meters (m²)",
  KG: "Kilograms (kg)",
};
