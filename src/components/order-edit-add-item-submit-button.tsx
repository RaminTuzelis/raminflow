"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { PlusIcon, LoaderCircleIcon } from "lucide-react";

export function OrderEditAddItemSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <div className="flex justify-end border-t pt-4">
      <Button type="submit" aria-busy={pending} disabled={pending}>
        {pending ? (
          <>
            <LoaderCircleIcon
              aria-hidden="true"
              data-icon="inline-start"
              className="animate-spin"
            />
            Adding...
          </>
        ) : (
          <>
            <PlusIcon aria-hidden="true" data-icon="inline-start" />
            Add item
          </>
        )}
      </Button>
    </div>
  );
}
