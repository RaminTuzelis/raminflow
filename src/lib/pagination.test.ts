import { expect, test } from "vitest";
import { parsePage, calculateOffset, calculateTotalPages } from "./pagination";

test("returns a positive page number", () => {
  const result = parsePage("3");

  expect(result).toBe(3);
});

test("returns the first page when the value is zero", () => {
  const result = parsePage("0");

  expect(result).toBe(1);
});

test("returns zero offset for the first page", () => {
  const result = calculateOffset(1);

  expect(result).toBe(0);
});

test.each([
  [2, 15],
  [3, 30],
])("calculates offset for page %i", (page, expectedOffset) => {
  const result = calculateOffset(page);

  expect(result).toBe(expectedOffset);
});

test.each(["-2", "abc", "2.5", undefined])(
  "returns first page for invalid value %s",
  (value) => {
    const result = parsePage(value);

    expect(result).toBe(1);
  },
);

test.each([
  [0, 1],
  [1, 1],
  [15, 1],
  [16, 2],
  [45, 3],
  [46, 4],
  [50, 4],
])("%i orders require %i pages", (totalCount, expectedPages) => {
  const result = calculateTotalPages(totalCount);

  expect(result).toBe(expectedPages);
});
