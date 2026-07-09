"use client";

export function DeleteItemButton({
  itemName,
  action,
}: {
  itemName: string;
  action: () => Promise<void>;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(`Delete "${itemName}"? This also deletes its bid history.`)) {
          e.preventDefault();
        }
      }}
    >
      <button type="submit" className="text-red-600 hover:underline">
        Delete
      </button>
    </form>
  );
}
