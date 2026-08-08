import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";

export default function OrderNotFound() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-foreground">
        Order not found
      </h1>
      <p className="mt-2 text-muted-foreground">
        The requested order does not exist.
      </p>
      <Link
        href="/"
        className={buttonVariants({
          variant: "outline",
          className: "mt-6",
        })}
      >
        <ArrowLeftIcon aria-hidden="true" data-icon="inline-start" />
        Back to orders
      </Link>
    </main>
  );
}
