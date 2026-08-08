"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  materialOptions,
  thicknessOptions,
  unitOptions,
} from "@/lib/order-options";
import type { MaterialType, UnitType } from "@/types/order";
import { unitOptionLabels } from "@/lib/order-display";
import { PlusIcon, MinusIcon } from "lucide-react";
import { useRef, useState } from "react";
import type { SubmitEvent } from "react";
import type { OrderItemDraft } from "@/types/order";

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

type AddOrderItemFormProps = {
  onAdd: (item: OrderItemDraft) => void;
};

export function AddOrderItemForm({ onAdd }: AddOrderItemFormProps) {
  const [quantity, setQuantity] = useState(1);
  const itemNameInputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const newItem: OrderItemDraft = {
      name: String(formData.get("itemName") ?? ""),
      quantity,
      unit: String(formData.get("unit") ?? "") as UnitType,
      materialType: String(formData.get("materialType") ?? "") as MaterialType,
      thicknessMm: Number(formData.get("thicknessMm")),
    };

    onAdd(newItem);
    itemNameInputRef.current?.focus();
    itemNameInputRef.current?.select();
    setQuantity(1);
  }

  return (
    <form onSubmit={handleSubmit}>
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
  );
}
