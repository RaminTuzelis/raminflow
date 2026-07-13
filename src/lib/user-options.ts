import { userRoles } from "@/lib/user-constants";
import type { UserRole } from "@/types/user";

export const roleOptions = userRoles;

export function isUserRole(value: string): value is UserRole {
  return roleOptions.includes(value as UserRole);
}
