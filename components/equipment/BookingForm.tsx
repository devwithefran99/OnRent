"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";

const inputClass =
  "h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20";

const labelClass = "mb-2 block text-sm font-semibold text-slate-700";

// Same rule as the server: days for Daily, weeks for Weekly, months for Monthly.
function calculateUnits(
  startDate: string,
  endDate: string,
  rentalType: string
) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start) {
    return 0;
  }

  const days = Math.floor((end.getTime() - start.getTime()) / 86_400_000) + 1;

  if (rentalType === "Weekly") return Math.ceil(days / 7);
  if (rentalType === "Monthly") return Math.ceil(days / 30);
  return days;
}

export default function BookingForm({
  equipmentId,
  price,
  rentalType,
  availableQuantity,
}: {
  equipmentId: string;
  price: number;
  rentalType: string;
  availableQuantity: number;
}) {
  const router = useRouter();

  const [form, setForm] = useState({
    startDate: "",
    endDate: "",
    quantity: "1",
    phone: "",
    address: "",
    note: "",
  });
  const [saving, setSaving] = useState(false);

  const update =
    (field: keyof typeof form) =>
    (
      event: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement
      >
    ) => {
      setForm((current) => ({ ...current, [field]: event.target.value }));
    };

  const units = calculateUnits(form.startDate, form.endDate, rentalType);
  const quantity = Number(form.quantity) || 0;
  const total = units * price * quantity;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (availableQuantity < 1) {
      toast.error("This equipment is currently not available.");
      return;
    }

    if (!form.startDate || !form.endDate) {
      toast.error("Please choose the start and end dates.");
      return;
    }

    if (units < 1) {
      toast.error("End date must be after the start date.");
      return;
    }

    if (quantity < 1 || quantity > availableQuantity) {
      toast.error(`Quantity must be between 1 and ${availableQuantity}.`);
      return;
    }

    if (!form.phone.trim() || !form.address.trim()) {
      toast.error("Please add a phone number and delivery address.");
      return;
    }

    setSaving(true);

    try {
      await apiFetch("/api/bookings", {
        method: "POST",
        body: JSON.stringify({
          equipmentId,
          startDate: form.startDate,
          endDate: form.endDate,
          quantity,
          phone: form.phone.trim(),
          address: form.address.trim(),
          note: form.note.trim(),
        }),
      });

      toast.success("Booking request sent! The owner will review it.");
      router.push("/dashboard/rentals");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not send the booking"
      );
    } finally {
      setSaving(false);
    }
  };

  if (availableQuantity < 1) {
    return (
      <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
        This equipment is currently booked. Check back later.
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
    >
      <h3 className="flex items-center gap-2 text-base font-bold text-slate-900">
        <CalendarDays size={17} className="text-blue-600" />
        Book this equipment
      </h3>
      <p className="mt-1 text-xs text-slate-500">
        {availableQuantity} available · ৳{price.toLocaleString("en-BD")} per{" "}
        {rentalType.toLowerCase()}
      </p>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="startDate" className={labelClass}>
            Start date
          </label>
          <input
            id="startDate"
            type="date"
            value={form.startDate}
            onChange={update("startDate")}
            className={inputClass}
            required
          />
        </div>

        <div>
          <label htmlFor="endDate" className={labelClass}>
            End date
          </label>
          <input
            id="endDate"
            type="date"
            value={form.endDate}
            onChange={update("endDate")}
            className={inputClass}
            required
          />
        </div>

        <div>
          <label htmlFor="quantity" className={labelClass}>
            Quantity
          </label>
          <input
            id="quantity"
            type="number"
            min={1}
            max={availableQuantity}
            value={form.quantity}
            onChange={update("quantity")}
            className={inputClass}
            required
          />
        </div>

        <div>
          <label htmlFor="phone" className={labelClass}>
            Phone
          </label>
          <input
            id="phone"
            value={form.phone}
            onChange={update("phone")}
            placeholder="+880 1XXX-XXXXXX"
            className={inputClass}
            required
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="address" className={labelClass}>
            Delivery address
          </label>
          <input
            id="address"
            value={form.address}
            onChange={update("address")}
            placeholder="House, road, city"
            className={inputClass}
            required
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="note" className={labelClass}>
            Note (optional)
          </label>
          <textarea
            id="note"
            value={form.note}
            onChange={update("note")}
            rows={2}
            placeholder="Anything the owner should know?"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </div>

      {/* Total */}
      <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
        <div>
          <p className="text-xs text-slate-400">Estimated total</p>
          <p className="text-xs text-slate-500">
            {units > 0 && quantity > 0
              ? `${units} × ৳${price.toLocaleString("en-BD")} × ${quantity}`
              : "Choose dates to see the total"}
          </p>
        </div>
        <p className="text-xl font-bold text-slate-900">
          ৳{total.toLocaleString("en-BD")}
        </p>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {saving ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Sending request…
          </>
        ) : (
          <>
            <Send size={16} />
            Send booking request
          </>
        )}
      </button>

      <p className="mt-2 text-center text-[11px] text-slate-400">
        No payment now — you pay the owner after approval.
      </p>
    </form>
  );
}
