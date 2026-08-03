"use client";

import { useActionState, useState } from "react";
import type {
  RemoveOrderItemAction,
  RemoveOrderItemState,
} from "@/app/orders/[id]/edit/actions";
import type { OrderItem } from "@/types/order";
import { LoaderCircleIcon, Trash2Icon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { FieldError } from "@/components/ui/field";
import { toast } from "sonner";

const initialState: RemoveOrderItemState = {
  success: false,
  error: null,
};

type OrderEditRemoveItemButtonProps = {
  orderId: string;
  item: OrderItem;
  removeAction: RemoveOrderItemAction;
};

type OrderEditRemoveItemFormProps = OrderEditRemoveItemButtonProps & {
  onClose: () => void;
  onSuccess: () => void;
};

function OrderEditRemoveItemForm({
  orderId,
  item,
  removeAction,
  onClose,
  onSuccess,
}: OrderEditRemoveItemFormProps) {
  async function handleRemove(
    previousState: RemoveOrderItemState,
    formData: FormData,
  ): Promise<RemoveOrderItemState> {
    const result = await removeAction(previousState, formData);

    if (result.success) {
      onSuccess();
    }

    return result;
  }

  const [state, formAction, isPending] = useActionState(
    handleRemove,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-4" aria-busy={isPending}>
      <input type="hidden" name="orderId" value={orderId} />
      <input type="hidden" name="itemId" value={item.id} />

      {state.error && <FieldError>{state.error}</FieldError>}

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isPending}
        >
          <XIcon aria-hidden="true" data-icon="inline-start" />
          Cancel
        </Button>
        <Button type="submit" variant="destructive" disabled={isPending}>
          {isPending ? (
            <LoaderCircleIcon
              aria-hidden="true"
              data-icon="inline-start"
              className="animate-spin"
            />
          ) : (
            <Trash2Icon aria-hidden="true" data-icon="inline-start" />
          )}
          {isPending ? "Removing..." : "Remove item"}
        </Button>
      </DialogFooter>
    </form>
  );
}

export function OrderEditRemoveItemButton({
  orderId,
  item,
  removeAction,
}: OrderEditRemoveItemButtonProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  return (
    <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
      <DialogTrigger render={<Button variant="destructive" size="sm" />}>
        <Trash2Icon aria-hidden="true" data-icon="inline-start" />
        Remove item
      </DialogTrigger>

      {isConfirmOpen && (
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Remove item?</DialogTitle>
            <DialogDescription>
              This item will be removed from the order. This action cannot be
              undone.
              <span className="mt-1 block font-medium text-foreground">
                {item.name}
              </span>
            </DialogDescription>
          </DialogHeader>

          <OrderEditRemoveItemForm
            orderId={orderId}
            item={item}
            removeAction={removeAction}
            onClose={() => setIsConfirmOpen(false)}
            onSuccess={() => {
              setIsConfirmOpen(false);
              toast.success("Order item removed successfully.");
            }}
          />
        </DialogContent>
      )}
    </Dialog>
  );
}
