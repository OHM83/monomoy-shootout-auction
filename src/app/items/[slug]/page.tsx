import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatCents } from "@/lib/money";
import { currentHighBid, minimumNextBid, bidderDisplayName } from "@/lib/bidding";
import { BidForm } from "@/components/bid-form";

export const dynamic = "force-dynamic";

export default async function ItemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const item = await prisma.item.findUnique({
    where: { slug },
    include: { bids: { orderBy: { amountCents: "desc" } } },
  });

  if (!item || item.status === "DRAFT") {
    notFound();
  }

  const high = currentHighBid(item, item.bids);
  const nextMin = minimumNextBid(item, item.bids);
  const topBid = item.bids[0];

  return (
    <div>
      <Link href="/" className="mb-4 inline-block text-sm text-sky-900 hover:underline">
        ← Back to all items
      </Link>

      {item.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.imageUrl}
          alt={item.name}
          className="mb-4 max-h-80 w-full rounded-lg object-cover"
        />
      ) : null}

      <h1 className="text-2xl font-bold">{item.name}</h1>
      {item.donatedBy && (
        <p className="mt-1 text-sm text-slate-500">Donated by {item.donatedBy}</p>
      )}
      <p className="mt-3 whitespace-pre-line text-slate-700">{item.description}</p>

      <div className="mt-5 rounded-lg bg-slate-100 p-4">
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-slate-500">
            {topBid ? "Current high bid" : "Starting bid"}
          </span>
          <span className="text-xl font-bold text-sky-900">{formatCents(high)}</span>
        </div>
        {topBid && (
          <p className="mt-1 text-xs text-slate-500">
            High bidder: {bidderDisplayName(topBid.bidderName)} · {item.bids.length}{" "}
            bid{item.bids.length === 1 ? "" : "s"}
          </p>
        )}
      </div>

      <div className="mt-5">
        {item.status === "OPEN" ? (
          <BidForm itemSlug={item.slug} minimumNextBidDollars={nextMin / 100} />
        ) : (
          <div className="rounded-lg border border-slate-200 bg-white p-4 text-center text-slate-500">
            Bidding is closed for this item.
          </div>
        )}
      </div>
    </div>
  );
}
