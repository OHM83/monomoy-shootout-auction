"use client";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-md bg-sky-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-sky-800 print:hidden"
    >
      Print
    </button>
  );
}
