import { getOrders } from "@/db/queries";
import { OrderList } from "@/components/order-list";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { canCreateOrder } from "@/lib/permissions";

export default async function Home() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.mustChangePassword) {
    redirect("/change-password");
  }

  const canCreate = canCreateOrder(session.user.role);

  const orders = await getOrders();
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wider text-slate-500">
            Production
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-white">
            Orders
          </h1>
        </div>

        {canCreate ? (
          <Link
            href="/orders/new"
            className="inline-flex items-center justify-center rounded-lg border border-sky-500/40 bg-sky-500/10 px-4 py-2 text-sm font-semibold text-sky-300 transition hover:bg-sky-500/20"
          >
            Create order
          </Link>
        ) : (
          <div className="text-left sm:text-right">
            <button
              type="button"
              disabled
              className="inline-flex cursor-not-allowed items-center justify-center rounded-lg border border-slate-800 bg-slate-900/60 px-4 py-2 text-sm font-semibold text-slate-500"
            >
              Create order
            </button>
            <p className="mt-2 text-xs text-slate-500">
              Your role can view orders, but cannot create new ones.
            </p>
          </div>
        )}
      </div>
      <OrderList orders={orders} />
    </main>
  );
}
