export const orderStatuses = [
  "DRAFT",
  "APPROVED_FOR_PRODUCTION",
  "IN_PRODUCTION",
  "READY_FOR_DISPATCH",
  "DISPATCHED",
  "CANCELLED",
] as const;

export const materialTypes = ["PP", "PE", "PVC", "PVDF"] as const;

export const thicknessOptions = [3, 4, 5, 6, 8, 10, 12, 15, 20, 25] as const;

export const unitTypes = ["PCS", "M", "M2", "KG"] as const;
