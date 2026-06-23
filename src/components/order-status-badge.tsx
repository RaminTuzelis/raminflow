import { statusLabels } from "@/lib/order-display";
import type { OrderStatus } from "@/types/order";

type OrderStatusBadgeProps = {
  status: OrderStatus;
};

const statusClassNames: Record<OrderStatus, string> = {
  DRAFT: "bg-slate-500/15 text-slate-300 ring-slate-500/30",
  APPROVED_FOR_PRODUCTION: "bg-sky-500/15 text-sky-300 ring-sky-500/30",
  IN_PRODUCTION: "bg-amber-500/15 text-amber-300 ring-amber-500/30",
  READY_FOR_DISPATCH: "bg-cyan-500/15 text-cyan-300 ring-cyan-500/30",
  DISPATCHED: "bg-emerald-500/15 text-emerald-300 ring-emerald-500/30",
  CANCELLED: "bg-red-500/15 text-red-300 ring-red-500/30",
};

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${statusClassNames[status]}`}
    >
      {statusLabels[status]}
    </span>
  );
}
