import { getOrders } from "@/db/queries";
import { OrderList } from "@/components/order-list";
import Link from "next/link";
import { getCurrentUser } from "@/lib/current-user";
import { redirect } from "next/navigation";
import { canCreateOrder } from "@/lib/permissions";
import { buttonVariants } from "@/components/ui/button";
import { LogOutIcon, PlusIcon, UserIcon } from "lucide-react";
import { logoutUser } from "@/app/logout/actions";

export default async function Home() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const canCreate = canCreateOrder(user.role);

  const orders = await getOrders();
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
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

        <div className="flex flex-wrap items-center gap-3 sm:justify-end">
          <div className="text-left sm:text-right">
            <p className="text-sm font-medium text-foreground">{user.name}</p>
            <p className="text-xs font-medium uppercase text-muted-foreground">
              {user.title || "Title not set"}
            </p>
          </div>

          <Link
            href="/account"
            className={buttonVariants({
              variant: "secondary",
              size: "sm",
            })}
          >
            <UserIcon data-icon="inline-start" />
            Account
          </Link>

          <form action={logoutUser}>
            <button
              type="submit"
              className={buttonVariants({
                variant: "outline",
                size: "sm",
              })}
            >
              <LogOutIcon data-icon="inline-start" />
              Logout
            </button>
          </form>
        </div>
      </header>
      <OrderList orders={orders} />
    </main>
  );
}
