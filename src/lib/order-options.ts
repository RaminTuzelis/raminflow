import type { MaterialType } from "@/types/order";

export const thicknessOptions = [3, 4, 5, 6, 8, 10, 12, 15, 20, 25] as const;

export const materialOptions = [
  "PP",
  "PE",
  "PVC",
  "PVDF",
] as const satisfies readonly MaterialType[];

export function isMaterialType(value: string): value is MaterialType {
  return materialOptions.includes(value as MaterialType);
}

export function isThicknessOption(value: number): boolean {
  return thicknessOptions.includes(value as (typeof thicknessOptions)[number]);
}
