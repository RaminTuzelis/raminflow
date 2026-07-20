"use client";

import { startTransition, useActionState, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldDescription,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { UserPlusIcon } from "lucide-react";
import type { SubmitEvent } from "react";
import {
  createUser,
  type CreateUserState,
  type CreateUserErrorField,
} from "@/app/admin/users/new/actions";
import { roleOptions, userRoleLabels } from "@/lib/user-options";

const initialState: CreateUserState = {
  error: null,
};

const roleItems = roleOptions.map((role) => ({
  value: role,
  label: userRoleLabels[role],
}));

export function CreateUserForm() {
  const [state, formAction, isPending] = useActionState(
    createUser,
    initialState,
  );

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setHasEditedAfterSubmit(false);

    const formData = new FormData(event.currentTarget);

    startTransition(() => {
      formAction(formData);
    });
  }

  const [hasEditedAfterSubmit, setHasEditedAfterSubmit] = useState(false);
  const showError = Boolean(state.error) && !hasEditedAfterSubmit && !isPending;

  function fieldHasError(field: CreateUserErrorField) {
    return showError && state.errorField === field;
  }

  return (
    <form
      onChange={() => setHasEditedAfterSubmit(true)}
      onSubmit={handleSubmit}
      className="mt-8 space-y-5 rounded-lg border border-slate-800 bg-slate-900/40 p-6"
    >
      <Field data-invalid={fieldHasError("name")}>
        <FieldLabel htmlFor="name">Name</FieldLabel>
        <Input
          type="text"
          id="name"
          name="name"
          required
          aria-invalid={fieldHasError("name")}
          aria-describedby={
            fieldHasError("name") ? "create-user-error" : undefined
          }
        />
      </Field>

      <Field data-invalid={fieldHasError("email")}>
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <Input
          type="email"
          id="email"
          name="email"
          required
          aria-invalid={fieldHasError("email")}
          aria-describedby={
            fieldHasError("email") ? "create-user-error" : undefined
          }
        />
      </Field>

      <Field data-invalid={fieldHasError("role")}>
        <FieldLabel htmlFor="role">Role</FieldLabel>
        <Select items={roleItems} name="role" required>
          <SelectTrigger
            id="role"
            className="w-full"
            aria-invalid={fieldHasError("role")}
            aria-describedby={
              fieldHasError("role") ? "create-user-error" : undefined
            }
          >
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {roleItems.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>

      <Field data-invalid={fieldHasError("title")}>
        <FieldLabel htmlFor="title">Title</FieldLabel>
        <Input
          type="text"
          id="title"
          name="title"
          required
          aria-invalid={fieldHasError("title")}
          aria-describedby={
            fieldHasError("title") ? "create-user-error" : undefined
          }
        />
      </Field>

      <Field data-invalid={fieldHasError("birthDate")}>
        <FieldLabel htmlFor="birthDate">Birth date</FieldLabel>
        <Input
          type="date"
          id="birthDate"
          name="birthDate"
          className="[&::-webkit-calendar-picker-indicator]:invert"
          aria-invalid={fieldHasError("birthDate")}
          aria-describedby={
            fieldHasError("birthDate") ? "create-user-error" : undefined
          }
        />
      </Field>

      <Field data-invalid={fieldHasError("temporaryPassword")}>
        <FieldLabel htmlFor="temporaryPassword">Temporary password</FieldLabel>
        <Input
          type="password"
          id="temporaryPassword"
          name="temporaryPassword"
          autoComplete="new-password"
          minLength={8}
          required
          aria-invalid={fieldHasError("temporaryPassword")}
          aria-describedby={
            fieldHasError("temporaryPassword") ? "create-user-error" : undefined
          }
        />
        <FieldDescription>
          The user will be required to change this password after signing in.
        </FieldDescription>
      </Field>

      {showError && (
        <FieldError id="create-user-error">{state.error}</FieldError>
      )}
      <div className="flex justify-end border-t border-slate-800 pt-5">
        <Button
          type="submit"
          disabled={isPending}
          size="lg"
          className="w-full sm:w-auto"
        >
          <UserPlusIcon data-icon="inline-start" />
          {isPending ? "Creating..." : "Create user"}
        </Button>
      </div>
    </form>
  );
}
