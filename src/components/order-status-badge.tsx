import { statusLabels } from "@/lib/order-display";
import type { OrderStatus } from "@/types/order";
import { Badge } from "@/components/ui/badge";

type OrderStatusBadgeProps = {
  status: OrderStatus;
};

const statusClassNames: Record<OrderStatus, string> = {
  DRAFT: "border-border bg-muted text-muted-foreground",
  APPROVED_FOR_PRODUCTION: "border-primary/40 bg-primary/10 text-primary",
  IN_PRODUCTION: "border-warning/40 bg-warning/10 text-warning",
  READY_FOR_DISPATCH: "border-cyan-400/40 bg-cyan-400/10 text-cyan-300",
  DISPATCHED: "border-success/40 bg-success/10 text-success",
  CANCELLED: "border-destructive/40 bg-destructive/10 text-destructive",
};

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  return (
    <Badge variant="outline" className={statusClassNames[status]}>
      {statusLabels[status]}
    </Badge>
  );
}
