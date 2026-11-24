"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PackageOpen, Pencil, Plus, RefreshCw, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import type { Equipment } from "@/lib/data/equipment";
import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  approved: "bg-emerald-50 text-emerald-600 border-emerald-200",
  pending: "bg-amber-50 text-amber-600 border-amber-200",
  rejected: "bg-red-50 text-red-600 border-red-200",
};

export default function OwnerEquipmentList() {
  const [items, setItems] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    apiFetch<{ items: Equipment[] }>("/api/owner/equipment")
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
  }, [reloadKey]);

  const handleDelete = async (item: Equipment) => {
    const confirmed = window.confirm(`Delete "${item.name}"?`);
    if (!confirmed) return;

    setDeletingId(item.id);

    try {
      await apiFetch(`/api/equipment/${item.id}`, { method: "DELETE" });
      setItems((current) => current.filter((row) => row.id !== item.id));
      toast.success("Equipment deleted");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not delete equipment"
      );
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="h-28 animate-pulse rounded-2xl bg-slate-200/70"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-dashed border-red-200 bg-white px-6 py-14 text-center">
        <RefreshCw size={26} className="text-red-500" />
        <h2 className="mt-4 text-lg font-bold text-slate-900">
          Could not load your equipment
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
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-500">
          <PackageOpen size={26} />
        </span>
        <h2 className="mt-5 text-lg font-bold text-slate-900">
          No equipment yet
        </h2>
        <p className="mt-2 max-w-sm text-sm leading-7 text-slate-500">
          Add your first machine or tool. An admin will review it before it
          appears on the marketplace.
        </p>
        <Link
          href="/dashboard/equipment/new"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
        >
          <Plus size={16} />
          Add equipment
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <article
          key={item.id}
          className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center"
        >
          <div className="relative h-24 w-full shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:h-20 sm:w-28">
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
              <h3 className="truncate font-bold text-slate-900">{item.name}</h3>
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

            <p className="mt-1 text-sm font-semibold text-slate-900">
              ৳{item.price.toLocaleString("en-BD")}
              <span className="ml-1 text-xs font-normal text-slate-500">
                / {item.rentalType.toLowerCase()}
              </span>
            </p>
          </div>

          <div className="flex shrink-0 gap-2">
            <Link
              href={`/dashboard/equipment/${item.id}/edit`}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-blue-200 hover:text-blue-600"
            >
              <Pencil size={14} />
              Edit
            </Link>

            <button
              type="button"
              onClick={() => handleDelete(item)}
              disabled={deletingId === item.id}
              className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Trash2 size={14} />
              {deletingId === item.id ? "Deleting…" : "Delete"}
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
