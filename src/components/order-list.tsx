"use client";

import type { Order, OrderStatus } from "@/types/order";
import {
  dateFormatter,
  dateTimeFormatter,
  statusLabels,
} from "@/lib/order-display";
import { isOrderStatus, statusOptions } from "@/lib/order-options";
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
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "@/components/ui/table";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

type OrderListProps = {
  orders: Order[];
  initialQuery: string;
  initialStatus: OrderStatus | "ALL";
};

const statusFilterOptions = [
  { value: "ALL", label: "All statuses" },
  ...statusOptions.map((status) => ({
    value: status,
    label: statusLabels[status],
  })),
];

export function OrderList({
  orders,
  initialQuery,
  initialStatus,
}: OrderListProps) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | "ALL">(
    initialStatus,
  );
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    const normalizedTerm = term.trim();

    if (normalizedTerm) {
      params.set("q", normalizedTerm);
    } else {
      params.delete("q");
    }

    const queryString = params.toString();

    replace(queryString ? `${pathname}?${queryString}` : pathname);
  }, 300);

  function handleStatusChange(nextStatus: string | null) {
    const params = new URLSearchParams(searchParams);

    const normalizedStatus =
      nextStatus && isOrderStatus(nextStatus) ? nextStatus : "ALL";

    setSelectedStatus(normalizedStatus);

    if (normalizedStatus === "ALL") {
      params.delete("status");
    } else {
      params.set("status", normalizedStatus);
    }

    const queryString = params.toString();

    replace(queryString ? `${pathname}?${queryString}` : pathname);
  }

  function handleClearFilters() {
    const params = new URLSearchParams(searchParams);

    handleSearch.cancel();
    setSearchQuery("");
    setSelectedStatus("ALL");

    params.delete("q");
    params.delete("status");

    const queryString = params.toString();

    replace(queryString ? `${pathname}?${queryString}` : pathname);
  }

  const normalizedAppliedQuery = initialQuery.trim().toLowerCase();

  const hasActiveFilters =
    normalizedAppliedQuery.length > 0 || initialStatus !== "ALL";

  const emptyStateMessage = normalizedAppliedQuery
    ? `No orders found for "${initialQuery.trim()}".`
    : `No orders match the selected filters.`;

  const hasNoResults = orders.length === 0;

  return (
    <>
      <div className="mb-3 grid gap-2 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-4">
        <div className="flex w-full flex-col gap-3 sm:flex-row">
          <label htmlFor="orderSearch" className="sr-only">
            Search orders
          </label>
          <InputGroup className="w-full sm:max-w-md">
            <InputGroupInput
              id="orderSearch"
              type="search"
              value={searchQuery}
              onChange={(event) => {
                const nextQuery = event.currentTarget.value;

                setSearchQuery(nextQuery);
                handleSearch(nextQuery);
              }}
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
            onValueChange={handleStatusChange}
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
              size="sm"
              variant="outline"
              onClick={handleClearFilters}
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
              ? `${orders.length} matching ${orders.length === 1 ? "order" : "orders"}`
              : `${orders.length} ${orders.length === 1 ? "order" : "orders"}`}
          </p>
        </div>
      </div>
      <div className="overflow-hidden rounded-lg border">
        <Table className="min-w-190">
          <TableCaption className="sr-only">Production orders</TableCaption>
          <TableHeader className="bg-muted text-xs uppercase">
            <TableRow className="hover:bg-transparent">
              <TableHead scope="col" className="px-4 text-muted-foreground">
                Order
              </TableHead>
              <TableHead scope="col" className="px-4 text-muted-foreground">
                Project
              </TableHead>
              <TableHead scope="col" className="px-4 text-muted-foreground">
                Deadline
              </TableHead>
              <TableHead scope="col" className="px-4 text-muted-foreground">
                Positions
              </TableHead>
              <TableHead scope="col" className="px-4 text-muted-foreground">
                Status
              </TableHead>
              <TableHead scope="col" className="px-4 text-muted-foreground">
                Updated
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {hasNoResults ? (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={6}
                  className="h-28 px-4 text-center text-muted-foreground"
                >
                  {emptyStateMessage}
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="px-4 py-3">
                    <Link
                      href={`/orders/${order.id}`}
                      className="font-medium text-primary transition hover:text-foreground"
                    >
                      {order.orderNumber}
                    </Link>
                  </TableCell>
                  <TableCell className="px-4 py-3 font-medium text-foreground">
                    {order.projectName}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-muted-foreground">
                    {dateFormatter.format(new Date(order.deadline))}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-muted-foreground">
                    {order.items.length}
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <OrderStatusBadge status={order.status} />
                  </TableCell>
                  <TableCell className="px-4 py-3 text-muted-foreground">
                    {dateTimeFormatter.format(new Date(order.updatedAt))}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
