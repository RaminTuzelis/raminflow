import type { OrderStatus } from "@/types/order";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
  PaginationEllipsis,
} from "@/components/ui/pagination";

type OrderPaginationProps = {
  currentPage: number;
  totalPages: number;
  searchQuery: string;
  status?: OrderStatus;
};

function getPaginationItems(currentPage: number, totalPages: number) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }
  if (currentPage <= 2) {
    return [1, 2, 3, "end-ellipsis", totalPages];
  }
  if (currentPage >= totalPages - 1) {
    return [1, "start-ellipsis", totalPages - 2, totalPages - 1, totalPages];
  }
  if (currentPage === 3) {
    return [1, 2, 3, 4, "end-ellipsis", totalPages];
  }
  if (currentPage === totalPages - 2) {
    return [
      1,
      "start-ellipsis",
      totalPages - 3,
      currentPage,
      totalPages - 1,
      totalPages,
    ];
  }
  return [
    1,
    "start-ellipsis",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "end-ellipsis",
    totalPages,
  ];
}

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

  const pages = getPaginationItems(currentPage, totalPages);

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

        {pages.map((page) => {
          if (typeof page === "string") {
            return (
              <PaginationItem key={page}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }

          return (
            <PaginationItem key={page}>
              <PaginationLink
                href={createPageHref(page)}
                isActive={page === currentPage}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          );
        })}

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
