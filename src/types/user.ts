import type { userRoles } from "@/lib/user-constants";

export type UserRole = (typeof userRoles)[number];
