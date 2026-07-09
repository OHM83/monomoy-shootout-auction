import Link from "next/link";
import { redirect } from "next/navigation";
import QRCode from "qrcode";
import { isAdminAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getBaseUrl } from "@/lib/base-url";
import { PrintButton } from "@/components/print-button";

export const dynamic = "force-dynamic";

export default async function QrCodesPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const [items, baseUrl] = await Promise.all([
    prisma.item.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }] }),
    getBaseUrl(),
  ]);

  const cards = await Promise.all(
    items.map(async (item) => {
      const url = `${baseUrl}/items/${item.slug}`;
      const qrDataUrl = await QRCode.toDataURL(url, { margin: 1, width: 300 });
      return { item, url, qrDataUrl };
    })
  );

  return (
    <div>
      <div className="mb-4 flex items-center justify-between print:hidden">
        <Link href="/admin" className="text-sm text-sky-900 hover:underline">
          ← Back to admin
        </Link>
        <PrintButton />
      </div>
      <h1 className="mb-6 text-2xl font-bold print:hidden">QR codes</h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 print:grid-cols-2">
        {cards.map(({ item, url, qrDataUrl }) => (
          <div
            key={item.id}
            className="flex flex-col items-center gap-2 rounded-lg border border-slate-200 bg-white p-6 text-center break-inside-avoid print:border-black"
          >
            <h2 className="text-lg font-semibold">{item.name}</h2>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrDataUrl} alt={`QR code for ${item.name}`} className="h-56 w-56" />
            <p className="break-all text-xs text-slate-400">{url}</p>
          </div>
        ))}
        {cards.length === 0 && (
          <p className="text-slate-400">No items yet.</p>
        )}
      </div>
    </div>
  );
}
