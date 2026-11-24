"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, RefreshCw, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import EquipmentCard from "@/components/equipment/EquipmentCard";
import type { Equipment } from "@/lib/data/equipment";

export default function FavoritesList() {
  const [items, setItems] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    apiFetch<{ items: Equipment[] }>("/api/favorites")
      .then((data) => {
        if (active) setItems(data.items);
      })
      .catch((err: unknown) => {
        if (active) {
          setError(
            err instanceof Error ? err.message : "Could not load favorites."
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

  const removeFavorite = async (item: Equipment) => {
    setRemovingId(item.id);

    try {
      await apiFetch(`/api/favorites/${item.id}`, { method: "DELETE" });
      setItems((current) => current.filter((row) => row.id !== item.id));
      toast.success("Removed from favorites");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not remove favorite"
      );
    } finally {
      setRemovingId(null);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="h-[26rem] animate-pulse rounded-2xl bg-slate-200/70"
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
          Could not load favorites
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
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500">
          <Heart size={26} />
        </span>
        <h2 className="mt-5 text-lg font-bold text-slate-900">
          No favorites yet
        </h2>
        <p className="mt-2 max-w-sm text-sm leading-7 text-slate-500">
          Open any equipment and press “Save to favorites” to keep it here for
          later.
        </p>
        <Link
          href="/equipment"
          className="mt-6 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
        >
          Browse equipment
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <div key={item.id} className="flex flex-col gap-2">
          <EquipmentCard item={item} />

          <button
            type="button"
            onClick={() => removeFavorite(item)}
            disabled={removingId === item.id}
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Trash2 size={14} />
            {removingId === item.id ? "Removing…" : "Remove from favorites"}
          </button>
        </div>
      ))}
    </div>
  );
}
