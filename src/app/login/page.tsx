import { LoginForm } from "@/components/login-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-4 py-8">
      <Card>
        <CardHeader>
          <p className="border-l-2 border-primary pl-2 text-sm font-semibold uppercase text-muted-foreground">
            RaminFlow
          </p>
          <CardTitle className="mt-3">
            <h1 className="text-3xl font-bold text-foreground">Sign in</h1>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </main>
  );
}
