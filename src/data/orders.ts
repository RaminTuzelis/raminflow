import type { Order } from "@/types/order";

export const orders: Order[] = [
  {
    id: "order-1",
    orderNumber: "RF-2026-001",
    projectName: "Demo Pool Project",
    deadline: "2026-07-15",
    status: "APPROVED_FOR_PRODUCTION",
    updatedAt: "2026-06-22T08:30:00Z",
    items: [
      {
        id: "order-1-item-1",
        name: "Pool shell",
        quantity: 1,
        materialType: "PP",
        thicknessMm: 10,
        technicalDescription: "Rectangular demonstration pool shell.",
      },
      {
        id: "order-1-item-2",
        name: "Overflow tank",
        quantity: 1,
        materialType: "PP",
        thicknessMm: 8,
        technicalDescription: "Tank with a removable lid.",
      },
    ],
  },
  {
    id: "order-2",
    orderNumber: "RF-2026-002",
    projectName: "Demo Hospital Ventilation",
    deadline: "2027-01-05",
    status: "IN_PRODUCTION",
    updatedAt: "2026-06-20T10:30:00Z",
    items: [
      {
        id: "order-2-item-1",
        name: "Bends D400",
        quantity: 5,
        materialType: "PP",
        thicknessMm: 5,
        technicalDescription: "Ventilation bends with a 400 mm diameter.",
      },
      {
        id: "order-2-item-2",
        name: "Flanges D315",
        quantity: 2,
        materialType: "PVC",
        thicknessMm: 10,
        technicalDescription: "Connection flanges with a 315 mm diameter.",
      },
    ],
  },
];
