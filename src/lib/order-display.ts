import type { OrderStatus } from "@/types/order";

export const dateFormatter = new Intl.DateTimeFormat("lt-LT", {
  dateStyle: "short",
});

export const dateTimeFormatter = new Intl.DateTimeFormat("lt-LT", {
  dateStyle: "short",
  timeStyle: "short",
});

export const statusLabels: Record<OrderStatus, string> = {
  DRAFT: "Draft",
  APPROVED_FOR_PRODUCTION: "Approved for production",
  IN_PRODUCTION: "In production",
  READY_FOR_DISPATCH: "Ready for dispatch",
  DISPATCHED: "Dispatched",
  CANCELLED: "Cancelled",
};
