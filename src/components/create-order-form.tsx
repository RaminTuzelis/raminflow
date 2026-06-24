"use client";
import type { MouseEvent, SubmitEvent } from "react";
import { useState } from "react";
import type { MaterialType, OrderDraft, OrderItemDraft } from "@/types/order";

const labelClassName = "text-sm font-medium text-slate-200";

const fieldClassName =
  "w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20";

type DraftListItem = OrderItemDraft & {
  clientId: string;
};

export function CreateOrderForm() {
  const [quantity, setQuantity] = useState(1);
  const [items, setItems] = useState<DraftListItem[]>([]);

  function handleAddItem(event: MouseEvent<HTMLButtonElement>) {
    const form = event.currentTarget.form;

    if (!form || !form.reportValidity()) {
      return;
    }

    const formData = new FormData(form);
    const newItem: DraftListItem = {
      clientId: crypto.randomUUID(),
      name: String(formData.get("itemName") ?? ""),
      quantity,
      materialType: String(formData.get("materialType") ?? "") as MaterialType,
      thicknessMm: Number(formData.get("thicknessMm")),
    };

    setItems((currentItems) => [...currentItems, newItem]);
  }

  function handleRemoveItem(clientId: string) {
    setItems((currentItems) =>
      currentItems.filter((item) => item.clientId !== clientId),
    );
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const projectName = String(formData.get("projectName") ?? "");
    const productionNotes = String(formData.get("productionNotes") ?? "");
    const deadline = String(formData.get("deadline") ?? "");

    const draftOrder: OrderDraft = {
      projectName,
      productionNotes,
      deadline,
      items,
    };

    console.log(draftOrder);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 space-y-6 rounded-lg border border-slate-800 bg-slate-900/50 p-6"
    >
      <div className="grid gap-2">
        <label className={labelClassName} htmlFor="projectName">
          Project name:
        </label>
        <input
          className={fieldClassName}
          id="projectName"
          type="text"
          name="projectName"
          required
        />
      </div>
      <div className="grid gap-2">
        <label className={labelClassName} htmlFor="deadline">
          Deadline:
        </label>
        <input
          className={fieldClassName}
          id="deadline"
          type="date"
          name="deadline"
          required
        />
      </div>

      <div className="grid gap-2">
        <label className={labelClassName} htmlFor="productionNotes">
          Production notes
        </label>
        <textarea
          className={fieldClassName}
          id="productionNotes"
          name="productionNotes"
          rows={4}
          placeholder="General production information for the whole order"
        />
      </div>

      <fieldset className="space-y-4 border-t border-slate-800 pt-6">
        <legend className="px-2 text-lg font-medium text-white">
          Order item
        </legend>
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

        <div className="grid gap-2">
          <label className={labelClassName} htmlFor="quantity">
            Quantity
          </label>

          <div className="flex">
            <button
              type="button"
              aria-label="Decrease quantity"
              disabled={quantity === 1}
              onClick={() => {
                setQuantity((currentQuantity) =>
                  Math.max(1, currentQuantity - 1),
                );
              }}
              className="rounded-l-md border border-slate-700 bg-slate-900 px-4 text-slate-200 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              -
            </button>
            <input
              value={quantity}
              onChange={(event) => {
                const nextQuantity = event.currentTarget.valueAsNumber;

                if (!Number.isNaN(nextQuantity)) {
                  setQuantity(Math.max(1, nextQuantity));
                }
              }}
              className="min-w-0 flex-1 border-y border-slate-700 bg-slate-950 px-3 py-2 text-center text-slate-100 outline-none [appearance:textfield] focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              id="quantity"
              name="quantity"
              type="number"
              min={1}
              required
            />
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() => {
                setQuantity((currentQuantity) => currentQuantity + 1);
              }}
              className="rounded-r-md border border-slate-700 bg-slate-900 px-4 text-slate-200 transition hover:bg-slate-800"
            >
              +
            </button>
          </div>
        </div>

        <div className="grid gap-2">
          <label className={labelClassName} htmlFor="materialType">
            Material
          </label>
          <select
            className={fieldClassName}
            name="materialType"
            id="materialType"
            defaultValue=""
            required
          >
            <option value="" disabled>
              Select material
            </option>
            <option value="PP">PP</option>
            <option value="PE">PE</option>
            <option value="PVC">PVC</option>
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
            <option value="3">3 mm</option>
            <option value="4">4 mm</option>
            <option value="5">5 mm</option>
            <option value="6">6 mm</option>
            <option value="8">8 mm</option>
            <option value="10">10 mm</option>
            <option value="12">12 mm</option>
            <option value="15">15 mm</option>
            <option value="20">20 mm</option>
            <option value="25">25 mm</option>
          </select>
        </div>

        <button
          type="button"
          onClick={handleAddItem}
          className="rounded-md border border-sky-500 px-4 py-2 font-medium text-sky-300 transition hover:bg-sky-500/10"
        >
          Add item
        </button>
      </fieldset>

      {items.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-medium text-white">Added items</h2>

          <div className="space-y-3">
            {items.map((item, index) => (
              <article
                key={item.clientId}
                className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-md border border-slate-700 bg-slate-950/60 px-4 py-3"
              >
                <span className="text-xs font-medium text-sky-300">
                  #{index + 1}
                </span>

                <h3 className="min-w-40 flex-1 truncate font-medium text-white">
                  {item.name}
                </h3>

                <span className="text-sm text-slate-300">
                  {item.quantity} pcs
                </span>

                <span className="text-sm text-slate-300">
                  {item.materialType}
                </span>

                <span className="text-sm text-slate-300">
                  {item.thicknessMm} mm
                </span>

                <button
                  type="button"
                  onClick={() => handleRemoveItem(item.clientId)}
                  className="text-sm text-red-400 transition hover:text-red-300"
                >
                  Remove
                </button>
              </article>
            ))}
          </div>
        </section>
      )}

      <button
        className="rounded-md bg-sky-500 px-4 py-2 font-medium text-slate-950 transition hover:bg-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-slate-950"
        type="submit"
      >
        Save draft
      </button>
    </form>
  );
}
