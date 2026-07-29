import { getCurrentUser } from "@/lib/current-user";
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
import { ArrowLeftIcon, XIcon } from "lucide-react";
import {
  Field,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

type EditOrderPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditOrderPage({ params }: EditOrderPageProps) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  if (!canEditOrder(currentUser.role)) {
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
        className="inline-flex items-center gap-2 text-sm font-medium text-primary transition hover:text-[color-mix(in_oklch,var(--primary),var(--foreground)_25%)]"
      >
        <ArrowLeftIcon aria-hidden="true" className="size-4" />
        Back to order
      </Link>

      <header className="mt-5">
        <p className="border-l-2 border-primary pl-2 text-sm font-semibold uppercase text-muted-foreground">
          Edit order
        </p>

        <h1 className="mt-4 text-3xl font-bold text-foreground">
          {order.orderNumber}
        </h1>

        <p className="mt-2 text-base text-muted-foreground">
          {order.projectName}
        </p>
      </header>

      <div className="mt-8 grid gap-8">
        <form
          action={updateOrderHeader}
          className="space-y-5 rounded-lg border bg-card p-6 text-card-foreground shadow-sm"
        >
          <input type="hidden" name="orderId" value={order.id} />
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Order details
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Update the project information, deadline and production notes.
            </p>
          </div>

          <Field>
            <FieldLabel htmlFor="projectName">Project name</FieldLabel>
            <Input
              id="projectName"
              name="projectName"
              type="text"
              defaultValue={order.projectName}
              required
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="deadline">Deadline</FieldLabel>
            <Input
              className="[&::-webkit-calendar-picker-indicator]:invert"
              id="deadline"
              name="deadline"
              type="date"
              defaultValue={deadlineInputValue}
              required
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="productionNotes">Production notes</FieldLabel>
            <Textarea
              id="productionNotes"
              name="productionNotes"
              rows={5}
              defaultValue={order.productionNotes}
            />
          </Field>

          <div className="flex flex-col gap-3 border-t pt-5 sm:flex-row sm:items-center sm:justify-end">
            <Link
              href={`/orders/${order.id}`}
              className={buttonVariants({ variant: "outline" })}
            >
              <XIcon data-icon="inline-start" />
              Cancel
            </Link>
            <OrderEditSubmitButton />
          </div>
        </form>

        <section className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <div className="border-b pb-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  Order items
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Add and review production items for this order.
                </p>
              </div>

              <Badge variant="secondary">
                {order.items.length} item
                {order.items.length === 1 ? "" : "s"}
              </Badge>
            </div>
          </div>

          <form action={addOrderItem} className="mt-6">
            <input type="hidden" name="orderId" value={order.id} />
            <FieldSet className="rounded-lg border p-5">
              <FieldLegend className="px-2">Add item</FieldLegend>

              <div className="grid gap-4">
                <Field>
                  <FieldLabel htmlFor="itemName">Item name</FieldLabel>
                  <Input id="itemName" name="itemName" type="text" required />
                </Field>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[0.8fr_1.0fr_1.2fr_1.2fr]">
                  <Field>
                    <FieldLabel htmlFor="quantity">Quantity</FieldLabel>
                    <Input
                      id="quantity"
                      name="quantity"
                      type="number"
                      min={1}
                      defaultValue={1}
                      required
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="unit">Unit</FieldLabel>
                    <Select
                      items={unitItems}
                      name="unit"
                      defaultValue="PCS"
                      required
                    >
                      <SelectTrigger id="unit" className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {unitItems.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
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
                            <SelectItem
                              key={material.value}
                              value={material.value}
                            >
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
                            <SelectItem
                              key={thickness.value}
                              value={thickness.value}
                            >
                              {thickness.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                </div>
                <OrderEditAddItemSubmitButton />
              </div>
            </FieldSet>
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
