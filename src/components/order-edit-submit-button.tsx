"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { SaveIcon, LoaderCircleIcon } from "lucide-react";

export function OrderEditSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} aria-busy={pending}>
      {pending ? (
        <>
          <LoaderCircleIcon
            aria-hidden="true"
            data-icon="inline-start"
            className="animate-spin"
          />
          Saving...
        </>
      ) : (
        <>
          <SaveIcon aria-hidden="true" data-icon="inline-start" />
          Save order details
        </>
      )}
    </Button>
  );
}
