"use client";

import { useEffect, useState } from "react";
import { CalendarCheck2, Clock3, Package, Users } from "lucide-react";
import { apiFetch } from "@/lib/api";

type Stats = {
  users: number;
  equipment: number;
  pending: number;
  bookings: number;
};

const cards = [
  { key: "users", label: "Total users", icon: Users, tone: "bg-blue-50 text-blue-600" },
  { key: "equipment", label: "Total equipment", icon: Package, tone: "bg-indigo-50 text-indigo-600" },
  { key: "pending", label: "Pending approval", icon: Clock3, tone: "bg-amber-50 text-amber-600" },
  { key: "bookings", label: "Total bookings", icon: CalendarCheck2, tone: "bg-emerald-50 text-emerald-600" },
] as const;

export default function AdminStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    apiFetch<Stats>("/api/admin/stats")
      .then((data) => {
        if (active) setStats(data);
      })
      .catch(() => {
        // Keep the cards empty if the API is unreachable.
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map(({ key, label, icon: Icon, tone }) => (
        <div
          key={key}
          className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
        >
          <span
            className={`flex h-10 w-10 items-center justify-center rounded-xl ${tone}`}
          >
            <Icon size={19} />
          </span>

          {loading ? (
            <div className="mt-4 h-7 w-12 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
          ) : (
            <p className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">
              {stats?.[key] ?? 0}
            </p>
          )}

          <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
            {label}
          </p>
        </div>
      ))}
    </div>
  );
}
