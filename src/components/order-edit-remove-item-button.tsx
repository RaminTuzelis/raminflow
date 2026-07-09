"use client";

import { useState } from "react";

export function OrderEditRemoveItemButton() {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsConfirmOpen(true)}
        className="inline-flex items-center justify-center rounded-md border border-red-500/30 bg-red-500/5 px-2.5 py-1 text-sm font-semibold text-red-300 transition hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-200"
      >
        Remove
      </button>

      {isConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4">
          <div className="w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-900 p-6 text-left shadow-xl">
            <h2 className="text-lg font-semibold text-white">Remove item?</h2>
            <div className="mt-2 text-sm leading-6 text-slate-400">
              <p>This item will be removed from the order.</p>
              <p>This action cannot be undone.</p>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsConfirmOpen(false)}
                className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-slate-500 hover:text-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-500/20"
              >
                Remove item
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
