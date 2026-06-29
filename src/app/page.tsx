import { getOrders } from "@/db/queries";
import Link from "next/link";
import { dateFormatter, dateTimeFormatter } from "@/lib/order-display";
import { OrderStatusBadge } from "@/components/order-status-badge";

export default async function Home() {
  const orders = await getOrders();
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wider text-slate-500">
            Production
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-white">
            Orders
          </h1>
        </div>

        <Link
          href="/orders/new"
          className="inline-flex items-center justify-center rounded-lg border border-sky-500/40 bg-sky-500/10 px-4 py-2 text-sm font-semibold text-sky-300 transition hover:bg-sky-500/20"
        >
          Create order
        </Link>
      </div>
      <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-900/30 shadow-sm">
        <table className="w-full min-w-190 border-collapse text-left text-sm">
          <thead className="bg-slate-950/90 text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th scope="col" className="px-4 py-3 font-medium">
                Order
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Project
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Deadline
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Positions
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Status
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Updated
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800">
            {orders.map((order) => (
              <tr
                key={order.id}
                className="transition-colors hover:bg-sky-950/25"
              >
                <td className="px-4 py-5">
                  <Link
                    href={`/orders/${order.id}`}
                    className="font-medium text-sky-400 hover:text-sky-300"
                  >
                    {order.orderNumber}
                  </Link>
                </td>
                <td className="px-4 py-5 font-medium text-slate-100">
                  {order.projectName}
                </td>

                <td className="px-4 py-5">
                  {dateFormatter.format(new Date(order.deadline))}
                </td>
                <td className="px-4 py-5">{order.items.length}</td>
                <td className="px-4 py-5">
                  <OrderStatusBadge status={order.status} />
                </td>
                <td className="px-4 py-5">
                  {dateTimeFormatter.format(new Date(order.updatedAt))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
