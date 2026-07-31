"use client";

import { useActionState, useState } from "react";
import type { OrderItem } from "@/types/order";
import type {
  UpdateOrderItemAction,
  UpdateOrderItemErrorField,
  UpdateOrderItemState,
} from "@/app/orders/[id]/edit/actions";
import {
  materialOptions,
  thicknessOptions,
  unitOptions,
} from "@/lib/order-options";
import { unitOptionLabels } from "@/lib/order-display";
import { LoaderCircleIcon, PencilIcon, SaveIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const initialState: UpdateOrderItemState = {
  success: false,
  error: null,
};

type OrderEditItemEditButtonProps = {
  orderId: string;
  item: OrderItem;
  updateAction: UpdateOrderItemAction;
};

type OrderEditItemFormProps = OrderEditItemEditButtonProps & {
  onClose: () => void;
  onSuccess: () => void;
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

function OrderEditItemForm({
  orderId,
  item,
  updateAction,
  onClose,
  onSuccess,
}: OrderEditItemFormProps) {
  async function handleUpdate(
    previousState: UpdateOrderItemState,
    formData: FormData,
  ): Promise<UpdateOrderItemState> {
    const result = await updateAction(previousState, formData);

    if (result.success) {
      onSuccess();
    }

    return result;
  }

  const [state, formAction, isPending] = useActionState(
    handleUpdate,
    initialState,
  );
  const [hasEditedAfterSubmit, setHasEditedAfterSubmit] = useState(false);
  const showError = Boolean(state.error) && !hasEditedAfterSubmit && !isPending;
  const errorId = `edit-item-error-${item.id}`;

  function fieldHasError(field: UpdateOrderItemErrorField) {
    return showError && state.errorField === field;
  }

  return (
    <form
      action={formAction}
      onSubmit={() => setHasEditedAfterSubmit(false)}
      onChange={() => setHasEditedAfterSubmit(true)}
      className="mt-5 space-y-4"
      aria-busy={isPending}
    >
      <input type="hidden" name="orderId" value={orderId} />
      <input type="hidden" name="itemId" value={item.id} />

      <Field data-invalid={fieldHasError("itemName")}>
        <FieldLabel htmlFor={`edit-item-name-${item.id}`}>Item name</FieldLabel>
        <Input
          id={`edit-item-name-${item.id}`}
          name="itemName"
          type="text"
          defaultValue={item.name}
          required
          aria-invalid={fieldHasError("itemName")}
          aria-describedby={fieldHasError("itemName") ? errorId : undefined}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field data-invalid={fieldHasError("quantity")}>
          <FieldLabel htmlFor={`edit-item-quantity-${item.id}`}>
            Quantity
          </FieldLabel>
          <Input
            id={`edit-item-quantity-${item.id}`}
            name="quantity"
            type="number"
            min={1}
            defaultValue={item.quantity}
            required
            aria-invalid={fieldHasError("quantity")}
            aria-describedby={fieldHasError("quantity") ? errorId : undefined}
          />
        </Field>

        <Field data-invalid={fieldHasError("unit")}>
          <FieldLabel htmlFor={`edit-item-unit-${item.id}`}>Unit</FieldLabel>
          <Select
            items={unitItems}
            name="unit"
            defaultValue={item.unit}
            required
          >
            <SelectTrigger
              id={`edit-item-unit-${item.id}`}
              className="w-full"
              aria-invalid={fieldHasError("unit")}
              aria-describedby={fieldHasError("unit") ? errorId : undefined}
            >
              <SelectValue />
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
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field data-invalid={fieldHasError("materialType")}>
          <FieldLabel htmlFor={`edit-item-material-${item.id}`}>
            Material
          </FieldLabel>
          <Select
            items={materialItems}
            name="materialType"
            defaultValue={item.materialType}
            required
          >
            <SelectTrigger
              id={`edit-item-material-${item.id}`}
              className="w-full"
              aria-invalid={fieldHasError("materialType")}
              aria-describedby={
                fieldHasError("materialType") ? errorId : undefined
              }
            >
              <SelectValue />
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

        <Field data-invalid={fieldHasError("thicknessMm")}>
          <FieldLabel htmlFor={`edit-item-thickness-${item.id}`}>
            Thickness
          </FieldLabel>
          <Select
            items={thicknessItems}
            name="thicknessMm"
            defaultValue={String(item.thicknessMm)}
            required
          >
            <SelectTrigger
              id={`edit-item-thickness-${item.id}`}
              className="w-full"
              aria-invalid={fieldHasError("thicknessMm")}
              aria-describedby={
                fieldHasError("thicknessMm") ? errorId : undefined
              }
            >
              <SelectValue />
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
      </div>

      {showError && <FieldError id={errorId}>{state.error}</FieldError>}

      <DialogFooter className="border-border border-t pt-5">
        <Button type="button" variant="outline" onClick={onClose}>
          <XIcon aria-hidden="true" data-icon="inline-start" />
          Cancel
        </Button>

        <Button type="submit" disabled={isPending} aria-busy={isPending}>
          {isPending ? (
            <LoaderCircleIcon
              aria-hidden="true"
              data-icon="inline-start"
              className="animate-spin"
            />
          ) : (
            <SaveIcon aria-hidden="true" data-icon="inline-start" />
          )}
          {isPending ? "Saving..." : "Save changes"}
        </Button>
      </DialogFooter>
    </form>
  );
}

export function OrderEditItemEditButton({
  orderId,
  item,
  updateAction,
}: OrderEditItemEditButtonProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
      <DialogTrigger render={<Button variant="secondary" size="sm" />}>
        <PencilIcon aria-hidden="true" data-icon="inline-start" />
        Edit item
      </DialogTrigger>

      {isEditOpen && (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit item</DialogTitle>
            <DialogDescription>
              Update the item quantity and production details.
            </DialogDescription>
          </DialogHeader>
          <OrderEditItemForm
            orderId={orderId}
            item={item}
            updateAction={updateAction}
            onClose={() => setIsEditOpen(false)}
            onSuccess={() => {
              setIsEditOpen(false);
              toast.success("Order item updated successfully.");
            }}
          />
        </DialogContent>
      )}
    </Dialog>
  );
}
