"use client";

import { useFormStatus } from "react-dom";

export function OrderEditAddItemSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <div className="flex justify-end border-t border-slate-800 pt-4">
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg border border-sky-500/40 bg-sky-500/10 px-4 py-2 text-sm font-semibold text-sky-300 transition hover:bg-sky-500/20"
      >
        {pending ? "Adding..." : "Add item"}
      </button>
    </div>
  );
}
