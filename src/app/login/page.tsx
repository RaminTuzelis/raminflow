import { loginUser } from "@/app/login/actions";

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-4 py-8">
      <p className="text-sm font-medium uppercase tracking-wider text-slate-500">
        RaminFlow
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">
        Sign in
      </h1>
      <form
        action={loginUser}
        className="mt-8 space-y-5 rounded-lg border border-slate-800 bg-slate-900/40 p-6 shadow-sm"
      >
        <div className="grid gap-2">
          <label className="text-sm font-medium text-slate-200" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
          />
        </div>
        <div className="grid gap-2">
          <label
            className="text-sm font-medium text-slate-200"
            htmlFor="password"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-lg bg-sky-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
        >
          Login
        </button>
      </form>
    </main>
  );
}
