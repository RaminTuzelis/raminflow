import type { UnitType } from "@/types/order";
import { isMaterialType, isThicknessOption } from "@/lib/order-options";

export type OrderImportRowError = {
  rowNumber: number;
  message: string;
};

export function normalizeImportHeader(header: string): string {
  const text = header.trim().toLowerCase();

  return text;
}

const importHeaderMap = {
  kiekis: "quantity",
  storis: "thicknessMm",
  "prekės (paslaugos) pavadinimas": "name",
  "mato vnt.": "unit",
  medžiaga: "materialType",
} as const;

type ImportField = (typeof importHeaderMap)[keyof typeof importHeaderMap];

export function getImportField(header: string) {
  const normalizedHeader = normalizeImportHeader(header);

  for (const [label, field] of Object.entries(importHeaderMap)) {
    if (label === normalizedHeader) {
      return field;
    }
  }
}

export function getImportColumnIndexes(headers: string[]) {
  const columnIndexes: Partial<Record<ImportField, number>> = {};

  for (const [columnIndex, header] of headers.entries()) {
    const field = getImportField(header);
    if (field !== undefined) {
      columnIndexes[field] = columnIndex;
    }
  }

  return columnIndexes;
}

export function findImportHeaderRow(rows: string[][]) {
  for (const [rowIndex, row] of rows.entries()) {
    const columnIndexes = getImportColumnIndexes(row);
    const { name, unit, quantity } = columnIndexes;

    if (name !== undefined && unit !== undefined && quantity !== undefined) {
      return {
        rowIndex,
        columnIndexes: { ...columnIndexes, name, unit, quantity },
      };
    }
  }
  return undefined;
}

export function parseImportRows(rows: string[][]) {
  const header = findImportHeaderRow(rows);

  if (header === undefined) {
    return undefined;
  }

  const nameColumn = header.columnIndexes.name;
  const quantityColumn = header.columnIndexes.quantity;
  const unitColumn = header.columnIndexes.unit;
  const thicknessColumn = header.columnIndexes.thicknessMm;
  const materialColumn = header.columnIndexes.materialType;
  const dataRows = rows.slice(header.rowIndex + 1);

  return dataRows
    .map((row, index) => {
      const rowNumber = header.rowIndex + index + 2;
      const isEmptyRow = Object.values(header.columnIndexes).every(
        (columnIndex) =>
          columnIndex === undefined || (row[columnIndex]?.trim() ?? "") === "",
      );

      if (isEmptyRow) {
        return undefined;
      }

      const errors: OrderImportRowError[] = [];
      const name = row[nameColumn]?.trim() ?? "";
      const quantityText = row[quantityColumn];
      const quantity = parseImportQuantity(quantityText);
      const unitText = row[unitColumn];
      const unit = parseImportUnit(unitText);
      const thicknessText =
        thicknessColumn === undefined ? undefined : row[thicknessColumn];
      const thicknessMm = parseImportThickness(thicknessText);
      const materialText =
        materialColumn === undefined ? undefined : row[materialColumn];
      const normalizedMaterial = materialText?.trim().toUpperCase() ?? "";
      const materialType = isMaterialType(normalizedMaterial)
        ? normalizedMaterial
        : undefined;

      if (name === "") {
        errors.push({
          rowNumber,
          message: "Item name is required.",
        });
      }

      if (quantity === undefined) {
        errors.push({
          rowNumber,
          message: "Quantity must be a positive whole number.",
        });
      }

      if (unit === undefined) {
        errors.push({
          rowNumber,
          message: "Unit is missing or unsupported.",
        });
      }

      if (thicknessText?.trim() && thicknessMm === undefined) {
        errors.push({
          rowNumber,
          message: "Thickness is not a supported option.",
        });
      }

      if (normalizedMaterial !== "" && materialType === undefined) {
        errors.push({
          rowNumber,
          message: "Material is not a supported option.",
        });
      }

      return {
        rowNumber,
        name,
        quantityText,
        quantity,
        unitText,
        unit,
        thicknessText,
        thicknessMm,
        materialText,
        materialType,
        errors,
      };
    })
    .filter((row) => row != undefined);
}

function parseImportThickness(
  thicknessText: string | undefined,
): number | undefined {
  const text = thicknessText?.trim() ?? "";

  if (!/^\d+(?:[.,]\d+)?$/.test(text)) {
    return undefined;
  }

  const thicknessMm = Number(text.replace(",", "."));
  return isThicknessOption(thicknessMm) ? thicknessMm : undefined;
}

export function parseImportQuantity(
  quantityText: string | undefined,
): number | undefined {
  const quantity = Number(quantityText);

  if (Number.isInteger(quantity) && quantity > 0) {
    return quantity;
  } else {
    return undefined;
  }
}

export function parseImportUnit(
  unitText: string | undefined,
): UnitType | undefined {
  const unit = unitText?.trim().toLowerCase();

  if (unit === "vnt." || unit === "vnt" || unit === "pcs") {
    return "PCS";
  }

  if (unit === "m." || unit === "m") {
    return "M";
  }

  if (unit === "m2" || unit === "m²") {
    return "M2";
  }

  if (unit === "kg" || unit === "kg.") {
    return "KG";
  }

  return undefined;
}
