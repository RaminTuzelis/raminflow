import type { OrderStatus } from "@/types/order";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";

type OrderPaginationProps = {
  currentPage: number;
  totalPages: number;
  searchQuery: string;
  status?: OrderStatus;
};

export function OrderPagination({
  currentPage,
  totalPages,
  searchQuery,
  status,
}: OrderPaginationProps) {
  function createPageHref(page: number) {
    const params = new URLSearchParams();

    if (searchQuery) {
      params.set("q", searchQuery);
    }

    if (status) {
      params.set("status", status);
    }

    params.set("page", String(page));

    return `/?${params.toString()}`;
  }

  const hasPreviousPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;
  const previousPageHref = createPageHref(Math.max(1, currentPage - 1));
  const nextPageHref = createPageHref(Math.min(currentPage + 1, totalPages));

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={previousPageHref}
            aria-disabled={!hasPreviousPage}
            tabIndex={hasPreviousPage ? undefined : -1}
            className={
              hasPreviousPage ? undefined : "pointer-events-none opacity-50"
            }
          />
        </PaginationItem>

        <PaginationItem>
          <span className="px-3 text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
        </PaginationItem>

        <PaginationItem>
          <PaginationNext
            href={nextPageHref}
            aria-disabled={!hasNextPage}
            tabIndex={hasNextPage ? undefined : -1}
            className={
              hasNextPage ? undefined : "pointer-events-none opacity-50"
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
