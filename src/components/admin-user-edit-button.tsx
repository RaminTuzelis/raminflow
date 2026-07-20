"use client";

import {
  useActionState,
  useState,
  startTransition,
  type SubmitEvent,
} from "react";
import type { UserRole } from "@/types/user";
import { roleOptions, userRoleLabels } from "@/lib/user-options";
import type {
  UpdateUserState,
  UpdateUserErrorField,
} from "@/app/admin/users/[id]/actions";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PencilIcon, SaveIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const initialState: UpdateUserState = {
  success: false,
  error: null,
};

type EditableUser = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  title: string;
  birthDate: string | null;
};

type UpdateUserAction = (
  previousState: UpdateUserState,
  formData: FormData,
) => Promise<UpdateUserState>;

type AdminUserEditFormProps = {
  user: EditableUser;
  updateAction: UpdateUserAction;
  onClose: () => void;
};

type AdminUserEditButtonProps = {
  user: EditableUser;
  updateAction: UpdateUserAction;
};

const roleItems = roleOptions.map((role) => ({
  value: role,
  label: userRoleLabels[role],
}));

function AdminUserEditForm({
  user,
  updateAction,
  onClose,
}: AdminUserEditFormProps) {
  async function handleUpdate(
    previousState: UpdateUserState,
    formData: FormData,
  ): Promise<UpdateUserState> {
    const result = await updateAction(previousState, formData);

    if (result.success) {
      onClose();
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
    handleUpdate,
    initialState,
  );
  const [hasEditedAfterSubmit, setHasEditedAfterSubmit] = useState(false);
  const showError = Boolean(state.error) && !hasEditedAfterSubmit && !isPending;
  function fieldHasError(field: UpdateUserErrorField) {
    return showError && state.errorField === field;
  }

  return (
    <form
      onSubmit={handleSubmit}
      onChange={() => setHasEditedAfterSubmit(true)}
      className="space-y-4"
    >
      <input type="hidden" name="userId" value={user.id} />

      <Field data-invalid={fieldHasError("name")}>
        <FieldLabel htmlFor="edit-user-name">Name</FieldLabel>
        <Input
          type="text"
          id="edit-user-name"
          name="name"
          required
          defaultValue={user.name}
          autoComplete="name"
          aria-invalid={fieldHasError("name")}
          aria-describedby={fieldHasError("name") ? "save-error" : undefined}
        />
      </Field>

      <Field data-invalid={fieldHasError("email")}>
        <FieldLabel htmlFor="edit-user-email">Email</FieldLabel>
        <Input
          type="email"
          id="edit-user-email"
          name="email"
          required
          defaultValue={user.email}
          autoComplete="email"
          aria-invalid={fieldHasError("email")}
          aria-describedby={fieldHasError("email") ? "save-error" : undefined}
        />
      </Field>

      <Field data-invalid={fieldHasError("role")}>
        <FieldLabel htmlFor="edit-user-role">Role</FieldLabel>
        <Select items={roleItems} name="role" required defaultValue={user.role}>
          <SelectTrigger
            id="edit-user-role"
            className="w-full"
            aria-invalid={fieldHasError("role")}
            aria-describedby={fieldHasError("role") ? "save-error" : undefined}
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
        <FieldLabel htmlFor="edit-user-title">Title</FieldLabel>
        <Input
          type="text"
          id="edit-user-title"
          name="title"
          autoComplete="organization-title"
          required
          defaultValue={user.title}
          aria-invalid={fieldHasError("title")}
          aria-describedby={fieldHasError("title") ? "save-error" : undefined}
        />
      </Field>

      <Field data-invalid={fieldHasError("birthDate")}>
        <FieldLabel htmlFor="edit-user-birth-date">Birth date</FieldLabel>
        <Input
          type="date"
          id="edit-user-birth-date"
          name="birthDate"
          defaultValue={user.birthDate ?? ""}
          className="[&::-webkit-calendar-picker-indicator]:invert"
          aria-invalid={fieldHasError("birthDate")}
          aria-describedby={
            fieldHasError("birthDate") ? "save-error" : undefined
          }
        />
      </Field>

      {showError && <FieldError id="save-error">{state.error}</FieldError>}

      <DialogFooter>
        <Button type="button" variant="outline" size="lg" onClick={onClose}>
          Cancel
        </Button>
        <Button disabled={isPending} type="submit" size="lg">
          <SaveIcon data-icon="inline-start" />
          {isPending ? "Saving..." : "Save changes"}
        </Button>
      </DialogFooter>
    </form>
  );
}

export function AdminUserEditButton({
  user,
  updateAction,
}: AdminUserEditButtonProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
      <DialogTrigger render={<Button variant="outline" size="lg" />}>
        <PencilIcon data-icon="inline-start" />
        Edit user
      </DialogTrigger>

      {isEditOpen && (
        <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit user</DialogTitle>
            <DialogDescription>
              Update profile information and account role for{" "}
              <span className="whitespace-nowrap">{user.name}</span>
            </DialogDescription>
          </DialogHeader>
          <AdminUserEditForm
            user={user}
            updateAction={updateAction}
            onClose={() => setIsEditOpen(false)}
          />
        </DialogContent>
      )}
    </Dialog>
  );
}
