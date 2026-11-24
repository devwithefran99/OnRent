"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Check,
  Clock3,
  RefreshCw,
  ShieldCheck,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import type { Equipment } from "@/lib/data/equipment";
import { cn } from "@/lib/utils";

const filters = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "all", label: "All" },
] as const;

type Filter = (typeof filters)[number]["value"];

const statusStyles: Record<string, string> = {
  approved: "bg-emerald-50 text-emerald-600 border-emerald-200",
  pending: "bg-amber-50 text-amber-600 border-amber-200",
  rejected: "bg-red-50 text-red-600 border-red-200",
};

export default function AdminEquipmentList() {
  const [filter, setFilter] = useState<Filter>("pending");
  const [items, setItems] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [workingId, setWorkingId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const query = filter === "all" ? "" : `?status=${filter}`;

    apiFetch<{ items: Equipment[] }>(`/api/admin/equipment${query}`)
      .then((data) => {
        if (active) setItems(data.items);
      })
      .catch((err: unknown) => {
        if (active) {
          setError(
            err instanceof Error ? err.message : "Could not load equipment."
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [filter, reloadKey]);

  const changeFilter = (value: Filter) => {
    setLoading(true);
    setError(null);
    setFilter(value);
  };

  const updateStatus = async (
    item: Equipment,
    status: "approved" | "rejected"
  ) => {
    setWorkingId(item.id);

    try {
      await apiFetch(`/api/admin/equipment/${item.id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });

      toast.success(
        status === "approved"
          ? `"${item.name}" is now live`
          : `"${item.name}" was rejected`
      );

      // In a specific tab the item no longer matches, so remove it.
      setItems((current) =>
        filter === "all"
          ? current.map((row) => (row.id === item.id ? { ...row, status } : row))
          : current.filter((row) => row.id !== item.id)
      );
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not update this listing"
      );
    } finally {
      setWorkingId(null);
    }
  };

  return (
    <div className="space-y-5">
      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {filters.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            onClick={() => changeFilter(value)}
            className={cn(
              "rounded-full px-4 py-2 text-xs font-semibold transition",
              filter === value
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-32 animate-pulse rounded-2xl bg-slate-200/70"
            />
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-red-200 bg-white px-6 py-14 text-center">
          <RefreshCw size={26} className="text-red-500" />
          <h2 className="mt-4 text-lg font-bold text-slate-900">
            Could not load listings
          </h2>
          <p className="mt-2 max-w-sm text-sm text-slate-500">{error}</p>
          <button
            type="button"
            onClick={() => {
              setLoading(true);
              setError(null);
              setReloadKey((key) => key + 1);
            }}
            className="mt-5 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            Try again
          </button>
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <ShieldCheck size={26} />
          </span>
          <h2 className="mt-5 text-lg font-bold text-slate-900">
            Nothing here
          </h2>
          <p className="mt-2 max-w-sm text-sm leading-7 text-slate-500">
            {filter === "pending"
              ? "All caught up! No listings are waiting for approval."
              : "No equipment found in this tab."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <article
              key={item.id}
              className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:flex-row lg:items-center"
            >
              <div className="relative h-24 w-full shrink-0 overflow-hidden rounded-xl bg-slate-100 lg:h-20 lg:w-28">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="112px"
                  className="object-cover"
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="truncate font-bold text-slate-900">
                    {item.name}
                  </h3>
                  <span
                    className={cn(
                      "rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                      statusStyles[item.status] ??
                        "border-slate-200 bg-slate-50 text-slate-500"
                    )}
                  >
                    {item.status}
                  </span>
                </div>

                <p className="mt-1 text-sm text-slate-500">
                  {item.category} · {item.location}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Owner: {item.ownerName ?? "Unknown"} ({item.ownerEmail ?? "—"})
                  {item.createdAt
                    ? ` · ${new Date(item.createdAt).toLocaleDateString()}`
                    : ""}
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-900">
                  ৳{item.price.toLocaleString("en-BD")}
                  <span className="ml-1 text-xs font-normal text-slate-500">
                    / {item.rentalType.toLowerCase()}
                  </span>
                </p>
              </div>

              <div className="flex shrink-0 gap-2">
                {item.status !== "approved" && (
                  <button
                    type="button"
                    onClick={() => updateStatus(item, "approved")}
                    disabled={workingId === item.id}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Check size={14} />
                    Approve
                  </button>
                )}

                {item.status !== "rejected" && (
                  <button
                    type="button"
                    onClick={() => updateStatus(item, "rejected")}
                    disabled={workingId === item.id}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <X size={14} />
                    Reject
                  </button>
                )}

                {workingId === item.id && (
                  <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                    <Clock3 size={13} />
                    Saving
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
