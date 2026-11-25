"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PackageOpen, RefreshCw, Search, X } from "lucide-react";
import { apiFetch } from "@/lib/api";
import {
  bookingStatusStyles,
  formatDate,
  paymentStatusLabel,
  paymentStatusStyles,
  type Booking,
} from "@/lib/data/bookings";
import { cn } from "@/lib/utils";

const filters = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "completed", label: "Completed" },
  { value: "rejected", label: "Rejected" },
] as const;

type Filter = (typeof filters)[number]["value"];

export default function AdminBookings() {
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [items, setItems] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;

    const query = filter === "all" ? "" : `?status=${filter}`;

    apiFetch<{ items: Booking[] }>(`/api/admin/bookings${query}`)
      .then((data) => {
        if (active) setItems(data.items);
      })
      .catch((err: unknown) => {
        if (active) {
          setError(
            err instanceof Error ? err.message : "Could not load bookings."
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

  const retry = () => {
    setLoading(true);
    setError(null);
    setReloadKey((key) => key + 1);
  };

  // Simple client-side search across the loaded bookings.
  const term = search.trim().toLowerCase();
  const visibleItems = term
    ? items.filter((booking) =>
        [
          booking.equipmentName,
          booking.customerName,
          booking.customerEmail,
          booking.ownerName,
        ]
          .join(" ")
          .toLowerCase()
          .includes(term)
      )
    : items;

  return (
    <div className="space-y-5">
      {/* Filters + search */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {filters.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => changeFilter(item.value)}
              className={cn(
                "rounded-xl border px-3.5 py-2 text-xs font-semibold transition",
                filter === item.value
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:text-blue-600"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="relative w-full lg:max-w-xs">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search equipment or customer"
            className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-9 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {loading && (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-16 animate-pulse rounded-xl bg-slate-200/70"
            />
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-red-200 bg-white px-6 py-14 text-center">
          <RefreshCw size={26} className="text-red-500" />
          <h2 className="mt-4 text-lg font-bold text-slate-900">
            Could not load bookings
          </h2>
          <p className="mt-2 max-w-sm text-sm text-slate-500">{error}</p>
          <button
            type="button"
            onClick={retry}
            className="mt-5 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            Try again
          </button>
        </div>
      )}

      {!loading && !error && visibleItems.length === 0 && (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-500">
            <PackageOpen size={26} />
          </span>
          <h2 className="mt-5 text-lg font-bold text-slate-900">
            No bookings found
          </h2>
          <p className="mt-2 max-w-sm text-sm leading-7 text-slate-500">
            {term
              ? "Try a different search term or switch the status filter."
              : "When customers book equipment, every rental will appear here."}
          </p>
        </div>
      )}

      {!loading && !error && visibleItems.length > 0 && (
        <>
          <p className="text-xs font-semibold text-slate-400">
            Showing {visibleItems.length}{" "}
            {visibleItems.length === 1 ? "booking" : "bookings"}
          </p>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full min-w-[1120px] text-left text-sm">
              <thead className="border-b border-slate-100 bg-slate-50 text-[11px] uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-4 py-3 font-semibold">Customer</th>
                  <th className="px-4 py-3 font-semibold">Owner</th>
                  <th className="px-4 py-3 font-semibold">Equipment</th>
                  <th className="px-4 py-3 font-semibold">Rental duration</th>
                  <th className="px-4 py-3 font-semibold">Booking amount</th>
                  <th className="px-4 py-3 font-semibold">Payment</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {visibleItems.map((booking) => (
                  <tr
                    key={booking.id}
                    className="align-middle hover:bg-slate-50/70"
                  >
                    <td className="px-4 py-3">
                      <p className="max-w-[12rem] truncate font-semibold text-slate-900">
                        {booking.customerName}
                      </p>
                      <p className="max-w-[12rem] truncate text-xs text-slate-500">
                        {booking.customerEmail}
                      </p>
                      <p className="text-xs text-slate-400">{booking.phone}</p>
                    </td>

                    <td className="px-4 py-3">
                      <p className="max-w-[10rem] truncate text-slate-700">
                        {booking.ownerName || "Equipment owner"}
                      </p>
                      <p className="text-xs text-slate-400">
                        Requested {formatDate(booking.createdAt)}
                      </p>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                          <Image
                            src={booking.equipmentImage}
                            alt={booking.equipmentName}
                            fill
                            sizes="44px"
                            className="object-cover"
                          />
                        </div>
                        <Link
                          href={`/equipment/${booking.equipmentId}`}
                          className="block max-w-[12rem] truncate font-semibold text-slate-900 hover:text-blue-600"
                        >
                          {booking.equipmentName}
                        </Link>
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                      {formatDate(booking.startDate)}
                      <span className="mx-1 text-slate-300">→</span>
                      {formatDate(booking.endDate)}
                      <span className="mt-0.5 block text-xs text-slate-400">
                        Qty {booking.quantity} · {booking.units}{" "}
                        {booking.rentalType.toLowerCase()}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-4 py-3 font-semibold text-slate-900">
                      ৳{booking.totalPrice.toLocaleString("en-BD")}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                          paymentStatusStyles[
                            booking.paymentStatus ?? "unpaid"
                          ]
                        )}
                      >
                        {paymentStatusLabel(booking.paymentStatus)}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                          bookingStatusStyles[booking.status]
                        )}
                      >
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
