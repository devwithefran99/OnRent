"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Keep the real error in the browser console for debugging.
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4 py-16">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
          <AlertTriangle size={26} />
        </span>

        <h1 className="mt-5 text-2xl font-bold text-slate-900">
          Something went wrong
        </h1>

        <p className="mt-3 text-sm leading-7 text-slate-500">
          This page could not load. It may be a temporary problem — try again
          or go back to the homepage.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            <RefreshCw size={15} />
            Try again
          </button>

          <Link
            href="/"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-600"
          >
            <Home size={15} />
            Home
          </Link>
        </div>
      </div>
    </main>
  );
}
