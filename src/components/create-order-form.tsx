"use client";
import type { SubmitEvent } from "react";
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
  FieldError,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  MinusIcon,
  PlusIcon,
  Trash2Icon,
  ArrowRightIcon,
  CircleCheckIcon,
  LoaderCircleIcon,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type DraftListItem = OrderItemDraft & {
  clientId: string;
};

const unitItems = unitOptions.map((unit) => ({
  value: unit,
  label: unitOptionLabels[unit],
}));

const materialItems = materialOptions.map((material) => ({
  value: material,
  label: material,
}));

const thicknessItems = thicknessOptions.map((thickness) => ({
  value: String(thickness),
  label: `${thickness} mm`,
}));

type AddedOrderItemRowProps = {
  item: DraftListItem;
  index: number;
  onRemove: (clientId: string) => void;
};

function AddedOrderItemRow({ item, index, onRemove }: AddedOrderItemRowProps) {
  return (
    <li className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3 gap-y-1 px-4 py-3 md:grid-cols-[auto_minmax(0,1fr)_5rem_4rem_4rem_auto] md:gap-x-4">
      <span className="text-sm tabular-nums text-muted-foreground">
        {index + 1}.
      </span>
      <h3 className="truncate font-medium text-foreground">{item.name}</h3>

      <div className="col-start-2 flex flex-wrap gap-x-4 text-sm text-muted-foreground md:contents">
        <span className="whitespace-nowrap">
          {item.quantity} {unitLabels[item.unit]}
        </span>

        <span className="whitespace-nowrap">{item.materialType}</span>

        <span className="whitespace-nowrap">{item.thicknessMm} mm</span>
      </div>

      <Button
        type="button"
        variant="destructive"
        size="sm"
        onClick={() => onRemove(item.clientId)}
        className="col-span-2 mt-2 w-full md:col-span-1 md:mt-0 md:w-auto"
      >
        <Trash2Icon aria-hidden="true" data-icon="inline-start" />
        Remove
      </Button>
    </li>
  );
}

type AddedOrderItemsSectionProps = {
  items: DraftListItem[];
  onRemove: (clientId: string) => void;
};

function AddedOrderItemsSection({
  items,
  onRemove,
}: AddedOrderItemsSectionProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="added-items-heading" className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h2
          id="added-items-heading"
          className="text-lg font-semibold text-foreground"
        >
          Added items
        </h2>

        <Badge variant="secondary">
          {items.length} item{items.length === 1 ? "" : "s"}
        </Badge>
      </div>
      <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border">
        {items.map((item, index) => (
          <AddedOrderItemRow
            key={item.clientId}
            item={item}
            index={index}
            onRemove={onRemove}
          />
        ))}
      </ul>
    </section>
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
  const [itemFormResetKey, setItemFormResetKey] = useState(0);
  const todayDateInputValue = new Date().toISOString().slice(0, 10);

  function handleAddItem(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
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
      setItemFormResetKey((currentKey) => currentKey + 1);
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
    <div
      onChange={() => {
        setSuccessMessage("");
        setCreatedOrderId("");
        setFormError("");
      }}
      className="mt-8 space-y-8 rounded-lg border border-border bg-card p-4 sm:p-6"
    >
      <form id="create-order-form" ref={formRef} onSubmit={handleSubmit}>
        <FieldSet>
          <FieldLegend className="mb-2 text-lg font-semibold text-foreground">
            Order details
          </FieldLegend>

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
              <FieldLabel htmlFor="productionNotes">
                Production notes
              </FieldLabel>
              <Textarea
                id="productionNotes"
                name="productionNotes"
                rows={4}
                placeholder="General production information for the whole order"
              />
            </Field>
          </FieldGroup>
        </FieldSet>
      </form>

      <form key={itemFormResetKey} onSubmit={handleAddItem}>
        <FieldSet className="rounded-lg border border-border bg-muted/20 p-4 sm:p-5">
          <FieldLegend className="px-2">Add order item</FieldLegend>

          <Field>
            <FieldLabel htmlFor="itemName">Item name</FieldLabel>
            <Input
              ref={itemNameInputRef}
              id="itemName"
              name="itemName"
              type="text"
              required
            />
          </Field>

          <FieldGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <Field>
              <FieldLabel htmlFor="quantity">Quantity</FieldLabel>

              <InputGroup>
                <InputGroupAddon>
                  <InputGroupButton
                    type="button"
                    aria-label="Decrease quantity"
                    disabled={quantity === 1}
                    onClick={() => {
                      setQuantity((currentQuantity) =>
                        Math.max(1, currentQuantity - 1),
                      );
                    }}
                  >
                    <MinusIcon aria-hidden="true" />
                  </InputGroupButton>
                </InputGroupAddon>

                <InputGroupInput
                  value={quantity}
                  onChange={(event) => {
                    const nextQuantity = event.currentTarget.valueAsNumber;

                    if (!Number.isNaN(nextQuantity)) {
                      setQuantity(Math.max(1, nextQuantity));
                    }
                  }}
                  className="text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  id="quantity"
                  name="quantity"
                  type="number"
                  min={1}
                  required
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    type="button"
                    aria-label="Increase quantity"
                    onClick={() => {
                      setQuantity((currentQuantity) => currentQuantity + 1);
                    }}
                  >
                    <PlusIcon aria-hidden="true" />
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            </Field>

            <Field>
              <FieldLabel htmlFor="unit">Unit</FieldLabel>

              <Select items={unitItems} name="unit" defaultValue="PCS" required>
                <SelectTrigger id="unit" className="w-full">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>

                <SelectContent>
                  <SelectGroup>
                    {unitItems.map((unit) => (
                      <SelectItem key={unit.value} value={unit.value}>
                        {unit.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel htmlFor="materialType">Material</FieldLabel>
              <Select items={materialItems} name="materialType" required>
                <SelectTrigger id="materialType" className="w-full">
                  <SelectValue placeholder="Select material" />
                </SelectTrigger>

                <SelectContent>
                  <SelectGroup>
                    {materialItems.map((material) => (
                      <SelectItem key={material.value} value={material.value}>
                        {material.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel htmlFor="thicknessMm">Thickness</FieldLabel>
              <Select items={thicknessItems} name="thicknessMm" required>
                <SelectTrigger id="thicknessMm" className="w-full">
                  <SelectValue placeholder="Select thickness" />
                </SelectTrigger>

                <SelectContent>
                  <SelectGroup>
                    {thicknessItems.map((thickness) => (
                      <SelectItem key={thickness.value} value={thickness.value}>
                        {thickness.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>
          <div className="flex justify-end border-t border-border pt-4">
            <Button type="submit" size="lg" className="w-full sm:w-auto">
              <PlusIcon aria-hidden="true" data-icon="inline-start" />
              Add item
            </Button>
          </div>
        </FieldSet>
      </form>

      <AddedOrderItemsSection items={items} onRemove={handleRemoveItem} />

      {formError && (
        <FieldError id="create-order-error">{formError}</FieldError>
      )}

      {successMessage && (
        <div
          role="status"
          className="flex flex-col gap-3 rounded-lg border border-success/40 bg-success/10 p-3 text-sm text-success sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-center gap-2">
            <CircleCheckIcon aria-hidden="true" className="size-4 shrink-0" />
            <p>{successMessage}</p>
          </div>

          {createdOrderId && (
            <Link
              href={`/orders/${createdOrderId}`}
              className={buttonVariants({
                variant: "success",
                size: "sm",
              })}
            >
              View order
              <ArrowRightIcon aria-hidden="true" data-icon="inline-end" />
            </Link>
          )}
        </div>
      )}

      <div className="flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          {successMessage
            ? "The order was created successfully."
            : items.length === 0
              ? "Add at least one order item before creating the order."
              : "Review the details before creating the order."}
        </p>

        <Button
          form="create-order-form"
          type="submit"
          size="lg"
          variant={successMessage ? "success" : "default"}
          disabled={Boolean(successMessage) || isSubmitting}
          aria-busy={isSubmitting}
          className="w-full sm:w-auto"
        >
          {isSubmitting ? (
            <>
              <LoaderCircleIcon
                aria-hidden="true"
                data-icon="inline-start"
                className="animate-spin"
              />
              Creating...
            </>
          ) : successMessage ? (
            <>
              <CircleCheckIcon aria-hidden="true" data-icon="inline-start" />
              Order created
            </>
          ) : (
            <>
              <PlusIcon aria-hidden="true" data-icon="inline-start" />
              Create order
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
