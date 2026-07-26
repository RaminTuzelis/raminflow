"use client";

import { useFormStatus } from "react-dom";
import { LoaderCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function StatusUpdateSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className="w-full min-[720px]:w-auto"
      disabled={pending}
    >
      {pending && (
        <LoaderCircleIcon
          data-icon="inline-start"
          className="animate-spin"
          aria-hidden="true"
        />
      )}
      {pending ? "Updating..." : "Update"}
    </Button>
  );
}
