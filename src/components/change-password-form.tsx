"use client";

import { useActionState, useState } from "react";
import {
  changePassword,
  type ChangePasswordState,
} from "@/app/change-password/actions";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const initialState: ChangePasswordState = {
  error: null,
};

export function ChangePasswordForm() {
  const [state, formAction, isPending] = useActionState(
    changePassword,
    initialState,
  );

  const [hasEditedAfterSubmit, setHasEditedAfterSubmit] = useState(false);

  const showError = Boolean(state.error) && !hasEditedAfterSubmit && !isPending;

  return (
    <form
      onChange={() => setHasEditedAfterSubmit(true)}
      onSubmit={() => setHasEditedAfterSubmit(false)}
      action={formAction}
      className="mt-8 space-y-5 rounded-lg border bg-card p-6 text-card-foreground shadow-sm"
    >
      <Field data-invalid={showError}>
        <FieldLabel htmlFor="currentPassword">Current password</FieldLabel>
        <Input
          id="currentPassword"
          name="currentPassword"
          type="password"
          autoComplete="current-password"
          required
          aria-describedby={showError ? "change-password-error" : undefined}
          aria-invalid={showError}
        />
      </Field>

      <Field data-invalid={showError}>
        <FieldLabel htmlFor="newPassword">New password</FieldLabel>
        <Input
          id="newPassword"
          name="newPassword"
          type="password"
          autoComplete="new-password"
          required
          aria-describedby={showError ? "change-password-error" : undefined}
          aria-invalid={showError}
        />
      </Field>

      <Field data-invalid={showError}>
        <FieldLabel htmlFor="confirmPassword">Confirm new password</FieldLabel>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          aria-describedby={showError ? "change-password-error" : undefined}
          aria-invalid={showError}
        />
      </Field>

      <FieldDescription>
        After changing your password, you will be asked to sign in again.
      </FieldDescription>

      {showError && (
        <FieldError id="change-password-error">{state.error}</FieldError>
      )}

      <Button disabled={isPending} type="submit" size="lg" className="w-full">
        {isPending ? "Changing..." : "Change password"}
      </Button>
    </form>
  );
}
