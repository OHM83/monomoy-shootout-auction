"use client";

import { useActionState } from "react";
import { placeBidAction, type BidFormState } from "@/app/actions/bids";

const initialState: BidFormState = {};

export function BidForm({
  itemSlug,
  minimumNextBidDollars,
}: {
  itemSlug: string;
  minimumNextBidDollars: number;
}) {
  const [state, formAction, pending] = useActionState(placeBidAction, initialState);

  if (state.success) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-green-800">
        <p className="font-semibold">Bid placed!</p>
        <p className="text-sm">
          You&apos;re currently the high bidder. Thanks for supporting the Monomoy Shootout.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-3 rounded-lg border border-slate-200 bg-white p-4">
      <input type="hidden" name="itemSlug" value={itemSlug} />

      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-slate-700">
          Your bid (USD)
        </label>
        <input
          id="amount"
          name="amount"
          type="number"
          step="0.01"
          min={minimumNextBidDollars}
          defaultValue={minimumNextBidDollars}
          required
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-lg"
        />
      </div>

      <div>
        <label htmlFor="bidderName" className="block text-sm font-medium text-slate-700">
          Name
        </label>
        <input
          id="bidderName"
          name="bidderName"
          type="text"
          required
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="bidderEmail" className="block text-sm font-medium text-slate-700">
          Email
        </label>
        <input
          id="bidderEmail"
          name="bidderEmail"
          type="email"
          required
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="bidderPhone" className="block text-sm font-medium text-slate-700">
          Phone (optional)
        </label>
        <input
          id="bidderPhone"
          name="bidderPhone"
          type="tel"
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
        />
      </div>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-sky-900 px-4 py-2 font-semibold text-white transition hover:bg-sky-800 disabled:opacity-50"
      >
        {pending ? "Placing bid…" : "Place bid"}
      </button>
    </form>
  );
}
