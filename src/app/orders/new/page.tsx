import { CreateOrderForm } from "@/components/create-order-form";

export default function NewOrderPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-white">Create order</h1>
      <CreateOrderForm />
    </main>
  );
}
