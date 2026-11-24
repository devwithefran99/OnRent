"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CalendarDays,
  Check,
  ClipboardList,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import {
  bookingStatusStyles,
  formatDate,
  type Booking,
  type BookingStatus,
} from "@/lib/data/bookings";
import { cn } from "@/lib/utils";

export default function OwnerBookings() {
  const [items, setItems] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [workingId, setWorkingId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    apiFetch<{ items: Booking[] }>("/api/owner/bookings")
      .then((data) => {
        if (active) setItems(data.items);
      })
      .catch((err: unknown) => {
        if (active) {
          setError(
            err instanceof Error ? err.message : "Could not load requests."
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

  const updateStatus = async (booking: Booking, status: BookingStatus) => {
    setWorkingId(booking.id);

    try {
      await apiFetch(`/api/owner/bookings/${booking.id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });

      setItems((current) =>
        current.map((row) =>
          row.id === booking.id ? { ...row, status } : row
        )
      );

      toast.success(
        status === "approved"
          ? "Booking approved"
          : status === "rejected"
            ? "Booking rejected"
            : "Booking marked as completed"
      );
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not update the booking"
      );
    } finally {
      setWorkingId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="h-40 animate-pulse rounded-2xl bg-slate-200/70"
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
          Could not load requests
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
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-50 text-orange-500">
          <ClipboardList size={26} />
        </span>
        <h2 className="mt-5 text-lg font-bold text-slate-900">
          No rental requests yet
        </h2>
        <p className="mt-2 max-w-sm text-sm leading-7 text-slate-500">
          When a customer books one of your listings, the request will appear
          here for approval.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((booking) => (
        <article
          key={booking.id}
          className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
        >
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:h-20 sm:w-28">
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
                  {formatDate(booking.startDate)} →{" "}
                  {formatDate(booking.endDate)}
                </span>
                <span>Qty {booking.quantity}</span>
                <span>
                  {booking.units} × ৳{booking.unitPrice.toLocaleString("en-BD")}
                </span>
              </p>

              <p className="mt-2 text-sm font-bold text-slate-900">
                Total ৳{booking.totalPrice.toLocaleString("en-BD")}
              </p>
            </div>
          </div>

          {/* Customer details */}
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs text-slate-600">
            <p className="font-semibold text-slate-900">
              {booking.customerName}
            </p>

            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
              <span className="inline-flex items-center gap-1">
                <Mail size={12} />
                {booking.customerEmail}
              </span>
              <span className="inline-flex items-center gap-1">
                <Phone size={12} />
                {booking.phone}
              </span>
            </div>

            <p className="mt-1 flex items-center gap-1">
              <MapPin size={12} />
              {booking.address}
            </p>

            {booking.note && (
              <p className="mt-1 italic text-slate-500">“{booking.note}”</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            {booking.status === "pending" && (
              <>
                <button
                  type="button"
                  onClick={() => updateStatus(booking, "approved")}
                  disabled={workingId === booking.id}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Check size={14} />
                  Approve
                </button>

                <button
                  type="button"
                  onClick={() => updateStatus(booking, "rejected")}
                  disabled={workingId === booking.id}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 px-4 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <X size={14} />
                  Reject
                </button>
              </>
            )}

            {booking.status === "approved" && (
              <button
                type="button"
                onClick={() => updateStatus(booking, "completed")}
                disabled={workingId === booking.id}
                className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Check size={14} />
                Mark as completed
              </button>
            )}

            {workingId === booking.id && (
              <span className="inline-flex items-center text-xs text-slate-400">
                Saving…
              </span>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
