import { getOrders } from "@/db/queries";
import { OrderList } from "@/components/order-list";
import Link from "next/link";
import { getCurrentUser } from "@/lib/current-user";
import { redirect } from "next/navigation";
import { canCreateOrder } from "@/lib/permissions";
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
      <div className="mb-8 flex flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="text-left">
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Production
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-4">
              <h1 className="text-3xl font-bold tracking-tight text-white">
                Orders
              </h1>

              {canCreate && (
                <Link
                  href="/orders/new"
                  className="inline-flex items-center justify-center rounded-md border border-sky-500/40 bg-sky-500/10 px-3 py-1.5 text-xs font-semibold text-sky-300 transition hover:bg-sky-500/20"
                >
                  Create order
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 sm:justify-end">
            <div className="text-left sm:text-right">
              <p className="text-sm font-medium text-slate-200">{user.name}</p>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                {user.title || "Title not set"}
              </p>
            </div>

            <Link
              href="/account"
              className="rounded-md border border-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-400 transition hover:border-sky-500/60 hover:text-sky-300"
            >
              Account
            </Link>

            <form action={logoutUser}>
              <button
                type="submit"
                className="rounded-md border border-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-400 transition hover:border-sky-500/60 hover:text-sky-300"
              >
                Logout
              </button>
            </form>
          </div>
        </div>
      </div>
      <OrderList orders={orders} />
    </main>
  );
}
