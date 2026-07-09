import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Monomoy Shootout Silent Auction",
  description: "Bid on silent auction items at the Monomoy Shootout charity fishing tournament.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
            <Link href="/" className="text-lg font-bold tracking-tight text-sky-900">
              🎣 Monomoy Shootout <span className="font-normal text-slate-500">Auction</span>
            </Link>
          </div>
        </header>
        <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6">{children}</main>
        <footer className="border-t border-slate-200 py-4 text-center text-xs text-slate-400">
          Monomoy Shootout Silent Auction
        </footer>
      </body>
    </html>
  );
}
