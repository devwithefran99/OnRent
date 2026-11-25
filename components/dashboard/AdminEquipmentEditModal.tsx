"use client";

import { useEffect, useState } from "react";
import { Loader2, Save, X } from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import {
  categories,
  rentalTypes,
  type Equipment,
} from "@/lib/data/equipment";

const inputClass =
  "h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20";

const labelClass = "mb-2 block text-sm font-semibold text-slate-700";

type FormState = {
  name: string;
  category: string;
  location: string;
  price: string;
  rentalType: string;
  quantity: string;
  availableQuantity: string;
  condition: string;
  brand: string;
  model: string;
  image: string;
  description: string;
  terms: string;
  status: string;
};

function toForm(item: Equipment): FormState {
  return {
    name: item.name ?? "",
    category: item.category ?? "",
    location: item.location ?? "",
    price: String(item.price ?? 0),
    rentalType: item.rentalType ?? "Daily",
    quantity: String(item.quantity ?? item.availableQuantity ?? 0),
    availableQuantity: String(item.availableQuantity ?? item.quantity ?? 0),
    condition: item.condition ?? "",
    brand: item.brand ?? "",
    model: item.model ?? "",
    image: item.image ?? "",
    description: item.description ?? "",
    terms: item.terms ?? "",
    status: item.status ?? "pending",
  };
}

export default function AdminEquipmentEditModal({
  item,
  onClose,
  onSaved,
}: {
  item: Equipment;
  onClose: () => void;
  onSaved: (updates: Partial<Equipment>) => void;
}) {
  const [form, setForm] = useState<FormState>(() => toForm(item));
  const [saving, setSaving] = useState(false);

  // Close on Escape and lock page scroll while the modal is open.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  const update =
    (field: keyof FormState) =>
    (
      event: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      setForm((current) => ({ ...current, [field]: event.target.value }));
    };

  const categoryOptions = Array.from(
    new Set([...categories, item.category].filter(Boolean))
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const price = Number(form.price);
    const quantity = Number(form.quantity);
    const availableQuantity = Number(form.availableQuantity);

    if (!form.name.trim() || !form.location.trim()) {
      toast.error("Equipment name and location are required.");
      return;
    }

    if (!Number.isFinite(price) || price < 0) {
      toast.error("Price must be a positive number.");
      return;
    }

    if (!Number.isFinite(quantity) || quantity < 0) {
      toast.error("Quantity must be a positive number.");
      return;
    }

    if (
      !Number.isFinite(availableQuantity) ||
      availableQuantity < 0 ||
      availableQuantity > quantity
    ) {
      toast.error("Available quantity must be between 0 and the total quantity.");
      return;
    }

    if (!/^https?:\/\//i.test(form.image.trim())) {
      toast.error("Image must be a valid link starting with http.");
      return;
    }

    setSaving(true);

    const payload = {
      name: form.name.trim(),
      category: form.category,
      location: form.location.trim(),
      price,
      rentalType: form.rentalType as Equipment["rentalType"],
      quantity,
      availableQuantity,
      condition: form.condition.trim(),
      brand: form.brand.trim(),
      model: form.model.trim(),
      image: form.image.trim(),
      description: form.description.trim(),
      terms: form.terms.trim(),
      status: form.status as Equipment["status"],
    };

    try {
      await apiFetch(`/api/admin/equipment/${item.id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });

      toast.success(`"${payload.name}" was updated`);
      onSaved({ ...payload, available: availableQuantity > 0 });
      onClose();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not update this listing"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label={`Edit ${item.name}`}
      onClick={onClose}
    >
      <div
        className="my-6 w-full max-w-3xl rounded-2xl border border-slate-200 bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4 sm:px-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Edit listing</h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Update any field. Changes go live immediately for approved items.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-5 sm:px-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="admin-name" className={labelClass}>
                Equipment name
              </label>
              <input
                id="admin-name"
                value={form.name}
                onChange={update("name")}
                className={inputClass}
                required
              />
            </div>

            <div>
              <label htmlFor="admin-category" className={labelClass}>
                Category
              </label>
              <select
                id="admin-category"
                value={form.category}
                onChange={update("category")}
                className={inputClass}
              >
                {categoryOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="admin-location" className={labelClass}>
                Location
              </label>
              <input
                id="admin-location"
                value={form.location}
                onChange={update("location")}
                className={inputClass}
                required
              />
            </div>

            <div>
              <label htmlFor="admin-price" className={labelClass}>
                Rental price (৳)
              </label>
              <input
                id="admin-price"
                type="number"
                min={0}
                value={form.price}
                onChange={update("price")}
                className={inputClass}
                required
              />
            </div>

            <div>
              <label htmlFor="admin-rental-type" className={labelClass}>
                Rental type
              </label>
              <select
                id="admin-rental-type"
                value={form.rentalType}
                onChange={update("rentalType")}
                className={inputClass}
              >
                {rentalTypes.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="admin-quantity" className={labelClass}>
                Total quantity
              </label>
              <input
                id="admin-quantity"
                type="number"
                min={0}
                value={form.quantity}
                onChange={update("quantity")}
                className={inputClass}
                required
              />
            </div>

            <div>
              <label htmlFor="admin-available" className={labelClass}>
                Available quantity
              </label>
              <input
                id="admin-available"
                type="number"
                min={0}
                value={form.availableQuantity}
                onChange={update("availableQuantity")}
                className={inputClass}
                required
              />
            </div>

            <div>
              <label htmlFor="admin-condition" className={labelClass}>
                Condition
              </label>
              <input
                id="admin-condition"
                value={form.condition}
                onChange={update("condition")}
                placeholder="Excellent, Good, Used…"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="admin-brand" className={labelClass}>
                Brand
              </label>
              <input
                id="admin-brand"
                value={form.brand}
                onChange={update("brand")}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="admin-model" className={labelClass}>
                Model
              </label>
              <input
                id="admin-model"
                value={form.model}
                onChange={update("model")}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="admin-status" className={labelClass}>
                Status
              </label>
              <select
                id="admin-status"
                value={form.status}
                onChange={update("status")}
                className={inputClass}
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="admin-image" className={labelClass}>
                Image URL
              </label>
              <input
                id="admin-image"
                value={form.image}
                onChange={update("image")}
                placeholder="https://…"
                className={inputClass}
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="admin-description" className={labelClass}>
                Description
              </label>
              <textarea
                id="admin-description"
                value={form.description}
                onChange={update("description")}
                rows={3}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="admin-terms" className={labelClass}>
                Rental terms &amp; conditions
              </label>
              <textarea
                id="admin-terms"
                value={form.terms}
                onChange={update("terms")}
                rows={3}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <Save size={16} />
                  Save changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
