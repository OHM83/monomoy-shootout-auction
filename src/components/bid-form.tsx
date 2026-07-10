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
      <div className="rounded-2xl bg-white shadow-lg p-6 text-center space-y-2">
        <div className="text-4xl">🎣</div>
        <h2 className="text-xl font-black text-slate-800">Bid placed!</h2>
        <p className="text-slate-600">
          You&apos;re currently the high bidder. Thanks for supporting the Monomoy Shootout.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <input type="hidden" name="itemSlug" value={itemSlug} />

      <div>
        <label htmlFor="amount" className="field-label">
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
          className="field-input text-lg"
        />
      </div>

      <div>
        <label htmlFor="bidderName" className="field-label">
          Name
        </label>
        <input id="bidderName" name="bidderName" type="text" required className="field-input" />
      </div>

      <div>
        <label htmlFor="bidderEmail" className="field-label">
          Email
        </label>
        <input id="bidderEmail" name="bidderEmail" type="email" required className="field-input" />
      </div>

      <div>
        <label htmlFor="bidderPhone" className="field-label">
          Phone (optional)
        </label>
        <input id="bidderPhone" name="bidderPhone" type="tel" className="field-input" />
      </div>

      {state.error && (
        <div className="bg-red-50 border border-red-300 text-red-700 rounded-xl px-4 py-3 text-sm font-medium">
          {state.error}
        </div>
      )}

      <button type="submit" disabled={pending} className="btn-primary w-full">
        {pending ? "Placing bid…" : "Place bid"}
      </button>
    </form>
  );
}
