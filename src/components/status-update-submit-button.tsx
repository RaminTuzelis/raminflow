"use client";

import { useFormStatus } from "react-dom";

type StatusUpdateSubmitButtonProps = {
  disabled?: boolean;
};

export function StatusUpdateSubmitButton({
  disabled = false,
}: StatusUpdateSubmitButtonProps) {
  const { pending } = useFormStatus();
  const isDisabled = disabled || pending;

  return (
    <button
      type="submit"
      disabled={isDisabled}
      className={`rounded-lg border px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-slate-950 ${
        pending
          ? "cursor-wait border-sky-500/40 bg-sky-500/10 text-sky-300 opacity-80"
          : disabled
            ? "cursor-not-allowed border-slate-800 bg-slate-900/60 text-slate-500"
            : "border-slate-700 bg-slate-900 text-slate-200 hover:border-sky-500 hover:text-sky-300"
      }`}
    >
      {pending ? "Updating..." : "Update"}
    </button>
  );
}
