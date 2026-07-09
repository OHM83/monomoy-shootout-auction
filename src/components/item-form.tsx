"use client";

import { useActionState } from "react";
import type { ItemFormState } from "@/app/actions/items";

const initialState: ItemFormState = {};

export function ItemForm({
  action,
  submitLabel,
  defaultValues,
}: {
  action: (prevState: ItemFormState, formData: FormData) => Promise<ItemFormState>;
  submitLabel: string;
  defaultValues?: {
    name: string;
    description: string;
    imageUrl: string;
    donatedBy: string;
    minBid: number;
    increment: number;
    status: "DRAFT" | "OPEN" | "CLOSED";
  };
}) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="space-y-4 rounded-lg border border-slate-200 bg-white p-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-slate-700">
          Item name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          defaultValue={defaultValues?.name}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-slate-700">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={4}
          defaultValue={defaultValues?.description}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="imageUrl" className="block text-sm font-medium text-slate-700">
          Image URL (optional)
        </label>
        <input
          id="imageUrl"
          name="imageUrl"
          type="url"
          placeholder="https://…"
          defaultValue={defaultValues?.imageUrl}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="donatedBy" className="block text-sm font-medium text-slate-700">
          Donated by (optional)
        </label>
        <input
          id="donatedBy"
          name="donatedBy"
          type="text"
          defaultValue={defaultValues?.donatedBy}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="minBid" className="block text-sm font-medium text-slate-700">
            Starting bid (USD)
          </label>
          <input
            id="minBid"
            name="minBid"
            type="number"
            step="0.01"
            min={0.01}
            required
            defaultValue={defaultValues?.minBid}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
          />
        </div>
        <div>
          <label htmlFor="increment" className="block text-sm font-medium text-slate-700">
            Bid increment (USD)
          </label>
          <input
            id="increment"
            name="increment"
            type="number"
            step="0.01"
            min={0.01}
            required
            defaultValue={defaultValues?.increment ?? 5}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
          />
        </div>
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-slate-700">
          Status
        </label>
        <select
          id="status"
          name="status"
          defaultValue={defaultValues?.status ?? "DRAFT"}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
        >
          <option value="DRAFT">Draft (hidden from guests)</option>
          <option value="OPEN">Open (accepting bids)</option>
          <option value="CLOSED">Closed (bidding ended)</option>
        </select>
      </div>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-sky-900 px-4 py-2 font-semibold text-white transition hover:bg-sky-800 disabled:opacity-50"
      >
        {pending ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}
