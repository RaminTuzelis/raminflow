import { db } from "@/db/client";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";

export default async function AccountPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, Number(session.user.id)),
  });

  if (!user) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm font-medium text-sky-400 transition hover:text-sky-300"
      >
        <span aria-hidden="true">←</span>
        Back to orders
      </Link>
      <div>
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Account
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-white">
          Your profile
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Review your account details and access account settings.
        </p>
      </div>
      <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-slate-700 bg-slate-950 text-lg font-semibold text-sky-300">
            {user.name.slice(0, 1).toUpperCase()}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">{user.name}</h2>
            <p className="text-sm text-slate-400">{user.email}</p>
          </div>
        </div>
        <div className="mt-6 border-t border-slate-800 pt-6">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
            Title
          </p>
          <p className="mt-1 text-sm font-medium text-slate-200">
            {user.title || "Not set"}
          </p>
        </div>
        <div className="mt-6 flex justify-end border-t border-slate-800 pt-6">
          <Link
            href="/change-password"
            className="inline-flex items-center justify-center rounded-md border border-slate-800 px-3 py-1.5 text-sm font-semibold text-slate-300 transition hover:border-sky-500/60 hover:text-sky-300"
          >
            Change password
          </Link>
        </div>
      </section>
    </main>
  );
}
