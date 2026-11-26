import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { unitLabels, unitOptionLabels } from "@/lib/order-display";
import {
  materialOptions,
  thicknessOptions,
  unitOptions,
} from "@/lib/order-options";
import type { readOrderWorkbook } from "@/lib/read-order-workbook";
import { cn } from "@/lib/utils";
import type { MaterialType, UnitType } from "@/types/order";
import { Trash2Icon } from "lucide-react";

const unitItems = unitOptions.map((unit) => ({
  value: unit,
  label: unitOptionLabels[unit],
}));

const materialItems = materialOptions.map((material) => ({
  value: material,
  label: material,
}));

const thicknessItems = thicknessOptions.map((thickness) => ({
  value: thickness,
  label: `${thickness} mm`,
}));

const importPreviewColumns =
  "@2xl/import:grid-cols-[1.75rem_minmax(0,1fr)_4.5rem_6rem_6.5rem_6.5rem_2rem]";
const importPreviewMobileLabel =
  "block text-xs font-medium text-muted-foreground @2xl/import:hidden";

type OrderImportPreviewProps = {
  importRows: NonNullable<Awaited<ReturnType<typeof readOrderWorkbook>>>;
  readyCount: number;
  defaultMaterial: MaterialType | null;
  defaultThicknessMm: number | null;
  onDefaultMaterialChange: (value: MaterialType | null) => void;
  onDefaultThicknessChange: (value: number | null) => void;
  onNameChange: (rowNumber: number, name: string) => void;
  onQuantityChange: (rowNumber: number, quantityText: string) => void;
  onUnitChange: (rowNumber: number, unit: UnitType | null) => void;
  onMaterialChange: (rowNumber: number, material: MaterialType | null) => void;
  onThicknessChange: (rowNumber: number, thicknessMm: number | null) => void;
  onAppend: () => void;
  onSkipRow: (rowNumber: number) => void;
  disabled: boolean;
};

export function OrderImportPreview({
  importRows,
  readyCount,
  disabled,
  defaultMaterial,
  defaultThicknessMm,
  onDefaultMaterialChange,
  onDefaultThicknessChange,
  onNameChange,
  onQuantityChange,
  onUnitChange,
  onMaterialChange,
  onThicknessChange,
  onAppend,
  onSkipRow,
}: OrderImportPreviewProps) {
  return (
    <section
      aria-labelledby="import-preview-title"
      className="@container/import mt-2 min-w-0 rounded-xl border border-border"
    >
      <h3
        id="import-preview-title"
        className="px-4 py-3 text-sm font-medium text-success"
      >
        Excel preview
      </h3>
      <div
        aria-hidden="true"
        className={cn(
          "hidden gap-2 border-t border-border bg-muted/40 px-4 py-2 text-xs font-medium text-foreground @2xl/import:grid",
          importPreviewColumns,
        )}
      >
        <span>#</span>
        <span>Item name</span>
        <span>Quantity</span>
        <span>Unit</span>
        <span>Material</span>
        <span>Thickness</span>
      </div>
      <div
        className={cn(
          "grid grid-cols-2 items-center gap-2 border-t border-border bg-muted/20 px-4 py-3",
          importPreviewColumns,
        )}
      >
        <p className="col-span-full text-xs text-muted-foreground @2xl/import:col-span-4">
          Defaults apply to empty cells.
        </p>
        <Field className="min-w-0 gap-1.5">
          <FieldLabel
            htmlFor="importDefaultMaterial"
            className="@2xl/import:sr-only"
          >
            Default material
          </FieldLabel>
          <Select
            items={materialItems}
            value={defaultMaterial}
            onValueChange={onDefaultMaterialChange}
          >
            <SelectTrigger
              id="importDefaultMaterial"
              className="min-w-0 w-full"
            >
              <SelectValue placeholder="None" />
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
        <Field className="min-w-0 gap-1.5">
          <FieldLabel
            htmlFor="importDefaultThickness"
            className="@2xl/import:sr-only"
          >
            Default thickness
          </FieldLabel>
          <Select
            items={thicknessItems}
            value={defaultThicknessMm}
            onValueChange={onDefaultThicknessChange}
          >
            <SelectTrigger
              id="importDefaultThickness"
              className="min-w-0 w-full"
            >
              <SelectValue placeholder="None" />
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
      <ul className="divide-y divide-border border-t border-border">
        {importRows.map((row, index) => (
          <li
            className={cn(
              "grid grid-cols-2 items-center gap-x-2 gap-y-3 px-4 py-3 @2xl/import:gap-y-2",
              importPreviewColumns,
            )}
            key={row.rowNumber}
          >
            <span className="col-start-1 row-start-1 text-xs font-medium tabular-nums text-muted-foreground">
              {index + 1}.
            </span>
            <div className="col-span-full flex min-w-0 flex-col gap-1.5 @2xl/import:col-span-1">
              <span aria-hidden="true" className={importPreviewMobileLabel}>
                Item name
              </span>
              <Input
                aria-label={`Item name for Excel row ${row.rowNumber}`}
                aria-invalid={row.errors.some(
                  (error) => error.field === "name",
                )}
                value={row.name}
                onChange={(event) =>
                  onNameChange(row.rowNumber, event.currentTarget.value)
                }
              />
            </div>
            <div className="flex min-w-0 flex-col gap-1.5">
              <span aria-hidden="true" className={importPreviewMobileLabel}>
                Quantity
              </span>
              <Input
                aria-label={`Quantity for Excel row ${row.rowNumber}`}
                aria-invalid={row.errors.some(
                  (error) => error.field === "quantity",
                )}
                inputMode="numeric"
                value={row.quantityText ?? ""}
                onChange={(event) =>
                  onQuantityChange(row.rowNumber, event.currentTarget.value)
                }
              />
            </div>
            <div className="flex min-w-0 flex-col gap-1.5">
              <span aria-hidden="true" className={importPreviewMobileLabel}>
                Unit
              </span>
              <Select
                items={unitItems}
                value={row.unit ?? null}
                onValueChange={(value) => onUnitChange(row.rowNumber, value)}
              >
                <SelectTrigger
                  aria-label={`Unit for Excel row ${row.rowNumber}`}
                  className="min-w-0 w-full"
                >
                  <SelectValue placeholder="Choose">
                    {row.unit && unitLabels[row.unit]}
                  </SelectValue>
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
            </div>
            <div className="flex min-w-0 flex-col gap-1.5">
              <span aria-hidden="true" className={importPreviewMobileLabel}>
                Material
              </span>
              <Select
                items={materialItems}
                value={
                  row.materialType ??
                  (row.errors.some((error) => error.field === "materialType")
                    ? null
                    : defaultMaterial)
                }
                onValueChange={(value) =>
                  onMaterialChange(row.rowNumber, value)
                }
              >
                <SelectTrigger
                  className="min-w-0 w-full"
                  aria-label={`Material for Excel row ${row.rowNumber}`}
                >
                  <SelectValue placeholder="Choose" />
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
            </div>
            <div className="flex min-w-0 flex-col gap-1.5">
              <span aria-hidden="true" className={importPreviewMobileLabel}>
                Thickness
              </span>
              <Select
                items={thicknessItems}
                value={
                  row.thicknessMm ??
                  (row.errors.some((error) => error.field === "thicknessMm")
                    ? null
                    : defaultThicknessMm)
                }
                onValueChange={(value) =>
                  onThicknessChange(row.rowNumber, value)
                }
              >
                <SelectTrigger
                  className="min-w-0 w-full"
                  aria-label={`Thickness for Excel row ${row.rowNumber}`}
                >
                  <SelectValue placeholder="Choose" />
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
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              disabled={disabled}
              className="col-start-2 row-start-1 justify-self-end @2xl/import:col-start-7 text-destructive hover:text-destructive"
              aria-label={`Skip Excel row ${row.rowNumber}`}
              onClick={() => onSkipRow(row.rowNumber)}
            >
              <Trash2Icon aria-hidden="true" />
            </Button>
            {row.errors.length > 0 && (
              <ul className="col-span-full space-y-1 rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">
                {row.errors.map((error) => (
                  <li key={error.message}>
                    Excel row {error.rowNumber}: {error.message}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap items-center justify-end gap-x-4 gap-y-2 border-t border-border px-4 py-3">
        <p aria-live="polite" className="text-sm text-muted-foreground">
          Ready to add{" "}
          <strong className="font-medium tabular-nums text-foreground">
            {readyCount} of {importRows.length}
          </strong>
        </p>
        <Button
          type="button"
          disabled={readyCount === 0 || disabled}
          onClick={onAppend}
        >
          Append imported items
        </Button>
      </div>
    </section>
  );
}
