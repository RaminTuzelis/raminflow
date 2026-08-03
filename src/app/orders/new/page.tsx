import { CreateOrderForm } from "@/components/create-order-form";
import Link from "next/link";
import { getCurrentUser } from "@/lib/current-user";
import { redirect } from "next/navigation";
import { canCreateOrder } from "@/lib/permissions";
import { ArrowLeftIcon } from "lucide-react";

export default async function NewOrderPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  if (!canCreateOrder(currentUser.role)) {
    redirect("/");
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm font-medium text-primary transition hover:text-[color-mix(in_oklch,var(--primary),var(--foreground)_25%)]"
      >
        <ArrowLeftIcon aria-hidden="true" className="size-4" />
        Back to orders
      </Link>
      <header className="mt-5">
        <p className="border-l-2 border-primary pl-2 text-sm font-semibold uppercase text-muted-foreground">
          Production
        </p>

        <h1 className="mt-4 text-3xl font-bold text-foreground">
          Create order
        </h1>

        <p className="mt-2 text-base text-muted-foreground">
          Add the order details and production items.
        </p>
      </header>
      <CreateOrderForm />
    </main>
  );
}
