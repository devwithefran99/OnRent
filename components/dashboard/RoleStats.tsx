"use client";

import { useEffect, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Heart,
  Package,
} from "lucide-react";
import { apiFetch } from "@/lib/api";

type Stats = {
  activeRentals: number;
  completedRentals: number;
  favorites: number;
  listedEquipment: number;
  pendingApproval: number;
  rentalRequests: number;
};

const cards = {
  customer: [
    { key: "activeRentals", label: "Active rentals", icon: CalendarDays },
    { key: "completedRentals", label: "Completed rentals", icon: CheckCircle2 },
    { key: "favorites", label: "Favorites", icon: Heart },
  ],
  owner: [
    { key: "listedEquipment", label: "Listed equipment", icon: Package },
    { key: "pendingApproval", label: "Pending approval", icon: Clock3 },
    { key: "rentalRequests", label: "Rental requests", icon: CalendarDays },
  ],
} as const;

export default function RoleStats({
  role,
}: {
  role: "customer" | "owner";
}) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    apiFetch<Stats>("/api/dashboard/stats")
      .then((data) => {
        if (active) setStats(data);
      })
      .catch(() => {
        // Stats are not critical — keep the cards empty on failure.
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="grid grid-cols-3 gap-3 lg:w-[360px]">
      {cards[role].map(({ key, label, icon: Icon }) => (
        <div
          key={key}
          className="rounded-2xl border border-white/10 bg-white/[0.06] p-3 backdrop-blur"
        >
          <Icon size={16} className="text-blue-300" />

          {loading ? (
            <div className="mt-2 h-6 w-10 animate-pulse rounded bg-white/20" />
          ) : (
            <p className="mt-2 text-xl font-bold text-white">
              {stats ? stats[key] : "—"}
            </p>
          )}

          <p className="mt-0.5 text-[11px] leading-tight text-slate-400">
            {label}
          </p>
        </div>
      ))}
    </div>
  );
}
