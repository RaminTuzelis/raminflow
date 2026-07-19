import { userRoles } from "@/lib/user-constants";
import type { UserRole } from "@/types/user";

export const roleOptions = userRoles;

export const userRoleLabels: Record<UserRole, string> = {
  ADMIN: "Admin",
  ADMINISTRATION: "Administration",
  PRODUCTION_MANAGER: "Production manager",
  WORKER: "Worker",
};

export function isUserRole(value: string): value is UserRole {
  return roleOptions.includes(value as UserRole);
}
