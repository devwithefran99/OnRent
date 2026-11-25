"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Check,
  Clock3,
  Pencil,
  RefreshCw,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import type { Equipment } from "@/lib/data/equipment";
import AdminEquipmentEditModal from "@/components/dashboard/AdminEquipmentEditModal";
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
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Equipment | null>(null);

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

  const deleteItem = async (item: Equipment) => {
    const confirmed = window.confirm(
      `Delete "${item.name}"? This permanently removes the listing.`
    );
    if (!confirmed) return;

    setDeletingId(item.id);

    try {
      await apiFetch(`/api/admin/equipment/${item.id}`, { method: "DELETE" });
      setItems((current) => current.filter((row) => row.id !== item.id));
      toast.success(`"${item.name}" was deleted`);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not delete this listing"
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handleSaved = (id: string, updates: Partial<Equipment>) => {
    setItems((current) =>
      current.flatMap((row) => {
        if (row.id !== id) return [row];

        const next = { ...row, ...updates };

        // Drop the row if it no longer belongs in the active tab.
        if (filter !== "all" && next.status !== filter) return [];

        return [next];
      })
    );
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
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-16 animate-pulse rounded-xl bg-slate-200/70"
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
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 text-[11px] uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-4 py-3 font-semibold">Equipment</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Price</th>
                <th className="px-4 py-3 font-semibold">Available</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {items.map((item) => (
                <tr key={item.id} className="align-middle hover:bg-slate-50/70">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate font-semibold text-slate-900">
                          {item.name}
                        </p>
                        <p className="truncate text-xs text-slate-400">
                          {item.ownerName ?? "Unknown owner"}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3 text-slate-600">{item.category}</td>

                  <td className="whitespace-nowrap px-4 py-3 font-semibold text-slate-900">
                    ৳{item.price.toLocaleString("en-BD")}
                    <span className="ml-1 text-xs font-normal text-slate-400">
                      /{item.rentalType.toLowerCase()}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-slate-600">
                    {item.availableQuantity ?? item.quantity ?? 0}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                        statusStyles[item.status] ??
                          "border-slate-200 bg-slate-50 text-slate-500"
                      )}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center justify-end gap-2">
                      {item.status !== "approved" && (
                        <button
                          type="button"
                          onClick={() => updateStatus(item, "approved")}
                          disabled={workingId === item.id}
                          className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <Check size={13} />
                          Approve
                        </button>
                      )}

                      {item.status !== "rejected" && (
                        <button
                          type="button"
                          onClick={() => updateStatus(item, "rejected")}
                          disabled={workingId === item.id}
                          className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <X size={13} />
                          Reject
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => setEditing(item)}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-blue-300 hover:text-blue-600"
                      >
                        <Pencil size={13} />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteItem(item)}
                        disabled={deletingId === item.id}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-500 transition hover:border-red-300 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {deletingId === item.id ? (
                          <Clock3 size={13} className="animate-pulse" />
                        ) : (
                          <Trash2 size={13} />
                        )}
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <AdminEquipmentEditModal
          item={editing}
          onClose={() => setEditing(null)}
          onSaved={(updates) => handleSaved(editing.id, updates)}
        />
      )}
    </div>
  );
}
