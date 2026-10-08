import type { OrderStatus } from "@/types/order";

type OrderPaginationProps = {
  currentPage: number;
  totalPages: number;
  searchQuery: string;
  status?: OrderStatus;
};

export function OrderPagination() {}
