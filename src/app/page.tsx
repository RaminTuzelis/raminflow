import { orders } from "@/data/orders";
import Link from "next/link";
import { dateFormatter, dateTimeFormatter } from "@/lib/order-display";
import { OrderStatusBadge } from "@/components/order-status-badge";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-semibold text-white">Orders</h1>
      <div className="overflow-x-auto rounded-lg border border-slate-800">
        <table className="w-full min-w-190 border-collapse text-left text-sm">
          <thead className="bg-slate-900 text-slate-400">
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
                className="transition-colors hover:bg-slate-900/60"
              >
                <td className="px-4 py-4">
                  <Link
                    href={`/orders/${order.id}`}
                    className="font-medium text-sky-400 hover:text-sky-300"
                  >
                    {order.orderNumber}
                  </Link>
                </td>
                <td className="px-4 py-4">{order.projectName}</td>

                <td className="px-4 py-4">
                  {dateFormatter.format(new Date(order.deadline))}
                </td>
                <td className="px-4 py-4">{order.items.length}</td>
                <td className="px-4 py-4">
                  <OrderStatusBadge status={order.status} />
                </td>
                <td className="px-4 py-4">
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
