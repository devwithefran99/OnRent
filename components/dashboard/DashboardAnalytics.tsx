"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarCheck2,
  CircleDollarSign,
  Clock3,
  Package,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { apiFetch } from "@/lib/api";
import {
  buildBookingAnalytics,
  formatTaka,
  type AnalyticsBooking,
} from "@/lib/data/analytics";
import { cn } from "@/lib/utils";
import RevenueAreaChart from "@/components/dashboard/charts/RevenueAreaChart";
import BookingsBarChart from "@/components/dashboard/charts/BookingsBarChart";
import StatusDonut from "@/components/dashboard/charts/StatusDonut";

type Role = "customer" | "owner" | "admin";

const roleConfig = {
  customer: {
    endpoint: "/api/bookings/my",
    accent: "#2563eb",
    accentTo: "#38bdf8",
    revenueLabel: "Total spend",
    revenueHint: "Your rental spend over the last 6 months",
  },
  owner: {
    endpoint: "/api/owner/bookings",
    accent: "#ea580c",
    accentTo: "#fbbf24",
    revenueLabel: "Total revenue",
    revenueHint: "Earnings from approved and completed rentals",
  },
  admin: {
    endpoint: "/api/admin/bookings",
    accent: "#7c3aed",
    accentTo: "#e879f9",
    revenueLabel: "Platform revenue",
    revenueHint: "Marketplace revenue over the last 6 months",
  },
} as const;

function ChartCard({
  title,
  subtitle,
  action,
  className,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5 dark:border-slate-800 dark:bg-slate-900",
        className
      )}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="truncate text-sm font-bold text-slate-900 dark:text-white">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
              {subtitle}
            </p>
          )}
        </div>
        {action}
      </div>

      {children}
    </section>
  );
}

export default function DashboardAnalytics({ role }: { role: Role }) {
  const config = roleConfig[role];
  const [bookings, setBookings] = useState<AnalyticsBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;

    apiFetch<{ items: AnalyticsBooking[] }>(config.endpoint)
      .then((data) => {
        if (active) setBookings(data.items ?? []);
      })
      .catch(() => {
        if (active) setFailed(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [config.endpoint]);

  const analytics = useMemo(
    () => buildBookingAnalytics(bookings),
    [bookings]
  );

  const kpis = [
    {
      label: config.revenueLabel,
      value: formatTaka(analytics.totalRevenue),
      icon: Wallet,
      hint: `${analytics.totalBookings} total bookings`,
    },
    {
      label: "This month",
      value: String(analytics.currentMonthBookings),
      icon: CalendarCheck2,
      hint: "bookings created",
      delta: analytics.monthDelta,
    },
    {
      label: "Active rentals",
      value: String(analytics.activeRentals),
      icon: Clock3,
      hint: "approved and running",
    },
    {
      label: "Avg. booking",
      value: formatTaka(analytics.averageValue),
      icon: CircleDollarSign,
      hint: "per paid rental",
    },
  ];

  const statusSegments = [
    { label: "Pending", value: analytics.statusCounts.pending, color: "#f59e0b" },
    {
      label: "Approved",
      value: analytics.statusCounts.approved,
      color: config.accent,
    },
    {
      label: "Completed",
      value: analytics.statusCounts.completed,
      color: "#10b981",
    },
    {
      label: "Rejected",
      value: analytics.statusCounts.rejected,
      color: "#f43f5e",
    },
  ];

  return (
    <div className="space-y-4">
      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {kpis.map(({ label, value, icon: Icon, hint, delta }) => (
          <div
            key={label}
            className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
          >
            <div
              className="pointer-events-none absolute -right-8 -top-8 h-20 w-20 rounded-full opacity-0 blur-2xl transition group-hover:opacity-60"
              style={{ backgroundColor: config.accent }}
            />

            <div className="relative flex items-center justify-between gap-2">
              <span
                className="flex h-9 w-9 items-center justify-center rounded-xl"
                style={{
                  backgroundColor: `${config.accent}1a`,
                  color: config.accent,
                }}
              >
                <Icon size={17} />
              </span>

              {typeof delta === "number" && delta !== 0 && (
                <span
                  className={cn(
                    "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                    delta > 0
                      ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                      : "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400"
                  )}
                >
                  {delta > 0 ? (
                    <ArrowUpRight size={11} />
                  ) : (
                    <ArrowDownRight size={11} />
                  )}
                  {Math.abs(delta)}%
                </span>
              )}
            </div>

            {loading ? (
              <div className="mt-3 h-7 w-20 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />
            ) : (
              <p className="relative mt-3 truncate text-lg font-bold text-slate-900 sm:text-xl dark:text-white">
                {value}
              </p>
            )}

            <p className="relative mt-0.5 truncate text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
              {label}
            </p>
            <p className="relative mt-1 truncate text-[11px] text-slate-400">
              {hint}
            </p>
          </div>
        ))}
      </div>

      {failed && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-medium text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
          Analytics could not be loaded right now. The rest of your dashboard
          still works.
        </div>
      )}

      {!loading && !failed && !analytics.hasData && (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white/60 px-4 py-3 text-xs font-medium text-slate-500 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-400">
          No bookings yet — your charts will fill in as soon as the first rental
          request arrives.
        </div>
      )}

      {/* Charts */}
      <div className="grid gap-4 xl:grid-cols-3">
        <ChartCard
          title="Revenue trend"
          subtitle={config.revenueHint}
          className="xl:col-span-2"
          action={
            <span
              className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold"
              style={{
                backgroundColor: `${config.accent}14`,
                color: config.accent,
              }}
            >
              <TrendingUp size={12} />
              6 months
            </span>
          }
        >
          {loading ? (
            <div className="h-[230px] animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
          ) : (
            <RevenueAreaChart
              data={analytics.months}
              accent={config.accent}
              accentTo={config.accentTo}
            />
          )}
        </ChartCard>

        <ChartCard
          title="Booking status"
          subtitle="Every request on your account"
        >
          {loading ? (
            <div className="h-[170px] animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
          ) : (
            <StatusDonut segments={statusSegments} centerLabel="bookings" />
          )}
        </ChartCard>

        <ChartCard
          title="Monthly bookings"
          subtitle="Requests created per month"
          className="xl:col-span-2"
        >
          {loading ? (
            <div className="h-[210px] animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
          ) : (
            <BookingsBarChart
              data={analytics.months}
              accent={config.accent}
              accentTo={config.accentTo}
            />
          )}
        </ChartCard>

        <ChartCard
          title="Top equipment"
          subtitle="By revenue"
          action={<Package size={16} className="text-slate-300" />}
        >
          {loading ? (
            <div className="space-y-2">
              {[0, 1, 2, 3].map((row) => (
                <div
                  key={row}
                  className="h-11 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800"
                />
              ))}
            </div>
          ) : analytics.topEquipment.length === 0 ? (
            <div className="flex h-[150px] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-200 text-center dark:border-slate-700">
              <Package size={20} className="text-slate-300" />
              <p className="text-xs text-slate-400">
                No rentals yet — your best performers will appear here.
              </p>
            </div>
          ) : (
            <ol className="space-y-2">
              {analytics.topEquipment.map((item, index) => (
                <li
                  key={item.name}
                  className="flex items-center gap-3 rounded-xl border border-slate-100 px-3 py-2 dark:border-slate-800"
                >
                  <span
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold"
                    style={{
                      backgroundColor: `${config.accent}14`,
                      color: config.accent,
                    }}
                  >
                    {index + 1}
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-slate-700 dark:text-slate-200">
                      {item.name}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {item.count} rental{item.count === 1 ? "" : "s"}
                    </p>
                  </div>

                  <span className="shrink-0 text-xs font-bold text-slate-900 dark:text-white">
                    {formatTaka(item.revenue)}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </ChartCard>
      </div>
    </div>
  );
}
