"use client";
import type { SubmitEvent } from "react";
import { useRef, useState } from "react";
import Link from "next/link";
import { createOrderDraft } from "@/app/orders/new/actions";
import type {
  OrderDraft,
  OrderItemDraft,
  MaterialType,
  UnitType,
} from "@/types/order";
import { unitLabels } from "@/lib/order-display";
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
  PlusIcon,
  Trash2Icon,
  ArrowRightIcon,
  CircleCheckIcon,
  FileSpreadsheetIcon,
  LoaderCircleIcon,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AddOrderItemForm } from "@/components/add-order-item-form";
import { OrderImportPreview } from "@/components/order-import-preview";
import {
  IMPORT_NAME_REQUIRED,
  IMPORT_QUANTITY_INVALID,
  parseImportQuantity,
} from "@/lib/order-import";
import {
  isSupportedOrderWorkbook,
  readOrderWorkbook,
  UnsupportedOrderWorkbookError,
} from "@/lib/read-order-workbook";
import { isThicknessOption } from "@/lib/order-options";
import { toast } from "sonner";

type DraftListItem = OrderItemDraft & {
  clientId: string;
};

type AddedOrderItemRowProps = {
  item: DraftListItem;
  index: number;
  onRemove: (clientId: string) => void;
  disabled: boolean;
};

function AddedOrderItemRow({
  item,
  index,
  onRemove,
  disabled,
}: AddedOrderItemRowProps) {
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
        disabled={disabled}
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
  disabled: boolean;
};

function AddedOrderItemsSection({
  items,
  onRemove,
  disabled,
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
            disabled={disabled}
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

const MAX_IMPORT_FILE_SIZE_BYTES = 5 * 1024 * 1024;

export function CreateOrderForm() {
  const [items, setItems] = useState<DraftListItem[]>([]);
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [importError, setImportError] = useState("");
  const [isReadingWorkbook, setIsReadingWorkbook] = useState(false);
  const [importFileName, setImportFileName] = useState("");
  const [importRows, setImportRows] =
    useState<Awaited<ReturnType<typeof readOrderWorkbook>>>(undefined);
  const [defaultMaterial, setDefaultMaterial] = useState<MaterialType | null>(
    null,
  );
  const [defaultThicknessMm, setDefaultThicknessMm] = useState<number | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const [itemFormResetKey, setItemFormResetKey] = useState(0);
  const todayDateInputValue = new Date().toISOString().slice(0, 10);
  const importFileRef = useRef<HTMLInputElement>(null);

  function handleImportThicknessChange(
    rowNumber: number,
    thicknessMm: number | null,
  ) {
    if (thicknessMm === null || !isThicknessOption(thicknessMm)) {
      return;
    }

    setImportRows((currentRows) =>
      currentRows?.map((row) => {
        if (row.rowNumber === rowNumber) {
          const errors = row.errors.filter(
            (error) => error.field !== "thicknessMm",
          );

          return { ...row, thicknessMm, errors };
        }
        return row;
      }),
    );
  }

  function handleImportMaterialChange(
    rowNumber: number,
    materialType: MaterialType | null,
  ) {
    if (materialType === null) {
      return;
    }

    setImportRows((currentRows) =>
      currentRows?.map((row) => {
        if (row.rowNumber === rowNumber) {
          const errors = row.errors.filter(
            (error) => error.field !== "materialType",
          );

          return { ...row, materialType, errors };
        }

        return row;
      }),
    );
  }

  function handleImportUnitChange(rowNumber: number, unit: UnitType | null) {
    if (unit === null) {
      return;
    }

    setImportRows((currentRows) =>
      currentRows?.map((row) => {
        if (row.rowNumber !== rowNumber) {
          return row;
        }

        const errors = row.errors.filter((error) => error.field !== "unit");
        return { ...row, unit, errors };
      }),
    );
  }

  function handleImportNameChange(rowNumber: number, name: string) {
    setImportRows((currentRows) =>
      currentRows?.map((row) => {
        if (row.rowNumber !== rowNumber) {
          return row;
        }

        const errors = row.errors.filter((error) => error.field !== "name");
        if (name.trim() === "") {
          errors.push({
            rowNumber,
            field: "name",
            message: IMPORT_NAME_REQUIRED,
          });
        }

        return { ...row, name, errors };
      }),
    );
  }

  function handleImportQuantityChange(rowNumber: number, quantityText: string) {
    const quantity = parseImportQuantity(quantityText);

    setImportRows((currentRows) =>
      currentRows?.map((row) => {
        if (row.rowNumber !== rowNumber) {
          return row;
        }

        const errors = row.errors.filter((error) => error.field !== "quantity");
        if (quantity === undefined) {
          errors.push({
            rowNumber,
            field: "quantity",
            message: IMPORT_QUANTITY_INVALID,
          });
        }

        return { ...row, quantityText, quantity, errors };
      }),
    );
  }

  function handleAddItem(item: OrderItemDraft) {
    const newItem: DraftListItem = {
      ...item,
      clientId: crypto.randomUUID(),
    };

    setItems((currentItems) => [...currentItems, newItem]);
    setFormError("");
    setSuccessMessage("");
    setCreatedOrderId("");
  }

  function handleAddImportedItems() {
    if (readyItems.length === 0) {
      return;
    }

    const importedItems = readyItems.map((item) => ({
      ...item,
      clientId: crypto.randomUUID(),
    }));

    setItems((currentItems) => [...currentItems, ...importedItems]);

    const addedCount = importedItems.length;
    const itemLabel = addedCount === 1 ? "item" : "items";
    toast.success(`${addedCount} ${itemLabel} added to the draft.`);

    setImportRows((currentRows) =>
      currentRows?.filter((row) => !readyRowNumbers.has(row.rowNumber)),
    );

    if (importedItems.length === importRows?.length) {
      setImportRows(undefined);

      if (importFileRef.current) {
        importFileRef.current.value = "";
      }

      setImportFileName("");
    }

    return;
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

    if (isReadingWorkbook || isSubmitting) {
      return;
    }

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

  const readyRowNumbers = new Set<number>();

  const readyItems: OrderItemDraft[] = [];

  for (const row of importRows ?? []) {
    const { name, quantity, unit } = row;
    const materialType = row.materialType ?? defaultMaterial;
    const thicknessMm = row.thicknessMm ?? defaultThicknessMm;

    if (
      row.errors.length > 0 ||
      quantity === undefined ||
      unit === undefined ||
      thicknessMm === null ||
      materialType === null
    ) {
      continue;
    }

    readyItems.push({
      name: name.trim(),
      quantity,
      unit,
      thicknessMm,
      materialType,
    });
    readyRowNumbers.add(row.rowNumber);
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
        <FieldSet disabled={isSubmitting}>
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
      <Field>
        <div className="flex min-w-0 flex-col gap-4 rounded-xl border border-success/25 bg-success/5 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-success/10 text-success">
              <FileSpreadsheetIcon className="size-5" aria-hidden="true" />
            </span>
            <div className="min-w-0 space-y-1">
              <p className="text-sm font-medium text-foreground">
                Import from Excel
              </p>
              <p id="excelFileHelp" className="text-xs text-muted-foreground">
                Excel files (.xlsx or XML .xls) · Up to 5 MiB
              </p>
              <div aria-live="polite">
                {importFileName && (
                  <p className="text-sm font-medium wrap-anywhere text-success">
                    <span className="sr-only">Selected file: </span>
                    {importFileName}
                  </p>
                )}
              </div>
            </div>
          </div>
          <Button
            type="button"
            variant="success"
            aria-busy={isReadingWorkbook}
            aria-describedby="excelFileHelp"
            disabled={isReadingWorkbook || isSubmitting}
            onClick={() => importFileRef.current?.click()}
          >
            {isReadingWorkbook ? (
              <>
                <LoaderCircleIcon
                  aria-hidden="true"
                  data-icon="inline-start"
                  className="animate-spin"
                />
                Reading workbook...
              </>
            ) : (
              "Choose Excel file"
            )}
          </Button>
        </div>
        <Input
          onChange={async (event) => {
            setImportError("");
            setImportRows(undefined);
            setDefaultMaterial(null);
            setDefaultThicknessMm(null);
            if (isSubmitting) {
              return;
            }
            const file = event.currentTarget.files?.[0];

            if (file) {
              setImportFileName(file.name);
              if (!isSupportedOrderWorkbook(file.name)) {
                return setImportError("Choose an .xlsx or .xls file.");
              }
              if (file.size > MAX_IMPORT_FILE_SIZE_BYTES) {
                return setImportError("The file is too large.");
              }

              setIsReadingWorkbook(true);

              try {
                const rows = await readOrderWorkbook(file);
                if (rows === undefined) {
                  setImportError("The Excel file is missing required columns.");
                  return;
                }

                if (rows.length === 0) {
                  setImportError("The Excel file has no item rows.");
                  return;
                }

                setImportRows(rows);
              } catch (error) {
                setImportError(
                  error instanceof UnsupportedOrderWorkbookError
                    ? error.message
                    : "Could not read the Excel file.",
                );
              } finally {
                setIsReadingWorkbook(false);
              }
            }
          }}
          id="excelFile"
          hidden
          ref={importFileRef}
          name="excelFile"
          type="file"
          accept=".xlsx,.xls"
        />
        {importError && <FieldError>{importError}</FieldError>}
        {importRows && (
          <OrderImportPreview
            disabled={isSubmitting}
            importRows={importRows}
            readyCount={readyItems.length}
            defaultMaterial={defaultMaterial}
            defaultThicknessMm={defaultThicknessMm}
            onDefaultMaterialChange={setDefaultMaterial}
            onDefaultThicknessChange={setDefaultThicknessMm}
            onNameChange={handleImportNameChange}
            onQuantityChange={handleImportQuantityChange}
            onUnitChange={handleImportUnitChange}
            onMaterialChange={handleImportMaterialChange}
            onThicknessChange={handleImportThicknessChange}
            onAppend={handleAddImportedItems}
          />
        )}
      </Field>

      <AddOrderItemForm
        key={itemFormResetKey}
        onAdd={handleAddItem}
        disabled={isSubmitting}
      />
      <AddedOrderItemsSection
        items={items}
        onRemove={handleRemoveItem}
        disabled={isSubmitting}
      />
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
          disabled={
            Boolean(successMessage) ||
            isSubmitting ||
            isReadingWorkbook ||
            items.length === 0
          }
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
