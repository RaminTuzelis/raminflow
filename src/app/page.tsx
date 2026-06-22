import { orders } from "@/data/orders";
import type { OrderStatus } from "@/types/order";
import Link from "next/link";

const dateFormatter = new Intl.DateTimeFormat("lt-LT", {
  dateStyle: "short",
});

const dateTimeFormatter = new Intl.DateTimeFormat("lt-LT", {
  dateStyle: "short",
  timeStyle: "short",
});

const statusLabels: Record<OrderStatus, string> = {
  DRAFT: "Draft",
  APPROVED_FOR_PRODUCTION: "Approved for production",
  IN_PRODUCTION: "In production",
  READY_FOR_DISPATCH: "Ready for dispatch",
  DISPATCHED: "Dispatched",
  CANCELLED: "Cancelled",
};

export default function Home() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
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
                <td className="px-4 py-4">{statusLabels[order.status]}</td>
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
