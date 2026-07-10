import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatCents } from "@/lib/money";
import { currentHighBid } from "@/lib/bidding";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const items = await prisma.item.findMany({
    where: { status: { in: ["OPEN", "CLOSED"] } },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: { bids: { orderBy: { amountCents: "desc" }, take: 1 } },
  });

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
        No items are open for bidding yet. Check back soon!
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-1 text-2xl font-black text-slate-800">Silent Auction Items</h1>
      <p className="mb-6 text-sm text-slate-500">
        Tap an item to see details and place your bid.
      </p>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {items.map((item) => {
          const hasBids = item.bids.length > 0;
          const bidLabel = hasBids ? "Current bid" : "Starting bid";
          return (
            <li key={item.id}>
              <Link
                href={`/items/${item.slug}`}
                className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-lg"
              >
                {item.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="h-40 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-40 w-full items-center justify-center bg-slate-100 text-4xl">
                    🎁
                  </div>
                )}
                <div className="flex flex-1 flex-col gap-1 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="font-bold text-slate-800">{item.name}</h2>
                    {item.status === "CLOSED" && (
                      <span className="shrink-0 rounded-lg bg-slate-800 px-2 py-0.5 text-xs font-medium text-white">
                        Closed
                      </span>
                    )}
                  </div>
                  <p className="mt-auto text-sm text-slate-500">
                    {bidLabel}:{" "}
                    <span className="font-semibold text-sky-600">
                      {formatCents(currentHighBid(item, item.bids))}
                    </span>
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
