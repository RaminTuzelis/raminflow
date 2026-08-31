export function parsePage(value: string | undefined) {
  const page = Number(value);
  const isNumber = Number.isInteger(page);

  if (isNumber && page >= 1) {
    return page;
  } else {
    return 1;
  }
}

export const ORDERS_PER_PAGE = 15;

export function calculateOffset(page: number) {
  return (page - 1) * ORDERS_PER_PAGE;
}

export function calculateTotalPages(totalCount: number) {
  return Math.max(1, Math.ceil(totalCount / ORDERS_PER_PAGE));
}
