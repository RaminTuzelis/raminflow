import { CreateOrderForm } from "@/components/create-order-form";
import Link from "next/link";
import { getCurrentUser } from "@/lib/current-user";
import { redirect } from "next/navigation";
import { canCreateOrder } from "@/lib/permissions";

export default async function NewOrderPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  if (!canCreateOrder(currentUser.role)) {
    redirect("/");
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm font-medium text-sky-400 transition hover:text-sky-300"
      >
        <span aria-hidden="true">←</span>
        Back to orders
      </Link>
      <h1 className="mt-4 text-2xl font-semibold text-white">Create order</h1>
      <CreateOrderForm />
    </main>
  );
}
