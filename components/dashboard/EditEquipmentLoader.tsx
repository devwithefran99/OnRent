"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, ShieldAlert } from "lucide-react";
import { apiFetch } from "@/lib/api";
import type { Equipment } from "@/lib/data/equipment";
import EquipmentForm from "./EquipmentForm";

export default function EditEquipmentLoader({
  equipmentId,
  userId,
}: {
  equipmentId: string;
  userId: string;
}) {
  const [item, setItem] = useState<Equipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    apiFetch<{ item: Equipment }>(`/api/equipment/${equipmentId}`)
      .then((data) => {
        if (active) setItem(data.item);
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
  }, [equipmentId]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
        <Loader2 size={16} className="animate-spin" />
        Loading equipment…
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-dashed border-red-200 bg-white px-6 py-14 text-center">
        <ShieldAlert size={26} className="text-red-500" />
        <h2 className="mt-4 text-lg font-bold text-slate-900">
          Equipment not found
        </h2>
        <p className="mt-2 max-w-sm text-sm text-slate-500">
          {error ?? "This listing does not exist anymore."}
        </p>
        <Link
          href="/dashboard/equipment"
          className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
        >
          <ArrowLeft size={15} />
          Back to my equipment
        </Link>
      </div>
    );
  }

  // Owners can only edit their own listings.
  if (item.ownerId && item.ownerId !== userId) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-dashed border-amber-200 bg-white px-6 py-14 text-center">
        <ShieldAlert size={26} className="text-amber-500" />
        <h2 className="mt-4 text-lg font-bold text-slate-900">
          Not your listing
        </h2>
        <p className="mt-2 max-w-sm text-sm text-slate-500">
          You can only edit equipment that you created.
        </p>
        <Link
          href="/dashboard/equipment"
          className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
        >
          <ArrowLeft size={15} />
          Back to my equipment
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Edit equipment</h1>
        <p className="mt-1 text-sm text-slate-500">
          Update the details of “{item.name}”.
        </p>
      </div>

      <EquipmentForm mode="edit" equipmentId={item.id} initial={item} />
    </div>
  );
}
