"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, Loader2, Send, X } from "lucide-react";
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

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    startDate: "",
    endDate: "",
    quantity: "1",
    phone: "",
    address: "",
    note: "",
  });
  const [saving, setSaving] = useState(false);

  // Close on Escape and lock page scroll while the modal is open.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !saving) setOpen(false);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, saving]);

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
      setOpen(false);
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
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-600/20 transition hover:bg-orange-700"
      >
        <CalendarDays size={17} />
        Book Now
      </button>

      <p className="mt-2 text-center text-xs text-slate-500">
        {availableQuantity} available · ৳{price.toLocaleString("en-BD")} per{" "}
        {rentalType.toLowerCase()}
      </p>

      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-label="Book this equipment"
          onClick={() => !saving && setOpen(false)}
        >
          <div
            className="my-6 w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4">
              <div>
                <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                  <CalendarDays size={18} className="text-blue-600" />
                  Book this equipment
                </h2>
                <p className="mt-0.5 text-xs text-slate-500">
                  {availableQuantity} available · ৳
                  {price.toLocaleString("en-BD")} per {rentalType.toLowerCase()}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={saving}
                aria-label="Close booking form"
                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:cursor-not-allowed"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-5 py-5">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor="startDate" className={labelClass}>
                    Rental start date
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
                    Rental end date
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
                    Required quantity
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
                    Contact number
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
                    Additional notes (optional)
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
                    Confirm booking request
                  </>
                )}
              </button>

              <p className="mt-2 text-center text-[11px] text-slate-400">
                No payment now — you complete payment after the owner confirms.
              </p>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
