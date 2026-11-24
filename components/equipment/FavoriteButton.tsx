"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { cn } from "@/lib/utils";

const FavoriteButton = ({ equipmentId }: { equipmentId: string }) => {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Ask the API if this item is already in the user's favorites.
  useEffect(() => {
    let active = true;

    apiFetch<{ items: { id: string }[] }>("/api/favorites")
      .then((data) => {
        if (active) {
          setSaved(data.items.some((item) => item.id === equipmentId));
        }
      })
      .catch(() => {
        // Not logged in or API down: keep the button in "not saved" state.
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [equipmentId]);

  const toggleFavorite = async () => {
    setSaving(true);

    try {
      if (saved) {
        await apiFetch(`/api/favorites/${equipmentId}`, { method: "DELETE" });
        setSaved(false);
        toast.success("Removed from favorites");
      } else {
        await apiFetch(`/api/favorites/${equipmentId}`, { method: "POST" });
        setSaved(true);
        toast.success("Added to favorites");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not update favorites"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <button
      type="button"
      onClick={toggleFavorite}
      disabled={loading || saving}
      aria-pressed={saved}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60",
        saved
          ? "border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
          : "border-slate-200 text-slate-600 hover:border-red-200 hover:text-red-600"
      )}
    >
      <Heart size={16} className={saved ? "fill-red-500 text-red-500" : ""} />
      {saving ? "Saving…" : saved ? "Saved" : "Save to favorites"}
    </button>
  );
};

export default FavoriteButton;
