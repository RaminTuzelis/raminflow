import { getOrderById } from "@/db/queries";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  dateFormatter,
  dateTimeFormatter,
  unitLabels,
} from "@/lib/order-display";
import { OrderStatusBadge } from "@/components/order-status-badge";

type OrderDetailsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function OrderDetailsPage({
  params,
}: OrderDetailsPageProps) {
  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="text-sm font-medium text-sky-400 hover:text-sky-300"
      >
        Back to orders
      </Link>
      <h1 className="mt-4 text-2xl font-semibold text-white">
        {order.orderNumber}
      </h1>
      <p className="mt-4 text-slate-400">{order.projectName}</p>
      <dl className="mt-6 grid gap-4 border-y border-slate-800 py-4 sm:grid-cols-3">
        <div>
          <dt className="text-xs font-medium uppercase text-slate-500">
            Status
          </dt>
          <dd className="mt-1 text-sm text-slate-200">
            <OrderStatusBadge status={order.status} />
          </dd>
        </div>

        <div>
          <dt className="text-xs font-medium uppercase text-slate-500">
            Deadline
          </dt>
          <dd className="mt-1 text-sm text-slate-200">
            {dateFormatter.format(new Date(order.deadline))}
          </dd>
        </div>

        <div>
          <dt className="text-xs font-medium uppercase text-slate-500">
            Last updated
          </dt>
          <dd className="mt-1 text-sm text-slate-200">
            {dateTimeFormatter.format(new Date(order.updatedAt))}
          </dd>
        </div>
      </dl>

      {order.productionNotes && (
        <section className="mt-8 rounded-lg border border-slate-800 bg-slate-900/50 p-4">
          <h2 className="text-sm font-semibold uppercase text-slate-500">
            Production notes
          </h2>
          <p className="mt-2 whitespace-pre-wrap text-sm text-slate-200">
            {order.productionNotes}
          </p>
        </section>
      )}

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-white">Order items</h2>
        <div className="mt-4 overflow-hidden rounded-lg border border-slate-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-950 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">#</th>
                <th className="px-4 py-3 font-medium">Item</th>
                <th className="px-4 py-3 font-medium">Quantity</th>
                <th className="px-4 py-3 font-medium">Material</th>
                <th className="px-4 py-3 font-medium">Thickness</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 bg-slate-900/50">
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
