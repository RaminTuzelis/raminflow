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
import { auth } from "@/auth";
import { canUpdateOrderStatus, canEditOrder } from "@/lib/permissions";

type OrderDetailsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function OrderDetailsPage({
  params,
}: OrderDetailsPageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const canUpdateStatus = canUpdateOrderStatus(session.user.role);
  const canEdit = canEditOrder(session.user.role);

  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="text-sm font-medium text-sky-400 transition hover:text-sky-300"
      >
        ← Back to orders
      </Link>

      <section className="mt-6 rounded-lg border border-slate-800 bg-slate-900/40 p-6 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              {order.orderNumber}
            </h1>

            <p className="mt-2 text-lg text-slate-400">{order.projectName}</p>

            <div className="mt-5">
              <OrderStatusBadge status={order.status} />
            </div>
            {canEdit && (
              <Link
                href={`/orders/${order.id}/edit`}
                className="mt-4 inline-flex items-center justify-center rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-sky-500 hover:text-sky-300"
              >
                Edit order
              </Link>
            )}
          </div>

          <form action={updateOrderStatus} className="lg:min-w-80">
            <input type="hidden" name="orderId" value={order.id} />

            <label
              htmlFor="status"
              className="text-xs font-semibold uppercase tracking-wider text-slate-500"
            >
              Update status
            </label>

            <div className="mt-2 flex gap-2">
              <select
                id="status"
                key={order.status}
                name="status"
                defaultValue={order.status}
                disabled={!canUpdateStatus}
                className="min-w-44 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-sky-500 disabled:cursor-not-allowed disabled:border-slate-800 disabled:text-slate-500"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {statusLabels[status]}
                  </option>
                ))}
              </select>

              <StatusUpdateSubmitButton disabled={!canUpdateStatus} />
            </div>

            {!canUpdateStatus && (
              <p className="mt-2 text-xs text-slate-500">
                Your role can view this order, but cannot update its status.
              </p>
            )}
          </form>
        </div>

        <dl className="mt-8 grid gap-6 border-t border-slate-800 pt-6 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Deadline
            </dt>

            <dd className="mt-1 text-base text-slate-200">
              {dateFormatter.format(new Date(order.deadline))}
            </dd>
          </div>

          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Last updated
            </dt>

            <dd className="mt-1 text-base text-slate-200">
              {dateTimeFormatter.format(new Date(order.updatedAt))}
            </dd>
          </div>
        </dl>
      </section>

      <section className="mt-8 rounded-lg border border-slate-800 bg-slate-900/40 p-5">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
            Status history
          </h2>

          <span className="text-xs text-slate-500">
            {order.statusHistory.length} change
            {order.statusHistory.length === 1 ? "" : "s"}
          </span>
        </div>

        {order.statusHistory.length === 0 ? (
          <p className="mt-3 text-sm text-slate-400">
            No status changes recorded yet.
          </p>
        ) : (
          <ol className="mt-4 divide-y divide-slate-800">
            {order.statusHistory.map((entry) => (
              <li
                key={entry.id}
                className="grid gap-3 py-3 sm:grid-cols-[11rem_1fr]"
              >
                <time
                  dateTime={entry.changedAt}
                  className="text-sm text-slate-500"
                >
                  {dateTimeFormatter.format(new Date(entry.changedAt))}
                </time>

                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="text-slate-400">
                    {statusLabels[entry.fromStatus]}
                  </span>
                  <span className="text-slate-600">→</span>
                  <span className="font-medium text-slate-100">
                    {statusLabels[entry.toStatus]}
                  </span>
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>

      {order.productionNotes && (
        <section className="mt-8 rounded-lg border border-slate-800 bg-slate-900/50 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
            Production notes
          </h2>

          <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-200">
            {order.productionNotes}
          </p>
        </section>
      )}

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-white">Order items</h2>

        <div className="mt-4 overflow-hidden rounded-lg border border-slate-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-950 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">#</th>
                <th className="px-4 py-3 font-medium">Item</th>
                <th className="px-4 py-3 font-medium">Quantity</th>
                <th className="px-4 py-3 font-medium">Material</th>
                <th className="px-4 py-3 font-medium">Thickness</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800 bg-slate-900/40">
              {order.items.map((item, index) => (
                <tr key={item.id} className="transition hover:bg-slate-800/60">
                  <td className="px-4 py-3 text-slate-500">{index + 1}</td>

                  <td className="px-4 py-3 font-medium text-white">
                    {item.name}
                  </td>

                  <td className="px-4 py-3 text-slate-300">
                    {item.quantity} {unitLabels[item.unit]}
                  </td>

                  <td className="px-4 py-3 text-slate-300">
                    {item.materialType}
                  </td>

                  <td className="px-4 py-3 text-slate-300">
                    {item.thicknessMm} mm
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
