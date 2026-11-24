"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CalendarDays, MapPin, PackageOpen, RefreshCw, X } from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import {
  bookingStatusStyles,
  formatDate,
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
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="h-36 animate-pulse rounded-2xl bg-slate-200/70"
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
    <div className="space-y-3">
      {items.map((booking) => (
        <article
          key={booking.id}
          className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:flex-row lg:items-center"
        >
          <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-xl bg-slate-100 lg:h-20 lg:w-28">
            <Image
              src={booking.equipmentImage}
              alt={booking.equipmentName}
              fill
              sizes="112px"
              className="object-cover"
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={`/equipment/${booking.equipmentId}`}
                className="truncate font-bold text-slate-900 hover:text-blue-600"
              >
                {booking.equipmentName}
              </Link>
              <span
                className={cn(
                  "rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                  bookingStatusStyles[booking.status]
                )}
              >
                {booking.status}
              </span>
            </div>

            <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1">
                <CalendarDays size={13} />
                {formatDate(booking.startDate)} → {formatDate(booking.endDate)}
              </span>
              <span>Qty {booking.quantity}</span>
              <span>{booking.units} × ৳{booking.unitPrice.toLocaleString("en-BD")}</span>
            </p>

            <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
              <MapPin size={13} />
              {booking.address}
            </p>

            <p className="mt-2 text-sm font-bold text-slate-900">
              Total ৳{booking.totalPrice.toLocaleString("en-BD")}
            </p>
          </div>

          {booking.status === "pending" && (
            <button
              type="button"
              onClick={() => cancelBooking(booking)}
              disabled={cancellingId === booking.id}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <X size={14} />
              {cancellingId === booking.id ? "Cancelling…" : "Cancel"}
            </button>
          )}
        </article>
      ))}
    </div>
  );
}
