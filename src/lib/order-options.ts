import type { MaterialType, OrderStatus, UnitType } from "@/types/order";
import {
  materialTypes,
  orderStatuses,
  thicknessOptions,
  unitTypes,
} from "@/lib/order-constants";

export const statusOptions = orderStatuses;

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

export function isOrderStatus(value: string): value is OrderStatus {
  return statusOptions.includes(value as OrderStatus);
}
