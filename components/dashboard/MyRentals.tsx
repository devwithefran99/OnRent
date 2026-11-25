"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PackageOpen, RefreshCw, X } from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import {
  bookingStatusStyles,
  formatDate,
  paymentStatusLabel,
  paymentStatusStyles,
  type Booking,
} from "@/lib/data/bookings";
import { cn } from "@/lib/utils";

export default function MyRentals() {
  const [items, setItems] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    apiFetch<{ items: Booking[] }>("/api/bookings/my")
      .then((data) => {
        if (active) setItems(data.items);
      })
      .catch((err: unknown) => {
        if (active) {
          setError(
            err instanceof Error ? err.message : "Could not load your rentals."
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

  const cancelBooking = async (booking: Booking) => {
    const confirmed = window.confirm("Cancel this booking request?");
    if (!confirmed) return;

    setCancellingId(booking.id);

    try {
      await apiFetch(`/api/bookings/${booking.id}`, { method: "DELETE" });
      setItems((current) => current.filter((row) => row.id !== booking.id));
      toast.success("Booking cancelled");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not cancel the booking"
      );
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-16 animate-pulse rounded-xl bg-slate-200/70"
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
          Could not load rentals
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
        <h2 className="mt-5 text-lg font-bold text-slate-900">No rentals yet</h2>
        <p className="mt-2 max-w-sm text-sm leading-7 text-slate-500">
          Find equipment you like and send a booking request. The owner will
          approve it from their dashboard.
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
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full min-w-[1040px] text-left text-sm">
        <thead className="border-b border-slate-100 bg-slate-50 text-[11px] uppercase tracking-wider text-slate-400">
          <tr>
            <th className="px-4 py-3 font-semibold">Equipment</th>
            <th className="px-4 py-3 font-semibold">Start date</th>
            <th className="px-4 py-3 font-semibold">End date</th>
            <th className="px-4 py-3 font-semibold">Booking date</th>
            <th className="px-4 py-3 font-semibold">Total amount</th>
            <th className="px-4 py-3 font-semibold">Payment</th>
            <th className="px-4 py-3 font-semibold">Status</th>
            <th className="px-4 py-3 text-right font-semibold">Action</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {items.map((booking) => (
            <tr key={booking.id} className="align-middle hover:bg-slate-50/70">
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

                  <div className="min-w-0">
                    <Link
                      href={`/equipment/${booking.equipmentId}`}
                      className="block max-w-[15rem] truncate font-semibold text-slate-900 hover:text-blue-600"
                    >
                      {booking.equipmentName}
                    </Link>
                    <p className="truncate text-xs text-slate-400">
                      Qty {booking.quantity} · {booking.units} × ৳
                      {booking.unitPrice.toLocaleString("en-BD")}
                    </p>
                  </div>
                </div>
              </td>

              <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                {formatDate(booking.startDate)}
              </td>

              <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                {formatDate(booking.endDate)}
              </td>

              <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                {formatDate(booking.createdAt)}
              </td>

              <td className="whitespace-nowrap px-4 py-3 font-semibold text-slate-900">
                ৳{booking.totalPrice.toLocaleString("en-BD")}
              </td>

              <td className="px-4 py-3">
                <span
                  className={cn(
                    "rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                    paymentStatusStyles[booking.paymentStatus ?? "unpaid"]
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

              <td className="px-4 py-3 text-right">
                {booking.status === "pending" ? (
                  <button
                    type="button"
                    onClick={() => cancelBooking(booking)}
                    disabled={cancellingId === booking.id}
                    className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <X size={13} />
                    {cancellingId === booking.id ? "Cancelling…" : "Cancel"}
                  </button>
                ) : (
                  <span className="text-xs text-slate-300">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
