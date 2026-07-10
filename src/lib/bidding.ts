import type { Bid, Item } from "@/generated/prisma/client";

export function currentHighBid(item: Item, bids: Bid[]): number {
  return bids[0]?.amountCents ?? item.minBidCents;
}

export function minimumNextBid(item: Item, bids: Bid[]): number {
  return bids[0] ? bids[0].amountCents + item.incrementCents : item.minBidCents;
}

export function bidderDisplayName(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  const first = parts[0];
  const lastInitial = parts[parts.length - 1]?.[0] ?? "";
  return `${first} ${lastInitial}.`;
}
