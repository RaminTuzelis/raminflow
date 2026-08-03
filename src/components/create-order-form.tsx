"use client";
import type { MouseEvent, SubmitEvent } from "react";
import { useRef, useState } from "react";
import Link from "next/link";
import { createOrderDraft } from "@/app/orders/new/actions";
import type {
  MaterialType,
  OrderDraft,
  OrderItemDraft,
  UnitType,
} from "@/types/order";
import {
  materialOptions,
  thicknessOptions,
  unitOptions,
} from "@/lib/order-options";
import { unitLabels, unitOptionLabels } from "@/lib/order-display";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";

const labelClassName = "text-sm font-medium text-slate-200";

const fieldClassName =
  "w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20";

type DraftListItem = OrderItemDraft & {
  clientId: string;
};

type AddedOrderItemProps = {
  item: DraftListItem;
  index: number;
  onRemove: (clientId: string) => void;
};

function AddedOrderItem({ item, index, onRemove }: AddedOrderItemProps) {
  return (
    <article className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-lg border border-slate-800 bg-slate-950/40 px-4 py-3">
      <span className="text-xs font-medium text-sky-300">#{index + 1}</span>

      <h3 className="min-w-40 flex-1 truncate font-medium text-white">
        {item.name}
      </h3>

      <span className="text-sm text-slate-300">
        {item.quantity} {unitLabels[item.unit]}
      </span>

      <span className="text-sm text-slate-300">{item.materialType}</span>

      <span className="text-sm text-slate-300">{item.thicknessMm} mm</span>

      <button
        type="button"
        onClick={() => onRemove(item.clientId)}
        className="inline-flex items-center justify-center rounded-md border border-red-500/30 bg-red-500/5 px-3 py-1.5 text-sm font-semibold text-red-300 transition hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-200"
      >
        Remove
      </button>
    </article>
  );
}

export function CreateOrderForm() {
  const [quantity, setQuantity] = useState(1);
  const [items, setItems] = useState<DraftListItem[]>([]);
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState("");
  const itemNameInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const todayDateInputValue = new Date().toISOString().slice(0, 10);

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
      unit: String(formData.get("unit") ?? "") as UnitType,
      materialType: String(formData.get("materialType") ?? "") as MaterialType,
      thicknessMm: Number(formData.get("thicknessMm")),
    };

    setItems((currentItems) => [...currentItems, newItem]);
    setFormError("");
    setSuccessMessage("");
    setCreatedOrderId("");
    itemNameInputRef.current?.focus();
    itemNameInputRef.current?.select();
    setQuantity(1);
  }

  function handleRemoveItem(clientId: string) {
    setItems((currentItems) =>
      currentItems.filter((item) => item.clientId !== clientId),
    );
    setSuccessMessage("");
    setCreatedOrderId("");
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (items.length === 0) {
      setFormError("Add at least one order item before saving.");
      setSuccessMessage("");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const projectName = String(formData.get("projectName") ?? "");
    const productionNotes = String(formData.get("productionNotes") ?? "");
    const deadline = String(formData.get("deadline") ?? "");
    const orderItems: OrderItemDraft[] = items.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      unit: item.unit,
      materialType: item.materialType,
      thicknessMm: item.thicknessMm,
    }));

    const draftOrder: OrderDraft = {
      projectName,
      productionNotes,
      deadline,
      items: orderItems,
    };

    setIsSubmitting(true);
    try {
      const createdOrder = await createOrderDraft(draftOrder);

      if (!createdOrder.success) {
        setSuccessMessage("");
        setFormError(createdOrder.error);
        return;
      }
      setFormError("");
      setCreatedOrderId(createdOrder.order.id);
      setSuccessMessage(`Order ${createdOrder.order.orderNumber} created.`);
      formRef.current?.reset();
      setItems([]);
      setQuantity(1);
    } catch (error) {
      setSuccessMessage("");

      if (error instanceof Error) {
        setFormError(error.message);
        return;
      }

      setFormError("Could not create draft order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      onChange={() => {
        setSuccessMessage("");
        setCreatedOrderId("");
      }}
      className="mt-8 space-y-8 rounded-lg border border-border bg-card p-4 sm:p-6"
    >
      <FieldSet>
        <FieldLegend>Order details</FieldLegend>

        <FieldGroup className="grid gap-5 md:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="projectName">Project name</FieldLabel>
            <Input id="projectName" name="projectName" type="text" required />
          </Field>

          <Field>
            <FieldLabel htmlFor="deadline">Deadline</FieldLabel>
            <Input
              id="deadline"
              name="deadline"
              type="date"
              min={todayDateInputValue}
              className="[&::-webkit-calendar-picker-indicator]:invert"
              required
            />
          </Field>

          <Field className="md:col-span-2">
            <FieldLabel htmlFor="productionNotes">Production notes</FieldLabel>
            <Textarea
              id="productionNotes"
              name="productionNotes"
              rows={4}
              placeholder="General production information for the whole order"
            />
          </Field>
        </FieldGroup>
      </FieldSet>

      <fieldset className="space-y-4 rounded-lg border border-slate-800 bg-slate-950/40 p-5">
        <legend className="px-2 text-sm font-semibold uppercase tracking-wider text-slate-500">
          Add order item
        </legend>
        <div className="grid gap-2">
          <label className={labelClassName} htmlFor="itemName">
            Item name
          </label>
          <input
            ref={itemNameInputRef}
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
          <label className={labelClassName} htmlFor="unit">
            Unit
          </label>
          <select
            className={fieldClassName}
            name="unit"
            id="unit"
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
            name="materialType"
            id="materialType"
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
              <AddedOrderItem
                key={item.clientId}
                item={item}
                index={index}
                onRemove={handleRemoveItem}
              />
            ))}
          </div>
        </section>
      )}
      {formError && (
        <p className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {formError}
        </p>
      )}

      {successMessage && (
        <div className="flex flex-col gap-3 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300 sm:flex-row sm:items-center sm:justify-between">
          <p>{successMessage}</p>

          {createdOrderId && (
            <Link
              href={`/orders/${createdOrderId}`}
              className="font-medium text-emerald-100 underline underline-offset-4 transition hover:text-white"
            >
              View order
            </Link>
          )}
        </div>
      )}

      <div className="flex flex-col gap-3 border-t border-slate-800 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-200">
            {items.length} order item{items.length === 1 ? "" : "s"} added
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Create the order after all required positions are added.
          </p>
        </div>
        <button
          className={`rounded-lg border px-4 py-2 font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 ${
            successMessage
              ? "cursor-not-allowed border-emerald-500/40 bg-emerald-500/10 text-emerald-300 focus:ring-emerald-400"
              : "border-sky-500/40 bg-sky-500/10 text-sky-300 hover:bg-sky-500/20 focus:ring-sky-400"
          }`}
          disabled={Boolean(successMessage) || isSubmitting}
          type="submit"
        >
          {isSubmitting
            ? "Creating..."
            : successMessage
              ? "Order created"
              : "Create order"}
        </button>
      </div>
    </form>
  );
}
