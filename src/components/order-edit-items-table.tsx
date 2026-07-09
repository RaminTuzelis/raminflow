import type { OrderItem } from "@/types/order";
import { unitLabels } from "@/lib/order-display";
import { OrderEditRemoveItemButton } from "@/components/order-edit-remove-item-button";
import { OrderEditItemEditButton } from "@/components/order-edit-item-edit-button";

type OrderEditItemsTableProps = {
  orderId: string;
  items: OrderItem[];
  removeAction: (formData: FormData) => Promise<void>;
  updateAction: (formData: FormData) => Promise<void>;
};

export function OrderEditItemsTable({
  orderId,
  items,
  removeAction,
  updateAction,
}: OrderEditItemsTableProps) {
  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-slate-800">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-950 text-xs uppercase tracking-wider text-slate-500">
          <tr>
            <th className="w-16 px-4 py-3 font-medium">#</th>
            <th className="px-4 py-3 font-medium">Item</th>
            <th className="px-4 py-3 font-medium">Quantity</th>
            <th className="px-4 py-3 font-medium">Material</th>
            <th className="px-4 py-3 font-medium">Thickness</th>
            <th className="px-4 py-3 text-right font-medium">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-800 bg-slate-900/40">
          {items.map((item, index) => (
            <tr key={item.id} className="transition hover:bg-slate-800/60">
              <td className="px-4 py-3">
                <span className="text-xs font-medium text-sky-300">
                  {index + 1}
                </span>
              </td>

              <td className="px-4 py-3 font-medium text-white">{item.name}</td>

              <td className="px-4 py-3 text-slate-300">
                {item.quantity} {unitLabels[item.unit]}
              </td>

              <td className="px-4 py-3 text-slate-300">{item.materialType}</td>

              <td className="px-4 py-3 text-slate-300">
                {item.thicknessMm} mm
              </td>

              <td className="px-4 py-3">
                <div className="flex justify-end gap-2">
                  <OrderEditItemEditButton
                    orderId={orderId}
                    item={item}
                    updateAction={updateAction}
                  />
                  <form action={removeAction}>
                    <input type="hidden" name="orderId" value={orderId} />
                    <input type="hidden" name="itemId" value={item.id} />
                    <OrderEditRemoveItemButton />
                  </form>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
