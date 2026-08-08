import { describe, expect, test } from "vitest";
import {
  canCreateOrder,
  canManageUsers,
  canEditOrder,
  canUpdateOrderStatus,
} from "./permissions";

describe("canManageUsers", () => {
  test("prevents workers from managing users", () => {
    const result = canManageUsers("WORKER");

    expect(result).toBe(false);
  });

  test("allows admins to manage users", () => {
    const result = canManageUsers("ADMIN");

    expect(result).toBe(true);
  });
});

describe("canCreateOrder", () => {
  test.each(["ADMIN", "ADMINISTRATION", "PRODUCTION_MANAGER"] as const)(
    "allows %s to create orders",
    (role) => {
      const result = canCreateOrder(role);

      expect(result).toBe(true);
    },
  );

  test("prevents workers from creating orders", () => {
    const result = canCreateOrder("WORKER");

    expect(result).toBe(false);
  });
});

describe("canEditOrder", () => {
  test.each(["ADMIN", "ADMINISTRATION", "PRODUCTION_MANAGER"] as const)(
    "allows %s to edit orders",
    (role) => {
      const result = canEditOrder(role);

      expect(result).toBe(true);
    },
  );

  test("prevents workers from editing orders", () => {
    const result = canEditOrder("WORKER");

    expect(result).toBe(false);
  });
});

describe("canUpdateOrderStatus", () => {
  test.each(["ADMIN", "ADMINISTRATION", "PRODUCTION_MANAGER"] as const)(
    "allows %s to update order status",
    (role) => {
      const result = canUpdateOrderStatus(role);

      expect(result).toBe(true);
    },
  );
  test("prevents workers from updating status", () => {
    const result = canUpdateOrderStatus("WORKER");

    expect(result).toBe(false);
  });
});
