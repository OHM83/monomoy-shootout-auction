"use client";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-xl bg-sky-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-sky-500 active:bg-sky-700 transition-colors print:hidden"
    >
      Print
    </button>
  );
}
