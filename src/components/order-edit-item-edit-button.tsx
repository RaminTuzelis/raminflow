"use client";

import { useState } from "react";
import type { OrderItem } from "@/types/order";
import {
  materialOptions,
  thicknessOptions,
  unitOptions,
} from "@/lib/order-options";
import { unitOptionLabels } from "@/lib/order-display";

type OrderEditItemEditButtonProps = {
  orderId: string;
  item: OrderItem;
  updateAction: (formData: FormData) => Promise<void>;
};

export function OrderEditItemEditButton({
  orderId,
  item,
  updateAction,
}: OrderEditItemEditButtonProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsEditOpen(true)}
        className="inline-flex items-center justify-center rounded-md border border-sky-500/30 bg-sky-500/5 px-2.5 py-1 text-sm font-semibold text-sky-300 transition hover:border-sky-500/50 hover:bg-sky-500/10 hover:text-sky-200"
      >
        Edit
      </button>

      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 text-left shadow-xl">
            <h2 className="text-lg font-semibold text-white">Edit item</h2>
            <form
              action={updateAction}
              onSubmit={() => setIsEditOpen(false)}
              className="mt-5 space-y-4"
            >
              <input type="hidden" name="orderId" value={orderId} />
              <input type="hidden" name="itemId" value={item.id} />
              <div className="grid gap-2">
                <label
                  htmlFor={`edit-item-name-${item.id}`}
                  className="text-sm font-medium text-slate-200"
                >
                  Item name
                </label>
                <input
                  id={`edit-item-name-${item.id}`}
                  name="itemName"
                  type="text"
                  defaultValue={item.name}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <label
                    htmlFor={`edit-item-quantity-${item.id}`}
                    className="text-sm font-medium text-slate-200"
                  >
                    Quantity
                  </label>
                  <input
                    id={`edit-item-quantity-${item.id}`}
                    name="quantity"
                    type="number"
                    min={1}
                    defaultValue={item.quantity}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <label
                    htmlFor={`edit-item-unit-${item.id}`}
                    className="text-sm font-medium text-slate-200"
                  >
                    Unit
                  </label>
                  <select
                    id={`edit-item-unit-${item.id}`}
                    name="unit"
                    defaultValue={item.unit}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                    required
                  >
                    {unitOptions.map((unit) => (
                      <option key={unit} value={unit}>
                        {unitOptionLabels[unit]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <label
                    htmlFor={`edit-item-material-${item.id}`}
                    className="text-sm font-medium text-slate-200"
                  >
                    Material
                  </label>
                  <select
                    id={`edit-item-material-${item.id}`}
                    name="materialType"
                    defaultValue={item.materialType}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                    required
                  >
                    {materialOptions.map((material) => (
                      <option key={material} value={material}>
                        {material}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid gap-2">
                  <label
                    htmlFor={`edit-item-thickness-${item.id}`}
                    className="text-sm font-medium text-slate-200"
                  >
                    Thickness
                  </label>
                  <select
                    id={`edit-item-thickness-${item.id}`}
                    name="thicknessMm"
                    defaultValue={item.thicknessMm}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                    required
                  >
                    {thicknessOptions.map((thickness) => (
                      <option key={thickness} value={thickness}>
                        {thickness} mm
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-800 pt-5">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-slate-500 hover:text-slate-100"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-lg border border-sky-500/40 bg-sky-500/10 px-4 py-2 text-sm font-semibold text-sky-300 transition hover:bg-sky-500/20"
                >
                  Save changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
