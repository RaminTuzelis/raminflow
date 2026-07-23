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
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchIcon, FilterXIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

type OrderListProps = {
  orders: Order[];
};

const statusFilterOptions = [
  { value: "ALL", label: "All statuses" },
  ...statusOptions.map((status) => ({
    value: status,
    label: statusLabels[status],
  })),
];

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
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex w-full flex-col gap-3 sm:flex-row">
          <label htmlFor="orderSearch" className="sr-only">
            Search orders
          </label>
          <InputGroup className="w-full sm:max-w-md">
            <InputGroupInput
              id="orderSearch"
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.currentTarget.value)}
              placeholder="Search by order number or project"
              autoComplete="off"
            />
            <InputGroupAddon align="inline-start">
              <SearchIcon aria-hidden="true" />
            </InputGroupAddon>
          </InputGroup>

          <label htmlFor="statusFilter" className="sr-only">
            Filter by status
          </label>

          <Select
            items={statusFilterOptions}
            value={selectedStatus}
            onValueChange={(nextStatus) =>
              setSelectedStatus(nextStatus ?? "ALL")
            }
          >
            <SelectTrigger
              className="w-full sm:w-50 sm:shrink-0"
              id="statusFilter"
            >
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {statusFilterOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-3">
          {hasActiveFilters && (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setSelectedStatus("ALL");
              }}
            >
              <FilterXIcon data-icon="inline-start" />
              Clear filters
            </Button>
          )}

          <p
            aria-live="polite"
            className="ml-auto shrink-0 whitespace-nowrap text-sm text-muted-foreground"
          >
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
