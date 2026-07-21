"use client";
import type { SetUserActiveState } from "@/app/admin/users/[id]/actions";
import { useState, useActionState } from "react";
import { FieldError } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogFooter,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const initialState: SetUserActiveState = {
  success: false,
  error: null,
};

type SetUserActiveAction = (
  previousState: SetUserActiveState,
  formData: FormData,
) => Promise<SetUserActiveState>;

type StatusUser = {
  id: number;
  name: string;
  isActive: boolean;
};

type AdminUserStatusFormProps = {
  user: StatusUser;
  updateAction: SetUserActiveAction;
  onClose: () => void;
};

type AdminUserStatusButtonProps = {
  user: StatusUser;
  updateAction: SetUserActiveAction;
};

function AdminUserStatusForm({
  user,
  updateAction,
  onClose,
}: AdminUserStatusFormProps) {
  async function handleStatusUpdate(
    previousState: SetUserActiveState,
    formData: FormData,
  ): Promise<SetUserActiveState> {
    const result = await updateAction(previousState, formData);

    if (result.success) {
      onClose();
    }
    return result;
  }

  const [state, formAction, isPending] = useActionState(
    handleStatusUpdate,
    initialState,
  );

  const actionLabel = user.isActive ? "Deactivate account" : "Activate account";
  const pendingLabel = user.isActive ? "Deactivating..." : "Activating...";

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="userId" value={user.id} />
      <input type="hidden" name="isActive" value={String(!user.isActive)} />

      {state.error && (
        <FieldError id="user-status-error">{state.error}</FieldError>
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
        <Button
          type="submit"
          size="lg"
          variant={user.isActive ? "destructive" : "success"}
          disabled={isPending}
        >
          {isPending ? pendingLabel : actionLabel}
        </Button>
      </DialogFooter>
    </form>
  );
}

export function AdminUserStatusButton({
  user,
  updateAction,
}: AdminUserStatusButtonProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  return (
    <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
      <DialogTrigger
        render={
          <Button
            size="lg"
            variant={user.isActive ? "destructive" : "success"}
          />
        }
      >
        {user.isActive ? "Deactivate account" : "Activate account"}
      </DialogTrigger>

      {isConfirmOpen && (
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {user.isActive ? "Deactivate account" : "Activate account"}
            </DialogTitle>

            <DialogDescription>
              Are you sure you want to{" "}
              {user.isActive ? "deactivate" : "activate"} this account?
              <span className="mt-1 block font-medium text-foreground">
                {user.name}
              </span>
            </DialogDescription>
          </DialogHeader>
          <AdminUserStatusForm
            user={user}
            updateAction={updateAction}
            onClose={() => setIsConfirmOpen(false)}
          />
        </DialogContent>
      )}
    </Dialog>
  );
}
