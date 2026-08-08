import { describe, expect, test } from "vitest";
import {
  isMaterialType,
  isOrderStatus,
  isThicknessOption,
  isUnitType,
} from "./order-options";

describe("isMaterialType", () => {
  test("accepts a supported material", () => {
    expect(isMaterialType("PP")).toBe(true);
  });

  test("rejects an unsupported material", () => {
    expect(isMaterialType("STEEL")).toBe(false);
  });
});

describe("isThicknessOption", () => {
  test("accepts a supported thickness", () => {
    expect(isThicknessOption(5)).toBe(true);
  });

  test("rejects an unsupported thickness", () => {
    expect(isThicknessOption(7)).toBe(false);
  });
});

describe("isUnitType", () => {
  test("accepts a supported unit", () => {
    expect(isUnitType("PCS")).toBe(true);
  });

  test("rejects an unsupported unit", () => {
    expect(isUnitType("L")).toBe(false);
  });
});

describe("isOrderStatus", () => {
  test("accepts a supported order status", () => {
    expect(isOrderStatus("DRAFT")).toBe(true);
  });

  test("rejects an unsupported order status", () => {
    expect(isOrderStatus("UNKNOWN")).toBe(false);
  });
});
