"use client";

import { useFormStatus } from "react-dom";

export function StatusUpdateSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`rounded-lg border px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-slate-950 ${
        pending
          ? "cursor-wait border-sky-500/40 bg-sky-500/10 text-sky-300 opacity-80"
          : "border-slate-700 bg-slate-900 text-slate-200 hover:border-sky-500 hover:text-sky-300"
      }`}
    >
      {pending ? "Updating..." : "Update"}
    </button>
  );
}
