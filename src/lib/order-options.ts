import type { MaterialType, UnitType } from "@/types/order";
import {
  materialTypes,
  thicknessOptions,
  unitTypes,
} from "@/lib/order-constants";

export const unitOptions = unitTypes;

export { thicknessOptions };

export const materialOptions = materialTypes;

export function isMaterialType(value: string): value is MaterialType {
  return materialOptions.includes(value as MaterialType);
}

export function isThicknessOption(value: number): boolean {
  return thicknessOptions.includes(value as (typeof thicknessOptions)[number]);
}

export function isUnitType(value: string): value is UnitType {
  return unitOptions.includes(value as UnitType);
}
