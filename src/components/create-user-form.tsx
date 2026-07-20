"use client";

import { startTransition, useActionState, useState } from "react";
import { Input } from "@/components/ui/input";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
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

  return (
    <form
      onChange={() => setHasEditedAfterSubmit(true)}
      onSubmit={handleSubmit}
      className="mt-8 space-y-5 rounded-lg border border-slate-800 bg-slate-900/40 p-6"
    >
      <Field>
        <FieldLabel htmlFor="name">Name</FieldLabel>
        <Input type="text" id="name" name="name" required />
      </Field>

      <Field>
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <Input type="email" id="email" name="email" required />
      </Field>

      <Field>
        <FieldLabel htmlFor="role">Role</FieldLabel>
        <Select items={roleItems} name="role" required>
          <SelectTrigger id="role" className="w-full">
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

      <Field>
        <FieldLabel htmlFor="title">Title</FieldLabel>
        <Input type="text" id="title" name="title" required />
      </Field>

      <Field>
        <FieldLabel htmlFor="birthDate">Birth date</FieldLabel>
        <Input
          type="date"
          id="birthDate"
          name="birthDate"
          className="[&::-webkit-calendar-picker-indicator]:invert"
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="temporaryPassword">Temporary password</FieldLabel>
        <Input
          type="password"
          id="temporaryPassword"
          name="temporaryPassword"
          autoComplete="new-password"
          minLength={8}
          required
        />
        <FieldDescription>
          The user will be required to change this password after signing in.
        </FieldDescription>
      </Field>

      {showError && (
        <p
          id="create-user-error"
          role="alert"
          className="text-sm font-medium text-red-400"
        >
          {state.error}
        </p>
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
