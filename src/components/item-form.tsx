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
    <form action={formAction} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div>
        <label htmlFor="name" className="field-label">
          Item name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          defaultValue={defaultValues?.name}
          className="field-input"
        />
      </div>

      <div>
        <label htmlFor="description" className="field-label">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={4}
          defaultValue={defaultValues?.description}
          className="field-input resize-none"
        />
      </div>

      <div>
        <label htmlFor="imageUrl" className="field-label">
          Image URL (optional)
        </label>
        <input
          id="imageUrl"
          name="imageUrl"
          type="url"
          placeholder="https://…"
          defaultValue={defaultValues?.imageUrl}
          className="field-input"
        />
      </div>

      <div>
        <label htmlFor="donatedBy" className="field-label">
          Donated by (optional)
        </label>
        <input
          id="donatedBy"
          name="donatedBy"
          type="text"
          defaultValue={defaultValues?.donatedBy}
          className="field-input"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="minBid" className="field-label">
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
            className="field-input"
          />
        </div>
        <div>
          <label htmlFor="increment" className="field-label">
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
            className="field-input"
          />
        </div>
      </div>

      <div>
        <label htmlFor="status" className="field-label">
          Status
        </label>
        <select
          id="status"
          name="status"
          defaultValue={defaultValues?.status ?? "DRAFT"}
          className="field-input cursor-pointer"
        >
          <option value="DRAFT">Draft (hidden from guests)</option>
          <option value="OPEN">Open (accepting bids)</option>
          <option value="CLOSED">Closed (bidding ended)</option>
        </select>
      </div>

      {state.error && (
        <div className="bg-red-50 border border-red-300 text-red-700 rounded-xl px-4 py-3 text-sm font-medium">
          {state.error}
        </div>
      )}

      <button type="submit" disabled={pending} className="btn-primary w-full">
        {pending ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}
