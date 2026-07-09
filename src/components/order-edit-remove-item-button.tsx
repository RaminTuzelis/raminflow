"use client";

export function OrderEditRemoveItemButton() {
  return (
    <button
      type="submit"
      onClick={(event) => {
        if (!confirm("Remove this item from the order?")) {
          event.preventDefault();
        }
      }}
      className="text-sm font-medium text-red-400 transition hover:text-red-300"
    >
      Remove
    </button>
  );
}
