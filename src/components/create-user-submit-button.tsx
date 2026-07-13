"use client";

import { useFormStatus } from "react-dom";

export function CreateUserSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center w-full justify-center sm:w-auto rounded-lg border border-sky-500/40 bg-sky-500/10 px-4 py-2 text-sm font-semibold text-sky-300 transition hover:bg-sky-500/20 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Creating..." : "Create user"}
    </button>
  );
}
