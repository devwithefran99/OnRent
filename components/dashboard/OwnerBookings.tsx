"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
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
  paymentStatusLabel,
  paymentStatusStyles,
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
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full min-w-[1120px] text-left text-sm">
        <thead className="border-b border-slate-100 bg-slate-50 text-[11px] uppercase tracking-wider text-slate-400">
          <tr>
            <th className="px-4 py-3 font-semibold">Customer</th>
            <th className="px-4 py-3 font-semibold">Equipment</th>
            <th className="px-4 py-3 font-semibold">Rental duration</th>
            <th className="px-4 py-3 text-center font-semibold">Qty</th>
            <th className="px-4 py-3 font-semibold">Booking amount</th>
            <th className="px-4 py-3 font-semibold">Payment</th>
            <th className="px-4 py-3 font-semibold">Status</th>
            <th className="px-4 py-3 text-right font-semibold">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {items.map((booking) => (
            <tr key={booking.id} className="align-middle hover:bg-slate-50/70">
              <td className="px-4 py-3">
                <p className="max-w-[12rem] truncate font-semibold text-slate-900">
                  {booking.customerName}
                </p>
                <p className="flex items-center gap-1 text-xs text-slate-500">
                  <Mail size={11} className="shrink-0" />
                  <span className="max-w-[12rem] truncate">
                    {booking.customerEmail}
                  </span>
                </p>
                <p className="flex items-center gap-1 text-xs text-slate-400">
                  <Phone size={11} className="shrink-0" />
                  {booking.phone}
                </p>
                <p className="flex items-center gap-1 text-xs text-slate-400">
                  <MapPin size={11} className="shrink-0" />
                  <span className="max-w-[12rem] truncate">
                    {booking.address}
                  </span>
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
                  {booking.units} {booking.rentalType.toLowerCase()} unit
                  {booking.units === 1 ? "" : "s"}
                </span>
              </td>

              <td className="px-4 py-3 text-center font-semibold text-slate-900">
                {booking.quantity}
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

              <td className="px-4 py-3">
                <div className="flex flex-wrap items-center justify-end gap-2">
                  {booking.status === "pending" && (
                    <>
                      <button
                        type="button"
                        onClick={() => updateStatus(booking, "approved")}
                        disabled={workingId === booking.id}
                        className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <Check size={13} />
                        Approve
                      </button>

                      <button
                        type="button"
                        onClick={() => updateStatus(booking, "rejected")}
                        disabled={workingId === booking.id}
                        className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <X size={13} />
                        Reject
                      </button>
                    </>
                  )}

                  {booking.status === "approved" && (
                    <button
                      type="button"
                      onClick={() => updateStatus(booking, "completed")}
                      disabled={workingId === booking.id}
                      className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-2.5 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Check size={13} />
                      Complete
                    </button>
                  )}

                  {booking.status !== "pending" &&
                    booking.status !== "approved" && (
                      <span className="text-xs text-slate-300">—</span>
                    )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
