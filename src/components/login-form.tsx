"use client";

import { useActionState, useState } from "react";
import { loginUser, type LoginState } from "@/app/login/actions";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const initialState: LoginState = {
  error: null,
};

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [hasEditedAfterSubmit, setHasEditedAfterSubmit] = useState(false);
  const [state, formAction, isPending] = useActionState(
    loginUser,
    initialState,
  );

  const showError = Boolean(state.error) && !hasEditedAfterSubmit && !isPending;

  return (
    <form
      action={formAction}
      onChange={() => setHasEditedAfterSubmit(true)}
      onSubmit={() => setHasEditedAfterSubmit(false)}
      className="space-y-5"
    >
      <Field data-invalid={showError}>
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <Input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          aria-invalid={showError}
          aria-describedby={showError ? "login-error" : undefined}
        />
      </Field>

      <Field data-invalid={showError}>
        <FieldLabel htmlFor="password">Password</FieldLabel>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          aria-invalid={showError}
          aria-describedby={showError ? "login-error" : undefined}
        />
      </Field>

      {showError && <FieldError id="login-error">{state.error}</FieldError>}

      <Button disabled={isPending} type="submit" size="lg" className="w-full">
        {isPending ? "Signing in..." : "Login"}
      </Button>
    </form>
  );
}
