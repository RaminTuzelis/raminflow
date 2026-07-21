"use client";

import type {
  ResetUserPasswordState,
  ResetUserPasswordErrorField,
} from "@/app/admin/users/[id]/actions";
import {
  useActionState,
  useState,
  startTransition,
  type SubmitEvent,
} from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { KeyRoundIcon } from "lucide-react";
import {
  Dialog,
  DialogFooter,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const initialState: ResetUserPasswordState = {
  success: false,
  error: null,
};

type ResetUserPasswordAction = (
  previousState: ResetUserPasswordState,
  formData: FormData,
) => Promise<ResetUserPasswordState>;

type PasswordResetUser = {
  id: number;
  name: string;
};

type AdminUserPasswordResetButtonProps = {
  user: PasswordResetUser;
  resetAction: ResetUserPasswordAction;
};

type AdminUserPasswordResetFormProps = {
  user: PasswordResetUser;
  resetAction: ResetUserPasswordAction;
  onClose: () => void;
  onSuccess: () => void;
};

function AdminUserPasswordResetForm({
  user,
  resetAction,
  onClose,
  onSuccess,
}: AdminUserPasswordResetFormProps) {
  async function handleReset(
    previousState: ResetUserPasswordState,
    formData: FormData,
  ): Promise<ResetUserPasswordState> {
    const result = await resetAction(previousState, formData);

    if (result.success) {
      onSuccess();
    }
    return result;
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    setHasEditedAfterSubmit(false);

    const formData = new FormData(event.currentTarget);

    startTransition(() => {
      formAction(formData);
    });
  }

  const [state, formAction, isPending] = useActionState(
    handleReset,
    initialState,
  );

  const [hasEditedAfterSubmit, setHasEditedAfterSubmit] = useState(false);
  const showError = Boolean(state.error) && !hasEditedAfterSubmit && !isPending;

  function fieldHasError(field: ResetUserPasswordErrorField) {
    return showError && state.errorField === field;
  }

  return (
    <form
      onSubmit={handleSubmit}
      onChange={() => setHasEditedAfterSubmit(true)}
      className="space-y-4"
    >
      <input type="hidden" name="userId" value={user.id} />

      <Field data-invalid={fieldHasError("temporaryPassword")}>
        <FieldLabel htmlFor="temporary-password">Temporary password</FieldLabel>
        <Input
          id="temporary-password"
          name="temporaryPassword"
          type="password"
          minLength={8}
          required
          autoComplete="new-password"
          aria-invalid={fieldHasError("temporaryPassword")}
          aria-describedby={
            fieldHasError("temporaryPassword")
              ? "reset-password-error"
              : undefined
          }
        />
      </Field>

      <Field data-invalid={fieldHasError("confirmPassword")}>
        <FieldLabel htmlFor="confirm-temporary-password">
          Confirm temporary password
        </FieldLabel>
        <Input
          id="confirm-temporary-password"
          name="confirmPassword"
          type="password"
          minLength={8}
          required
          autoComplete="new-password"
          aria-invalid={fieldHasError("confirmPassword")}
          aria-describedby={
            fieldHasError("confirmPassword")
              ? "reset-password-error"
              : undefined
          }
        />
      </Field>

      {showError && (
        <FieldError id="reset-password-error">{state.error}</FieldError>
      )}
      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={onClose}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button type="submit" size="lg" variant="warning" disabled={isPending}>
          <KeyRoundIcon data-icon="inline-start" />
          {isPending ? "Resetting..." : "Reset password"}
        </Button>
      </DialogFooter>
    </form>
  );
}

export function AdminUserPasswordResetButton({
  user,
  resetAction,
}: AdminUserPasswordResetButtonProps) {
  const [isResetOpen, setIsResetOpen] = useState(false);

  function handleSuccess() {
    setIsResetOpen(false);
    toast.success("Password reset successfully.", {
      description: user.name,
    });
  }

  return (
    <Dialog open={isResetOpen} onOpenChange={setIsResetOpen}>
      <DialogTrigger render={<Button variant="warning" size="lg" />}>
        <KeyRoundIcon data-icon="inline-start" />
        Reset password
      </DialogTrigger>

      {isResetOpen && (
        <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reset password</DialogTitle>

            <DialogDescription>
              Set a temporary password for{" "}
              <span className="font-medium text-foreground">{user.name}</span>
            </DialogDescription>
          </DialogHeader>

          <AdminUserPasswordResetForm
            user={user}
            resetAction={resetAction}
            onClose={() => setIsResetOpen(false)}
            onSuccess={handleSuccess}
          />
        </DialogContent>
      )}
    </Dialog>
  );
}
