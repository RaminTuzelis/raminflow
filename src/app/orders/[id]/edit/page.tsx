import { auth } from "@/auth";
import { getOrderById } from "@/db/queries";
import { canEditOrder } from "@/lib/permissions";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  addOrderItem,
  removeOrderItem,
  updateOrderHeader,
  updateOrderItem,
} from "@/app/orders/[id]/edit/actions";
import { OrderEditSubmitButton } from "@/components/order-edit-submit-button";
import { OrderEditAddItemSubmitButton } from "@/components/order-edit-add-item-submit-button";
import { OrderEditItemsTable } from "@/components/order-edit-items-table";
import {
  materialOptions,
  thicknessOptions,
  unitOptions,
} from "@/lib/order-options";
import { unitOptionLabels } from "@/lib/order-display";

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
    <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href={`/orders/${order.id}`}
        className="inline-flex items-center gap-2 text-sm font-medium text-sky-400 transition hover:text-sky-300"
      >
        <span aria-hidden="true">←</span>
        Back to order
      </Link>

      <div className="mt-6 grid gap-8">
        <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 shadow-sm">
          <div className="border-b border-slate-800 pb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Edit order
            </p>

            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-white">
                  {order.orderNumber}
                </h1>
                <p className="mt-2 text-sm text-slate-400">
                  {order.projectName}
                </p>
              </div>

              <span className="w-fit rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-xs font-medium text-slate-400">
                Header details
              </span>
            </div>
          </div>

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
                className={`${fieldClassName} min-h-36 resize-y`}
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

        <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 shadow-sm">
          <div className="border-b border-slate-800 pb-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">
                  Order items
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Add and review production items for this order.
                </p>
              </div>

              <span className="w-fit rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-xs font-medium text-slate-400">
                {order.items.length} item
                {order.items.length === 1 ? "" : "s"}
              </span>
            </div>
          </div>

          <form action={addOrderItem} className="mt-6">
            <fieldset className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5">
              <legend className="px-2 text-sm font-semibold uppercase tracking-wider text-slate-500">
                Add item
              </legend>

              <input type="hidden" name="orderId" value={order.id} />

              <div className="grid gap-4">
                <div className="grid gap-2">
                  <label className={labelClassName} htmlFor="itemName">
                    Item name
                  </label>
                  <input
                    className={fieldClassName}
                    id="itemName"
                    name="itemName"
                    type="text"
                    required
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[0.8fr_1.0fr_1.2fr_1.2fr]">
                  <div className="grid gap-2">
                    <label className={labelClassName} htmlFor="quantity">
                      Quantity
                    </label>
                    <input
                      className={fieldClassName}
                      id="quantity"
                      name="quantity"
                      type="number"
                      min={1}
                      defaultValue={1}
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <label className={labelClassName} htmlFor="unit">
                      Unit
                    </label>
                    <select
                      className={fieldClassName}
                      id="unit"
                      name="unit"
                      defaultValue="PCS"
                      required
                    >
                      {unitOptions.map((unit) => (
                        <option key={unit} value={unit}>
                          {unitOptionLabels[unit]}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid gap-2">
                    <label className={labelClassName} htmlFor="materialType">
                      Material
                    </label>
                    <select
                      className={fieldClassName}
                      id="materialType"
                      name="materialType"
                      defaultValue=""
                      required
                    >
                      <option value="" disabled>
                        Select material
                      </option>
                      {materialOptions.map((material) => (
                        <option key={material} value={material}>
                          {material}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid gap-2">
                    <label className={labelClassName} htmlFor="thicknessMm">
                      Thickness
                    </label>
                    <select
                      className={fieldClassName}
                      id="thicknessMm"
                      name="thicknessMm"
                      defaultValue=""
                      required
                    >
                      <option value="" disabled>
                        Select thickness
                      </option>
                      {thicknessOptions.map((thickness) => (
                        <option key={thickness} value={thickness}>
                          {thickness} mm
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <OrderEditAddItemSubmitButton />
              </div>
            </fieldset>
          </form>
          <OrderEditItemsTable
            orderId={order.id}
            items={order.items}
            removeAction={removeOrderItem}
            updateAction={updateOrderItem}
          />
        </section>
      </div>
    </main>
  );
}
