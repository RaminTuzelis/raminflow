import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-4 py-8">
      <p className="text-sm font-medium uppercase tracking-wider text-slate-500">
        RaminFlow
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">
        Sign in
      </h1>
      <LoginForm />
    </main>
  );
}
