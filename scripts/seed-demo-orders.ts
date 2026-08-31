import "dotenv/config";

import { eq, sql } from "drizzle-orm";
import { db, queryClient } from "@/db/client";
import {
  orderItems,
  orderNumberCounters,
  orders,
  orderStatusHistory,
  users,
} from "@/db/schema";
import { formatOrderNumber } from "@/lib/order-number";
import type { MaterialType, OrderStatus, UnitType } from "@/types/order";

type DemoOrder = {
  projectName: string;
  productionNotes: string;
  deadlineOffsetDays: number;
  status: OrderStatus;
  items: {
    name: string;
    quantity: number;
    unit: UnitType;
    materialType: MaterialType;
    thicknessMm: number;
  }[];
};

const featuredDemoOrders: DemoOrder[] = [
  {
    projectName: "Pool technical chamber",
    productionNotes:
      "Prepare chamber parts from PP sheet. Leave pipe openings uncut until production manager confirms final drawing.",
    deadlineOffsetDays: 7,
    status: "DRAFT",
    items: [
      {
        name: "Chamber wall panels",
        quantity: 18,
        unit: "M2",
        materialType: "PP",
        thicknessMm: 10,
      },
      {
        name: "Bottom plate",
        quantity: 1,
        unit: "PCS",
        materialType: "PP",
        thicknessMm: 12,
      },
      {
        name: "Removable inspection covers",
        quantity: 2,
        unit: "PCS",
        materialType: "PP",
        thicknessMm: 8,
      },
    ],
  },
  {
    projectName: "PVC ventilation elbow batch",
    productionNotes:
      "Keep internal welds smooth. Mark each elbow with angle and diameter after welding.",
    deadlineOffsetDays: 10,
    status: "APPROVED_FOR_PRODUCTION",
    items: [
      {
        name: "PVC elbow 90 degrees DN160",
        quantity: 8,
        unit: "PCS",
        materialType: "PVC",
        thicknessMm: 5,
      },
      {
        name: "PVC elbow 45 degrees DN160",
        quantity: 4,
        unit: "PCS",
        materialType: "PVC",
        thicknessMm: 5,
      },
      {
        name: "Straight PVC pipe section",
        quantity: 6,
        unit: "M",
        materialType: "PVC",
        thicknessMm: 4,
      },
    ],
  },
  {
    projectName: "Chemical tank repair kit",
    productionNotes:
      "Use PVDF for chemical resistance. Pack repair plates separately from welding rod.",
    deadlineOffsetDays: 14,
    status: "IN_PRODUCTION",
    items: [
      {
        name: "PVDF repair plates",
        quantity: 6,
        unit: "PCS",
        materialType: "PVDF",
        thicknessMm: 6,
      },
      {
        name: "PVDF welding rod",
        quantity: 3,
        unit: "KG",
        materialType: "PVDF",
        thicknessMm: 3,
      },
    ],
  },
  {
    projectName: "PE pipe transition set",
    productionNotes:
      "Check cone dimensions before cutting sheet strips. Customer will confirm flange drilling separately.",
    deadlineOffsetDays: 5,
    status: "READY_FOR_DISPATCH",
    items: [
      {
        name: "PE transition cones",
        quantity: 3,
        unit: "PCS",
        materialType: "PE",
        thicknessMm: 8,
      },
      {
        name: "PE flange rings",
        quantity: 6,
        unit: "PCS",
        materialType: "PE",
        thicknessMm: 10,
      },
    ],
  },
  {
    projectName: "Water treatment tank covers",
    productionNotes:
      "Covers must be light enough to remove by hand but rigid enough for daily handling.",
    deadlineOffsetDays: 18,
    status: "DISPATCHED",
    items: [
      {
        name: "Rectangular PP covers",
        quantity: 5,
        unit: "PCS",
        materialType: "PP",
        thicknessMm: 6,
      },
      {
        name: "PP reinforcement ribs",
        quantity: 12,
        unit: "M",
        materialType: "PP",
        thicknessMm: 8,
      },
    ],
  },
  {
    projectName: "Custom PP collection trays",
    productionNotes:
      "Production manager should confirm tray height before welding side walls.",
    deadlineOffsetDays: 21,
    status: "DRAFT",
    items: [
      {
        name: "Collection tray bodies",
        quantity: 8,
        unit: "PCS",
        materialType: "PP",
        thicknessMm: 4,
      },
      {
        name: "Drain outlet sleeves",
        quantity: 8,
        unit: "PCS",
        materialType: "PP",
        thicknessMm: 5,
      },
    ],
  },
  {
    projectName: "Industrial sink liner",
    productionNotes:
      "Liner must fit existing stainless frame. Do not drill mounting holes before final check.",
    deadlineOffsetDays: 12,
    status: "APPROVED_FOR_PRODUCTION",
    items: [
      {
        name: "PE liner sheets",
        quantity: 12,
        unit: "M2",
        materialType: "PE",
        thicknessMm: 5,
      },
      {
        name: "PE corner strips",
        quantity: 9,
        unit: "M",
        materialType: "PE",
        thicknessMm: 5,
      },
    ],
  },
  {
    projectName: "Round PP tank bottom assemblies",
    productionNotes:
      "Two tank bottoms with support rings. Check diameter tolerance before final welding.",
    deadlineOffsetDays: 16,
    status: "IN_PRODUCTION",
    items: [
      {
        name: "Circular PP bottom plates",
        quantity: 2,
        unit: "PCS",
        materialType: "PP",
        thicknessMm: 12,
      },
      {
        name: "Support ring segments",
        quantity: 8,
        unit: "PCS",
        materialType: "PP",
        thicknessMm: 10,
      },
    ],
  },
  {
    projectName: "PVC ventilation reducer",
    productionNotes:
      "Reducers should be packed in pairs. Keep labels visible after wrapping.",
    deadlineOffsetDays: 25,
    status: "READY_FOR_DISPATCH",
    items: [
      {
        name: "PVC reducers DN200 to DN160",
        quantity: 4,
        unit: "PCS",
        materialType: "PVC",
        thicknessMm: 4,
      },
      {
        name: "PVC mounting collars",
        quantity: 8,
        unit: "PCS",
        materialType: "PVC",
        thicknessMm: 4,
      },
    ],
  },
  {
    projectName: "Small PP dosing box",
    productionNotes:
      "Cancelled before production start after dimensions changed. Keep record for workflow testing.",
    deadlineOffsetDays: 30,
    status: "CANCELLED",
    items: [
      {
        name: "PP dosing box body",
        quantity: 1,
        unit: "PCS",
        materialType: "PP",
        thicknessMm: 3,
      },
    ],
  },
];

const paginationStatuses: OrderStatus[] = [
  "DRAFT",
  "APPROVED_FOR_PRODUCTION",
  "IN_PRODUCTION",
  "READY_FOR_DISPATCH",
  "DISPATCHED",
  "CANCELLED",
];

type PaginationScenario = Omit<DemoOrder, "deadlineOffsetDays" | "status">;

const paginationScenarios: PaginationScenario[] = [
  {
    projectName: "PP inspection chamber batch",
    productionNotes:
      "Confirm pipe opening positions before machining. Keep the removable cover separate for final fitting.",
    items: [
      {
        name: "Inspection chamber wall panels",
        quantity: 12,
        unit: "M2",
        materialType: "PP",
        thicknessMm: 10,
      },
      {
        name: "Inspection chamber base plate",
        quantity: 1,
        unit: "PCS",
        materialType: "PP",
        thicknessMm: 12,
      },
    ],
  },
  {
    projectName: "PE pipe transition batch",
    productionNotes:
      "Check cone diameters against the drawing before welding. Flange drilling remains subject to final confirmation.",
    items: [
      {
        name: "PE transition cones",
        quantity: 4,
        unit: "PCS",
        materialType: "PE",
        thicknessMm: 8,
      },
      {
        name: "PE flange rings",
        quantity: 8,
        unit: "PCS",
        materialType: "PE",
        thicknessMm: 10,
      },
    ],
  },
  {
    projectName: "PVC ventilation fitting batch",
    productionNotes:
      "Keep internal welds smooth and mark every fitting with its angle and diameter before packing.",
    items: [
      {
        name: "PVC elbows DN160",
        quantity: 6,
        unit: "PCS",
        materialType: "PVC",
        thicknessMm: 5,
      },
      {
        name: "PVC reducers DN200 to DN160",
        quantity: 3,
        unit: "PCS",
        materialType: "PVC",
        thicknessMm: 4,
      },
    ],
  },
  {
    projectName: "PVDF chemical tank repair batch",
    productionNotes:
      "Keep repair plates grouped by size and pack welding rod separately to avoid surface damage.",
    items: [
      {
        name: "PVDF repair plates",
        quantity: 6,
        unit: "PCS",
        materialType: "PVDF",
        thicknessMm: 6,
      },
      {
        name: "PVDF welding rod",
        quantity: 3,
        unit: "KG",
        materialType: "PVDF",
        thicknessMm: 3,
      },
    ],
  },
  {
    projectName: "PP water tank cover batch",
    productionNotes:
      "Check cover stiffness and handle positions before final welding. Covers must remain removable by hand.",
    items: [
      {
        name: "Rectangular PP tank covers",
        quantity: 4,
        unit: "PCS",
        materialType: "PP",
        thicknessMm: 6,
      },
      {
        name: "PP cover reinforcement ribs",
        quantity: 10,
        unit: "M",
        materialType: "PP",
        thicknessMm: 8,
      },
    ],
  },
  {
    projectName: "PE industrial sink liner batch",
    productionNotes:
      "Verify the existing frame dimensions before cutting. Leave mounting holes uncut until the liner is test-fitted.",
    items: [
      {
        name: "PE sink liner sheets",
        quantity: 9,
        unit: "M2",
        materialType: "PE",
        thicknessMm: 5,
      },
      {
        name: "PE corner strips",
        quantity: 7,
        unit: "M",
        materialType: "PE",
        thicknessMm: 5,
      },
    ],
  },
  {
    projectName: "PVC ductwork assembly batch",
    productionNotes:
      "Label straight sections and collars as matching sets. Protect all flange faces during transport preparation.",
    items: [
      {
        name: "Straight PVC duct sections",
        quantity: 12,
        unit: "M",
        materialType: "PVC",
        thicknessMm: 4,
      },
      {
        name: "PVC mounting collars",
        quantity: 8,
        unit: "PCS",
        materialType: "PVC",
        thicknessMm: 4,
      },
    ],
  },
  {
    projectName: "PP dosing skid tray batch",
    productionNotes:
      "Confirm tray height and drain direction before welding side walls. Test the outlet sleeve fit before dispatch.",
    items: [
      {
        name: "PP dosing skid trays",
        quantity: 3,
        unit: "PCS",
        materialType: "PP",
        thicknessMm: 4,
      },
      {
        name: "PP drain outlet sleeves",
        quantity: 3,
        unit: "PCS",
        materialType: "PP",
        thicknessMm: 5,
      },
    ],
  },
];

const paginationDemoOrders: DemoOrder[] = Array.from(
  { length: 40 },
  (_, index) => {
    const demoNumber = index + 1;
    const scenario = paginationScenarios[index % paginationScenarios.length];
    const batchNumber = Math.floor(index / paginationScenarios.length) + 1;

    return {
      projectName: `${scenario.projectName} ${String(batchNumber).padStart(2, "0")}`,
      productionNotes: scenario.productionNotes,
      deadlineOffsetDays: 30 + demoNumber,
      status: paginationStatuses[index % paginationStatuses.length],
      items: scenario.items,
    };
  },
);

const demoOrders: DemoOrder[] = [
  ...featuredDemoOrders,
  ...paginationDemoOrders,
];

function deadlineFromToday(offsetDays: number) {
  const deadline = new Date();
  deadline.setDate(deadline.getDate() + offsetDays);
  deadline.setHours(12, 0, 0, 0);
  return deadline;
}

async function seedDemoOrders() {
  const existingOrderCount = await db.$count(orders);

  if (existingOrderCount > 0) {
    console.log(`Demo orders already exist: ${existingOrderCount}`);
    return;
  }

  const admin = await db.query.users.findFirst({
    where: eq(users.role, "ADMIN"),
  });

  if (!admin) {
    throw new Error("Create an admin user before seeding demo orders.");
  }

  const year = new Date().getFullYear();

  await db.transaction(async (tx) => {
    await tx
      .insert(orderNumberCounters)
      .values({
        year,
        nextNumber: demoOrders.length + 1,
      })
      .onConflictDoUpdate({
        target: orderNumberCounters.year,
        set: {
          nextNumber: sql`greatest(${orderNumberCounters.nextNumber}, ${demoOrders.length + 1})`,
        },
      });

    for (const [index, demoOrder] of demoOrders.entries()) {
      const orderNumber = formatOrderNumber(year, index + 1);

      const [createdOrder] = await tx
        .insert(orders)
        .values({
          orderNumber,
          createdByUserId: admin.id,
          projectName: demoOrder.projectName,
          productionNotes: demoOrder.productionNotes,
          deadline: deadlineFromToday(demoOrder.deadlineOffsetDays),
          status: demoOrder.status,
        })
        .returning({
          id: orders.id,
        });

      if (!createdOrder) {
        throw new Error(`Could not create demo order ${orderNumber}.`);
      }

      await tx.insert(orderItems).values(
        demoOrder.items.map((item) => ({
          orderId: createdOrder.id,
          ...item,
        })),
      );

      if (demoOrder.status !== "DRAFT") {
        await tx.insert(orderStatusHistory).values({
          orderId: createdOrder.id,
          fromStatus: "DRAFT",
          toStatus: demoOrder.status,
        });
      }
    }
  });

  console.log(`Created ${demoOrders.length} demo orders.`);
}

async function main() {
  try {
    await seedDemoOrders();
  } finally {
    await queryClient.end();
  }
}

main();
