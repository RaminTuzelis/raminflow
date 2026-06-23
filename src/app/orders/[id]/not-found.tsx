import Link from "next/link";

export default function OrderNotFound() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-white">Order not found</h1>
      <p className="mt-2 text-slate-400">The requested order does not exist.</p>
      <Link
        href="/"
        className="mt-6 inline-block font-medium text-sky-400 hover:text-sky-300"
      >
        Back to orders
      </Link>
    </main>
  );
}
