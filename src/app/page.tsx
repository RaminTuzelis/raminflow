import { getOrders } from "@/db/queries";
import { OrderList } from "@/components/order-list";
import Link from "next/link";
import { getCurrentUser } from "@/lib/current-user";
import { redirect } from "next/navigation";
import { canCreateOrder } from "@/lib/permissions";
import { buttonVariants } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { isOrderStatus } from "@/lib/order-options";
import { AccountMenu } from "@/components/account-menu";
import { logoutUser } from "@/app/logout/actions";
import { parsePage, calculateOffset } from "@/lib/pagination";

type SearchParams = {
  q?: string;
  status?: string;
  page?: string;
};

type HomePageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Home({ searchParams }: HomePageProps) {
  const { q, status, page } = await searchParams;
  const searchQuery = q?.trim() ?? "";
  const selectedStatus = status && isOrderStatus(status) ? status : undefined;
  const user = await getCurrentUser();
  const currentPage = parsePage(page);
  const offset = calculateOffset(currentPage);

  if (!user) {
    redirect("/login");
  }

  const canCreate = canCreateOrder(user.role);
  const orders = await getOrders({
    searchQuery,
    status: selectedStatus,
    offset,
  });

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8 flex items-start justify-between gap-4">
        <div className="text-left">
          <p className="border-l-2 border-primary pl-2 text-sm font-semibold uppercase text-muted-foreground">
            Production
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <h1 className="text-3xl font-bold text-foreground">Orders</h1>

            {canCreate && (
              <Link
                href="/orders/new"
                className={buttonVariants({ variant: "default" })}
              >
                <PlusIcon data-icon="inline-start" />
                Create order
              </Link>
            )}
          </div>
        </div>
        <AccountMenu
          userName={user.name}
          userTitle={user.title}
          logoutAction={logoutUser}
        />
      </header>
      <OrderList
        orders={orders}
        initialQuery={searchQuery}
        initialStatus={selectedStatus ?? "ALL"}
      />
    </main>
  );
}
