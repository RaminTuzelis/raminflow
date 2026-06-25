import { CreateOrderForm } from "@/components/create-order-form";
import Link from "next/link";

export default function NewOrderPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="text-sm font-medium text-sky-400 hover:text-sky-300"
      >
        Back to orders
      </Link>
      <h1 className="mt-4 text-2xl font-semibold text-white">Create order</h1>
      <CreateOrderForm />
    </main>
  );
}
