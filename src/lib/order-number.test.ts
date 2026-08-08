import { expect, test } from "vitest";
import { formatOrderNumber } from "./order-number";

test("formats an order number with leading zeroes", () => {
  const result = formatOrderNumber(2026, 1);

  expect(result).toBe("RF-2026-001");
});

test("keeps sequence numbers longer than three digits", () => {
  const result = formatOrderNumber(2026, 1000);

  expect(result).toBe("RF-2026-1000");
});
