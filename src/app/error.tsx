"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
      <div className="text-4xl">📶</div>
      <h1 className="mt-2 text-xl font-black text-slate-800">Connection hiccup</h1>
      <p className="mt-1 text-slate-600">
        That didn&apos;t go through — probably a slow or dropped connection. Your bid was
        <span className="font-semibold"> not </span>
        placed if this happened while submitting. Give it another try.
      </p>
      <button onClick={() => reset()} className="btn-primary mt-4">
        Try again
      </button>
    </div>
  );
}
