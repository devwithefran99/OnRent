import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center gap-4 bg-slate-50 px-4">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 shadow-sm">
        <Loader2 size={26} className="animate-spin" />
      </span>

      <p className="text-sm font-semibold text-slate-500">Loading OnRent…</p>
    </main>
  );
}
