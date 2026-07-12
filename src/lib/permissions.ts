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

const orderEditRoles: UserRole[] = [
  "ADMIN",
  "ADMINISTRATION",
  "PRODUCTION_MANAGER",
];

const userManageRoles: UserRole[] = ["ADMIN"];

export function canUpdateOrderStatus(role: UserRole) {
  return orderStatusUpdateRoles.includes(role);
}

export function canCreateOrder(role: UserRole) {
  return orderCreateRoles.includes(role);
}

export function canEditOrder(role: UserRole) {
  return orderEditRoles.includes(role);
}

export function canManageUsers(role: UserRole) {
  return userManageRoles.includes(role);
}
