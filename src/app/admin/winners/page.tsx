import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCents } from "@/lib/money";

export const dynamic = "force-dynamic";

export default async function WinnersPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const items = await prisma.item.findMany({
    where: { bids: { some: {} } },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: { bids: { orderBy: { amountCents: "desc" }, take: 1 } },
  });

  return (
    <div>
      <Link href="/admin" className="mb-4 inline-block text-sm text-sky-900 hover:underline">
        ← Back to admin
      </Link>
      <h1 className="mb-1 text-2xl font-bold">Winners report</h1>
      <p className="mb-6 text-sm text-slate-500">
        Highest bidder for each item with at least one bid, for collecting payment.
      </p>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-2">Item</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Winning bid</th>
              <th className="px-4 py-2">Bidder</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Phone</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const winner = item.bids[0];
              return (
                <tr key={item.id} className="border-t border-slate-100">
                  <td className="px-4 py-2 font-medium">{item.name}</td>
                  <td className="px-4 py-2">{item.status}</td>
                  <td className="px-4 py-2">{formatCents(winner.amountCents)}</td>
                  <td className="px-4 py-2">{winner.bidderName}</td>
                  <td className="px-4 py-2">{winner.bidderEmail}</td>
                  <td className="px-4 py-2">{winner.bidderPhone ?? "—"}</td>
                </tr>
              );
            })}
            {items.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-slate-400">
                  No bids yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
