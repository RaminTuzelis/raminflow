import type { UserRole } from "@/types/user";

const orderStatusUpdateRoles: UserRole[] = [
  "ADMIN",
  "ADMINISTRATION",
  "PRODUCTION_MANAGER",
];

const orderCreateRoles: UserRole[] = [
  "ADMIN",
  "ADMINISTRATION",
  "PRODUCTION_MANAGER",
];

export function canUpdateOrderStatus(role: UserRole) {
  return orderStatusUpdateRoles.includes(role);
}

export function canCreateOrder(role: UserRole) {
  return orderCreateRoles.includes(role);
}
