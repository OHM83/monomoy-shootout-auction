import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCents } from "@/lib/money";
import { currentHighBid } from "@/lib/bidding";
import { logoutAction } from "@/app/actions/auth";
import { deleteItemAction } from "@/app/actions/items";
import { getEventSettings, setBiddingOpenAction } from "@/app/actions/settings";
import { DeleteItemButton } from "@/components/delete-item-button";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const [items, settings] = await Promise.all([
    prisma.item.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      include: { bids: { orderBy: { amountCents: "desc" }, take: 1 }, _count: { select: { bids: true } } },
    }),
    getEventSettings(),
  ]);

  async function open() {
    "use server";
    await setBiddingOpenAction(true);
  }
  async function close() {
    "use server";
    await setBiddingOpenAction(false);
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-black text-slate-800">Admin</h1>
        <form action={logoutAction}>
          <button type="submit" className="text-sm text-slate-500 hover:underline">
            Log out
          </button>
        </form>
      </div>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div>
          <p className="font-semibold text-slate-800">
            Bidding is{" "}
            <span className={settings.biddingOpen ? "text-green-600" : "text-red-600"}>
              {settings.biddingOpen ? "OPEN" : "CLOSED"}
            </span>{" "}
            site-wide
          </p>
          <p className="text-xs text-slate-500">
            This is a master switch. Individual items also have their own status.
          </p>
        </div>
        <div className="flex gap-2">
          <form action={open}>
            <button
              type="submit"
              className="rounded-xl bg-green-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-green-500 active:bg-green-700 transition-colors"
            >
              Open bidding
            </button>
          </form>
          <form action={close}>
            <button type="submit" className="btn-danger text-sm">
              Close bidding
            </button>
          </form>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-3">
        <Link
          href="/admin/items/new"
          className="rounded-xl bg-sky-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-sky-500 active:bg-sky-700 transition-colors"
        >
          + Add item
        </Link>
        <Link
          href="/admin/qr"
          className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
        >
          Print QR codes
        </Link>
        <Link
          href="/admin/winners"
          className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
        >
          Winners report
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-4 py-2">Item</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">High bid</th>
              <th className="px-4 py-2">Bids</th>
              <th className="px-4 py-2" />
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const deleteWithId = deleteItemAction.bind(null, item.id);
              return (
                <tr key={item.id} className="border-t border-slate-100">
                  <td className="px-4 py-2 font-medium text-slate-800">{item.name}</td>
                  <td className="px-4 py-2">{item.status}</td>
                  <td className="px-4 py-2">{formatCents(currentHighBid(item, item.bids))}</td>
                  <td className="px-4 py-2">{item._count.bids}</td>
                  <td className="px-4 py-2">
                    <div className="flex justify-end gap-3">
                      <Link href={`/admin/items/${item.id}/edit`} className="text-sky-600 hover:underline">
                        Edit
                      </Link>
                      <DeleteItemButton itemName={item.name} action={deleteWithId} />
                    </div>
                  </td>
                </tr>
              );
            })}
            {items.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-slate-400">
                  No items yet. Add your first item to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
