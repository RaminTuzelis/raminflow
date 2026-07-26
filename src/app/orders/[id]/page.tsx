import { getOrderById } from "@/db/queries";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import {
  dateFormatter,
  dateTimeFormatter,
  statusLabels,
  unitLabels,
} from "@/lib/order-display";
import { OrderStatusBadge } from "@/components/order-status-badge";
import { updateOrderStatus } from "./actions";
import { statusOptions } from "@/lib/order-options";
import { StatusUpdateSubmitButton } from "@/components/status-update-submit-button";
import { getCurrentUser } from "@/lib/current-user";
import { canUpdateOrderStatus, canEditOrder } from "@/lib/permissions";
import { ArrowLeftIcon, PencilIcon, ArrowRightIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";

type OrderDetailsPageProps = {
  params: Promise<{ id: string }>;
};

const statusItems = statusOptions.map((status) => ({
  value: status,
  label: statusLabels[status],
}));

export default async function OrderDetailsPage({
  params,
}: OrderDetailsPageProps) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  const canUpdateStatus = canUpdateOrderStatus(currentUser.role);
  const canEdit = canEditOrder(currentUser.role);

  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm font-medium text-primary transition hover:text-[color-mix(in_oklch,var(--primary),var(--foreground)_25%)]"
      >
        <ArrowLeftIcon aria-hidden="true" className="size-4" />
        Back to orders
      </Link>

      <p className="mt-5 border-l-2 border-primary pl-2 text-sm font-semibold uppercase text-muted-foreground">
        Production order
      </p>

      <section className="mt-4">
        <div className="flex flex-col gap-6 min-[720px]:flex-row min-[720px]:items-start min-[720px]:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold whitespace-nowrap text-foreground">
                {order.orderNumber}
              </h1>

              {canEdit && (
                <Link
                  href={`/orders/${order.id}/edit`}
                  className={buttonVariants({
                    variant: "secondary",
                    size: "sm",
                  })}
                >
                  <PencilIcon data-icon="inline-start" />
                  Edit order
                </Link>
              )}
            </div>

            <p className="mt-2 text-base text-muted-foreground">
              {order.projectName}
            </p>

            <div className="mt-4">
              <OrderStatusBadge status={order.status} />
            </div>
          </div>

          {canUpdateStatus && (
            <form
              action={updateOrderStatus}
              className="w-full min-[720px]:w-auto min-[720px]:min-w-80"
            >
              <input type="hidden" name="orderId" value={order.id} />

              <Label
                htmlFor="status"
                className="text-xs font-medium uppercase text-muted-foreground"
              >
                Update status
              </Label>

              <div className="mt-2 flex flex-col gap-2 min-[720px]:flex-row">
                <Select
                  items={statusItems}
                  name="status"
                  defaultValue={order.status}
                  key={order.status}
                  required
                >
                  <SelectTrigger
                    id="status"
                    className="w-full min-[720px]:w-56"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {statusItems.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <StatusUpdateSubmitButton />
              </div>
            </form>
          )}
        </div>

        <dl className="mt-8 grid gap-6 border-t border-border pt-6 sm:grid-cols-3">
          <div>
            <dt className="text-xs font-medium uppercase text-muted-foreground">
              Deadline
            </dt>
            <dd className="mt-1 text-sm font-medium text-foreground">
              {dateFormatter.format(new Date(order.deadline))}
            </dd>
          </div>

          <div>
            <dt className="text-xs font-medium uppercase text-muted-foreground">
              Last updated
            </dt>

            <dd className="mt-1 text-sm font-medium text-foreground">
              {dateTimeFormatter.format(new Date(order.updatedAt))}
            </dd>
          </div>

          <div>
            <dt className="text-xs font-medium uppercase text-muted-foreground">
              Created by
            </dt>
            <dd className="mt-1 text-sm font-medium text-foreground">
              {order.createdBy.name}
            </dd>
          </div>
        </dl>
      </section>

      <section className="mt-8 border-t border-border pt-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-base font-semibold text-foreground">
            Status history
          </h2>

          <span className="text-sm text-muted-foreground">
            {order.statusHistory.length} change
            {order.statusHistory.length === 1 ? "" : "s"}
          </span>
        </div>

        {order.statusHistory.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            No status changes recorded yet.
          </p>
        ) : (
          <ol className="mt-3 divide-y divide-border">
            {order.statusHistory.map((entry) => (
              <li
                key={entry.id}
                className="grid gap-2 py-2.5 sm:grid-cols-[11rem_1fr]"
              >
                <time
                  dateTime={entry.changedAt}
                  className="text-sm text-muted-foreground"
                >
                  {dateTimeFormatter.format(new Date(entry.changedAt))}
                </time>

                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="text-muted-foreground">
                    {statusLabels[entry.fromStatus]}
                  </span>
                  <ArrowRightIcon
                    aria-hidden="true"
                    className="size-4 shrink-0 text-muted-foreground"
                  />

                  <span className="font-medium text-foreground">
                    {statusLabels[entry.toStatus]}
                  </span>
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>

      {order.productionNotes && (
        <section className="mt-8 border-t border-border pt-6">
          <h2 className="text-base font-semibold text-foreground">
            Production notes
          </h2>

          <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
            {order.productionNotes}
          </p>
        </section>
      )}

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-foreground">Order items</h2>

        <div className="mt-4 overflow-hidden rounded-lg border">
          <Table className="min-w-150">
            <TableCaption className="sr-only">Order items</TableCaption>
            <TableHeader className="bg-muted text-xs uppercase">
              <TableRow className="hover:bg-transparent">
                <TableHead scope="col" className="px-4 text-muted-foreground">
                  #
                </TableHead>
                <TableHead scope="col" className="px-4 text-muted-foreground">
                  Item
                </TableHead>
                <TableHead scope="col" className="px-4 text-muted-foreground">
                  Quantity
                </TableHead>
                <TableHead scope="col" className="px-4 text-muted-foreground">
                  Material
                </TableHead>
                <TableHead scope="col" className="px-4 text-muted-foreground">
                  Thickness
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {order.items.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell
                    colSpan={5}
                    className="h-28 px-4 text-center text-muted-foreground"
                  >
                    No order items have been added.
                  </TableCell>
                </TableRow>
              ) : (
                order.items.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell className="px-4 py-3 text-muted-foreground">
                      {index + 1}
                    </TableCell>

                    <TableCell className="px-4 py-3 font-medium text-foreground">
                      {item.name}
                    </TableCell>

                    <TableCell className="px-4 py-3 text-muted-foreground">
                      {item.quantity} {unitLabels[item.unit]}
                    </TableCell>

                    <TableCell className="px-4 py-3 text-muted-foreground">
                      {item.materialType}
                    </TableCell>

                    <TableCell className="px-4 py-3 text-muted-foreground">
                      {item.thicknessMm} mm
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </section>
    </main>
  );
}
