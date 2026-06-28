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

        <div className="mt-4 grid gap-4">
          {order.items.map((item) => (
            <article
              key={item.id}
              className="rounded-lg border border-slate-800 bg-slate-900/50 p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-medium text-white">{item.name}</h3>
                <span className="text-sm text-slate-400">
                  Quantity: {item.quantity} {unitLabels[item.unit]}
                </span>
              </div>
              <dl className="mt-4 flex gap-6 rounded-md bg-slate-950 px-3 py-2 text-sm">
                <div>
                  <dt className="text-xs uppercase text-slate-500">Material</dt>
                  <dd className="mt-1 text-slate-200">{item.materialType}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase text-slate-500">
                    Thickness
                  </dt>
                  <dd className="mt-1 text-slate-200">{item.thicknessMm} mm</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
