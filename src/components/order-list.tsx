"use client";

import type { Order } from "@/types/order";
import { dateFormatter, dateTimeFormatter } from "@/lib/order-display";
import { OrderStatusBadge } from "@/components/order-status-badge";
import Link from "next/link";
import { useState } from "react";

type OrderListProps = {
  orders: Order[];
};

export function OrderList({ orders }: OrderListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const normalizedSearchQuery = searchQuery.trim().toLowerCase();

  const filteredOrders = orders.filter((order) => {
    const searchableText =
      `${order.orderNumber} ${order.projectName}`.toLowerCase();

    return searchableText.includes(normalizedSearchQuery);
  });

  return (
    <>
      <div className="mb-4">
        <label htmlFor="orderSearch">Search orders</label>
        <input
          id="orderSearch"
          type="search"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.currentTarget.value)}
          placeholder="Search by order number or project"
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 sm:max-w-sm"
        />
      </div>
      <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-900/30 shadow-sm">
        <table className="w-full min-w-190 border-collapse text-left text-sm">
          <thead className="bg-slate-950/90 text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th scope="col" className="px-4 py-3 font-medium">
                Order
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Project
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Deadline
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Positions
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Status
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Updated
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800">
            {filteredOrders.map((order) => (
              <tr
                key={order.id}
                className="transition-colors hover:bg-sky-950/25"
              >
                <td className="px-4 py-5">
                  <Link
                    href={`/orders/${order.id}`}
                    className="font-medium text-sky-400 hover:text-sky-300"
                  >
                    {order.orderNumber}
                  </Link>
                </td>
                <td className="px-4 py-5 font-medium text-slate-100">
                  {order.projectName}
                </td>
                <td className="px-4 py-5">
                  {dateFormatter.format(new Date(order.deadline))}
                </td>
                <td className="px-4 py-5">{order.items.length}</td>
                <td className="px-4 py-5">
                  <OrderStatusBadge status={order.status} />
                </td>
                <td className="px-4 py-5">
                  {dateTimeFormatter.format(new Date(order.updatedAt))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
