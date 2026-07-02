"use client";

import type { Order } from "@/types/order";
import {
  dateFormatter,
  dateTimeFormatter,
  statusLabels,
} from "@/lib/order-display";
import { statusOptions } from "@/lib/order-options";
import { OrderStatusBadge } from "@/components/order-status-badge";
import Link from "next/link";
import { useState } from "react";

type OrderListProps = {
  orders: Order[];
};

export function OrderList({ orders }: OrderListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const normalizedSearchQuery = searchQuery.trim().toLowerCase();
  const hasActiveFilters =
    normalizedSearchQuery.length > 0 || selectedStatus !== "ALL";
  const emptyStateMessage = normalizedSearchQuery
    ? `No orders found for "${searchQuery.trim()}".`
    : `No orders match the selected filters.`;

  const filteredOrders = orders.filter((order) => {
    const searchableText =
      `${order.orderNumber} ${order.projectName}`.toLowerCase();

    const matchesSearch = searchableText.includes(normalizedSearchQuery);
    const matchesStatus =
      selectedStatus === "ALL" || order.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const hasNoResults = filteredOrders.length === 0;

  return (
    <>
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full flex-col gap-3 sm:flex-row">
          <div className="w-full sm:max-w-md">
            <label htmlFor="orderSearch" className="sr-only">
              Search orders
            </label>
            <input
              id="orderSearch"
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.currentTarget.value)}
              placeholder="Search by order number or project"
              className="w-full rounded-lg border border-slate-700 bg-slate-950/70 px-4 py-2.5 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
            />
          </div>
          <div className="w-full sm:max-w-56">
            <label htmlFor="statusFilter" className="sr-only">
              Filter by status
            </label>
            <select
              id="statusFilter"
              value={selectedStatus}
              onChange={(event) => setSelectedStatus(event.currentTarget.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950/70 px-4 py-2.5 text-sm text-slate-100 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
            >
              <option value="ALL">All statuses</option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {statusLabels[status]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {hasActiveFilters && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedStatus("ALL");
              }}
              className="whitespace-nowrap rounded-lg border border-slate-700 px-3 py-2 text-sm font-medium text-slate-300 transition hover:border-sky-500 hover:text-sky-300"
            >
              Clear filters
            </button>
          )}

          <p className="whitespace-nowrap text-sm text-slate-500">
            {hasActiveFilters
              ? `Showing ${filteredOrders.length} of ${orders.length} orders`
              : `Showing all ${orders.length} orders`}
          </p>
        </div>
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
            {hasNoResults ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center text-sm text-slate-500"
                >
                  {emptyStateMessage}
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
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
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
