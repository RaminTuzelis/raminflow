import { auth } from "@/auth";
import { getOrderById } from "@/db/queries";
import { canEditOrder } from "@/lib/permissions";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { updateOrderHeader } from "@/app/orders/[id]/edit/actions";
import { OrderEditSubmitButton } from "@/components/order-edit-submit-button";
import { unitLabels } from "@/lib/order-display";

const labelClassName = "text-sm font-medium text-slate-200";

const fieldClassName =
  "w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20";

type EditOrderPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditOrderPage({ params }: EditOrderPageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (!canEditOrder(session.user.role)) {
    redirect("/");
  }

  const { id } = await params;

  const order = await getOrderById(id);

  if (!order) {
    notFound();
  }

  const deadlineInputValue = order.deadline.slice(0, 10);

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href={`/orders/${order.id}`}
        className="inline-flex items-center gap-2 text-sm font-medium text-sky-400 transition hover:text-sky-300"
      >
        <span aria-hidden="true">←</span>
        Back to order
      </Link>

      <section className="mt-6 rounded-lg border border-slate-800 bg-slate-900/40 p-6 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-wider text-slate-500">
          Edit order
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">
          {order.orderNumber}
        </h1>

        <p className="mt-3 text-slate-400">{order.projectName}</p>

        <form action={updateOrderHeader} className="mt-6 space-y-5">
          <input type="hidden" name="orderId" value={order.id} />

          <div className="grid gap-2">
            <label htmlFor="projectName" className={labelClassName}>
              Project name
            </label>
            <input
              className={fieldClassName}
              id="projectName"
              name="projectName"
              type="text"
              defaultValue={order.projectName}
              required
            />
          </div>

          <div className="grid gap-2">
            <label className={labelClassName} htmlFor="deadline">
              Deadline
            </label>
            <input
              className={`${fieldClassName} [&::-webkit-calendar-picker-indicator]:invert`}
              id="deadline"
              name="deadline"
              type="date"
              defaultValue={deadlineInputValue}
              required
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="productionNotes" className={labelClassName}>
              Production notes
            </label>
            <textarea
              className={fieldClassName}
              id="productionNotes"
              name="productionNotes"
              rows={5}
              defaultValue={order.productionNotes}
            />
          </div>

          <div className="flex flex-col gap-3 border-t border-slate-800 pt-5 sm:flex-row sm:items-center sm:justify-end">
            <Link
              href={`/orders/${order.id}`}
              className="inline-flex items-center justify-center rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-slate-500 hover:text-slate-100"
            >
              Cancel
            </Link>
            <OrderEditSubmitButton />
          </div>
        </form>
      </section>
      <section className="mt-8">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-white">Order items</h2>
          <p className="text-sm text-slate-500">
            Items editing will be added later.
          </p>
        </div>
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
