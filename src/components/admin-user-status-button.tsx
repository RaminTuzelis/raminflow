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
import { UserRoundCheckIcon, UserRoundXIcon } from "lucide-react";
import { toast } from "sonner";

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
  onSuccess: () => void;
};

type AdminUserStatusButtonProps = {
  user: StatusUser;
  updateAction: SetUserActiveAction;
};

function AdminUserStatusForm({
  user,
  updateAction,
  onClose,
  onSuccess,
}: AdminUserStatusFormProps) {
  async function handleStatusUpdate(
    previousState: SetUserActiveState,
    formData: FormData,
  ): Promise<SetUserActiveState> {
    const result = await updateAction(previousState, formData);

    if (result.success) {
      onSuccess();
    }
    return result;
  }

  const [state, formAction, isPending] = useActionState(
    handleStatusUpdate,
    initialState,
  );

  const ActionIcon = user.isActive ? UserRoundXIcon : UserRoundCheckIcon;
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
          <ActionIcon data-icon="inline-start" />
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
  const ActionIcon = user.isActive ? UserRoundXIcon : UserRoundCheckIcon;

  function handleSuccess() {
    setIsConfirmOpen(false);
    toast.success(
      user.isActive
        ? "Account deactivated successfully."
        : "Account activated successfully.",
      {
        description: user.name,
      },
    );
  }

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
        <ActionIcon data-icon="inline-start" />
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
            onSuccess={handleSuccess}
          />
        </DialogContent>
      )}
    </Dialog>
  );
}
