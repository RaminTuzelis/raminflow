import type { OrderItem } from "@/types/order";
import { unitLabels } from "@/lib/order-display";

type OrderEditItemsTableProps = {
  orderId: string;
  items: OrderItem[];
  removeAction: (formData: FormData) => Promise<void>;
};

export function OrderEditItemsTable({
  orderId,
  items,
  removeAction,
}: OrderEditItemsTableProps) {
  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-slate-800">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-950 text-xs uppercase tracking-wider text-slate-500">
          <tr>
            <th className="w-14 px-4 py-3 font-medium">#</th>
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
              <td className="px-4 py-3 text-slate-500">{index + 1}</td>

              <td className="px-4 py-3 font-medium text-white">{item.name}</td>

              <td className="px-4 py-3 text-slate-300">
                {item.quantity} {unitLabels[item.unit]}
              </td>

              <td className="px-4 py-3 text-slate-300">{item.materialType}</td>

              <td className="px-4 py-3 text-slate-300">
                {item.thicknessMm} mm
              </td>

              <td className="px-4 py-3 text-right">
                <form action={removeAction}>
                  <input type="hidden" name="orderId" value={orderId} />
                  <input type="hidden" name="itemId" value={item.id} />
                  <button
                    type="submit"
                    className="text-sm font-medium text-red-400 transition hover:text-red-300"
                  >
                    Remove
                  </button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
