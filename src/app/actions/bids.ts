"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { dollarsToCents, formatCents } from "@/lib/money";

export type BidFormState = { error?: string; success?: boolean };

const bidSchema = z.object({
  itemSlug: z.string().min(1),
  amount: z.coerce.number().positive("Enter a bid amount"),
  bidderName: z.string().trim().min(1, "Name is required").max(120),
  bidderEmail: z.string().trim().email("Enter a valid email"),
  bidderPhone: z.string().trim().max(30).optional().or(z.literal("")),
});

export async function placeBidAction(
  _prevState: BidFormState,
  formData: FormData
): Promise<BidFormState> {
  const parsed = bidSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  const data = parsed.data;
  const amountCents = dollarsToCents(data.amount);

  try {
    await prisma.$transaction(
      async (tx) => {
        const item = await tx.item.findUnique({
          where: { slug: data.itemSlug },
          include: { bids: { orderBy: { amountCents: "desc" }, take: 1 } },
        });
        if (!item) throw new BidError("Item not found");
        if (item.status !== "OPEN") throw new BidError("Bidding is not open for this item");

        const settings = await tx.eventSettings.findUnique({ where: { id: 1 } });
        if (settings && !settings.biddingOpen) {
          throw new BidError("Bidding is currently closed");
        }

        const currentHigh = item.bids[0]?.amountCents ?? item.minBidCents - item.incrementCents;
        const minimumNext = item.bids[0]
          ? currentHigh + item.incrementCents
          : item.minBidCents;

        if (amountCents < minimumNext) {
          throw new BidError(
            `Your bid must be at least ${formatCents(minimumNext)}`
          );
        }

        await tx.bid.create({
          data: {
            itemId: item.id,
            amountCents,
            bidderName: data.bidderName,
            bidderEmail: data.bidderEmail,
            bidderPhone: data.bidderPhone || null,
          },
        });
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }
    );
  } catch (err) {
    if (err instanceof BidError) {
      return { error: err.message };
    }
    return { error: "Someone else may have just bid on this item. Please try again." };
  }

  revalidatePath(`/items/${data.itemSlug}`);
  revalidatePath("/");
  return { success: true };
}

class BidError extends Error {}
